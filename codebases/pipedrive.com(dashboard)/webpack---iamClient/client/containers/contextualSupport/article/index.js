import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { push, goBack } from 'react-router-redux';
import routes from 'constants/contextualSupport/routes';
import { articleActions } from 'actions/contextualSupport';
import * as fullscreenActions from 'actions/fullscreen';
import ArticleComponent from 'components/sidebar/article';
import FetchingComponent from 'components/sidebar/fetching';
import NotFound from 'components/contextualSupport/notFound';
import ArticleFeedback from './articleFeedback';
import intercom from 'utils/intercom';
import { getInfoMessageLink } from 'utils/getInfoMessage';
import urls from 'constants/urls';

export class Article extends Component {
	componentDidMount() {
		if (!this.isProperArticle()) {
			this.props.getArticle(this.props.articleId, this.props.locale);
		}
	}

	componentDidUpdate(prevProps) {
		if (!prevProps.hasFailed && this.props.hasFailed) {
			this.props.goBack();
		}
	}

	isProperArticle() {
		const article = this.props.article;

		if (!article) {
			return false;
		}

		return this.props.articleId === article.articleId || this.props.articleId === article.legacyId;
	}

	openInNewTab() {
		const redirectUrl = `${urls.support}/${this.props.locale}/article/${this.props.article.slug}`;

		window.open(redirectUrl, '_blank', 'noopener,noreferrer');
	}

	render() {
		if (this.props.hasFailed) {
			this.openInNewTab();
		} else if (this.isProperArticle()) {
			if (this.props.clicked) {
				const infoMessageLink = getInfoMessageLink(this.props.articleId);
				const eventProps = { source: 'knowledge_base', link: infoMessageLink };

				this.props.clicked(this.props.articleId, this.props.article.ogTitle, this.props.query, eventProps);
			}

			return (
				<>
					<ArticleComponent
						article={this.props.article}
						expand={this.props.expand}
						openArticle={this.props.openArticle}
						trackExternalLink={this.props.trackExternalLink}
					/>
					<ArticleFeedback />
					<NotFound
						talkToUs={this.props.talkToUs}
						trackExternalLink={this.props.trackExternalLink}
						shallDisplayTalkToUs={intercom.isReady()}
					/>
				</>
			);
		}

		return <FetchingComponent />;
	}
}

Article.propTypes = {
	articleId: PropTypes.number,
	locale: PropTypes.string,
	article: PropTypes.object,
	hasFailed: PropTypes.bool,
	expand: PropTypes.func.isRequired,
	goBack: PropTypes.func.isRequired,
	openArticle: PropTypes.func.isRequired,
	getArticle: PropTypes.func.isRequired,
	clicked: PropTypes.func,
	query: PropTypes.string,
	trackExternalLink: PropTypes.func.isRequired,
	talkToUs: PropTypes.func.isRequired,
};

export const mapStateToProps = (state) => {
	return {
		article: state.support.article.current,
		hasFailed: state.support.article.hasFailed,
	};
};

export const mapDispatchToProps = (dispatch) => {
	return {
		expand: (el) => {
			dispatch(fullscreenActions.show(el));
		},
		goBack: () => {
			dispatch(goBack());
		},
		openArticle: (articleId, locale) => {
			dispatch(push(`${routes.ARTICLE}/${articleId}/${locale}`));
		},
		getArticle: (articleId, locale) => {
			dispatch(articleActions.getArticle(articleId, locale));
		},
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(Article);
