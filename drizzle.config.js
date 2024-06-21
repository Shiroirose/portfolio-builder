// /** @type { import("drizzle-kit").Config } */

// export default {
//     schema: "./utils/schema.jsx",
//     dialect: 'postgresql',
//     dbCredentials: {
//        url: process.env.NEXT_PUBLIC_DB_URL,
//     }
//   };


  // drizzle.config.js
require('dotenv').config({ path: '.env.local' });

console.log('NEXT_PUBLIC_DB_URL:', process.env.NEXT_PUBLIC_DB_URL);  // Debugging line

const { NEXT_PUBLIC_DB_URL } = process.env;

if (!NEXT_PUBLIC_DB_URL) {
  throw new Error("NEXT_PUBLIC_DB_URL is not defined");
}

module.exports = {
  schema: './utils/schema.jsx',
  dialect: 'postgresql',
  dbCredentials: {
    url: NEXT_PUBLIC_DB_URL,
  },
};
