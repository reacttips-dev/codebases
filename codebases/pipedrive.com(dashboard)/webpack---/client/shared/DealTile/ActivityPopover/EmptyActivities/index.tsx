import React from 'react';
import { Spacing, Text } from '@pipedrive/convention-ui-react';
import { useTranslator } from '@pipedrive/react-utils';
import { EmptyStateContainer } from './StyledComponents';

interface EmptyActivitiesProps {
	renderCustomEmptyActivities: () => React.ReactElement | null;
}

const EmptyActivities: React.FunctionComponent<EmptyActivitiesProps> = (props) => {
	const { renderCustomEmptyActivities } = props;
	const translator = useTranslator();
	const CustomEmptyActivities = renderCustomEmptyActivities();

	if (CustomEmptyActivities) {
		return CustomEmptyActivities;
	}

	return (
		<EmptyStateContainer>
			<Spacing horizontal="xxl" vertical="l">
				<Text>{translator.gettext('You have no activities scheduled for this deal')}</Text>
			</Spacing>
		</EmptyStateContainer>
	);
};

export default React.memo(EmptyActivities);
