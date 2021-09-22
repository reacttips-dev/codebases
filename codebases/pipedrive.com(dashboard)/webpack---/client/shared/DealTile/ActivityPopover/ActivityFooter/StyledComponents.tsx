import { styled, colors } from '../../../../utils/styles';

export const Container = styled.div`
	padding: 8px 0;
	flex: 0 0 auto;

	.cui4-option {
		display: flex;
		align-items: center;

		> span {
			margin-left: 8px;
		}

		&:hover {
			.cui4-icon {
				fill: ${colors['$color-white-hex']};
			}
		}
	}
`;
