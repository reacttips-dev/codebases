import React, { useContext } from 'react';
import { graphql } from '@pipedrive/relay';
import { readInlineData } from 'relay-runtime';
import { WebappApiContext } from 'Components/WebappApiContext';
import { formatTimeField } from 'Utils/formatTimeField';

import { FieldText } from './FieldText';
import type { FieldTime_data$key } from './__generated__/FieldTime_data.graphql';

type Props = {
	data: FieldTime_data$key;
	bold?: boolean;
};

const FIELD_TIME_DATA = graphql`
	fragment FieldTime_data on FieldTime @inline {
		time: value
	}
`;

export const FieldTime = ({ data, bold }: Props) => {
	const { time } = readInlineData(FIELD_TIME_DATA, data);
	const { locale } = useContext(WebappApiContext);

	const formattedTime = time ? formatTimeField(time, locale) : null;

	return <FieldText bold={bold}>{formattedTime}</FieldText>;
};
