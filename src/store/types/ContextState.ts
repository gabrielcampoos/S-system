export interface ContextStateFirstLine {
	isOpen: boolean;
	context: 'createFirstLine' | 'editFirstLine' | 'deleteFirstLine';
}

interface ContextStateSecondLine {
	isOpen: boolean;
	context: 'create' | 'edit' | 'delete';
}

export interface ContextStateFourthLine {
	isOpen: boolean;
	context: 'createFourthLine' | 'editFourthLine' | 'deleteFourtLine';
}

export interface ContextStateFifthLine {
	isOpen: boolean;
	context: 'createFifthLine' | 'editFifthLine' | 'deleteFifthLine';
}

export interface ContextStateSixthLine {
	isOpen: boolean;
	context: 'createSixthLine' | 'editSixthLine' | 'deleteSixthLine';
}

export interface ContextObservation {
	isOpen: boolean;
	context: 'createObservation' | 'editObservation' | 'deleteObservation';
}

export default ContextStateSecondLine;
