import { cloneDeep, clone } from 'lodash';
import memoize from 'memoizee';
import { helpers } from '@pipedrive/insights-core';
import { Translator } from '@pipedrive/react-utils';
import { Operand } from '@pipedrive/insights-core/lib/types';

import { FilterType } from '../../../constants';
import {
	MappedFilterByField,
	stageFilterOptions,
	FilterOption,
} from '../../../../types/report-options';
import {
	DealsFilterByField,
	Field,
} from '../../../../types/apollo-query-types';
import {
	areTeamsEnabled,
	getCurrencies,
	getFields,
	getPipelines,
	getStages,
	getTeams,
	getUsers,
	isCustomFieldsIndicesFlagEnabled,
} from '../../../../api/webapp';
import { addCustomFieldsToFieldsArray } from '../../../filterUtils';
import { isTeamFilter, getTeamOptions } from './filtersWithLabelsUtils';
import { getStagesPerPipeline } from '../../../helpers';

const FILTER_TYPE_BLACKLIST = [
	'varchar', // Title
	// UNIMPLEMENTED CUSTOM FIELDS
	'daterange',
	'timerange',
	'time',
];

type FilterOptions = FilterOption[] | stageFilterOptions;

const getPaymentTypes = (translator: Translator) => {
	return [
		{
			id: 'recurring',
			label: translator.gettext('Recurring'),
		},
		{
			id: 'additional',
			label: translator.gettext('One-time'),
		},
		{
			id: 'installment',
			label: translator.gettext('Payment schedule'),
		},
	];
};

const getFieldName = (filter: any, field: any, translator: Translator) => {
	if (field) {
		return field.name;
	}

	if (isTeamFilter(filter.name)) {
		return translator.gettext('Team');
	}

	return '';
};

const getFieldType = (field: any, filter: DealsFilterByField) => {
	if (field) {
		// To distinguish from the 'monetary' custom field
		return field.key === 'value' ? FilterType.VALUE : field.field_type;
	}

	if (isTeamFilter(filter.name)) {
		return 'team';
	}

	return '';
};

const shouldExcludeFilter = (filter: DealsFilterByField, field: any) => {
	if (isTeamFilter(filter.name) && areTeamsEnabled()) {
		return false;
	}

	return !field || FILTER_TYPE_BLACKLIST.includes(field.field_type);
};

const getFilterOptions = (filterKey: string, translator: Translator) => {
	const getOptionsForLostReasonFilter = () => {
		const lostReasonOptions = getFields('deal').find(
			(deal: Pipedrive.Deal) => deal.key === 'lost_reason',
		).options;

		if (lostReasonOptions) {
			return lostReasonOptions.map((mappedFieldItem: any) =>
				Object.assign(mappedFieldItem, {
					id: `${mappedFieldItem.label}`,
				}),
			);
		}

		return [];
	};

	const getOptionsForStatusFilter = () => {
		const statusOptions =
			(
				getFields('deal').find(
					(deal: Pipedrive.Deal) => deal.key === 'status',
				) || {}
			).options || [];

		return statusOptions.filter((item: any) => item.id !== 'deleted');
	};

	const getOptionsForLabelFilter = () => {
		return (
			(
				getFields('deal').find(
					(deal: Pipedrive.Deal) => deal.key === 'label',
				) || {}
			).options || []
		);
	};

	switch (filterKey) {
		case 'pipeline_id':
			return getPipelines();
		case 'deal_stage_log.stage_id':
		case 'stage_id':
			return getStages()?.length
				? [getStagesPerPipeline(getStages())]
				: [];
		case 'currency':
			return getCurrencies();
		case 'creator_user_id':
		case 'user_id':
			return getUsers().filter(
				(user: Pipedrive.User) => user.active_flag,
			);
		case 'lost_reason':
			return getOptionsForLostReasonFilter();
		case 'status':
			return getOptionsForStatusFilter();
		case 'label':
			return getOptionsForLabelFilter();
		case 'team_id':
			return getTeamOptions(getTeams());
		case 'payments.payment_type':
			return getPaymentTypes(translator);
		default:
			return [];
	}
};

const getCustomFilterOptions = (
	mappedFilter: MappedFilterByField,
	field: any,
) => {
	// Options for custom field 'user'
	if (mappedFilter.type === 'user') {
		return getUsers()?.filter((user: Pipedrive.User) => user.active_flag);
	}

	// Options for custom field 'single & multiple options'
	if (mappedFilter.type === 'enum' || mappedFilter.type === 'set') {
		return (
			(
				getFields('deal').find((deal: any) => deal.key === field.key) ||
				{}
			).options || []
		);
	}

	return [];
};

const getField = (fields: any[], filter: DealsFilterByField) => {
	return fields.find((fieldItem) => fieldItem.key === filter.description);
};

const getFilterOptionsForMappedField = (
	filterOptions: FilterOptions,
	mappedField: any,
	field: Field,
) => {
	if (filterOptions.length > 0) {
		return filterOptions;
	} else {
		const customFilterOptions: FilterOption[] = getCustomFilterOptions(
			mappedField,
			field,
		);

		if (customFilterOptions.length > 0) {
			return customFilterOptions;
		}

		return mappedField.options;
	}
};

const setDefaultOptionForMappedField = (mappedField: any) => {
	if (mappedField.operands && mappedField.options) {
		mappedField.operands.forEach((operand: Operand) => {
			if (mappedField.type === FilterType.STAGE) {
				const firstPipelineId = Object.keys(mappedField.options[0])[0];
				const stageOperand = mappedField.options[0][firstPipelineId];

				const [option] = stageOperand;

				operand.defaultValue = option;
			} else {
				const [option] = mappedField.options;

				operand.defaultValue = option;
			}
		});
	}

	return mappedField.operands;
};

export const getDealsFiltersWithLabels = ({
	filters,
	fields,
	translator,
}: {
	filters: DealsFilterByField[];
	fields: Field[];
	translator: Translator;
}): MappedFilterByField[] => {
	let filtersCopy = cloneDeep(filters);

	// If insights_custom_indices flag is not enabled then there is a special case
	// where backend still sends those custom fields into fields.fields array
	// and frontend has to map them into filters
	if (!isCustomFieldsIndicesFlagEnabled()) {
		filtersCopy = addCustomFieldsToFieldsArray(
			fields,
			filtersCopy,
			'filterType',
		);
	}

	const dealFields = clone(getFields('deal'));
	const dealStageLogFields = [
		{
			key: 'deal_stage_log.stage_id',
			name: translator.gettext('Stage entered'),
			field_type: 'stage',
		},
		{
			key: 'deal_stage_log.add_time',
			name: translator.gettext('Date of entering stage'),
			field_type: 'date',
		},
	];
	const productFields = [
		{
			key: 'deal_products.product_id',
			name: translator.gettext('Product'),
			field_type: 'product',
		},
	];
	const paymentFields = [
		{
			key: 'payments.due_at',
			name: translator.gettext('Payments due'),
			field_type: 'date',
		},
		{
			key: 'payments.payment_type',
			name: translator.gettext('Revenue type'),
			field_type: 'payments',
		},
		{
			key: 'expected_close_date_or_won_time',
			name: translator.gettext('Forecast period'),
			field_type: 'date',
		},
	];
	const supplementedFields = dealFields.concat([
		...dealStageLogFields,
		...paymentFields,
		...productFields,
	]);

	return filtersCopy.reduce((result, filter) => {
		const field = getField(supplementedFields, filter);

		if (shouldExcludeFilter(filter, field)) {
			return result;
		}

		let inputFields: any[] = [];

		if (filter.args.length > 0) {
			inputFields = filter.args[0].type.inputFields;
		}

		const nestedFields = inputFields.filter(
			(inputField) => !!inputField.type.inputFields,
		);
		const hasNestedFields = nestedFields.length > 0;
		const subfields = nestedFields.map((inputField) => ({
			name: inputField.name,
			operands: inputField.type.inputFields,
		}));

		const mappedField: MappedFilterByField = {
			key: field ? field.key : filter.description,
			name: getFieldName(filter, field, translator),
			type: getFieldType(field, filter),
			filter: filter.name,
			isCustomField: helpers.deals.isCustomField(filter.name),
			operands: inputFields,
			...(hasNestedFields && { subfields }),
		};
		const filterOptions: FilterOptions = getFilterOptions(
			mappedField.key,
			translator,
		);

		mappedField.options = getFilterOptionsForMappedField(
			filterOptions,
			mappedField,
			field,
		);
		mappedField.operands = setDefaultOptionForMappedField(mappedField);

		result.push(mappedField);

		return result;
	}, []);
};

export default memoize(getDealsFiltersWithLabels, {
	normalizer: (args) => {
		return JSON.stringify(args[0]?.filters);
	},
});
