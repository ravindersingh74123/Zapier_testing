"use strict";
// import { PrismaClient } from "./prisma/generated/prisma/client";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
// const prismaClientSingleton = () => {
//   return new PrismaClient()
// }
// declare global {
//   var prismaGlobal: undefined | ReturnType<typeof prismaClientSingleton>
// }
// const prisma: ReturnType<typeof prismaClientSingleton> = globalThis.prismaGlobal ?? prismaClientSingleton()
// export default prisma
// if (process.env.NODE_ENV !== 'production') globalThis.prismaGlobal = prisma
const client_1 = require("../generated/prisma/client");
const adapter_pg_1 = require("@prisma/adapter-pg");
const pg_1 = __importDefault(require("pg"));
const dotenv_1 = __importDefault(require("dotenv"));
// Load environment variables
dotenv_1.default.config();
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
const pool = new pg_1.default.Pool({
    connectionString: cleanConnectionString,
    ssl: {
        rejectUnauthorized: false
    },
    max: 10, // Maximum number of clients in the pool
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 10000, // Increased timeout
});
const adapter = new adapter_pg_1.PrismaPg(pool);
const prismaClientSingleton = () => {
    return new client_1.PrismaClient({
        adapter,
    });
};
const prisma = (_a = globalThis.prismaGlobal) !== null && _a !== void 0 ? _a : prismaClientSingleton();
exports.default = prisma;
if (process.env.NODE_ENV !== 'production')
    globalThis.prismaGlobal = prisma;
