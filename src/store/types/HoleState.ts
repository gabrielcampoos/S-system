import { LayerDto } from './Layer';

export interface HoleState {
	id: string;
	holeNumber: string;
	initialDate: string;
	finalDate: string;
	name: string;
	workDescription: string;
	quota: string;
	waterLevel: string;
	interval: string;
	waterLevelTwo: string;
	intervalTwo: string;
	torque: string;
	coating: string;
	ultimateDigger: string;
	initialHelical: string;
	finalHelical: string;
	printSpt: string;
	stop: string;
	textPoll: string;
	prober: string;
	pageLines: string;
	layers: LayerDto[];
}
