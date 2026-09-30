import { z } from "zod";

export const signupSchema = z.object({
  name: z.string().min(2, "Name is too short").max(80),
  email: z.string().email("Enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const loginSchema = z.object({
  email: z.string().email("Enter a valid email"),
  password: z.string().min(1, "Password is required"),
});

export const planTripSchema = z.object({
  from: z.string().min(2),
  to: z.string().min(2),
  arrivalTime: z.string().optional().nullable(),
  halts: z.array(z.string()).optional().default([]),
});

export const reportEventSchema = z.object({
  kind: z.enum(["exam", "rally", "crowd", "other"]),
  title: z.string().min(3),
  detail: z.string().min(3),
  severity: z.enum(["low", "medium", "high"]).default("medium"),
  etaImpactMins: z.number().min(0).max(180).default(5),
  lng: z.number(),
  lat: z.number(),
  radiusMeters: z.number().min(100).max(20000).optional(),
});

export const updatePositionSchema = z.object({
  lng: z.number(),
  lat: z.number(),
  bearing: z.number().min(0).max(360).optional(),
  status: z.enum(["on-time", "running-late", "running-early"]).optional(),
  tripId: z.string().optional().nullable(),
});

export const sendMessageSchema = z.object({
  vehicleId: z.string().min(1),
  text: z.string().min(1).max(500),
});

export const createHaltSchema = z.object({
  place: z.string().min(2),
  type: z.enum(["tea", "dining", "hotel", "fuel", "restroom"]),
  location: z.string().optional().default(""),
  order: z.string().optional().default(""),
});

export const createRideEntrySchema = z.object({
  routeLabel: z.string().min(3),
  fromCoords: z.object({ lng: z.number(), lat: z.number() }).optional(),
  toCoords: z.object({ lng: z.number(), lat: z.number() }).optional(),
  departureWindowStart: z.string(),
  departureWindowEnd: z.string(),
  seatsOffered: z.number().min(0).max(6).default(0),
});

export const communityRequestSchema = z.object({
  text: z.string().min(3).max(280),
});

export const updateProfileSchema = z.object({
  name: z.string().min(2).max(80).optional(),
  homeCity: z.string().optional(),
  vehicle: z
    .object({
      nickname: z.string().optional(),
      type: z.enum(["car", "scooter", "auto", "bus"]).optional(),
      registration: z.string().optional(),
      label: z.string().optional(),
    })
    .optional(),
  privacy: z
    .object({
      shareLocationOnActiveTrip: z.boolean().optional(),
      encryptMessages: z.boolean().optional(),
    })
    .optional(),
});
