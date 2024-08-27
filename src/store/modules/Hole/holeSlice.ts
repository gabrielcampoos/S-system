import {
	createAsyncThunk,
	createEntityAdapter,
	createSlice,
} from '@reduxjs/toolkit';
import { AxiosError } from 'axios';

import { RootState } from '../..';
import serviceApi from '../../../configs/services/api';
import { showNotification } from '../Notification/notificationSlice';
import {
	HoleDto,
	HoleState,
	ResponseCreateHoleDto,
	ResponseDeleteHoleDto,
	ResponseEditHoleDto,
	ResponseListHolesDto,
} from '../../types';

export const createHole = createAsyncThunk(
	'hole/create',
	async (data: HoleDto, { dispatch }) => {
		try {
			const formattedData: any = {
				...data,
				initialDate: data.initialDate
					? new Date(data.initialDate).toISOString()
					: undefined,
				finalDate: data.finalDate
					? new Date(data.finalDate).toISOString()
					: undefined,
			};

			// Remove campos que são undefined ou null se necessário
			Object.keys(formattedData).forEach((key) => {
				if (
					formattedData[key] === undefined ||
					formattedData[key] === null
				) {
					delete formattedData[key];
				}
			});
			console.log('Formatted Data:', formattedData);
			const response = await serviceApi.post('/hole', formattedData);

			dispatch(
				showNotification({
					success: response.data.success,
					message: response.data.message,
				}),
			);

			return response.data;
		} catch (error) {
			if (error instanceof AxiosError) {
				const response: ResponseCreateHoleDto = {
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

export const getHole = createAsyncThunk(
	'hole/getHole',
	async (id: string, { dispatch }) => {
		try {
			const response = await serviceApi.get(`/validateDataHole/${id}`);

			const responseApi = response.data as ResponseCreateHoleDto;
			if (responseApi.success && responseApi.data)
				dispatch(
					setHole({
						id: responseApi.data?.id,
						holeNumber: responseApi.data?.holeNumber,
						initialDate: responseApi.data?.initialDate,
						finalDate: responseApi.data?.finalDate,
						name: responseApi.data?.name,
						workDescription: responseApi.data?.workDescription,
						quota: responseApi.data?.quota,
						waterLevel: responseApi.data?.waterLevel,
						interval: responseApi.data?.interval,
						waterLevelTwo: responseApi.data?.waterLevelTwo,
						intervalTwo: responseApi.data?.intervalTwo,
						torque: responseApi.data?.torque,
						coating: responseApi.data?.coating,
						ultimateDigger: responseApi.data?.ultimateDigger,
						initialHelical: responseApi.data?.initialHelical,
						finalHelical: responseApi.data?.finalHelical,
						printSpt: responseApi.data?.printSpt,
						stop: responseApi.data?.stop,
						textPoll: responseApi.data?.textPoll,
						prober: responseApi.data?.prober,
						pageLines: responseApi.data?.pageLines,
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
				const response = error.response?.data as ResponseCreateHoleDto;

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

export const editHole = createAsyncThunk(
	'hole/edit',
	async (data: HoleDto, { dispatch }) => {
		try {
			const formattedData = {
				...data,
				initialDate: data.initialDate
					? new Date(data.initialDate).toISOString()
					: null,
				finalDate: data.finalDate
					? new Date(data.finalDate).toISOString()
					: null,
			};

			const response = await serviceApi.put(
				`/hole/${data.id}`,
				formattedData,
			);
			dispatch(
				showNotification({
					success: response.data.success,
					message: response.data.message,
				}),
			);
			return response.data;
		} catch (error) {
			if (error instanceof AxiosError) {
				const response: ResponseEditHoleDto = {
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

export const deleteHole = createAsyncThunk(
	'hole/delete',
	async (id: string, { dispatch }) => {
		try {
			const response = await serviceApi.delete(`/hole/${id}`);
			dispatch(
				showNotification({
					message: response.data.message,
					success: response.data.success,
				}),
			);
			return response.data;
		} catch (error) {
			if (error instanceof AxiosError) {
				const response: ResponseDeleteHoleDto = {
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

export const listHole = createAsyncThunk(
	'hole/list',
	async (_, { dispatch }) => {
		try {
			const response = await serviceApi(`/hole`);

			dispatch(
				showNotification({
					success: response.data.success,
					message: response.data.message,
				}),
			);

			return response.data;
		} catch (error) {
			if (error instanceof AxiosError) {
				const response: ResponseListHolesDto = {
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

const holeAdapter = createEntityAdapter<HoleState>({
	selectId: (state) => state.id,
});

export const { selectAll: listAllHoles } = holeAdapter.getSelectors(
	(global: RootState) => global.hole,
);

const holeSlice = createSlice({
	name: 'hole',
	initialState: holeAdapter.getInitialState({
		loading: false,
		message: '',
	}),
	reducers: {
		refresh(state) {
			return { ...state };
		},
		setHole: (state, action) => {
			return {
				...state,
				hole: {
					id: action.payload.id,
					holeNumber: action.payload.holeNumber,
					initialDate: action.payload.initialDate,
					finalDate: action.payload.finalDate,
					name: action.payload.name,
					workDescription: action.payload.workDescription,
					quota: action.payload.quota,
					waterLevel: action.payload.waterLevel,
					interval: action.payload.interval,
					waterLevelTwo: action.payload.waterLevelTwo,
					intervalTwo: action.payload.intervalTwo,
					torque: action.payload.torque,
					coating: action.payload.coating,
					ultimateDigger: action.payload.ultimateDigger,
					initialHelical: action.payload.initialHelical,
					finalHelical: action.payload.finalHelical,
					printSpt: action.payload.printSpt,
					stop: action.payload.stop,
					textPoll: action.payload.textPoll,
					prober: action.payload.prober,
					pageLines: action.payload.pageLines,
				},
			};
		},
	},
	extraReducers: (builder) => {
		builder.addCase(listHole.pending, (state) => {
			state.loading = true;
			state.message = 'Carregando buracos.';
		});

		builder.addCase(listHole.fulfilled, (state, action) => {
			const { message, data } = action.payload;
			state.loading = false;
			state.message = message;

			if (!data || data.length === 0) {
				state.message = 'Nada encontrado';
				return;
			}
			holeAdapter.setAll(state, data);
		});

		builder.addCase(createHole.pending, (state) => {
			state.loading = true;
			state.message = 'Criando buraco...';
		});

		builder.addCase(createHole.fulfilled, (state, action) => {
			const { data, message } = action.payload;
			state.loading = false;
			state.message = message;

			if (!data?.id) {
				return;
			}

			holeAdapter.addOne(state, data);
		});

		builder.addCase(createHole.rejected, (state) => {
			state.loading = false;
			state.message = 'Buraco não criado.';
		});

		builder.addCase(editHole.pending, (state) => {
			state.loading = true;
			state.message = 'Atualizando buraco...';
		});
		builder.addCase(editHole.fulfilled, (state, action) => {
			const { message, data } = action.payload;
			state.loading = false;
			state.message = message;

			if (!data || !data.id) {
				return;
			}

			holeAdapter.updateOne(state, {
				id: data.id,
				changes: data,
			});
		});
		builder.addCase(editHole.rejected, (state) => {
			state.loading = false;
			state.message = 'Buraco não atualizado.';
		});

		builder.addCase(deleteHole.pending, (state) => {
			state.loading = true;
			state.message = 'Apagando buraco...';
		});
		builder.addCase(deleteHole.fulfilled, (state, action) => {
			const { message, success, data } = action.payload;
			state.loading = false;
			state.message = message;

			if (success) {
				holeAdapter.removeOne(state, data);
			}
		});
		builder.addCase(deleteHole.rejected, (state) => {
			state.loading = false;
			state.message = 'Buraco não apagado.';
		});
	},
});

export default holeSlice.reducer;
export const { refresh, setHole } = holeSlice.actions;
