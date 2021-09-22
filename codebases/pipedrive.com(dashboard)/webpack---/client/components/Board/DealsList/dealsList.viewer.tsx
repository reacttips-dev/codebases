import React, { MutableRefObject } from 'react';
import { connect } from 'react-redux';
import { getDealTileSize, getViewerState } from '../../../selectors/view';
import { Column, Container } from './StyledComponents';
import { getSelectedPipelineId } from '../../../selectors/pipelines';
import DealTile from '../../../shared/DealTile';
import { DealTileSizes } from '../../../utils/constants';
import { DealListElements } from '../Board';
import Upselling from '../../../shared/Upselling';
import { getSelectedLink } from '../../../selectors/links';

export interface OwnProps {
	deals: Pipedrive.Deal[];
	stageId: number;
	dealListElements: MutableRefObject<DealListElements>;
}

export interface StateProps {
	dealTileSize: DealTileSizes;
	isViewer: boolean;
	selectedLink: Viewer.Link;
}

const DealsListViewer: React.FunctionComponent<OwnProps & StateProps> = ({
	deals,
	stageId,
	dealTileSize,
	dealListElements,
	isViewer,
	selectedLink,
}) => {
	const activitiesEnabled = selectedLink.permissions.includes('deal_activities');

	return (
		<Container
			data-test="deals-list"
			ref={(element) => {
				dealListElements.current[stageId] = element;
			}}
		>
			<Column>
				{deals.map((deal: Pipedrive.Deal, index: number) => {
					const isLast = index === deals.length - 1;

					return (
						<Upselling key={deal.id}>
							<DealTile
								includeDescription
								key={deal.id}
								index={index}
								deal={deal}
								isLast={isLast}
								size={dealTileSize}
								isViewer={isViewer}
								hideActivities={!activitiesEnabled}
							/>
						</Upselling>
					);
				})}
			</Column>
		</Container>
	);
};

const mapStateToProps = (state: PipelineState) => ({
	selectedPipelineId: getSelectedPipelineId(state),
	dealTileSize: getDealTileSize(state),
	isViewer: getViewerState(state),
	selectedLink: getSelectedLink(state as Viewer.State),
});

export default connect(mapStateToProps)(DealsListViewer);
