import { graphql, useSubscription } from '@pipedrive/relay';
import { useMemo } from 'react';
import { activityRelayHelpers } from 'Utils/graphql/activityRelayHelpers';

import type { useSubscriptionActivitySubscription } from './__generated__/useSubscriptionActivitySubscription.graphql';

export const useSubscriptionActivity = () =>
	useSubscription<useSubscriptionActivitySubscription>(
		useMemo(() => {
			return {
				subscription: graphql`
					subscription useSubscriptionActivitySubscription {
						INTERNAL__webapp {
							activity {
								id
								lead {
									id
								}
								...Activity_data
							}
						}
					}
				`,
				updater: (store, { INTERNAL__webapp }) => {
					const { lead } = INTERNAL__webapp.activity;
					if (!lead) {
						return;
					}

					const leadRecord = store.get(lead.id);
					const activityRecord = store.get(INTERNAL__webapp.activity.id);
					const leadId = leadRecord?.getValue('id');

					if (!leadId || !leadRecord || !activityRecord) {
						return;
					}

					activityRelayHelpers.injectToLead({
						activity: activityRecord,
						lead: leadRecord,
					});
				},
			};
		}, []),
	);
