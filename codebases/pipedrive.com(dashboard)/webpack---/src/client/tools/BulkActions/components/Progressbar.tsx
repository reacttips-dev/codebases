import React, { useContext } from 'react';
import { useDispatch } from 'react-redux';

import useComponentLoader from '../../../hooks/useComponentLoader';
import { useRootSelector } from '../store';
import { closeProgressbar } from '../store/bulkEditSlice';
import { ApiContext } from '../utils/ApiContext';
import { remove as localStorageRemove } from '../../../utils/localStorage';

export function Progressbar() {
	const { componentLoader, bulkParams } = useContext(ApiContext);
	const [BulkProgressbar] = useComponentLoader('froot:BulkProgressbar', componentLoader as any);
	const action = useRootSelector((s) => s.action);
	const apiData = useRootSelector((s) => s.apiData);
	const entityType = useRootSelector((s) => s.entityType);
	const submitStatus = useRootSelector((s) => s.submitStatus);
	const dispatch = useDispatch();

	if (!BulkProgressbar) {
		return null;
	}

	function handleDone() {
		dispatch(closeProgressbar());
		bulkParams.onDone?.();
		localStorageRemove('bulk-action');
	}

	return (
		<BulkProgressbar
			entityType={entityType}
			action={action}
			success={submitStatus !== 'failed'}
			apiData={apiData}
			onDone={handleDone}
		/>
	);
}
