import { PayloadAction, createSlice } from '@reduxjs/toolkit';

import { ContextStateFirstLine } from '../../types/ContextState';

const initialState: ContextStateFirstLine = {
	isOpen: false,
	context: 'createFirstLine',
};

export const ContextSliceFirstLine = createSlice({
	name: 'ContextStateFirstLine',
	initialState,
	reducers: {
		showModalFirstLine: (
			state,
			action: PayloadAction<
				'createFirstLine' | 'editFirstLine' | 'deleteFirstLine'
			>,
		) => {
			return {
				isOpen: true,
				context: action.payload,
			};
		},

		hideModalFirstLine: (state) => {
			return {
				...state,
				isOpen: false,
			};
		},
	},
});

export const { showModalFirstLine, hideModalFirstLine } =
	ContextSliceFirstLine.actions;

export default ContextSliceFirstLine.reducer;
