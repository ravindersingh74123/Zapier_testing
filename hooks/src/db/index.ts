// import { PrismaClient } from "./prisma/generated/prisma/client";

// const prismaClientSingleton = () => {
//   return new PrismaClient()
// }

// declare global {
//   var prismaGlobal: undefined | ReturnType<typeof prismaClientSingleton>
// }

// const prisma: ReturnType<typeof prismaClientSingleton> = globalThis.prismaGlobal ?? prismaClientSingleton()

// export default prisma

// if (process.env.NODE_ENV !== 'production') globalThis.prismaGlobal = prisma

import { PrismaClient } from "../generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

// Get connection string with fallback
const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL is not defined in environment variables");
}

// Remove problematic SSL params
const cleanConnectionString = connectionString
  .replace('?sslmode=require&channel_binding=require', '')
  .replace('sslmode=require&channel_binding=require', '')
  .replace('sslmode=require', '')
  .replace('channel_binding=require', '');

// Create pg Pool with optimized configuration for Neon
const pool = new pg.Pool({
  connectionString: cleanConnectionString,
  ssl: {
    rejectUnauthorized: false
  },
  max: 10, // Maximum number of clients in the pool
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 10000, // Increased timeout
});

const adapter = new PrismaPg(pool);

const prismaClientSingleton = () => {
  return new PrismaClient({
    adapter,
  });
}

declare global {
  var prismaGlobal: undefined | ReturnType<typeof prismaClientSingleton>
}

const prisma: ReturnType<typeof prismaClientSingleton> = globalThis.prismaGlobal ?? prismaClientSingleton()

export default prisma

if (process.env.NODE_ENV !== 'production') globalThis.prismaGlobal = prisma