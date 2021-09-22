import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { articleActions } from 'actions/contextualSupport';
import ArticleFeedbackForm from 'components/contextualSupport/articleFeedbackForm';

export class ArticleFeedback extends Component {
	constructor(props) {
		super(props);
		this.handleFeedbackVote = this.handleFeedbackVote.bind(this);
		this.handleFeedbackSubmit = this.handleFeedbackSubmit.bind(this);
	}

	handleFeedbackVote(isPositive) {
		const { articleId, title } = this.props.article;

		this.props.trackArticleVote(articleId, title, isPositive);
	}

	handleFeedbackSubmit(message, isPositive, canContactUser) {
		const { articleId, title: articleTitle } = this.props.article;
		const feedbackData = {
			articleId,
			articleTitle,
			isPositive,
			message,
			url: window.location.href,
			canContactUser,
		};

		this.props.sendArticleFeedback(feedbackData);
	}

	render() {
		return (
			<ArticleFeedbackForm
				onVote={this.handleFeedbackVote}
				onSubmit={this.handleFeedbackSubmit}
				isSubmitting={this.props.isSendingFeedback}
				submitted={this.props.feedbackSent}
				failed={this.props.feedbackFailed}
			/>
		);
	}
}

ArticleFeedback.propTypes = {
	article: PropTypes.object,
	trackArticleVote: PropTypes.func.isRequired,
	sendArticleFeedback: PropTypes.func.isRequired,
	isSendingFeedback: PropTypes.bool.isRequired,
	feedbackSent: PropTypes.bool.isRequired,
	feedbackFailed: PropTypes.bool.isRequired,
};

export const mapStateToProps = (state) => {
	return {
		article: state.support.article.current,
		isSendingFeedback: state.support.articleFeedback.fetching,
		feedbackSent: state.support.articleFeedback.sent,
		feedbackFailed: state.support.articleFeedback.failed,
	};
};

export const mapDispatchToProps = (dispatch) => {
	return {
		trackArticleVote: (id, title, isPositive) => {
			dispatch(articleActions.trackArticleVote(id, title, isPositive));
		},
		sendArticleFeedback: (feedbackData) => {
			dispatch(articleActions.sendArticleFeedback(feedbackData));
		},
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(ArticleFeedback);
