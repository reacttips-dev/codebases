import { graphql } from '@pipedrive/relay';
import React from 'react';
import { readInlineData } from 'relay-runtime';

import { NextActivity } from './NextActivity';
import { FieldText } from './FieldText';
import type { FieldActivity_data$key } from './__generated__/FieldActivity_data.graphql';

type Props = {
	bold?: boolean;
	data: FieldActivity_data$key;
};

const ACTIVITY_DATA = graphql`
	fragment FieldActivity_data on Lead @inline {
		upcomingActivity {
			dueDate
			dueTime
			type
		}
	}
`;

export const FieldActivity = (props: Props) => {
	const { upcomingActivity: activity } = readInlineData(ACTIVITY_DATA, props.data);

	if (activity === null || activity.type === null || activity.dueDate === null) {
		return <NextActivity activity={null} />;
	}

	return (
		<FieldText bold={props.bold}>
			<NextActivity
				activity={{
					type: activity.type,
					dueDate: activity.dueDate,
					dueTime: activity.dueTime,
				}}
			/>
		</FieldText>
	);
};
