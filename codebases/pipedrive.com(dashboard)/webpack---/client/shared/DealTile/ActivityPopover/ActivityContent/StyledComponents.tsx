import { styled, elevations } from '../../../../utils/styles';
import { Separator, Pill } from '@pipedrive/convention-ui-react';

export const Container = styled.div`
	width: 320px;
	margin: -8px 0;

	.cui4-popover__inner {
		border: 0;
		box-shadow: ${elevations['$elevation-08']};
		border-radius: 4px;
		overflow: hidden;
	}
`;
export const Activities = styled.div`
	overflow: auto;
	max-height: calc(100vh - 200px);
`;

export const PopoverSeparator = styled(Separator)`
	margin: 0;

	> span {
		display: flex;
	}
`;

export const ActivityCountPill: any = styled(Pill)`
	position: absolute;
	right: 16px;
	min-width: 24px;
	justify-content: center;
`;
