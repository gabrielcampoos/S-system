import { EntityState } from '@reduxjs/toolkit';
import { LayerDto } from './Layer';

export interface LayerState extends EntityState<LayerDto> {
	loading: boolean;
	message: string;
	currentLayers: LayerDto[] | null;
	selectedLayerId: string | null;
	selectedLayers: { [key: string]: LayerDto };
}
