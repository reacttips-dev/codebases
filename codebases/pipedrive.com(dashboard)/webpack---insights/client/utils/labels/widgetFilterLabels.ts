import TranslatorClient from '@pipedrive/translator-client';
import {
	Filter,
	Operand,
	OperandType,
} from '@pipedrive/insights-core/lib/types';

import { dateToLocaleString } from '../../utils/dateFormatter';
import { FilterType, singleSelectWhitelist } from '../../utils/constants';
import getDataFieldValue from '../../utils/labels/dynamicLabels';
import { getCurrencyNameByCode } from '../numberFormatter';
import {
	getFlatPeriodTranslations,
	getOperandsTranslations,
} from './staticLabels';

const getCustomTitle = (label: string, translator: TranslatorClient) => {
	switch (label) {
		case 'recurring':
			return translator.gettext('Recurring');
		case 'additional':
			return translator.gettext('One-time');
		case 'installment':
			return translator.gettext('Payment schedule');
		default:
			return label;
	}
};

const getFilterLabelsByType: Record<string, any> = {
	date: (params: {
		currentFilter: Filter;
		currentFilterName: string;
		translatedPeriod: string;
		quickFilterTooltipText: string;
	}) => {
		const {
			currentFilter,
			currentFilterName,
			translatedPeriod,
			quickFilterTooltipText,
		} = params;

		const getDate = (type: OperandType) =>
			currentFilter.operands.find((operand) => operand.name === type)
				.defaultValue;

		const fromDate = dateToLocaleString(getDate(OperandType.FROM));
		const toDate = dateToLocaleString(getDate(OperandType.TO));

		const formattedTitle = translatedPeriod || `${fromDate} - ${toDate}`;

		return {
			title: translatedPeriod,
			tooltip:
				`${currentFilterName} ${formattedTitle?.toLowerCase()} ${quickFilterTooltipText}`.trim(),
		};
	},
	monetary: (params: {
		currentFilterOperands: Operand;
		currentOperandName: string;
		currentFilterName: string;
		translatedOperand: string;
	}) => {
		const {
			currentFilterOperands,
			currentOperandName,
			currentFilterName,
			translatedOperand,
		} = params;

		const symbols: Record<string, string> = {
			isMoreThan: '>',
			isLessThan: '<',
		};
		const monetaryFilterValue = currentFilterOperands.defaultValue;

		return {
			title: `${symbols[currentOperandName]} ${monetaryFilterValue}`,
			tooltip: `${currentFilterName} ${translatedOperand} ${monetaryFilterValue}`,
		};
	},
	currency: (params: {
		currentFilterOperands: Operand;
		currentFilterName: string;
		translatedOperand: string;
	}) => {
		const { currentFilterOperands, currentFilterName, translatedOperand } =
			params;

		const formattedFilterValue = Array.isArray(
			currentFilterOperands.defaultValue,
		)
			? currentFilterOperands.defaultValue
					.map((item) => getCurrencyNameByCode(item))
					.join(', ')
			: getCurrencyNameByCode(currentFilterOperands.defaultValue);

		return {
			title: formattedFilterValue,
			tooltip: `${currentFilterName} ${translatedOperand} ${formattedFilterValue}`,
		};
	},
	formattable: (params: {
		currentFilterOperands: Operand;
		currentFilterName: string;
		currentFilter: Filter;
		translatedOperand: string;
		quickFilterTooltipText: string;
		isSingleSelect: boolean;
		translator: TranslatorClient;
	}) => {
		const {
			currentFilterOperands,
			currentFilterName,
			currentFilter,
			translatedOperand,
			quickFilterTooltipText,
			isSingleSelect,
			translator,
		} = params;

		const formattedFilterValue = isSingleSelect
			? getDataFieldValue({
					key: params.currentFilter.type,
					value: currentFilterOperands.defaultValue,
					translator,
			  })
			: currentFilterOperands &&
			  currentFilterOperands.defaultValue &&
			  currentFilterOperands.defaultValue
					.map((item: string) =>
						getDataFieldValue({
							key: currentFilter.type,
							value: item,
						}),
					)
					.join(', ');

		return {
			title: formattedFilterValue,
			tooltip:
				`${currentFilterName} ${translatedOperand} ${formattedFilterValue} ${quickFilterTooltipText}`.trim(),
		};
	},
	setenum: (params: {
		currentFilterOperands: Operand;
		currentFilterkey: string;
		currentFilterName: string;
		translatedOperand: string;
	}) => {
		const {
			currentFilterOperands,
			currentFilterkey,
			currentFilterName,
			translatedOperand,
		} = params;

		const formattedFilterValue = Array.isArray(
			currentFilterOperands.defaultValue,
		)
			? currentFilterOperands.defaultValue
					.map((value) =>
						getDataFieldValue({ key: currentFilterkey, value }),
					)
					.join(', ')
			: getDataFieldValue({
					key: currentFilterkey,
					value: currentFilterOperands.defaultValue,
			  });

		return {
			title: formattedFilterValue,
			tooltip: `${currentFilterName} ${translatedOperand} ${formattedFilterValue}`,
		};
	},
	default: (params: {
		currentFilterOperands: Operand;
		currentFilter: Filter;
		currentFilterkey: string;
		currentFilterName: string;
		translatedOperand: string;
		translator: TranslatorClient;
	}) => {
		const {
			currentFilterOperands,
			currentFilter,
			currentFilterName,
			translatedOperand,
			translator,
		} = params;

		const defaultValue = getDataFieldValue({
			key: currentFilter.type,
			value: currentFilterOperands.defaultValue,
			translator,
		});

		const defaultTitle = Array.isArray(defaultValue)
			? defaultValue
					.map((item) => getCustomTitle(item, translator))
					.join(', ')
			: getCustomTitle(defaultValue, translator);
		const placeholderTitle = `(${translator.gettext('no value')})`;
		const title = defaultTitle || placeholderTitle;

		return {
			title,
			tooltip: `${currentFilterName} ${translatedOperand} ${title}`,
			placeholderTitle: title === placeholderTitle,
		};
	},
};

const getWidgetFilterLabels = (
	filters: Filter[],
	currentFilter: Filter,
	translator: TranslatorClient,
) => {
	const translatedOperandLabels = getOperandsTranslations(translator);

	const labelTypesMap: Record<string, FilterType[]> = {
		date: [FilterType.DATE],
		monetary: [FilterType.MONETARY],
		currency: [FilterType.CURRENCY],
		formattable: [FilterType.PIPELINE, FilterType.STAGE, FilterType.USER],
		setenum: [FilterType.SET, FilterType.ENUM],
	};

	const currentFilterOperands = currentFilter.operands[0];
	const currentOperandName = currentFilterOperands.name;
	const currentFilterType = currentFilter.type;

	const item =
		filters &&
		filters.find(
			(filterItem) => filterItem.filter === currentFilter.filter,
		);

	const isSingleSelect =
		singleSelectWhitelist.types.includes(currentFilterType as FilterType) &&
		currentFilterOperands.name === OperandType.EQ;

	const translatedOperand = translatedOperandLabels[currentOperandName];
	const flatPeriods = getFlatPeriodTranslations(translator);
	const translatedPeriod = flatPeriods[currentFilter.period];
	const { isQuickFilter = false } = currentFilter;

	const params = {
		translator,
		isSingleSelect,
		currentFilter,
		currentFilterkey: item?.filter,
		currentFilterName: item?.name,
		currentFilterOperands,
		currentOperandName,
		translatedOperand,
		translatedPeriod,
		isQuickFilter,
		quickFilterTooltipText: isQuickFilter
			? `(${translator.gettext('quick filter applied')})`
			: '',
	};

	let selectedType: string;

	Object.keys(labelTypesMap).forEach((type) => {
		if (labelTypesMap[type]?.includes(currentFilter.type as FilterType)) {
			selectedType = type;
		}
	});

	return {
		...getFilterLabelsByType[selectedType || 'default'](params),
		...(isQuickFilter && { isQuickFilter }),
	};
};

export default getWidgetFilterLabels;
