import styled from 'styled-components';
import { colors, fonts } from '@pipedrive/convention-ui-css/dist/js/variables';
import { Checkbox, Separator as ConventionUiSeparator, Icon, Tabs } from '@pipedrive/convention-ui-react';

export const FieldCheckbox = styled(Checkbox)`
	padding: 5px 16px;
	flex: 1;
	&:hover {
		cursor: pointer;
	}
`;

export const EmptyResults = styled.div`
	padding: 40px 16px;
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
`;

export const BodyWrapper = styled.div`
	border-top: 1px solid ${colors.black12};
	border-bottom: 1px solid ${colors.black12};
	flex-grow: 1;
	overflow-y: auto;
	max-height: 100%;
	flex: 1 1 auto;
`;

export const Separator = styled(ConventionUiSeparator)`
	font-size: ${fonts.fontSizeS};
	margin: 0;
`;

export const List = styled.ul`
	margin: 10px 0;
`;

export const FilterMatches = styled.div`
	background-color: ${colors.blue};
	color: ${colors.white};
	font-size: ${fonts.fontSizeXs};
	font-weight: ${fonts.fontWeightBold};
	display: flex;
	width: 100%;
	text-transform: uppercase;
	padding: 3px 20px;
	box-sizing: border-box;
`;

export const FieldItemType = styled.div`
	color: ${colors.black64};
	padding-right: 16px;
`;

export const FieldRow = styled.div`
	display: flex;
	align-items: center;
	cursor: pointer;
	&:hover {
		background-color: ${colors.blue};
		label > span {
			color: ${colors.white};
		}
		${FieldItemType} {
			color: ${colors.white};
		}
	}
`;

export const FilteredList = styled.ul`
	padding: 5px 0;
`;

export const EmptyResultsHeading = styled.p`
	font-size: ${fonts.fontSizeL};
	color: ${colors.black88};
	margin: 0 0 4px 0;
`;

export const EmptyResultsBody = styled.p`
	font-size: ${fonts.fontSizeM};
	color: ${colors.black64};
	margin: 0;
`;

export const FieldTypesRow = styled(Tabs)`
	padding: 0 16px;
	border-bottom: 1px solid ${colors.black12};
	margin-bottom: 10px;
`;

export const FieldTypeItem = styled(Tabs.Tab)`
	min-height: auto !important;
	height: 39px;
	width: 100%;
`;

export const FieldTypeIcon = styled(Icon)`
	width: 22px;
	height: 22px;
`;
