import React, { useRef, Suspense } from 'react';
import { connect } from 'react-redux';
import { fetchDeals } from '../../../actions/deals';
import { fetchViewerDeals } from '../../../actions/deals.viewer';
import { getDealsByStages, hasMoreDeals, isLoading, isError } from '../../../selectors/deals';
import { isDragging as isDraggingSlecetor } from '../../../selectors/dragging';
import { getSelectedPipelineId, getStages } from '../../../selectors/pipelines';
import { getSummaryByStagesConverted } from '../../../selectors/summary';
import { isActive, getViewerState } from '../../../selectors/view';
import Animatable from '../../Shared/Animatable';
import DealActions from '../DealActions';
import Error from '../EmptyState/Error';
import Stages from '../Stages';
import useLazyLoader from '../useLazyLoader';
import { Scrollable, Container, EmptyContainer, NoDealsContainer, Loader } from './StyledComponents';
import { Spinner } from '@pipedrive/convention-ui-react';
import NoDeals from '../EmptyState/NoDeals';
import NoDealsViewer from '../EmptyState/NoDeals.viewer';
import { ViewTypes } from '../../../utils/constants';

const NoStagesLazy = React.lazy(() => import(/* webpackChunkName: "NoStages" */ '../EmptyState/NoStages'));

export interface StateProps {
	isActive: boolean;
	isDragging: boolean;
	isLoading: boolean;
	isError: boolean;
	hasMoreDeals: boolean;
	stages: { [id: number]: Pipedrive.Stage };
	dealsByStages: PipelineState['deals']['byStages'];
	summaryByStages: {
		[id: number]: Pipedrive.DealsByStagesSummaryPerStagesConverted;
	};
	selectedPipelineId: number;
	isViewer: boolean;
}

export interface DispatchProps {
	fetchDeals: typeof fetchDeals;
	fetchViewerDeals: typeof fetchViewerDeals;
}
export type BoardProps = StateProps & DispatchProps;

export interface DealListElements {
	[stageId: number]: HTMLDivElement;
}

const Board: React.FunctionComponent<BoardProps> = (props) => {
	const { stages, dealsByStages, summaryByStages, isDragging, isError, isLoading, hasMoreDeals, isViewer } = props;
	const hasDeals = Object.keys(dealsByStages).length > 0;
	const hasStages = Object.keys(stages).length > 0;
	const scrollableContainer = useRef<HTMLDivElement>(null);
	const dealListElements = useRef<DealListElements>({});

	useLazyLoader(props, scrollableContainer, dealListElements);

	if (isError) {
		return (
			<EmptyContainer>
				<Error>
					<Stages
						stages={stages}
						dealsByStages={{}}
						summaryByStages={summaryByStages}
						dealListElements={dealListElements}
					/>
				</Error>
			</EmptyContainer>
		);
	}

	if (!hasStages) {
		return (
			<EmptyContainer>
				<Suspense fallback={<div />}>
					<NoStagesLazy />
				</Suspense>
			</EmptyContainer>
		);
	}

	if (!hasDeals && !isLoading) {
		if (isViewer) {
			return (
				<NoDealsContainer>
					<NoDealsViewer>
						<Stages
							stages={stages}
							dealsByStages={dealsByStages}
							summaryByStages={summaryByStages}
							dealListElements={dealListElements}
						/>
					</NoDealsViewer>
				</NoDealsContainer>
			);
		}
		return (
			<NoDealsContainer>
				<NoDeals>
					<Stages
						stages={stages}
						dealsByStages={dealsByStages}
						summaryByStages={summaryByStages}
						dealListElements={dealListElements}
					/>
				</NoDeals>
			</NoDealsContainer>
		);
	}

	return (
		<Scrollable data-test="scrollable" id="pipeline-view-board-container" ref={scrollableContainer}>
			<Container>
				<Stages
					stages={stages}
					dealsByStages={dealsByStages}
					summaryByStages={summaryByStages}
					dealListElements={dealListElements}
				/>
				{!isViewer && (
					<Animatable visible={isDragging}>
						<DealActions viewType={ViewTypes.PIPELINE} />
					</Animatable>
				)}
				{isLoading && hasMoreDeals && (
					<Loader radius="xl" spacing="s" elevation="03" noBorder>
						<Spinner size="s" light />
					</Loader>
				)}
			</Container>
		</Scrollable>
	);
};

const mapStateToProps = (state: PipelineState) => {
	const selectedPipelineId = getSelectedPipelineId(state);
	const isViewer = getViewerState(state);
	const isDragging = isViewer ? null : isDraggingSlecetor(state);

	return {
		isActive: isActive(state),
		isLoading: isLoading(state),
		isError: isError(state),
		hasMoreDeals: hasMoreDeals(state),
		stages: getStages(state, selectedPipelineId),
		dealsByStages: getDealsByStages(state),
		summaryByStages: getSummaryByStagesConverted(state),
		isViewer,
		isDragging,
		selectedPipelineId,
	};
};

const mapDispatchToProps = {
	fetchDeals,
	fetchViewerDeals,
};

export default connect<StateProps, DispatchProps>(mapStateToProps, mapDispatchToProps)(Board);
