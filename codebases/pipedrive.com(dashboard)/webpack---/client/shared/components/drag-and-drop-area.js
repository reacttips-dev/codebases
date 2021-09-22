import React, { Component } from 'react';
import { DropTarget, DragLayer } from 'react-dnd';
import flow from 'lodash/flow';
import { NativeTypes } from 'react-dnd-html5-backend';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import colors from '@pipedrive/convention-ui-css/dist/amd/colors.js';

const StyledAttachmentsDropArea = styled.div(({ showBorder }) => {
	const defaultStyles = {
		'flex': '1 1 auto',
		'box-sizing': 'border-box',
		'overflow-y': 'auto'
	};

	if (showBorder) {
		defaultStyles.border = `1px solid ${colors['$color-black-hex-12']}`;
		defaultStyles.borderBottom = 'none';
	}

	return defaultStyles;
});

const DropArea = styled.div(({ isOver, isDragging }) => {
	if (isOver) {
		return {
			'outline': '2px dashed',
			'outline-offset': '-5px',
			'animation': 'none',
			'outline-color': colors['$color-blue-hex']
		};
	} else if (isDragging) {
		return {
			'animation': '.5s infinite alternate pulsate',
			'outline': '2px dashed',
			'outline-offset': '-5px'
		};
	}

	return {};
});

const validImageTypes = ['image/jpeg', 'image/jpg', 'image/gif', 'image/png'];

const itemDropTarget = {
	drop(props, monitor) {
		const files = monitor.getItem().files || [];

		if (files.length === 1 && validImageTypes.indexOf(files[0].type) !== -1) {
			return;
		}

		props.onDrop(files);
	}
};

class AttachmentsDropArea extends Component {
	render() {
		const {
			connectDropTarget,
			isOver,
			isDragging,
			children,
			showBorder = true,
			...restProps
		} = this.props;

		return connectDropTarget(
			<div {...restProps}>
				<StyledAttachmentsDropArea showBorder={showBorder}>
					<DropArea isOver={isOver} isDragging={isDragging}>
						{children}
					</DropArea>
				</StyledAttachmentsDropArea>
			</div>
		);
	}
}

AttachmentsDropArea.propTypes = {
	connectDropTarget: PropTypes.func.isRequired,
	isOver: PropTypes.bool.isRequired,
	children: PropTypes.node,
	isDragging: PropTypes.bool,
	showBorder: PropTypes.bool
};

export default flow(
	DragLayer((monitor) => {
		return { isDragging: monitor.isDragging() };
	}),
	DropTarget(
		() => NativeTypes.FILE,
		itemDropTarget,
		(connect, monitor) => {
			return {
				connectDropTarget: connect.dropTarget(),
				isOver: monitor.isOver()
			};
		}
	)
)(AttachmentsDropArea);
