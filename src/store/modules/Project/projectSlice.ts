import {
	createAsyncThunk,
	createEntityAdapter,
	createSelector,
	createSlice,
} from '@reduxjs/toolkit';
import { AxiosError } from 'axios';

import serviceApi from '../../../configs/services/api';
import {
	ResponseCreateProjectDto,
	ResponseCreateUserDto,
	ResponseListProjectsDto,
} from '../../types';
import { Project } from '../../types/Project';
import { showNotification } from '../Notification/notificationSlice';
import { RootState } from '../..';

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
		holes: [],
		userId: '',
	} as Project,
	projects: [] as Project[],
	loading: false,
};

export const createProject = createAsyncThunk(
	'project/create',
	async (newProject: Project, { dispatch }) => {
		try {
			const response = await serviceApi.post(
				`/project/${newProject.userId}`,
				newProject,
			);

			const responseApi = response.data as ResponseCreateProjectDto;

			dispatch(
				showNotification({
					message: responseApi.message,
					success: responseApi.success,
				}),
			);

			return responseApi.data as Project;
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

				return null;
			}

			return null;
		}
	},
);

export const listProjects = createAsyncThunk(
	'project/list',
	async (userId: string, { dispatch }) => {
		try {
			const response = await serviceApi.get(`/project/${userId}`);

			const responseApi = response.data as ResponseListProjectsDto;

			dispatch(
				showNotification({
					message: responseApi.message,
					success: responseApi.success,
				}),
			);

			return responseApi.data as Project[];
		} catch (error) {
			if (error instanceof AxiosError) {
				const response = error.response
					?.data as ResponseListProjectsDto;

				dispatch(
					showNotification({
						message: response.message,
						success: response.success,
					}),
				);

				return [];
			}

			return [];
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
				dispatch(setProject(responseApi.data as Project));

			dispatch(
				showNotification({
					message: responseApi.message,
					success: responseApi.success,
				}),
			);

			return responseApi.data as Project;
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

				return null;
			}

			return null;
		}
	},
);

const projectsAdapter = createEntityAdapter<Project>({
	selectId: (project) => project.id ?? '',
	sortComparer: (a, b) => a.projectNumber.localeCompare(b.projectNumber),
});

export const { selectAll: selectAllProjects, selectById: selectProjectById } =
	projectsAdapter.getSelectors((state: RootState) => state.projects);

export const selectProjectsByUserId = (userId: string) =>
	createSelector([selectAllProjects], (projects) =>
		projects.filter((project) => project.userId === userId),
	);

export const projectSlice = createSlice({
	name: 'project',
	initialState: projectsAdapter.getInitialState({
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
			holes: [],
			userId: '',
		} as Project,
		loading: false,
	}),
	reducers: {
		setProject: (state, action) => {
			state.project = action.payload;
		},
	},

	extraReducers: (builder) => {
		builder.addCase(createProject.pending, (state) => {
			state.loading = true;
		});

		builder.addCase(createProject.fulfilled, (state, action) => {
			const project = action.payload as Project;

			if (project) {
				state.project = project;
				projectsAdapter.addOne(state, project);
			}
			state.loading = false;
		});

		builder.addCase(createProject.rejected, (state) => {
			state.loading = false;
		});

		builder.addCase(listProjects.pending, (state) => {
			state.loading = true;
		});

		builder.addCase(listProjects.fulfilled, (state, action) => {
			const projects = action.payload as Project[];

			projectsAdapter.setAll(state, projects);
			state.loading = false;
		});

		builder.addCase(listProjects.rejected, (state) => {
			state.loading = false;
		});

		builder.addCase(getProject.pending, (state) => {
			state.loading = true;
		});

		builder.addCase(getProject.fulfilled, (state, action) => {
			const project = action.payload as Project;

			if (project) {
				state.project = project;
				projectsAdapter.upsertOne(state, project);
			}
			state.loading = false;
		});

		builder.addCase(getProject.rejected, (state) => {
			state.loading = false;
		});
	},
});

export const { setProject } = projectSlice.actions;

export default projectSlice.reducer;
