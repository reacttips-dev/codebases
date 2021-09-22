import React, { useEffect, useState } from 'react';
import useToolsContext from '../hooks/useToolsContext';
import { EntityType, ActionType } from '../tools/BulkActions/types';
import { remove as localStorageRemove } from '../utils/localStorage';

export interface PersistentProgressbarProps {
	bulkAction: {
		entityType: EntityType;
		action: ActionType;
		url: string;
		createdAt: string;
	};
}

function PersistentProgressbar({ bulkAction }: PersistentProgressbarProps) {
	const [{ BulkProgressbar }, setBulkProgressbar] = useState({ BulkProgressbar: null });
	const { componentLoader } = useToolsContext();

	useEffect(() => {
		if (!bulkAction) {
			return;
		}
		// bulk action created more than 24h ago
		if (new Date().getTime() - new Date(bulkAction.createdAt).getTime() > 86400000) {
			localStorageRemove('bulk-action');
			return;
		}

		const isSnackbarVisible = !!document.querySelector('div[data-id="bulk-action-snackbar"]');

		if (isSnackbarVisible) {
			// snackbar is already present in the DOM, don't want to render again
			return;
		}

		componentLoader.load('froot:BulkProgressbar').then((BulkProgressbar) => {
			setBulkProgressbar({ BulkProgressbar });
		});
	}, [bulkAction]);

	function handleDone() {
		localStorageRemove('bulk-action');
	}

	if (BulkProgressbar && bulkAction) {
		return (
			<BulkProgressbar
				entityType={bulkAction.entityType}
				action={bulkAction.action}
				persistent
				apiData={{ action: bulkAction?.action, action_url: bulkAction?.url }}
				onDone={handleDone}
			/>
		);
	}

	return <></>;
}

export default PersistentProgressbar;
