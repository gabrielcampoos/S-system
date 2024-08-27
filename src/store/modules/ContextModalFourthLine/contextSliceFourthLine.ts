import { PayloadAction, createSlice } from '@reduxjs/toolkit';

import { ContextStateFourthLine } from '../../types/ContextState';

const initialState: ContextStateFourthLine = {
	isOpen: false,
	context: 'createFourthLine',
};

export const ContextSliceFourthLine = createSlice({
	name: 'ContextStateFourthLine',
	initialState,
	reducers: {
		showModalFourthLine: (
			state,
			action: PayloadAction<
				'createFourthLine' | 'editFourthLine' | 'deleteFourtLine'
			>,
		) => {
			return {
				isOpen: true,
				context: action.payload,
			};
		},

		hideModalFourthLine: (state) => {
			return {
				...state,
				isOpen: false,
			};
		},
	},
});

export const { showModalFourthLine, hideModalFourthLine } =
	ContextSliceFourthLine.actions;

export default ContextSliceFourthLine.reducer;
