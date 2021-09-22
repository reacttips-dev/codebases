import { ApolloClient, InMemoryCache } from '@apollo/client';

import { getUrl, headers } from './utils';
import { sourceTableDataVar } from '../vars/insightsApi';
import { getCachedReportById } from '../../utils/localState/insightsApiState';

export const InsightsApiCache = new InMemoryCache({
	typePolicies: {
		/**
		 * Store fields in separate references for readability.
		 */
		FieldSettings: {
			keyFields: ['dbName'],
		},
		/**
		 * DealsInsights and all filters available for it
		 * should be merged together to prevent overrides in the cache.
		 */
		DealsInsights: {
			merge: true,
		},
		DealsIdFilter: {
			merge: true,
		},
		DealsDateTimeFilter: {
			merge: true,
		},
		DealsMultipleOptionsFilter: {
			merge: true,
		},
		DealsNumericFilter: {
			merge: true,
		},
		DealsTimeFilter: {
			merge: true,
		},
		DealsBooleanFilter: {
			merge: true,
		},
		DealsKeywordFilter: {
			merge: true,
		},
		DealsSingleOptionFilter: {
			merge: true,
		},
		/**
		 * GroupBy fields.
		 */
		DealsGroupById: {
			merge: true,
		},
		DealsGroupByMonetary: {
			merge: true,
		},
		DealsGroupByMultipleOptions: {
			merge: true,
		},
		DealsGroupBySingleOption: {
			merge: true,
		},
		DealsGroupByInterval: {
			merge: true,
		},
		DealsGroupByKeyword: {
			merge: true,
		},
		/**
		 * As "filter" and "groupBy" are separate query levels it is required
		 * to merge them as well since they are considered as return values by Apollo.
		 */
		Filter: {
			merge: true,
		},
		GroupBy: {
			merge: true,
		},
		/**
		 * ActivitiesInsights and MailsInsights queries are flat,
		 * so the return value is always one level down in the response,
		 * therefore we only merge the "activities" and "mails" arrays for easier cache reads.
		 */
		ActivitiesInsights: {
			merge: true,
		},
		MailsInsights: {
			merge: true,
		},
		Query: {
			fields: {
				cachedReports: {
					read(_, { args }) {
						return getCachedReportById(args?.id);
					},
				},
				sourceTableData(_, { args }) {
					return sourceTableDataVar().find(
						(table: any) => table?.id === args?.id,
					);
				},
				/**
				 * Merging deals, activities, and mails to prevent overriding
				 * of the result via subsequent queries.
				 */
				deals: {
					merge: true,
				},
				activities: {
					merge: true,
				},
				mails: {
					merge: true,
				},
			},
		},
	},
});

export const InsightsApiClient = new ApolloClient({
	uri: getUrl(
		window?.app?.isPublic
			? '/insights-public-gateway/api'
			: '/api/v1/insights-api/graphql',
	),
	cache: InsightsApiCache,
	...headers,
});
