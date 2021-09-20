import { compose, withProps } from 'recompose';

import ClassroomPropTypes from 'components/prop-types';
import NoResults from './_no-results';
import PropTypes from 'prop-types';
import SearchForm from './_search-form';
import SearchLoadingWrapper from './_search-loading-wrapper';
import SearchResults from './_search-results';
import Welcome from './_welcome';
import styles from './_layout.scss';

const SEARCH_TERM_LENGTH_THRESHOLD = 0;

@cssModule(styles)
export class Layout extends React.Component {
  static displayName = 'search/_layout';
  static propTypes = {
    root: ClassroomPropTypes.node.isRequired,
    onSearch: PropTypes.func.isRequired,
    recentSearches: PropTypes.array.isRequired,
    setRecentSearches: PropTypes.func.isRequired,
    onNavigate: PropTypes.func.isRequired,
    trackSearchFlow: PropTypes.func.isRequired,

    //recompose
    eligiblePartKeys: PropTypes.arrayOf(PropTypes.string),
  };

  state = {
    results: null,
    totalResults: null,
    searchTerm: '',
    isLoading: false,
  };

  componentDidMount() {
    this._isMounted = true;
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  updateRecentSearches(newTerm) {
    const { recentSearches, setRecentSearches } = this.props;
    const updatedSearches = _.chain([newTerm, ...recentSearches])
      .uniqBy(_.lowerCase)
      .take(5)
      .value();
    setRecentSearches(updatedSearches);
  }

  handleSearch = async (searchTerm) => {
    const { onSearch, root, trackSearchFlow, eligiblePartKeys } = this.props;

    if (_.get(searchTerm, 'length', 0) > SEARCH_TERM_LENGTH_THRESHOLD) {
      this.setState({
        isLoading: true,
      });
      const {
        results,
        search_metadata: { total_results: totalResults },
      } = await onSearch({
        term: searchTerm,
        root,
        partKeys: eligiblePartKeys,
      });

      trackSearchFlow('Classroom Searched', {
        search_query: searchTerm,
      });

      this.updateRecentSearches(searchTerm);

      if (this._isMounted) {
        this.setState({ results, totalResults, isLoading: false });
      }
    } else {
      this.setState({
        totalResults: null,
        results: null,
      });
    }
  };

  handleSearchTermChange = (searchTerm) => {
    this.setState({
      searchTerm,
    });
  };

  handleRecentSearchClick = (recentTerm) => {
    this.handleSearchTermChange(recentTerm);
    this.handleSearch(recentTerm);
  };

  handleNavigation = () => {
    const { trackSearchFlow, onNavigate } = this.props;
    // TODO: (dcwither) merge with @vliang's code to get this from state
    const { searchTerm = null } = this.state;

    trackSearchFlow('Search Result Clicked', {
      search_query: searchTerm,
    });
    onNavigate();
  };

  renderResults() {
    const { totalResults, results } = this.state;
    const { recentSearches, root } = this.props;

    switch (totalResults) {
      case null:
        return (
          <Welcome
            nanodegree={root}
            onRecentSearchClick={this.handleRecentSearchClick}
            recentSearches={recentSearches}
          />
        );
      case 0:
        return <NoResults nanodegree={root} />;
      default:
        return (
          <SearchResults
            parts={root.parts}
            results={results}
            totalResults={totalResults}
            onNavigate={this.handleNavigation}
          />
        );
    }
  }

  render() {
    const { root } = this.props;
    const { searchTerm, isLoading } = this.state;

    return (
      <div styleName="layout">
        <div styleName="header">
          <div styleName="header-contents">
            <h1 styleName="title">{root.title}</h1>
            <SearchForm
              value={searchTerm}
              onSearch={this.handleSearch}
              onChange={this.handleSearchTermChange}
            />
          </div>
        </div>
        <div styleName="body">
          <SearchLoadingWrapper delay={200} isLoading={isLoading}>
            {this.renderResults()}
          </SearchLoadingWrapper>
        </div>
      </div>
    );
  }
}

export default compose(
  withProps(({ root }) => ({
    eligiblePartKeys: _.chain(_.get(root, 'parts')).map('key').value(),
  }))
)(Layout);
