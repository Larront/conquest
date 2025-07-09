import { z } from 'zod/v4';

// User Creation Schema
export const userCreationSchema = z.object({
	username: z
		.string()
		.min(3, 'Username must be at least 3 characters')
		.max(20, 'Username cannot exceed 20 characters')
		.regex(/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, and underscores')
		.refine((username) => {
			// Check for prohibited usernames
			const prohibited = ['admin', 'root', 'system', 'null', 'undefined', 'test'];
			return !prohibited.includes(username.toLowerCase());
		}, 'Username is not allowed'),
	email: z.email({ pattern: z.regexes.unicodeEmail }),
	password: z.string().min(8, 'Password must be at least 8 characters')
});

// Battle Upload Validation Schema
export const battleUploadSchema = z
	.object({
		selectedPlanet: z.coerce.number().min(1, 'Planet selection is required'),
		battleType: z.enum(['Combat Patrol', 'Incursion', 'Strike Force', 'Onslaught'], {
			error: () => ({ message: 'Invalid battle type' })
		}),
		points: z.coerce
			.number()
			.min(500, 'Points must be at least 500')
			.max(2000, 'Points cannot exceed 2000'),
		attacker: z.coerce.number().min(1, 'Invalid attacker selection'),
		defender: z.coerce.number().min(1, 'Invalid defender selection'),
		attackerPoints: z.coerce
			.number()
			.min(0, 'Attacker points cannot be negative')
			.max(100, 'Attacker points cannot exceed 100'),
		defenderPoints: z.coerce
			.number()
			.min(0, 'Defender points cannot be negative')
			.max(100, 'Defender points cannot exceed 100'),
		result: z.enum(['Attacker Victory', 'Defender Victory', 'Draw'], {
			error: () => ({ message: 'Invalid battle result' })
		}),
		description: z.string().max(1000, 'Description cannot exceed 1000 characters').optional(),
		battleDate: z.string().refine((dateStr) => {
			const date = new Date(new Date(dateStr).toDateString());
			const now = new Date(new Date().toDateString());
			console.log(date, now);
			return date <= now;
		}, 'Battle date must not be in the future')
	})
	.refine((data) => data.attacker !== data.defender, {
		message: 'Attacker and defender must be different players',
		path: ['defender']
	})
	.refine(
		(data) => {
			// If it's a draw, both players should have equal points
			if (data.result === 'Draw') {
				return data.attackerPoints === data.defenderPoints;
			}
			// If attacker victory, attacker should have more points
			if (data.result === 'Attacker Victory') {
				return data.attackerPoints > data.defenderPoints;
			}
			// If defender victory, defender should have more points
			if (data.result === 'Defender Victory') {
				return data.defenderPoints > data.attackerPoints;
			}
			return true;
		},
		{
			message: 'Battle result must match the point totals',
			path: ['result']
		}
	);

// User Profile Update Validation Schema
export const userUpdateSchema = z.object({
	username: z
		.string()
		.min(3, 'Username must be at least 3 characters')
		.max(20, 'Username cannot exceed 20 characters')
		.regex(/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, and underscores')
		.refine((username) => {
			// Check for prohibited usernames
			const prohibited = ['admin', 'root', 'system', 'null', 'undefined', 'test'];
			return !prohibited.includes(username.toLowerCase());
		}, 'Username is not allowed')
});

// Password Update Validation Schema
export const passwordUpdateSchema = z
	.object({
		currentPassword: z.string().min(1, 'Current password is required'),
		newPassword: z
			.string()
			.min(8, 'Password must be at least 8 characters')
			.regex(
				/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
				'Password must contain at least one lowercase letter, one uppercase letter, and one number'
			),
		confirmPassword: z.string()
	})
	.refine((data) => data.newPassword === data.confirmPassword, {
		message: 'New password and confirmation must match',
		path: ['confirmPassword']
	});

// Password Reset Request Validation Schema
export const passwordResetRequestSchema = z.object({
	email: z.email({ pattern: z.regexes.unicodeEmail })
});

// Password Reset Confirmation Validation Schema
export const passwordResetConfirmSchema = z
	.object({
		newPassword: z
			.string()
			.min(8, 'Password must be at least 8 characters')
			.regex(
				/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
				'Password must contain at least one lowercase letter, one uppercase letter, and one number'
			),
		confirmPassword: z.string()
	})
	.refine((data) => data.newPassword === data.confirmPassword, {
		message: 'New password and confirmation must match',
		path: ['confirmPassword']
	});

// Faction Management Validation Schema
export const factionManagementSchema = z.object({
	factionName: z.string().min(1, 'Faction type is required'),
	factionDisplayName: z
		.string()
		.min(1, 'Display name is required')
		.max(50, 'Display name cannot exceed 50 characters'),
	userFactionId: z.string().optional()
});

// Helper function to sanitize text input (prevent XSS)
export function sanitizeText(text: string): string {
	return text
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;')
		.replace(/"/g, '&quot;')
		.replace(/'/g, '&#x27;')
		.replace(/\//g, '&#x2F;');
}

// Type exports for use in components
export type UserCreationData = z.infer<typeof userCreationSchema>;
export type BattleUploadData = z.infer<typeof battleUploadSchema>;
export type UserProfileData = z.infer<typeof userUpdateSchema>;
export type PasswordUpdateData = z.infer<typeof passwordUpdateSchema>;
export type PasswordResetRequestData = z.infer<typeof passwordResetRequestSchema>;
export type PasswordResetConfirmData = z.infer<typeof passwordResetConfirmSchema>;
export type FactionManagementData = z.infer<typeof factionManagementSchema>;
