import { PayloadAction, createSlice } from '@reduxjs/toolkit';

import { ContextStateFifthLine } from '../../types/ContextState';

const initialState: ContextStateFifthLine = {
	isOpen: false,
	context: 'createFifthLine',
};

export const ContextSliceFifthLine = createSlice({
	name: 'ContextStateFifthLine',
	initialState,
	reducers: {
		showModalFifthLine: (
			state,
			action: PayloadAction<
				'createFifthLine' | 'editFifthLine' | 'deleteFifthLine'
			>,
		) => {
			return {
				isOpen: true,
				context: action.payload,
			};
		},

		hideModalFifthLine: (state) => {
			return {
				...state,
				isOpen: false,
			};
		},
	},
});

export const { showModalFifthLine, hideModalFifthLine } =
	ContextSliceFifthLine.actions;

export default ContextSliceFifthLine.reducer;
