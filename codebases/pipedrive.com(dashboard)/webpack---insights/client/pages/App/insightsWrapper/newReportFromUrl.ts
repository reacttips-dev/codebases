import { types as insightsTypes } from '@pipedrive/insights-core';

import {
	SelectedItem,
	SelectedItemType,
} from '../../../types/apollo-query-types';

export const NEW_ITEM_FROM_URL_PATH = 'new';
export const NEW_MODAL_FROM_URL_PATH = 'new_modal';
export const UPSELL_MODAL_FROM_URL_PATH = 'upsell_modal';

export const shouldCreateNewReport = (selectedItem: SelectedItem) => {
	return (
		selectedItem &&
		selectedItem.type === SelectedItemType.REPORTS &&
		selectedItem.id.startsWith(NEW_ITEM_FROM_URL_PATH)
	);
};

export const getNewReportType = (selectedItem: SelectedItem) => {
	return selectedItem.id.split('__')[1] as insightsTypes.ReportType;
};
