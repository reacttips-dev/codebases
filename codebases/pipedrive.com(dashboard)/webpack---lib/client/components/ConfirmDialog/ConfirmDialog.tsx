import { Button, ButtonProps, Text } from '@pipedrive/convention-ui-react';
import { useTranslator } from '@pipedrive/react-utils';
import React from 'react';

import * as S from './ConfirmDialog.styles';

interface Props {
	readonly visible: boolean;
	readonly text: string;
	readonly confirmButtonText: string;
	readonly color?: ButtonProps['color'];
	readonly onClose: () => void;
	readonly onConfirm: () => void;
	readonly modalContainer?: React.ReactNode;
	readonly isLoading?: boolean;
}

export const ConfirmDialog: React.FC<Props> = ({
	visible,
	onClose,
	onConfirm,
	text,
	confirmButtonText,
	color,
	isLoading,
}) => {
	const translator = useTranslator();

	return (
		<S.StyledDialog
			visible={visible}
			onClick={(e) => e.stopPropagation()}
			closeOnEsc
			onClose={onClose}
			actions={
				<>
					<Button data-testid="dialogCancelButton" onClick={onClose}>
						{translator.gettext('Cancel')}
					</Button>
					<Button data-testid="dialogDeleteButton" color={color} onClick={onConfirm} loading={isLoading}>
						{confirmButtonText}
					</Button>
				</>
			}
		>
			<Text data-testid="dialogMessage">{text}</Text>
		</S.StyledDialog>
	);
};
