const User = require('models/user');

const enabledParentTypes = ['activity'];
const customLinkForType = {
	lead: 'deal'
};

const contextualViewNewUsers = () => {
	try {
		return (
			!User.companyFeatures.get('contextual_view') &&
			User.companyFeatures.get('contextual_view_release_2')
		);
	} catch (e) {
		return false;
	}
};

const isContextualViewFeatureEnabled = () => {
	try {
		return (
			User.companyFeatures.get('contextual_view') ||
			User.companyFeatures.get('contextual_view_release_2')
		);
	} catch (e) {
		return false;
	}
};

const isContextualViewUserSettingsEnabled = function() {
	try {
		return User.settings.get('contextual_view');
	} catch (e) {
		return false;
	}
};

const isContextualViewFullEnabled = function(model = null) {
	try {
		const isAvailable =
			isContextualViewFeatureEnabled() && isContextualViewUserSettingsEnabled();

		if (model) {
			return isAvailable && enabledParentTypes.includes(model);
		}

		return isAvailable;
	} catch (e) {
		return false;
	}
};

const isLeadsInActivityListFeatureEnabled = () => {
	try {
		return User.companyFeatures.get('leads_in_activities_list');
	} catch (e) {
		return false;
	}
};

const getEnabledSubTypes = () => {
	const enabledSubTypes = ['deal', 'organization', 'person'];

	if (isLeadsInActivityListFeatureEnabled()) {
		enabledSubTypes.push('lead');
	}

	return enabledSubTypes;
};

const getLinkAttribute = (type, value, parentType, parentId, link) => {
	if (
		isContextualViewFullEnabled() &&
		enabledParentTypes.includes(parentType) &&
		getEnabledSubTypes().includes(type)
	) {
		const tab = customLinkForType[type] || type;

		return `${window.location.pathname}?selected=${parentId}&tab=${tab}`;
	}

	return link || `/${type}/${value}`;
};

module.exports = {
	isContextualViewFullEnabled,
	isContextualViewFeatureEnabled,
	isContextualViewUserSettingsEnabled,
	contextualViewNewUsers,
	getLinkAttribute,
	getEnabledSubTypes,
	isLeadsInActivityListFeatureEnabled
};
