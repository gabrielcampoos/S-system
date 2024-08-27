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
	ResponseCreateProjectDto,
	ResponseCreateUserDto,
	ResponseDeleteProjectDto,
	ResponseDeleteUserDto,
	ResponseEditProjectDto,
	ResponseEditUserDto,
	ResponseListProjectsDto,
	ResponseListUsersDto,
	User,
	UserState,
} from '../../types';
import { Project } from '../../types/Project';
import { ProjectState } from '../../types/ProjectState';

interface ProjectResponse {
	data: Project[];
}

export const projectCreate = createAsyncThunk(
	'project/create',
	async (newProject: Project, { dispatch }) => {
		try {
			const response = await serviceApi.post('/project', newProject);

			dispatch(
				showNotification({
					success: response.data.success,
					message: response.data.message,
				}),
			);

			return response.data;
		} catch (error) {
			if (error instanceof AxiosError) {
				const response: ResponseCreateProjectDto = {
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

export const projectList = createAsyncThunk(
	'project/projectList',
	async (_, { dispatch }) => {
		try {
			const response = await serviceApi.get('/project');

			dispatch(
				showNotification({
					message: response.data?.message,
					success: response.data?.success,
				}),
			);

			return response.data;
		} catch (error) {
			if (error instanceof AxiosError) {
				const response: ResponseListProjectsDto = {
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

export const projectDelete = createAsyncThunk(
	'project/delete',
	async (data: string, { dispatch }) => {
		try {
			const response = await serviceApi.delete(`/project/${data}`);

			dispatch(
				showNotification({
					success: response.data.success,
					message: response.data.message,
				}),
			);

			return response.data;
		} catch (error) {
			if (error instanceof AxiosError) {
				const response: ResponseDeleteProjectDto = {
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

export const getProjectById = createAsyncThunk<ProjectResponse, string>(
	'project/getProjectById',
	async (data: string) => {
		const response = await fetch(`/project/${data}`);
		return response.json() as Promise<ProjectResponse>;
	},
);

export const projectEdit = createAsyncThunk(
	'project/edit',
	async (data: Project, { dispatch }) => {
		try {
			const response = await serviceApi.put(`/project/${data.id}`, data);
			dispatch(
				showNotification({
					success: response.data.success,
					message: response.data.message,
				}),
			);
			return response.data;
		} catch (error) {
			if (error instanceof AxiosError) {
				const response: ResponseEditProjectDto = {
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

const projectAdapter = createEntityAdapter<ProjectState>({
	selectId: (state) => state.id,
});

export const { selectAll: listAllProjects } = projectAdapter.getSelectors(
	(global: RootState) => global.projects,
);

const projectSlice = createSlice({
	name: 'project',
	initialState: projectAdapter.getInitialState({
		loading: false,
		message: '',
	}),
	reducers: {
		refresh(state) {
			return { ...state };
		},
	},

	extraReducers: (builder) => {
		builder.addCase(projectList.pending, (state) => {
			state.loading = true;
			state.message = 'Carregando projetos.';
		});

		builder.addCase(projectList.fulfilled, (state, action) => {
			const { message, data } = action.payload;

			state.loading = false;
			state.message = message;

			if (!data || data.length === 0) {
				state.message = 'Nada encontrado.';
				return;
			}

			projectAdapter.setAll(state, data);
		});

		builder.addCase(projectCreate.pending, (state) => {
			state.loading = true;
			state.message = 'Carregando projetos.';
		});

		builder.addCase(projectCreate.fulfilled, (state, action) => {
			const { message, data } = action.payload;

			state.loading = false;
			state.message = message;

			if (!data?.id) {
				console.log(action.payload);
				return;
			}

			projectAdapter.addOne(state, data);
		});

		builder.addCase(projectCreate.rejected, (state) => {
			state.loading = false;
			state.message = 'Projeto não criado.';
		});

		builder.addCase(projectEdit.pending, (state) => {
			state.loading = true;
			state.message = 'Atualizando projetos...';
		});
		builder.addCase(projectEdit.fulfilled, (state, action) => {
			const { message, data } = action.payload;
			state.loading = false;
			state.message = message;

			if (!data || !data.id) {
				return;
			}

			projectAdapter.updateOne(state, {
				id: data.id,
				changes: data,
			});
		});
		builder.addCase(projectEdit.rejected, (state) => {
			state.loading = false;
			state.message = 'Projeto não atualizado.';
		});

		builder.addCase(projectDelete.pending, (state) => {
			state.loading = true;
			state.message = 'Excluindo projeto...';
		});
		builder.addCase(projectDelete.fulfilled, (state, action) => {
			const { message, success, data } = action.payload;
			state.loading = false;
			state.message = message;

			if (success) {
				projectAdapter.removeOne(state, data);
			}
		});
		builder.addCase(projectDelete.rejected, (state) => {
			state.loading = false;
			state.message = 'Projeto não excluido.';
		});
	},
});

export default projectSlice.reducer;
export const { refresh } = projectSlice.actions;
