import React, { useRef, useEffect, useState } from 'react';
import classNames from 'classnames';
import { Popover, Button, Icon, Tooltip } from '@pipedrive/convention-ui-react';

import { LegentDataType } from '../../types/data-layer';
import {
	getVisibleListItemsCount,
	getHiddenItems,
} from './CollapsingListUtils';
import useResizeObserve from '../../hooks/useResizeObserve';

import styles from './CollapsingList.pcss';

type CollapsingListItem = {
	title: string | number;
	color?: string;
	tooltip?: string;
	isQuickFilter?: boolean;
};
type CollapsingListAlignment = 'left' | 'right';
type CollapsingListType = 'summary' | 'legend';

interface CollapsingListProps {
	data: CollapsingListItem[] | LegentDataType;
	alignment?: CollapsingListAlignment;
	type?: CollapsingListType;
	forwardedRef?: React.RefObject<HTMLDivElement>;
	isOrderReversed?: boolean;
}

const CollapsingList: React.FC<CollapsingListProps> = ({
	data,
	alignment = 'left',
	type = 'summary',
	forwardedRef,
	isOrderReversed = false,
}) => {
	const listWrapper = useRef(null);
	const list = useRef(null);

	const [listElementWidths, setListElementWidths] = useState([]);
	const [hiddenItems, setHiddenItems] = useState([]);

	const listWrapperOuterWidth = useResizeObserve(listWrapper);

	useEffect(() => {
		setListElementWidths(
			Array.from(list.current.children).map(
				(item: any) => item.getBoundingClientRect().width,
			),
		);
	}, [data]);

	const checkListItemFit = () => {
		if (list.current && listWrapper.current) {
			const listOuterWidth = list.current.getBoundingClientRect().width;

			const visibleListItemsCount = getVisibleListItemsCount(
				listElementWidths,
				listOuterWidth,
			);

			const initialListItems = isOrderReversed
				? Object.values(data).reverse()
				: Object.values(data);
			const visibleListItems = initialListItems.slice(
				0,
				visibleListItemsCount,
			);
			const hiddenItems =
				visibleListItems.length === initialListItems.length
					? []
					: getHiddenItems(initialListItems, visibleListItemsCount);

			setHiddenItems(hiddenItems);
		}
	};

	useEffect(() => {
		checkListItemFit();
	}, [data, listElementWidths, listWrapperOuterWidth]);

	const renderListItem = ({
		item,
		index,
	}: {
		item: CollapsingListItem;
		index: number;
	}) => {
		const { title, tooltip, isQuickFilter } = item;

		const setTooltipVisibleProps = {
			...(!tooltip && { visible: false }),
		};

		return (
			<div
				className={classNames(styles.listItem, {
					[styles.legend]: type === 'legend',
				})}
				key={String(index)}
			>
				<Tooltip
					placement="top"
					content={<span>{tooltip}</span>}
					portalTo={document.body}
					{...setTooltipVisibleProps}
				>
					<span
						className={classNames(styles.listItemContent, {
							[styles.customBadge]: isQuickFilter,
						})}
					>
						{item.color && (
							<span
								className={styles.legendDot}
								style={{
									background: item.color,
								}}
							/>
						)}
						<span data-test="collapsing-list-summary-item">
							{title}
						</span>
					</span>
				</Tooltip>
			</div>
		);
	};

	const renderHiddenItems = () => {
		return (
			<Popover
				portalTo={document.body}
				onClick={(event) => {
					event.stopPropagation();
				}}
				spacing="s"
				popperProps={{
					modifiers: {
						preventOverflow: {
							boundariesElement: 'viewport',
						},
					},
				}}
				content={hiddenItems?.map((item: any, index: number) => (
					<div key={String(index)}>{item?.tooltip ?? item.title}</div>
				))}
			>
				<Button
					size="s"
					className={styles.popoverTrigger}
					onClick={(event) => {
						event.stopPropagation();
					}}
				>
					<span>+{hiddenItems.length}</span>
					<Icon icon="triangle-down" size="s" color="black" />
				</Button>
			</Popover>
		);
	};

	const visibleItems = isOrderReversed
		? Object.values(data).reverse()
		: Object.values(data);

	return (
		<div ref={forwardedRef}>
			<div
				className={classNames(styles.listWrapper, {
					[styles.alignLeft]: alignment === 'left',
					[styles.alignRight]: alignment === 'right',
				})}
				ref={listWrapper}
			>
				<div className={styles.list} ref={list}>
					{visibleItems?.map(
						(visibleItem: CollapsingListItem, index: number) =>
							renderListItem({ item: visibleItem, index }),
					)}
				</div>
				{!!hiddenItems?.length && renderHiddenItems()}
			</div>
		</div>
	);
};

export default CollapsingList;
