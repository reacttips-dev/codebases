import React from 'react';
import classNames from 'classnames';
import {
	Button,
	ButtonGroup,
	Icon,
	Tooltip,
} from '@pipedrive/convention-ui-react';
import { useTranslator } from '@pipedrive/react-utils';
import { types as insightsTypes } from '@pipedrive/insights-core';

import {
	getChartTotalPages,
	isPaginationDirectionLeftToRight,
} from '../ChartGroupByFilter/chartGroupByUtils';
import { ChartMetaDataObject } from '../../types/data-layer';

import styles from './PaginationButtons.pcss';

interface PaginationButtonsProps {
	paginationLineRightPosition?: number;
	pageNumber: number;
	setPageNumber: (pageNumber: number) => void;
	chartType: insightsTypes.ChartType;
	hasNextPage: boolean;
	isWidget?: boolean;
	chartMetaData?: ChartMetaDataObject;
}

const PaginationButtons: React.FC<PaginationButtonsProps> = ({
	paginationLineRightPosition,
	pageNumber,
	setPageNumber,
	chartType,
	hasNextPage,
	isWidget,
	chartMetaData,
}) => {
	const translator = useTranslator();
	const isConversionFunnelReport =
		chartType === insightsTypes.ChartType.FUNNEL;
	const isBarTypeReport = chartType === insightsTypes.ChartType.BAR;
	const paginationDirectionIsLeftToRight =
		isPaginationDirectionLeftToRight(chartType);

	const onPagination = (event: any, backArrowPressed: boolean) => {
		event.stopPropagation();

		const shouldIncreasePagination =
			(!paginationDirectionIsLeftToRight && backArrowPressed) ||
			(paginationDirectionIsLeftToRight && !backArrowPressed);

		if (shouldIncreasePagination) {
			setPageNumber(pageNumber + 1);
		} else {
			setPageNumber(pageNumber - 1);
		}
	};

	const paginationButtonsStyle = isConversionFunnelReport
		? {
				marginRight: `${paginationLineRightPosition + 16}px`,
		  }
		: {};

	const totalPages = getChartTotalPages(
		chartMetaData,
		isConversionFunnelReport,
	);

	const uiPageNumber = pageNumber + 1;
	const tooltipPlacement = isWidget ? 'top' : 'top-end';

	return (
		<div
			className={classNames(styles.paginationButtonsGroup, {
				[styles.widgetPaginationButtonsGroup]: isWidget,
			})}
		>
			<ButtonGroup
				style={paginationButtonsStyle}
				className={classNames({
					[styles.widgetPaginationButtons]: isWidget,
					[styles.widgetPaginationButtonsVertical]:
						isWidget && isBarTypeReport,
				})}
			>
				<Tooltip
					placement={tooltipPlacement}
					content={translator.pgettext(
						'Go to page 1/2',
						'Go to page %s/%s',
						[
							paginationDirectionIsLeftToRight
								? uiPageNumber - 1
								: uiPageNumber + 1,
							totalPages,
						],
					)}
					portalTo={document.body}
				>
					<Button
						className={classNames({
							[styles.widgetPaginationButton]: isWidget,
						})}
						onClick={(e) => onPagination(e, true)}
						disabled={
							paginationDirectionIsLeftToRight
								? !pageNumber
								: !hasNextPage
						}
						data-test="pagination-button-previous"
					>
						<Icon icon="arrow-left" />
					</Button>
				</Tooltip>

				<Tooltip
					placement={tooltipPlacement}
					content={translator.pgettext(
						'Go to page 1/2',
						'Go to page %s/%s',
						[
							paginationDirectionIsLeftToRight
								? uiPageNumber + 1
								: uiPageNumber - 1,
							totalPages,
						],
					)}
					portalTo={document.body}
				>
					<Button
						className={classNames({
							[styles.widgetPaginationButton]: isWidget,
						})}
						onClick={(e) => onPagination(e, false)}
						disabled={
							paginationDirectionIsLeftToRight
								? !hasNextPage
								: !pageNumber
						}
						data-test="pagination-button-next"
					>
						<Icon icon="arrow-right" />
					</Button>
				</Tooltip>
			</ButtonGroup>
		</div>
	);
};

export default PaginationButtons;
