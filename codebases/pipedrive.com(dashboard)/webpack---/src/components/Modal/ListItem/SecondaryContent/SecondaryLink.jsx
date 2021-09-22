import React from 'react';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';

import QuickInfoCard from '../QuickInfoCard';

import { isMiddleMouseClick, isModifierKeyClick } from 'utils/helpers';
import { getItemHref, onSecondaryLinkClick, trackSecondaryLinkClick } from 'utils/listItem';
import searchItemPropType from 'utils/searchItemPropType';

import styles from '../style.scss';
function SecondaryLink({ children, item, secondaryItem }) {
	const dispatch = useDispatch();

	const onClick = (e) => {
		// prevent listItem onClick from firing
		e.stopPropagation();

		onSecondaryLinkClick({
			item,
			dispatch,
			selectedSecondaryItem: secondaryItem,
			openedInSameTab: !isModifierKeyClick(e),
		});
	};

	const onMouseUp = (e) => {
		if (isMiddleMouseClick(e)) {
			trackSecondaryLinkClick(item, secondaryItem, false);
		}
	};

	const { type, id } = secondaryItem;

	return (
		<QuickInfoCard type={type} id={id}>
			<a
				href={getItemHref(secondaryItem)}
				onClick={onClick}
				onMouseUp={onMouseUp}
				className={styles.secondaryLink}
			>
				{children}
			</a>
		</QuickInfoCard>
	);
}

SecondaryLink.propTypes = {
	children: PropTypes.node,
	secondaryItem: {
		type: PropTypes.string,
		id: PropTypes.id,
	},
	item: searchItemPropType,
};

export default SecondaryLink;
