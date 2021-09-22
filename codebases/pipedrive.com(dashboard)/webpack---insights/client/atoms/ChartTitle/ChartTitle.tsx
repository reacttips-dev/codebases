import React from 'react';
import classNames from 'classnames';
import { InlineInfo } from '@pipedrive/convention-ui-react';

import styles from './ChartTitle.pcss';

interface ChartTitleProps {
	title: string;
	subtitle?: string;
	inlineInfoContent?: React.ReactNode;
	isInWidget: boolean;
}

const ChartTitle = ({
	title,
	subtitle,
	inlineInfoContent,
	isInWidget = false,
}: ChartTitleProps): JSX.Element => {
	const shouldShowInlineInfo: boolean = inlineInfoContent && !isInWidget;
	const isSubtitleVisible: boolean = subtitle && !isInWidget;

	return (
		<>
			<div className={styles.titleWrapper}>
				<div
					className={classNames(styles.title, {
						[styles.titleInWidget]: isInWidget,
					})}
					data-test="chart-title"
				>
					{title}
				</div>
				{shouldShowInlineInfo && (
					<InlineInfo
						text={inlineInfoContent}
						placement="top"
						portalTo={document.body}
					/>
				)}
			</div>
			{isSubtitleVisible && (
				<div data-test="chart-subtitle">{subtitle}</div>
			)}
		</>
	);
};

export default ChartTitle;
