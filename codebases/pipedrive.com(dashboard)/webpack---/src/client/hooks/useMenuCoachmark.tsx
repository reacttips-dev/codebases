import { useEffect, useState } from 'react';
import useToolsContext from './useToolsContext';
import { useDispatch } from 'react-redux';
import { setShowSecondaryMenuCoachmarks } from '../store/navigation/actions';

const mapActions = (actions, getOptions) => {
	return actions
		.map((action) => {
			switch (action.handler) {
				case 'close':
					return {
						...action,
						handler: (event) => {
							event.preventDefault();
							const { coachmark } = getOptions();

							coachmark && coachmark.close();
						},
					};
				case 'goto':
					return {
						...action,
						handler: (event) => {
							event.preventDefault();
							const { router } = getOptions();

							router.navigateTo(action.url);
						},
					};
			}
		})
		.filter((action) => !!action);
};

export default function useMenuCoachmark(item, element, options) {
	const [coachmark, setCoachmark] = useState({ coachmark: null });
	const [visible, setVisible] = useState(false);
	const { iamClient, router } = useToolsContext();
	const dispatch = useDispatch();

	useEffect(() => {
		if (element.current && iamClient && item && item.coachmark && !coachmark.coachmark) {
			const coachmark = new iamClient.Coachmark({
				...item.coachmark,
				...options,
				appearance: {
					...item.coachmark.appearance,
					...options.appearance,
				},
				parent: element.current,
				actions: mapActions(item.coachmark.actions || [], () => ({
					coachmark,
					router,
				})),
				onReady: (data) => {
					dispatch(setShowSecondaryMenuCoachmarks(false));
					setVisible(data.visible);
				},
				onChange: (data) => {
					setVisible(data.visible);
				},
				detached: true,
			});

			setCoachmark({ coachmark });

			return () => {
				coachmark?.remove?.();
				setCoachmark({ coachmark: null });
			};
		}
	}, [element.current, item.coachmark, iamClient]);

	return { coachmark: coachmark.coachmark, visible };
}
