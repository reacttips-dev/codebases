import React, { useContext, useState } from 'react';

import { SnackbarProps, SnackbarMessage } from './SnackbarMessage';

type SnackbarState = Omit<SnackbarProps, 'onDismiss'>;

export type Snackbar = {
	readonly setProps: (props: SnackbarState) => void;
};

const defaultState: SnackbarState = {
	message: '',
	actionText: undefined,
	onClick: undefined,
};

export const SnackbarContext = React.createContext<Snackbar>({
	setProps: () => undefined,
});

export const useSnackbar = () => {
	const context = useContext(SnackbarContext);
	if (!context) {
		throw new Error('Snackbar Context not found');
	}

	return context;
};

export const SnackbarProvider: React.FC = ({ children }) => {
	const [snackbarProps, setSnackbarProps] = useState<SnackbarState>(defaultState);

	const setProps = (props: SnackbarState) => {
		setSnackbarProps(props);
	};

	const onDismiss = () => {
		setSnackbarProps({ message: '' });
	};

	return (
		<SnackbarContext.Provider value={{ setProps }}>
			{children}
			<SnackbarMessage {...snackbarProps} onDismiss={onDismiss} />
		</SnackbarContext.Provider>
	);
};
