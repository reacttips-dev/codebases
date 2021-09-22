import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { colors, fonts } from '@pipedrive/convention-ui-css/dist/js/variables';

const KeyboardShortcut = styled.div<{ small?: boolean; dark?: boolean }>`
	display: inline-flex;
	padding: 0px 4px;
	height: ${(props) => (props.small ? '16px' : '20px')};
	min-width: ${(props) => (props.small ? '16px' : '20px')};
	box-sizing: border-box;
	background: ${(props) => (props.dark ? 'rgba(255, 255, 255, 0.16)' : colors.black8Opaque)};
	border-radius: 4px;
	font: ${fonts.fontBodyS};
	color: ${(props) => (props.dark ? 'rgba(255, 255, 255, 0.64)' : colors.black64)};
	justify-content: center;
	align-items: center;
	text-transform: capitalize;
	flex: 0 0 auto;
`;

const TooltipContent = styled.div`
	display: flex;
	flex-direction: row;
	white-space: nowrap;

	${KeyboardShortcut} {
		margin-left: 8px;
	}
`;

export default KeyboardShortcut;

export const TooltipContentWithKeyboardShortcut = ({ keyboardShortcut, children }) => {
	return (
		<TooltipContent>
			{children}
			{!!keyboardShortcut && (
				<KeyboardShortcut dark small>
					{keyboardShortcut}
				</KeyboardShortcut>
			)}
		</TooltipContent>
	);
};

TooltipContentWithKeyboardShortcut.propTypes = {
	keyboardShortcut: PropTypes.string,
	children: PropTypes.node.isRequired,
};
