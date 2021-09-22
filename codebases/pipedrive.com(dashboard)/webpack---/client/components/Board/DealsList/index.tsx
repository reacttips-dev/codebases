import { Button, Icon } from '@pipedrive/convention-ui-react';
import React, { MutableRefObject } from 'react';
import { connect } from 'react-redux';
import { addDeal } from '../../../actions/deals';
import { getDealTileSize } from '../../../selectors/view';
import { getAllDealsCount } from '../../../selectors/deals';
import Draggable from '../../Shared/Draggable';
import { DealTileSizes } from '../../../utils/constants';
import { ButtonWrapper, Column, Container } from './StyledComponents';
import { DealListElements } from '../Board';
import DealTileWrapper from '../../DealTileWrapper';
import { getUsers } from '../../../shared/api/webapp';
import { getSelectedPipelineId } from '../../../selectors/pipelines';
import { openAddDealModal } from '../../../utils/modals';

export interface StateProps {
	selectedPipelineId: number;
	dealTileSize: DealTileSizes;
	allDealsCount: number;
}

export interface DispatchProps {
	addDeal: typeof addDeal;
}

export interface OwnProps {
	deals: Pipedrive.Deal[];
	stageId: number;
	isDraggingOver: boolean;
	dealListElements: MutableRefObject<DealListElements>;
}

export type Props = StateProps & DispatchProps & OwnProps;

const DealsList: React.FunctionComponent<Props> = (props) => {
	const {
		selectedPipelineId,
		deals,
		stageId,
		isDraggingOver,
		addDeal,
		dealTileSize,
		allDealsCount,
		dealListElements,
	} = props;

	const handleOnClick = () => {
		return openAddDealModal({
			onsave: (newDeal) => {
				addDeal(newDeal as Pipedrive.API.IAddDealResponse);
			},
			prefill: {
				stage_id: stageId,
				pipeline_id: selectedPipelineId,
			},
		});
	};

	const renderAddDealButton = () => {
		return (
			<ButtonWrapper
				dealsCount={deals.length}
				allDealsCount={allDealsCount}
				isDraggingOver={isDraggingOver}
				data-test="stage-add-deal-button"
			>
				<Button color="ghost" onClick={handleOnClick}>
					<Icon icon="plus" color="black-32" />
				</Button>
			</ButtonWrapper>
		);
	};

	return (
		<Container
			data-test="deals-list"
			ref={(element) => {
				dealListElements.current[stageId] = element;
			}}
		>
			<Column>
				{deals.map((deal: Pipedrive.Deal, index: number) => {
					const user = getUsers()[deal.user_id];
					const isLast = index === deals.length - 1;

					return (
						<Draggable key={deal.id} deal={deal} stageId={stageId} isDraggable={!deal.is_locked}>
							{({ isDragging }) => (
								<DealTileWrapper
									key={deal.id}
									index={index}
									deal={deal}
									user={user}
									isLast={isLast}
									isDragging={isDragging}
									size={dealTileSize}
								/>
							)}
						</Draggable>
					);
				})}

				{renderAddDealButton()}
			</Column>
		</Container>
	);
};

const mapStateToProps = (state: PipelineState) => ({
	selectedPipelineId: getSelectedPipelineId(state),
	dealTileSize: getDealTileSize(state),
	allDealsCount: getAllDealsCount(state),
});

export default connect<StateProps, DispatchProps, OwnProps>(mapStateToProps, { addDeal })(DealsList);
