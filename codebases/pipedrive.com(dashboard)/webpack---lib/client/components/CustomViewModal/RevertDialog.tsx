import React from 'react';
import { Button, Dialog as CUIDialog } from '@pipedrive/convention-ui-react';
import { useTranslator } from '@pipedrive/react-utils';

type Props = {
	onClose: () => void;
	onRevertClick: () => void;
	isVisible: boolean;
};

export const RevertDialog = ({ onClose, isVisible, onRevertClick }: Props) => {
	const translator = useTranslator();

	return (
		<div>
			<CUIDialog
				actions={
					<>
						<Button
							onClick={(e) => {
								e.stopPropagation();
								onClose();
							}}
						>
							{translator.gettext('Cancel')}
						</Button>
						<Button
							onClick={(e) => {
								e.stopPropagation();
								onRevertClick();
							}}
							color={'red'}
						>
							{translator.gettext('Revert')}
						</Button>
					</>
				}
				visible={isVisible}
				closeOnEsc
				onClose={onClose}
			>
				{translator.gettext('Are you sure you want to revert columns to initial state?')}
			</CUIDialog>
		</div>
	);
};
