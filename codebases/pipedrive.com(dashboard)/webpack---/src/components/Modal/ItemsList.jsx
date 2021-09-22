import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import { Spacing, Text } from '@pipedrive/convention-ui-react';
import ListItem from './ListItem';

import styles from './style.scss';

function ItemsList({ items, title, indexOffset = 0, contentClassName, titleClassName, emptyMessage }) {
	return (
		<Spacing className={styles.itemsListWrapper}>
			<Text className={classNames(styles.itemListHeader, titleClassName)}>{title}</Text>
			<div className={contentClassName}>
				{items.length ? (
					items.map(({ item }, index) => (
						<ListItem key={`${item.type}${item.id}`} item={item} itemIndex={index + indexOffset} />
					))
				) : (
					<div className={styles.emptyMessage}>{emptyMessage}</div>
				)}
			</div>
		</Spacing>
	);
}

ItemsList.propTypes = {
	items: PropTypes.array.isRequired,
	title: PropTypes.string.isRequired,
	indexOffset: PropTypes.number,
	contentClassName: PropTypes.string,
	titleClassName: PropTypes.string,
	emptyMessage: PropTypes.string,
};

export default ItemsList;
