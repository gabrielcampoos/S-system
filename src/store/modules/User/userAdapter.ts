import {
	createAsyncThunk,
	createEntityAdapter,
	createSlice,
} from '@reduxjs/toolkit';
import { AxiosError } from 'axios';

import { RootState } from '../..';

import { showNotification } from '../Notification/notificationSlice';
import serviceApi from '../../../configs/services/api';
import {
	ResponseCreateUserDto,
	ResponseDeleteUserDto,
	ResponseEditUserDto,
	ResponseListUsersDto,
	User,
	UserState,
} from '../../types';

export const userCreate = createAsyncThunk(
	'user/create',
	async (newUser: User, { dispatch }) => {
		try {
			const response = await serviceApi.post('/user', newUser);

			dispatch(
				showNotification({
					success: response.data.success,
					message: response.data.message,
				}),
			);

			return response.data;
		} catch (error) {
			if (error instanceof AxiosError) {
				const response: ResponseCreateUserDto = {
					success: error.response?.data.success,
					message: error.response?.data.message,
				};

				dispatch(
					showNotification({
						message: error.response?.data.message,
						success: false,
					}),
				);
				return response;
			}

			return {
				success: false,
				message: 'Algo de errado não está certo. A requisição falhou.',
			};
		}
	},
);

export const userList = createAsyncThunk(
	'user/userList',
	async (_, { dispatch }) => {
		try {
			const response = await serviceApi.get('/user');

			dispatch(
				showNotification({
					message: response.data?.message,
					success: response.data?.success,
				}),
			);

			return response.data;
		} catch (error) {
			if (error instanceof AxiosError) {
				const response: ResponseListUsersDto = {
					success: error.response?.data.success,
					message: error.response?.data.message,
				};

				dispatch(
					showNotification({
						message: error.response?.data.message,
						success: false,
					}),
				);

				return response;
			}

			return {
				success: false,
				message: 'Algo de errado não está certo. A requisição falhou.',
			};
		}
	},
);

export const userDelete = createAsyncThunk(
	'user/delete',
	async (data: string, { dispatch }) => {
		try {
			const response = await serviceApi.delete(`/user/${data}`);

			dispatch(
				showNotification({
					success: response.data.success,
					message: response.data.message,
				}),
			);

			return response.data;
		} catch (error) {
			if (error instanceof AxiosError) {
				const response: ResponseDeleteUserDto = {
					success: error.response?.data.success,
					message: error.response?.data.message,
				};

				dispatch(
					showNotification({
						message: error.response?.data.message,
						success: false,
					}),
				);
				return response;
			}

			return {
				success: false,
				message: 'Algo de errado não está certo. A requisição falhou.',
			};
		}
	},
);

export const userEdit = createAsyncThunk(
	'user/edit',
	async (data: User, { dispatch }) => {
		try {
			const response = await serviceApi.put(`/user/${data.id}`, data);
			dispatch(
				showNotification({
					success: response.data.success,
					message: response.data.message,
				}),
			);
			return response.data;
		} catch (error) {
			if (error instanceof AxiosError) {
				const response: ResponseEditUserDto = {
					success: error.response?.data.success,
					message: error.response?.data.message,
				};
				dispatch(
					showNotification({
						message: error.response?.data.message,
						success: false,
					}),
				);
				return response;
			}
			return {
				success: false,
				message: 'Algo de errado não está certo. A requisição falhou.',
			};
		}
	},
);

const userAdapter = createEntityAdapter<UserState>({
	selectId: (state) => state.id,
});

export const { selectAll: listAllUsers } = userAdapter.getSelectors(
	(global: RootState) => global.users,
);

const userSlice = createSlice({
	name: 'user',
	initialState: userAdapter.getInitialState({
		loading: false,
		message: '',
	}),
	reducers: {
		refresh(state) {
			return { ...state };
		},
	},

	extraReducers: (builder) => {
		builder.addCase(userList.pending, (state) => {
			state.loading = true;
			state.message = 'Carregando usuários.';
		});

		builder.addCase(userList.fulfilled, (state, action) => {
			const { message, data } = action.payload;

			state.loading = false;
			state.message = message;

			if (!data || data.length === 0) {
				state.message = 'Nada encontrado.';
				return;
			}

			userAdapter.setAll(state, data);
		});

		builder.addCase(userCreate.pending, (state) => {
			state.loading = true;
			state.message = 'Carregando notas.';
		});

		builder.addCase(userCreate.fulfilled, (state, action) => {
			const { message, data } = action.payload;

			state.loading = false;
			state.message = message;

			if (!data?.id) {
				console.log(action.payload);
				return;
			}

			userAdapter.addOne(state, data);
		});

		builder.addCase(userCreate.rejected, (state) => {
			state.loading = false;
			state.message = 'Cliente final não criado.';
		});

		builder.addCase(userEdit.pending, (state) => {
			state.loading = true;
			state.message = 'Atualizando usuário...';
		});
		builder.addCase(userEdit.fulfilled, (state, action) => {
			const { message, data } = action.payload;
			state.loading = false;
			state.message = message;

			if (!data || !data.id) {
				return;
			}

			userAdapter.updateOne(state, {
				id: data.id,
				changes: data,
			});
		});
		builder.addCase(userEdit.rejected, (state) => {
			state.loading = false;
			state.message = 'Usuário não atualizado.';
		});

		builder.addCase(userDelete.pending, (state) => {
			state.loading = true;
			state.message = 'Excluindo nota...';
		});
		builder.addCase(userDelete.fulfilled, (state, action) => {
			const { message, success, data } = action.payload;
			state.loading = false;
			state.message = message;

			if (success) {
				userAdapter.removeOne(state, data);
			}
		});
		builder.addCase(userDelete.rejected, (state) => {
			state.loading = false;
			state.message = 'Nota não excluida.';
		});
	},
});

export default userSlice.reducer;
export const { refresh } = userSlice.actions;
