import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as appSchema from "@/db/schema/schema";
import * as authSchema from "@/db/schema/auth-schema";

const sql = neon(process.env.DATABASE_URL!);

export const db = drizzle(sql, { schema: { ...appSchema, ...authSchema } });
