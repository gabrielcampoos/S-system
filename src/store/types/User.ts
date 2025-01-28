import { Project } from './Project';

export interface User {
	id?: string;
	username: string;
	projects?: Project[];
	createdAt: Date;
}
