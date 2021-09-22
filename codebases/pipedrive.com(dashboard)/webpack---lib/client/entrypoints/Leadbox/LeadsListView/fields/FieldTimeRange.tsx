import { graphql } from '@pipedrive/relay';
import React, { useContext } from 'react';
import { readInlineData } from 'relay-runtime';
import { WebappApiContext } from 'Components/WebappApiContext';
import { formatTimeField } from 'Utils/formatTimeField';

import { FieldText } from './FieldText';
import type { FieldTimeRange_data$key } from './__generated__/FieldTimeRange_data.graphql';

type Props = {
	data: FieldTimeRange_data$key;
	bold?: boolean;
};

const FIELD_TIME_RANGE_DATA = graphql`
	fragment FieldTimeRange_data on FieldTimeRange @inline {
		startTime: start
		endTime: end
	}
`;

export const FieldTimeRange = ({ data, bold }: Props) => {
	const { locale } = useContext(WebappApiContext);

	const { startTime, endTime } = readInlineData(FIELD_TIME_RANGE_DATA, data);

	const start = startTime ? formatTimeField(startTime, locale) : null;

	const end = endTime ? formatTimeField(endTime, locale) : null;

	if (!start || !end) {
		return null;
	}

	return (
		<FieldText bold={bold}>
			{start} - {end}
		</FieldText>
	);
};
