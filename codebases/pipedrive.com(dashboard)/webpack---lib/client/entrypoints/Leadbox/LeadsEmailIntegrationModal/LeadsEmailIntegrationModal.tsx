import React, { useContext } from 'react';
import { useCoachmark } from '@pipedrive/use-coachmark';
import { Button } from '@pipedrive/convention-ui-react';
import { useTranslator } from '@pipedrive/react-utils';
import { WebappApiContext } from 'Components/WebappApiContext';

import { Item } from './Item';
import * as S from './LeadsEmailIntegrationModal.styles';
import LeadsEmailsBcc from './LeadsEmailsBcc.svg';
import LinkEmailsToLeads from './LinkEmailsToLeads.svg';
import TrackPastEmails from './TrackPastEmails.svg';

const LEADS_EMAIL_INTEGRATION_MODAL = 'leads_email_integration_modal';

export const LeadsEmailIntegrationModal = () => {
	const coachmark = useCoachmark(LEADS_EMAIL_INTEGRATION_MODAL);
	const translator = useTranslator();
	const { isLeadsInboxActiveUser } = useContext(WebappApiContext);

	const items = [
		{
			image: <LeadsEmailsBcc />,
			description: translator.gettext('Send email and use Smart BCC with leads'),
		},
		{
			image: <LinkEmailsToLeads />,
			description: translator.gettext('Link your relevant emails to leads'),
		},
		{
			image: <TrackPastEmails />,
			description: translator.gettext('Track all your emails in lead details'),
		},
	];

	return (
		<S.DialogCUI
			actions={
				<S.ButtonsWrapper>
					<Button color="green" onClick={() => coachmark.close()}>
						{translator.gettext('Continue to Leads Inbox')}
					</Button>
					<S.Link href="https://support.pipedrive.com/en/article/emails-in-leads-beta" target="_blank">
						{translator.gettext('Learn more')}
					</S.Link>
				</S.ButtonsWrapper>
			}
			title={translator.gettext('Leads and email, together at last!')}
			visible={isLeadsInboxActiveUser && coachmark.visible}
			onClose={() => coachmark.close()}
		>
			<S.ContentWrapper>
				{items.map((item) => {
					return <Item key={item.description} image={item.image} description={item.description} />;
				})}
			</S.ContentWrapper>
		</S.DialogCUI>
	);
};
