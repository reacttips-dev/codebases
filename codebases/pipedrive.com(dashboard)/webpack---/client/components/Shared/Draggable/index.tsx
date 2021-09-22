import React from 'react';
import { connect } from 'react-redux';
import { DragSource, DragSourceMonitor, ConnectDragSource } from 'react-dnd';
import { setDragging } from '../../../actions/dragging';
import { closeActionPopovers } from '../../../actions/actionPopovers';
import { dragTypes, ViewTypes } from '../../../utils/constants';
import { dispatchResizeEvent } from '../../../utils/dispatchResizeEvent';

type Props = {
	deal: Pipedrive.Deal;
	stageId?: number;
	isDraggable: boolean;
	setDragging: typeof setDragging;
	closeActionPopovers: typeof closeActionPopovers;
	connectDragSource?: ConnectDragSource;
	isDragging?: boolean;
	periodIndex?: number;
	viewType?: ViewTypes;
	children: ({ isDragging }) => React.ReactNode;
};

const Draggable: React.FunctionComponent<Props> = (props) => {
	return (
		<div ref={(el) => props.isDraggable && props.connectDragSource(el)}>
			{props.children({ isDragging: props.isDragging })}
		</div>
	);
};

export default connect(null, { setDragging, closeActionPopovers })(
	// eslint-disable-next-line new-cap
	DragSource(
		dragTypes.CARD,
		{
			beginDrag(props: Props) {
				props.setDragging(true);

				props.closeActionPopovers(props.viewType);

				// Easy way to close all Popovers.
				dispatchResizeEvent();

				return {
					deal: props.deal,
					dealId: props.deal.id,
					stageId: props.stageId,
					isDragging: props.isDragging,
					periodIndex: props.periodIndex,
				};
			},

			endDrag(props: Props) {
				props.setDragging(false);
			},

			isDragging(props: Props, monitor: DragSourceMonitor) {
				return props.deal.id === monitor.getItem().dealId;
			},
		},
		(connect, monitor: DragSourceMonitor) => ({
			connectDragSource: connect.dragSource(),
			isDragging: monitor.isDragging(),
		}),
	)(Draggable),
);
