import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// Define o estado inicial
interface ClassLayersState {
	classLayer: string[];
}

const initialState: ClassLayersState = {
	classLayer: [],
};

// Cria o slice
const classLayersSlice = createSlice({
	name: 'classLayers',
	initialState,
	reducers: {
		addClassification(state, action: PayloadAction<string[]>) {
			state.classLayer = action.payload;
		},
	},
});

// Exporta as ações e o reducer
export const { addClassification } = classLayersSlice.actions;
export default classLayersSlice.reducer;
