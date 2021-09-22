import toLower from 'lodash/toLower';

export { userCompaniesQueryFragment } from './query.gql';

export function toOldUserCompany(defaultCompanyId) {
	return (userCompany) => {
		const id = parseInt(userCompany.company.id, 10);

		return {
			id,
			identifier: userCompany.company.id,
			name: userCompany.company.name,
			domain: userCompany.company.domain,
			region: userCompany.company.region,
			status: toLower(userCompany.company.status),
			account_type: userCompany.company.account_type,
			in_db_migration: userCompany.company.migration_status === 'IN_DATABASE_MIGRATION',
			in_multidc_migration: userCompany.company.public_traffic_lock_flag,

			active_flag: true,
			default_flag: defaultCompanyId === id,
			verified_flag: userCompany.verified_flag,
			is_admin: userCompany.admin_flag ? 1 : 0,
			suites: userCompany.suites
		};
	};
}
