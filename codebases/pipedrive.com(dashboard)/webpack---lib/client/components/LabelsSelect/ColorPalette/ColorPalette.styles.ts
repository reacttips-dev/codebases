import { Pill } from '@pipedrive/convention-ui-react';
import styled, { css } from 'styled-components';

export const StyledPill = styled(Pill)<{ $isActive: boolean }>`
	cursor: pointer;
	width: 24px;
	height: 24px;
	border-radius: 100%;
	margin: 0;
	margin-top: 3px;
	position: relative;
	display: flex;
	align-items: center;
	justify-content: center;
	background-clip: content-box;
	box-sizing: content-box;
	padding: 4px;

	.cui4-pill__label {
		display: flex;
	}

	.cui4-icon {
		transform: scale(0);
		transition: transform 0.2s;
	}

	&::before {
		position: absolute;
		width: 100%;
		height: 100%;
		content: '';
		background-color: inherit;
		opacity: 0.25;
		border-radius: 100%;
		transform: scale(0);
		transition: transform 0.2s;
	}

	${({ $isActive }) =>
		$isActive &&
		css`
			cursor: default;
			&::before {
				transform: scale(1);
				transition: transform 0.3s;
			}

			.cui4-icon {
				transform: scale(1);
				transition: transform 0.2s;
			}
		`}
`;

export const ColorPalette = styled.div`
	display: flex;
`;
