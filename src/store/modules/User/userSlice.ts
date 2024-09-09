import {
	createAsyncThunk,
	createEntityAdapter,
	createSlice,
	PayloadAction,
} from '@reduxjs/toolkit';
import { AxiosError } from 'axios';
import { showNotification } from '../Notification/notificationSlice';
import serviceApi from '../../../configs/services/api';
import { ResponseCreateUserDto, User, UserState } from '../../types';
import { RootState } from '../..';

const initialState: UserState = {
	id: '',
	username: '',
	projects: [],
	loading: false,
};

export const createUser = createAsyncThunk(
	'user/create',
	async (newUser: Omit<User, 'id'>, { dispatch }) => {
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
	async (id: string, { dispatch }) => {
		try {
			const response = await serviceApi.get(`/getUser/${id}`);

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

export const userSlice = createSlice({
	name: 'user',
	initialState,
	reducers: {
		setUser: (state, action: PayloadAction<UserState>) => {
			return {
				...state,
				...action.payload,
			};
		},
	},

	extraReducers: (builder) => {
		builder
			.addCase(createUser.pending, (state) => {
				state.loading = true;
			})

			.addCase(createUser.fulfilled, (state, action) => {
				const payload = action.payload as ResponseCreateUserDto;

				if (payload.success && payload.data) {
					return {
						...state,
						...payload.data,
						loading: false,
					};
				}
				state.loading = false;
			})

			.addCase(createUser.rejected, (state) => {
				state.loading = false;
			})

			.addCase(listUsers.pending, (state) => {
				state.loading = false;
			})

			.addCase(listUsers.fulfilled, (state, action) => {
				const payload = action.payload as ResponseCreateUserDto;

				if (payload.success && payload.data) {
					if (Array.isArray(payload.data)) {
						return {
							...state,
							...payload.data[0],
							loading: false,
						};
					}
				}
				state.loading = false;
			})

			.addCase(listUsers.rejected, (state) => {
				state.loading = false;
			})

			.addCase(getUser.pending, (state) => {
				state.loading = true;
			})

			.addCase(getUser.fulfilled, (state, action) => {
				const payload = action.payload as ResponseCreateUserDto;

				if (payload.success && payload.data) {
					return {
						...state,
						...payload.data,
						loading: false,
					};
				}
				state.loading = false;
			})

			.addCase(getUser.rejected, (state) => {
				state.loading = false;
			});
	},
});

export const { setUser } = userSlice.actions;

export default userSlice.reducer;
