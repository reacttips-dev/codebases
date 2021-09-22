/* eslint-disable complexity */
import UnreachableCaseError from 'Errors/UnreachableCaseError';

type Action =
	| { readonly type: 'showErrorMessage' }
	| { readonly type: 'hideErrorMessage' }
	| { readonly type: 'openSidebar'; readonly leadUuid: string }
	| { readonly type: 'closeSidebar' }
	| { readonly type: 'openSidebarBulk' }
	| { readonly type: 'closeSidebarBulk' }
	| { readonly type: 'reset' }
	| { readonly type: 'setIsVisible'; readonly isVisible: boolean }
	| { readonly type: 'openReportBadLeadsModal' }
	| { readonly type: 'closeReportBadLeadsModal' };

export type State = {
	readonly errorMessage: {
		readonly isVisible: boolean;
	};
	readonly sidebar: {
		readonly leadUuid: string | null;
		readonly isVisible: boolean;
		readonly isOverlaid: boolean;
	};
	readonly sidebarBulk: {
		readonly isVisible: boolean;
	};
	readonly coachmark: {
		readonly isVisible: boolean;
	};
	readonly reportBadLeadsModal: {
		readonly isVisible: boolean;
	};
};

export const defaultState = {
	errorMessage: {
		isVisible: false,
	},
	sidebar: {
		leadUuid: null,
		isVisible: false,
		isOverlaid: false,
	},
	sidebarBulk: {
		isVisible: false,
	},
	coachmark: {
		isVisible: false,
	},
	reportBadLeadsModal: {
		isVisible: false,
	},
};

export function uiContextReducer(state: State, action: Action): State {
	switch (action.type) {
		case 'showErrorMessage':
			return {
				...state,
				errorMessage: {
					...state.errorMessage,
					isVisible: true,
				},
			};
		case 'hideErrorMessage':
			return {
				...state,
				errorMessage: {
					...state.errorMessage,
					isVisible: false,
				},
			};
		case 'openSidebar':
			return {
				...state,
				sidebar: {
					...state.sidebar,
					leadUuid: action.leadUuid,
					isVisible: true,
				},
			};
		case 'closeSidebar':
			return {
				...state,
				sidebar: {
					...state.sidebar,
					leadUuid: null,
					isVisible: false,
				},
			};
		case 'openSidebarBulk':
			return {
				...state,
				sidebarBulk: {
					...state.sidebarBulk,
					isVisible: true,
				},
			};
		case 'closeSidebarBulk':
			return {
				...state,
				sidebarBulk: {
					...state.sidebarBulk,
					isVisible: false,
				},
			};
		case 'setIsVisible':
			return {
				...state,
				coachmark: {
					...state.coachmark,
					isVisible: action.isVisible,
				},
			};
		case 'openReportBadLeadsModal': {
			return {
				...state,
				reportBadLeadsModal: {
					...state.reportBadLeadsModal,
					isVisible: true,
				},
			};
		}
		case 'closeReportBadLeadsModal': {
			return {
				...state,
				reportBadLeadsModal: {
					...state.reportBadLeadsModal,
					isVisible: false,
				},
			};
		}
		case 'reset':
			return defaultState;
		default:
			throw new UnreachableCaseError(action);
	}
}
