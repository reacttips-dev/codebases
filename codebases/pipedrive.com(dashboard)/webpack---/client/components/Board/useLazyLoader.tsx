import _ from 'lodash';
// @ts-ignore
import { useStore } from 'react-redux';
import { useEffect, MutableRefObject } from 'react';
import { BoardProps, DealListElements } from './Board';
import { DEALS_TO_ADD } from '../../utils/constants';
import { getStagesWithoutAllDeals } from '../../selectors/deals';

export default function useLazyLoader(
	props: BoardProps,
	scrollableContainer: React.RefObject<HTMLDivElement>,
	dealListElements: MutableRefObject<DealListElements>,
) {
	const { fetchDeals, fetchViewerDeals, hasMoreDeals, isViewer } = props;
	const store = useStore();

	useEffect(() => {
		if (!props.isActive) {
			return;
		}

		const isAtBottomOfAnyStage = () => {
			// Wrapped in a try/catch because there may be bugs. In case of error, it will just return
			// false and we can still rely on isAtBottom() function (existing behaviour)
			try {
				if (!dealListElements.current) {
					return;
				}

				const stagesWithoutAllDeals = getStagesWithoutAllDeals(store.getState());

				const currentPosition = scrollableContainer.current.scrollTop;
				const minHeight = _.min(
					Object.keys(dealListElements.current).map((stageId) => {
						const el = dealListElements.current[stageId];
						const stageHasDealsToLoad = stagesWithoutAllDeals.includes(Number(stageId));

						return stageHasDealsToLoad ? el.clientHeight : Infinity;
					}),
				);

				// 100 is magic number, needs/can be tweaked
				return currentPosition + window.innerHeight + 50 >= minHeight;
			} catch (err) {
				return false;
			}
		};

		const isAtBottom = () => {
			const currentPosition = scrollableContainer.current.scrollTop;
			const maxHeight = scrollableContainer.current.scrollHeight - scrollableContainer.current.clientHeight;

			return currentPosition + 50 >= maxHeight;
		};

		const onScrollHandler = () => {
			if (!scrollableContainer.current || !hasMoreDeals) {
				return;
			}

			if (isAtBottomOfAnyStage() || isAtBottom()) {
				if (isViewer) {
					fetchViewerDeals(DEALS_TO_ADD);
				} else {
					fetchDeals(DEALS_TO_ADD);
				}
			}
		};

		// Run it once if there is available space on the board
		onScrollHandler();

		const debouncedScrollHanlder = _.debounce(onScrollHandler, 150);

		window.addEventListener('scroll', debouncedScrollHanlder, true);

		return () => {
			window.removeEventListener('scroll', debouncedScrollHanlder, true);
		};
	}, [props.isActive, props.hasMoreDeals, props.isLoading, props.selectedPipelineId]);
}
