/* eslint-disable relay/unused-fields */
import React from 'react';
import { graphql, readInlineData } from 'react-relay';

import { FieldText } from './FieldText';
import { FieldSource } from './FieldSource';
import { FieldDateTime } from './FieldDateTime';
import { FieldActivity } from './FieldActivity';
import { FieldLabels } from './FieldLabels';
import { FieldDate } from './FieldDate';
import { FieldTime } from './FieldTime';
import { FieldTimeRange } from './FieldTimeRange';
import { FieldDateRange } from './FieldDateRange';
import { FieldMonetary } from './FieldMonetary';
import { FieldMultipleOptions } from './FieldMultipleOptions';
import type { FieldComponent_lead$key } from './__generated__/FieldComponent_lead.graphql';
import type { FieldComponent_field$key } from './__generated__/FieldComponent_field.graphql';

type Props = {
	field: FieldComponent_field$key;
	lead: FieldComponent_lead$key | null;
};

const LEAD_DATA = graphql`
	fragment FieldComponent_lead on Lead @inline {
		wasSeen
		...FieldActivity_data
	}
`;

const FIELD_DATA = graphql`
	fragment FieldComponent_field on Field @inline {
		__typename
		... on FieldText {
			text: value
		}
		... on FieldLargeText {
			text: value
		}
		... on FieldPhone {
			text: value
		}
		... on FieldAutocomplete {
			text: value
		}
		... on FieldAddress {
			text: value
		}
		... on FieldVisibility {
			text: label
		}
		... on FieldNumeric {
			float: value
		}
		... on FieldInteger {
			number: value
		}
		... on FieldDate {
			...FieldDate_data
		}
		... on FieldDateRange {
			...FieldDateRange_data
		}
		... on FieldDateTime {
			...FieldDateTime_data
		}
		... on FieldTime {
			...FieldTime_data
		}
		... on FieldTimeRange {
			...FieldTimeRange_data
		}
		... on FieldLabels {
			...FieldLabels_data
		}
		... on FieldLeadSource {
			...FieldSource_data
		}
		... on FieldSingleOption {
			selectedOption: selected {
				id
				label
			}
		}
		... on FieldMultipleOptions {
			...FieldMultipleOptions_data
		}
		... on FieldUser {
			user {
				name
			}
		}
		... on FieldPerson {
			person {
				name
			}
		}
		... on FieldOrganization {
			organization {
				name
			}
		}
		... on FieldActivity {
			# for simplicity due to local subscription updates
			# this data is read from Lead object and
			# FieldActivity works only as placeholder here
			__typename
		}
		... on FieldMonetary {
			...FieldMonetary_data
		}
	}
`;

// eslint-disable-next-line complexity
export const FieldComponent = (props: Props): React.ReactElement => {
	const lead = readInlineData(LEAD_DATA, props.lead);
	const field = readInlineData(FIELD_DATA, props.field);
	const shared = { bold: !lead?.wasSeen ?? false };

	switch (field?.__typename) {
		case 'FieldText':
		case 'FieldLargeText':
		case 'FieldPhone':
		case 'FieldAddress':
		case 'FieldAutocomplete':
		case 'FieldVisibility':
			return <FieldText {...shared}>{field.text}</FieldText>;
		case 'FieldUser':
			return <FieldText {...shared}>{field.user?.name}</FieldText>;
		case 'FieldPerson':
			return <FieldText {...shared}>{field.person?.name}</FieldText>;
		case 'FieldOrganization':
			return <FieldText {...shared}>{field.organization?.name}</FieldText>;
		case 'FieldLeadSource':
			return <FieldSource {...shared} data={field} />;
		case 'FieldDateTime':
			return <FieldDateTime {...shared} data={field} />;
		case 'FieldActivity':
			// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
			return <FieldActivity {...shared} data={lead!} />;
		case 'FieldLabels':
			return <FieldLabels {...shared} data={field} />;
		case 'FieldNumeric':
			return <FieldText {...shared}>{field.float}</FieldText>;
		case 'FieldInteger':
			return <FieldText {...shared}>{field.number}</FieldText>;
		case 'FieldDate':
			return <FieldDate {...shared} data={field} />;
		case 'FieldTime':
			return <FieldTime {...shared} data={field} />;
		case 'FieldTimeRange':
			return <FieldTimeRange {...shared} data={field} />;
		case 'FieldDateRange':
			return <FieldDateRange {...shared} data={field} />;
		case 'FieldMonetary':
			return <FieldMonetary {...shared} data={field} />;
		case 'FieldSingleOption':
			return <FieldText {...shared}>{field.selectedOption?.label}</FieldText>;
		case 'FieldMultipleOptions':
			return <FieldMultipleOptions {...shared} data={field} />;
		default:
			return <FieldText>Unknown Field</FieldText>;
	}
};
