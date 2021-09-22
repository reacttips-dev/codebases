import { graphql } from '@pipedrive/relay';
import React from 'react';
import { readInlineData } from 'relay-runtime';
import * as SourceLabel from 'Components/SourceLabel/SourceLabel.styles';
import { getTranslatedSourceName } from 'Components/SourceLabel/SourceLabel';
import { useTranslator } from '@pipedrive/react-utils';
import { SourceIcon } from 'Components/SourceIcon/SourceIcon';

import { FieldText } from './FieldText';
import type { FieldSource_data$key } from './__generated__/FieldSource_data.graphql';

type Props = {
	bold?: boolean;
	data: FieldSource_data$key;
};

const SOURCE_DATA = graphql`
	fragment FieldSource_data on FieldLeadSource @inline {
		leadSource {
			name
			iconName
		}
	}
`;

export const FieldSource = (props: Props) => {
	const { leadSource } = readInlineData(SOURCE_DATA, props.data);
	const translator = useTranslator();

	return (
		<FieldText bold={props.bold}>
			<SourceLabel.Wrapper>
				<SourceLabel.IconWrapper>
					<SourceIcon iconName={leadSource?.iconName} />
				</SourceLabel.IconWrapper>
				<SourceLabel.LabelWrapper isInsideSidebar={false}>
					{getTranslatedSourceName(leadSource?.iconName ?? null, translator) ?? leadSource?.name}
				</SourceLabel.LabelWrapper>
			</SourceLabel.Wrapper>
		</FieldText>
	);
};
