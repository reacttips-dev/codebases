import React from 'react';
import { Column, Row } from 'react-table';

import TableStandardCell from './TableStandardCell';
import { dataTableHighlight } from '../../utils/constants';

import styles from './Table.pcss';

interface TableBodyProps {
	rows: Row<any>[];
	prepareRow: (row: Row<any>) => void;
	isCellRightAligned: (key: string) => boolean;
	getHoverParams: {
		dragIndex: null | number;
		dropIndex: null | number;
		dragDirection: null | string;
	};
	isCellHighlighted: (originalRow: Row<any>, column: Column<any>) => boolean;
}

const TableBody: React.FC<TableBodyProps> = ({
	rows,
	prepareRow,
	isCellRightAligned,
	getHoverParams,
	isCellHighlighted,
}) => {
	const rebuiltRows = [
		...rows.filter(
			(row) =>
				!dataTableHighlight.ROWS.includes(row.original.rowIdentifier),
		),
		...rows
			.filter((row) =>
				dataTableHighlight.ROWS.includes(row.original.rowIdentifier),
			)
			.sort((firstRow, secondRow) =>
				firstRow.index < secondRow.index ? -1 : 1,
			),
	];

	return (
		<div className={styles.tableBody}>
			{rebuiltRows.map((row) => {
				prepareRow(row);

				return (
					<div
						className={styles.tr}
						key={row.getRowProps().key}
						data-test="table-row"
					>
						{row.cells.map((cell, index) => {
							const { key: cellKey, ...tableCellProps } =
								cell.getCellProps();

							return (
								<TableStandardCell
									key={cellKey}
									isRightAligned={isCellRightAligned(
										cell.column.id,
									)}
									index={index}
									cell={cell}
									getHoverParams={getHoverParams}
									isHighlighted={isCellHighlighted(
										row.original,
										cell.column,
									)}
									{...tableCellProps}
								/>
							);
						})}
					</div>
				);
			})}
		</div>
	);
};

export default React.memo(TableBody);
