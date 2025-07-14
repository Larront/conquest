import { describe, it, expect } from 'vitest';
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

describe('User Creation Schema', () => {
	describe('Valid cases', () => {
		it('should validate correct user data', () => {
			const validData = {
				username: 'validuser123',
				email: 'test@example.com',
				password: 'password123'
			};
			
			const result = userCreationSchema.safeParse(validData);
			expect(result.success).toBe(true);
		});

		it('should allow usernames with underscores', () => {
			const validData = {
				username: 'valid_user_123',
				email: 'test@example.com',
				password: 'password123'
			};
			
			const result = userCreationSchema.safeParse(validData);
			expect(result.success).toBe(true);
		});

		it('should allow minimum length username (3 chars)', () => {
			const validData = {
				username: 'abc',
				email: 'test@example.com',
				password: 'password123'
			};
			
			const result = userCreationSchema.safeParse(validData);
			expect(result.success).toBe(true);
		});

		it('should allow maximum length username (20 chars)', () => {
			const validData = {
				username: 'a'.repeat(20),
				email: 'test@example.com',
				password: 'password123'
			};
			
			const result = userCreationSchema.safeParse(validData);
			expect(result.success).toBe(true);
		});
	});

	describe('Invalid cases', () => {
		it('should reject username too short', () => {
			const invalidData = {
				username: 'ab',
				email: 'test@example.com',
				password: 'password123'
			};
			
			const result = userCreationSchema.safeParse(invalidData);
			expect(result.success).toBe(false);
			if (!result.success) {
				expect(result.error.issues[0].message).toBe('Username must be at least 3 characters');
			}
		});

		it('should reject username too long', () => {
			const invalidData = {
				username: 'a'.repeat(21),
				email: 'test@example.com',
				password: 'password123'
			};
			
			const result = userCreationSchema.safeParse(invalidData);
			expect(result.success).toBe(false);
			if (!result.success) {
				expect(result.error.issues[0].message).toBe('Username cannot exceed 20 characters');
			}
		});

		it('should reject username with special characters', () => {
			const invalidData = {
				username: 'user@name',
				email: 'test@example.com',
				password: 'password123'
			};
			
			const result = userCreationSchema.safeParse(invalidData);
			expect(result.success).toBe(false);
			if (!result.success) {
				expect(result.error.issues[0].message).toBe('Username can only contain letters, numbers, and underscores');
			}
		});

		it('should reject prohibited usernames', () => {
			const prohibitedUsernames = ['admin', 'root', 'system', 'null', 'undefined', 'test'];
			
			prohibitedUsernames.forEach(username => {
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

		it('should reject invalid email format', () => {
			const invalidData = {
				username: 'validuser',
				email: 'invalid-email',
				password: 'password123'
			};
			
			const result = userCreationSchema.safeParse(invalidData);
			expect(result.success).toBe(false);
		});

		it('should reject password too short', () => {
			const invalidData = {
				username: 'validuser',
				email: 'test@example.com',
				password: 'short'
			};
			
			const result = userCreationSchema.safeParse(invalidData);
			expect(result.success).toBe(false);
			if (!result.success) {
				expect(result.error.issues[0].message).toBe('Password must be at least 8 characters');
			}
		});
	});
});

describe('Battle Upload Schema', () => {
	const validBattleData = {
		selectedPlanet: 1,
		battleType: 'Combat Patrol',
		points: 1000,
		attacker: 1,
		defender: 2,
		attackerPoints: 60,
		defenderPoints: 40,
		result: 'Attacker Victory',
		battleDate: '2023-01-01',
		description: 'A test battle'
	};

	describe('Valid cases', () => {
		it('should validate correct battle data', () => {
			const result = battleUploadSchema.safeParse(validBattleData);
			expect(result.success).toBe(true);
		});

		it('should allow all valid battle types', () => {
			const battleTypes = ['Combat Patrol', 'Incursion', 'Strike Force', 'Onslaught'];
			
			battleTypes.forEach(battleType => {
				const data = { ...validBattleData, battleType };
				const result = battleUploadSchema.safeParse(data);
				expect(result.success).toBe(true);
			});
		});

		it('should allow all valid battle results', () => {
			const testCases = [
				{ result: 'Attacker Victory', attackerPoints: 60, defenderPoints: 40 },
				{ result: 'Defender Victory', attackerPoints: 30, defenderPoints: 50 },
				{ result: 'Draw', attackerPoints: 45, defenderPoints: 45 }
			];
			
			testCases.forEach(({ result, attackerPoints, defenderPoints }) => {
				const data = { ...validBattleData, result, attackerPoints, defenderPoints };
				const parseResult = battleUploadSchema.safeParse(data);
				expect(parseResult.success).toBe(true);
			});
		});

		it('should allow minimum and maximum points', () => {
			const testCases = [500, 2000];
			
			testCases.forEach(points => {
				const data = { ...validBattleData, points };
				const result = battleUploadSchema.safeParse(data);
				expect(result.success).toBe(true);
			});
		});

		it('should allow minimum and maximum player points', () => {
			const testCases = [
				{ attackerPoints: 0, defenderPoints: 100, result: 'Defender Victory' },
				{ attackerPoints: 100, defenderPoints: 0, result: 'Attacker Victory' }
			];
			
			testCases.forEach(({ attackerPoints, defenderPoints, result }) => {
				const data = { ...validBattleData, attackerPoints, defenderPoints, result };
				const parseResult = battleUploadSchema.safeParse(data);
				expect(parseResult.success).toBe(true);
			});
		});

		it('should allow today as battle date', () => {
			const today = new Date().toISOString().split('T')[0];
			const data = { ...validBattleData, battleDate: today };
			const result = battleUploadSchema.safeParse(data);
			expect(result.success).toBe(true);
		});

		it('should allow optional description', () => {
			const { description, ...dataWithoutDescription } = validBattleData;
			const result = battleUploadSchema.safeParse(dataWithoutDescription);
			expect(result.success).toBe(true);
		});
	});

	describe('Invalid cases', () => {
		it('should reject invalid planet selection', () => {
			const data = { ...validBattleData, selectedPlanet: 0 };
			const result = battleUploadSchema.safeParse(data);
			expect(result.success).toBe(false);
		});

		it('should reject invalid battle type', () => {
			const data = { ...validBattleData, battleType: 'Invalid Type' };
			const result = battleUploadSchema.safeParse(data);
			expect(result.success).toBe(false);
		});

		it('should reject points below minimum', () => {
			const data = { ...validBattleData, points: 499 };
			const result = battleUploadSchema.safeParse(data);
			expect(result.success).toBe(false);
		});

		it('should reject points above maximum', () => {
			const data = { ...validBattleData, points: 2001 };
			const result = battleUploadSchema.safeParse(data);
			expect(result.success).toBe(false);
		});

		it('should reject same attacker and defender', () => {
			const data = { ...validBattleData, attacker: 1, defender: 1 };
			const result = battleUploadSchema.safeParse(data);
			expect(result.success).toBe(false);
			if (!result.success) {
				expect(result.error.issues[0].message).toBe('Attacker and defender must be different players');
			}
		});

		it('should reject negative player points', () => {
			const data = { ...validBattleData, attackerPoints: -1 };
			const result = battleUploadSchema.safeParse(data);
			expect(result.success).toBe(false);
		});

		it('should reject player points above maximum', () => {
			const data = { ...validBattleData, attackerPoints: 101 };
			const result = battleUploadSchema.safeParse(data);
			expect(result.success).toBe(false);
		});

		it('should reject future battle dates', () => {
			const futureDate = new Date();
			futureDate.setDate(futureDate.getDate() + 1);
			const data = { ...validBattleData, battleDate: futureDate.toISOString().split('T')[0] };
			const result = battleUploadSchema.safeParse(data);
			expect(result.success).toBe(false);
		});

		it('should reject mismatched result and points (attacker victory)', () => {
			const data = { 
				...validBattleData, 
				result: 'Attacker Victory', 
				attackerPoints: 30, 
				defenderPoints: 50 
			};
			const result = battleUploadSchema.safeParse(data);
			expect(result.success).toBe(false);
			if (!result.success) {
				expect(result.error.issues[0].message).toBe('Battle result must match the point totals');
			}
		});

		it('should reject mismatched result and points (defender victory)', () => {
			const data = { 
				...validBattleData, 
				result: 'Defender Victory', 
				attackerPoints: 60, 
				defenderPoints: 40 
			};
			const result = battleUploadSchema.safeParse(data);
			expect(result.success).toBe(false);
		});

		it('should reject mismatched result and points (draw)', () => {
			const data = { 
				...validBattleData, 
				result: 'Draw', 
				attackerPoints: 60, 
				defenderPoints: 40 
			};
			const result = battleUploadSchema.safeParse(data);
			expect(result.success).toBe(false);
		});

		it('should reject description too long', () => {
			const data = { ...validBattleData, description: 'a'.repeat(1001) };
			const result = battleUploadSchema.safeParse(data);
			expect(result.success).toBe(false);
		});
	});
});

describe('User Update Schema', () => {
	it('should validate correct username update', () => {
		const validData = { username: 'newusername' };
		const result = userUpdateSchema.safeParse(validData);
		expect(result.success).toBe(true);
	});

	it('should reject prohibited username in update', () => {
		const invalidData = { username: 'admin' };
		const result = userUpdateSchema.safeParse(invalidData);
		expect(result.success).toBe(false);
	});
});

describe('Password Update Schema', () => {
	const validPasswordData = {
		currentPassword: 'currentpass',
		newPassword: 'NewPassword123',
		confirmPassword: 'NewPassword123'
	};

	it('should validate correct password update', () => {
		const result = passwordUpdateSchema.safeParse(validPasswordData);
		expect(result.success).toBe(true);
	});

	it('should reject empty current password', () => {
		const data = { ...validPasswordData, currentPassword: '' };
		const result = passwordUpdateSchema.safeParse(data);
		expect(result.success).toBe(false);
	});

	it('should reject new password without uppercase', () => {
		const data = { ...validPasswordData, newPassword: 'newpassword123', confirmPassword: 'newpassword123' };
		const result = passwordUpdateSchema.safeParse(data);
		expect(result.success).toBe(false);
	});

	it('should reject new password without lowercase', () => {
		const data = { ...validPasswordData, newPassword: 'NEWPASSWORD123', confirmPassword: 'NEWPASSWORD123' };
		const result = passwordUpdateSchema.safeParse(data);
		expect(result.success).toBe(false);
	});

	it('should reject new password without number', () => {
		const data = { ...validPasswordData, newPassword: 'NewPassword', confirmPassword: 'NewPassword' };
		const result = passwordUpdateSchema.safeParse(data);
		expect(result.success).toBe(false);
	});

	it('should reject mismatched passwords', () => {
		const data = { ...validPasswordData, confirmPassword: 'DifferentPassword123' };
		const result = passwordUpdateSchema.safeParse(data);
		expect(result.success).toBe(false);
		if (!result.success) {
			expect(result.error.issues[0].message).toBe('New password and confirmation must match');
		}
	});
});

describe('Password Reset Request Schema', () => {
	it('should validate correct email', () => {
		const validData = { email: 'test@example.com' };
		const result = passwordResetRequestSchema.safeParse(validData);
		expect(result.success).toBe(true);
	});

	it('should reject invalid email', () => {
		const invalidData = { email: 'invalid-email' };
		const result = passwordResetRequestSchema.safeParse(invalidData);
		expect(result.success).toBe(false);
	});
});

describe('Password Reset Confirm Schema', () => {
	const validResetData = {
		newPassword: 'NewPassword123',
		confirmPassword: 'NewPassword123'
	};

	it('should validate correct password reset', () => {
		const result = passwordResetConfirmSchema.safeParse(validResetData);
		expect(result.success).toBe(true);
	});

	it('should reject mismatched passwords', () => {
		const data = { ...validResetData, confirmPassword: 'DifferentPassword123' };
		const result = passwordResetConfirmSchema.safeParse(data);
		expect(result.success).toBe(false);
	});
});

describe('Faction Management Schema', () => {
	const validFactionData = {
		factionName: 'Space Marines',
		factionDisplayName: 'My Space Marines',
		userFactionId: '123'
	};

	it('should validate correct faction data', () => {
		const result = factionManagementSchema.safeParse(validFactionData);
		expect(result.success).toBe(true);
	});

	it('should allow optional userFactionId', () => {
		const { userFactionId, ...dataWithoutId } = validFactionData;
		const result = factionManagementSchema.safeParse(dataWithoutId);
		expect(result.success).toBe(true);
	});

	it('should reject empty faction name', () => {
		const data = { ...validFactionData, factionName: '' };
		const result = factionManagementSchema.safeParse(data);
		expect(result.success).toBe(false);
	});

	it('should reject empty display name', () => {
		const data = { ...validFactionData, factionDisplayName: '' };
		const result = factionManagementSchema.safeParse(data);
		expect(result.success).toBe(false);
	});

	it('should reject display name too long', () => {
		const data = { ...validFactionData, factionDisplayName: 'a'.repeat(51) };
		const result = factionManagementSchema.safeParse(data);
		expect(result.success).toBe(false);
	});
});

describe('sanitizeText function', () => {
	it('should sanitize HTML characters', () => {
		const input = '<script>alert("xss")</script>';
		const expected = '&lt;script&gt;alert(&quot;xss&quot;)&lt;&#x2F;script&gt;';
		expect(sanitizeText(input)).toBe(expected);
	});

	it('should sanitize quotes and apostrophes', () => {
		const input = `"Hello" and 'World'`;
		const expected = '&quot;Hello&quot; and &#x27;World&#x27;';
		expect(sanitizeText(input)).toBe(expected);
	});

	it('should sanitize forward slashes', () => {
		const input = 'path/to/file';
		const expected = 'path&#x2F;to&#x2F;file';
		expect(sanitizeText(input)).toBe(expected);
	});

	it('should handle empty string', () => {
		expect(sanitizeText('')).toBe('');
	});

	it('should handle normal text without special characters', () => {
		const input = 'Normal text 123';
		expect(sanitizeText(input)).toBe(input);
	});
});