import { InMemoryCache } from '@apollo/client';

import { cappingState } from '../vars/cappingState';
import { capMappingState } from '../vars/capMappingState';

export const CappingApiCache = new InMemoryCache({
	typePolicies: {
		Query: {
			fields: {
				cappingState: {
					read() {
						return cappingState();
					},
				},
				capMappingState: {
					read() {
						return capMappingState();
					},
				},
			},
		},
	},
});
