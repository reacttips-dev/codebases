import styled from 'styled-components';
import {
	Text,
	Button,
	Icon,
	Option,
	Spacing,
	Separator,
	Spinner,
} from '@pipedrive/convention-ui-react';

export const CollapsedConferenceField = styled.span`
	display: flex;
	position: relative;
`;

export const InstallIntegrationLinkWrapper = styled(Text)`
	display: flex;
	align-items: center;
`;

export const InstallIntegrationLink = styled.a`
	display: flex;
	align-items: center;

	&:hover {
		text-decoration: underline;
	}
`;

export const LinkIcon = styled(Icon)`
	margin-left: 4px;
`;

export const MeetingActionButtons = styled.div`
	display: flex;
`;

export const DeleteButton = styled(Button)`
	margin-left: 8px;
`;

export const ConferenceFieldWrapper = styled.div`
	display: flex;
	flex-direction: column;
	justify-content: center;
`;

export const ConferenceField = styled(Text)`
	display: flex;
	align-items: center;
	max-width: 100%;
	overflow-x: hidden;
`;

export const DropdownOption = styled(Option)`
	display: flex;
	align-items: center;
	text-decoration: none;

	&:hover {
		text-decoration: none;
	}
`;

export const DropdownSpacing = styled(Spacing)`
	display: flex;
`;

export const DropdownRedirectIcon = styled(Icon)`
	margin-left: auto;
`;

export const DropdownAppImg = styled.img`
	${({ imageLoaded }) => (imageLoaded ? 'width: 16px;' : 'width: 0;')};
	height: 16px;
`;

export const DropdownIntegrationSeparator = styled(Separator)`
	margin-top: 0;
`;

export const DropdownAppPlaceholderIcon = styled(Icon)`
	width: 16px;
	height: 16px;
`;

export const DropdownContentDiv = styled.div`
	top: 10px;
	min-width: 246px;
`;

export const DropdownAppName = styled.span`
	padding-right: 6px;
`;

export const CheckingIntegrationsWrapper = styled.div`
	display: flex;
	align-items: center;
	margin-top: 4px;
`;

export const CheckingIntegrationsSpinner = styled(Spinner)`
	margin-right: 8px;
`;

export const CancelCheckingIntegrationsButton = styled(Button)`
	margin-left: 12px;
`;
