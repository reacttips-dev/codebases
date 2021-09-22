import React from 'react';
import { Dialog as DialogCui, Button, Text } from '@pipedrive/convention-ui-react';
import { useTranslator } from '@pipedrive/react-utils';

export type DialogProps = {
	readonly color?: 'blue' | 'green' | 'red' | 'ghost' | undefined;
	readonly confirmButtonText?: string;
	readonly isLoading?: boolean;
	readonly onConfirm?: () => void;
	readonly text?: string;
	readonly visible?: boolean;
	readonly onClose: () => void;
};

export const Dialog = (dialogProps: DialogProps) => {
	const translator = useTranslator();

	if (!dialogProps.visible) {
		return null;
	}

	const handleOnClose = () => {
		dialogProps.onClose();
	};

	return (
		<DialogCui
			visible={dialogProps.visible}
			onClick={(e) => e.stopPropagation()}
			closeOnEsc={true}
			onClose={handleOnClose}
			actions={
				<>
					<Button onClick={handleOnClose} disabled={dialogProps.isLoading}>
						{translator.gettext('Cancel')}
					</Button>
					<Button
						data-testid="dialogDeleteButton"
						color={dialogProps.color}
						onClick={dialogProps.onConfirm}
						loading={dialogProps.isLoading}
					>
						{dialogProps.confirmButtonText ? dialogProps.confirmButtonText : translator.gettext('Confirm')}
					</Button>
				</>
			}
		>
			<Text>{dialogProps.text}</Text>
		</DialogCui>
	);
};
