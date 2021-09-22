import { getCookieValue } from '@pipedrive/fetch';

const query = `
	query ($leadId: ID!) {
		leads {
			selectedLead(id: $leadId) {
				title
				internalId: id(opaque: false)
				person {
					internalId: id(opaque: false)
					name
				}
				organization {
					internalId: id(opaque: false)
					name
				}
			}
		}
	}
`;

const getLeadPerson = (lead) => {
	if (lead.person.internalId) {
		return {
			id: lead.person.internalId,
			name: lead.person.name
		};
	}
};

const getLeadOrganization = (lead) => {
	if (lead.organization.internalId) {
		return {
			id: lead.organization.internalId,
			name: lead.organization.name
		};
	}
};

const fetchLeadData = async (leadId) => {
	const body = {
		query,
		variables: { leadId },
	};

	const { data } = await fetch(`/leads-graphql?session_token=${getCookieValue('pipe-session-token')}`, {
		method: 'POST',
		headers: {
			'Accept': 'application/json',
			'Content-Type': 'application/json',
			'Cache-control': 'no-cache',
		},
		body: JSON.stringify(body),
	}).then(res => res.json());

	if (!data && !data.leads && !data.leads.selectedLead) {
		throw new Error('Lead not found');
	}

	const lead = data.leads.selectedLead;

	return {
		id: lead.internalId,
		title: lead.title,
		person: getLeadPerson(lead),
		organization: getLeadOrganization(lead)
	};
};

export default fetchLeadData;
