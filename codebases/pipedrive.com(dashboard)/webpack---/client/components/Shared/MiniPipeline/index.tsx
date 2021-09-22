import React from 'react';
import { orderBy } from 'lodash';
import { StageSelector } from '@pipedrive/convention-ui-react';

type Props = {
	stages: { [stageId: number]: Pipedrive.Stage };
	activeStageId: number;
	onClickStage: (stageId: number) => void;
};

class MiniPipeline extends React.Component<Props> {
	tooltipRef: React.RefObject<HTMLDivElement>;

	constructor(props) {
		super(props);

		this.tooltipRef = React.createRef();
	}

	render() {
		return (
			<StageSelector dealStageId={this.props.activeStageId}>
				{orderBy(Object.values(this.props.stages), 'order_nr').map((stage: Pipedrive.Stage) => (
					<StageSelector.Stage
						key={stage.id}
						id={stage.id}
						dealStageId={stage.id}
						tooltip={stage.name}
						onClick={() => this.props.onClickStage(stage.id)}
						tooltipPortal={document.querySelector('body')}
					/>
				))}
			</StageSelector>
		);
	}
}

export default MiniPipeline;
