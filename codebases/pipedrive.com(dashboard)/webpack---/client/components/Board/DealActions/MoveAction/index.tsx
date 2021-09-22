import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { DropTargetMonitor } from 'react-dnd';
import { colors } from '../../../../utils/styles';
import { isMovePopoverVisible, getActionDeal } from '../../../../selectors/actionPopovers';
import { openActionPopover, ACTION_POPOVERS, closeActionPopovers } from '../../../../actions/actionPopovers';
import MoveActionPopoverContent from '../MoveActionPopoverContent';
import DealActionButton from '../DealActionButton';
import { useTranslator } from '@pipedrive/react-utils';
import { hideDeal } from '../../../../actions/deals';

const MoveAction: React.FunctionComponent = () => {
	const { deal, isPopoverVisible } = useSelector((state: PipelineState) => ({
		deal: getActionDeal(state),
		isPopoverVisible: isMovePopoverVisible(state),
	}));
	const dispatch = useDispatch();
	const translator = useTranslator();

	return (
		<DealActionButton
			textColor={colors['$color-black-hex-64']}
			textDraggingColor={colors['$color-black-hex-64']}
			backgroundDraggingColor={colors['$color-black-hex-16']}
			onDrop={(monitor: DropTargetMonitor) => {
				const draggingItem = monitor.getItem();

				dispatch(hideDeal(draggingItem.deal));

				// This setTimeout hack is needed because we want the position calculation to be based on the element
				// after it has disappeared.
				setTimeout(() => dispatch(openActionPopover(ACTION_POPOVERS.MOVE, draggingItem.deal)), 100);
			}}
			popoverProps={{
				visible: isPopoverVisible,
				arrow: false,
				placement: 'top-start',
				content: isPopoverVisible ? <MoveActionPopoverContent deal={deal} /> : <div />,
				onPopupVisibleChange: (visible: boolean) =>
					!visible && isPopoverVisible && dispatch(closeActionPopovers()),
				portalTo: () => document.getElementById('pipeline-view-deal-actions-popover'),
			}}
			data-test="deal-actions-move"
		>
			{translator.gettext('Move/Convert')}
		</DealActionButton>
	);
};

export default MoveAction;
