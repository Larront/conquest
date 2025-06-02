export interface Planet {
	id: string;
	name: string;
	classification: string;
	sector: string;
	description: string;
	population: string;
	tithe: string;
	climate: string;
	government: string;
	distance: string;
	angle: number;
	color: string;
	size: string;
	faction_control: FactionControl[];
	battle_history: Battle[];
}

export interface Battle {
	id: string;
	planet: string;
	battle_type: string;
	points: number;
	attacker: string;
	defender: string;
	result: string;
	description?: string;
	battle_date: string;
	attacker_points: number;
	defender_points: number;
}

export interface FactionControl {
	planet: string;
	profile: string;
	control: number;
}

export interface Faction {
	name: string;
	allegiance: string;
	icon: string;
}

export interface User {
	id: string;
	updated_at: string;
	username: string;
	faction: string;
	battles_won: number;
	battles_lost: number;
	battles_drawn: number;
	total_points: number;
	created_at: string;
}
