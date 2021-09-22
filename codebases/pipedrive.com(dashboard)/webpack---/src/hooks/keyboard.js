import { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import debounce from 'lodash/debounce';

import { queryInProgressSelector, resetTermAndResults, termSelector } from 'store/modules/itemSearch';
import {
	activeItemSelector,
	setActiveItemIndex,
	setModalVisible,
	visibleImageSelector,
	visibleItemsSelector,
} from 'store/modules/sharedState';
import { listItemOnClick } from 'utils/listItem';
import { useAppContext } from 'utils/AppContext';
import { ITEM_TYPES, KEYS, INPUT_TYPES } from 'utils/constants';
import scrollIntoView from 'scroll-into-view-if-needed';

const { ESCAPE, ARROW_DOWN, ARROW_UP, ENTER } = KEYS;
const { KEYWORD, FILE, MAIL_ATTACHMENT } = ITEM_TYPES;

export function useArrowNavigation(inputRef) {
	const term = useSelector(termSelector);
	const activeItemIndex = useSelector(activeItemSelector);
	const visibleItems = useSelector(visibleItemsSelector);
	const imageOverlayOpen = !!useSelector(visibleImageSelector);
	const queryInProgress = useSelector(queryInProgressSelector);
	const { router } = useAppContext();
	const dispatch = useDispatch();

	const [inputDebouncing, setInputDebouncing] = useState(false);

	const finishInputDebounce = useCallback(
		debounce(() => setInputDebouncing(false), 350),
		[],
	);
	useEffect(() => {
		setInputDebouncing(true);
		finishInputDebounce();

		return () => finishInputDebounce.cancel();
	}, [term]);

	const onKeyDown = useCallback(
		// eslint-disable-next-line complexity
		(e) => {
			if (e.key === ESCAPE) {
				if (imageOverlayOpen) {
					return;
				}

				if (term) {
					dispatch(resetTermAndResults());
				} else {
					dispatch(setModalVisible(false));
					inputRef.current.blur();
				}
			}

			if (inputDebouncing || queryInProgress) {
				return;
			}

			if (!visibleItems || visibleItems.length === 0) {
				return;
			}

			if (e.key === ARROW_DOWN) {
				e.preventDefault();

				if (visibleItems.length - 1 > activeItemIndex) {
					dispatch(setActiveItemIndex(activeItemIndex + 1));
				}
			}
			if (e.key === ARROW_UP) {
				e.preventDefault();

				if (activeItemIndex >= 1) {
					dispatch(setActiveItemIndex(activeItemIndex - 1));
				}
			}
			if (e.key === ENTER) {
				const { item } = visibleItems[activeItemIndex];

				if (![KEYWORD, FILE, MAIL_ATTACHMENT].includes(item.type)) {
					inputRef.current.blur();
				}

				listItemOnClick({ item, dispatch, router, selectedBy: INPUT_TYPES.KEYBOARD });
			}
		},
		[activeItemIndex, visibleItems, inputRef, inputDebouncing, queryInProgress, imageOverlayOpen],
	);

	return onKeyDown;
}

export function useScrollItemIntoView(ref, isActive) {
	const [lastMouseMove, setLastMouseMove] = useState(0);

	useEffect(() => {
		if (isActive && Date.now() - lastMouseMove > 16) {
			scrollIntoView(ref.current, {
				scrollMode: 'if-needed',
				block: 'nearest',
				inline: 'nearest',
			});
		}
	}, [isActive]);

	return setLastMouseMove;
}
