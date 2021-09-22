import React, { Component } from 'react';
import PropTypes from 'prop-types';
import DOMPurify from 'dompurify';
import OpenInKbLink from './openInKbLink';
import { forEach } from 'lodash';
import { Context } from 'components/sidebar/section';
import VidyardEmbed from '@vidyard/embed-code';
import urls from 'constants/urls';

import style from './style.css';

export default class Article extends Component {
	constructor(props) {
		super(props);

		this.onClick = this.onClick.bind(this);
		this.source = 'support';
	}
	static contextType = Context;

	componentDidMount() {
		// swap placeholder images with videos
		VidyardEmbed.api.renderDOMPlayers();
	}

	onClick(event) {
		const element = event.target;

		if (element.tagName === 'IMG') {
			this.props.expand({
				tagName: element.tagName,
				src: element.src,
			});
		} else if (element.tagName === 'A' && element.getAttribute('data-type') === 'zendeskArticle') {
			event.preventDefault();

			const zendeskId = element.getAttribute('data-zendesk-id');
			const normalizedZendeskId = parseInt(zendeskId, 10);
			const language = element.getAttribute('data-language');

			this.props.openArticle(normalizedZendeskId, language, this.source);
		} else if (element.tagName === 'A' && element.getAttribute('href').substring(0, 4) === 'http') {
			element.setAttribute('target', '_blank');
		}
	}

	appendArticle(parent, article) {
		if (parent) {
			parent.appendChild(article);
		}
	}

	render() {
		const sanitizedBody = DOMPurify.sanitize(this.props.article.body, {
			RETURN_DOM_FRAGMENT: true,
		});

		const imageNodes = sanitizedBody.querySelectorAll('img');

		forEach(imageNodes, (imgNode) => {
			if (/play\.vidyard\.com/.test(imgNode.src)) {
				const videoUUID = imgNode.src.match(/(https:\/\/play\.vidyard\.com\/)([\S]+)(\.jpg)/)[2];

				// add needed attributes as per documentation: https://www.npmjs.com/package/@vidyard/embed-code
				imgNode.setAttribute('class', 'vidyard-player-embed');
				imgNode.setAttribute('data-uuid', videoUUID);
				imgNode.setAttribute('data-v', '4');
				imgNode.setAttribute('data-type', 'inline');
			} else if (imgNode.hasAttribute('width') && imgNode.hasAttribute('height')) {
				imgNode.removeAttribute('height');
			}
		});

		const hashLinks = sanitizedBody.querySelectorAll('a[href^="#"]');

		forEach(hashLinks, (hashLink) => {
			hashLink.addEventListener('click', (event) => {
				event.preventDefault(); // do not add hash to url

				const targetName = hashLink.hash.slice(1);
				const targetNode = document.querySelector(`[name=${targetName}]`);

				this.context.scrollTop = targetNode.offsetTop - this.context.offsetTop;
			});
		});

		const el = (
			<div
				className={style.Article__content}
				ref={(nodeElement) => {
					this.appendArticle(nodeElement, sanitizedBody);
				}} onClick={this.onClick}
			/>
		);

		return (
			<div className={style.Article}>
				{
					this.props.children ?
						<div className={style.Article__children}>{this.props.children}</div> :
						<div className={style.Article__header}>{this.props.article.title}</div>
				}

				<OpenInKbLink
					url={`${urls.support}/${this.props.article.locale}/article/${this.props.article.slug}`}
					trackExternalLink={this.props.trackExternalLink}
				/>

				{el}
			</div>
		);
	}
}

Article.propTypes = {
	article: PropTypes.object.isRequired,
	expand: PropTypes.func.isRequired,
	openArticle: PropTypes.func.isRequired,
	children: PropTypes.object,
	trackExternalLink: PropTypes.func.isRequired,
};

Article.contextType = Context;
