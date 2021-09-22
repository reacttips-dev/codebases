import React from 'react';
import StageSummary from '../StageSummary';
import { Container, Details, StageOverview } from './StyledComponents';
import StageName from '../StageName';
import { OwnProps } from '.';
import Arrow from '../../Shared/svg/Arrow.svg';
import ViewerStageSummary from '../StageSummary/stageSummary.viewer';

export interface Props extends OwnProps {
	isViewer: boolean;
}

const StageHeader: React.FunctionComponent<Props> = (props) => {
	const { stage, summary, isViewer } = props;

	const Summary = () => {
		if (isViewer) {
			return <ViewerStageSummary summary={summary} />;
		}
		return <StageSummary summary={summary} />;
	};

	return (
		<Container>
			<Details data-test={`stage-header-${stage.id}`}>
				<StageOverview>
					<StageName name={stage.name} />
					<Summary />
				</StageOverview>
				<Arrow />
			</Details>
		</Container>
	);
};

export default StageHeader;
