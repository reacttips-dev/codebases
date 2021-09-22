import React, { useRef } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { useDispatch, useSelector } from 'react-redux';

import Icon from './Icon';
import PrimaryText from './PrimaryText';
import SecondaryContent from './SecondaryContent';
import Labels from './Labels';
import CustomFieldsAndNotes from './SecondaryContent/CustomFieldsAndNotes';

import { setActiveItemIndex } from 'store/modules/sharedState';
import { useAppContext } from 'utils/AppContext';
import { listItemOnClick } from 'utils/listItem';
import { INPUT_TYPES, ITEM_TYPES } from 'utils/constants';
import searchItemPropType from 'utils/searchItemPropType';
import { useScrollItemIntoView } from 'hooks/keyboard';

import styles from './style.scss';

function ListItem({ item, itemIndex }) {
	const dispatch = useDispatch();
	const { router } = useAppContext();
	const isActive = useSelector((state) => state.sharedState.activeItemIndex === itemIndex);
	const ref = useRef(null);

	const setLastMouseMove = useScrollItemIntoView(ref, isActive);

	const onClick = () => listItemOnClick({ item, dispatch, router, selectedBy: INPUT_TYPES.MOUSE });

	return (
		<div
			onClick={onClick}
			className={classNames(styles.listItem, isActive && styles.active)}
			{...(!isActive && {
				onMouseMove: () => {
					dispatch(setActiveItemIndex(itemIndex));
					setLastMouseMove(Date.now());
				},
			})}
			onMouseDown={(e) => {
				if (item.type === ITEM_TYPES.KEYWORD) {
					// Keep the input focused
					e.preventDefault();
				}
			}}
			ref={ref}
		>
			<Icon item={item} />
			<div className={styles.centerContent}>
				<PrimaryText item={item} />
				<SecondaryContent item={item} />
				<CustomFieldsAndNotes item={item} />
			</div>
			<Labels item={item} />
		</div>
	);
}

ListItem.propTypes = {
	item: searchItemPropType,
	itemIndex: PropTypes.number.isRequired,
};

export default ListItem;
