import { Button, Icon, Tooltip } from '@pipedrive/convention-ui-react';
import React, { useContext } from 'react';
import { createPortal } from 'react-dom';

import { useAppDispatch } from '../store';
import { clickDelete } from '../store/bulkEditSlice';
import { ApiContext } from '../utils/ApiContext';

export function DeleteButton() {
	const { translator, bulkParams } = useContext(ApiContext);
	const dispatch = useAppDispatch();

	const buttonText = translator.gettext('Delete selected items');

	function handleClick() {
		dispatch(clickDelete());
	}

	return createPortal(
		<Tooltip content={buttonText}>
			<Button id="delete" data-test="bulk-edit-delete-async" aria-label={buttonText} onClick={handleClick}>
				<Icon icon="trash" />
			</Button>
		</Tooltip>,
		bulkParams.bulkDeleteEl,
	);
}
