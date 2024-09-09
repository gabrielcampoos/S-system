import { combineReducers } from '@reduxjs/toolkit';

import loadingSlice from './Loading/loadingSlice';
import notificationSlice from './Notification/notificationSlice';
import contextSliceSecondLine from './ContextModal/contextSlice';
import contextSliceFourthLine from './ContextModalFourthLine/contextSliceFourthLine';
import userSlice from './User/userSlice';
import userAdapter from './User/userAdapter';
import projectAdapter from './Project/projectAdapter';
import contextSliceFirstLine from './ContextModalFirstLine/contextSliceFirstLine';
import contextSliceFifthLine from './ContextModalFifthLine/contextSliceFifthLine';
import contextSliceSixthLine from './ContextModalSixthLine/contextSliceSixthLine';
import contextObservationSlice from './ContextObservation/contextObservationSlice';
import projectSlice from './Project/projectSlice';
import layerSlice from './Layer/layerSlice';
import { persistReducer } from 'redux-persist';
import { holeReducer } from './Hole/holeSlice';
import profunditySlice from './Profundity/profunditySlice';
import classLayerSlice from './ClassLayer/classLayerSlice';
import dataSlice from './Data/dataSlice';

const rootReducer = combineReducers({
	// a cada novo slice, adicionamos uma nova propriedade neste objeto
	// propriedade - nome na store
	// valor - reducer/manager deste estado global
	// modal: modalSlice,
	notification: notificationSlice,
	user: userSlice,
	users: userAdapter,
	project: projectSlice,
	projects: projectAdapter,
	holeReducer,
	layer: layerSlice,
	loading: loadingSlice,
	profundity: profunditySlice,
	classLayer: classLayerSlice,
	data: dataSlice,

	// modal: modalTarefasSlice,
});

export default rootReducer;
