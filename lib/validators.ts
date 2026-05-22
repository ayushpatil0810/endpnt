import { z } from 'zod';
import { NextResponse } from 'next/server';

// ── Links ──────────────────────────────────────────────────────────────────

export const CreateLinkSchema = z.object({
	title: z.string().min(1, 'Title is required').max(100, 'Title must be 100 characters or fewer'),
	url: z.url('Must be a valid URL').max(2048, 'URL is too long'),
});

export const UpdateLinkSchema = z.object({
	title: z.string().min(1).max(100).optional(),
	url: z.url('Must be a valid URL').max(2048).optional(),
	display_order: z.number().int().min(0).optional(),
});

// ── Projects ───────────────────────────────────────────────────────────────

export const CreateProjectSchema = z.object({
	title: z.string().min(1, 'Title is required').max(100, 'Title must be 100 characters or fewer'),
	description: z.string().max(500, 'Description must be 500 characters or fewer').optional(),
	liveUrl: z.url('Must be a valid URL').max(2048).optional().or(z.literal('')),
	githubUrl: z.url('Must be a valid URL').max(2048).optional().or(z.literal('')),
	techStack: z.array(z.string().max(50)).max(20, 'Too many tech stack entries').optional(),
});

export const UpdateProjectSchema = CreateProjectSchema.partial();

// ── Profile ────────────────────────────────────────────────────────────────

export const UpdateProfileSchema = z.object({
	bio: z.string().max(300, 'Bio must be 300 characters or fewer').optional(),
	theme: z.enum(['glassmorphism', 'neo-brutalism', 'neumorphism', 'claymorphism']).optional(),
	layout: z.string().optional(),
	githubUsername: z.string().max(39).optional(),
	leetcodeUsername: z.string().max(100).optional(),
	devtoUsername: z.string().max(100).optional(),
	mediumUsername: z.string().max(100).optional(),
	hashnodeUsername: z.string().max(100).optional(),
	seoTitle: z.string().max(60, 'SEO title should be 60 characters or fewer').optional(),
	seoDescription: z
		.string()
		.max(160, 'SEO description should be 160 characters or fewer')
		.optional(),
});

// ── Helper ──────────────────────────────────────────────────────────────────

/**
 * Returns a 400 JSON response with Zod validation errors formatted as a
 * flat record of { field: message[] }.
 */
export function validationError(error: z.ZodError): Response {
	return NextResponse.json(
		{ error: 'Validation failed', issues: error.flatten().fieldErrors },
		{ status: 400 }
	);
}
