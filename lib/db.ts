import "server-only"; 

import "dotenv/config";
import dns from "node:dns";
import net from "node:net";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "./generated/prisma/client";

// IPv6 injoignable sur certains réseaux + latence élevée vers Neon :
// Node abandonne chaque adresse après 250 ms par défaut (ETIMEDOUT).
dns.setDefaultResultOrder("ipv4first");
net.setDefaultAutoSelectFamilyAttemptTimeout(2000);

const connectionString = `${process.env.DATABASE_URL}`;

const adapter = new PrismaPg({ connectionString, connectionTimeoutMillis: 30000 });
const prisma = new PrismaClient({ adapter });

export { prisma };