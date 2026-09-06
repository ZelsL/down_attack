import { rateLimit } from "express-rate-limit";

export const garmothRateLimit = rateLimit({
  windowMs: 5 * 1000,
  max: 1,
  message: "5 seconds delay between requests",
  standardHeaders: "draft-8",
  legacyHeaders: false,
  ipv6Subnet: 52,
});

export const generalRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 300, // Limit each IP to 300 requests per `window` (here, per 15 minutes).
  standardHeaders: "draft-8", // draft-6: `RateLimit-*` headers; draft-7 & draft-8: combined `RateLimit` header
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers.
  ipv6Subnet: 56, // Set to 60 or 64 to be less aggressive, or 52 or 48 to be more aggressive
  // store: ... , // Redis, Memcached, etc. See below.
});
