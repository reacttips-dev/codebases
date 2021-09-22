import styled from 'styled-components';
import { ButtonGroup, Icon, Input, Option, Select, Text } from '@pipedrive/convention-ui-react';
import Wysiwyg from '../wysiwyg';

import colors from '../../colors.scss';
import fonts from '../../fonts.scss';

export const StyledIcon = styled(Icon)`
	grid-column: 1;
	align-self: ${(props) => (props.alignStart ? 'start' : 'center')};
	margin-top: ${(props) =>
		props.alignStart && props.icon === 'description' && props.isExpanded ? '12px' : '4px'};
`;

export const Content = styled.div`
	display: grid;
	grid-template-rows: repeat(7, auto);
	align-items: center;
	grid-row-gap: 16px;
`;

export const ActivityTypeIcons = styled(ButtonGroup)`
	grid-column: 2;
	margin-top: 8px;

	button {
		padding: 0 6px 0 6px;
	}
`;

export const HiddenElement = styled.div`
	position: fixed;
	top: 0;
	left: 0;
	visibility: hidden;
`;

export const SubjectInput = styled(Input)`
	grid-column: 2;

	input {
		font-size: 23px !important;
		line-height: 1.22 !important;
		height: 40px !important;
	}
`;

export const LinkAlike = styled.div`
	color: #317ae2;
	font-weight: 600;
	margin-left: 4px;

	&:hover {
		text-decoration: underline;
		cursor: pointer;
	}
`;

export const FileLink = styled.a`
	color: #317ae2;
	margin: 6px 0 0 4px;
	width: fit-content;

	&:hover {
		cursor: pointer;
		text-decoration: none;
	}
`;

export const Links = styled.div`
	display: flex;
	flex-direction: column;
	align-self: flex-start;
`;

export const Expandable = styled(Text)`
	display: flex;
	align-items: center;
`;

export const ExpandableText = styled(Text)`
	height: 32px;
	display: flex;
	align-items: center;
	color: ${colors.expandableTextColor};

	&:hover {
		cursor: pointer;
	}
`;

export const Row = styled.div`
	display: grid;
	grid-template-columns: 40px auto;
	max-width: 100%;
	overflow-x: hidden;
`;

export const FlexRow = styled.div`
	display: ${(props) => (props.expanded ? 'flex' : 'grid')};
	grid-template-columns: ${(props) => (props.expanded ? null : '40px auto')};
	flex-direction: ${(props) => (props.expanded ? 'column' : null)};
	max-width: 100%;
	${(props) => props.expanded && 'overflow-x: hidden;'}
`;

export const ExpansionContainer = styled.div`
	display: grid;
	grid-template-columns: 40px auto;
	margin: ${(props) => (props.hasValue ? '8px 0' : '4px 0')};

	&:first-child {
		margin-top: 0;
	}

	&:last-child {
		margin-bottom: 0;
	}
`;

export const ActivityTypeOption = styled(Option)`
	display: flex;
	align-items: center;
`;

export const ActivityTypeIcon = styled(Icon)`
	margin-right: 8px;
`;

export const InvitationOptionsWrapper = styled.div`
	grid-column: 2;
	display: flex;
	align-items: center;
`;
export const SendInvitesLabel = styled.div`
	margin-right: 8px;
`;
export const SelectLanguageLabel = styled.div`
	margin: 0 8px;
`;
export const InvitationLanguageSelect = styled(Select)`
	margin-right: 8px;
`;
export const InvitationInfoLink = styled.a`
	height: 16px;
`;

const StyledWysiwyg = styled(Wysiwyg)`
	border: none;
	border-radius: 0;
	.bodyEditor {
		padding: 6px 0;
		margin: 0 8px;
		transition: opacity 0.3s ease-in-out;
		&.defaultText {
			opacity: 0.5;
		}
	}
	.editorToolbar {
		padding: 0 4px;
		margin: 0 8px;
		border-top: 1px solid ${colors.inputBorderColor};
		border-bottom: none;
		border-left: none;
		border-right: none;
		background: none;
		opacity: 0;
		transition: opacity 0.3s ease-in-out;
		cursor: text;

		&.visible {
			opacity: 1;
			cursor: unset;
		}

		div[class*='toolbar__group'] {
			margin-right: 20px;
		}
	}
`;

export const NotesWysiwyg = styled(StyledWysiwyg)`
	background: ${colors.noteFieldBackground};
`;

export const PublicDescription = styled(StyledWysiwyg)`
	.bodyEditor.defaultText {
		opacity: 1;
	}
`;

export const Log = styled.div`
	grid-column: 2;
	padding-bottom: 8px;
`;

export const LogData = styled.div`
	font-size: ${fonts.logTextSize};
	color: ${colors.logTextColor};
`;
