import React from 'react';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';

import { useAppContext } from 'utils/AppContext';
import { ITEM_TYPES } from 'utils/constants';
import { setModalVisible } from 'store/modules/sharedState';

import styles from './style.scss';

const VALID_TYPES = new Set([ITEM_TYPES.DEAL, ITEM_TYPES.ORGANIZATION, ITEM_TYPES.PERSON]);

function EnrichedQuickInfoCard({ id, type, children }) {
	const dispatch = useDispatch();
	const { componentLoader, QuickInfoCard } = useAppContext();

	if (!id || !VALID_TYPES.has(type) || !QuickInfoCard) {
		return <span className={styles.hoverableText}>{children}</span>;
	}

	const onClick = (e = {}) => {
		if (e.target instanceof HTMLAnchorElement) {
			// link clicked inside the card, close search modal
			dispatch(setModalVisible(false));
		}

		e.stopPropagation();
	};

	return (
		<QuickInfoCard
			id={id}
			type={type}
			componentLoader={componentLoader}
			source="search-fe"
			popoverProps={{
				placement: 'right-start',
				offset: 64,
				portalTo: document.querySelector('#froot-global-search'),
				onClick,
			}}
			renderOnError={() => children}
		>
			<span className={styles.hoverableText}>{children}</span>
		</QuickInfoCard>
	);
}

EnrichedQuickInfoCard.propTypes = {
	id: PropTypes.number,
	type: PropTypes.string.isRequired,
	children: PropTypes.node.isRequired,
};

export default EnrichedQuickInfoCard;
