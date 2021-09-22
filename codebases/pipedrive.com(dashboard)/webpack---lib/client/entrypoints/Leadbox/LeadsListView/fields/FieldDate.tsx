import React, { useContext } from 'react';
import { graphql } from '@pipedrive/relay';
import { readInlineData } from 'relay-runtime';
import { WebappApiContext } from 'Components/WebappApiContext';
import { formatDateField } from 'Utils/formatDateField';

import { FieldText } from './FieldText';
import type { FieldDate_data$key } from './__generated__/FieldDate_data.graphql';

type Props = {
	data: FieldDate_data$key;
	bold?: boolean;
};

const FIELD_DATE_DATA = graphql`
	fragment FieldDate_data on FieldDate @inline {
		date: value
	}
`;

export const FieldDate = ({ data, bold }: Props) => {
	const { date } = readInlineData(FIELD_DATE_DATA, data);
	const { locale } = useContext(WebappApiContext);

	const formattedDate = date ? formatDateField(date, locale) : null;

	return <FieldText bold={bold}>{formattedDate}</FieldText>;
};
