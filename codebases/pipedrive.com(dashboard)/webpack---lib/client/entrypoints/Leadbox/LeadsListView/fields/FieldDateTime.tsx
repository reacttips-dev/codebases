import React from 'react';
import { graphql } from '@pipedrive/relay';
import { readInlineData } from 'relay-runtime';
import { getTimeStringsReference } from 'Utils/time-strings';

import { FieldText } from './FieldText';
import type { FieldDateTime_data$key } from './__generated__/FieldDateTime_data.graphql';

type Props = {
	data: FieldDateTime_data$key;
	bold?: boolean;
};

const FIELD_DATE_TIME_DATA = graphql`
	fragment FieldDateTime_data on FieldDateTime @inline {
		dateTime: value
	}
`;

export const FieldDateTime = ({ data, bold }: Props) => {
	const { dateTime } = readInlineData(FIELD_DATE_TIME_DATA, data);

	if (!dateTime) {
		return null;
	}

	const timeStrings = getTimeStringsReference();
	const timestamp = timeStrings.fromNow(new Date(dateTime));

	return <FieldText bold={bold}>{timestamp}</FieldText>;
};
