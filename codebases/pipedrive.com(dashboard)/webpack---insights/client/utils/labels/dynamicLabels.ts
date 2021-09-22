import memoize from 'memoizee';
import { snakeCase, startsWith } from 'lodash';
import { Translator } from '@pipedrive/react-utils';
import { types as insightsTypes } from '@pipedrive/insights-core';

import { get as getWebappApi } from '../../api/webapp';
import { numberFormatter } from '../numberFormatter';
import { dateToLocaleString, dateTimeToLocaleString } from '../dateFormatter';
import { dataKeyTypeMap, ReportEntityType } from '../constants';
import { getFormattedDuration, DurationUnit } from '../duration/durationUtils';
import { QuickFilterUserTypes } from '../quickFilterUtils';
import { RelatedObjects } from '../../types/apollo-query-types';
import { findRelatedObject } from '../relatedObjectsHelpers';

interface LabelParamsType {
	key: string;
	value: any;
	currency: string;
	interval: insightsTypes.Interval | boolean;
	hash: string;
}

const wrapWithMemoization = (fn: any) =>
	memoize(fn, {
		maxAge: 60 * 60000,
	});

const getWebappApiDataSets = (): { [key: string]: any } => {
	const WebappApi = getWebappApi();

	return {
		pipeline: WebappApi.userSelf.pipelines,
		stage: WebappApi.userSelf.stages,
		user: WebappApi.companyUsers,
		team: WebappApi.teams,
		dealFields: WebappApi.userSelf.fields.deal,
		activityFields: WebappApi.userSelf.fields.activity,
	};
};

const splitFieldName = (field: string) => {
	const splitFilter = field ? field.split('__') : [];

	if (splitFilter.length > 1) {
		return {
			field: splitFilter[0],
			hash: splitFilter[1],
		};
	}

	return null;
};

const getSingleOptionStatusName = (
	key: string,
	value: any,
	dataType: ReportEntityType.ACTIVITY | ReportEntityType.DEAL,
) => {
	const dataFieldsKeyFromWebappApi = `${dataType}Fields`;

	const dataSet = getWebappApiDataSets()[dataFieldsKeyFromWebappApi]?.find(
		(field: any) => field.key === snakeCase(key),
	);

	const currentOption = dataSet?.options?.find(
		(option: any) => String(option.id) === String(value),
	);

	return currentOption?.label || value;
};

const getRelatedObjectName = (
	value: number,
	relatedObjectType: keyof RelatedObjects,
) => {
	const relatedObject = findRelatedObject(value, relatedObjectType);

	return relatedObject?.name || relatedObject?.title || value;
};

const getNamesOfRelatedObjects = (
	params: LabelParamsType,
	relatedObjectType: keyof RelatedObjects,
) => {
	if (Array.isArray(params.value)) {
		return params.value.map((value) =>
			getRelatedObjectName(value, relatedObjectType),
		);
	}

	return getRelatedObjectName(params.value, relatedObjectType);
};

const getLabelCompositionParams = (
	key: string,
	value: any,
	currency: string,
	interval: insightsTypes.Interval | boolean,
): LabelParamsType => {
	const keyType = {
		key: '',
		value: '',
		currency: '',
		interval: false as insightsTypes.Interval | boolean,
		hash: '',
	};

	let field = null as any;
	let hash = '';

	const customField = splitFieldName(key);

	if (customField) {
		field = customField.field;
		hash = customField.hash;
	}

	const fieldKey = field || key;

	Object.keys(dataKeyTypeMap).forEach(
		(itemKey: keyof typeof dataKeyTypeMap) => {
			const fieldTypes = dataKeyTypeMap[itemKey];

			if (fieldTypes?.includes(fieldKey)) {
				keyType.key = itemKey;
				keyType.hash = hash;
				keyType.value = value;
				keyType.currency = currency;
				keyType.interval = interval;
			}
		},
	);

	return keyType;
};

const findFieldNameFromDataSource = (
	key: string,
	value: any,
	translator: Translator,
) => {
	const userValueIsEveryone =
		value === 0 && Object.values(QuickFilterUserTypes).includes(key as any);

	if (userValueIsEveryone && translator) {
		return translator.gettext('everyone');
	}

	const dataSet = getWebappApiDataSets()[key];
	const dataField = dataSet.find((d: any) => String(d.id) === String(value));

	const dataFieldName = dataField && dataField.name;

	return dataFieldName || '';
};

const getFieldName = wrapWithMemoization(findFieldNameFromDataSource);

const findCustomFieldNameFromDataSource = (
	key: string,
	value: any,
	hash: string,
) => {
	const dataFieldsKeyFromWebappApi = `${ReportEntityType.DEAL}Fields`;
	const dataSource = getWebappApiDataSets()[dataFieldsKeyFromWebappApi];
	const fieldData = dataSource.find((field: any) =>
		hash ? startsWith(field.key, hash) : field.key === key,
	);
	const options = fieldData ? fieldData.options : [];

	if (value) {
		if (Array.isArray(value)) {
			return value.map((val) => {
				const option = options.find(
					(field: any) => String(field.id) === val,
				);

				return option ? option.label : '';
			});
		}

		const customField = options.find(
			(field: any) => String(field.id) === String(value),
		);

		return customField && customField.label;
	}

	return null;
};

const getCustomFieldName = wrapWithMemoization(
	findCustomFieldNameFromDataSource,
);

const getDataLabels: { [key: string]: any } = {
	date: (params: LabelParamsType) => {
		return dateToLocaleString(params.value) || null;
	},
	dateTime: (params: LabelParamsType) => {
		return dateTimeToLocaleString(params.value) || null;
	},
	pipeline: (params: LabelParamsType) => {
		return getFieldName(params.key, params.value);
	},
	stage: (params: LabelParamsType) => {
		return getFieldName(params.key, params.value);
	},
	user: (params: LabelParamsType, translator: Translator) => {
		return getFieldName(params.key, params.value, translator);
	},
	team: (params: LabelParamsType, translator: Translator) => {
		return getFieldName(params.key, params.value, translator);
	},
	value: (params: LabelParamsType) => {
		return numberFormatter.format({
			value: params.value || 0,
			currencyCode: params.currency,
		});
	},
	monetary: (params: LabelParamsType) => {
		const valueObj = params.value;

		return (
			(valueObj &&
				valueObj.value &&
				numberFormatter.format({
					value: valueObj.value,
					currencyCode: valueObj.currency,
				})) ||
			' '
		);
	},
	numerical: (params: LabelParamsType) => {
		return params.value
			? numberFormatter.format({
					value: params.value,
					isMonetary: false,
			  })
			: ' ';
	},
	set: (params: LabelParamsType) => {
		return getCustomFieldName(params.key, params.value, params.hash);
	},
	enum: (params: LabelParamsType) => {
		return getCustomFieldName(params.key, params.value, params.hash);
	},
	done: (params: LabelParamsType) => {
		return getSingleOptionStatusName(
			params.key,
			params.value,
			ReportEntityType.ACTIVITY,
		);
	},
	busyFlag: (params: LabelParamsType) => {
		return getSingleOptionStatusName(
			params.key,
			params.value,
			ReportEntityType.ACTIVITY,
		);
	},
	status: (params: LabelParamsType) => {
		return getSingleOptionStatusName(
			params.key,
			params.value,
			ReportEntityType.DEAL,
		);
	},
	label: (params: LabelParamsType) => {
		return getSingleOptionStatusName(
			params.key,
			params.value,
			ReportEntityType.DEAL,
		);
	},
	duration: (params: LabelParamsType, translator: Translator) => {
		return getFormattedDuration({
			duration: params.value,
			translator,
			unit: DurationUnit.MINUTES,
		});
	},
	org: (params: LabelParamsType) =>
		getNamesOfRelatedObjects(params, 'organizations'),
	person: (params: LabelParamsType) =>
		getNamesOfRelatedObjects(params, 'persons'),
	product: (params: LabelParamsType) =>
		getNamesOfRelatedObjects(params, 'products'),
	deal: (params: LabelParamsType) =>
		getNamesOfRelatedObjects(params, 'deals'),
};

const getDataFieldValue = ({
	key,
	value,
	currency,
	interval,
	translator,
}: {
	key: string;
	value: any;
	currency?: string;
	interval?: insightsTypes.Interval | boolean;
	translator?: Translator;
}) => {
	const params = getLabelCompositionParams(key, value, currency, interval);

	return (
		(getDataLabels[params.key] &&
			getDataLabels[params.key](params, translator)) ||
		value
	);
};

export default getDataFieldValue;
