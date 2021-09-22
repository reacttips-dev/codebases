import React from 'react';
import {
	HeaderGroup,
	TableResizerProps,
	TableHeaderProps,
	UseColumnOrderInstanceProps,
} from 'react-table';

import TableHeaderCell from './TableHeaderCell';
import TableHeaderCellWithReorder from './TableHeaderCellWithReorder';

import styles from './Table.pcss';

interface CustomTableHeaderProps {
	isInsideWidget?: boolean;
	canReorderColumns?: boolean;
	headerGroups: HeaderGroup[];
	setHoverParams: React.Dispatch<
		React.SetStateAction<{
			dragIndex: null | number;
			dropIndex: null | number;
			dragDirection: null | string;
		}>
	>;
	getHoverParams: {
		dragIndex: null | number;
		dropIndex: null | number;
		dragDirection: null | string;
	};
	flatColumns: any[];
	setColumnOrder: UseColumnOrderInstanceProps<any>['setColumnOrder'];
	isCellRightAligned: (key: string) => boolean;
}

const TableHeader: React.FC<CustomTableHeaderProps> = ({
	isInsideWidget = false,
	canReorderColumns = false,
	headerGroups,
	setHoverParams,
	getHoverParams,
	flatColumns,
	setColumnOrder,
	isCellRightAligned,
}) => {
	return (
		<div className={styles.tableHead}>
			{headerGroups.map((headerGroup) => {
				const { key: headerKey, ...headerProps } =
					headerGroup.getHeaderGroupProps();

				return (
					<div className={styles.tr} key={headerKey} {...headerProps}>
						{headerGroup.headers.map(
							(column: any, index: number) => {
								const resizerProps = {
									...column.getResizerProps(),
									onClick: (e: React.ChangeEvent) =>
										e.stopPropagation(),
								} as TableResizerProps;

								const {
									key: tableHeaderKey,
									...tableHeaderProps
								} = {
									...column.getHeaderProps(
										column.getSortByToggleProps(),
									),
								} as TableHeaderProps;

								if (isInsideWidget) {
									return (
										<TableHeaderCell
											key={tableHeaderKey}
											column={column}
											resizerProps={resizerProps}
											isRightAligned={isCellRightAligned(
												column.id,
											)}
											{...tableHeaderProps}
										/>
									);
								}

								return (
									<TableHeaderCellWithReorder
										key={tableHeaderKey}
										index={index}
										column={column}
										resizerProps={resizerProps}
										canReorderColumns={canReorderColumns}
										setHoverParams={setHoverParams}
										getHoverParams={getHoverParams}
										flatColumns={flatColumns}
										setColumnOrder={setColumnOrder}
										isRightAligned={isCellRightAligned(
											column.id,
										)}
										{...tableHeaderProps}
									/>
								);
							},
						)}
					</div>
				);
			})}
		</div>
	);
};

export default TableHeader;
