import React, { Component } from 'react';
import PropTypes  from 'prop-types';
import { connect } from 'react-redux';
import * as fullscreenActions from 'actions/fullscreen';
import ArticleComponent from 'components/sidebar/article';
import FetchingComponent from 'components/sidebar/fetching';
import ArticleHeaderComponent from 'components/gettingStarted/articleHeader';

export class Article extends Component {
	componentDidMount() {
		const article = this.props.article;

		if (article && (article.articleId !== this.props.articleId)) {
			this.props.openArticle(this.props.articleId);
		}
	}

	render() {
		if (!this.props.article) {
			return <FetchingComponent/>;
		}

		let articleHeader;

		if (this.props.articleSummary) {
			articleHeader = <ArticleHeaderComponent
				title={this.props.articleSummary.title}
				subtitle={this.props.articleSummary.subtitle}
			/>;
		}

		return (
			<ArticleComponent article={this.props.article} openArticle={this.props.openArticle} expand={this.props.expand}>
				{ articleHeader }
			</ArticleComponent>
		);
	}
}

Article.propTypes = {
	articleId: PropTypes.number.isRequired,
	article: PropTypes.object,
	openArticle: PropTypes.func.isRequired,
	expand: PropTypes.func.isRequired,
	articleSummary: PropTypes.object,
};

export const mapStateToProps = (state) => {
	return {
		article: state.gettingStarted.current,
	};
};

export const mapDispatchToProps = (dispatch) => {
	return {
		expand: (el) => {
			dispatch(fullscreenActions.show(el));
		},
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(Article);
