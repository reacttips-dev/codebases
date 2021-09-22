import React, { Component } from 'react';
import PropTypes  from 'prop-types';

export default class Index extends Component {
	componentWillUnmount() {
		if (this.element && this.props.shouldSaveSidebarWidth) {
			const normalizedWidth = parseInt(this.element.parentElement.offsetWidth, 10);

			if (normalizedWidth) {
				this.props.saveSidebarWidth(normalizedWidth);
			}
		}
	}

	render() {
		return (
			<div ref={(element) => {
				this.element = element;
			}}>
				{this.props.children}
			</div>
		);
	}
}

Index.propTypes = {
	saveSidebarWidth: PropTypes.func.isRequired,
	children: PropTypes.node.isRequired,
	shouldSaveSidebarWidth: PropTypes.bool.isRequired,
};
