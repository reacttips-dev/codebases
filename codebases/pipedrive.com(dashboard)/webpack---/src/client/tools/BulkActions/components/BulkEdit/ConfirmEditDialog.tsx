import { Button, Modal, Text } from '@pipedrive/convention-ui-react';
import React, { useContext, useState } from 'react';

import { set as localStorageSet } from '../../../../utils/localStorage';
import { store, useAppDispatch, useRootSelector } from '../../store';
import { cancelDialog, postBulkAction } from '../../store/bulkEditSlice';
import { ApiContext } from '../../utils/ApiContext';
import { trackBulkEditCanceled, trackBulkEditStarted } from '../../utils/bulkMetrics';
import { composePostData } from '../../utils/fields';
import { useTranslations } from '../../utils/useTranslations';
import { ButtonContainer, GrayText } from './styled';
import { ConfirmEditTable } from './ConfirmEditTable';

export function ConfirmEditDialog({ formState, fields }) {
	const { translator, bulkParams, logger } = useContext(ApiContext);
	const dispatch = useAppDispatch();
	const visible = useRootSelector((s) => s.action === 'edit' && s.showConfirmationDialog);
	const submitStatus = useRootSelector((s) => s.submitStatus);
	const entityType = useRootSelector((s) => s.entityType);
	const selectedItemsCount = useRootSelector((s) => s.selectedItemsCount);
	const [rows, setRows] = useState({});
	const { editConfirmationTextMap } = useTranslations();

	function updateRows(rows) {
		setRows(rows);
	}

	function handleCancel() {
		trackBulkEditCanceled(formState, store.getState(), 'modal');

		dispatch(cancelDialog());
	}

	async function handleConfirm() {
		const postData = composePostData(formState, fields);
		const result = await dispatch(postBulkAction(postData));

		trackBulkEditStarted(formState, store.getState());

		if (postBulkAction.fulfilled.match(result)) {
			const { data } = result.payload;

			localStorageSet('bulk-action', {
				url: data.action_url,
				action: 'edit',
				rows,
				entityType,
				createdAt: new Date(),
			});

			bulkParams.onSubmit?.();
		} else {
			if (result.error?.code === 'ERR_ITEM_ID_FETCH_FAILURE') {
				logger.warn('Cannot start bulk edit', result.error);
				return;
			}

			logger.logError(result.error as any, 'Cannot start bulk edit');
		}
	}

	const actions = (
		<ButtonContainer>
			<Button onClick={handleCancel} className="primaryButton">
				{translator.gettext('Cancel')}
			</Button>
			<Button
				onClick={handleConfirm}
				color="green"
				loading={submitStatus === 'pending'}
				className="secondaryButton"
				data-test="confirm-edits-button"
			>
				{translator.gettext('Confirm')}
			</Button>
		</ButtonContainer>
	);

	if (!entityType) {
		return null;
	}

	return (
		<Modal
			visible={visible}
			onClose={handleCancel}
			header={translator.gettext('Confirm changes')}
			footer={actions}
			data-test="confirmation-edit-dialog"
			closeOnEsc
		>
			<Text>
				<p
					/* eslint-disable-next-line react/no-danger */
					dangerouslySetInnerHTML={{
						__html: `${editConfirmationTextMap[entityType](selectedItemsCount)}:`,
					}}
					/* eslint-enable */
				/>
			</Text>
			<ConfirmEditTable formState={formState} fields={fields} setRows={updateRows} />
			<GrayText>
				{translator.gettext("Once you confirm, the process starts right away. You can't revert the changes.")}
			</GrayText>
		</Modal>
	);
}
