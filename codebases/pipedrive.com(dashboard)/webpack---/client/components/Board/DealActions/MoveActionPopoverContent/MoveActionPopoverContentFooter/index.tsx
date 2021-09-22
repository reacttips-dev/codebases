import React from 'react';
import { Button, Spacing } from '@pipedrive/convention-ui-react';
import { useDispatch } from 'react-redux';
import { useTranslator } from '@pipedrive/react-utils';

import { closeActionPopovers } from '../../../../../actions/actionPopovers';
import { Footer } from './StyledComponents';

interface MoveActionPopoverContentFooterProps {
	onSaveHandler: () => void;
}

const MoveActionPopoverContentFooter = ({ onSaveHandler }: MoveActionPopoverContentFooterProps) => {
	const dispatch = useDispatch();
	const translator = useTranslator();

	return (
		<Footer>
			<Spacing vertical="s" horizontal="m">
				<Button onClick={() => dispatch(closeActionPopovers())} data-test="deal-actions-move-popover-cancel">
					{translator.gettext('Cancel')}
				</Button>
				<Button onClick={onSaveHandler} color="green" data-test="deal-actions-move-popover-save">
					{translator.gettext('Save')}
				</Button>
			</Spacing>
		</Footer>
	);
};

export default MoveActionPopoverContentFooter;
