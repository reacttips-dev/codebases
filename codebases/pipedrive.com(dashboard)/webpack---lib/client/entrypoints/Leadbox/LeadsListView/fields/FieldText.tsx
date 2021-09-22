import styled from 'styled-components';
import { fonts } from '@pipedrive/convention-ui-css/dist/js/variables';

type Props = {
	bold?: boolean;
};

export const FieldText = styled.div<Props>`
	width: 100%;
	white-space: nowrap;
	font-weight: ${({ bold }) => bold && fonts.fontWeightBold};
	overflow: hidden;
	text-overflow: ellipsis;
`;
