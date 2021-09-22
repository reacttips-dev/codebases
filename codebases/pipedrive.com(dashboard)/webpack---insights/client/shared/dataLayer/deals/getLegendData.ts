import { types as insightsTypes, helpers } from '@pipedrive/insights-core';
import { Translator } from '@pipedrive/react-utils';
import colors from '@pipedrive/convention-ui-css/dist/json/colors.json';

import { getColor } from '../../../utils/styleUtils';
import { dataKeyTypeMap } from '../../../utils/constants';
import { formatIntervals } from '../../../utils/dateFormatter';
import { getStaticFieldLabel } from '../../../utils/labels';
import {
	OverallReportLegendData,
	RecurringRevenueReportLegendData,
} from '../../../types/data-layer';

const getOverallConversionReportLegendItems = (
	uniqueSegments: any[],
	translator: Translator,
): OverallReportLegendData => {
	if (uniqueSegments.length === 0) {
		return {};
	}

	return {
		won: {
			title: translator.gettext('Win rate'),
			color: getColor('Won'),
		},
		lost: {
			title: translator.gettext('Loss rate'),
			color: getColor('Lost'),
		},
	};
};

const getRecurringRevenueMovementReportLegendItems = (
	translator: Translator,
): RecurringRevenueReportLegendData => {
	return {
		new: {
			title: translator.gettext('New'),
			color: colors['$color-sky-hex'],
		},
		churn: {
			title: translator.gettext('Churn'),
			color: colors['$color-flamingo-hex'],
		},
		expansion: {
			title: translator.gettext('Expansion'),
			color: colors['$color-turquoise-hex'],
		},
		contraction: {
			title: translator.gettext('Contraction'),
			color: colors['$color-salmon-hex'],
		},
		total: {
			title: translator.gettext('Net growth'),
			color: colors['$color-black-hex-88'],
		},
	};
};

const getRecurringRevenueLegendItems = (translator: Translator) => {
	return {
		recurring: {
			title: translator.gettext('Recurring'),
			color: colors['$color-sky-hex'],
		},
		additional: {
			title: translator.gettext('One-time'),
			color: colors['$color-turquoise-hex'],
		},
		installment: {
			title: translator.gettext('Payment schedule'),
			color: colors['$color-kiwi-hex'],
		},
	};
};

interface GetLegendDataOptions {
	reportType: insightsTypes.ReportType;
	uniqueSegments: any[];
	filters: any;
	translator: Translator;
}

const getLegendData = ({
	reportType,
	uniqueSegments,
	filters,
	translator,
}: GetLegendDataOptions) => {
	if (reportType === insightsTypes.ReportType.DEALS_CONVERSION_OVERALL) {
		return getOverallConversionReportLegendItems(
			uniqueSegments,
			translator,
		);
	}

	if (
		reportType === insightsTypes.ReportType.DEALS_RECURRING_REVENUE_MOVEMENT
	) {
		return getRecurringRevenueMovementReportLegendItems(translator);
	}

	if (reportType === insightsTypes.ReportType.DEALS_RECURRING_REVENUE) {
		return getRecurringRevenueLegendItems(translator);
	}

	return uniqueSegments.map((segment, index) => {
		const isDateField = dataKeyTypeMap.date.includes(
			helpers.deals.getFieldType(filters.segmentByFilter).type,
		);
		const legendTitle = isDateField
			? formatIntervals(filters.intervalFilter, segment.id)
			: getStaticFieldLabel(translator, segment.name) || segment.name;

		return {
			title: legendTitle,
			color: getColor(segment.name, index, true),
		};
	});
};

export default getLegendData;
