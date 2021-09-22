import React from 'react';
import { PDMetrics } from '@pipedrive/react-utils';
import { CompanyUsers, ComponentLoader, FrootRouter, UserSelf } from '@pipedrive/types';
import { Currency, CustomActivityTypesMapping, WebappApiContextInterface, ContextualView } from 'Types/types';

const getCurrencies = (userSelf: UserSelf): Currency[] => {
	return userSelf.attributes.currencies;
};

const getAdvancedPermissions = (userSelf: UserSelf): boolean => {
	return userSelf.companyFeatures.attributes.advanced_permissions;
};

const getTeamsFeature = (userSelf: UserSelf): boolean => {
	return userSelf.companyFeatures.attributes.teams;
};

const getIsLiveChatEnabled = (userSelf: UserSelf): string => {
	return userSelf.companyFeatures.attributes.leadbooster_livechat;
};

const getIsProspectorEnabled = (userSelf: UserSelf): string => {
	return userSelf.companyFeatures.attributes.outbound_leads;
};

const getIsWorkflowAutomationEnabled = (userSelf: UserSelf): string => {
	return userSelf.companyFeatures.attributes.automation_live;
};

const getIsLeadsInboxActiveUser = (userSelf: UserSelf): string => {
	return userSelf.companyFeatures.attributes.leads_inbox_active_user;
};

const getLeadDefaultVisibility = (userSelf: UserSelf): number => {
	return userSelf.settings.get('lead_default_visibility');
};

const getCustomActivityTypesMapping = (userSelf: UserSelf): CustomActivityTypesMapping => {
	const customActivityTypesMapping = {} as CustomActivityTypesMapping;

	// optional chaining is used here because sometimes webapp returns `activity_types === undefined` for some unknown reason
	// and we're getting `Cannot read property 'map' of undefined` errors
	userSelf.attributes.activity_types?.map((type) => {
		customActivityTypesMapping[type.key_string] = type.icon_key;
	});

	return customActivityTypesMapping;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const getCreateEmptyFiltersCollection = (modelCollectionFactory: any) => {
	return () => modelCollectionFactory.getCollection('filter');
};

interface WebAppApiProps {
	companyUsers: CompanyUsers;
	userSelf: UserSelf;
	pdMetrics: PDMetrics;
	router: FrootRouter;
	componentLoader: ComponentLoader;
	contextualView: ContextualView;
	modelCollectionFactory: any; // eslint-disable-line @typescript-eslint/no-explicit-any
}

type menuWaitressState = {
	key: string;
	value: string;
};

const isMenuWaitressPinnedInLeads = (menuState: [menuWaitressState]) => {
	const leadState = menuState?.find((state) => state.key === 'lead');

	return leadState?.value === 'pinned';
};

export const getWebappApiContextValues = ({
	companyUsers,
	userSelf,
	pdMetrics,
	router,
	componentLoader,
	contextualView,
	modelCollectionFactory,
}: WebAppApiProps): WebappApiContextInterface => {
	const currencies = getCurrencies(userSelf);
	const advancedPermissions = getAdvancedPermissions(userSelf);
	const teamsFeature = getTeamsFeature(userSelf);
	const userNamesFromIds = companyUsers._byId;
	const isUserAdmin = userSelf.attributes.is_admin;
	const isLeadboosterEnabled = userSelf.companyFeatures.attributes.leadbooster_addon;
	const leadDefaultVisibility = getLeadDefaultVisibility(userSelf);
	const customActivityTypesMapping = getCustomActivityTypesMapping(userSelf);
	const trackUsage = pdMetrics.trackUsage;
	const canUseImport = Boolean(userSelf.settings.get('can_use_import'));
	const canUseExport = Boolean(userSelf.settings.get('can_export_data_from_lists'));
	const canDeleteActivities = userSelf.settings.get('can_delete_activities');
	const canChangeVisibility = userSelf.settings.get('can_change_visibility_of_items');
	const isLiveChatEnabled = Boolean(getIsLiveChatEnabled(userSelf));
	const isProspectorEnabled = Boolean(getIsProspectorEnabled(userSelf));
	const isWorkflowAutomationEnabled = Boolean(getIsWorkflowAutomationEnabled(userSelf));
	const isLeadsInboxActiveUser = Boolean(getIsLeadsInboxActiveUser(userSelf));
	const createEmptyFiltersCollection = getCreateEmptyFiltersCollection(modelCollectionFactory);
	const fields = userSelf.fields.attributes;
	const locale = userSelf.attributes?.locale?.replace('_', '-') ?? 'en-US';

	const isMenuWaitressSidebarPinned = isMenuWaitressPinnedInLeads(userSelf?.settings?.get('froot_menu_state'));

	return {
		userSelf,
		currencies,
		componentLoader,
		advancedPermissions,
		teamsFeature,
		userNamesFromIds,
		leadDefaultVisibility,
		router,
		isUserAdmin,
		isLeadboosterEnabled,
		isLeadsInboxActiveUser,
		customActivityTypesMapping,
		canChangeVisibility,
		canDeleteActivities,
		trackUsage,
		isLiveChatEnabled,
		isProspectorEnabled,
		isWorkflowAutomationEnabled,
		isMenuWaitressSidebarPinned,
		permissions: {
			canUseImport,
			canUseExport,
		},
		contextualView,
		createEmptyFiltersCollection,
		modelCollectionFactory,
		fields: {
			lead: fields.lead,
			person: fields.person,
			organization: fields.organization,
		},
		locale,
	};
};

export const WebappApiContext = React.createContext({} as WebappApiContextInterface);
