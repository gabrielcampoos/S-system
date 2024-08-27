import { PayloadAction, createSlice } from '@reduxjs/toolkit';

import {
	ContextObservation,
	ContextStateFourthLine,
} from '../../types/ContextState';

const initialState: ContextObservation = {
	isOpen: false,
	context: 'createObservation',
};

export const ContextSliceObservation = createSlice({
	name: 'ContextObservation',
	initialState,
	reducers: {
		showModalObservation: (
			state,
			action: PayloadAction<
				'createObservation' | 'editObservation' | 'deleteObservation'
			>,
		) => {
			return {
				isOpen: true,
				context: action.payload,
			};
		},

		hideModalObservation: (state) => {
			return {
				...state,
				isOpen: false,
			};
		},
	},
});

export const { hideModalObservation, showModalObservation } =
	ContextSliceObservation.actions;

export default ContextSliceObservation.reducer;
