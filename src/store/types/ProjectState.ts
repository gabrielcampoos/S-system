export interface ProjectState {
	id: string;
	projectNumber: string;
	client: string;
	projectAlphanumericNumber: string;
	workDescription: string;
	workSite: string;
	releaseDate: string;
	initialDate: string;
	finalDate: string;
	headerText: string;
	holes?: [];
	userId: string;
}
