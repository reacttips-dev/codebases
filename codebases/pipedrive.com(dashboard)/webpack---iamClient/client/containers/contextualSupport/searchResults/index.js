import React, { Component } from 'react';
import PropTypes  from 'prop-types';
import { connect } from 'react-redux';
import { Redirect } from 'react-router';
import Results from 'components/contextualSupport/results';
import routes from 'constants/contextualSupport/routes';
import { isEmpty } from 'lodash';
import translate from 'containers/translation';
import SearchError from 'components/contextualSupport/searchError';

export class SearchResults extends Component {
	constructor(props) {
		super(props);
	}

	render() {
		if (!this.isSearchSucceeded()) {
			return <SearchError talkToUs={this.props.talkToUs} />;
		}

		if (!this.hasSearchResults()) {
			return <Redirect to={routes.NOTHING_FOUND}/>;
		}

		const searchResultsList = this.buildResultsList();

		return (
			<div>
				{searchResultsList}
			</div>
		);
	}

	hasSearchResults() {
		return this.isSearchSucceeded() && !isEmpty(this.props.results);
	}

	isSearchSucceeded() {
		return this.props.results && !this.props.error;
	}

	buildResultsList() {
		const resultsList = [];
		const headerText = this.props.gettext(`Search results (${this.props.results.length})`);

		if (this.props.results.length > 0) {
			resultsList.push(<Results
				gettext={this.props.gettext}
				key="articles"
				errors={this.props.error}
				results={this.props.results}
				open={this.props.open}
				clicked={this.props.clicked}
				highlight={this.props.searchQuery}
				header={headerText}
				query={this.props.searchQuery}
				locale={this.props.locale}
				localLanguage={this.props.localLanguage}
			/>);
		}

		return resultsList;
	}
}

SearchResults.propTypes = {
	results: PropTypes.array,
	error: PropTypes.string,
	isSearching: PropTypes.bool.isRequired,
	searchQuery: PropTypes.string,
	open: PropTypes.func.isRequired,
	clicked: PropTypes.func.isRequired,
	localLanguage: PropTypes.string,
	locale: PropTypes.string,
	gettext: PropTypes.func.isRequired,
	trackExternalLink: PropTypes.func.isRequired,
	talkToUs: PropTypes.func,
	isInfoMessageShown: PropTypes.bool,
};

export const mapStateToProps = (state) => {
	return {
		results: state.support.search.results,
		error: state.support.search.error,
		isSearching: state.support.search.fetching,
		searchQuery: state.support.search.query,
		localLanguage: state.user.userLang,
		locale: state.user.userLocale,
	};
};

export default translate()(connect(mapStateToProps)(SearchResults));
