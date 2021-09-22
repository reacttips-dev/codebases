export { getCompanyUsers } from './query.gql';

export const toOldCompanyUsers = (data) => {
	return data.company.users.map(
		({
			user,
			active_flag: activeFlag,
			admin_flag: adminFlag,
			is_you: isYou,
			verified_flag: verifiedFlag,
			suites
		}) => {
			const {
				id,
				currency,
				add_time: addTime,
				update_time: updateTime,
				pic_url: picUrl,
				...userInfo
			} = user;

			return {
				id: parseInt(id, 10),
				default_currency: currency,
				activated: true,
				verified: verifiedFlag,
				is_admin: adminFlag ? 1 : 0,
				active_flag: activeFlag,
				created: addTime,
				modified: updateTime,
				icon_url: picUrl,
				is_you: isYou,
				suites,
				...userInfo
			};
		}
	);
};
