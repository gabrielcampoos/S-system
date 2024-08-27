import { configureStore } from '@reduxjs/toolkit';

import rootReducer from './modules/rootReducer';

export const store = configureStore({
	reducer: rootReducer,
});

// DAQUI PRA BAIXO É A INFERENCIA / CONFIG DE TIPOS com base nos reducers e actions existentes

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;

// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
