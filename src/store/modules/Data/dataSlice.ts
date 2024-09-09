import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Layer {
	depth: number;
	backgroundImage: string;
}

interface DataState {
	layer: Layer[];
}

const initialState: DataState = {
	layer: [],
};

const dataSlice = createSlice({
	name: 'data',
	initialState,
	reducers: {
		setLayer(state, action: PayloadAction<Layer[]>) {
			state.layer = action.payload;
		},
		updateLayerImage(
			state,
			action: PayloadAction<{ index: number; image: string }>,
		) {
			const { index, image } = action.payload;

			// Verifica se o índice existe no array antes de tentar atualizar
			if (state.layer[index]) {
				state.layer[index].backgroundImage = image;
			} else {
				console.error(`Camada no índice ${index} não encontrada.`);
			}
		},
	},
});

export const { setLayer, updateLayerImage } = dataSlice.actions;
export default dataSlice.reducer;
