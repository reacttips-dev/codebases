import React, { Suspense } from 'react';
import { connect } from 'react-redux';
import { isElement } from 'lodash';
import { NoDealsContainer, Title, Content, Wrap } from './StyledComponents';
import { useTranslator } from '@pipedrive/react-utils';
import { addDeal } from '../../../actions/deals';
import { setSelectedFilter } from '../../../actions/filters';
import { getSelectedFilter } from '../../../selectors/filters';
import { getAllDealsCount } from '../../../selectors/deals';
import { getSelectedPipelineId, getStagesCount } from '../../../selectors/pipelines';
import { CoachmarkTags } from '../../../utils/constants';
import { setSingleDealActivityCoachmark } from '../../../utils/regularCoachmarks';
import striptags from 'striptags';
import { useCoachmark } from '@pipedrive/use-coachmark';
import { getCurrentUserId } from '../../../shared/api/webapp';
import { openAddDealModal } from '../../../utils/modals';
import { getViewerState } from '../../../selectors/view';

const NoDealsLazy = React.lazy(() => import(/* webpackChunkName: "NoDealsCoachmark" */ './NoDealsCoachmark'));

export interface StateProps {
	selectedPipelineId: number;
	hasDeals: () => boolean;
	selectedFilter?: Pipedrive.SelectedFilter;
	stagesCount: number;
	isViewer: boolean;
}

export interface DispatchProps {
	addDeal: typeof addDeal;
	setSelectedFilter: typeof setSelectedFilter;
}

export interface OwnProps {
	children: React.ReactNode;
}

export type NoDealsProps = StateProps & DispatchProps & OwnProps;

const NoDeals: React.FunctionComponent<NoDealsProps> = (props) => {
	const {
		children,
		addDeal,
		hasDeals,
		selectedFilter,
		setSelectedFilter,
		selectedPipelineId,
		stagesCount,
		isViewer,
	} = props;

	const translator = useTranslator();
	const pipelineNoDealsCoachmark = useCoachmark(CoachmarkTags.PIPELINE_NO_DEALS);

	const pipelineNoDealsCoachmarkVisible = pipelineNoDealsCoachmark.visible;
	const currentUserId = getCurrentUserId();

	const visibleForCurrentUser =
		selectedFilter.type === 'user' &&
		(selectedFilter.value === currentUserId || selectedFilter.value === 'everyone');

	const onContentClick = (event: any) => {
		if (isElement(event.target) && event.target.getAttribute('data-actiontype')) {
			const actionType = event.target.getAttribute('data-actiontype');

			if (actionType === 'create-deal') {
				openAddDealModal({
					prefill: {
						pipeline_id: selectedPipelineId,
					},
					onsave: (newDeal) => {
						addDeal(newDeal as Pipedrive.API.IAddDealResponse);

						pipelineNoDealsCoachmark.close();

						const isDealInLastStage = stagesCount === (newDeal.data || newDeal.attributes).stage_order_nr;

						!hasDeals() &&
							setSingleDealActivityCoachmark(translator, isDealInLastStage ? 'bottomLeft' : 'bottom');
					},
				});
			}

			if (actionType === 'show-own-deals') {
				setSelectedFilter({
					type: 'user',
					value: Number(currentUserId),
				});
			}
		}
	};

	const renderMessage = () => {
		if (pipelineNoDealsCoachmarkVisible) {
			return (
				<Suspense fallback={<div />}>
					<NoDealsLazy />
				</Suspense>
			);
		}

		if (visibleForCurrentUser) {
			return (
				<Wrap>
					<Title>{translator.gettext('No deals added yet')}</Title>
					<Content
						onClick={onContentClick}
						dangerouslySetInnerHTML={{
							__html: striptags(
								translator.gettext('%sCreate new deal%s or %simport data%s', [
									'<a href="#" data-test="empty-create-new-deal" data-actiontype="create-deal">',
									'</a>',
									'<a href="/import">',
									'</a>',
								]),
								['a'],
							),
						}}
					/>
				</Wrap>
			);
		}

		return (
			<Wrap>
				<Title>{translator.gettext('No deals found to match your criteria')}</Title>
				{!isViewer && (
					<Content
						onClick={onContentClick}
						dangerouslySetInnerHTML={{
							__html: striptags(
								translator.gettext('Try resetting your filters or %ssee all your open deals%s', [
									'<a href="/" data-actiontype="show-own-deals">',
									'</a>',
								]),
								['a'],
							),
						}}
					/>
				)}
			</Wrap>
		);
	};

	return (
		<NoDealsContainer data-test="no-deals-container">
			{children}
			<div data-test="no-deals-content">{renderMessage()}</div>
		</NoDealsContainer>
	);
};

const mapStateToProps = (state: PipelineState) => {
	const selectedPipelineId = getSelectedPipelineId(state);

	return {
		selectedPipelineId,
		hasDeals: () => getAllDealsCount(state) > 0,
		selectedFilter: getSelectedFilter(state),
		stagesCount: getStagesCount(state, selectedPipelineId),
		isViewer: getViewerState(state),
	};
};

const mapDispatchToProps = {
	addDeal,
	setSelectedFilter,
};

export default connect<StateProps, DispatchProps, OwnProps>(mapStateToProps, mapDispatchToProps)(NoDeals);
