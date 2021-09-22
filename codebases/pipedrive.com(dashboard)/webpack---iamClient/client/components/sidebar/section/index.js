import React, { Component } from 'react';
import PropTypes from 'prop-types';

import style from './style.css';

export default class Section extends Component {
	componentDidUpdate() {
		this.setScrollTop(0);
	}

	setScrollTop(offset) {
		this.el.scrollTop = offset;
	}

	render() {
		const classes = [style.Section];

		let width;

		if (this.props.scrollable) {
			classes.push(style['Section--scrollable']);
		}

		if (this.props.width) {
			width = this.props.width === 'auto' ? 'auto' : `${this.props.width}px`;
		} else {
			classes.push(style['Section--staticWidth']);
		}

		if (this.props.contentOffset) {
			classes.push(style['Section--contentOffset']);
		}

		return (
			<div
				className={classes.join(' ')}
				style={width ? { width } : { width: '' }}
				ref={(el) => {
					if (el) {
						this.el = el;
					}
				}}
			>
				<Context.Provider value={this.el}>
					{this.props.children}
				</Context.Provider>
			</div >
		);
	}
}

Section.propTypes = {
	children: PropTypes.node.isRequired,
	scrollable: PropTypes.bool,
	contentOffset: PropTypes.bool,
	width: PropTypes.oneOfType([
		PropTypes.string,
		PropTypes.number,
	]),
};

export const Context = React.createContext();
