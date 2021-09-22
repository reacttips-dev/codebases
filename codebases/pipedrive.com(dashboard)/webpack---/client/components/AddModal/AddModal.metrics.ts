import _, { assign, get, isEmpty } from 'lodash';
import { PdMetrics } from 'Types/@pipedrive/webapp';
import {
	APIResponse,
	Deal,
	Lead,
	ModalState,
	ModalType,
	Organization,
	Person,
	Product,
	RelatedEntityState,
	RequiredFieldsByType,
	RequiredFieldConfig,
	Project,
} from 'Types/types';

export const FIELDS_TO_TRACK = [
	'name',
	'email',
	'phone',
	'im',
	'organization_name',
	'organization_address',
	'address',
	'label',
	'owner',
];

export const trackSaved = (
	response: APIResponse<Deal | Person | Organization | Lead | Project>,
	modalType: ModalType,
	customMetricsData: any,
	pdMetrics: PdMetrics,
	prefill: any,
	modalState: ModalState,
	relatedEntityState: RelatedEntityState,
	requiredFields: RequiredFieldsByType | null,
	// eslint-disable-next-line max-params
) => {
	if (modalType === 'deal') {
		return trackDealAdded(
			response as APIResponse<Deal>,
			customMetricsData,
			pdMetrics,
			modalState,
			relatedEntityState,
			requiredFields,
		);
	}

	if (modalType === 'lead') {
		return trackLeadAdded(
			response as APIResponse<Lead>,
			customMetricsData,
			pdMetrics,
			modalState,
			relatedEntityState,
			requiredFields,
		);
	}

	if (modalType === 'organization') {
		return trackOrganizationAdded(
			response as APIResponse<Organization>,
			customMetricsData,
			pdMetrics,
			requiredFields,
		);
	}

	if (modalType === 'person') {
		return trackPersonAdded(
			response as APIResponse<Person>,
			customMetricsData,
			pdMetrics,
			prefill,
			modalState,
			requiredFields,
		);
	}

	if (modalType === 'product') {
		return trackProductAdded(response as APIResponse<Product>, customMetricsData, pdMetrics);
	}

	if (modalType === 'project') {
		return trackProjectAdded(response as APIResponse<Project>, customMetricsData, pdMetrics);
	}
};

const trackProductAdded = (response: APIResponse<Product>, customMetricsData: any, pdMetrics: PdMetrics) => {
	pdMetrics.trackUsage(null, 'product', 'added', {
		product_id: response.data.id,
		product_category_id: response.data.category,
		tax_filled: !!response.data.tax,
		unit_filled: !!response.data.unit,
		product_code_filled: !!response.data.code,
		prices_count: response.data.prices?.length,
		product_adding_source: customMetricsData?.source || null,
		...customMetricsData,
	});
};

const trackOrganizationAdded = (
	response: APIResponse<Organization>,
	customMetricsData: any,
	pdMetrics: PdMetrics,
	requiredFields: RequiredFieldsByType | null,
) => {
	pdMetrics.trackUsage(null, 'organization', 'added', {
		organization_id: response.data.id,
		required_fields_count: getRequiredFieldsCount('organization', requiredFields),
		source: 'add-organization',
		...customMetricsData,
	});
};

const trackLeadAdded = (
	response: APIResponse<Lead>,
	customMetricsData: any,
	pdMetrics: PdMetrics,
	modalState: ModalState,
	relatedEntityState: RelatedEntityState,
	requiredFields: RequiredFieldsByType | null,
	// eslint-disable-next-line max-params
) => {
	if (modalState.org_id && modalState.org_id.isNew) {
		pdMetrics.trackUsage(null, 'organization', 'added', {
			organization_id: modalState.org_id.value,
			required_fields_count: getRequiredFieldsCount('organization', requiredFields),
			source: 'add-lead',
			lead_source: customMetricsData ? customMetricsData.source : null,
			...customMetricsData,
		});
	}

	if (modalState.person_id && modalState.person_id.isNew) {
		pdMetrics.trackUsage(null, 'person', 'added', {
			person_id: modalState.person_id.value,
			required_fields_count: getRequiredFieldsCount('person', requiredFields),
			source: 'add-lead',
			lead_source: customMetricsData ? customMetricsData.source : null,
			...customMetricsData,
		});
	}

	pdMetrics.trackUsage(null, 'manual_lead', 'added', {
		lead_id: response.data.id,
		required_fields_count: getRequiredFieldsCount('lead', requiredFields),
		visible_to: Number(response.data.visibleTo),
		...customMetricsData,
	});
};

const trackDealAdded = (
	response: APIResponse<Deal>,
	customMetricsData: any,
	pdMetrics: PdMetrics,
	modalState: ModalState,
	relatedEntityState: RelatedEntityState,
	requiredFields: RequiredFieldsByType | null,
	// eslint-disable-next-line max-params
) => {
	if (modalState.org_id && modalState.org_id.isNew) {
		pdMetrics.trackUsage(null, 'organization', 'added', {
			organization_id: modalState.org_id.value,
			required_fields_count: getRequiredFieldsCount('organization', requiredFields),
			source: 'add-deal',
			...customMetricsData,
		});
	}

	if (modalState.person_id && modalState.person_id.isNew) {
		pdMetrics.trackUsage(null, 'person', 'added', {
			person_id: response.data.person_id,
			required_fields_count: getRequiredFieldsCount('person', requiredFields),
			source: 'add-deal',
			...customMetricsData,
		});
	}

	pdMetrics.trackUsage(null, 'deal', 'added', {
		deal_id: response.data.id,
		pipeline_id: response.data.pipeline_id,
		stage_id: response.data.stage_id,
		products_count: getProductsCount(relatedEntityState),
		required_fields_count: getRequiredFieldsCount('deal', requiredFields),
		deal_type: modalState.renewal_type?.value,
		source: 'add-deal',
		...customMetricsData,
	});
};

const trackPersonAdded = (
	response: APIResponse<Person>,
	customMetricsData: any,
	pdMetrics: PdMetrics,
	prefill: any,
	modalState: ModalState,
	requiredFields: RequiredFieldsByType | null,
	// eslint-disable-next-line max-params
) => {
	const fieldChangeMetrics = personFieldChangeMetrics(response, prefill);

	if (modalState.org_id && modalState.org_id.isNew) {
		pdMetrics.trackUsage(null, 'organization', 'added', {
			organization_id: modalState.org_id.value,
			required_fields_count: getRequiredFieldsCount('organization', requiredFields),
			source: 'add-person',
			...customMetricsData,
		});
	}

	pdMetrics.trackUsage(null, 'person', 'added', {
		person_id: response.data.id,
		source: 'add-person',
		required_fields_count: getRequiredFieldsCount('person', requiredFields),
		field_changes: fieldChangeMetrics,
		marketing_status: modalState?.marketing_status?.value,
		...customMetricsData,
	});
};

const trackProjectAdded = (response: APIResponse<Project>, customMetricsData: any, pdMetrics: PdMetrics) => {
	pdMetrics.trackUsage(null, 'project', 'added', {
		project_id: response.data.id,
		...customMetricsData,
	});
};

export const trackModalOpen = (customMetricsData: any, modalType: ModalType, pdMetrics: PdMetrics, prefill: any) => {
	const initialFieldValues = personMappedPrefill(prefill);
	const fieldsWithValues = FIELDS_TO_TRACK.filter((field) => !isEmpty(initialFieldValues[field]));

	pdMetrics.trackUsage(
		null,
		`add_${modalType}`,
		'started',
		assign(
			{
				auto_filled_default_fields: fieldsWithValues || [],
				source: `add-${modalType}`,
			},
			customMetricsData,
		),
	);
};

export const trackModalClose = (customMetricsData: any, modalType: ModalType, pdMetrics: PdMetrics) => {
	const metricsData = assign(
		{
			source: `add-${modalType}`,
		},
		customMetricsData,
	);

	pdMetrics.trackUsage(null, `add_${modalType}`, 'closed', metricsData);
};

const fieldChangeDataPresenter = (initialValue: any, finalValue: any) => {
	initialValue = initialValue || null;
	finalValue = finalValue || null;

	return {
		hadInitialValue: !!initialValue,
		hasFinalValue: !!finalValue,
		initialValueChanged: initialValue !== finalValue,
	};
};

const personFieldChangeMetrics = (response: APIResponse<Person>, prefill: any) => {
	const initialFieldValues = personMappedPrefill(prefill);

	return FIELDS_TO_TRACK.reduce((fieldChanges: any, field) => {
		const initialValue = initialFieldValues[field];

		let finalValue;

		if (['email', 'phone', 'im'].includes(field)) {
			finalValue =
				response.data[field] &&
				(response.data[field].find((el: any) => el.primary) || response.data[field][0]).value;
		} else if (field === 'organization_name') {
			finalValue = response.data.org_name;
		} else if (field === 'organization_address') {
			finalValue = getRelatedOrganizationAddress(response.data);
		} else {
			finalValue = response.data[field];
		}

		fieldChanges[field] = fieldChangeDataPresenter(initialValue, finalValue);

		return fieldChanges;
	}, {});
};

const getRelatedOrganizationAddress = (personModel: Person) => {
	const organizationId = personModel.org_id;

	return get(personModel, `relatedObjects.organization[${organizationId}].address`, null);
};

const personMappedPrefill = (prefill: any) => {
	const { name, mail, phone, organization, organization_address, im, address, label, owner } = prefill;

	return {
		name,
		email: mail,
		phone,
		im,
		organization_name: organization && organization.name,
		organization_address,
		address,
		label,
		owner,
	} as any;
};

const getRequiredFieldsCount = (type: ModalType, requiredFields: RequiredFieldsByType | null): number | null => {
	if (!requiredFields) {
		return null;
	}

	return _(Object.values(requiredFields[type] || {}))
		.filter((requiredField: RequiredFieldConfig) => requiredField.enabled)
		.value().length;
};

const getProductsCount = (relatedEntityState: RelatedEntityState) => {
	if (
		!relatedEntityState.product ||
		!relatedEntityState.product.products ||
		!relatedEntityState.product.products.value
	) {
		return 0;
	}

	return (relatedEntityState.product.products.value || []).reduce((count, product) => {
		if (product.id || (product.name && product.name.length > 0)) {
			count++;
		}

		return count;
	}, 0);
};
