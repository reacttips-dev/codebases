import { Dialog, DialogProps } from 'Components/Dialog/Dialog';
import React, { useContext, useState } from 'react';

type DialogState = Omit<DialogProps, 'onClose'>;

export type Dialog = {
	readonly show: (props: DialogState) => void;
	readonly hide: () => void;
};

const defaultState: DialogState = {
	visible: false,
	isLoading: false,
	onConfirm: () => undefined,
	color: 'red' as const,
};

export const DialogContext = React.createContext<Dialog>({
	show: () => undefined,
	hide: () => undefined,
});

export const useDialog = () => {
	const context = useContext(DialogContext);
	if (!context) {
		throw new Error('Dialog Context not found');
	}

	return context;
};

export const DialogProvider: React.FC = ({ children }) => {
	const [dialogProps, setDialogProps] = useState<DialogState>(defaultState);

	const show = (newProps: DialogState) => {
		setDialogProps((prevState) => ({
			...prevState,
			visible: true,
			...newProps,
		}));
	};
	const hide = () => {
		// this should essentially be a reset
		setDialogProps(defaultState);
	};

	return (
		<DialogContext.Provider value={{ ...dialogProps, show, hide }}>
			{children}
			<Dialog {...dialogProps} onClose={hide} />
		</DialogContext.Provider>
	);
};
