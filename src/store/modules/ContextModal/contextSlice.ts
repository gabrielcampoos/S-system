import { PayloadAction, createSlice } from '@reduxjs/toolkit';

import ContextStateSecondLine from '../../types/ContextState';

const initialState: ContextStateSecondLine = {
	isOpen: false,
	context: 'create',
};

export const contextSliceSecondLine = createSlice({
	name: 'contextModalSecondLine',
	initialState,
	reducers: {
		showModal: (
			state,
			action: PayloadAction<'create' | 'edit' | 'delete'>,
		) => {
			return {
				isOpen: true,
				context: action.payload,
			};
		},

		hideModal: (state) => {
			return {
				...state,
				isOpen: false,
			};
		},
	},
});

export const { showModal, hideModal } = contextSliceSecondLine.actions;

export default contextSliceSecondLine.reducer;
