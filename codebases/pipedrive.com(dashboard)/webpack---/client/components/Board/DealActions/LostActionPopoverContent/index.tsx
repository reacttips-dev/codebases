import React, { useState } from 'react';
import { connect, useDispatch, useSelector } from 'react-redux';
import striptags from 'striptags';
import { Select, Button, Spacing, Textarea, Input } from '@pipedrive/convention-ui-react';
import { closeActionPopovers } from '../../../../actions/actionPopovers';
import { updateDealStatus } from '../../../../actions/deals';
import { getLostReasons, isFreeFormLostReasonsEnabled } from '../../../../shared/api/webapp';
import { saveNoteToDeal } from '../../../../api';
import { Container, Title, SelectGroup, Label, Footer } from './StyledComponents';
import { useTranslator } from '@pipedrive/react-utils';
import { setDealWonLostOrDeletedCoachmark } from '../../../../utils/regularCoachmarks';
import DealTileWrapper from '../../../DealTileWrapper';
import { ViewTypes } from '../../../../utils/constants';
import { getDealPeriodIndex } from '../../../../forecast-view/selectors/deals';

import { updateDealStatus as forecastUpdateDealStatus } from '../../../../forecast-view/actions/deals';

interface StateProps {
	lostReasons: Pipedrive.LostReason[];
	isFreeFormLostReasonsEnabled: boolean;
}

interface DispatchProps {
	closeActionPopovers: typeof closeActionPopovers;
	updateDealStatus: typeof updateDealStatus;
	forecastUpdateDealStatus: typeof forecastUpdateDealStatus;
}

interface OwnProps {
	pipelines?: Pipedrive.Pipelines;
	deal: Pipedrive.Deal;
	// Needed for re-positioning the popover on content changes
	randomProp: number;
	onTriggerReposition: () => void;
	viewType: ViewTypes;
}

export type Props = StateProps & DispatchProps & OwnProps;

export interface State {
	hasOtherSelected: boolean;
	lostReasonLabel: string;
	comment: string;
}

const LostActionPopoverContent: React.FunctionComponent<Props> = (props) => {
	const [hasOtherSelected, setHasOtherSelected] = useState(false);
	const [lostReasonLabel, setLostReasonLabel] = useState('');
	const [comment, setComment] = useState('');

	const {
		deal,
		lostReasons,
		isFreeFormLostReasonsEnabled,
		onTriggerReposition,
		closeActionPopovers,
		updateDealStatus,
	} = props;
	const translator = useTranslator();
	const hasLostReasons = lostReasons.length > 0;

	const dealPeriodIndex: number = useSelector((state: ForecastState) => {
		if (props.viewType === ViewTypes.FORECAST) {
			return getDealPeriodIndex(state);
		}

		return null;
	});

	const dispatch = useDispatch();

	const onLostReasonSelectChange = (lostReasonId: number | 'other') => {
		onTriggerReposition();

		if (lostReasonId === 'other') {
			setHasOtherSelected(true);
			setLostReasonLabel('');
		} else {
			const lostReason = props.lostReasons.find(
				(lostReason: Pipedrive.LostReason) => lostReason.id === lostReasonId,
			);

			setHasOtherSelected(false);
			setLostReasonLabel(lostReason.label);
		}
	};

	return (
		<Container data-test="deal-actions-lost-popover">
			<Spacing all="m">
				<Title>{translator.gettext('Mark as lost')}</Title>
				<DealTileWrapper deal={deal} isClickable={false} />
				<SelectGroup>
					<Label>{translator.gettext('Lost reason')}</Label>
					{hasLostReasons ? (
						<Select
							placeholder="Select a reason"
							onChange={onLostReasonSelectChange}
							data-test="deal-actions-lost-popover-select-lost-reason"
						>
							{lostReasons.map((lostReason: Pipedrive.LostReason) => (
								<Select.Option
									key={lostReason.id}
									value={lostReason.id}
									data-test={`deal-actions-lost-popover-select-lost-reason-${lostReason.id}`}
								>
									{lostReason.label}
								</Select.Option>
							))}
							{isFreeFormLostReasonsEnabled && (
								<Select.Option
									value="other"
									data-test={`deal-actions-lost-popover-select-lost-reason-other`}
								>
									{translator.gettext('Other')}
								</Select.Option>
							)}
						</Select>
					) : (
						<Input
							autoFocus
							data-test="deal-actions-lost-popover-no-reasons-input"
							onChange={(evt) => setLostReasonLabel(evt.target.value)}
						/>
					)}
				</SelectGroup>
				{hasOtherSelected && (
					<SelectGroup>
						<Label>{translator.gettext('Other lost reason...')}</Label>
						<Input
							data-test="deal-actions-lost-popover-other-input"
							onChange={(evt) => setLostReasonLabel(evt.target.value)}
						/>
					</SelectGroup>
				)}
				<SelectGroup>
					<Label>{translator.gettext('Comments')}</Label>
					<Textarea
						resize="none"
						onChange={(evt: React.ChangeEvent<HTMLTextAreaElement>) => setComment(evt.target.value)}
						data-test="deal-actions-lost-popover-comment"
					/>
				</SelectGroup>
				<SelectGroup>
					<Label
						dangerouslySetInnerHTML={{
							__html: striptags(
								translator.gettext('Manage lost reasons in %sCompany Settings%s', [
									'<a href="/settings/lost_reasons">',
									'</a>',
								]),
								['a'],
							),
						}}
					/>
				</SelectGroup>
			</Spacing>

			<Footer>
				<Spacing vertical="s" horizontal="m">
					<Button
						onClick={() => closeActionPopovers(props.viewType)}
						data-test="deal-actions-lost-popover-cancel"
					>
						{translator.gettext('Cancel')}
					</Button>
					<Button
						disabled={lostReasonLabel.length === 0}
						onClick={() => {
							if (props.viewType === ViewTypes.FORECAST) {
								dispatch(forecastUpdateDealStatus(deal, 'lost', {}, dealPeriodIndex));
							} else {
								updateDealStatus(deal, 'lost', {
									lost_reason: lostReasonLabel,
								});
							}

							if (comment) {
								// tslint:disable-next-line
								saveNoteToDeal(deal.id, comment);
							}

							setDealWonLostOrDeletedCoachmark(translator);

							closeActionPopovers(props.viewType);
						}}
						color="red"
						data-test="deal-actions-lost-popover-save"
					>
						{translator.gettext('Mark as lost')}
					</Button>
				</Spacing>
			</Footer>
		</Container>
	);
};

const mapStateToProps = () => {
	return {
		lostReasons: getLostReasons(),
		isFreeFormLostReasonsEnabled: isFreeFormLostReasonsEnabled(),
	};
};

export default connect<StateProps, DispatchProps, OwnProps>(mapStateToProps, {
	closeActionPopovers,
	updateDealStatus,
	forecastUpdateDealStatus,
})(LostActionPopoverContent);
