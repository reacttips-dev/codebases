import { useTracking } from 'Utils/metrics/useTracking';
import { leadArchived, leadUnarchived } from 'Utils/metrics/events/lead/lead.archivation';
import { useMutation, graphql } from '@pipedrive/relay';
import { EntryPoint } from 'Utils/EntryPoint';

import { useArchiveLeadMutation, useArchiveLeadMutationResponse } from './__generated__/useArchiveLeadMutation.graphql';

interface UseArchiveLeadProps {
	readonly entryPoint: EntryPoint;
	readonly customViewId?: string;
	onChange?: (updateLead: useArchiveLeadMutationResponse['updateLeadForView'], isArchived: boolean) => void;
}

export const useArchiveLead = ({ entryPoint, customViewId, onChange }: UseArchiveLeadProps) => {
	const tracking = useTracking();

	const [archiveMutation] = useMutation<useArchiveLeadMutation>(graphql`
		mutation useArchiveLeadMutation($input: UpdateLeadInput!, $customViewId: ID) {
			updateLeadForView(input: $input, customViewId: $customViewId) {
				__typename
				... on LeadTableRow {
					id
					__typename
					lead {
						__typename
						id
						isArchived
						isActive
						...leadArchivation_tracking_data
					}
				}
				... on Error {
					__typename
				}
			}
		}
	`);

	const archiveHandler = (archive: boolean, id: string) => {
		archiveMutation({
			variables: {
				input: {
					id,
					isArchived: archive,
				},
				customViewId,
			},
			onCompleted: ({ updateLeadForView }) => {
				if (updateLeadForView?.__typename === 'LeadTableRow' && updateLeadForView.lead) {
					onChange?.(updateLeadForView, archive);

					if (archive) {
						tracking.trackEvent(leadArchived(updateLeadForView.lead, entryPoint));
					} else {
						tracking.trackEvent(leadUnarchived(updateLeadForView.lead, entryPoint));
					}
				}
			},
		});
	};

	return {
		archiveHandler,
	};
};
