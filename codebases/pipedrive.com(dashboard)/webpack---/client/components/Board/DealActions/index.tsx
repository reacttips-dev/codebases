import React from 'react';
import DeleteAction from './DeleteAction';
import WonAction from './WonAction';
import LostAction from './LostAction';
import MoveAction from './MoveAction';
import { canDeleteDeals } from '../../../shared/api/webapp/index';
import { Container } from './StyledComponents';
import { ViewTypes } from '../../../utils/constants';

type Props = {
	viewType?: ViewTypes;
};

const DealActions: React.FunctionComponent<Props> = (props) => {
	return (
		<Container data-test="deal-actions">
			{canDeleteDeals() && <DeleteAction viewType={props.viewType} />}
			<LostAction viewType={props.viewType} />
			<WonAction viewType={props.viewType} />
			{props.viewType !== ViewTypes.FORECAST && <MoveAction />}
		</Container>
	);
};

export default DealActions;
