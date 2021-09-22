import { connect } from 'react-redux';
import React from 'react';
import { DropTargetMonitor } from 'react-dnd';
import { useTranslator } from '@pipedrive/react-utils';
import { deleteDeal } from '../../../../actions/deals';
import { deleteDeal as forecastDeleteDeal } from '../../../../forecast-view/actions/deals';
import DealActionButton from '../DealActionButton';
import { colors } from '../../../../utils/styles';
import { setDealWonLostOrDeletedCoachmark } from '../../../../utils/regularCoachmarks';
import { ViewTypes } from '../../../../utils/constants';

export interface DispatchProps {
	deleteDeal: typeof deleteDeal;
	forecastDeleteDeal: typeof forecastDeleteDeal;
}

export interface OwnProps {
	className?: string;
	viewType: ViewTypes;
}

export type Props = DispatchProps & OwnProps;

const DeleteActionButton: React.FunctionComponent<Props> = (props) => {
	const translator = useTranslator();

	return (
		<DealActionButton
			textColor={colors['$color-black-hex-64']}
			textDraggingColor={colors['$color-black-hex-64']}
			backgroundDraggingColor={colors['$color-black-hex-16']}
			onDrop={(monitor: DropTargetMonitor) => {
				const draggingItem = monitor.getItem();

				if (props.viewType === ViewTypes.FORECAST) {
					props.forecastDeleteDeal(draggingItem.deal);
				} else {
					props.deleteDeal(draggingItem.deal);
				}

				setDealWonLostOrDeletedCoachmark(translator);
			}}
			data-test="deal-actions-delete"
		>
			{translator.gettext('Delete')}
		</DealActionButton>
	);
};

export default connect<null, DispatchProps, OwnProps>(null, { deleteDeal, forecastDeleteDeal })(DeleteActionButton);
