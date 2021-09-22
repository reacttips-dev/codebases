import { InMemoryCache } from '@apollo/client';

import { goalsState } from '../vars/goalsState';

export const GoalsApiCache = new InMemoryCache({
	typePolicies: {
		Query: {
			fields: {
				goalsState: {
					read() {
						return goalsState();
					},
				},
			},
		},
	},
});
