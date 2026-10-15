import "server-only"; 

import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "./generated/prisma/client";

const connectionString = `${process.env.DATABASE_URL}`;

const adapter = new PrismaPg({ connectionString, connectionTimeoutMillis: 30000 });
const prisma = new PrismaClient({ adapter });

export { prisma };