import { useCallback, useContext } from 'react';
import { WebappApiContext } from 'Components/WebappApiContext';
import { useListContext } from 'Leadbox/LeadsListView/context/ListProvider';

export const useAddLeadModal = () => {
	const { fetchNewLead } = useListContext();
	const { componentLoader } = useContext(WebappApiContext);

	return useCallback(async () => {
		const modals = await componentLoader.load('froot:modals');
		modals.open('add-modals:froot', {
			type: 'lead',
			metrics_data: {
				source: 'Leads inbox',
			},
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			onSave: ({ data }: any) => {
				if (data) {
					fetchNewLead(data.id);
				}
			},
		});
	}, [componentLoader, fetchNewLead]);
};
