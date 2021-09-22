import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { DropTargetMonitor } from 'react-dnd';
import { colors } from '../../../../utils/styles';
import { getActionDeal, isLostPopoverVisible } from '../../../../selectors/actionPopovers';
import { ACTION_POPOVERS, openActionPopover, closeActionPopovers } from '../../../../actions/actionPopovers';
import LostActionPopoverContent from '../LostActionPopoverContent';
import DealActionButton from '../DealActionButton';
import { useTranslator } from '@pipedrive/react-utils';
import { hideDeal, unhideDeal } from '../../../../actions/deals';
import validateRequiredFields from '../../../../utils/validateRequiredFields';
import { ViewTypes } from '../../../../utils/constants';
import {
	hideDeal as hideForecastDeal,
	unhideDeal as unhideForecastDeal,
} from '../../../../forecast-view/actions/deals';

type Props = {
	viewType?: ViewTypes;
};

const LostAction: React.FunctionComponent<Props> = (props) => {
	// This number is kept here to pass onto to Popover content component. We need it in order to be able to
	// recalculate the position of the Popover after some actions (e.g. choosing "Other" from the lost reasons
	// dropdown menu, which increases the size)
	// This is a bad hack but unfortunately it seems the only way to make it work.
	const [randomNumber, setRandomNumer] = useState<number>(1);
	const { deal, isPopoverVisible } = useSelector((state: PipelineState) => ({
		deal: getActionDeal(state),
		isPopoverVisible: isLostPopoverVisible(state),
	}));
	const dispatch = useDispatch();
	const translator = useTranslator();

	const callOpenActionPopover = (deal, updatedProperties) => {
		dispatch(
			openActionPopover(ACTION_POPOVERS.LOST, {
				...deal,
				...updatedProperties,
			}),
		);
	};

	return (
		<DealActionButton
			textColor={colors['$color-red-hex']}
			textDraggingColor={colors['$color-white-hex']}
			backgroundDraggingColor={colors['$color-red-hex']}
			onDrop={(monitor: DropTargetMonitor) => {
				const draggingItem = monitor.getItem();

				const openPopover = (updatedProperties) => {
					if (ViewTypes.FORECAST === props.viewType) {
						dispatch(hideForecastDeal(draggingItem.deal, draggingItem.periodIndex));
					} else {
						dispatch(hideDeal(draggingItem.deal));
					}

					// This setTimeout hack is needed because we want the position calculation to be based on the element
					// after it has disappeared.
					setTimeout(() => callOpenActionPopover(draggingItem.deal, updatedProperties), 100);
				};

				validateRequiredFields({
					deal: draggingItem.deal,
					dealUpdateProperties: { status: 'lost' },
					onSave: openPopover,
					onError: openPopover,
					updateDealOnSave: true,
					onCancel: () => {
						if (ViewTypes.FORECAST === props.viewType) {
							dispatch(unhideForecastDeal(draggingItem.deal, draggingItem.periodIndex));
						} else {
							dispatch(unhideDeal(draggingItem.deal));
						}
					},
				});
			}}
			popoverProps={{
				visible: isPopoverVisible,
				arrow: false,
				placement: 'top-start',
				content: isPopoverVisible ? (
					<LostActionPopoverContent
						randomProp={randomNumber}
						onTriggerReposition={() => setRandomNumer(randomNumber + 1)}
						deal={deal}
						viewType={props.viewType}
					/>
				) : (
					<div />
				),
				onPopupVisibleChange: (visible: boolean) =>
					!visible && isPopoverVisible && dispatch(closeActionPopovers(props.viewType)),
				portalTo: () => {
					if (ViewTypes.FORECAST === props.viewType) {
						return document.getElementById('forecast-view-deal-actions-popover');
					} else {
						return document.getElementById('pipeline-view-deal-actions-popover');
					}
				},
			}}
			data-test="deal-actions-lost"
		>
			<span>{translator.gettext('Lost')}</span>
		</DealActionButton>
	);
};

export default LostAction;
