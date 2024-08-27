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
import holeSlice from './Hole/holeSlice';

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
	hole: holeSlice,
	loading: loadingSlice,

	// modal: modalTarefasSlice,
});

export default rootReducer;
