import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import FetchingComponent from 'components/sidebar/fetching';
import Results from 'components/contextualSupport/results';
import { each } from 'lodash';
import { DEFAULT_LANGUAGE } from 'constants/preferences';
import translate from 'containers/translation';

export class Suggestions extends Component {
	render() {
		const localLanguage = this.props.localLanguage;

		const suggestedArticles = [];

		each(this.props.results, (articles, language) => {
			let headerText = this.props.gettext('Suggested articles');

			if (DEFAULT_LANGUAGE !== localLanguage && DEFAULT_LANGUAGE === language) {
				headerText = this.props.gettext('Suggested articles in English');
			}

			if (this.props.results[language].length > 0) {
				suggestedArticles.push(<Results
					gettext={this.props.gettext}
					key={language}
					errors={this.props.error}
					results={articles}
					open={this.props.open}
					localLanguage={localLanguage}
					clicked={this.props.clicked}
					header={headerText}
				/>);
			}
		});

		return (
			this.props.fetching ?
				<FetchingComponent/> :
				<span>{ !!suggestedArticles.length > 0 && <div style={{ marginBottom: '24px' }}>{suggestedArticles}</div> }</span>
		);
	}
}

Suggestions.propTypes = {
	suggest: PropTypes.func.isRequired,
	results: PropTypes.object,
	error: PropTypes.string,
	fetching: PropTypes.bool.isRequired,
	open: PropTypes.func.isRequired,
	clicked: PropTypes.func.isRequired,
	localLanguage: PropTypes.string,
	gettext: PropTypes.func.isRequired,
	trackExternalLink: PropTypes.func.isRequired,
};

export const mapStateToProps = (state) => {
	return {
		fetching: state.support.suggestions.fetching,
		results: state.support.suggestions.results,
		error: state.support.suggestions.error,
		localLanguage: state.user.userLang,
	};
};

export default translate()(connect(mapStateToProps)(Suggestions));
