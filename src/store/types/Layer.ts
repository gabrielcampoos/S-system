export interface Profundity {
	id?: string;
	profundity0: number;
	spt: number;
	hit1: number;
	profundity1: number;
	hit2: number;
	profundity2: number;
	hit3: number;
	profundity3: number;
}
export interface LayerDto {
	id?: string;
	projectNumber: number;
	hole: string;
	code: number;
	depth: number;
	profundities: Profundity[];
	type: string;
	description: string;
	hatch: string;
}
