import React from 'react';
import classNames from 'classnames';
import { Spacing } from '@pipedrive/convention-ui-react';

import { isPublicPage } from '../../../utils/helpers';
import { ListViewSegmentDataType } from '../../../types/list-view';

import styles from './Scorecard.pcss';

interface ScorecardProps {
	score: string | number;
	description: string;
	isShownAsWidget: boolean;
	showChartListView?: (data: ListViewSegmentDataType) => void;
}

const Scorecard = ({
	score,
	description,
	isShownAsWidget,
	showChartListView,
}: ScorecardProps) => {
	return (
		<div
			className={
				isShownAsWidget ? styles.widgetContainer : styles.container
			}
			onClick={() =>
				!isPublicPage() && showChartListView({ listName: description })
			}
		>
			<Spacing vertical="s">
				<div
					className={classNames(styles.score, {
						[styles.isClickable]: !isPublicPage(),
					})}
					data-test="scorecard-score"
				>
					{score}
				</div>
			</Spacing>
			{isShownAsWidget && (
				<div className={styles.description}>{description}</div>
			)}
		</div>
	);
};

export default Scorecard;
