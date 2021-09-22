import React, { useContext } from 'react';
import { graphql } from '@pipedrive/relay';
import { readInlineData } from 'relay-runtime';
import { WebappApiContext } from 'Components/WebappApiContext';
import { formatDateField } from 'Utils/formatDateField';

import { FieldText } from './FieldText';
import type { FieldDateRange_data$key } from './__generated__/FieldDateRange_data.graphql';

type Props = {
	data: FieldDateRange_data$key;
	bold?: boolean;
};

const FIELD_DATE_RANGE_DATA = graphql`
	fragment FieldDateRange_data on FieldDateRange @inline {
		startDate: start
		endDate: end
	}
`;

export const FieldDateRange = ({ data, bold }: Props) => {
	const { startDate, endDate } = readInlineData(FIELD_DATE_RANGE_DATA, data);
	const { locale } = useContext(WebappApiContext);

	const start = startDate ? formatDateField(startDate, locale) : null;
	const end = endDate ? formatDateField(endDate, locale) : null;

	if (!start || !end) {
		return null;
	}

	return (
		<FieldText bold={bold}>
			{start} - {end}
		</FieldText>
	);
};
