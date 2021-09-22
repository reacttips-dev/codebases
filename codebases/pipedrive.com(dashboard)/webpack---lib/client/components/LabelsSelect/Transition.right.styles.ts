import { CSSTransition } from 'react-transition-group';
import styled, { keyframes } from 'styled-components';

export const CSS_TRANSITION_CLASS_RIGHT = 'labels-select-right';

const fadeIn = keyframes`
	0% {
		opacity: 0;
	}

	100% {
		opacity: 1;
	}
`;

const slideOut = keyframes`
	0% {
		opacity: 1;
		transform: translate3d(0, 0, 0);
	}

	80% {
		opacity: 0;
	}

	100% {
		opacity: 0;
		transform: translate3d(-24px, 0, 0);
	}
`;

export const SlideRightTransition = styled(CSSTransition)`
	&.${CSS_TRANSITION_CLASS_RIGHT}-enter {
		opacity: 0;
		animation: ${fadeIn} 0.15s forwards 0.1s;
	}

	&.${CSS_TRANSITION_CLASS_RIGHT}-exit {
		animation: ${slideOut} 0.15s forwards;
	}
`;
