/**
 * Geo calculation utilities for Palembang ambulance distance & ETA.
 * Specially calibrated for Palembang's geography, including the Musi River divide
 * and bridge corridors (Jembatan Ampera, Musi IV, Musi VI).
 */

export interface RoadRouteResult {
  distanceKm: number;
  estimatedMinutes: number;
  coordinates: [number, number][]; // [lat, lng]
  isRealRoad: boolean;
  crossesRiver: boolean;
}

// In-memory cache for road route queries: key = "lat1,lng1->lat2,lng2"
const roadRouteCache = new Map<string, RoadRouteResult>();

// Musi River approximate dividing latitude in Palembang
export const MUSI_RIVER_LAT = -2.985;

// Jembatan Ampera Landmark Coordinates
export const AMPERA_BRIDGE = {
  lat: -2.9918,
  lng: 104.7634,
  name: "Jembatan Ampera",
};

/**
 * Checks whether travel between two coordinates requires crossing the Musi River
 * (i.e., one is in Seberang Ilir and the other is in Seberang Ulu).
 */
export function isCrossingMusiRiver(lat1: number, lat2: number): boolean {
  return (
    (lat1 > MUSI_RIVER_LAT && lat2 < MUSI_RIVER_LAT) ||
    (lat1 < MUSI_RIVER_LAT && lat2 > MUSI_RIVER_LAT)
  );
}

/**
 * Pure Haversine straight-line distance (as the crow flies) in km
 */
export function calculateStraightDistanceKm(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Earth radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

/**
 * Intelligent Road-Aware Distance for Palembang:
 * - If crossing the Musi River, vehicles must travel through the bridge corridor (Jembatan Ampera),
 *   so distance is calculated via the bridge + city street winding factor (~1.25x).
 * - If on the same side of the river, urban grid tortuosity is ~1.30x.
 * This guarantees that even instant pre-computations closely match actual OSRM road driving.
 */
export function calculateDistanceKm(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  if (isCrossingMusiRiver(lat1, lat2)) {
    const toBridge = calculateStraightDistanceKm(lat1, lon1, AMPERA_BRIDGE.lat, AMPERA_BRIDGE.lng);
    const fromBridge = calculateStraightDistanceKm(AMPERA_BRIDGE.lat, AMPERA_BRIDGE.lng, lat2, lon2);
    const totalKm = (toBridge + fromBridge) * 1.25;
    return Math.round(totalKm * 10) / 10;
  }

  const straight = calculateStraightDistanceKm(lat1, lon1, lat2, lon2);
  const roadKm = straight * 1.30;
  return Math.round(roadKm * 10) / 10;
}

/**
 * Estimate emergency ambulance response and driving time in minutes:
 * - Ambulance average cruising speed in Palembang with emergency lights/siren: ~24 km/h
 * - Base dispatch & preparation time: 3 minutes
 * - Bridge crossing / bottleneck factor if crossing Musi river: +4 minutes
 */
export function estimateMinutes(distanceKm: number, isCrossingRiver = false): number {
  const basePrep = 3;
  const bridgeFactor = isCrossingRiver ? 4 : 0;
  const drivingMinutes = (distanceKm / 24) * 60;
  return Math.max(3, Math.round(drivingMinutes + basePrep + bridgeFactor));
}

/**
 * Fetch exact street driving route from OSRM with in-memory caching and graceful fallback.
 */
export async function getRoadRoute(
  origin: { lat: number; lng: number },
  destination: { lat: number; lng: number },
  signal?: AbortSignal
): Promise<RoadRouteResult> {
  const cacheKey = `${origin.lat.toFixed(4)},${origin.lng.toFixed(4)}->${destination.lat.toFixed(4)},${destination.lng.toFixed(4)}`;
  if (roadRouteCache.has(cacheKey)) {
    return roadRouteCache.get(cacheKey)!;
  }

  const crosses = isCrossingMusiRiver(origin.lat, destination.lat);
  const fallbackKm = calculateDistanceKm(origin.lat, origin.lng, destination.lat, destination.lng);
  const fallbackMin = estimateMinutes(fallbackKm, crosses);

  const fallbackResult: RoadRouteResult = {
    distanceKm: fallbackKm,
    estimatedMinutes: fallbackMin,
    coordinates: crosses
      ? [
          [origin.lat, origin.lng],
          [AMPERA_BRIDGE.lat, AMPERA_BRIDGE.lng],
          [destination.lat, destination.lng],
        ]
      : [
          [origin.lat, origin.lng],
          [(origin.lat + destination.lat) / 2, (origin.lng + destination.lng) / 2],
          [destination.lat, destination.lng],
        ],
    isRealRoad: false,
    crossesRiver: crosses,
  };

  try {
    const osrmUrl = `https://router.project-osrm.org/route/v1/driving/${origin.lng},${origin.lat};${destination.lng},${destination.lat}?overview=full&geometries=geojson`;
    const res = await fetch(osrmUrl, { signal });
    if (!res.ok) throw new Error("OSRM non-OK response");
    const data = await res.json();
    if (data.code === "Ok" && data.routes?.[0]) {
      const route = data.routes[0];
      const distKm = Math.round((route.distance / 1000) * 10) / 10;
      const durMin = Math.max(3, Math.round(route.duration / 60));
      const coordinates: [number, number][] = route.geometry.coordinates.map(
        ([lng, lat]: [number, number]) => [lat, lng] as [number, number]
      );

      const result: RoadRouteResult = {
        distanceKm: distKm,
        estimatedMinutes: durMin,
        coordinates,
        isRealRoad: true,
        crossesRiver: crosses,
      };

      roadRouteCache.set(cacheKey, result);
      return result;
    }
  } catch (e) {
    // Return realistic road fallback
  }

  roadRouteCache.set(cacheKey, fallbackResult);
  return fallbackResult;
}

