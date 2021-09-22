import { getFFContextData } from '@pipedrive/form-fields';
import Logger from '@pipedrive/logger-fe';
import getTranslator from '@pipedrive/translator-client/fe';
import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';

import { BulkActions } from './BulkActions';
import { store } from './store';
import { closeSidebar, openSidebar } from './store/bulkEditSlice';
import { BulkEditOptions, BulkEditParams } from './types';
import { ApiContext } from './utils/ApiContext';
import { setMetricsInstance } from './utils/bulkMetrics';

export default async function (componentLoader) {
	const [user, ffContextData] = await Promise.all([
		componentLoader.load('webapp:user'),
		getFFContextData(componentLoader),
	]);
	const translator = await getTranslator('froot', user.getLanguage());
	const logger = new Logger('froot', 'BulkActions');

	componentLoader.load('webapp:metrics').then((metrics) => {
		setMetricsInstance(metrics);
	});

	const element = document.createElement('div');

	element.id = 'bulk-edit';

	document.body.appendChild(element);

	const bulkParams: BulkEditParams = {};

	render(
		<Provider store={store}>
			<ApiContext.Provider value={{ componentLoader, translator, user, ffContextData, bulkParams, logger }}>
				<BulkActions />
			</ApiContext.Provider>
		</Provider>,
		element,
	);

	return {
		open(options: BulkEditOptions & BulkEditParams) {
			const {
				type,
				criteria,
				totalCount,
				visibleCount,
				canBulkDelete,
				bulkDeleteEl,
				onClose,
				onSubmit,
				onDone,
			} = options;

			Object.assign(bulkParams, {
				bulkDeleteEl,
				onClose,
				onSubmit,
				onDone,
			});

			store.dispatch(
				openSidebar({
					entityType: type,
					canBulkDelete,
					totalCount,
					visibleCount,
					criteria: {
						bulkEditFilter: criteria.bulkEditFilter,
						excludedIds: criteria.excludedIds?.slice(0),
						selectedIds: criteria.selectedIds?.slice(0),
					},
				}),
			);
		},
		close() {
			store.dispatch(closeSidebar());
		},
	};
}
