import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("❌ DATABASE_URL is missing in .env");
}

// 1. Create a connection pool using the 'pg' library
const pool = new Pool({ connectionString });

// 2. Initialize the adapter
const adapter = new PrismaPg(pool);

declare global {
  var prisma: PrismaClient | undefined;
}

// 3. Pass the adapter to the constructor
export const prisma =
  global.prisma ??
  new PrismaClient({
    adapter,
  });

if (process.env.NODE_ENV !== "production") {
  global.prisma = prisma;
}
