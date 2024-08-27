import {
	createAsyncThunk,
	createEntityAdapter,
	createSlice,
} from '@reduxjs/toolkit';
import { AxiosError } from 'axios';
import { showNotification } from '../Notification/notificationSlice';
import serviceApi from '../../../configs/services/api';
import { ResponseCreateUserDto, User } from '../../types';
import { RootState } from '../..';

const initialState = {
	user: {
		id: '',
		username: '',
	},
	loading: false,
};

export const createUser = createAsyncThunk(
	'user/create',
	async (newUser: User, { dispatch }) => {
		try {
			const response = await serviceApi.post('/user', newUser);

			const responseApi = response.data as ResponseCreateUserDto;

			dispatch(
				showNotification({
					message: responseApi.message,
					success: responseApi.success,
				}),
			);

			return responseApi;
		} catch (error) {
			if (error instanceof AxiosError) {
				const response = error.response?.data as ResponseCreateUserDto;

				dispatch(
					showNotification({
						message: response.message,
						success: response.success,
					}),
				);

				return response;
			}

			return {
				success: false,
				message: 'Erro inesperado.',
			};
		}
	},
);

export const listUsers = createAsyncThunk(
	'user/list',
	async (_, { dispatch }) => {
		try {
			const response = await serviceApi.get('/user');

			const responseApi = response.data as ResponseCreateUserDto;

			dispatch(
				showNotification({
					message: responseApi.message,
					success: responseApi.success,
				}),
			);

			return responseApi;
		} catch (error) {
			if (error instanceof AxiosError) {
				const response = error.response?.data as ResponseCreateUserDto;

				dispatch(
					showNotification({
						message: response.message,
						success: response.success,
					}),
				);

				return response;
			}

			return {
				success: false,
				message: 'Erro inesperado.',
			};
		}
	},
);

export const getUser = createAsyncThunk(
	'user/getUser',
	async (_, { dispatch }) => {
		try {
			const response = await serviceApi.get('/validateDataUser');

			const responseApi = response.data as ResponseCreateUserDto;
			if (responseApi.success && responseApi.data) {
				localStorage.setItem('username', responseApi.data.username);
			}
			dispatch(
				setUser({
					id: responseApi.data?.id,
					username: responseApi.data?.username,
				}),
			);

			dispatch(
				showNotification({
					message: responseApi.message,
					success: responseApi.success,
				}),
			);

			return responseApi;
		} catch (error) {
			if (error instanceof AxiosError) {
				const response = error.response?.data as ResponseCreateUserDto;

				dispatch(
					showNotification({
						message: response.message,
						success: response.success,
					}),
				);

				return response;
			}

			return {
				success: false,
				message: 'Erro inesperado.',
			};
		}
	},
);

export const userSlice = createSlice({
	name: 'user',
	initialState: initialState,
	reducers: {
		setUser: (state, action) => {
			return {
				...state,
				user: {
					id: action.payload.id,
					username: action.payload.username,
				},
			};
		},
	},

	extraReducers: (builder) => {
		builder.addCase(createUser.pending, (state) => {
			return {
				...state,
				loading: true,
			};
		});

		builder.addCase(createUser.fulfilled, (state, action) => {
			const payload = action.payload as ResponseCreateUserDto;

			if (payload.success && payload.data) {
				return {
					user: {
						id: payload.data?.id,
						username: payload.data.username,
					},
					loading: false,
				};
			}

			if (!payload.success) {
				return {
					...state,
					loading: false,
				};
			}
		});

		builder.addCase(createUser.rejected, (state) => {
			return {
				...state,
				loading: false,
			};
		});

		builder.addCase(listUsers.pending, (state) => {
			return {
				...state,
				loading: true,
			};
		});

		builder.addCase(listUsers.fulfilled, (state, action) => {
			const payload = action.payload as ResponseCreateUserDto;

			if (payload.success && payload.data) {
				return {
					user: {
						id: payload.data?.id,
						username: payload.data.username,
					},
					loading: false,
				};
			}

			if (!payload.success) {
				return {
					...state,
					loading: false,
				};
			}
		});

		builder.addCase(listUsers.rejected, (state) => {
			return {
				...state,
				loading: false,
			};
		});

		builder.addCase(getUser.pending, (state) => {
			return {
				...state,
				loading: true,
			};
		});

		builder.addCase(getUser.fulfilled, (state, action) => {
			const payload = action.payload as ResponseCreateUserDto;

			if (payload.success && payload.data) {
				localStorage.setItem('username', payload.data.username);

				return {
					user: {
						id: payload.data.id,
						username: payload.data.username,
					},
					loading: false,
				};
			}

			if (!payload.success) {
				return initialState;
			}
		});

		builder.addCase(getUser.rejected, () => {
			return initialState;
		});
	},
});

export const { setUser } = userSlice.actions;

export default userSlice.reducer;
