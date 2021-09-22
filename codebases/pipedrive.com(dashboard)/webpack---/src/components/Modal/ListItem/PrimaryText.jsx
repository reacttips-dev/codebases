import React from 'react';
import { useDispatch } from 'react-redux';

import HighlightedText from './HighlightedText';
import QuickInfoCard from './QuickInfoCard';

import searchItemPropType from 'utils/searchItemPropType';
import {
	getItemHref,
	getItemTitle,
	isFile,
	isImageFile,
	onPrimaryLinkClick,
	trackPrimaryLinkClick,
} from 'utils/listItem';
import { INPUT_TYPES } from 'utils/constants';
import { isModifierKeyClick, isMiddleMouseClick } from 'utils/helpers';

import styles from './style.scss';

function PrimaryText({ item }) {
	const dispatch = useDispatch();

	const onClick = (e) => {
		// prevent listItem onClick from firing
		e.stopPropagation();

		onPrimaryLinkClick({
			item,
			dispatch,
			selectedBy: INPUT_TYPES.MOUSE,
			openedInSameTab: !isModifierKeyClick(e),
		});
	};

	const getNagivationAttributes = () => {
		const attributes = {
			onClick,
		};

		if (isImageFile(item)) {
			return attributes;
		}

		attributes.href = getItemHref(item);
		attributes.onMouseUp = (e) => {
			if (isMiddleMouseClick(e)) {
				trackPrimaryLinkClick(item, INPUT_TYPES.MOUSE, false);
			}
		};

		if (isFile(item)) {
			// open files in new tab
			attributes.target = '_blank';
			attributes.rel = 'noreferrer';
		}

		return attributes;
	};

	const title = getItemTitle(item);

	return (
		<div>
			<QuickInfoCard id={item.id} type={item.type}>
				<a {...getNagivationAttributes()} className={styles.primaryText}>
					<HighlightedText>{title || '-'}</HighlightedText>
				</a>
			</QuickInfoCard>
		</div>
	);
}

PrimaryText.propTypes = {
	item: searchItemPropType,
};

export default PrimaryText;
