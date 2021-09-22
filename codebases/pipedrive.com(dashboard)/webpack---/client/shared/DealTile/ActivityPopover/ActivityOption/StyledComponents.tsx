import { styled, colors, fonts } from '../../../../utils/styles';
import { Tooltip, Panel } from '@pipedrive/convention-ui-react';

export const ActivityWrapper = styled.div`
	display: flex;
	align-items: center;

	.cui4-tooltip {
		z-index: 4;
	}
`;

export const ActivityDetails = styled.div`
	flex: 1 1 auto;
`;

interface ActivitySubjectProps {
	isChecked: boolean;
}

export const ActivitySubject = styled.div<ActivitySubjectProps>`
	white-space: nowrap;
	text-overflow: ellipsis;
	overflow: hidden;
	max-width: 200px;
	font: ${fonts['$font-body-m']};
	text-decoration: ${(props) => (props.isChecked ? 'line-through' : 'none')};
`;

export const ActivityMeta = styled.div`
	white-space: nowrap;
	text-overflow: ellipsis;
	overflow: hidden;
	max-width: 200px;
	font: ${fonts['$font-body-s']};
	color: ${colors['$color-black-hex-64']};
`;

interface ActivityMetaContentProps {
	status: string;
}

export const ActivityMetaContent = styled.span<ActivityMetaContentProps>`
	color: ${(props) => {
		const status = props.status;

		if (status === 'overdue') {
			return colors['$color-red-hex'];
		}

		if (status === 'today') {
			return colors['$color-green-hex'];
		}

		return colors['$color-black-hex-64'];
	}};
`;

export const ActivityNote = styled(Panel)`
	font: ${fonts['$font-body-s']};
	color: ${colors['$color-black-hex-64']};
	overflow: auto;
	max-height: 52px;
	margin-top: 8px;
`;

export const ActivityTooltip = styled(Tooltip)`
	z-index: 4;
`;

export const Container = styled.div`
	.cui4-option {
		box-shadow: inset 0 1px 0 ${colors['$color-black-rgba-12']};
		padding: 8px 16px;

		.cui4-checkbox {
			margin-right: 16px;
		}

		&:hover {
			${ActivityMeta},
			${ActivityMetaContent} {
				color: ${colors['$color-white-hex']};
			}
			${ActivityNote} {
				color: ${colors['$color-black-hex']};
				border: 1px solid ${colors['$color-note-yellow-hex']};
			}
			svg {
				fill: ${colors['$color-white-hex']};
			}
		}
	}
`;
