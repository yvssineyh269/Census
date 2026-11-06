// Crée le premier compte admin (l'inscription publique est désactivée).
// Usage : node scripts/create-admin.mjs <email> <username> <mot-de-passe> [nom]
import "dotenv/config";
import { randomUUID } from "node:crypto";
import pg from "pg";
import { hashPassword } from "better-auth/crypto";

const [email, username, password, name = username] = process.argv.slice(2);

if (!email || !username || !password) {
  console.error("Usage : node scripts/create-admin.mjs <email> <username> <mot-de-passe> [nom]");
  process.exit(1);
}
if (password.length < 8) {
  console.error("Le mot de passe doit contenir au moins 8 caractères.");
  process.exit(1);
}

const client = new pg.Client({ connectionString: process.env.DATABASE_URL });
await client.connect();

try {
  const userId = randomUUID();
  const hash = await hashPassword(password);

  await client.query("BEGIN");
  await client.query(
    `INSERT INTO "user" (id, name, email, "emailVerified", username, "displayUsername", role, "createdAt", "updatedAt")
     VALUES ($1, $2, $3, true, $4, $5, 'admin', now(), now())`,
    [userId, name, email.toLowerCase(), username.toLowerCase(), username],
  );
  // Compte "credential" : c'est là que better-auth stocke le mot de passe
  await client.query(
    `INSERT INTO account (id, "accountId", "providerId", "userId", password, "createdAt", "updatedAt")
     VALUES ($1, $2, 'credential', $2, $3, now(), now())`,
    [randomUUID(), userId, hash],
  );
  await client.query("COMMIT");

  console.log(`Admin créé : ${email} (${username})`);
} catch (error) {
  await client.query("ROLLBACK");
  console.error("Échec :", error.message);
  process.exitCode = 1;
} finally {
  await client.end();
}
