import { describe, it, expect, vi } from 'vitest';
import {
	userCreationSchema,
	battleUploadSchema,
	userUpdateSchema,
	passwordUpdateSchema,
	passwordResetRequestSchema,
	passwordResetConfirmSchema,
	factionManagementSchema,
	sanitizeText
} from '$lib/validation';

describe('userCreationSchema', () => {
	it('should validate correct user creation data', () => {
		const validData = {
			username: 'testuser',
			email: 'test@example.com',
			password: 'password123'
		};

		const result = userCreationSchema.safeParse(validData);
		expect(result.success).toBe(true);
	});

	it('should reject username less than 3 characters', () => {
		const invalidData = {
			username: 'te',
			email: 'test@example.com',
			password: 'password123'
		};

		const result = userCreationSchema.safeParse(invalidData);
		expect(result.success).toBe(false);
		if (!result.success) {
			expect(result.error.issues[0].message).toBe('Username must be at least 3 characters');
		}
	});

	it('should reject username more than 20 characters', () => {
		const invalidData = {
			username: 'averylongusernamethatexceedstwentycharacters',
			email: 'test@example.com',
			password: 'password123'
		};

		const result = userCreationSchema.safeParse(invalidData);
		expect(result.success).toBe(false);
		if (!result.success) {
			expect(result.error.issues[0].message).toBe('Username cannot exceed 20 characters');
		}
	});

	it('should reject username with invalid characters', () => {
		const invalidData = {
			username: 'test@user',
			email: 'test@example.com',
			password: 'password123'
		};

		const result = userCreationSchema.safeParse(invalidData);
		expect(result.success).toBe(false);
		if (!result.success) {
			expect(result.error.issues[0].message).toBe(
				'Username can only contain letters, numbers, and underscores'
			);
		}
	});

	it('should reject prohibited usernames', () => {
		const prohibitedUsernames = ['admin', 'root', 'system', 'null', 'undefined', 'test'];

		prohibitedUsernames.forEach((username) => {
			const invalidData = {
				username,
				email: 'test@example.com',
				password: 'password123'
			};

			const result = userCreationSchema.safeParse(invalidData);
			expect(result.success).toBe(false);
			if (!result.success) {
				expect(result.error.issues[0].message).toBe('Username is not allowed');
			}
		});
	});

	it('should reject prohibited usernames (case insensitive)', () => {
		const invalidData = {
			username: 'ADMIN',
			email: 'test@example.com',
			password: 'password123'
		};

		const result = userCreationSchema.safeParse(invalidData);
		expect(result.success).toBe(false);
		if (!result.success) {
			expect(result.error.issues[0].message).toBe('Username is not allowed');
		}
	});

	it('should reject invalid email format', () => {
		const invalidData = {
			username: 'testuser',
			email: 'not-an-email',
			password: 'password123'
		};

		const result = userCreationSchema.safeParse(invalidData);
		expect(result.success).toBe(false);
	});

	it('should reject password less than 8 characters', () => {
		const invalidData = {
			username: 'testuser',
			email: 'test@example.com',
			password: 'pass'
		};

		const result = userCreationSchema.safeParse(invalidData);
		expect(result.success).toBe(false);
		if (!result.success) {
			expect(result.error.issues[0].message).toBe('Password must be at least 8 characters');
		}
	});
});

describe('battleUploadSchema', () => {
	const validBattleData = {
		selectedPlanet: 1,
		battleType: 'Combat Patrol',
		points: 1000,
		attacker: 1,
		defender: 2,
		attackerPoints: 60,
		defenderPoints: 40,
		result: 'Attacker Victory',
		battleDate: '2023-01-01'
	};

	it('should validate correct battle data', () => {
		const result = battleUploadSchema.safeParse(validBattleData);
		expect(result.success).toBe(true);
	});

	it('should reject invalid planet selection', () => {
		const invalidData = {
			...validBattleData,
			selectedPlanet: 0
		};

		const result = battleUploadSchema.safeParse(invalidData);
		expect(result.success).toBe(false);
		if (!result.success) {
			expect(result.error.issues[0].message).toBe('Planet selection is required');
		}
	});

	it('should reject invalid battle type', () => {
		const invalidData = {
			...validBattleData,
			battleType: 'Invalid Type'
		};

		const result = battleUploadSchema.safeParse(invalidData);
		expect(result.success).toBe(false);
		if (!result.success) {
			expect(result.error.issues[0].message).toBe('Invalid battle type');
		}
	});

	it('should accept valid battle types', () => {
		const validBattleTypes = ['Combat Patrol', 'Incursion', 'Strike Force', 'Onslaught'];

		validBattleTypes.forEach((battleType) => {
			const data = {
				...validBattleData,
				battleType
			};

			const result = battleUploadSchema.safeParse(data);
			expect(result.success).toBe(true);
		});
	});

	it('should reject points less than 500', () => {
		const invalidData = {
			...validBattleData,
			points: 400
		};

		const result = battleUploadSchema.safeParse(invalidData);
		expect(result.success).toBe(false);
		if (!result.success) {
			expect(result.error.issues[0].message).toBe('Points must be at least 500');
		}
	});

	it('should reject points more than 2000', () => {
		const invalidData = {
			...validBattleData,
			points: 2500
		};

		const result = battleUploadSchema.safeParse(invalidData);
		expect(result.success).toBe(false);
		if (!result.success) {
			expect(result.error.issues[0].message).toBe('Points cannot exceed 2000');
		}
	});

	it('should reject negative attacker points', () => {
		const invalidData = {
			...validBattleData,
			attackerPoints: -1
		};

		const result = battleUploadSchema.safeParse(invalidData);
		expect(result.success).toBe(false);
		if (!result.success) {
			expect(result.error.issues[0].message).toBe('Attacker points cannot be negative');
		}
	});

	it('should reject attacker points over 100', () => {
		const invalidData = {
			...validBattleData,
			attackerPoints: 101
		};

		const result = battleUploadSchema.safeParse(invalidData);
		expect(result.success).toBe(false);
		if (!result.success) {
			expect(result.error.issues[0].message).toBe('Attacker points cannot exceed 100');
		}
	});

	it('should reject negative defender points', () => {
		const invalidData = {
			...validBattleData,
			defenderPoints: -1
		};

		const result = battleUploadSchema.safeParse(invalidData);
		expect(result.success).toBe(false);
		if (!result.success) {
			expect(result.error.issues[0].message).toBe('Defender points cannot be negative');
		}
	});

	it('should reject defender points over 100', () => {
		const invalidData = {
			...validBattleData,
			defenderPoints: 101
		};

		const result = battleUploadSchema.safeParse(invalidData);
		expect(result.success).toBe(false);
		if (!result.success) {
			expect(result.error.issues[0].message).toBe('Defender points cannot exceed 100');
		}
	});

	it('should reject invalid battle result', () => {
		const invalidData = {
			...validBattleData,
			result: 'Invalid Result'
		};

		const result = battleUploadSchema.safeParse(invalidData);
		expect(result.success).toBe(false);
		if (!result.success) {
			expect(result.error.issues[0].message).toBe('Invalid battle result');
		}
	});

	it('should accept valid battle results', () => {
		// Test Draw result with equal points
		const drawData = {
			...validBattleData,
			result: 'Draw',
			attackerPoints: 50,
			defenderPoints: 50
		};
		expect(battleUploadSchema.safeParse(drawData).success).toBe(true);

		// Test Attacker Victory with higher attacker points
		const attackerVictoryData = {
			...validBattleData,
			result: 'Attacker Victory',
			attackerPoints: 60,
			defenderPoints: 40
		};
		expect(battleUploadSchema.safeParse(attackerVictoryData).success).toBe(true);

		// Test Defender Victory with higher defender points
		const defenderVictoryData = {
			...validBattleData,
			result: 'Defender Victory',
			attackerPoints: 40,
			defenderPoints: 60
		};
		expect(battleUploadSchema.safeParse(defenderVictoryData).success).toBe(true);
	});

	it('should reject when attacker and defender are the same', () => {
		const invalidData = {
			...validBattleData,
			attacker: 1,
			defender: 1
		};

		const result = battleUploadSchema.safeParse(invalidData);
		expect(result.success).toBe(false);
		if (!result.success) {
			expect(result.error.issues[0].message).toBe(
				'Attacker and defender must be different players'
			);
		}
	});

	it('should reject future battle dates', () => {
		// Mock console.log to avoid output during tests
		vi.spyOn(console, 'log').mockImplementation(() => {});

		const futureDate = new Date();
		futureDate.setDate(futureDate.getDate() + 1);

		const invalidData = {
			...validBattleData,
			battleDate: futureDate.toISOString().split('T')[0]
		};

		const result = battleUploadSchema.safeParse(invalidData);
		expect(result.success).toBe(false);
		if (!result.success) {
			expect(result.error.issues[0].message).toBe('Battle date must not be in the future');
		}
	});

	it('should validate draw result with equal points', () => {
		const drawData = {
			...validBattleData,
			result: 'Draw',
			attackerPoints: 50,
			defenderPoints: 50
		};

		const result = battleUploadSchema.safeParse(drawData);
		expect(result.success).toBe(true);
	});

	it('should reject draw result with unequal points', () => {
		const invalidData = {
			...validBattleData,
			result: 'Draw',
			attackerPoints: 60,
			defenderPoints: 40
		};

		const result = battleUploadSchema.safeParse(invalidData);
		expect(result.success).toBe(false);
		if (!result.success) {
			expect(result.error.issues[0].message).toBe('Battle result must match the point totals');
		}
	});

	it('should validate attacker victory with higher attacker points', () => {
		const attackerVictoryData = {
			...validBattleData,
			result: 'Attacker Victory',
			attackerPoints: 60,
			defenderPoints: 40
		};

		const result = battleUploadSchema.safeParse(attackerVictoryData);
		expect(result.success).toBe(true);
	});

	it('should reject attacker victory with lower attacker points', () => {
		const invalidData = {
			...validBattleData,
			result: 'Attacker Victory',
			attackerPoints: 40,
			defenderPoints: 60
		};

		const result = battleUploadSchema.safeParse(invalidData);
		expect(result.success).toBe(false);
		if (!result.success) {
			expect(result.error.issues[0].message).toBe('Battle result must match the point totals');
		}
	});

	it('should validate defender victory with higher defender points', () => {
		const defenderVictoryData = {
			...validBattleData,
			result: 'Defender Victory',
			attackerPoints: 40,
			defenderPoints: 60
		};

		const result = battleUploadSchema.safeParse(defenderVictoryData);
		expect(result.success).toBe(true);
	});

	it('should reject defender victory with lower defender points', () => {
		const invalidData = {
			...validBattleData,
			result: 'Defender Victory',
			attackerPoints: 60,
			defenderPoints: 40
		};

		const result = battleUploadSchema.safeParse(invalidData);
		expect(result.success).toBe(false);
		if (!result.success) {
			expect(result.error.issues[0].message).toBe('Battle result must match the point totals');
		}
	});

	it('should accept optional description', () => {
		const dataWithDescription = {
			...validBattleData,
			description: 'This was an epic battle!'
		};

		const result = battleUploadSchema.safeParse(dataWithDescription);
		expect(result.success).toBe(true);
	});

	it('should reject description over 1000 characters', () => {
		const longDescription = 'A'.repeat(1001);
		const invalidData = {
			...validBattleData,
			description: longDescription
		};

		const result = battleUploadSchema.safeParse(invalidData);
		expect(result.success).toBe(false);
		if (!result.success) {
			expect(result.error.issues[0].message).toBe('Description cannot exceed 1000 characters');
		}
	});
});

describe('userUpdateSchema', () => {
	it('should validate correct user update data', () => {
		const validData = {
			username: 'newusername'
		};

		const result = userUpdateSchema.safeParse(validData);
		expect(result.success).toBe(true);
	});

	it('should reject username less than 3 characters', () => {
		const invalidData = {
			username: 'te'
		};

		const result = userUpdateSchema.safeParse(invalidData);
		expect(result.success).toBe(false);
		if (!result.success) {
			expect(result.error.issues[0].message).toBe('Username must be at least 3 characters');
		}
	});

	it('should reject prohibited usernames', () => {
		const invalidData = {
			username: 'admin'
		};

		const result = userUpdateSchema.safeParse(invalidData);
		expect(result.success).toBe(false);
		if (!result.success) {
			expect(result.error.issues[0].message).toBe('Username is not allowed');
		}
	});
});

describe('passwordUpdateSchema', () => {
	const validPasswordData = {
		currentPassword: 'oldpassword',
		newPassword: 'NewPassword123',
		confirmPassword: 'NewPassword123'
	};

	it('should validate correct password update data', () => {
		const result = passwordUpdateSchema.safeParse(validPasswordData);
		expect(result.success).toBe(true);
	});

	it('should reject empty current password', () => {
		const invalidData = {
			...validPasswordData,
			currentPassword: ''
		};

		const result = passwordUpdateSchema.safeParse(invalidData);
		expect(result.success).toBe(false);
		if (!result.success) {
			expect(result.error.issues[0].message).toBe('Current password is required');
		}
	});

	it('should reject short new password', () => {
		const invalidData = {
			...validPasswordData,
			newPassword: 'Short1',
			confirmPassword: 'Short1'
		};

		const result = passwordUpdateSchema.safeParse(invalidData);
		expect(result.success).toBe(false);
		if (!result.success) {
			expect(result.error.issues[0].message).toBe('Password must be at least 8 characters');
		}
	});

	it('should reject password without lowercase letter', () => {
		const invalidData = {
			...validPasswordData,
			newPassword: 'PASSWORD123',
			confirmPassword: 'PASSWORD123'
		};

		const result = passwordUpdateSchema.safeParse(invalidData);
		expect(result.success).toBe(false);
		if (!result.success) {
			expect(result.error.issues[0].message).toBe(
				'Password must contain at least one lowercase letter, one uppercase letter, and one number'
			);
		}
	});

	it('should reject password without uppercase letter', () => {
		const invalidData = {
			...validPasswordData,
			newPassword: 'password123',
			confirmPassword: 'password123'
		};

		const result = passwordUpdateSchema.safeParse(invalidData);
		expect(result.success).toBe(false);
		if (!result.success) {
			expect(result.error.issues[0].message).toBe(
				'Password must contain at least one lowercase letter, one uppercase letter, and one number'
			);
		}
	});

	it('should reject password without number', () => {
		const invalidData = {
			...validPasswordData,
			newPassword: 'Password',
			confirmPassword: 'Password'
		};

		const result = passwordUpdateSchema.safeParse(invalidData);
		expect(result.success).toBe(false);
		if (!result.success) {
			expect(result.error.issues[0].message).toBe(
				'Password must contain at least one lowercase letter, one uppercase letter, and one number'
			);
		}
	});

	it('should reject mismatched passwords', () => {
		const invalidData = {
			...validPasswordData,
			newPassword: 'NewPassword123',
			confirmPassword: 'DifferentPassword123'
		};

		const result = passwordUpdateSchema.safeParse(invalidData);
		expect(result.success).toBe(false);
		if (!result.success) {
			expect(result.error.issues[0].message).toBe('New password and confirmation must match');
		}
	});
});

describe('passwordResetRequestSchema', () => {
	it('should validate correct email', () => {
		const validData = {
			email: 'test@example.com'
		};

		const result = passwordResetRequestSchema.safeParse(validData);
		expect(result.success).toBe(true);
	});

	it('should reject invalid email format', () => {
		const invalidData = {
			email: 'not-an-email'
		};

		const result = passwordResetRequestSchema.safeParse(invalidData);
		expect(result.success).toBe(false);
	});
});

describe('passwordResetConfirmSchema', () => {
	const validResetData = {
		newPassword: 'NewPassword123',
		confirmPassword: 'NewPassword123'
	};

	it('should validate correct password reset data', () => {
		const result = passwordResetConfirmSchema.safeParse(validResetData);
		expect(result.success).toBe(true);
	});

	it('should reject short password', () => {
		const invalidData = {
			...validResetData,
			newPassword: 'Short1',
			confirmPassword: 'Short1'
		};

		const result = passwordResetConfirmSchema.safeParse(invalidData);
		expect(result.success).toBe(false);
		if (!result.success) {
			expect(result.error.issues[0].message).toBe('Password must be at least 8 characters');
		}
	});

	it('should reject mismatched passwords', () => {
		const invalidData = {
			...validResetData,
			newPassword: 'NewPassword123',
			confirmPassword: 'DifferentPassword123'
		};

		const result = passwordResetConfirmSchema.safeParse(invalidData);
		expect(result.success).toBe(false);
		if (!result.success) {
			expect(result.error.issues[0].message).toBe('New password and confirmation must match');
		}
	});
});

describe('factionManagementSchema', () => {
	it('should validate correct faction data', () => {
		const validData = {
			factionName: 'Space Marines',
			factionDisplayName: 'Imperial Space Marines',
			userFactionId: 'user-faction-123'
		};

		const result = factionManagementSchema.safeParse(validData);
		expect(result.success).toBe(true);
	});

	it('should reject empty faction name', () => {
		const invalidData = {
			factionName: '',
			factionDisplayName: 'Imperial Space Marines'
		};

		const result = factionManagementSchema.safeParse(invalidData);
		expect(result.success).toBe(false);
		if (!result.success) {
			expect(result.error.issues[0].message).toBe('Faction type is required');
		}
	});

	it('should reject empty display name', () => {
		const invalidData = {
			factionName: 'Space Marines',
			factionDisplayName: ''
		};

		const result = factionManagementSchema.safeParse(invalidData);
		expect(result.success).toBe(false);
		if (!result.success) {
			expect(result.error.issues[0].message).toBe('Display name is required');
		}
	});

	it('should reject display name over 50 characters', () => {
		const invalidData = {
			factionName: 'Space Marines',
			factionDisplayName: 'A'.repeat(51)
		};

		const result = factionManagementSchema.safeParse(invalidData);
		expect(result.success).toBe(false);
		if (!result.success) {
			expect(result.error.issues[0].message).toBe('Display name cannot exceed 50 characters');
		}
	});

	it('should accept optional userFactionId', () => {
		const validData = {
			factionName: 'Space Marines',
			factionDisplayName: 'Imperial Space Marines'
		};

		const result = factionManagementSchema.safeParse(validData);
		expect(result.success).toBe(true);
	});
});

describe('sanitizeText', () => {
	it('should sanitize HTML characters', () => {
		const input = '<script>alert("xss")</script>';
		const expected = '&lt;script&gt;alert(&quot;xss&quot;)&lt;&#x2F;script&gt;';

		const result = sanitizeText(input);
		expect(result).toBe(expected);
	});

	it('should sanitize all dangerous characters', () => {
		const input = '<>"\'/';
		const expected = '&lt;&gt;&quot;&#x27;&#x2F;';

		const result = sanitizeText(input);
		expect(result).toBe(expected);
	});

	it('should handle empty string', () => {
		const result = sanitizeText('');
		expect(result).toBe('');
	});

	it('should handle safe text unchanged', () => {
		const safeText = 'This is safe text with 123 numbers.';
		const result = sanitizeText(safeText);
		expect(result).toBe(safeText);
	});
});
