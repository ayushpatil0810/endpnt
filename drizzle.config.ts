import { defineConfig } from 'drizzle-kit';

export default defineConfig({
	schema: ['./db/schema/schema.ts', './db/schema/auth-schema.ts'],
	out: './drizzle',
	dialect: 'postgresql',
	dbCredentials: {
		url: process.env.DATABASE_URL!,
	},
});
