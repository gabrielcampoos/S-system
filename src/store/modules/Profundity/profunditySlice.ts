import {
	createAsyncThunk,
	createEntityAdapter,
	createSlice,
	PayloadAction,
} from '@reduxjs/toolkit';
import serviceApi from '../../../configs/services/api';
import { RootState } from '../..';
import { Profundity } from '../../types';

interface ApiResponse<T> {
	message: string;
	code: number;
	success: boolean;
	data: T[];
}

// Criação do Adapter
const profundityAdapter = createEntityAdapter<Profundity>({
	selectId: (state) => state.id!, // Supondo que o ProfundityDto tenha um campo `id` único
});

// Estado inicial do Slice com o Adapter
const initialState = profundityAdapter.getInitialState({
	loading: false,
	message: '',
});

export const createProfundity = createAsyncThunk<
	Profundity[],
	{ profundities: Profundity[] }
>('profundity/create', async ({ profundities }, { rejectWithValue }) => {
	try {
		const response = await serviceApi.post(
			`/profundity`, // Incluindo o `layerId` na URL
			profundities,
		);
		return response.data; // Espera-se que a resposta seja um array de ProfundityDto
	} catch (error) {
		return rejectWithValue('Falha ao criar profundidade');
	}
});

export const fetchProfundities = createAsyncThunk<
	Profundity[],
	void,
	{ rejectValue: string }
>('profundity/fetch', async (_, { rejectWithValue }) => {
	try {
		const response =
			await serviceApi.get<ApiResponse<Profundity>>('/profundity');

		// Verifica se a resposta está no formato esperado
		if (!response.data || !Array.isArray(response.data.data)) {
			return rejectWithValue('Dados de profundidade não encontrados');
		}

		// Retorna o array de profundidades
		return response.data.data;
	} catch (error) {
		if (error instanceof Error) {
			return rejectWithValue(
				`Falha ao buscar profundidades: ${error.message}`,
			);
		}
		return rejectWithValue('Falha ao buscar profundidades');
	}
});

export const updateProfundityById = createAsyncThunk<Profundity, Profundity>(
	'profundity/update',
	async (profundity, { rejectWithValue }) => {
		try {
			const response = await serviceApi.put(
				`/profundity/${profundity.id}`,
				profundity,
			);
			return response.data;
		} catch (error) {
			return rejectWithValue('Falha ao atualizar profundidade');
		}
	},
);

export const deleteProfundityById = createAsyncThunk<string, string>(
	'profundity/delete',
	async (id, { rejectWithValue }) => {
		try {
			await serviceApi.delete(`/profundity/${id}`);
			return id;
		} catch (error) {
			return rejectWithValue('Falha ao deletar profundidade');
		}
	},
);

// Criação do Slice
const profunditySlice = createSlice({
	name: 'profundity',
	initialState,
	reducers: {
		// Reducers usando o adapter
		addProfundity: profundityAdapter.addOne,
		updateProfundity: profundityAdapter.updateOne,
		removeProfundity: profundityAdapter.removeOne,
		// Exemplo de reducers adicionais
		setLoading(state, action: PayloadAction<boolean>) {
			state.loading = action.payload;
		},
		setMessage(state, action: PayloadAction<string>) {
			state.message = action.payload;
		},
	},
	extraReducers: (builder) => {
		builder
			.addCase(fetchProfundities.pending, (state) => {
				state.loading = true;
				state.message = 'Buscando profundidades...';
			})
			.addCase(fetchProfundities.fulfilled, (state, action) => {
				state.loading = false;
				state.message = 'Profundidades carregadas com sucesso';
				profundityAdapter.setAll(state, action.payload);
			})
			.addCase(fetchProfundities.rejected, (state, action) => {
				state.loading = false;
				state.message = action.payload as string;
			})
			.addCase(createProfundity.pending, (state) => {
				state.loading = true;
				state.message = 'Criando profundidade...';
			})
			.addCase(createProfundity.fulfilled, (state, action) => {
				state.loading = false;
				state.message = 'Profundidade(s) criada(s) com sucesso';
				profundityAdapter.addMany(state, action.payload);
			})
			.addCase(createProfundity.rejected, (state, action) => {
				state.loading = false;
				state.message = action.payload as string;
			})
			.addCase(updateProfundityById.pending, (state) => {
				state.loading = true;
				state.message = 'Atualizando profundidade...';
			})
			.addCase(updateProfundityById.fulfilled, (state, action) => {
				state.loading = false;
				state.message = 'Profundidade atualizada com sucesso';
				profundityAdapter.updateOne(state, {
					id: action.payload.id!,
					changes: action.payload,
				});
			})
			.addCase(updateProfundityById.rejected, (state, action) => {
				state.loading = false;
				state.message = action.payload as string;
			})
			.addCase(deleteProfundityById.pending, (state) => {
				state.loading = true;
				state.message = 'Excluindo profundidade...';
			})
			.addCase(deleteProfundityById.fulfilled, (state, action) => {
				state.loading = false;
				state.message = 'Profundidade excluída com sucesso';
				profundityAdapter.removeOne(state, action.payload);
			})
			.addCase(deleteProfundityById.rejected, (state, action) => {
				state.loading = false;
				state.message = action.payload as string;
			});
	},
});

// Exporta os reducers e ações
export const {
	addProfundity,
	updateProfundity,
	removeProfundity,
	setLoading,
	setMessage,
} = profunditySlice.actions;

// Exporta o reducer
export default profunditySlice.reducer;

// Exporta os seletores do adapter
export const {
	selectAll: selectAllProfundities,
	selectById: selectProfundityById,
} = profundityAdapter.getSelectors((state: RootState) => state.profundity);
