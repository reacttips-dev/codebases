import React, { useRef } from 'react';
import { useSelector } from 'react-redux';
import classNames from 'classnames';

import { Panel, Separator, Spacing } from '@pipedrive/convention-ui-react';
import SidePanel from './SidePanel';
import SearchResults from './SearchResults';
import RecentItems from './RecentItems';
import { showSearchResults } from 'store/modules/sharedState';
import { useContentHeight, useTransitions } from 'hooks/transitions';
import { usePaginationOnScroll, usePaginateOnInitialResults } from 'hooks/pagination';

import styles from './style.scss';

function SearchModal() {
	const searchResultsVisible = useSelector(showSearchResults);

	const contentRef = useRef(null);
	const contentHeightRef = useRef(null);
	const { modalHeight, hideScrollbar } = useContentHeight(contentHeightRef);
	const { recentItemsOpening, sidePanelVisible } = useTransitions();
	const onSearchResultsScroll = usePaginationOnScroll();
	usePaginateOnInitialResults(contentRef, contentHeightRef);

	return (
		<div className={classNames(styles.modalPosition, searchResultsVisible && styles.wideModal)}>
			<Panel
				radius="s"
				noBorder
				noMargin
				className={classNames(styles.modal, recentItemsOpening && styles.recentsModalAppear)}
				style={{ height: modalHeight }}
			>
				{sidePanelVisible && (
					<div className={styles.sidepanelWrapper}>
						<SidePanel />
						<Separator type="vertical" spacing="none" />
					</div>
				)}

				<Spacing
					all="none"
					className={classNames(styles.modalContent, hideScrollbar && styles.hideScrollbar)}
					onScroll={onSearchResultsScroll}
					forwardRef={contentRef}
				>
					<div className={styles.contentListWrapper} ref={contentHeightRef}>
						{searchResultsVisible ? <SearchResults /> : <RecentItems />}
					</div>
				</Spacing>
			</Panel>
		</div>
	);
}

export default SearchModal;
