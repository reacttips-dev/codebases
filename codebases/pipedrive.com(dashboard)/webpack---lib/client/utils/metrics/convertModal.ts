/* eslint-disable max-params */
import { ComponentLoader } from '@pipedrive/types';
import { PDMetrics } from '@pipedrive/react-utils';
import { ConvertEntity, FilterByOptions } from 'Types/types';

export enum EventType {
	Started = 'started',
	Canceled = 'canceled',
	Finished = 'finished',
}

export const getMetrics = async (componentLoader: ComponentLoader): Promise<PDMetrics> => {
	const metrics = await componentLoader.load('webapp:metrics');

	return metrics;
};

const viewCodes = {
	Pipeline: 'pipeline',
	Detail: 'deal',
	List: 'deals',
	Filter: 'deals',
};

export const track = async (
	c: ComponentLoader,
	view: keyof typeof viewCodes,
	eventType: EventType,
	data: Record<string, unknown>,
) => {
	const m = await getMetrics(c);
	m.trackUsage(viewCodes[view], 'deal_to_lead_conversion', eventType, data);
};

const getIsBulkEdit = (entity?: ConvertEntity): boolean => {
	if (entity === ConvertEntity.SingleDeal) {
		return false;
	}

	return true;
};

export const getConvertingStartedData = (
	entity: ConvertEntity,
	view: keyof typeof viewCodes,
	totalCount?: number,
	sessionId?: string,
	filter?: FilterByOptions,
) => {
	const isBulkEdit = getIsBulkEdit(entity);
	const filterType = filter?.filterId ? 'filter' : 'user';
	const filterValue = filter?.filterId ? filter?.filterId : filter?.userId ? filter.userId : 'everyone';

	return {
		is_bulk_conversion: isBulkEdit,
		entry_point: view,
		total_count: totalCount ?? 1,
		session_id: sessionId,
		filter_type: filterType,
		filter_value: filterValue,
	};
};

export const getConvertingCanceledData = (
	entity: ConvertEntity,
	view: keyof typeof viewCodes,
	selectedDealIds?: [number],
) => {
	const isBulkEdit = getIsBulkEdit(entity);

	return {
		is_bulk_conversion: isBulkEdit,
		entry_point: view,
		selected_count: selectedDealIds?.length,
	};
};

export const getConvertingFinishedData = (
	processedDeals: number,
	failedDeals: number,
	entity?: ConvertEntity,
	view?: keyof typeof viewCodes,
	total?: number,
	sessionId?: string,
) => {
	const isBulkEdit = getIsBulkEdit(entity);

	return {
		is_bulk_conversion: isBulkEdit,
		entry_point: view,
		converted_count: processedDeals,
		failed_count: failedDeals,
		total_count: total,
		session_id: sessionId,
	};
};
