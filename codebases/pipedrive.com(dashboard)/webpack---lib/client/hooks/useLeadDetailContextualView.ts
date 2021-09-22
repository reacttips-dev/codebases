import { WebappApiContext } from 'Components/WebappApiContext';
import { useCallback, useContext, useEffect, useState } from 'react';

type Handler = (uuid: string, index: number) => false | (() => string);

type Args = {
	customViewId?: string;
	onNext: Handler;
	onPrevious: Handler;
	onClose?: () => void;
};

const initSelectedLead = { leadUuid: null, index: -1 };

export const useLeadDetailContextualView = ({ customViewId, ...callbacks }: Args) => {
	const { isMenuWaitressSidebarPinned, contextualView } = useContext(WebappApiContext);
	const [selectedLead, setSelectedLead] = useState<{ leadUuid: null | string; index: number }>(initSelectedLead);

	const close = useCallback(() => {
		setSelectedLead(initSelectedLead);
		callbacks.onClose?.();
		contextualView.close();
	}, [contextualView, callbacks]);

	const openContextualView = useCallback(
		(leadUuid: string, index: number) => {
			setSelectedLead({
				leadUuid,
				index,
			});

			const nextHandler = callbacks.onNext(leadUuid, index);
			const prevHandler = callbacks.onPrevious(leadUuid, index);

			contextualView?.open({
				componentName: 'leadbox-fe:lead-details-view',
				componentOptions: {
					leadUuid,
					customViewId,
				},
				onClose: close,
				onNext:
					nextHandler &&
					(() => {
						const nextLead = nextHandler();
						openContextualView(nextLead, index + 1);
					}),
				onPrevious:
					prevHandler &&
					(() => {
						const prevLead = prevHandler();
						openContextualView(prevLead, index - 1);
					}),
				hideFeedbackForm: true,
				hasSidebar: isMenuWaitressSidebarPinned,
			});
		},
		[callbacks, contextualView, customViewId, close, isMenuWaitressSidebarPinned],
	);

	useEffect(() => {
		return () => {
			contextualView?.close();
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return {
		selectedLead,
		openContextualView,
		closeContextualView: close,
	};
};
