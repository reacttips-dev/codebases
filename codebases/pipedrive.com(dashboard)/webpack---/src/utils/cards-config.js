import React from 'react';
import fetchPersonData from '../person-card/fetch-person-data';
import fetchDealData from '../deal-card/fetch-deal-data';
import fetchLeadData from '../lead-card/fetch-lead-data';
import fetchUserData from '../user-card/fetch-user-data';
import fetchOrganizationData from '../organization-card/fetch-organization-data';

export default {
	deal: {
		component: React.lazy(() => import(/* webpackChunkName: "DealCard" */ '../deal-card')),
		fetchFunction: fetchDealData
	},
	lead: {
		component: React.lazy(() => import(/* webpackChunkName: "LeadCard" */ '../lead-card')),
		fetchFunction: fetchLeadData
	},
	organization: {
		component: React.lazy(() => import(/* webpackChunkName: "OrganizationCard" */ '../organization-card')),
		fetchFunction: fetchOrganizationData
	},
	person: {
		component: React.lazy(() => import(/* webpackChunkName: "PersonCard" */ '../person-card')),
		fetchFunction: fetchPersonData
	},
	user: {
		component: React.lazy(() => import(/* webpackChunkName: "UserCard" */ '../user-card')),
		fetchFunction: fetchUserData
	},
	addNewPerson: {
		component: React.lazy(() => import(/* webpackChunkName: "AddPersonCard" */ '../add-person-card')),
		fetchFunction: () => {},
	}
};