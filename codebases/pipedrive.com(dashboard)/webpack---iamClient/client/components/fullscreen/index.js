import React, { Component } from 'react';
import PropTypes from 'prop-types';
import style from './style.css';
import { Icon } from '@pipedrive/convention-ui-react';

export default class Fullscreen extends Component {
	constructor(props) {
		super(props);
		this.setBoundaries = this.setBoundaries.bind(this);
		this.state = {
			boundaries: {},
		};
	}

	setBoundaries(width, height) {
		const invalidValue = typeof width !== 'number' || typeof height !== 'number' || isNaN(width) || isNaN(height);
		const notChanged = this.maxHeight === height && this.maxWidth === width;

		if (invalidValue || notChanged) {
			return;
		}

		// Required for synchronous check to prevent multiple asynchronous `setState` calls
		this.maxWidth = width;
		this.maxHeight = height;

		this.setState({
			boundaries: {
				maxWidth: width,
				maxHeight: height,
			},
		});
	}

	render() {
		if (!this.props.content) {
			return null;
		}

		let el;

		if (this.props.content.tagName === 'IMG') {
			el = <img
				className={style.Fullscreen__image}
				src={this.props.content.src}
				style={this.state.boundaries}
				onClick={(e) => e.stopPropagation()}
			/>;
		}

		if (this.props.content.tagName === 'IFRAME') {
			el = <iframe
				className={style.Fullscreen__video}
				height={this.props.content.height}
				width={this.props.content.width}
				src={this.props.content.src}
				onClick={(e) => e.stopPropagation()}
			/>;
		}

		return (
			<div className={style.Fullscreen} onClick={this.props.close} ref={(element) => {
				if (!element) {
					return;
				}

				const style = element.currentStyle || window.getComputedStyle(element);
				const width = element.clientWidth - parseFloat(style.paddingLeft) - parseFloat(style.paddingRight);
				const height = element.clientHeight - parseFloat(style.paddingTop) - parseFloat(style.paddingBottom);

				this.setBoundaries(width, height);
			}}>
				<div className={style.Fullscreen__content}>
					{el}
					<div className={style.Fullscreen__close}>
						<Icon icon="cross" color="white"/>
					</div>
				</div>
			</div>
		);
	}
}

Fullscreen.propTypes = {
	content: PropTypes.any,
	close: PropTypes.func.isRequired,
};
