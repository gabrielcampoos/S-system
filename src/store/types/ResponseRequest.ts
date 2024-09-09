import { HoleDto } from './Hole';
import { HoleState } from './HoleState';
import { LayerDto } from './Layer';
import { LayerState } from './LayerState';
import { Project } from './Project';
import { ProjectState } from './ProjectState';
import { User } from './User';
import { UserState } from './UserState';

export interface ResponseCreateUserDto {
	success: boolean;
	message: string;
	data?: User;
}

export interface ResponseCreateProjectDto {
	success: boolean;
	message: string;
	data?: Project;
}

export interface ResponseCreateHoleDto {
	success: boolean;
	message: string;
	data?: HoleState & { id: string };
}

export interface ResponseCreateLayerDto {
	success: boolean;
	message: string;
	data?: LayerState & { id: string };
}

export interface ResponseListUsersDto {
	success: boolean;
	message: string;
	data?: User;
}

export interface ResponseListProjectsDto {
	success: boolean;
	message: string;
	data?: Project[];
}

export interface ResponseListHolesDto {
	success: boolean;
	message: string;
	data?: HoleDto;
}

export interface ResponseListLayersDto {
	success: boolean;
	message: string;
	data?: LayerDto;
}

export interface ResponseEditUserDto {
	success: boolean;
	message: string;
	data?: UserState[];
}

export interface ResponseEditProjectDto {
	success: boolean;
	message: string;
	data?: ProjectState[];
}

export interface ResponseEditHoleDto {
	success: boolean;
	message: string;
	data?: HoleState[];
}

export interface ResponseEditLayerDto {
	success: boolean;
	message: string;
	data?: LayerState[];
}

export interface ResponseDeleteUserDto {
	success: boolean;
	message: string;
	data?: User[];
}

export interface ResponseDeleteProjectDto {
	success: boolean;
	message: string;
	data?: Project[];
}

export interface ResponseDeleteHoleDto {
	success: boolean;
	message: string;
	data?: HoleDto[];
}

export interface ResponseDeleteLayerDto {
	success: boolean;
	message: string;
	data?: LayerDto[];
}
