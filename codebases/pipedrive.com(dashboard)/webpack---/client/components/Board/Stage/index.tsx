import React, { MutableRefObject } from 'react';
import { DropTargetMonitor } from 'react-dnd';
import { connect } from 'react-redux';
import { moveDealToStage } from '../../../actions/deals';
import DealsList from '../DealsList';
import StageHeader from '../StageHeader';
import { Container, DroppableContainer } from './StyledComponents';
import { DealListElements } from '../Board';
import { FlowCoachmarkTypes } from '../../../utils/constants';
import { closeFlowCoachmark } from '../../../utils/flowCoachmarks';

interface DispatchProps {
	moveDealToStage: typeof moveDealToStage;
}

interface OwnProps {
	index: number;
	stage: Pipedrive.Stage;
	deals: Pipedrive.Deal[];
	summary?: Pipedrive.DealsByStagesSummaryPerStagesConverted;
	dealListElements: MutableRefObject<DealListElements>;
}

export type StageProps = DispatchProps & OwnProps;

const Stage: React.FunctionComponent<
	StageProps & {
		lastWasTruncated?: boolean;
	}
> = (props) => {
	const { index, stage, summary, deals = [], dealListElements, moveDealToStage } = props;

	return (
		<Container
			data-test={`stage-${stage.id}`}
			data-test-stage-index={index}
			{...((index === 0 || index === 1) && { 'data-coachmark': index })}
		>
			<StageHeader stage={stage} summary={summary} />
			<DroppableContainer
				hasOpacityOnDrop={true}
				onDrop={(monitor: DropTargetMonitor) => {
					const draggingItem = monitor.getItem();
					const deal = draggingItem.deal;
					const fromStageId = draggingItem.stageId;
					const toStageId = stage.id;

					if (fromStageId === toStageId) {
						return;
					}

					closeFlowCoachmark(FlowCoachmarkTypes.DRAG_AND_DROP);

					moveDealToStage(deal, fromStageId, toStageId);
				}}
			>
				{(isDraggingOver) => {
					return (
						<DealsList
							isDraggingOver={isDraggingOver}
							deals={deals}
							stageId={stage.id}
							dealListElements={dealListElements}
						/>
					);
				}}
			</DroppableContainer>
		</Container>
	);
};

export default connect<null, DispatchProps, OwnProps>(null, { moveDealToStage })(Stage);
