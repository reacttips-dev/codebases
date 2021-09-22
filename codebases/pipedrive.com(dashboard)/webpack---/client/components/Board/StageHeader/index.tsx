import React, { Suspense } from 'react';
import { connect } from 'react-redux';
import StageSummary from '../StageSummary';
import Hoverable from '../../Shared/Hoverable';
import { getGoalsLoadingStatus, stageHasGoals } from '../../Goals/selectors';
import Arrow from '../../Shared/svg/Arrow.svg';
import { Container, Details, StageOverview } from './StyledComponents';
import StageName from '../StageName';

const GoalsChartLazy = React.lazy(() => import(/* webpackChunkName: "GoalsChart" */ '../../Goals/GoalsChart'));

interface StateProps {
	isGoalsLoading: boolean;
	hasGoals: boolean;
}

export interface OwnProps {
	stage: Pipedrive.Stage;
	summary?: Pipedrive.DealsByStagesSummaryPerStagesConverted;
}

export type StageHeaderProps = OwnProps & StateProps;

const StageHeader: React.FunctionComponent<StageHeaderProps> = (props) => {
	const { stage, summary, isGoalsLoading, hasGoals } = props;

	return (
		<Hoverable>
			{({ isHovering, handleMouseHover }) => (
				<Container onMouseEnter={handleMouseHover} onMouseLeave={handleMouseHover}>
					<Details data-test={`stage-header-${stage.id}`}>
						<StageOverview>
							<StageName name={stage.name} />

							<StageSummary summary={summary} isHovering={isHovering} />
						</StageOverview>
						{hasGoals && !isGoalsLoading ? (
							<Suspense fallback={<div />}>
								<GoalsChartLazy stage={stage} />
							</Suspense>
						) : (
							<React.Fragment />
						)}
						<Arrow />
					</Details>
				</Container>
			)}
		</Hoverable>
	);
};

const mapStateToProps = (state, props) => {
	return {
		isGoalsLoading: getGoalsLoadingStatus(state),
		hasGoals: stageHasGoals(state, props.stage.id),
	};
};

export default connect<StateProps, null, OwnProps>(mapStateToProps)(StageHeader);
