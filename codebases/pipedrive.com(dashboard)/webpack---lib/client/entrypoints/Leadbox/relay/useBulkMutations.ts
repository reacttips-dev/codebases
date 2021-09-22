import { useContext } from 'react';
import { invariant } from '@adeira/js';
import { Disposable, GraphQLTaggedNode, MutationParameters, useMutation, MutationConfig } from '@pipedrive/relay';
import { UIContext } from 'Leadbox/UIContext';
import { useInFlightState } from 'Leadbox/useUIContext';
import { useListContext } from 'Leadbox/LeadsListView/context/ListProvider';

/**
 * This hook not only forces users to use the two mutations combo but it also takes care of the
 * in-flight UI blocking so we don't have to repeat the same logic everywhere.
 */
export function useBulkMutations<M1 extends MutationParameters, M2 extends MutationParameters>(
	mutationForIncludedIDs: GraphQLTaggedNode,
	mutationForExcludedIDs: GraphQLTaggedNode,
): [(config: MutationConfig<M1>) => Disposable, (config: MutationConfig<M2>) => Disposable] {
	const uiContext = useContext(UIContext);
	const inFlightState = useInFlightState();
	const { relayList, selectedRows } = useListContext();

	// Determining whether the bulk mutation is in-flight works a bit differently from conventional
	// mutations. We cannot use `isPending` flag directly because the mutation itself is just half
	// of the process. Each bulk mutation also re-fetches the list of leads. The mutation should be
	// marked as pending throughout this time.
	const [commitIncludedMutation] = useMutation<M1>(mutationForIncludedIDs);
	const [commitExcludedMutation] = useMutation<M2>(mutationForExcludedIDs);

	invariant(
		typeof relayList === 'object',
		"Cannot use '%s' without setting the ListContext first.",
		useBulkMutations.name,
	);

	function prepare() {
		inFlightState.setIsActive(true);
		uiContext.reset();
	}

	function cleanup() {
		selectedRows.reset();
		inFlightState.setIsActive(false);
	}

	function enhanceConfig<T extends MutationParameters>(config: MutationConfig<T>): MutationConfig<T> {
		return {
			...config,
			updater: (store, data) => {
				// invalidate store so that any other virtual connection is forced to refetch
				store.invalidateStore();
				config.updater?.(store, data);
			},
			onCompleted: async (response, errors) => {
				const afterRefetchCallback = () => {
					cleanup();
					config.onCompleted?.(response, errors);
				};
				await relayList?.refetch();
				afterRefetchCallback();
			},
			onError: async (error) => {
				const afterRefetchCallback = () => {
					cleanup();
					const onErrorFn = config.onError;
					if (onErrorFn == null) {
						uiContext.errorMessage.show();
					} else {
						onErrorFn(error);
					}
				};

				await relayList?.refetch();

				afterRefetchCallback();
			},
		};
	}

	return [
		function commitIncludedMutationWrapper(config) {
			prepare();

			return commitIncludedMutation(enhanceConfig<M1>(config));
		},
		function commitExcludedMutationWrapper(config) {
			prepare();

			return commitExcludedMutation(enhanceConfig<M2>(config));
		},
	];
}
