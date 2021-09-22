import { orderBy } from 'lodash';
import React, { MutableRefObject } from 'react';
import Stage from './Stage';
import StageViewer from './Stage/stage.viewer';
import { DealListElements } from './Board';
import { connect } from 'react-redux';
import { getViewerState } from '../../selectors/view';

type OwnProps = {
	stages: { [id: number]: Pipedrive.Stage };
	dealsByStages: {
		[id: number]: Pipedrive.Deal[];
	};
	summaryByStages: {
		[id: number]: Pipedrive.DealsByStagesSummaryPerStagesConverted;
	};
	dealListElements: MutableRefObject<DealListElements>;
};

export interface StateProps {
	isViewer: boolean;
}

export type StagesProps = StateProps & OwnProps;

const Stages: React.FunctionComponent<StagesProps> = (props) => {
	const { stages, dealsByStages, summaryByStages, dealListElements, isViewer } = props;
	return (
		<>
			{orderBy(Object.values(stages), 'order_nr').map((stage: Pipedrive.Stage, index: number) => {
				const deals = dealsByStages[stage.id] || [];
				const summary = summaryByStages[stage.id];

				if (isViewer) {
					return (
						<StageViewer
							key={stage.id}
							index={index}
							stage={stage}
							deals={deals}
							summary={summary}
							dealListElements={dealListElements}
						/>
					);
				}

				return (
					<Stage
						key={stage.id}
						index={index}
						stage={stage}
						deals={deals}
						summary={summary}
						dealListElements={dealListElements}
					/>
				);
			})}
		</>
	);
};

const mapStateToProps = (state: PipelineState) => ({
	isViewer: getViewerState(state),
});

export default connect(mapStateToProps)(Stages);
