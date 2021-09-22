import { Spacing, Text } from '@pipedrive/convention-ui-react';
import React from 'react';
import { Middle, Message, SvgContainer } from './StyledComponents';
import NoDealsSVG from './svg/NoDeals.svg';
import { useTranslator } from '@pipedrive/react-utils';

const NoDealsCoachmark: React.FunctionComponent = () => {
	const translator = useTranslator();

	return (
		<Middle>
			<Spacing bottom="xl">
				<SvgContainer>
					<NoDealsSVG />
				</SvgContainer>
			</Spacing>
			<Spacing bottom="xl">
				<Message>
					<Text>
						<span>
							{translator.gettext('Add deals to keep track of sales conversations')}
						</span>
					</Text>
				</Message>
			</Spacing>
		</Middle>
	);
};

export default NoDealsCoachmark;
