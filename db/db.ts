import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as appSchema from "@/db/schema/schema";
import * as authSchema from "@/db/schema/auth-schema";

const sql = neon(process.env.DATABASE_URL!);

// Merge app + auth schemas into one instance so the whole app shares
// a single connection pool instead of each module creating its own.
export const db = drizzle(sql, { schema: { ...appSchema, ...authSchema } });
