import update from 'immutability-helper';
import { useDrag, useDrop } from 'react-dnd';
import { types as insightsTypes } from '@pipedrive/insights-core';
import { Column, UseColumnOrderInstanceProps } from 'react-table';

export interface HoverParams {
	dragIndex: number;
	dropIndex: number;
	dragDirection: string;
}

interface UseTableColumnReorderProps {
	index: number;
	flatColumns: Column[];
	setColumnOrder: UseColumnOrderInstanceProps<any>['setColumnOrder'];
	setHoverParams: React.Dispatch<React.SetStateAction<HoverParams>>;
	canReorderColumns: boolean;
}

const useTableColumnReorder = ({
	index,
	flatColumns,
	setColumnOrder,
	setHoverParams,
	canReorderColumns,
}: UseTableColumnReorderProps) => {
	const type = insightsTypes.ChartType.COLUMN;
	const initialHoverParams: HoverParams = {
		dropIndex: null,
		dragIndex: null,
		dragDirection: null,
	};

	const updateColumnsOrder = (dragIndex: number, hoverIndex: number) => {
		const mappedColumns = flatColumns.map((col) => col.id);
		const dragRecord = mappedColumns[dragIndex];

		const updatedColumnOrder = update(mappedColumns, {
			$splice: [
				[dragIndex, 1],
				[hoverIndex, 0, dragRecord],
			],
		});

		setColumnOrder(updatedColumnOrder);
	};

	const handleHover = (item: HoverParams) => {
		if (item.dropIndex !== index) {
			let dragDirection;

			if (index > item.dragIndex) {
				dragDirection = 'right';
			}

			if (index < item.dragIndex) {
				dragDirection = 'left';
			}

			setHoverParams({
				dropIndex: index,
				dragIndex: item.dragIndex,
				dragDirection,
			});

			item.dropIndex = index;
		}
	};

	const handleDrop = (item: HoverParams) => {
		setHoverParams(initialHoverParams);
		updateColumnsOrder(item.dragIndex, item.dropIndex);
	};

	const [, drag] = useDrag({
		item: { type, dragIndex: index, dropIndex: index },
		canDrag: () => canReorderColumns,
		end: () => {
			setHoverParams(initialHoverParams);
		},
	});

	const [, drop] = useDrop({
		accept: type,
		hover: (item: any) => {
			handleHover(item);
		},
		drop: (item) => {
			handleDrop(item);
		},
	});

	return {
		initColumnReorder: (ref: React.MutableRefObject<any>) =>
			drag(drop(ref)),
	};
};

export default useTableColumnReorder;
