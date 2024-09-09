import {
	createAsyncThunk,
	createEntityAdapter,
	createSlice,
	PayloadAction,
} from '@reduxjs/toolkit';
import { AxiosError } from 'axios';

import { RootState } from '../..';
import serviceApi from '../../../configs/services/api';
import { showNotification } from '../Notification/notificationSlice';
import {
	LayerDto,
	LayerState,
	ResponseCreateLayerDto,
	ResponseDeleteLayerDto,
	ResponseEditLayerDto,
	ResponseListLayersDto,
} from '../../types';

// Define a type for the API response data
interface ApiResponse<T> {
	success: boolean;
	message: string;
	data?: T;
}

const layerAdapter = createEntityAdapter<LayerDto>({
	selectId: (state) => state.id!,
});

const initialState: LayerState = {
	loading: false,
	message: '',
	currentLayers: null,
	selectedLayers: {},
	selectedLayerId: null,
	...layerAdapter.getInitialState(),
};

export const createLayer = createAsyncThunk<
	ApiResponse<LayerDto>,
	{ holeId: string; data: LayerDto }
>('layer/create', async ({ holeId, data }, { dispatch, rejectWithValue }) => {
	try {
		const formattedData: any = [
			{
				...data,
				// Any necessary formatting for dates or other fields
			},
		];

		const response = await serviceApi.post(
			`/layer/${holeId}`,
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
			const response = error.response?.data as ApiResponse<LayerDto>;
			dispatch(
				showNotification({
					message: response.message,
					success: false,
				}),
			);
			return rejectWithValue(response);
		}
		return rejectWithValue({
			success: false,
			message: 'Algo de errado não está certo. A requisição falhou.',
		});
	}
});

export const getLayer = createAsyncThunk<ApiResponse<LayerDto[]>, string>(
	'layer/getLayer',
	async (id: string, { dispatch, rejectWithValue }) => {
		try {
			const response = await serviceApi.get(`/validateDataLayer/${id}`);
			const responseApi = response.data as ApiResponse<LayerDto[]>;

			dispatch(setLayers(responseApi.data || []));

			dispatch(
				showNotification({
					message: responseApi.message,
					success: responseApi.success,
				}),
			);

			return responseApi;
		} catch (error) {
			if (error instanceof AxiosError) {
				const response = error.response?.data as ApiResponse<
					LayerDto[]
				>;

				dispatch(
					showNotification({
						message: response.message,
						success: false,
					}),
				);

				return rejectWithValue(response);
			}

			return rejectWithValue({
				success: false,
				message: 'Erro inesperado.',
			});
		}
	},
);

export const editLayer = createAsyncThunk<ApiResponse<LayerDto>, LayerDto>(
	'layer/edit',
	async (data: LayerDto, { dispatch, rejectWithValue }) => {
		try {
			const response = await serviceApi.put(`/layer/${data.id}`, data);
			dispatch(
				showNotification({
					success: response.data.success,
					message: response.data.message,
				}),
			);
			return response.data;
		} catch (error) {
			if (error instanceof AxiosError) {
				const response = error.response?.data as ApiResponse<LayerDto>;
				dispatch(
					showNotification({
						message: response.message,
						success: false,
					}),
				);
				return rejectWithValue(response);
			}
			return rejectWithValue({
				success: false,
				message: 'Algo de errado não está certo. A requisição falhou.',
			});
		}
	},
);

export const deleteLayer = createAsyncThunk<ApiResponse<null>, string>(
	'layer/delete',
	async (id: string, { dispatch, rejectWithValue }) => {
		try {
			const response = await serviceApi.delete(`/layer/${id}`);
			dispatch(
				showNotification({
					message: response.data.message,
					success: response.data.success,
				}),
			);
			return response.data;
		} catch (error) {
			if (error instanceof AxiosError) {
				const response = error.response?.data as ApiResponse<null>;
				dispatch(
					showNotification({
						message: response.message,
						success: false,
					}),
				);
				return rejectWithValue(response);
			}
			return rejectWithValue({
				success: false,
				message: 'Algo de errado não está certo. A requisição falhou.',
			});
		}
	},
);

export const listLayersByHoleId = createAsyncThunk<
	ApiResponse<LayerDto[]>,
	string
>(
	'layer/listByHoleId',
	async (holeId: string, { dispatch, rejectWithValue }) => {
		try {
			const response = await serviceApi.get(`/layer/${holeId}`);
			return response.data;
		} catch (error) {
			if (error instanceof AxiosError) {
				const response = error.response?.data as ApiResponse<null>;
				dispatch(
					showNotification({
						message: response.message,
						success: false,
					}),
				);
				return rejectWithValue(response);
			}
			return rejectWithValue({
				success: false,
				message: 'Erro inesperado.',
			});
		}
	},
);

export const listLayers = createAsyncThunk<
	ApiResponse<LayerDto[]>,
	string,
	{ rejectValue: ApiResponse<null> }
>('layer/list', async (holeId, { dispatch, rejectWithValue }) => {
	try {
		const response = await serviceApi.get(`/layer/${holeId}`);
		dispatch(
			showNotification({
				success: response.data.success,
				message: response.data.message,
			}),
		);
		return response.data;
	} catch (error) {
		if (error instanceof AxiosError) {
			const response = error.response?.data as ApiResponse<null>;
			dispatch(
				showNotification({
					message: response.message,
					success: false,
				}),
			);
			return rejectWithValue(response);
		}
		return rejectWithValue({
			success: false,
			message: 'Algo de errado não está certo. A requisição falhou.',
		});
	}
});

const layerSlice = createSlice({
	name: 'layer',
	initialState,
	reducers: {
		setLayers: layerAdapter.setAll,
		addLayer: layerAdapter.addOne,
		removeLayer: layerAdapter.removeOne,
		selectLayer: (state, action: PayloadAction<LayerDto>) => {
			const layer = action.payload;
			state.selectedLayers[layer.id!] = layer;
		},
		deselectLayer: (state, action: PayloadAction<string>) => {
			delete state.selectedLayers[action.payload];
		},
		setCurrentLayers(state, action: PayloadAction<LayerDto[] | null>) {
			state.currentLayers = action.payload;
		},
		clearCurrentLayers(state) {
			state.currentLayers = null;
		},
		setSelectedLayers(
			state,
			action: PayloadAction<{ [key: string]: LayerDto }>,
		) {
			state.selectedLayers = action.payload;
		},
		clearSelectedLayers(state) {
			state.selectedLayers = {};
		},
		setSelectedLayerId: (state, action: PayloadAction<string | null>) => {
			state.selectedLayerId = action.payload;
		},
		clearSelectedLayerId: (state) => {
			state.selectedLayerId = null;
		},
	},
	extraReducers: (builder) => {
		builder.addCase(listLayers.pending, (state) => {
			state.loading = true;
			state.message = 'Carregando camadas.';
		});

		builder.addCase(listLayers.fulfilled, (state, action) => {
			state.loading = false;
			state.message = action.payload.message;

			if (!action.payload.data || action.payload.data.length === 0) {
				state.message = 'Nada encontrado';
				return;
			}
			layerAdapter.setAll(state, action.payload.data);

			state.currentLayers = action.payload.data;
		});

		builder.addCase(createLayer.pending, (state) => {
			state.loading = true;
			state.message = 'Criando camada...';
		});

		builder.addCase(createLayer.fulfilled, (state, action) => {
			state.loading = false;
			state.message = action.payload.message;

			if (action.payload.data) {
				layerAdapter.addOne(state, action.payload.data);
			}
		});

		builder.addCase(createLayer.rejected, (state) => {
			state.loading = false;
			state.message = 'Camada não criada.';
		});

		builder.addCase(editLayer.pending, (state) => {
			state.loading = true;
			state.message = 'Atualizando camada...';
		});

		builder.addCase(editLayer.fulfilled, (state, action) => {
			state.loading = false;
			state.message = action.payload.message;

			if (action.payload.data) {
				layerAdapter.updateOne(state, {
					id: action.payload.data.id!,
					changes: action.payload.data,
				});
			}
		});

		builder.addCase(editLayer.rejected, (state) => {
			state.loading = false;
			state.message = 'Camada não atualizada.';
		});

		builder.addCase(deleteLayer.pending, (state) => {
			state.loading = true;
			state.message = 'Apagando camada...';
		});

		builder.addCase(deleteLayer.fulfilled, (state, action) => {
			state.loading = false;
			state.message = action.payload.message;

			if (action.payload.success) {
				layerAdapter.removeOne(state, action.meta.arg); // Remove by ID
			}
		});

		builder.addCase(deleteLayer.rejected, (state) => {
			state.loading = false;
			state.message = 'Camada não apagada.';
		});
	},
});

export default layerSlice.reducer;
export const {
	setLayers,
	addLayer,
	removeLayer,
	selectLayer,
	deselectLayer,
	setCurrentLayers,
	clearCurrentLayers,
	setSelectedLayers,
	clearSelectedLayers,
	setSelectedLayerId,
	clearSelectedLayerId,
} = layerSlice.actions;
export const { selectAll: selectAllLayers, selectById: selectLayerById } =
	layerAdapter.getSelectors((state: RootState) => state.layer);
