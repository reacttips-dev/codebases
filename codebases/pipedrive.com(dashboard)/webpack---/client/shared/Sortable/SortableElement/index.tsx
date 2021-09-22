import _ from 'lodash';
import React from 'react';
import { DragSource, DropTarget } from 'react-dnd';
import { Container } from './StyledComponents';
import { Icon, Button } from '@pipedrive/convention-ui-react';

const DRAG_TYPE = 'SORTABLE_ELEMENT';

type SortableElementProps = {
	id: number;
	index: number;
	highlighted?: boolean;
	marginBetweenElements: number;
	Component: React.ComponentType;
	isDragging: boolean;

	onMove: (dragIndex: number, hoverIndex: number) => void;
	onDrop: () => void;

	// react-dnd
	connectDragSource: (node: HTMLElement) => void;
	connectDropTarget: (node: HTMLElement) => void;
};

class SortableElement extends React.Component<SortableElementProps> {
	node: HTMLDivElement;

	render() {
		const { Component, id, highlighted, isDragging, marginBetweenElements, connectDragSource, connectDropTarget } =
			this.props;

		return (
			<Container
				data-test={`reorder-${id}`}
				highlighted={highlighted}
				marginTop={marginBetweenElements}
				ref={(element) => {
					connectDragSource(element);
					connectDropTarget(element);

					// So we can access it in react-dnd hover
					this.node = element;
				}}
				isDragging={isDragging}
			>
				<Component />
				<Button color="ghost" size="s">
					<Icon icon="drag-handle" />
				</Button>
			</Container>
		);
	}
}

// eslint-disable-next-line new-cap
export default DropTarget(
	DRAG_TYPE,
	{
		hover(props: SortableElementProps, monitor, component) {
			if (!component) {
				return;
			}

			// This condition is needed for UI tests
			const node = component.getDecoratedComponentInstance
				? component.getDecoratedComponentInstance().node
				: component.node;

			if (!node) {
				return;
			}

			const dragIndex = monitor.getItem().index;
			const hoverIndex = props.index;

			if (dragIndex === hoverIndex) {
				return;
			}

			const hoverBoundingRect = node.getBoundingClientRect();
			const clientOffset = monitor.getClientOffset();
			const hoverClientY = clientOffset.y;

			// Dragging downwards
			if (dragIndex < hoverIndex && hoverClientY < hoverBoundingRect.top) {
				return;
			}

			// Dragging upwards
			if (dragIndex > hoverIndex && hoverClientY > hoverBoundingRect.bottom) {
				return;
			}

			if (_.isFunction(props.onMove)) {
				// Time to actually perform the action
				props.onMove(dragIndex, hoverIndex);
			}

			// Note: we're mutating the monitor item here!
			// Generally it's better to avoid mutations,
			// but it's good here for the sake of performance
			// to avoid expensive index searches.
			monitor.getItem().index = hoverIndex;
		},
		drop(props) {
			if (_.isFunction(props.onDrop)) {
				props.onDrop();
			}
		},
	},
	(connect) => ({
		connectDropTarget: connect.dropTarget(),
	}),
)(
	// eslint-disable-next-line new-cap
	DragSource(
		DRAG_TYPE,
		{
			beginDrag: (props: SortableElementProps) => {
				return {
					id: props.id,
					index: props.index,
				};
			},
		},
		(connect, monitor) => ({
			connectDragSource: connect.dragSource(),
			isDragging: monitor.isDragging(),
		}),
	)(SortableElement),
);
