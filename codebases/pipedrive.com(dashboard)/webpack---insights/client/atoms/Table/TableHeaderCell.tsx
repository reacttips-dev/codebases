import React from 'react';
import classNames from 'classnames';
import { TableResizerProps } from 'react-table';
import { Icon } from '@pipedrive/convention-ui-react';

import { getSortedIcon } from '../../utils/tableUtils';

import styles from './Table.pcss';

interface TableHeaderCellProps {
	column: any;
	resizerProps: TableResizerProps;
	isRightAligned: boolean;
}

const TableHeaderCell: React.FC<TableHeaderCellProps> = ({
	column,
	resizerProps,
	isRightAligned,
	...props
}) => {
	return (
		<>
			<div
				{...props}
				className={classNames(styles.th, {
					[styles.isRightAligned]: isRightAligned,
					[styles.isSorted]: column.isSorted,
				})}
			>
				{column.isSorted && (
					<Icon
						icon={getSortedIcon(column)}
						className={styles.sortCaret}
					/>
				)}
				<span>{column.render('Header')}</span>
				<div {...resizerProps} className={styles.resizer} />
			</div>
		</>
	);
};

export default React.memo(TableHeaderCell);
