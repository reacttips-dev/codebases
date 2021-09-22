import { get } from '@pipedrive/fetch';

const fetchUserData = async (userId, isPlatinum = false) => {
	if (isPlatinum) {
		const [{data: user}, {data: teams}] = await Promise.all([
			get(`/api/v1/users/${userId}`),
			get(`/api/v1/teams/user/${userId}`)
		]);

		return {...user, teams};
	}

	const { data: user } = await get(`/api/v1/users/${userId}`);

	return user;
};

export default fetchUserData;