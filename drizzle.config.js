/** @type { import("drizzle-kit").Config } */
export default {
    schema: "./utils/schema.jsx",
    dialect: 'postgresql',
    // driver: 'pg',
    dbCredentials: {
    url: "postgresql://neondb_owner:QObeKx5B8dsP@ep-silent-fire-a148xdvw.ap-southeast-1.aws.neon.tech/portfolio-builder?sslmode=require",
    }
  };