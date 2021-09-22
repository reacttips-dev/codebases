import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';

import { Spacing, Text } from '@pipedrive/convention-ui-react';

import styles from './style.scss';
import recentStyles from '../../style.scss';

function SkeletonItem() {
	return (
		<div className={classNames(styles.skeletonItem)}>
			<div className={styles.circle} />
			<div className={styles.lines}>
				<div className={styles.line} />
				<div className={styles.line} />
			</div>
		</div>
	);
}

function Skeleton({ title }) {
	return (
		<Spacing
			className={classNames(recentStyles.itemsListWrapper, recentStyles.skeleton, recentStyles.skeletonAppear)}
		>
			<Text className={recentStyles.itemListHeader}>{title}</Text>
			<SkeletonItem />
			<SkeletonItem />
			<SkeletonItem />
			<SkeletonItem />
		</Spacing>
	);
}

Skeleton.propTypes = {
	title: PropTypes.string,
};

export default Skeleton;
