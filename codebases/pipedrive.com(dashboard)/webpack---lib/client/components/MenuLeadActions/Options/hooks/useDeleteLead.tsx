import { graphql, useMutation } from '@pipedrive/relay';
import { useTracking } from 'Utils/metrics/useTracking';
//
import { leadDeleted } from 'Utils/metrics/events/lead/lead.deletion';
import { EntryPoint } from 'Utils/EntryPoint';

import { useDeleteLeadMutation, useDeleteLeadMutationResponse } from './__generated__/useDeleteLeadMutation.graphql';

interface UseDeleteLeadProps {
	readonly customViewId?: string;
	readonly entryPoint: EntryPoint;
	readonly onComplete: () => void;
	readonly onDelete?: (deletedLead: useDeleteLeadMutationResponse['deleteLeadForView']) => void;
}

export const useDeleteLead = ({ entryPoint, customViewId, onComplete, onDelete }: UseDeleteLeadProps) => {
	const tracking = useTracking();

	const [deleteLead] = useMutation<useDeleteLeadMutation>(graphql`
		mutation useDeleteLeadMutation($leadID: ID!, $customViewId: ID) {
			deleteLeadForView(id: $leadID, customViewId: $customViewId) {
				... on LeadTableRow {
					id
					__typename
					lead {
						__typename
						id
						isArchived
						isActive
						...leadDeletion_tracking
					}
				}
			}
		}
	`);

	const deleteHandler = (leadID: string) => {
		deleteLead({
			variables: {
				leadID,
				customViewId,
			},
			onCompleted: ({ deleteLeadForView }) => {
				if (deleteLeadForView?.__typename === 'LeadTableRow' && deleteLeadForView.lead) {
					tracking.trackEvent(leadDeleted(deleteLeadForView.lead, entryPoint));
				}
				onComplete();
				onDelete?.(deleteLeadForView);
			},
		});
	};

	return { deleteHandler };
};
