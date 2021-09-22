import { styled } from '../../../utils/styles';
import { Pill } from '@pipedrive/convention-ui-react';
import { ExtendedPillProps } from '../StatusPill';
import filterPropsFromComponent from '../../../utils/filterPropsFromComponent';

export const StatusPillContainer = styled.div`
	display: flex;
	padding-right: 4px;
`;

export const StyledPill = styled(filterPropsFromComponent(Pill, ['lowercase']))`
	text-transform: ${(props: ExtendedPillProps) => (props.lowercase ? 'lowercase' : null)};
`;
