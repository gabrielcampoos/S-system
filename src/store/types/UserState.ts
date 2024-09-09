import { Project } from './Project';
import { User } from './User';

export interface UserState {
	id: string;
	username: string;
	projects: Project[];
	loading: boolean;
}
