import React from 'react';
import { DropTarget, DropTargetMonitor } from 'react-dnd';
import { dragTypes } from '../../../utils/constants';
import { Container } from './StyledComponents';

export interface DroppableProps {
	className?: string;
	onDrop: (monitor: DropTargetMonitor) => void;
	// The next two props are coming from react-dnd
	isDraggingOver?: boolean;
	hasOpacityOnDrop?: boolean;
	connectDropTarget?: (node: HTMLElement) => void;
	children: (isDraggingOver: boolean) => any;
}

const Droppable: React.FunctionComponent<DroppableProps> = (props) => {
	const { isDraggingOver, hasOpacityOnDrop, className, connectDropTarget, children } = props;

	return (
		<Container
			isDraggingOver={isDraggingOver}
			hasOpacityOnDrop={hasOpacityOnDrop}
			className={className}
			ref={(el) => connectDropTarget(el)}
		>
			{children(isDraggingOver)}
		</Container>
	);
};

// eslint-disable-next-line new-cap
export default DropTarget(
	dragTypes.CARD,
	{
		drop(props: DroppableProps, monitor: DropTargetMonitor) {
			props.onDrop(monitor);
		},
	},
	(connect, monitor: DropTargetMonitor) => ({
		connectDropTarget: connect.dropTarget(),
		isDraggingOver: monitor.isOver(),
	}),
)(Droppable);
