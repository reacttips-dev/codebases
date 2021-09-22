import { get } from '@pipedrive/fetch';

const fetchOrganizationData = async (orgId) => {
	const [{data: organization}, {data: personsResponse = []}] = await Promise.all([
		get(`/api/v1/organizations/${orgId}`),
		get(`/api/v1/organizations/${orgId}/persons`)
	]);

	const persons = personsResponse && personsResponse.map(({name}) => name);

	return { ...organization, persons };
};

export default fetchOrganizationData;