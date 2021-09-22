import React, { useReducer, useState } from 'react';
import { Dialog, DialogProvider, useDialog } from 'Components/Dialog/DialogContext';
import { Snackbar, SnackbarProvider, useSnackbar } from 'Components/SnackbarMessage/SnackbarContext';

import { uiContextReducer, defaultState } from './UIContextReducer';

type Coachmark = {
	isVisible: boolean;
	setIsVisible: (isVisible: boolean) => void;
};

type InFlight = {
	isActive: boolean;
	setIsActive: (isActive: boolean) => void;
};

type ContextType = {
	readonly errorMessage: Hideable;
	readonly snackBar: Snackbar;
	readonly bulkSidebar: Hideable;
	readonly dialog: Dialog;
	readonly reset: () => void;
	readonly coachmark: Coachmark;
	readonly inFlight: InFlight;
	readonly reportBadLeadsModal: Hideable;
};

// Used for things which can be displayed/hidden on demand.
type Hideable = {
	readonly isVisible: boolean;
	readonly hide: () => void;
	readonly show: () => void;
};

const hideableDefaults = {
	isVisible: false,
	hide: () => undefined,
	show: () => undefined,
};

export const defaultContextValue: ContextType = {
	errorMessage: hideableDefaults,
	snackBar: {
		setProps: () => undefined,
	},
	bulkSidebar: hideableDefaults,
	dialog: {
		show: () => undefined,
		hide: () => undefined,
	},
	reset: () => undefined,
	coachmark: {
		isVisible: false,
		setIsVisible: () => undefined,
	},
	inFlight: {
		isActive: false,
		setIsActive: () => undefined,
	},
	reportBadLeadsModal: hideableDefaults,
};

export const UIContext = React.createContext<ContextType>(defaultContextValue);

type Props = {
	readonly children: React.ReactNode;
	readonly defaultValue?: Partial<ContextType>;
};

/**
 * This provider takes care of any global UI action (open modals, snackbars, ...) which can be
 * controlled imperatively from any place in the application.
 */
export function UIContextReducer({ children, defaultValue }: Props) {
	const [state, dispatch] = useReducer(uiContextReducer, defaultState);
	const [isInFlightActive, setInFlightActive] = useState(false);
	const snackBar = useSnackbar();
	const dialog = useDialog();

	const contextValue = {
		dialog,
		snackBar,
		errorMessage: defaultValue?.errorMessage ?? {
			isVisible: state.errorMessage.isVisible,
			show: () => dispatch({ type: 'showErrorMessage' }),
			hide: () => dispatch({ type: 'hideErrorMessage' }),
		},
		bulkSidebar: {
			isVisible: state.sidebarBulk.isVisible,
			show: () => dispatch({ type: 'openSidebarBulk' }),
			hide: () => dispatch({ type: 'closeSidebarBulk' }),
		},

		reset: () => {
			dialog.hide();
			dispatch({ type: 'reset' });
		},
		coachmark: defaultValue?.coachmark ?? {
			isVisible: state.coachmark.isVisible,
			setIsVisible: (isVisible: boolean) => {
				dispatch({ type: 'setIsVisible', isVisible });
			},
		},
		inFlight: {
			isActive: isInFlightActive,
			setIsActive: setInFlightActive,
		},
		reportBadLeadsModal: {
			isVisible: state.reportBadLeadsModal.isVisible,
			show: () => dispatch({ type: 'openReportBadLeadsModal' }),
			hide: () => dispatch({ type: 'closeReportBadLeadsModal' }),
		},
	};

	return <UIContext.Provider value={contextValue}>{children}</UIContext.Provider>;
}

/**
 *
 * This is wrapper on top of ContextUI and it allows context to access
 * other providers, to unifying them into one single Context
 */

export function UIContextProvider({ children, defaultValue }: Props) {
	return (
		<DialogProvider>
			<SnackbarProvider>
				<UIContextReducer defaultValue={defaultValue}>{children}</UIContextReducer>
			</SnackbarProvider>
		</DialogProvider>
	);
}

export const UIContextConsumer = UIContext.Consumer;
