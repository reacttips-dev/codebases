import React from 'react';
import PropTypes from 'prop-types';
import { compose } from 'recompose';

import { loadingStates } from 'bundles/discussions/constants';
import SearchActions from 'bundles/discussions/actions/DiscussionsSearchActions';
import ListBody from 'bundles/discussions/components/ListBody';
import SearchBar from 'bundles/discussions/components/search/SearchBar';
import SearchResultEntry from 'bundles/discussions/components/search/SearchResultEntry';
import PaginationControls from 'bundles/page/components/PaginationControls';
import path from 'js/lib/path';
import connectToRouter from 'js/lib/connectToRouter';
import connectToStores from 'vendor/cnpm/fluxible.v0-4/addons/connectToStores';
import waitFor from 'js/lib/waitFor';
import { getAllThreadsDiscussionsUrl } from 'bundles/discussions/utils/discussionsUrl';
import routerConnectToCurrentForum from 'bundles/discussions/utils/routerConnectToCurrentForum';
import OnDemandCourseForumsV1 from 'bundles/naptimejs/resources/onDemandCourseForums.v1';
import OnDemandMentorForumsV1 from 'bundles/naptimejs/resources/onDemandMentorForums.v1';
import GroupForumsV1 from 'bundles/naptimejs/resources/groupForums.v1';
import discussionsForumsHOC from 'bundles/discussions/components/discussionsForumsHOC';
import { FormattedMessage } from 'js/lib/coursera.react-intl';
import _t from 'i18n!nls/discussions';
import 'css!./__styles__/SearchResults';
import 'css!bundles/page/components/__styles__/PaginationControls';

type searchResult = {
  createdAt: number;
  creatorId: number;
  id: string;
  courseForumQuestionId: string;
  title: string;
  questionId: string;
};

type PropsFromStores = {
  numResults?: number;
  loadingState: keyof typeof loadingStates;
  pageCount?: number;
  currentResults: Array<searchResult>;
  filterQueryString?: string;
};

type PropsFromCaller = {
  currentForum: OnDemandCourseForumsV1 | OnDemandMentorForumsV1 | GroupForumsV1;
  query: string;
  pathname: string;
  page: number;
  rootPath?: string;
  currentForumUrl?: string;
  hasModerationRole?: boolean;
  contextId?: string;
};

type State = {
  query: string;
};

type PropsToComponent = PropsFromCaller & PropsFromStores;

class SearchResults extends React.Component<PropsToComponent, State> {
  static contextTypes = {
    executeAction: PropTypes.func.isRequired,
    router: PropTypes.object.isRequired,
  };

  constructor(props, context) {
    super(props, context);

    // Setting initial state for initial display in input
    this.state = {
      query: props.query || '',
    };

    if (props.query) {
      const { executeAction } = this.context;
      executeAction(SearchActions.search, {
        query: props.query,
        filterQueryString: props.filterQueryString,
        pageNum: props.page,
        forumId: props.currentForum.forumId,
        contextId: props.contextId,
        forumType: props.currentForum.forumType.typeName,
        reset: true,
        includeDeleted: props.hasModerationRole,
      });
    }
  }

  componentWillReceiveProps(nextProps: PropsToComponent) {
    // TODO(lewis): Figure out if there is a way to do without this since it's
    // fragile to have to define componentWillReceiveProps to determine whether
    // or not we fire off an expensive search action.
    const { query, pathname, currentForum, filterQueryString, page } = this.props;
    const { executeAction } = this.context;
    if (
      nextProps.query !== query ||
      nextProps.pathname !== pathname ||
      nextProps.currentForum.id !== currentForum.id ||
      nextProps.filterQueryString !== filterQueryString
    ) {
      this.setState({ query: nextProps.query });
      executeAction(SearchActions.search, {
        query: nextProps.query,
        filterQueryString: nextProps.filterQueryString,
        pageNum: page,
        forumId: nextProps.currentForum.forumId,
        contextId: nextProps.contextId,
        forumType: nextProps.currentForum.forumType.typeName,
        reset: filterQueryString !== nextProps.filterQueryString,
        includeDeleted: nextProps.hasModerationRole,
      });
    }
  }

  handleQueryChange = (newQuery) => {
    this.setState({ query: newQuery });
  };

  handleSearchCourse = (e) => {
    const { query } = this.state;
    const { rootPath } = this.props;
    const { router } = this.context;
    e.preventDefault();
    const link = path.join(rootPath ?? [], 'discussions/all');
    router.push({
      pathname: link,
      params: {},
      query: { q: query },
    });
  };

  onPageChange = (page) => {
    const { query, currentForum, contextId, hasModerationRole } = this.props;
    const { router, executeAction } = this.context;

    router.push({
      pathname: router.location.pathname,
      params: {},
      query: Object.assign(router.location.query, { page }),
    });

    executeAction(SearchActions.goToPage, {
      query,
      pageNum: page,
      filterQueryString: this.props.filterQueryString,
      forumId: currentForum.forumId,
      contextId,
      forumType: currentForum.forumType.typeName,
      includeDeleted: hasModerationRole,
    });
  };

  submitSearch = () => {
    const { query } = this.state;
    const { router } = this.context;

    if (query) {
      const queryString = query.replace('*', '');
      router.push({
        pathname: window.location.pathname,
        params: {},
        query: { q: queryString },
      });
    }
  };

  navigateBack = (e) => {
    const { router } = this.context;
    const { currentForumUrl } = this.props;

    e.preventDefault();
    router.push(currentForumUrl);
  };

  render() {
    const {
      currentForum,
      currentForumUrl,
      loadingState,
      numResults,
      currentResults,
      page,
      pageCount,
      query,
    } = this.props;
    const { query: currentQuery } = this.state;
    const { router } = this.context;
    const inAllDiscussions = router.isActive({
      pathname: getAllThreadsDiscussionsUrl(),
    });
    const inItemView = !!router.params.item_id;
    const showSearchCourseLink = !inAllDiscussions && !inItemView;
    const displayName = currentForum.title;
    const forumLink = currentForumUrl;
    const searchResultsText =
      loadingState === loadingStates.DONE
        ? _t('#{numResults} search results in #{displayName}', { numResults, displayName })
        : _t('Finding search results in #{displayName}', { displayName });

    let entries;
    const searchCourseLink = (
      <button onClick={this.handleSearchCourse} className="nostyle search-course-link button-link" type="button">
        {_t('Search All Discussions')}
      </button>
    );

    const resultsMetadata = (
      <div className="results-metadata bgcolor-black-g1">
        <span className="color-secondary-text" aria-live="polite">
          {/* Took out the FormattedMessage component and opted to manually handle plurals because the search results
          weren't being properly announced for users using Firefox + NVDA. More info here  https://coursera.atlassian.net/browse/ACCESS-568 */}
          {loadingState === loadingStates.DONE ? (
            <span>{searchResultsText}</span>
          ) : (
            <FormattedMessage message={_t('Finding search results in {displayName}')} displayName={displayName} />
          )}
          {showSearchCourseLink && ' • '}
          {showSearchCourseLink && searchCourseLink}
        </span>
      </div>
    );

    if (loadingState === loadingStates.DONE && currentResults.length > 0) {
      entries = currentResults.map((entry, i) => {
        return (
          <SearchResultEntry
            key={entry.id}
            index={i}
            entry={{ ...entry, forumId: currentForum?.forumId }}
            page={page}
            query={query}
            forumLink={forumLink}
          />
        );
      });
    }

    return (
      <div className="rc-DiscussionsSearchResults">
        <div className="results-container card-rich-interaction">
          {!inAllDiscussions && (
            <div className="bgcolor-black-g1">
              <button onClick={this.navigateBack} className="nostyle back-area button-link" type="button">
                <div className="back-arrow">
                  <i className="cif-arrow-left back-arrow-image" />
                </div>
                <span className="back-label body-2-text">{_t('Back to #{displayName}', { displayName })}</span>
              </button>
            </div>
          )}
          {!inAllDiscussions && (
            <SearchBar query={currentQuery} handleSubmit={this.submitSearch} handleChange={this.handleQueryChange} />
          )}

          {!inAllDiscussions && resultsMetadata}

          <ListBody loadingState={loadingState}>{entries}</ListBody>
        </div>

        {/* @ts-expect-error ts-migrate(2322) FIXME: Type '{ onPageChange: (page: any) => void; pageCou... Remove this comment to see the full error message */}
        <PaginationControls onPageChange={this.onPageChange} pageCount={pageCount} currentPage={page} maxPages={5} />
      </div>
    );
  }
}

export default compose<PropsToComponent, PropsFromCaller>(
  connectToRouter((router) => ({
    query: decodeURIComponent(router.location.query.q),
    pathname: router.location.pathname,
  })),
  discussionsForumsHOC({ fields: ['title', 'link', 'forumType'] }),
  connectToRouter(routerConnectToCurrentForum),
  connectToStores<PropsToComponent, PropsFromCaller>(
    ['DiscussionsSearchStore', 'SessionFilterStore'],
    ({ DiscussionsSearchStore, SessionFilterStore }, props) => {
      const id = props.currentForum.forumId;
      return {
        filterQueryString: SessionFilterStore.activeFilterQueryString,
        currentResults: DiscussionsSearchStore.searchResults({
          forumId: id,
          query: props.query,
          pageNum: DiscussionsSearchStore.currentPage,
        }),
        loadingState: DiscussionsSearchStore.loadingState,
        pageCount: DiscussionsSearchStore.getPageCount({
          forumId: id,
          query: props.query,
        }),
        numResults: DiscussionsSearchStore.getNumResults({
          forumId: id,
          query: props.query,
        }),
      };
    }
  ),
  // make sure that we have a forum to search in
  waitFor((props) => props.currentForum)
)(SearchResults);
