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
	date: string;
	attacker: string;
	defender: string;
	result: 'Attacker Victory' | 'Defender Victory' | 'Draw';
	type: string;
	points: number;
	planet_id: string;
	submitted_by: string;
	created_at: string;
	description?: string;
	images?: string[];
}

export interface FactionControl {
	faction: string;
	value: number;
	color: string;
}

export interface User {
	id: string;
	username: string;
	email: string;
	faction: string;
	avatar?: string;
	battles_won: number;
	battles_lost: number;
	battles_drawn: number;
	total_points: number;
	created_at: string;
}

export interface Campaign {
	id: string;
	name: string;
	description: string;
	start_date: string;
	end_date?: string;
	planets: Planet[];
	participants: User[];
	created_by: string;
}
