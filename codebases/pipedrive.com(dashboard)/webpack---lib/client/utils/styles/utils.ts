import { css } from 'styled-components';

export const easing = 'cubic-bezier(0.08, 0.47, 0.27, 0.98)';

export const reduceMotion = css`
	@media (prefers-reduced-motion: reduce) {
		transition: none;
	}
`;

export const disableHoverTextDecoration = css`
	&:hover,
	&:focus,
	&:active {
		text-decoration: none;
	}
`;

export const ellipsisOverflow = css`
	white-space: nowrap;
	overflow: hidden;
	text-overflow: ellipsis;
`;
