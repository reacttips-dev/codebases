import { colors, fonts } from '@pipedrive/convention-ui-css/dist/js/variables';
import { graphql } from '@pipedrive/relay';
import React from 'react';
import { readInlineData } from 'relay-runtime';
import styled from 'styled-components';

import { FieldText } from './FieldText';
import type { FieldMultipleOptions_data$key } from './__generated__/FieldMultipleOptions_data.graphql';

type Props = {
	bold?: boolean;
	data: FieldMultipleOptions_data$key;
};

const MULTIPLE_OPTIONS_DATA = graphql`
	fragment FieldMultipleOptions_data on FieldMultipleOptions @inline {
		selectedOptions: selected {
			id
			label
		}
	}
`;

const Option = styled.span<{ bold: boolean }>`
	margin-right: 4px;
	padding: 3px 7px;
	border: 1px solid ${colors.black16};
	border-radius: 2px;
	font-size: ${fonts.fontSizeS};
`;

export const FieldMultipleOptions = ({ data, bold }: Props) => {
	const { selectedOptions } = readInlineData(MULTIPLE_OPTIONS_DATA, data);

	if (!selectedOptions) {
		return null;
	}

	return (
		<FieldText bold={bold}>
			{selectedOptions.map(({ id, label }) => {
				return (
					<Option key={id} bold={bold ?? false}>
						{label}
					</Option>
				);
			})}
		</FieldText>
	);
};
