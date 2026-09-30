import "dotenv/config";

function required(name, fallback) {
  const value = process.env[name] ?? fallback;
  if (value === undefined) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

export const env = {
  nodeEnv: process.env.NODE_ENV || "development",
  port: Number(process.env.PORT || 5000),
  mongoUri: required("MONGO_URI", "mongodb://127.0.0.1:27017/Vikas"),
  jwtSecret: required("JWT_SECRET", "dev-only-insecure-secret-change-me"),
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || "7d",
  clientOrigin: process.env.CLIENT_ORIGIN || "http://localhost:5173",
  // Public demo server, free, no key — fine for dev/small projects. Point
  // this at your own OSRM instance if you outgrow it (see README).
  osrmBaseUrl: process.env.OSRM_BASE_URL || "https://router.project-osrm.org",
};

export const isProd = env.nodeEnv === "production";
