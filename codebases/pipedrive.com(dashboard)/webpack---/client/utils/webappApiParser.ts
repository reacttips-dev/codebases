import _ from 'lodash';
import { CompanyUsers, ComponentLoader, Features, Router, UserSelf } from 'Types/@pipedrive/webapp';
import {
	Currency,
	Field,
	Fields,
	FieldsByType,
	ModalConfig,
	ModalType,
	ParsedWebappApi,
	Pipeline,
	Settings,
	ShowFields,
	Stage,
	User,
} from 'Types/types';
import { getProjectStaticFields } from './projectStaticFields';

interface PipelinesAndStages {
	pipelines: Pipeline[];
	stages: Stage[];
}

const getPipelinesAndStages = (userSelf: UserSelf): PipelinesAndStages => ({
	pipelines: userSelf.pipelines.map(
		// tslint:disable-next-line
		(model: any) => model.attributes,
	),
	stages: userSelf.attributes.stages,
});
const getCurrencies = (userSelf: UserSelf): Currency[] => userSelf.attributes.currencies;
const getDefaultCurrency = (userSelf: UserSelf): string => userSelf.attributes.default_currency;

export const getFeatures = (userSelf: UserSelf): Features => ({
	advancedPermissions: userSelf.companyFeatures.attributes.advanced_permissions,
	products: userSelf.companyFeatures.attributes.products,
	requiredFields: userSelf.companyFeatures.attributes.required_fields,
	dealsUsageCapping: userSelf.companyFeatures.attributes.deals_usage_capping,
});

const getSettings = (userSelf: UserSelf): Settings => {
	return {
		defaultCurrency: userSelf.attributes.default_currency,
		orgDefaultVisibility: userSelf.settings.get('org_default_visibility'),
		personDefaultVisibility: userSelf.settings.get('person_default_visibility'),
		dealDefaultVisibility: userSelf.settings.get('deal_default_visibility'),
		leadDefaultVisibility: userSelf.settings.get('lead_default_visibility'),
		canChangeVisibility: userSelf.settings.get('can_change_visibility_of_items'),
		showDuplicates: userSelf.settings.get('show_duplicates'),
		currentPipelineId: userSelf.settings.get('current_pipeline_id'),
		save: (key: string, value: any) => {
			userSelf.settings.set({ [key]: value });
			userSelf.settings.save();
		},
	};
};

const getLanguageCode = (userSelf: UserSelf): string => userSelf.attributes.language.language_code;
const getCountryCode = (userSelf: UserSelf): string => userSelf.attributes.language.country_code;
const getLanguage = (userSelf: UserSelf): string => userSelf.getLanguage();

const applyAdditionalSortingRules = (field: Field, fixedOrderFields: string[]) => {
	const index = fixedOrderFields.findIndex((fieldName: string) => fieldName === field.key);

	return index >= 0 ? index : fixedOrderFields.length + 1;
};

const getFields = (
	userSelf: UserSelf,
	modalType: ModalType,
	showFields: string[] = [],
	modalConfig: ModalConfig,
): Fields => {
	let fields = userSelf.fields.attributes[modalType] || [];

	// Add product api doesn't support the price field, also not in the old version.
	if (modalType === 'product') {
		fields = fields.filter((field) => field.key !== 'price');
	}

	const { fixedOrderFields } = modalConfig;

	const keepActiveFields = (field: Field) => {
		const hasOptions = field.options && field.options.length;

		if (field.key === 'label' && !hasOptions) {
			return false;
		}

		return field.add_visible_flag || fixedOrderFields.includes(field.key) || showFields.includes(field.key);
	};

	return {
		visibleFields: _(fields)
			.filter(keepActiveFields)
			.sortBy(['order_nr'])
			.sortBy((field) => applyAdditionalSortingRules(field, fixedOrderFields))
			.concat()
			.value(),
		allFields: fields,
	};
};

const getLeadFields = (userSelf: UserSelf, showFields: string[] = [], modalConfig: ModalConfig): Fields => {
	const fields = getFields(userSelf, 'lead', showFields, modalConfig);

	const dealValueAsMonetary = (field: Field) => {
		if (field.key !== 'deal_value') {
			return field;
		}

		return {
			...field,
			field_type: 'monetary',
		};
	};

	return {
		allFields: fields.allFields.map(dealValueAsMonetary),
		visibleFields: fields.visibleFields.map(dealValueAsMonetary),
	};
};

const getLocale = (userSelf: UserSelf): string => userSelf.attributes.locale;

const getUsers = (companyUsers: CompanyUsers) =>
	companyUsers.models.reduce((users: User[], model: Backbone.Model): User[] => {
		if (model.attributes.active_flag) {
			users.push(model.attributes);
		}

		return users;
	}, []);

export const getIsAccountSettingsEnabled = (userSelf: UserSelf) => {
	const suites = userSelf.attributes?.suites || [];

	return suites.includes('BILLING') &&
			suites.includes('COMPANY_SETTINGS') &&
			suites.includes('SECURITY') &&
			suites.includes('USER_MANAGEMENT');
};

const getIsReseller = (userSelf: UserSelf) => {
	const accountType = userSelf.get('companies')[userSelf.get('company_id')].account_type;

	return !!accountType && accountType.startsWith('provisioning-api-');
};

// eslint-disable-next-line complexity
export const getWebappApiValues = (
	userSelf: UserSelf,
	companyUsers: CompanyUsers,
	componentLoader: ComponentLoader,
	router: Router,
	modalType: ModalType,
	showFields: ShowFields,
	modalConfig: ModalConfig,
	// eslint-disable-next-line max-params
): ParsedWebappApi => {
	const { pipelines, stages } = getPipelinesAndStages(userSelf);
	const currencies = getCurrencies(userSelf);
	const defaultCurrency = getDefaultCurrency(userSelf);
	const features = getFeatures(userSelf);
	const settings = getSettings(userSelf);
	const countryCode = getCountryCode(userSelf);
	const languageCode = getLanguageCode(userSelf);
	const language = getLanguage(userSelf);
	const fields = {
		deal: modalType === 'deal' ? getFields(userSelf, 'deal', showFields.deal || [], modalConfig) : {},
		lead: modalType === 'lead' ? getLeadFields(userSelf, showFields.lead || [], modalConfig) : {},
		person: ['lead', 'deal', 'person'].includes(modalType)
			? getFields(userSelf, 'person', showFields.person || [], modalConfig)
			: {},
		organization: ['lead', 'deal', 'person', 'organization'].includes(modalType)
			? getFields(userSelf, 'organization', showFields.organization || [], modalConfig)
			: {},
		product: modalType === 'product' ? getFields(userSelf, 'product', showFields.deal || [], modalConfig) : {},
		project: modalType === 'project' ? getProjectStaticFields() : {},
	} as FieldsByType;

	const users = getUsers(companyUsers);
	const currentUserId = userSelf.get('id');
	const locale = getLocale(userSelf);
	const isAdmin = userSelf.attributes.is_admin;
	const isAccountSettingsEnabled = getIsAccountSettingsEnabled(userSelf);
	const isReseller = getIsReseller(userSelf);

	return {
		pipelines,
		stages,
		currencies,
		features,
		router,
		countryCode,
		languageCode,
		defaultCurrency,
		language,
		fields,
		users,
		currentUserId,
		settings,
		locale,
		isAdmin,
		componentLoader,
		isAccountSettingsEnabled,
		isReseller
	};
};
