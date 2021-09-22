import React, { MutableRefObject } from 'react';
import DealsList from '../DealsList/dealsList.viewer';
import StageHeader from '../StageHeader/stageHeader.viewer';
import { Container } from './StyledComponents';
import { DealListElements } from '../Board';
import { connect } from 'react-redux';
import { isLoading, getLoadedDealsCount } from '../../../selectors/deals';
import { getViewerState } from '../../../selectors/view';

interface OwnProps {
	index: number;
	stage: Pipedrive.Stage;
	deals: Pipedrive.Deal[];
	summary?: Pipedrive.DealsByStagesSummaryPerStagesConverted;
	dealListElements: MutableRefObject<DealListElements>;
}
interface StateProps {
	isLoading: boolean;
	isViewer: boolean;
	loadedDealsCount: number;
}

const StageViewer: React.FunctionComponent<
	OwnProps &
		StateProps & {
			lastWasTruncated?: boolean;
		}
> = ({ index, stage, summary, dealListElements, deals = [], isLoading, loadedDealsCount, isViewer }) => {
	const isFirstLoad = !loadedDealsCount && isLoading;
	return (
		<Container data-test={`stage-${stage.id}`} data-test-stage-index={index}>
			{!isFirstLoad && <StageHeader stage={stage} summary={summary} isViewer={isViewer} />}
			<DealsList deals={deals} stageId={stage.id} dealListElements={dealListElements} />
		</Container>
	);
};

const mapStateToProps = (state: PipelineState) => ({
	isLoading: isLoading(state),
	isViewer: getViewerState(state),
	loadedDealsCount: getLoadedDealsCount(state),
});

export default connect(mapStateToProps)(StageViewer);
