import { useCallback } from 'react';
import useToolsContext from './useToolsContext';
import { Action, ActionTypes } from '../components/menu';

export default () => {
	const { componentLoader } = useToolsContext();

	const handleMenuAction = useCallback(
		async (action: Action) => {
			if (action?.type === ActionTypes.MODAL) {
				const modals = await componentLoader.load('froot:modals');

				modals.open(action.component, action.options);
			}
		},
		[componentLoader],
	);

	return handleMenuAction;
};
