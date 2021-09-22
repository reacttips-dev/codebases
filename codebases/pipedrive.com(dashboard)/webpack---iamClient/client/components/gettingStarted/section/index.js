import React, { Component } from 'react';
import PropTypes  from 'prop-types';
import { forEach } from 'lodash';
import DOMPurify from 'dompurify';

import style from './style.css';

export default class Section extends Component {
	appendHeader(parent, header) {
		if (parent) {
			parent.appendChild(header);
		}
	}

	render() {
		const sanitizedHeader = DOMPurify.sanitize(this.props.title, {
			ALLOWED_ATTR: ['target', 'href'],
			RETURN_DOM_FRAGMENT: true,
		});

		const links = sanitizedHeader.querySelectorAll('a');

		forEach(links, (link) => {
			link.classList.add(style.Section__link);
		});

		const el = (
			<div
				ref={(nodeElement) => {
					this.appendHeader(nodeElement, sanitizedHeader);
				}}
			/>
		);

		return (
			<div className={style.Section}>
				<div className={style.Section__title}>
					{el}
				</div>
				{ this.props.children }
			</div>
		);
	}
}

Section.propTypes = {
	title: PropTypes.string,
	children: PropTypes.node.isRequired,
};
