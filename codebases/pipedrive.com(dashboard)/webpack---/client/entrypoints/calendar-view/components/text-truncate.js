import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { throttle } from 'lodash';
import canvasUtils from '../utils/canvas';

class TextTruncate extends PureComponent {
	constructor(props) {
		super(props);

		this.onResize = throttle(this.onResize.bind(this), 100);
		this.update = this.update.bind(this);
	}

	createCanvas() {
		const canvasElement = canvasUtils.create();
		const style = window.getComputedStyle(this.scope);
		const font = [
			style['font-weight'],
			style['font-style'],
			style['font-size'],
			style['font-family'],
		].join(' ');

		this.canvas = canvasElement.getContext('2d');
		this.canvas.font = font;
	}

	componentDidMount() {
		this.createCanvas();
		this.update();
		window.addEventListener('resize', this.onResize);
	}

	componentDidUpdate(prevProps) {
		const { slotWidth } = this.props;

		if (prevProps.slotWidth !== slotWidth) {
			this.update();
		}
	}

	onResize() {
		if (window.location.pathname.indexOf('/activities') === 0) {
			if (this.rafId) {
				window.cancelAnimationFrame(this.rafId);
			}

			this.rafId = window.requestAnimationFrame(this.update);
		}
	}

	update() {
		this.forceUpdate();
	}

	measureWidth(text) {
		return this.canvas.measureText(text).width;
	}

	/* eslint-disable complexity, max-depth */
	/* prettier-ignore */
	getText() { // NOSONAR
		const { lines, text, beforeSpacing } = this.props;
		const elementWidth = this.scope.getBoundingClientRect().width;
		const textWidth = this.measureWidth(text);

		if (elementWidth === 0) {
			return null;
		}

		if (elementWidth - beforeSpacing >= textWidth) {
			return text;
		}

		const maxTextLength = text.length;
		const maxLoops = 20;

		let line = lines;
		let loops = 0;
		let startPos = 0;
		let currentPos = 1;
		let truncatedText = '';
		let truncatedTextWidth = 0;
		let ellipsis = '';
		let lastIsLetter;

		while (!Number.isNaN(line) && line > 0) {
			line--;

			const lineWidth = line === lines - 1 ? elementWidth - beforeSpacing : elementWidth;

			ellipsis = line === 0 ? '…' : '';

			while (currentPos <= maxTextLength) {
				if (truncatedText[0] === ' ') {
					startPos = startPos + 1;
				}

				truncatedText = text.substr(startPos, currentPos);
				truncatedTextWidth = this.measureWidth(`${truncatedText}${ellipsis}`);

				if (truncatedTextWidth < lineWidth) {
					currentPos++;
					lastIsLetter = text.indexOf(' ', currentPos) !== -1;
				} else {
					/* prettier-ignore */
					do { // NOSONAR
						if (loops >= maxLoops) {
							break;
						}

						loops++;
						truncatedText = text.substr(startPos, currentPos);

						if (!line || truncatedText[truncatedText.length - 1] === ' ') {
							currentPos--;
						}

						if (lastIsLetter) {
							const lastSpaceIndex = truncatedText.lastIndexOf(' ');

							if (lastSpaceIndex > -1) {
								currentPos = lastSpaceIndex;
								truncatedText = text.substr(startPos, currentPos);
							} else {
								currentPos--;
								truncatedText = text.substr(startPos, currentPos);
							}
						} else {
							currentPos--;
							truncatedText = text.substr(startPos, currentPos);
						}

						truncatedTextWidth = this.measureWidth(`${truncatedText}${ellipsis}`);
					} while (truncatedTextWidth > lineWidth && truncatedText.length > 0);

					startPos += currentPos;
					break;
				}
			}

			if (currentPos >= maxTextLength) {
				startPos = maxTextLength;
				break;
			}
		}

		const ellipsisIfNecessary = startPos === maxTextLength ? '' : ellipsis;

		return startPos > 0 ? `${text.substr(0, startPos)}${ellipsisIfNecessary}` : '';
	}

	/* eslint-enable complexity, max-depth */

	componentWillUnmount() {
		window.removeEventListener('resize', this.onResize);

		if (this.rafId) {
			window.cancelAnimationFrame(this.rafId);
		}

		canvasUtils.destroy(this.canvas.canvas);
	}

	render() {
		const { text } = this.props;
		const renderText = this.scope ? this.getText() : text;

		return <div ref={(el) => (this.scope = el)}>{renderText}</div>;
	}
}

TextTruncate.propTypes = {
	text: PropTypes.string.isRequired,
	lines: PropTypes.number.isRequired,
	beforeSpacing: PropTypes.number,
	slotWidth: PropTypes.number,
};

TextTruncate.defaultProps = {
	text: '',
	lines: 1,
};

export default TextTruncate;
