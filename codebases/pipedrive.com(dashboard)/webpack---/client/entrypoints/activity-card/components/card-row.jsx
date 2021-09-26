import PropTypes from 'prop-types';
import React from 'react';
import styled from 'styled-components';

import { Icon, Tooltip } from '@pipedrive/convention-ui-react';
import sanitizeHtml from '@pipedrive/sanitize-html';
import css from './lib/variables.scss';

const RowWrapper = styled.div`
	display: flex;
	${(props) =>
		props.rowStyle === 'note'
			? `
			background-color: ${css.noteColor};
			box-shadow: inset 0 1px 0 0 ${css.noteBorderColor}, inset 0 -1px 0 0 ${css.noteBorderColor};
			margin-left: -16px;
			margin-right: -16px;
			padding: 4px 16px;
		`
			: ''}
`;
const RowContent = styled.div`
	padding: ${(props) => (props.size === 's' ? '8px' : '0')} 0 8px 8px;
	overflow: hidden;
	flex: 1 0;
`;
const RowIconWrapper = styled.div`
	padding-top: ${(props) => (props.size === 's' ? '10px' : '2px')};
	margin-left: ${(props) => (props.size === 's' ? '4px' : '0')};
	margin-right: ${(props) => (props.size === 's' ? '12px' : '8px')};
	flex: 0 0 16px;
	${(props) =>
		props.centered &&
		`
		display: flex;
		align-items: center;
		padding-top: 0;
	`}
`;

const CardRow = (props) => {
	const {
		icon,
		iconSize,
		iconColor,
		centerIcon,
		children,
		title,
		rowStyle,
		childrenAsHtml,
		...rowContentProps
	} = props;

	if (!children) {
		return null;
	}

	const iconElement = <Icon color={iconColor} icon={icon} size={iconSize === 's' ? 's' : null} />;

	return (
		<RowWrapper rowStyle={rowStyle}>
			<RowIconWrapper size={iconSize} centered={centerIcon}>
				{title ? (
					<Tooltip placement="top" content={title} mouseEnterDelay={0.5}>
						{iconElement}
					</Tooltip>
				) : (
					iconElement
				)}
			</RowIconWrapper>
			{childrenAsHtml ? (
				<RowContent size={iconSize} className="activityNote">
					<div
						className="contentHtml"
						{...rowContentProps}
						/* eslint-disable-next-line react/no-danger */
						dangerouslySetInnerHTML={{ __html: sanitizeHtml(children) }}
					/>
				</RowContent>
			) : (
				<RowContent size={iconSize} {...rowContentProps}>
					{children}
				</RowContent>
			)}
		</RowWrapper>
	);
};

CardRow.defaultProps = {
	iconSize: 's',
	iconColor: 'black-64',
	childrenAsHtml: false,
	centerIcon: false,
};

CardRow.propTypes = {
	icon: PropTypes.string,
	iconSize: PropTypes.oneOf(['s', 'm']),
	iconColor: PropTypes.string,
	centerIcon: PropTypes.bool,
	title: PropTypes.string,
	rowStyle: PropTypes.string,
	children: PropTypes.any,
	childrenAsHtml: PropTypes.bool,
};

export default CardRow;
