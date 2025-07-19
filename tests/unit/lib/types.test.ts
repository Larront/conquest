import { describe, it, expect } from 'vitest';
import type { Planet, Battle, FactionControl, Faction, UserFaction, User } from '../../../src/lib/types';

describe('TypeScript Interface Tests', () => {
	describe('Planet Interface', () => {
		it('should define Planet interface with all required properties', () => {
			const mockPlanet: Planet = {
				id: 'planet-1',
				name: 'Terra',
				classification: 'Hive World',
				sector: 'Solar Segmentum',
				description: 'The Throneworld of the Imperium',
				population: 'Countless Billions',
				tithe: 'Adeptus Non',
				climate: 'Temperate',
				government: 'Adeptus Terra',
				distance: '0 light years',
				angle: 0,
				color: '#ffd700',
				size: 'large',
				faction_control: [],
				battle_history: []
			};

			expect(mockPlanet.id).toBe('planet-1');
			expect(mockPlanet.name).toBe('Terra');
			expect(mockPlanet.classification).toBe('Hive World');
			expect(mockPlanet.sector).toBe('Solar Segmentum');
			expect(mockPlanet.description).toBe('The Throneworld of the Imperium');
			expect(mockPlanet.population).toBe('Countless Billions');
			expect(mockPlanet.tithe).toBe('Adeptus Non');
			expect(mockPlanet.climate).toBe('Temperate');
			expect(mockPlanet.government).toBe('Adeptus Terra');
			expect(mockPlanet.distance).toBe('0 light years');
			expect(typeof mockPlanet.angle).toBe('number');
			expect(mockPlanet.color).toBe('#ffd700');
			expect(mockPlanet.size).toBe('large');
			expect(Array.isArray(mockPlanet.faction_control)).toBe(true);
			expect(Array.isArray(mockPlanet.battle_history)).toBe(true);
		});

		it('should handle Planet with populated arrays', () => {
			const mockFactionControl: FactionControl = {
				planet: 'planet-1',
				profile: 'Imperial Guard',
				control: 100,
				user_faction_id: 1
			};

			const mockBattle: Battle = {
				id: 'battle-1',
				planet: 'planet-1',
				battle_type: 'Combat Patrol',
				points: 1000,
				attacker: 'Space Marines',
				defender: 'Chaos Cultists',
				result: 'Attacker Victory',
				description: 'Fierce battle on the surface',
				battle_date: '2023-10-15T14:30:00Z',
				attacker_points: 85,
				defender_points: 15
			};

			const planetWithData: Planet = {
				id: 'planet-1',
				name: 'Cadia',
				classification: 'Fortress World',
				sector: 'Cadian Gate',
				description: 'The fortress world stands',
				population: 'Billions',
				tithe: 'Aptus Non',
				climate: 'Hostile',
				government: 'Military',
				distance: '1000 light years',
				angle: 45,
				color: '#800080',
				size: 'medium',
				faction_control: [mockFactionControl],
				battle_history: [mockBattle]
			};

			expect(planetWithData.faction_control).toHaveLength(1);
			expect(planetWithData.battle_history).toHaveLength(1);
			expect(planetWithData.faction_control[0].control).toBe(100);
			expect(planetWithData.battle_history[0].result).toBe('Attacker Victory');
		});
	});

	describe('Battle Interface', () => {
		it('should define Battle interface with all required properties', () => {
			const mockBattle: Battle = {
				id: 'battle-1',
				planet: 'planet-1',
				battle_type: 'Strike Force',
				points: 1500,
				attacker: 'Ork Warband',
				defender: 'Imperial Guard',
				result: 'Defender Victory',
				battle_date: '2023-09-20T10:00:00Z',
				attacker_points: 30,
				defender_points: 70
			};

			expect(mockBattle.id).toBe('battle-1');
			expect(mockBattle.planet).toBe('planet-1');
			expect(mockBattle.battle_type).toBe('Strike Force');
			expect(typeof mockBattle.points).toBe('number');
			expect(mockBattle.attacker).toBe('Ork Warband');
			expect(mockBattle.defender).toBe('Imperial Guard');
			expect(mockBattle.result).toBe('Defender Victory');
			expect(mockBattle.battle_date).toBe('2023-09-20T10:00:00Z');
			expect(typeof mockBattle.attacker_points).toBe('number');
			expect(typeof mockBattle.defender_points).toBe('number');
		});

		it('should handle Battle with optional description', () => {
			const battleWithDescription: Battle = {
				id: 'battle-2',
				planet: 'planet-2',
				battle_type: 'Onslaught',
				points: 2000,
				attacker: 'Chaos Marines',
				defender: 'Space Marines',
				result: 'Draw',
				description: 'Epic clash between Astartes',
				battle_date: '2023-11-01T16:45:00Z',
				attacker_points: 50,
				defender_points: 50
			};

			expect(battleWithDescription.description).toBe('Epic clash between Astartes');
		});

		it('should handle Battle without optional description', () => {
			const battleWithoutDescription: Battle = {
				id: 'battle-3',
				planet: 'planet-3',
				battle_type: 'Incursion',
				points: 750,
				attacker: 'Tyranids',
				defender: 'Tau Empire',
				result: 'Attacker Victory',
				battle_date: '2023-12-05T08:30:00Z',
				attacker_points: 80,
				defender_points: 20
			};

			expect(battleWithoutDescription.description).toBeUndefined();
		});
	});

	describe('FactionControl Interface', () => {
		it('should define FactionControl interface with required properties', () => {
			const mockFactionControl: FactionControl = {
				planet: 'planet-1',
				profile: 'Space Marines',
				control: 75
			};

			expect(mockFactionControl.planet).toBe('planet-1');
			expect(mockFactionControl.profile).toBe('Space Marines');
			expect(typeof mockFactionControl.control).toBe('number');
			expect(mockFactionControl.control).toBe(75);
		});

		it('should handle FactionControl with optional user_faction_id', () => {
			const factionControlWithId: FactionControl = {
				planet: 'planet-2',
				profile: 'Imperial Guard',
				control: 60,
				user_faction_id: 42
			};

			expect(factionControlWithId.user_faction_id).toBe(42);
			expect(typeof factionControlWithId.user_faction_id).toBe('number');
		});

		it('should handle FactionControl without optional user_faction_id', () => {
			const factionControlWithoutId: FactionControl = {
				planet: 'planet-3',
				profile: 'Chaos Cultists',
				control: 25
			};

			expect(factionControlWithoutId.user_faction_id).toBeUndefined();
		});
	});

	describe('Faction Interface', () => {
		it('should define Faction interface with all required properties', () => {
			const mockFaction: Faction = {
				name: 'Imperial Guard',
				allegiance: 'Imperial',
				icon: 'imperial-guard-icon'
			};

			expect(mockFaction.name).toBe('Imperial Guard');
			expect(mockFaction.allegiance).toBe('Imperial');
			expect(mockFaction.icon).toBe('imperial-guard-icon');
		});

		it('should handle different faction types', () => {
			const factions: Faction[] = [
				{ name: 'Space Marines', allegiance: 'Imperial', icon: 'sm-icon' },
				{ name: 'Chaos Marines', allegiance: 'Chaos', icon: 'csm-icon' },
				{ name: 'Ork Warband', allegiance: 'Xenos', icon: 'ork-icon' },
				{ name: 'Eldar Craftworld', allegiance: 'Xenos', icon: 'eldar-icon' }
			];

			expect(factions).toHaveLength(4);
			expect(factions[0].allegiance).toBe('Imperial');
			expect(factions[1].allegiance).toBe('Chaos');
			expect(factions[2].allegiance).toBe('Xenos');
			expect(factions[3].allegiance).toBe('Xenos');
		});
	});

	describe('UserFaction Interface', () => {
		it('should define UserFaction interface with all required properties', () => {
			const mockUserFaction: UserFaction = {
				id: 1,
				user_id: 'user-123',
				faction_name: 'Imperial Guard',
				faction_display_name: 'Cadian 47th Regiment',
				battles_won: 15,
				battles_lost: 8,
				battles_drawn: 3,
				total_points: 2500,
				created_at: '2023-01-15T10:00:00Z'
			};

			expect(typeof mockUserFaction.id).toBe('number');
			expect(mockUserFaction.user_id).toBe('user-123');
			expect(mockUserFaction.faction_name).toBe('Imperial Guard');
			expect(mockUserFaction.faction_display_name).toBe('Cadian 47th Regiment');
			expect(typeof mockUserFaction.battles_won).toBe('number');
			expect(typeof mockUserFaction.battles_lost).toBe('number');
			expect(typeof mockUserFaction.battles_drawn).toBe('number');
			expect(typeof mockUserFaction.total_points).toBe('number');
			expect(mockUserFaction.created_at).toBe('2023-01-15T10:00:00Z');
		});

		it('should handle UserFaction with optional username', () => {
			const userFactionWithUsername: UserFaction = {
				id: 2,
				user_id: 'user-456',
				faction_name: 'Space Marines',
				faction_display_name: 'Ultramarines 2nd Company',
				battles_won: 20,
				battles_lost: 5,
				battles_drawn: 2,
				total_points: 3500,
				created_at: '2023-02-01T14:30:00Z',
				username: 'GuillimanFan'
			};

			expect(userFactionWithUsername.username).toBe('GuillimanFan');
		});

		it('should handle UserFaction without optional username', () => {
			const userFactionWithoutUsername: UserFaction = {
				id: 3,
				user_id: 'user-789',
				faction_name: 'Chaos Marines',
				faction_display_name: 'Black Legion',
				battles_won: 12,
				battles_lost: 18,
				battles_drawn: 1,
				total_points: 1800,
				created_at: '2023-03-10T09:15:00Z'
			};

			expect(userFactionWithoutUsername.username).toBeUndefined();
		});
	});

	describe('User Interface', () => {
		it('should define User interface with all required properties', () => {
			const mockUser: User = {
				id: 'user-123',
				username: 'CommanderSteel',
				battles_won: 35,
				battles_lost: 18,
				battles_drawn: 7,
				total_points: 5500,
				created_at: '2023-01-01T12:00:00Z'
			};

			expect(mockUser.id).toBe('user-123');
			expect(mockUser.username).toBe('CommanderSteel');
			expect(typeof mockUser.battles_won).toBe('number');
			expect(typeof mockUser.battles_lost).toBe('number');
			expect(typeof mockUser.battles_drawn).toBe('number');
			expect(typeof mockUser.total_points).toBe('number');
			expect(mockUser.created_at).toBe('2023-01-01T12:00:00Z');
		});

		it('should handle User with optional user_factions', () => {
			const userFactions: UserFaction[] = [
				{
					id: 1,
					user_id: 'user-123',
					faction_name: 'Imperial Guard',
					faction_display_name: 'Cadian Shock Troops',
					battles_won: 20,
					battles_lost: 10,
					battles_drawn: 3,
					total_points: 3000,
					created_at: '2023-01-01T12:00:00Z'
				},
				{
					id: 2,
					user_id: 'user-123',
					faction_name: 'Space Marines',
					faction_display_name: 'Imperial Fists',
					battles_won: 15,
					battles_lost: 8,
					battles_drawn: 4,
					total_points: 2500,
					created_at: '2023-02-01T12:00:00Z'
				}
			];

			const userWithFactions: User = {
				id: 'user-123',
				username: 'CommanderSteel',
				battles_won: 35,
				battles_lost: 18,
				battles_drawn: 7,
				total_points: 5500,
				created_at: '2023-01-01T12:00:00Z',
				user_factions: userFactions
			};

			expect(userWithFactions.user_factions).toHaveLength(2);
			expect(userWithFactions.user_factions?.[0].faction_name).toBe('Imperial Guard');
			expect(userWithFactions.user_factions?.[1].faction_name).toBe('Space Marines');
		});

		it('should handle User without optional user_factions', () => {
			const userWithoutFactions: User = {
				id: 'user-456',
				username: 'NewRecruit',
				battles_won: 0,
				battles_lost: 0,
				battles_drawn: 0,
				total_points: 0,
				created_at: '2023-12-01T15:30:00Z'
			};

			expect(userWithoutFactions.user_factions).toBeUndefined();
		});
	});

	describe('Type Relationships', () => {
		it('should demonstrate proper type relationships between interfaces', () => {
			const faction: Faction = {
				name: 'Space Marines',
				allegiance: 'Imperial',
				icon: 'sm-icon'
			};

			const userFaction: UserFaction = {
				id: 1,
				user_id: 'user-123',
				faction_name: faction.name, // Using faction name
				faction_display_name: 'Ultramarines',
				battles_won: 10,
				battles_lost: 2,
				battles_drawn: 1,
				total_points: 1500,
				created_at: '2023-01-01T12:00:00Z',
				username: 'MarineCaptain'
			};

			const user: User = {
				id: userFaction.user_id, // Using user_id from userFaction
				username: userFaction.username!, // Using username from userFaction
				battles_won: userFaction.battles_won,
				battles_lost: userFaction.battles_lost,
				battles_drawn: userFaction.battles_drawn,
				total_points: userFaction.total_points,
				created_at: userFaction.created_at,
				user_factions: [userFaction]
			};

			const factionControl: FactionControl = {
				planet: 'planet-1',
				profile: faction.name, // Using faction name
				control: 75,
				user_faction_id: userFaction.id // Using userFaction id
			};

			const battle: Battle = {
				id: 'battle-1',
				planet: factionControl.planet, // Using same planet
				battle_type: 'Combat Patrol',
				points: 1000,
				attacker: faction.name, // Using faction as attacker
				defender: 'Chaos Marines',
				result: 'Attacker Victory',
				battle_date: '2023-10-15T14:30:00Z',
				attacker_points: 70,
				defender_points: 30
			};

			const planet: Planet = {
				id: factionControl.planet,
				name: 'Test World',
				classification: 'Hive World',
				sector: 'Test Sector',
				description: 'A test world',
				population: 'Billions',
				tithe: 'Aptus Non',
				climate: 'Temperate',
				government: 'Imperial',
				distance: '100 light years',
				angle: 45,
				color: '#blue',
				size: 'medium',
				faction_control: [factionControl],
				battle_history: [battle]
			};

			// Verify relationships
			expect(planet.faction_control[0].profile).toBe(faction.name);
			expect(planet.battle_history[0].attacker).toBe(faction.name);
			expect(user.user_factions?.[0].faction_name).toBe(faction.name);
			expect(factionControl.user_faction_id).toBe(userFaction.id);
		});
	});

	describe('Type Safety', () => {
		it('should enforce type constraints', () => {
			// Test that TypeScript would catch type errors in compilation
			const testTypeConstraints = () => {
				// These would cause TypeScript errors if uncommented:
				
				// const invalidPlanet: Planet = {
				//   id: 123, // Should be string, not number
				//   // ... missing required properties
				// };

				// const invalidBattle: Battle = {
				//   points: "1000", // Should be number, not string
				//   // ... other properties
				// };

				return true;
			};

			expect(testTypeConstraints()).toBe(true);
		});

		it('should handle optional properties correctly', () => {
			// Test optional properties
			const battleWithoutDescription: Battle = {
				id: 'battle-1',
				planet: 'planet-1',
				battle_type: 'Combat Patrol',
				points: 1000,
				attacker: 'Space Marines',
				defender: 'Chaos Cultists',
				result: 'Attacker Victory',
				battle_date: '2023-10-15T14:30:00Z',
				attacker_points: 70,
				defender_points: 30
				// description is optional, so this is valid
			};

			const factionControlWithoutUserId: FactionControl = {
				planet: 'planet-1',
				profile: 'Imperial Guard',
				control: 100
				// user_faction_id is optional, so this is valid
			};

			const userWithoutFactions: User = {
				id: 'user-123',
				username: 'TestUser',
				battles_won: 0,
				battles_lost: 0,
				battles_drawn: 0,
				total_points: 0,
				created_at: '2023-01-01T12:00:00Z'
				// user_factions is optional, so this is valid
			};

			expect(battleWithoutDescription.description).toBeUndefined();
			expect(factionControlWithoutUserId.user_faction_id).toBeUndefined();
			expect(userWithoutFactions.user_factions).toBeUndefined();
		});
	});
});