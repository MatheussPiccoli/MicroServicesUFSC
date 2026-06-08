export const SERVICES = {
  lockers:   process.env.LOCKERS_SERVICE_URL   || "http://localhost:3005",
  residents: process.env.RESIDENTS_SERVICE_URL || "http://localhost:3002",
  deliveries: process.env.DELIVERIES_SERVICE_URL || "http://localhost:3003",
  logging:   process.env.LOGGING_SERVICE_URL   || "http://localhost:3004",
  abertura:  process.env.ABERTURA_SERVICE_URL  || "http://localhost:3006",
};
