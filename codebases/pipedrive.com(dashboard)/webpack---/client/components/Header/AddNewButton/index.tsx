import { Button, Icon } from '@pipedrive/convention-ui-react';
import React from 'react';
import { connect } from 'react-redux';
import { addDeal } from '../../../actions/deals';
import { addDeal as forecastAddDeal } from '../../../forecast-view/actions/deals';
import { CoachmarkTags, FlowCoachmarkTypes, ViewTypes } from '../../../utils/constants';
import { getAllDealsCount } from '../../../selectors/deals';
import { getSelectedPipelineId, getStagesCount } from '../../../selectors/pipelines';
import { setSingleDealActivityCoachmark } from '../../../utils/regularCoachmarks';
import { useTranslator } from '@pipedrive/react-utils';
import { Container } from './StyledComponents';
import { useCoachmark } from '@pipedrive/use-coachmark';
import { openAddDealModal } from '../../../utils/modals';
import {
	addFlowCoachmark,
	closeFlowCoachmark,
	setRecentlyAddedDeal,
	useAddFlowCoachmark,
} from '../../../utils/flowCoachmarks';

interface DispatchProps {
	addDeal: typeof addDeal;
	forecastAddDeal: typeof forecastAddDeal;
}

interface StateProps {
	selectedPipelineId: number;
	hasDeals: () => boolean;
	stagesCount: number;
}

interface OwnProps {
	className?: string;
	viewType?: ViewTypes;
}

export type AddNewButtonProps = DispatchProps & StateProps & OwnProps;

const AddNewButton: React.FunctionComponent<AddNewButtonProps> = (props) => {
	const { className, addDeal, hasDeals, selectedPipelineId, stagesCount, forecastAddDeal } = props;
	const translator = useTranslator();
	const pipelineNoDealsCoachmark = useCoachmark(CoachmarkTags.PIPELINE_NO_DEALS);

	useAddFlowCoachmark(FlowCoachmarkTypes.ADD_DEAL);

	return (
		<Container>
			<Button
				data-test="pipeline-add-deal"
				data-coachmark="pipeline-add-deal"
				className={className}
				color="green"
				aria-label={translator.gettext('Add deal')}
				onClick={() => {
					closeFlowCoachmark(FlowCoachmarkTypes.ADD_DEAL);
					openAddDealModal({
						prefill: {
							pipeline_id: selectedPipelineId,
						},
						onsave: (newDeal) => {
							setRecentlyAddedDeal(newDeal);

							if (props.viewType === ViewTypes.FORECAST) {
								forecastAddDeal(newDeal as Pipedrive.API.IAddDealResponse);
							} else {
								addDeal(newDeal as Pipedrive.API.IAddDealResponse);

								pipelineNoDealsCoachmark.close();
								closeFlowCoachmark(FlowCoachmarkTypes.SAVE_DEAL_MODAL);

								const isDealInLastStage =
									stagesCount === (newDeal.attributes || newDeal.data).stage_order_nr;

								!hasDeals() &&
									setSingleDealActivityCoachmark(
										translator,
										isDealInLastStage ? 'bottomLeft' : 'bottom',
									);
							}
						},
						onMounted: () => {
							addFlowCoachmark(FlowCoachmarkTypes.SAVE_DEAL_MODAL, {
								parentToObserve: '[data-test="add-modal"]',
							});
						},
					});
				}}
			>
				<Icon icon="plus" color="white" size="s" />
				{translator.gettext('Deal')}
			</Button>
		</Container>
	);
};

const mapStateToProps = (state: PipelineState) => {
	const selectedPipelineId = getSelectedPipelineId(state);

	return {
		selectedPipelineId,
		hasDeals: () => getAllDealsCount(state) > 0,
		stagesCount: getStagesCount(state, selectedPipelineId),
	};
};

const mapDispatchToProps = {
	addDeal,
	forecastAddDeal,
};

export default connect<StateProps, DispatchProps, OwnProps>(mapStateToProps, mapDispatchToProps)(AddNewButton);
