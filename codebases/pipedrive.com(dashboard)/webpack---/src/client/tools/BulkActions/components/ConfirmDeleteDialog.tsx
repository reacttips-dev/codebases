import { Button, Dialog, Text } from '@pipedrive/convention-ui-react';
import React, { useContext } from 'react';

import { set as localStorageSet } from '../../../utils/localStorage';
import { store, useAppDispatch, useRootSelector } from '../store';
import { trackBulkDeleteCanceled, trackBulkDeleteStarted } from '../utils/bulkMetrics';
import { cancelDialog, postBulkAction } from '../store/bulkEditSlice';
import { useTranslations } from '../utils/useTranslations';
import { ApiContext } from '../utils/ApiContext';

export function ConfirmDeleteDialog() {
	const { translator, bulkParams, logger } = useContext(ApiContext);
	const dispatch = useAppDispatch();
	const showDialog = useRootSelector((s) => s.action === 'delete' && s.showConfirmationDialog);
	const entityType = useRootSelector((s) => s.entityType);
	const selectedItemsCount = useRootSelector((s) => s.selectedItemsCount);
	const submitStatus = useRootSelector((s) => s.submitStatus);
	const { deleteConfirmationTextMap } = useTranslations();

	function handleCancel() {
		dispatch(cancelDialog());

		trackBulkDeleteCanceled(store.getState());
	}

	async function handleConfirm() {
		const result = await dispatch(postBulkAction(null));

		trackBulkDeleteStarted(store.getState());

		if (postBulkAction.fulfilled.match(result)) {
			const { data } = result.payload;

			localStorageSet('bulk-action', {
				url: data.action_url,
				action: 'delete',
				entityType,
				createdAt: new Date(),
			});

			bulkParams.onSubmit?.();
		} else {
			if (result.error?.code === 'ERR_ITEM_ID_FETCH_FAILURE') {
				logger.warn('Cannot start bulk delete', result.error);
				return;
			}

			logger.logError(result.error as any, 'Cannot start bulk delete');
		}
	}

	const actions = (
		<>
			<Button onClick={handleCancel} className="primaryButton">
				{translator.gettext('Cancel')}
			</Button>
			<Button
				onClick={handleConfirm}
				color="red"
				loading={submitStatus === 'pending'}
				className="secondaryButton"
			>
				{translator.gettext('Delete')}
			</Button>
		</>
	);

	return (
		<Dialog visible={showDialog} onClose={handleCancel} actions={actions} data-test="confirmation-dialog">
			<Text>{deleteConfirmationTextMap[entityType](selectedItemsCount)}</Text>
		</Dialog>
	);
}
