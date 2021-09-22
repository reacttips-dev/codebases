import { Icon } from '@pipedrive/convention-ui-react';
import React from 'react';
import {
	LeadboosterIcon,
	WebFormsIcon,
	WebsiteVisitorsIcon,
	ProspectorIcon,
	LiveChatIcon,
	DealIcon,
	WorkflowAutomationIcon,
	ApiIcon,
	ManuallyCreatedIcon,
} from 'Components/icons';

import type { LeadSourceIcon } from './__generated__/SourceIcon_source.graphql';

interface Props {
	readonly iconName?: LeadSourceIcon | null;
}

// eslint-disable-next-line complexity
export const SourceIcon: React.FC<Props> = ({ iconName }) => {
	switch (iconName) {
		case 'WEB_FORMS':
			return <WebFormsIcon />;
		case 'LEADBOOSTER':
			return <LeadboosterIcon className="cui4-icon" />;
		case 'IMPORT':
			return <Icon icon="ac-downarrow" size="s" />;
		case 'WEBSITE_VISITORS':
			return <WebsiteVisitorsIcon />;
		case 'LIVE_CHAT':
			return <LiveChatIcon />;
		case 'PROSPECTOR':
			return <ProspectorIcon />;
		case 'DEAL':
			return <DealIcon />;
		case 'WORKFLOW_AUTOMATION':
			return <WorkflowAutomationIcon />;
		case 'API':
			return <ApiIcon />;
		case 'COGNISM':
			return null;
		default:
			return <ManuallyCreatedIcon />;
	}
};
