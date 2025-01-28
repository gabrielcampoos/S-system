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

// Centralização de erro
const handleError = (error: unknown, dispatch: any, defaultMessage: string) => {
	if (error instanceof AxiosError) {
		dispatch(
			showNotification({
				message: error.response?.data.message || defaultMessage,
				success: false,
			}),
		);
		return {
			success: false,
			message: error.response?.data.message || defaultMessage,
		};
	}

	dispatch(
		showNotification({
			message: defaultMessage,
			success: false,
		}),
	);

	return {
		success: false,
		message: defaultMessage,
	};
};

// Thunks
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
			return handleError(
				error,
				dispatch,
				'Erro ao criar o usuário. Por favor, tente novamente.',
			);
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

			// Ordena os usuários por createdAt (do mais recente ao mais antigo)
			const sortedData = response.data.data.sort(
				(a: User, b: User) =>
					new Date(a.createdAt).getTime() -
					new Date(b.createdAt).getTime(),
			);

			return { ...response.data, data: sortedData };
		} catch (error) {
			return handleError(
				error,
				dispatch,
				'Erro ao carregar a lista de usuários. Por favor, tente novamente.',
			);
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
			return handleError(
				error,
				dispatch,
				'Erro ao deletar o usuário. Por favor, tente novamente.',
			);
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
			return handleError(
				error,
				dispatch,
				'Erro ao editar o usuário. Por favor, tente novamente.',
			);
		}
	},
);

// Adapter para gerenciar o estado dos usuários
const userAdapter = createEntityAdapter<UserState>({
	selectId: (state) => state.id,
});

// Seletores
export const { selectAll: listAllUsers } = userAdapter.getSelectors(
	(global: RootState) => global.users,
);

// Slice
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

			userAdapter.setAll(state, data); // Insere usuários já ordenados
		});

		builder.addCase(userCreate.pending, (state) => {
			state.loading = true;
			state.message = 'Criando usuário...';
		});

		builder.addCase(userCreate.fulfilled, (state, action) => {
			const { message, data } = action.payload;

			state.loading = false;
			state.message = message;

			if (!data?.id) {
				return;
			}

			userAdapter.addOne(state, data);
		});

		builder.addCase(userCreate.rejected, (state) => {
			state.loading = false;
			state.message = 'Usuário não criado.';
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
			state.message = 'Excluindo usuário...';
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
			state.message = 'Usuário não excluído.';
		});
	},
});

export default userSlice.reducer;
export const { refresh } = userSlice.actions;
