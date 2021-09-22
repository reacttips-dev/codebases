import React from 'react';
import { useDispatch } from 'react-redux';
import { DropTargetMonitor } from 'react-dnd';
import { updateDealStatus } from '../../../../actions/deals';
import { updateDealStatus as forecastUpdateDealStatus } from '../../../../forecast-view/actions/deals';
import { colors } from '../../../../utils/styles';
import DealActionButton from '../DealActionButton';
import { setDealWonLostOrDeletedCoachmark } from '../../../../utils/regularCoachmarks';
import { useTranslator } from '@pipedrive/react-utils';
import validateRequiredFields from '../../../../utils/validateRequiredFields';
import _ from 'lodash';
import { ViewTypes } from '../../../../utils/constants';

type Props = {
	viewType?: ViewTypes;
};

const WonAction: React.FunctionComponent<Props> = (props) => {
	const translator = useTranslator();
	const dispatch = useDispatch();

	return (
		<DealActionButton
			textColor={colors['$color-green-hex']}
			textDraggingColor={colors['$color-white-hex']}
			backgroundDraggingColor={colors['$color-green-hex']}
			onDrop={(monitor: DropTargetMonitor) => {
				const draggingItem = monitor.getItem();

				const markDealAsWon = (updatedProperties = {}) => {
					if (props.viewType === ViewTypes.FORECAST) {
						const fromPeriodIndex = draggingItem.periodIndex;

						dispatch(
							forecastUpdateDealStatus(draggingItem.deal, 'won', updatedProperties, fromPeriodIndex),
						);
					} else {
						dispatch(updateDealStatus(draggingItem.deal, 'won', updatedProperties));
					}

					setDealWonLostOrDeletedCoachmark(translator);
				};

				validateRequiredFields({
					deal: draggingItem.deal,
					dealUpdateProperties: { status: 'won' },
					onSave: markDealAsWon,
					onError: markDealAsWon,
					onCancel: _.noop,
				});
			}}
			data-test="deal-actions-won"
		>
			{translator.gettext('Won')}
		</DealActionButton>
	);
};

export default WonAction;
