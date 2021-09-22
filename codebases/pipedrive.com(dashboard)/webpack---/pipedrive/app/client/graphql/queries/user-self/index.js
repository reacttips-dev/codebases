import _ from 'lodash';
import ApolloClient from '../../client';
import { toOldUserCompany } from '../user-companies';
import { parseToOldGlobalMessages } from '../global-messages';
import { removeNulls } from 'client/graphql/helpers';

export { getUserSelf } from './query.gql';

export const parseToOldUsersSelf = (response) => {
	// userSelf query has cache disabled as it takes too much time to fill the cache with data
	// this way we schedule flushing part of the data to cache
	writeCache(response);

	const {
		user,
		company,
		constants,
		integrations,
		userSettings,
		globalMessages,
		legacyUserSettings,
		billingDetails
	} = response;

	const companyId = company.id;
	const companies = _.keyBy(
		response.userCompanies.map(toOldUserCompany(userSettings.default_company)),
		'id'
	);
	const userCompany = companies[companyId];
	const billingPlan = billingDetails.plan;
	const userEmails = response.userEmails;

	const userSelf = {
		'2fa_enabled': Boolean(userSettings['2fa_enabled']),
		'active_flag': userCompany.active_flag,
		'activity_types': response.activityTypes,
		'alternative_emails': userEmails ? userEmails.alternative_emails : null,
		'cc_email': userEmails ? userEmails.cc_email : null,
		companies,
		'company_add_time': company.add_time,
		'company_country': company.country,
		'company_domain': company.domain,
		'company_id': parseInt(companyId, 10),
		'company_name': company.name,
		'company_status': company.status.toLowerCase(),
		'connections': integrations?.connections || [],
		'created': user.add_time,
		'currencies': response.currencies,
		'current_company_features': response.companyFeatures,
		'current_company_plan': {
			id: billingPlan.id,
			code: billingPlan.code,
			billing_cycle: billingPlan.billing_cycle,
			tier_code: billingPlan.tier_code
		},
		'custom_views': response.customViews,
		'data_extra_field_limit': constants.data_extra_field_limit,
		'default_currency': legacyUserSettings.default_currency,
		'email': user.email,
		'global_messages': parseToOldGlobalMessages(globalMessages),
		'icon_url': user.pic_url,
		'id': parseInt(user.id, 10),
		'is_admin': userCompany.is_admin,
		'is_you': true,
		'lang': user.language.id,
		'language': user.language,
		'last_login': user.last_login,
		'locale': user.locale,
		'modified': user.update_time,
		'name': user.name,
		'original_company': user.creator_company_id,
		'phone': user.phone,
		'pipelines': response.pipelines,
		'role_id': user.role_id,
		'stages': response.stages,
		'suites': userCompany.suites,
		'timezone_id': user.timezone_id,
		'timezone_name': user.timezone_name,
		'timezone_offset': user.timezone_offset,
		'wgw_active': constants.wgw_active
	};

	_.assignIn(userSelf, response.currentCompanyInfo);

	userSelf.current_user_settings = {
		...legacyUserSettings,
		...user.permissions,
		...user.roleSettings
	};

	userSelf.fields = {
		lead: response.leadFields,
		deal: response.dealFields,
		person: response.personFields,
		organization: response.organizationFields,
		product: response.productFields,
		activity: response.activityFields,
		user: response.userFields,
		filter: response.filterFields,
		mail_list: response.mailListFields,
		note: response.noteFields
	};

	userSelf['3rd_party_auth_links'] = {
		nylas: _.get(integrations, 'nylas.nylas_auth_link')
	};
	userSelf.intercom_user_hash = _.get(integrations, 'intercom.intercom_user_hash');
	userSelf.recurly_coupons = _.get(integrations, 'intercom.recurly_coupons');
	userSelf.additional_data = {
		locale_convention: user.localeOptions,
		google_maps_js_url: _.get(integrations, 'google.google_maps_js_url'),
		google_geocode_url: _.get(integrations, 'google.google_geocode_url'),
		max_upload_size_bytes: constants.max_upload_size_bytes
	};

	// Apollo cache is a frozen object, but some models extend data, needs to be deepcloned
	// Client code expects keys, with null values not to be present
	return removeNulls(userSelf);
};

function writeCache(data) {
	setTimeout(() => {
		ApolloClient.writeQuery({ query: require('./query.gql').manualWriteQuery, data });
	}, 0);
}
