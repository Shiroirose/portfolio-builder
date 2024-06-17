/** @type { import("drizzle-kit").Config } */
export default {
    schema: "./utils/schema.jsx",
    dialect: 'postgresql',
    // driver: 'pg',
    dbCredentials: {
    url: NEXT_PUBLIC_DB_URL,
    }
  };