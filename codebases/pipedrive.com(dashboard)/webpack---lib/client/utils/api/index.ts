import axios from 'axios';
import {
	Organization,
	OrganizationCreate,
	OrgDuplicate,
	Person,
	PersonCreate,
	PersonDuplicate,
	Response,
} from 'Types/types';

import { getUrl } from './api.utils';
import { CountLoader, CountLoaderOpts } from './CountLoader';

const ax = axios.create({
	withCredentials: true,
});

const SERVICE_REFERENCE_HEADER = {
	'x-service-reference': 'leadbox',
};

export class Api {
	public static async loadCount(opts: CountLoaderOpts): Promise<number> {
		return CountLoader.of(opts, ax.get).load();
	}

	public static async createOrganization(orgData: OrganizationCreate) {
		const response = await ax.post<Response<Organization>>(getUrl('/api/v1/organizations'), orgData, {
			headers: {
				...SERVICE_REFERENCE_HEADER,
			},
		});

		if (response.data.success) {
			return response.data.data;
		} else {
			throw new Error('Error creating an organization');
		}
	}

	public static async createPerson(personData: PersonCreate) {
		const response = await ax.post<Response<Person>>(getUrl('/api/v1/persons'), personData, {
			headers: {
				...SERVICE_REFERENCE_HEADER,
			},
		});

		if (response.data.success) {
			return response.data.data;
		} else {
			throw new Error('Error creating a person');
		}
	}

	public static async getLeadfeederStatus() {
		const response = await ax.get(getUrl('/api/v1/leadfeeder/settings/status'));

		if (response.data.success) {
			return response.data.data;
		} else {
			throw new Error('Error getting the leadfeeder status');
		}
	}

	public static async installLeadfeeder() {
		const response = await ax.post(getUrl('/api/v1/leadfeeder/settings/install'));

		if (response.data.success) {
			return response.data.data;
		} else {
			throw new Error('Error installing leadfeeder');
		}
	}

	public static async checkPersonDuplicates(name: string) {
		const response = await ax.get<Response<PersonDuplicate[] | null>>(
			getUrl('/api/v1/searchResults/personDuplicates', { limit: 5, name }),
		);

		if (response.data.success) {
			return response.data.data;
		} else {
			throw new Error('Error getting person duplicates');
		}
	}

	public static async checkOrgDuplicates(name: string) {
		const response = await ax.get<Response<OrgDuplicate[] | null>>(
			getUrl('/api/v1/searchResults/orgDuplicates', { limit: 5, name }),
		);

		if (response.data.success) {
			return response.data.data;
		} else {
			throw new Error('Error getting organization duplicates');
		}
	}
}
