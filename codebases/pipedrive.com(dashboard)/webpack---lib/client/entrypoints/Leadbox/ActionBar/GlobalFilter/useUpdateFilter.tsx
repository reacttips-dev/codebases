import { commitLocalUpdate, useRelayEnvironment, Disposable } from '@pipedrive/relay';
import { useRef } from 'react';

export const useUpdateFilter = () => {
	const environment = useRelayEnvironment();
	const disposable = useRef<Disposable | null>(null);

	const deleteFilter = (nodeId: string) => {
		commitLocalUpdate(environment, (store) => {
			const listOfRecords = store.getRoot().getLinkedRecords('filters');
			const newList = listOfRecords?.filter((record) => record.getDataID() !== nodeId);
			store.getRoot().setLinkedRecords(newList, 'filters');
		});
	};

	const addTemporaryFilter = (nodeId: string) => {
		/** applyUpdate is prefer here as it will retain the data from the update
		 * and it will be remove only if disposable is called, this way it guarantees
		 * the temporary filter will be stored until the modal is closed
		 */
		disposable.current?.dispose();
		disposable.current = environment.applyUpdate({
			storeUpdater(store) {
				const listOfRecords = store.getRoot().getLinkedRecords('filters') ?? [];
				const newFilter = store.get(nodeId);

				if (newFilter) {
					store.getRoot().setLinkedRecords([...listOfRecords, newFilter], 'filters');
				}
			},
		});
	};

	const removeTemporaryFilter = () => {
		disposable.current?.dispose();
	};

	return {
		deleteFilter,
		addTemporaryFilter,
		removeTemporaryFilter,
	};
};
