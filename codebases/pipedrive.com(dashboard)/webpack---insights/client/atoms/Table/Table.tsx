import React, { useEffect, useState } from 'react';
import classNames from 'classnames';
import {
	useTable,
	useSortBy,
	useBlockLayout,
	useResizeColumns,
	useColumnOrder,
	SortingRule,
	Column,
} from 'react-table';

import DataTableLoader from '../../atoms/DataTableLoader';
import { dataTableHighlight } from '../../utils/constants';
import TableHeader from './TableHeader';
import TableBody from './TableBody';

import styles from './Table.pcss';

interface TableProps {
	showDataLoader?: boolean;
	isInsideWidget?: boolean;
	columns: Column<any>[];
	data: any[];
	onFetchMore?: () => Promise<any[]>;
	updateColumns?: (columnOrder: string[]) => void;
	isCellRightAligned: (key: string) => boolean;
	canReorderColumns?: boolean;
	sortBy: SortingRule<any>[];
}

const Table: React.FC<TableProps> = ({
	showDataLoader = false,
	isInsideWidget = false,
	columns,
	data,
	onFetchMore,
	isCellRightAligned,
	updateColumns,
	canReorderColumns = false,
	sortBy,
}) => {
	const defaultColumn = React.useMemo(
		() => ({
			minWidth: 200,
			width: 200,
		}),
		[],
	);

	const {
		getTableProps,
		headerGroups,
		rows,
		prepareRow,
		setColumnOrder,
		allColumns,
		state: { columnOrder },
	} = useTable(
		{
			columns,
			data,
			defaultColumn,
			initialState: {
				sortBy,
			},
		},
		useColumnOrder,
		useBlockLayout,
		useResizeColumns,
		useSortBy,
	);

	const [getHoverParams, setHoverParams] = useState<{
		dragIndex: null | number;
		dropIndex: null | number;
		dragDirection: null | string;
	}>({
		dragIndex: null,
		dropIndex: null,
		dragDirection: null,
	});

	const isCellHighlighted = (row: any, column: any) => {
		const isRowHighlighted =
			row && dataTableHighlight.ROWS.includes(row.rowIdentifier);

		const isColumnHighlighted =
			column && dataTableHighlight.COLUMNS.includes(column.id);

		return isRowHighlighted || isColumnHighlighted;
	};

	useEffect(() => {
		if (canReorderColumns && updateColumns) {
			updateColumns(columnOrder);
		}
	}, [columnOrder]);

	return (
		<div
			className={classNames(styles.tableWrapper, {
				[styles.tableWrapperWithDynamicSize]: !isInsideWidget,
			})}
		>
			<div {...getTableProps()}>
				<TableHeader
					isInsideWidget={isInsideWidget}
					headerGroups={headerGroups}
					canReorderColumns={canReorderColumns}
					setHoverParams={setHoverParams}
					getHoverParams={getHoverParams}
					flatColumns={allColumns}
					setColumnOrder={setColumnOrder}
					isCellRightAligned={isCellRightAligned}
					{...getTableProps()}
				/>
				<TableBody
					rows={rows}
					prepareRow={prepareRow}
					isCellRightAligned={isCellRightAligned}
					getHoverParams={getHoverParams}
					isCellHighlighted={isCellHighlighted}
				/>
				{showDataLoader && <DataTableLoader fetchMore={onFetchMore} />}
			</div>
		</div>
	);
};

export default React.memo(Table);
