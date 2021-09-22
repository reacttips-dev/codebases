import { snakeCase, camelCase, cloneDeep } from 'lodash';
import Logger from '@pipedrive/logger-fe';

import { ActivityFieldKey, LOGGER_FACILITY } from '../../utils/constants';

let webappApi: any;

export const PERMISSIONS = {
	shareInsights: 'can_share_insights',
	exportDataFromLists: 'can_export_data_from_lists',
};

// For some reason Webapp is changing field properties coming from backend.
// We need to be more like Webapp. So we change field properties.
export const applyWebappFieldsAPIHacksForPublicPage = (api: any) => {
	const fields = { ...api.userSelf.fields };
	const logger = new Logger(LOGGER_FACILITY);

	for (const key in fields) {
		fields[key].map((field: any) => {
			if (field.key === 'currency' && field.field_type === 'varchar') {
				field.field_type = 'currency';
			}

			if (field.key === 'pipeline') {
				field.key = 'pipeline_id';
				field.use_field = 'pipeline';
				field.field_type = 'pipeline';
			}

			if (
				key === 'activity' &&
				camelCase(field.key) ===
					ActivityFieldKey.CREATOR_FIELD_KEY_IN_WEBAPP
			) {
				field.key = snakeCase(ActivityFieldKey.CREATOR);
			}

			return fields;
		});
	}

	return {
		...api,
		fields,
		logger,
	};
};

export const applyWebappFieldsAPIHacks = (fields: any) => {
	const modifiedFields = cloneDeep(fields);

	if (modifiedFields && modifiedFields.activity) {
		const activityCreatorFieldIndex = modifiedFields.activity.findIndex(
			(activityField: Pipedrive.ActivityField) =>
				camelCase(activityField.key) ===
				ActivityFieldKey.CREATOR_FIELD_KEY_IN_WEBAPP,
		);

		if (activityCreatorFieldIndex > -1) {
			const CREATOR_KEY_IN_BE = snakeCase(ActivityFieldKey.CREATOR);

			modifiedFields.activity[activityCreatorFieldIndex].key =
				CREATOR_KEY_IN_BE;
		}
	}

	return modifiedFields;
};

export const removeBackbonePropertiesFromWebappApi = (api: any) => {
	const {
		router,
		modals,
		pdMetrics,
		companyUsers,
		teams,
		userSelf,
		componentLoader,
		logger,
		cappingDialog,
		cappingPopover,
	} = api;

	return {
		router,
		modals,
		pdMetrics,
		componentLoader,
		companyUsers: companyUsers.toJSON(),
		teams: teams.toJSON(),
		logger,
		cappingDialog,
		cappingPopover,
		userSelf: {
			...userSelf.toJSON(),
			companyFeatures: userSelf.companyFeatures.toJSON(),
			fields: applyWebappFieldsAPIHacks(userSelf.fields.toJSON()),
			pipelines: userSelf.pipelines.toJSON(),
			settings: userSelf.settings.toJSON(),
			additionalData: userSelf.additionalData,
		},
	};
};

export const get = () => {
	if (!webappApi) {
		throw new Error('webapp-api was required before it was initialized');
	}

	return webappApi;
};

export const set = (api: any) => {
	webappApi = api;
};

const getUserSelf = () => get().userSelf;

export const getCompanyFeatures = () => getUserSelf()?.companyFeatures;

export const getPdMetrics = () => {
	return get().pdMetrics;
};

export const getLogger = () => {
	return get().logger;
};

export const getRouter = () => {
	return get().router;
};

export const getComponentLoader = () => {
	return get().componentLoader;
};

export const isInsightsEnabled = () => {
	return getCompanyFeatures()?.insights;
};

export const isCustomFieldsIndicesFlagEnabled = () => {
	return getCompanyFeatures()?.insights_custom_indices;
};

export const areAlphaFeaturesEnabled = () => {
	return getCompanyFeatures()?.insights_alpha;
};

export const isRecurringRevenueEnabled = () => {
	return getCompanyFeatures()?.recurring_revenue;
};

export const hasPermission = (permission: string) => {
	const permissions = getUserSelf()?.settings;

	return permissions.hasOwnProperty(permission) && permissions[permission];
};

export const isRecurringRevenueGrowthEnabled = () => {
	return getCompanyFeatures()?.recurring_revenue_growth;
};

export const areTeamsEnabled = () => {
	return getCompanyFeatures()?.teams;
};

export const getPipelinesStages = () => {
	return getUserSelf()?.stages;
};

export const getAdditionalData = () => {
	return getUserSelf()?.additionalData;
};

export const isAdmin = () => !!getUserSelf()?.is_admin;

export const getCurrentUserId = () => getUserSelf()?.id;

export const getCompanyId = () => getUserSelf()?.company_id;

export const getTeams = () => get().teams;

export const getActiveTeams = () =>
	getTeams()?.filter((team: Pipedrive.Team) => team.active_flag) || [];

export const getTeamById = (id: number) =>
	getTeams()?.find((team: Pipedrive.Team) => team.id === id);

export const getUsers = () => get().companyUsers;

export const getActiveUsers = () =>
	getUsers()?.filter((user: Pipedrive.User) => user.active_flag) || [];

export const getUserById = (id: number) =>
	getUsers()?.find((user: Pipedrive.User) => user.id === id);

export const getPipelines = () => getUserSelf()?.pipelines;

export const getPipelineById = (id: number) =>
	getPipelines()?.find((pipeline: Pipedrive.Pipeline) => pipeline.id === id);

export const getAllUserSettings = () => getUserSelf()?.settings;

export const getUserSettings = (setting: string) =>
	getAllUserSettings()?.[setting];

export const getFields = (dataType: Pipedrive.FieldsDataType) =>
	getUserSelf()?.fields?.[dataType];

export const getStages = () => getUserSelf().stages;

export const getStageById = (id: number) =>
	getStages()?.find((stage: Pipedrive.Stage) => stage.id === id);

export const getPipelineStages = (pipelineId: number) => {
	return getStages()?.filter(
		(stage: Pipedrive.Stage) => stage.pipeline_id === pipelineId,
	);
};

export const getNthStageOfPipeline = (pipelineId: number, orderNr: number) => {
	return getStages()?.find(
		(stage: Pipedrive.Stage) =>
			stage.pipeline_id === pipelineId && stage.order_nr === orderNr,
	);
};

export const getAllActivityTypes = () => getUserSelf()?.activity_types;

export const getActivityTypes = () =>
	getAllActivityTypes()?.filter(
		(activityType: any) => activityType.active_flag,
	);

export const getActivityTypeById = (id: number) =>
	getAllActivityTypes()?.find(
		(activityType: Pipedrive.ActivityType) => activityType.id === id,
	);

export const getCurrencies = () => getUserSelf()?.currencies;

export const getDefaultCurrency = () => getAllUserSettings()?.default_currency;

export const getDefaultCurrencyId = () => {
	const defaultCurrencyCode = getDefaultCurrency();

	return getCurrencies()?.find(
		(currency: Pipedrive.Currency) => currency.code === defaultCurrencyCode,
	)?.id;
};

export const getCompanyTierCode = () =>
	getUserSelf()?.current_company_plan?.tier_code;

export const arePlatinumFeaturesEnabled = () =>
	isInsightsEnabled() && isCustomFieldsIndicesFlagEnabled();
