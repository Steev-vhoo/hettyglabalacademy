// Creates (or resets the password of) the admin account.
// Usage: set ADMIN_EMAIL, ADMIN_PASSWORD (and optionally ADMIN_NAME) in .env.local, then `npm run create-admin`.
import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const { MONGODB_URI, ADMIN_EMAIL, ADMIN_PASSWORD, ADMIN_NAME = "Harriet K" } = process.env;
if (!MONGODB_URI || !ADMIN_EMAIL || !ADMIN_PASSWORD) {
  console.error("Set MONGODB_URI, ADMIN_EMAIL and ADMIN_PASSWORD in .env.local first.");
  process.exit(1);
}
if (ADMIN_PASSWORD.length < 12) {
  console.error("Use an admin password of at least 12 characters.");
  process.exit(1);
}

await mongoose.connect(MONGODB_URI);
const users = mongoose.connection.collection("users");
const email = ADMIN_EMAIL.trim().toLowerCase();
const passwordHash = await bcrypt.hash(ADMIN_PASSWORD, 12);
await users.updateOne(
  { email },
  { $set: { name: ADMIN_NAME, email, passwordHash, role: "admin", updatedAt: new Date() }, $setOnInsert: { createdAt: new Date(), interests: [] } },
  { upsert: true },
);
await users.createIndex({ email: 1 }, { unique: true });
console.log(`Admin ready: ${email}. Sign in at /login. Remove ADMIN_PASSWORD from .env.local now.`);
await mongoose.disconnect();
