import { PayloadAction, createSlice } from '@reduxjs/toolkit';

import { ContextStateSixthLine } from '../../types/ContextState';

const initialState: ContextStateSixthLine = {
	isOpen: false,
	context: 'createSixthLine',
};

export const ContextSliceSixthLine = createSlice({
	name: 'ContextStateSixthLine',
	initialState,
	reducers: {
		showModalSixthLine: (
			state,
			action: PayloadAction<
				'createSixthLine' | 'editSixthLine' | 'deleteSixthLine'
			>,
		) => {
			return {
				isOpen: true,
				context: action.payload,
			};
		},

		hideModalSixthLine: (state) => {
			return {
				...state,
				isOpen: false,
			};
		},
	},
});

export const { showModalSixthLine, hideModalSixthLine } =
	ContextSliceSixthLine.actions;

export default ContextSliceSixthLine.reducer;
