import styled from 'styled-components';

export const Holder = styled.div`
	width: 100%;
	transition: height 200ms cubic-bezier(0.08, 0.47, 0.27, 0.98);
	position: relative;
	transform: translate3d(0, 0, 0);
	backface-visibility: hidden;
	top: 0;
	padding-top: 1px;
	margin-top: 0;
`;

export const Item = styled.div`
	top: 0;
	left: 0;
	width: 100%;
	border-top: 1px solid transparent;
	border-bottom: 1px solid transparent;
	position: absolute;
	background: #fff;
	backface-visibility: hidden;
	will-change: transform, opacity;
`;
