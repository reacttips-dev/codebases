import { graphql } from '@pipedrive/relay';
import React from 'react';
import { readInlineData } from 'relay-runtime';
import { MonetaryRead } from '@pipedrive/form-fields';

import { FieldText } from './FieldText';
import type { FieldMonetary_data$key } from './__generated__/FieldMonetary_data.graphql';

type Props = {
	bold?: boolean;
	data: FieldMonetary_data$key;
};

const MONETARY_DATA = graphql`
	fragment FieldMonetary_data on FieldMonetary @inline {
		monetary: value {
			amount
			currency {
				code
			}
		}
	}
`;

export const FieldMonetary = ({ data, bold }: Props) => {
	const { monetary } = readInlineData(MONETARY_DATA, data);

	if (!monetary?.amount || !monetary?.currency) {
		return null;
	}

	return (
		<FieldText bold={bold}>
			<MonetaryRead
				value={{
					value: monetary?.amount,
					label: monetary?.currency.code,
				}}
			/>
		</FieldText>
	);
};
