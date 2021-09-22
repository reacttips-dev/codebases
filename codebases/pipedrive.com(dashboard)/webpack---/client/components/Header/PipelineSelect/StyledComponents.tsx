import { styled, colors } from '../../../utils/styles';

export const Container = styled.div`
	display: flex;
	margin-right: 8px;
`;

export const FooterContainer = styled.div`
	padding: 8px 0;
	flex: 0 0 auto;

	.cui4-option {
		display: flex;
		align-items: center;

		span {
			margin-left: 8px;
		}

		&:hover {
			.cui4-icon {
				fill: ${colors['$color-white-hex']};
			}
		}
	}
`;

export const OptionTitle = styled.div`
	flex: 1;
	overflow: hidden;
	white-space: nowrap;
	text-overflow: ellipsis;
	padding-right: 40px;
`;
