import React from 'react';
import classNames from 'classnames';
import { Cell } from 'react-table';

import styles from './Table.pcss';

interface TableStandardCellProps {
	cell: Cell;
	index: number;
	getHoverParams: {
		dragIndex: null | number;
		dropIndex: null | number;
		dragDirection: null | string;
	};
	isRightAligned: boolean;
	isHighlighted: boolean;
}

const TableStandardCell: React.FC<TableStandardCellProps> = ({
	cell,
	index,
	getHoverParams,
	isRightAligned,
	isHighlighted,
	...props
}) => {
	const isCurrentItemBeingDragged =
		getHoverParams.dropIndex === index &&
		getHoverParams.dragIndex !== index;

	const isCurrentItemActive = getHoverParams.dragIndex === index;

	return (
		<div
			{...props}
			className={classNames(styles.td, {
				[styles[getHoverParams.dragDirection]]:
					isCurrentItemBeingDragged,

				[styles.tdActive]: isCurrentItemActive,
				[styles.isRightAligned]: isRightAligned,
				[styles.isHightlighted]: isHighlighted,
			})}
			data-test="table-standard-cell"
		>
			{cell.render('Cell')}
		</div>
	);
};

export default TableStandardCell;
