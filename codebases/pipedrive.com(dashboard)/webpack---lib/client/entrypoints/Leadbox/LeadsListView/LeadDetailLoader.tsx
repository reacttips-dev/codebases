import { useContext, useEffect, useMemo } from 'react';
import { createFragmentContainer, graphql, useMutation } from '@pipedrive/relay';
import { useLeadDetailContextualView } from 'Hooks/useLeadDetailContextualView';
import { useAppParams } from 'Hooks/useRoutes';
import { WebappApiContext } from 'Components/WebappApiContext';
import { useSetLeadDetailUrl } from 'Hooks/useSetLeadDetailUrl';
import { useUnselectLead } from 'Hooks/useUnselectLead';
import { useListViewContext } from '@pipedrive/list-view';

import type { LeadDetailLoaderMarkAsSeenMutation } from './__generated__/LeadDetailLoaderMarkAsSeenMutation.graphql';
import type { LeadDetailLoader_data } from './__generated__/LeadDetailLoader_data.graphql';

type Props = {
	data: LeadDetailLoader_data | null;
	onScrollToItem: (index: number) => void;
};

const LeadDetailLoaderWithoutData = ({ data, onScrollToItem }: Props) => {
	const edges = useMemo(() => data?.edges ?? [], [data]);
	const { router } = useContext(WebappApiContext);
	const setLeadDetailUrl = useSetLeadDetailUrl(router);
	const unselectLead = useUnselectLead();
	const { actions } = useListViewContext();
	const { uuid } = useAppParams();

	const [markAsSeen] = useMutation<LeadDetailLoaderMarkAsSeenMutation>(graphql`
		mutation LeadDetailLoaderMarkAsSeenMutation($leadID: ID!) @raw_response_type {
			updateLead(input: { id: $leadID, wasSeen: true }) {
				__typename
				... on Lead {
					id
					wasSeen
				}
			}
		}
	`);

	const { openContextualView, selectedLead, closeContextualView } = useLeadDetailContextualView({
		customViewId: data?.activeCustomView?.id,
		onClose: unselectLead,
		onNext(_, idx) {
			const nextEdge = edges[idx + 1];
			const nextUUID = nextEdge?.node?.lead?.uuid as string;
			const hasNext = idx < edges.length - 1 && nextUUID;

			return hasNext
				? () => {
						onScrollToItem(idx + 1);
						setLeadDetailUrl(nextUUID);

						return nextUUID;
				  }
				: false;
		},
		onPrevious(_, idx) {
			const prevEdge = edges[idx - 1];
			const prevUUID = prevEdge?.node?.lead?.uuid as string;
			const hasPrev = idx > 0 && prevUUID;

			return hasPrev
				? () => {
						onScrollToItem(idx - 1);
						setLeadDetailUrl(prevUUID);

						return prevUUID;
				  }
				: false;
		},
	});

	useEffect(() => {
		if (uuid) {
			const leadIndex = edges.findIndex((edge) => edge?.node?.lead?.uuid === uuid);
			const globalID = edges[leadIndex]?.node?.lead?.id;
			openContextualView(uuid, leadIndex);
			actions?.highlightRows(globalID ? [globalID] : []);
		} else {
			closeContextualView();
			actions?.highlightRows([]);
		}

		// We don't pass openContextualView, closeContextualView because
		// otherwise this usEffect goes into the infinite loop
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [uuid, actions, edges]);

	useEffect(() => {
		const lead = edges.find((edge) => edge?.node?.lead?.uuid === selectedLead.leadUuid)?.node?.lead;

		if (lead && lead?.wasSeen === false && lead.id != null) {
			markAsSeen({
				variables: { leadID: lead.id },
				updater(store, { updateLead }) {
					if (updateLead?.__typename === 'Lead') {
						store.get(updateLead.id)?.setValue(true, 'wasSeen');
					}
				},
			});
		}
		// We want to call the mutation only once on mount (or when lead detail content changes).
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [selectedLead]);

	return null;
};

export const LeadDetailLoader = createFragmentContainer(LeadDetailLoaderWithoutData, {
	data: graphql`
		fragment LeadDetailLoader_data on LeadTableConnection {
			activeCustomView {
				id
			}
			edges {
				node {
					lead {
						id
						uuid: id(opaque: false)
						wasSeen
					}
				}
			}
		}
	`,
});
