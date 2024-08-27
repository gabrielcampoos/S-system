import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { AxiosError } from 'axios';

import serviceApi from '../../../configs/services/api';
import { ResponseCreateProjectDto, ResponseCreateUserDto } from '../../types';
import { Project } from '../../types/Project';
import { showNotification } from '../Notification/notificationSlice';

const initialState = {
	project: {
		id: '',
		projectNumber: '',
		client: '',
		projectAlphanumericNumber: '',
		workDescription: '',
		workSite: '',
		releaseDate: '',
		initialDate: '',
		finalDate: '',
		headerText: '',
	},
	loading: false,
};

export const createProject = createAsyncThunk(
	'project/create',
	async (newProject: Project, { dispatch }) => {
		try {
			const response = await serviceApi.post('/project', newProject);

			const responseApi = response.data as ResponseCreateProjectDto;

			dispatch(
				showNotification({
					message: responseApi.message,
					success: responseApi.success,
				}),
			);

			return responseApi;
		} catch (error) {
			if (error instanceof AxiosError) {
				const response = error.response
					?.data as ResponseCreateProjectDto;

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

export const listProjects = createAsyncThunk(
	'project/list',
	async (_, { dispatch }) => {
		try {
			const response = await serviceApi.get('/project');

			const responseApi = response.data as ResponseCreateProjectDto;

			dispatch(
				showNotification({
					message: responseApi.message,
					success: responseApi.success,
				}),
			);

			return responseApi;
		} catch (error) {
			if (error instanceof AxiosError) {
				const response = error.response
					?.data as ResponseCreateProjectDto;

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

export const getProject = createAsyncThunk(
	'project/getProject',
	async (id: string, { dispatch }) => {
		try {
			const response = await serviceApi.get(`/validateDataProject/${id}`);

			const responseApi = response.data as ResponseCreateProjectDto;
			if (responseApi.success && responseApi.data)
				dispatch(
					setProject({
						id: responseApi.data?.id,
						projectNumber: responseApi.data?.id,
						client: responseApi.data?.client,
						projectAlphanumericNumber:
							responseApi.data?.projectAlphanumericNumber,
						workDescription: responseApi.data?.workDescription,
						workSite: responseApi.data?.workSite,
						releaseDate: new Date(responseApi.data?.releaseDate),
						initialDate: new Date(responseApi.data?.initialDate),
						finalDate: new Date(responseApi.data?.finalDate),
						headerText: responseApi.data?.headerText,
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
				const response = error.response
					?.data as ResponseCreateProjectDto;

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

export const projectSlice = createSlice({
	name: 'project',
	initialState: initialState,
	reducers: {
		setProject: (state, action) => {
			return {
				...state,
				project: {
					id: action.payload.id,
					projectNumber: action.payload.projectNumber,
					client: action.payload.client,
					projectAlphanumericNumber:
						action.payload.projectAlphanumericNumber,
					workDescription: action.payload.workDescription,
					workSite: action.payload.workSite,
					releaseDate: action.payload.releaseDate,
					initialDate: action.payload.initialDate,
					finalDate: action.payload.finalDate,
					headerText: action.payload.headerText,
				},
			};
		},
	},

	extraReducers: (builder) => {
		builder.addCase(createProject.pending, (state) => {
			return {
				...state,
				loading: true,
			};
		});

		builder.addCase(createProject.fulfilled, (state, action) => {
			const payload = action.payload as ResponseCreateProjectDto;

			if (payload.success && payload.data) {
				return {
					project: {
						id: payload.data?.id,
						projectNumber: payload.data.projectNumber,
						client: payload.data.client,
						projectAlphanumericNumber:
							payload.data.projectAlphanumericNumber,
						workDescription: payload.data.workDescription,
						workSite: payload.data.workSite,
						releaseDate: payload.data.releaseDate,
						initialDate: payload.data.initialDate,
						finalDate: payload.data.finalDate,
						headerText: payload.data.headerText,
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

		builder.addCase(createProject.rejected, (state) => {
			return {
				...state,
				loading: false,
			};
		});

		builder.addCase(listProjects.pending, (state) => {
			return {
				...state,
				loading: true,
			};
		});

		builder.addCase(listProjects.fulfilled, (state, action) => {
			const payload = action.payload as ResponseCreateProjectDto;

			if (payload.success && payload.data) {
				return {
					project: {
						id: payload.data?.id,
						projectNumber: payload.data.projectNumber,
						client: payload.data.client,
						projectAlphanumericNumber:
							payload.data.projectAlphanumericNumber,
						workDescription: payload.data.workDescription,
						workSite: payload.data.workSite,
						releaseDate: payload.data.releaseDate,
						initialDate: payload.data.initialDate,
						finalDate: payload.data.finalDate,
						headerText: payload.data.headerText,
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

		builder.addCase(listProjects.rejected, (state) => {
			return {
				...state,
				loading: false,
			};
		});

		builder.addCase(getProject.pending, (state) => {
			return {
				...state,
				loading: true,
			};
		});

		builder.addCase(getProject.fulfilled, (state, action) => {
			const payload = action.payload as ResponseCreateProjectDto;

			if (payload.success && payload.data) {
				return {
					project: {
						id: payload.data.id,
						projectNumber: payload.data.projectNumber,
						client: payload.data.client,
						projectAlphanumericNumber:
							payload.data.projectAlphanumericNumber,
						workDescription: payload.data.workDescription,
						workSite: payload.data.workSite,
						releaseDate: payload.data.releaseDate,
						initialDate: payload.data.initialDate,
						finalDate: payload.data.finalDate,
						headerText: payload.data.headerText,
					},
					loading: false,
				};
			}

			if (!payload.success) {
				return initialState;
			}
		});

		builder.addCase(getProject.rejected, () => {
			return initialState;
		});
	},
});

export const { setProject } = projectSlice.actions;

export default projectSlice.reducer;
