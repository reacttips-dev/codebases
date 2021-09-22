/* eslint-disable relay/unused-fields */
import React from 'react';
import { readInlineData } from 'relay-runtime';
import { graphql } from '@pipedrive/relay';
import { LabelsList } from 'Components/LabelBadge/LabelsList';

import type { FieldLabels_data$key } from './__generated__/FieldLabels_data.graphql';

type Props = {
	data: FieldLabels_data$key;
};

const LABELS_DATA = graphql`
	fragment FieldLabels_data on FieldLabels @inline {
		labels {
			id
			name
			colorName
		}
	}
`;

export const FieldLabels = (props: Props) => {
	const data = readInlineData(LABELS_DATA, props.data);

	return <LabelsList labels={data.labels} limit={3} />;
};
