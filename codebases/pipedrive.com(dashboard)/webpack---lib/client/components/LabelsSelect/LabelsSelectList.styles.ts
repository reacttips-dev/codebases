import { colors, fonts } from '@pipedrive/convention-ui-css/dist/js/variables';
import { Button, Option, Spacing, Text } from '@pipedrive/convention-ui-react';
import styled from 'styled-components';

export const SearchWrapper = styled.div`
	padding: 8px 8px 0 8px;
`;

export const AddNewButton = styled(Option)`
	display: flex;
	align-items: center;
	margin-bottom: 8px;

	> span {
		font: ${fonts.fontButton};
		color: ${colors.blue};
		text-decoration: none;

		margin-left: 8px;
	}
`;

export const CreateEditWrapper = styled(Text)`
	cursor: default;
	label {
		font: ${fonts.fontBody};

		&:not(:first-child) {
			margin-top: 10px;
		}
	}
`;

export const Header = styled(Spacing)`
	display: flex;
	align-items: center;
	flex-direction: row;
`;

export const BackButton = styled(Button)`
	margin: 0 8px 0 4px;
`;

export const HeaderText = styled.span`
	font: ${fonts.fontTitleL};
`;

export const Footer = styled(Spacing)`
	display: flex;
	background-color: ${colors.black4};
	box-shadow: inset 0 1px 0 0 ${colors.black12};
	justify-content: space-between;
`;

export const FooterButtons = styled.div`
	.cui4-button:not(:last-child) {
		margin-right: 8px;
	}
`;

export const NoLabels = styled.div`
	padding: 6px 16px;
	cursor: default;
`;

export const LabelsSelectOptionListWrapper = styled.div`
	max-height: 400px;
	overflow-y: auto;
`;
