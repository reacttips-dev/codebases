import { Dialog } from '@pipedrive/convention-ui-react';
import { styled, colors } from '../../../../../utils/styles';

export const StyledDialog = styled(Dialog)`
	.cui4-dialog__wrap {
		/* So the select is working inside Dialog */
		overflow: visible;
	}

	.cui4-dialog__title {
		margin: 0 0 32px;
	}

	.cui4-dialog__content {
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		counter-reset: nestedCounter;

		label {
			margin-top: 8px;
		}

		.cui4-select {
			margin: 2px 0 4px 0;
		}
	}
`;

export const Wrapper = styled.div`
	margin-top: 24px;
	counter-increment: nestedCounter;

	p {
		margin: 0 0 12px 0;
		color: ${colors['$color-black-hex']};
		font-weight: 600;
	}

	div {
		width: 100%;
		font-size: 14px;
	}

	.selectStage {
		max-height: 250px;
		max-width: 320px;
	}
`;

export const ParagraphWithCounter = styled.p`
	::before {
		content: counters(nestedCounter, '.') '. ';
	}
	white-space: pre-wrap; /* Adds a newline between playbooks and Web Forms */
`;
