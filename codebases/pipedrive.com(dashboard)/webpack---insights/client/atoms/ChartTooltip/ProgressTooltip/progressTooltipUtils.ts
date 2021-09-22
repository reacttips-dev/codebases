import { TooltipPayload } from 'recharts';
import { helpers } from '@pipedrive/insights-core';
import { Translator } from '@pipedrive/react-utils';

import { getCustomFieldName } from '../../../utils/filterUtils';
import { ValueFormat, getFormattedValue } from '../../../utils/valueFormatter';
import { PROGRESS_DEFAULT_GROUPING } from '../../../utils/constants';

interface ProgressTooltip {
	payload: ReadonlyArray<TooltipPayload>;
	groupedAndSegmentedData: any[];
	filters: { groupByFilter: string; measureByFilter: string };
	fields: any[];
	translator: Translator;
}

const getMonetaryMeasureBySubtitleForStageEnteredGouping = ({
	measureByFilter,
	measureByFilterName,
	groupTotal,
	translator,
}: {
	measureByFilter: string;
	measureByFilterName: string;
	groupTotal: string | number;
	translator: Translator;
}): string => {
	const isMeasureByCustomField = helpers.deals.isCustomField(measureByFilter);
	const isWeightedValue = measureByFilter === 'weightedValue';

	if (isWeightedValue) {
		return translator.gettext(`Entered stage:  %s (weighted value)`, [
			groupTotal,
		]);
	}

	if (isMeasureByCustomField) {
		return translator.gettext(`Entered stage:  %s %s`, [
			groupTotal,
			measureByFilterName,
		]);
	}

	return translator.gettext(`Entered stage:  %s`, [groupTotal]);
};

const getMonetaryMeasureBySubtitle = ({
	measureByFilter,
	measureByFilterName,
	groupTotal,
	translator,
}: {
	measureByFilter: string;
	measureByFilterName: string;
	groupTotal: string | number;
	translator: Translator;
}): string => {
	const isMeasureByCustomField = helpers.deals.isCustomField(measureByFilter);
	const isWeightedValue = measureByFilter === 'weightedValue';

	if (isWeightedValue) {
		return translator.gettext(`Progressed:  %s (weighted value)`, [
			groupTotal,
		]);
	}

	if (isMeasureByCustomField) {
		return translator.gettext(`Progressed:  %s %s`, [
			groupTotal,
			measureByFilterName,
		]);
	}

	return translator.gettext(`Progressed:  %s`, [groupTotal]);
};

const getSubtitleForStageEnteredGouping = ({
	valueFormat,
	measureByFilter,
	measureByFilterName,
	groupTotal,
	translator,
}: {
	valueFormat: ValueFormat;
	measureByFilter: string;
	measureByFilterName: string;
	groupTotal: string | number;
	translator: Translator;
}) => {
	if (valueFormat === ValueFormat.MONETARY) {
		return getMonetaryMeasureBySubtitleForStageEnteredGouping({
			measureByFilter,
			measureByFilterName,
			groupTotal,
			translator,
		});
	}

	return translator.ngettext(
		'Entered stage: %s deal',
		'Entered stage: %s deals',
		Number(groupTotal),
		groupTotal,
	);
};

const getSubtitle = ({
	valueFormat,
	measureByFilter,
	measureByFilterName,
	groupTotal,
	translator,
}: {
	valueFormat: ValueFormat;
	measureByFilter: string;
	measureByFilterName: string;
	groupTotal: string | number;
	translator: Translator;
}) => {
	if (valueFormat === ValueFormat.MONETARY) {
		return getMonetaryMeasureBySubtitle({
			measureByFilter,
			measureByFilterName,
			groupTotal,
			translator,
		});
	}

	return translator.ngettext(
		'Progressed: %s time',
		'Progressed: %s times',
		Number(groupTotal),
		groupTotal,
	);
};

const getGroupTotal = ({
	payload,
	groupedAndSegmentedData,
	groupByFilter,
	valueFormat,
}: {
	payload: ReadonlyArray<TooltipPayload>;
	groupedAndSegmentedData: any;
	groupByFilter: string;
	valueFormat: ValueFormat;
}): string | number => {
	const groupById = payload?.[0]?.payload[groupByFilter];
	const group = groupedAndSegmentedData?.find(
		(item: any) => item[groupByFilter] === groupById,
	);

	return group && getFormattedValue(group[valueFormat], valueFormat);
};

const getValueFormat = (measureByFilter: string) => {
	const isMeasureByMonetary =
		helpers.deals.isMeasureByMonetary(measureByFilter);

	return isMeasureByMonetary ? ValueFormat.MONETARY : ValueFormat.COUNT;
};

export const getProgressTooltipSubtitle = ({
	payload,
	groupedAndSegmentedData,
	filters,
	fields,
	translator,
}: ProgressTooltip) => {
	const { groupByFilter, measureByFilter } = filters;
	const groupedByStageEntered = groupByFilter === PROGRESS_DEFAULT_GROUPING;
	const measureByFilterName = getCustomFieldName(fields, measureByFilter);
	const valueFormat = getValueFormat(measureByFilter);
	const groupTotal = getGroupTotal({
		payload,
		groupedAndSegmentedData,
		groupByFilter,
		valueFormat,
	});

	if (!groupedByStageEntered) {
		return getSubtitle({
			valueFormat,
			measureByFilter,
			measureByFilterName,
			groupTotal,
			translator,
		});
	}

	return getSubtitleForStageEnteredGouping({
		valueFormat,
		measureByFilter,
		measureByFilterName,
		groupTotal,
		translator,
	});
};
