import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { Popover, Spacing } from '@pipedrive/convention-ui-react';
import { ESC_KEY } from '../../../config/constants';
import { supportedPointerEvents } from '../utils/browser';

class AddPopover extends Component {
	constructor(props) {
		super(props);

		this.handleClick = this.handleClick.bind(this);
		this.handleEsc = this.handleEsc.bind(this);
		this.closePopover = this.closePopover.bind(this);
		this.stopPropagation = this.stopPropagation.bind(this);

		this.popoverElement = React.createRef();
		this.pointerEvents = supportedPointerEvents();
	}

	componentDidMount() {
		document.addEventListener('keydown', this.handleEsc, false);
		document.addEventListener(this.pointerEvents.pointerDown, this.handleClick);
	}

	componentDidUpdate() {
		if (this.popoverElement.current) {
			this.popoverElement.current.removeEventListener(
				this.pointerEvents.pointerDown,
				this.stopPropagation,
			);
			this.popoverElement.current.addEventListener(
				this.pointerEvents.pointerDown,
				this.stopPropagation,
			);
		}
	}

	stopPropagation(event) {
		event.stopPropagation();
	}

	closePopover() {
		if (!this.props.item.get('isRequestPending')) {
			this.props.removeThisItem();
		}
	}

	componentWillUnmount() {
		document.removeEventListener(this.pointerEvents.pointerDown, this.handleClick);
		document.removeEventListener('keydown', this.handleEsc, false);
	}

	handleClick() {
		this.closePopover();
	}

	handleEsc(e) {
		if (e.keyCode === ESC_KEY) {
			this.closePopover();
		}
	}

	render() {
		return (
			<Popover
				visible={this.props.visible}
				placement={this.props.placement || 'right'}
				onClick={this.stopPropagation}
				popperProps={{
					modifiers: {
						preventOverflow: {
							enabled: true,
							boundariesElement: 'scrollParent',
						},
					},
				}}
				content={
					<Spacing>
						<div ref={this.popoverElement}>{this.props.content}</div>
					</Spacing>
				}
			>
				{this.props.children}
			</Popover>
		);
	}
}

AddPopover.propTypes = {
	children: PropTypes.node.isRequired,
	item: ImmutablePropTypes.map.isRequired,
	removeThisItem: PropTypes.func.isRequired,
	content: PropTypes.node,
	placement: PropTypes.string,
	visible: PropTypes.bool,
};

export default AddPopover;
