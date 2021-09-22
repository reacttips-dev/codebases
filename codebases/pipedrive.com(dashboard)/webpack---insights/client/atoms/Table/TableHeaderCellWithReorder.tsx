import React, { useRef } from 'react';
import classNames from 'classnames';
import {
	Column,
	ColumnInstance,
	TableResizerProps,
	UseColumnOrderInstanceProps,
} from 'react-table';
import { Icon } from '@pipedrive/convention-ui-react';

import useTableColumnReorder, {
	HoverParams,
} from '../../hooks/useTableColumnReorder';
import { getSortedIcon } from '../../utils/tableUtils';

import styles from './Table.pcss';

interface TableHeaderCellWithReorderProps {
	column: ColumnInstance;
	index: number;
	resizerProps: TableResizerProps;
	canReorderColumns: boolean;
	flatColumns: Column[];
	setColumnOrder: UseColumnOrderInstanceProps<any>['setColumnOrder'];
	setHoverParams: React.Dispatch<React.SetStateAction<HoverParams>>;
	getHoverParams: any;
	isRightAligned: boolean;
}

const TableHeaderCellWithReorder: React.FC<TableHeaderCellWithReorderProps> = ({
	column,
	index,
	resizerProps,
	canReorderColumns,
	flatColumns,
	setColumnOrder,
	setHoverParams,
	getHoverParams,
	isRightAligned,
	...props
}) => {
	const ref = useRef(null);
	const { initColumnReorder } = useTableColumnReorder({
		index,
		flatColumns,
		setColumnOrder,
		setHoverParams,
		canReorderColumns,
	});

	initColumnReorder(ref);

	const isCurrentItemBeingDragged =
		getHoverParams.dropIndex === index &&
		getHoverParams.dragIndex !== index;

	return (
		<div
			{...props}
			className={classNames(styles.th, {
				[styles[getHoverParams.dragDirection]]:
					isCurrentItemBeingDragged,
				[styles.tdActive]: getHoverParams.dragIndex === index,
				[styles.isRightAligned]: isRightAligned,
				[styles.isSorted]: column.isSorted,
			})}
			ref={ref}
			data-test="table-header-cell"
		>
			{column.isSorted && (
				<Icon
					icon={getSortedIcon(column)}
					className={styles.sortCaret}
				/>
			)}
			<span title={column.render('Header').toString()}>
				{column.render('Header')}
			</span>
			<div
				{...resizerProps}
				draggable
				onDragStart={(e) => {
					e.preventDefault();
					e.stopPropagation();
				}}
				className={styles.resizer}
			/>
		</div>
	);
};

export default TableHeaderCellWithReorder;
