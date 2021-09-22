import React from 'react';
import { Spacing, Spinner } from '@pipedrive/convention-ui-react';
import { SpinnerContainer } from './StyledComponents';

const EmptyActivities: React.FunctionComponent = () => {
	return (
		<SpinnerContainer>
			<Spacing horizontal="l" vertical="m">
				<Spinner />
			</Spacing>
		</SpinnerContainer>
	);
};

export default React.memo(EmptyActivities);
