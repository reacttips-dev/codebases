const User = require('models/user');

const isLeadColumnsInActivityListFeatureEnabled = () => {
	try {
		return User.companyFeatures.get('lead_columns_in_activities_list');
	} catch (e) {
		return false;
	}
};

module.exports = {
	isLeadColumnsInActivityListFeatureEnabled
};
