import React from 'react';
import classnames from 'classnames';
import { Icon, IllustrationCheckInternetConnection, IllustrationInternalServerError, IllustrationSearch } from '@postman/aether';
import SearchBoxInput from './SearchInput';
import Badge from './Badge';
import SearchService from '../services/SearchService';
import SearchStore from '../../js/stores/SearchStore';
import util from '../utils/index';
import searchUtil from '../utils/searchUtil';
import NavigationService from '../../js/services/NavigationService';
import AnalyticsService from '../../js/modules/services/AnalyticsService';
import uuid from 'uuid/v4';
import Link from '../../appsdk/components/link/Link';
import { checkContextAndNavigate } from '../../appsdk/utils/NavigationUtils';
import { openPublicProfile } from '../utils/commons';
import { when, autorun } from 'mobx';
import { RECENT_SEARCH_VERSION, ENABLE_CROSS_RANK } from '../constants';
import { getUrlParts } from '../../js/utils/NavigationUtil';
import MobileSearchBox from './MobileSearchBox';
import CurrentUserDetailsService from '../../js/services/CurrentUserDetailsService';
import { isHomePageActive } from '../../onboarding/src/features/Homepage/utils';
import { getStringifiedQueryParams } from '../../js/common/utils/url';
import { withLDConsumer } from 'launchdarkly-react-client-sdk';
import ScratchpadService from '../../js/services/ScratchpadService';

const queryIndexMap = {
  workspace: 'collaboration.workspace',
  api: 'adp.api',
  collection: 'runtime.collection',
  team: 'apinetwork.team',
  user: 'apinetwork.user'
},
      iconMap = {
        collection: 'icon-entity-collection-stroke',
        folder: 'icon-entity-folder-stroke',
        request: 'icon-entity-request-stroke',
        example: 'icon-entity-example-stroke',
        workspace: 'icon-entity-workspaces-stroke',
        api: 'icon-entity-api-stroke',
        team: 'icon-descriptive-team-stroke',
        user: 'icon-descriptive-user-stroke',
        publicElement: 'icon-state-published-stroke'
      },
      typeFilters = [
        { label: 'Workspaces', icon: iconMap.workspace, action: 'workspace', placeholder: 'workspaces' },
        { label: 'Collections', icon: iconMap.collection, action: 'collection', placeholder: 'collections' },
        { label: 'APIs', icon: iconMap.api, action: 'api', placeholder: 'APIs' },
        { label: 'Teams', icon: iconMap.team, action: 'team', placeholder: 'teams' }

        // { label: 'Users', icon: iconMap.user, action: 'user' }
      ],
      documentTypeMapping = {
        api: 'API',
        collection: 'collection',
        team: 'team',
        workspace: 'workspace'
      },
      DEBOUNCE_INTERVAL = 200;

const AnalyticsConstants = { MOUSE: 0, KEYBOARD: 1, OTHER: 2 },
      MIN_QUERY_LENGTH = 1;

/**
 * Returns the Universal Search component
 */
class SearchBox extends React.Component {
  constructor (props) {
    super(props);

    let searchParamObject = new URLSearchParams(window.location.search);

    this.state = {
      isPopupOpen: false,
      loading: false,
      searchQuery: searchParamObject.get('q') || '',
      searchResults: {},
      teamResults: [],
      searchResultsCount: {},
      focusedListItem: '',
      isSearchBoxFocused: false,
      activeScope: 'public',
      activeType: 'all',
      showFilterMenu: false,
      error: false,
      errorType: '',
      showTypeFilters: true,
      hideSearchResults: false,
      recentSearches: []
    };

    this.keystrokes = 0;
    this.traceId = '';
    this.initiateMode = '';
    this.reactionDisposers = [];
    this.getSearchData = _.debounce(this.getSearchData.bind(this), DEBOUNCE_INTERVAL);
    this.handleChange = this.handleChange.bind(this);
    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.handleEntityRedirection = this.handleEntityRedirection.bind(this);
    this.getPopupLoader = this.getPopupLoader.bind(this);
    this.handleListKeyDown = this.handleListKeyDown.bind(this);
    this.handleListMouseEnter = this.handleListMouseEnter.bind(this);
    this.handleListMouseLeave = this.handleListMouseLeave.bind(this),
    this.handleBlur = this.handleBlur.bind(this),
    this.handleFocus = this.handleFocus.bind(this),
    this.handleCancel = this.handleCancel.bind(this),
    this.handleEscape = this.handleEscape.bind(this),
    this.handleTypeFilterDropdown = this.handleTypeFilterDropdown.bind(this),
    this.handleScopeChange = this.handleScopeChange.bind(this),
    this.handleTypeChange = this.handleTypeChange.bind(this),
    this.initiateUniversalSearchFocus = this.initiateUniversalSearchFocus.bind(this),
    this.inputRef = React.createRef();
    this.searchBoxRef = React.createRef();
    this.searchListRef = React.createRef();
    this.popupRef = React.createRef();
    this.currentUser = CurrentUserDetailsService.getCurrentUserDetails(),

    // this.teamName = globalUtil.getTeamName(this.currentUser);
    this.property = '';
    this.handleSearchPageRedirect = this.handleSearchPageRedirect.bind(this);
    this.getSearchResultEntity = this.getSearchResultEntity.bind(this);
    this.getErrorPopup = this.getErrorPopup.bind(this);
    this.shouldDisplayViewAllFor = this.shouldDisplayViewAllFor.bind(this);
    this.handleScroll = this.handleScroll.bind(this);
    this.handleMouseOver = this.handleMouseOver.bind(this);
    this.recentSearchesReactionDisposer = null;
    this.propertyReactionDisposer = null;
    this.isTraceIdConsumedForRecentSearch = false;
    this.handleScopeFilterAnalytics = this.handleScopeFilterAnalytics.bind(this);
    this.constructLinkUrl = this.constructLinkUrl.bind(this);
  }

  componentDidMount () {
    pm.mediator.on('universalSearchFocus', this.initiateUniversalSearchFocus);

    window.addEventListener('universalSearchFocus', this.initiateUniversalSearchFocus);

    this.inputRef.current.handleEscape = (e) => {
      e.preventDefault();
      e.stopPropagation();
      this.handleEscape();
    };

    this.property = _.get(NavigationService.getRoutesForURL(NavigationService.getCurrentURL()), '0.name', '').split('.')[0];

    this.reactionDisposers.push(when(
      () => CurrentUserDetailsService.getCurrentUserDetails().isLoggedIn,
      () => {
        const currentUser = CurrentUserDetailsService.getCurrentUserDetails();

        if (!['personal', 'team'].includes(this.state.activeScope) && (!currentUser.isLoggedIn || this.state.searchQuery.length > 0 || this.state.isSearchBoxFocused)) {
        // Do not auto change scope when:
        // 1. Search query is non empty
        // 2. Search box is opened
        // 3. User is not logged in (added this to keep scope public)
        // ---
        // Allow auto change scope when:
        // 1. Transitioning from team or personal scope
          return;
        }

        this.handleScopeChange('all');
      }));
  }

  componentWillUnmount () {
    pm.mediator.off('universalSearchFocus', this.initiateUniversalSearchFocus);
    window.removeEventListener('universalSearchFocus', this.initiateUniversalSearchFocus);
    this.reactionDisposers.forEach((disposer) => disposer());
  }

  getSearchDataRequestBody (indexConfig = []) {
    const { searchQuery, activeType, activeScope } = this.state,
          requestBody = {
            queryText: searchQuery,
            from: 0,
            size: ENABLE_CROSS_RANK ? 10 : 3,
            mergeEntities: ENABLE_CROSS_RANK,
            nested: true,
            clientTraceId: this.traceId
          };

    if (activeScope !== 'all') {
      requestBody.domain = activeScope;
    }

    if (activeType !== 'all') {
      requestBody.size = 10;
      requestBody.mergeEntities = false;
      requestBody.queryIndices = [queryIndexMap[activeType]];
    } else if (indexConfig.length > 0 && activeType === 'all') {
      requestBody.queryIndices = indexConfig.map((queryIndex) => queryIndexMap[queryIndex]);
      if (indexConfig.length > 1) {
        requestBody.size = 10;
      } else {
        requestBody.size = 2;
      }
    }

    const path = NavigationService.getRoutesForURL(NavigationService.getCurrentURL()),
          open_tab = _.get(path, '0.name', '').split('.')[0];

    if (open_tab === 'workspace') {
      requestBody.workspace = _.get(path, '0.routeParams.wid');
      if (path.length === 2) {
        switch (path[1].name.split('.')[1]) {
          case 'collection':
            requestBody.collectionId = _.get(path, '1.routeParams.cid', '').split('?')[0];
            break;
          case 'folder':
            requestBody.folderId = _.get(path, '1.routeParams.fid', '').split('?')[0];
            break;
          case 'request':
            requestBody.requestId = _.get(path, '1.routeParams.rid', '').split('?')[0];
            break;
          case 'environment':
            requestBody.enviromentId = _.get(path, '1.routeParams.eid', '').split('?')[0];
            break;
          case 'api':
            requestBody.apiId = _.get(path, '1.routeParams.apiId', '').split('?')[0];
            break;
          case 'monitor':
            requestBody.monitorId = _.get(path, '1.routeParams.monitorId', '').split('?')[0];
            break;
          case 'mock':
            requestBody.mockId = _.get(path, '1.routeParams.mockId', '').split('?')[0];
            break;
        }
      }
    }

    return requestBody;
  }

  initiateUniversalSearchFocus () {
    this.initiateMode = 'keyboard';
    this.inputRef.current.focus();
    this.inputRef.current.select();
  }

  getSearchData () {
    const { searchQuery, activeType, activeScope } = this.state;

    if (searchQuery.length < MIN_QUERY_LENGTH) {
      return;
    }

    let promiseArray = [],
        indexConfig = ['workspace', 'api', 'collection'],
        teamIndexConfig = ['team'];

    promiseArray.push(SearchService.getCrossRankedSearchData(this.getSearchDataRequestBody(indexConfig)));

    if (activeType === 'all') {
      promiseArray.push(SearchService.getCrossRankedSearchData(this.getSearchDataRequestBody(teamIndexConfig)));
      promiseArray.push(SearchService.getSearchCount({ queryText: searchQuery, domain: activeScope === 'all' ? undefined : activeScope }));
    }

    AnalyticsService.addEventV2AndPublish({
      category: `search-${this.state.activeScope}`,
      property: this.property,
      label: searchQuery,
      action: 'query',
      traceId: this.traceId,
      type: activeType,
      teamId: _.get(CurrentUserDetailsService.getCurrentUserDetails(), 'teamId')
    });

    Promise.all(promiseArray).then(([searchResultResponse, teamResultResponse, countResponse]) => {
      if (searchResultResponse.errorType === 'queryTextLimitExceeded') {
        return this.setState({ error: true, errorType: 'query-text-exceeded-limit', loading: false, searchResults: {} });
      }

      let resultCount = 0;

      if (!ENABLE_CROSS_RANK) {
        searchResultResponse.data = _.omit(searchResultResponse.data, ['user']);
      }

      if (searchQuery && _.get(searchResultResponse, 'meta.queryText') === this.state.searchQuery) {
        if (ENABLE_CROSS_RANK) {
          for (let key in searchResultResponse.meta.total) {
            resultCount += searchResultResponse.meta.total[key];
            if (teamResultResponse) {
              resultCount += teamResultResponse.meta.total[key];
            }
          }
        } else {
          for (let key in searchResultResponse.meta.count) {
            resultCount += searchResultResponse.meta.count[key];
            if (teamResultResponse) {
              resultCount += teamResultResponse.meta.count[key];
            }
          }
        }

        if (resultCount === 0) {
          this.setState({ error: true, errorType: 'no-results', loading: false, searchResults: {}, searchResultsCount: {} });
        } else {
          let countResponseFiltered = _.get(countResponse, 'data', {});

          if (_.isEmpty(countResponseFiltered)) {
            countResponseFiltered = _.get(searchResultResponse, 'meta.total', {});
          }

          this.setState({
            error: false,
            errorType: '',
            searchResults: _.get(searchResultResponse, 'data'),
            teamResults: _.get(teamResultResponse, 'data', []),
            searchResultsCount: countResponseFiltered,
            focusedListItem: 'search-on-srp',
            loading: false
          });
        }

        AnalyticsService.addEventV2AndPublish({
          category: `search-${this.state.activeScope}`,
          label: 'auto-suggest-result',
          property: this.property,
          action: 'view',
          value: resultCount,
          entityType: activeType,
          traceId: this.traceId,
          teamId: _.get(CurrentUserDetailsService.getCurrentUserDetails(), 'teamId')
        });
      }
    }, (error) => {
      pm.logger.error('SearchPopup~getSearchData ', error);

      this.setState({ error: true, errorType: navigator.onLine ? 'server-error' : 'user-offline', loading: false, searchResults: {} });
    });
  }

  handleChange (searchText) {
    const { searchQuery, activeType } = this.state;

    let updatedState = {};

    updatedState.searchQuery = searchText;
    updatedState.isPopupOpen = true;

    if (searchText.length >= MIN_QUERY_LENGTH) {
      updatedState.loading = true;
    } else {
      updatedState.loading = false;
      updatedState.error = false;
      updatedState.errorType = '';
    }

    updatedState.focusedListItem = '';
    updatedState.searchResults = {};
    updatedState.searchResultsCount = {};

    this.setState(updatedState, () => {
      this.getSearchData();
    });
  }

  handleKeyDown (event) {
    if (event.key === 'Enter') {
      this.handleSearchPageRedirect({ q: this.state.searchQuery });
    }
  }

  getEntityRedirectionUrl (entityItem, redirectionUrlPath) {
    const { documentType, publicHandle } = entityItem.document;

    if (documentType === 'user' || documentType === 'team') {
      return `${window.postman_explore_url}/${publicHandle}`;
    }

    return redirectionUrlPath;
  }
  handleEntityRedirection (entityItem, redirectionUrlPath, event = 'click', currentIndex) {
    const { isPublic, id, publisherType, documentType, publisherId, publicHandle } = entityItem.document;

    AnalyticsService.addEventV2AndPublish({
      category: `search-${this.state.activeScope}`,
      label: 'auto-suggest-result',
      property: this.property,
      action: 'keystroke',
      value: this.keystrokes,
      traceId: this.traceId,
      teamId: _.get(CurrentUserDetailsService.getCurrentUserDetails(), 'teamId')
    });

    this.keystrokes = 0;
    currentIndex = !_.isUndefined(currentIndex) ? currentIndex : _.values(this.state.searchResults).flat().findIndex((x) => x.document.id === id);
    AnalyticsService.addEventV2AndPublish({
      category: `search-${this.state.activeScope}`,
      label: 'auto-suggest-result',
      property: this.property,
      entityId: id,
      entityType: documentType,
      action: event,
      value: currentIndex,
      traceId: this.traceId,
      teamId: _.get(CurrentUserDetailsService.getCurrentUserDetails(), 'teamId')
    });

    if (documentType === 'collection' && (entityItem.folders || entityItem.requests || entityItem.examples)) {
      let childType = '',
          childId = '';

      if (entityItem.folders) {
        childType = 'folder';
        childId = _.get(entityItem, 'folders.document.id', '');
      } else if (entityItem.requests) {
        childType = 'request';
        childId = _.get(entityItem, 'requests.document.id', '');
      } else if (entityItem.examples) {
        childType = 'example';
        childId = _.get(entityItem, 'examples.document.id', '');
      }

      if (childType !== '' && childId !== '') {
        AnalyticsService.addEventV2AndPublish({
          category: `search-${this.state.activeScope}`,
          label: 'collection-child-result',
          property: this.property,
          entityId: childId,
          entityType: childType,
          action: event,
          traceId: this.traceId
        });
      }
    }

    if (documentType === 'user' || documentType === 'team') {
      this.forceBlur();

      return openPublicProfile(publicHandle, isPublic);
    }

    if (window.SDK_PLATFORM !== 'browser' && redirectionUrlPath.includes('/v1/backend/redirect')) {
      return fetch(`${redirectionUrlPath}&json=true`)
        .then((res) => {
          if (!res.ok) {
            throw res.status;
          }

          return res.json();
        })
        .then((json) => {
          this.setState({ isPopupOpen: false });
          this.inputRef.current.blur();
          this.searchBoxRef.current.blur();
          checkContextAndNavigate(json.url);
        })
        .catch((err) => {
          pm.toasts.error(`This ${_.get(documentTypeMapping, entityItem.document.documentType, 'item')} is not accessible right now`);
        });
    }
    else {
      NavigationService.openURL(redirectionUrlPath);

      this.setState({ isPopupOpen: false });
      this.inputRef.current.blur();
      this.searchBoxRef.current.blur();
    }
  }

  getPopupLoader () {
    this.currentUser = CurrentUserDetailsService.getCurrentUserDetails();

    // this.teamName = globalUtil.getTeamName(this.currentUser);

    return (
      <div className='pm-search-list--loading'>
        {
          _.times(5, (index) => {
            return (
              <div key={index} className='pm-search-list--loading__item'>
                <div className='pm-search-list--loading__item__icon' />
                <div
                  className='pm-search-list--loading__item__name'
                  style={{ 'width': `${Math.floor(Math.random() * 120) + 200}px` }}
                />
              </div>
            );
          })
        }
      </div>
    );
  }

  getTypeFilters () {
    const { focusedListItem, searchResults, hideSearchResults } = this.state;

    return (
      <div>
        {!_.isEmpty(searchResults) && !hideSearchResults && <div className='pm-search-list__divider' />}
        <div className='pm-search-list__types-wrapper'
          ref={(ref) => ref && _.invoke(focusedListItem, 'match', 'filter-[0-5]') && this.handleScroll(ref)}
        >
          <span>Search for:</span>
          {_.map(typeFilters, ({ label, icon, action }, index) => (
            <Badge
              key={action}
              className={classnames('pm-search-list__badge pm-search-filter-menu', { 'is-focused': focusedListItem === `filter-${index}` })}
              onClick={() => {
                this.handleTypeChange(action);
                this.inputRef.current.focus();
              }}
              onMouseEnter={this.handleListMouseEnter}
              onMouseLeave={this.handleListMouseLeave}
              data-id={`filter-${index}`}
            >
              <Icon
                name={icon}
                className='pm-icon'
                size='small'
                color='content-color-primary'
              />
              {label}
            </Badge>
          ))}
        </div>
      </div>
    );
  }
  handleScroll (elementRef) {
    if (this.searchListRef.current) {
      const containerTop = this.searchListRef.current.scrollTop,
            containerBottom = containerTop + this.searchListRef.current.clientHeight,
            elementTop = elementRef.offsetTop,
            elementBottom = elementTop + elementRef.clientHeight,
            isVisible = (elementTop >= containerTop && elementBottom <= containerBottom);

      if (!isVisible) {
        elementRef.scrollIntoView({ block: 'nearest' });
      }
    }
  }

  /**
   * Updates recent searches by making a post
   * request using SearchService’s postRecentSearchesData
   * and also fetches updated recent searches values
   */
  updateRecentSearches () {
    if (!this.currentUser.isLoggedIn) {
      return;
    }

    const { searchQuery, activeScope, activeType } = this.state;

    let contextValues = {};

    const currentRouteIdentifier = NavigationService.getRoutesForURL(getUrlParts(NavigationService.getCurrentURL()).pathUrl),
          getSource = _.get(currentRouteIdentifier, '0.name'),
          workspace = _.get(currentRouteIdentifier, '0.routeParams.wid'),
          version = RECENT_SEARCH_VERSION;

    switch (getSource) {
      case 'explore':
        contextValues.source = 'explore';
        break;
      case 'search':
        contextValues.source = 'SRP';
        break;
      case 'build':
        contextValues.source = 'build';
        break;
      default:
        contextValues.source = 'home';
    }

    if (workspace) {
      contextValues.workspace = workspace;
    }

    let requestBody = {
      queryString: searchQuery,
      scope: activeScope,
      type: activeType,
      version,
      context: contextValues
    };

    SearchService.postRecentSearchesData(requestBody)
      .then((res) => {
        return SearchService.getRecentSearchesData();
      })
      .catch((error) => {
        pm.logger.error('SearchPopup~updateRecentSearches ', error);
      })
      .then((response) => {
        this.setState({
          recentSearches: _.get(response, 'data', [])
        });
      })
      .catch((error) => {
        pm.logger.error('SearchPopup~fetchRecentSearches ', error);
        this.setState({
          recentSearches: []
        });
      });
  }

  getSearchResultEntity (item, index = 0) {
    const { name, id, icon, publisherName, isPublic, publisherType, redirectionUrlPath, collection, forkLabel, workspaceName } = this.getEntityItem(item),
          { focusedListItem } = this.state,
          redirectionPath = this.getEntityRedirectionUrl(item, redirectionUrlPath);

    return (
      <Link to={redirectionPath} onClick={(e) => {
        this.updateRecentSearches();

        AnalyticsService.addEventV2AndPublish({
          category: `search-${this.state.activeScope}`,
          label: 'auto-suggest-result',
          property: this.property,
          action: 'keystroke',
          value: this.keystrokes,
          traceId: this.traceId,
          teamId: _.get(CurrentUserDetailsService.getCurrentUserDetails(), 'teamId')
        });

        this.keystrokes = 0;
        AnalyticsService.addEventV2AndPublish({
          category: `search-${this.state.activeScope}`,
          label: 'auto-suggest-result',
          property: this.property,
          entityId: id,
          entityType: item.document.documentType,
          action: 'click',
          value: index + 1,
          traceId: this.traceId,
          teamId: _.get(CurrentUserDetailsService.getCurrentUserDetails(), 'teamId')
        });

        if (item.document.documentType === 'collection' && (item.folders || item.requests || item.examples)) {
          let childType = '',
              childId = '';

          if (item.folders) {
            childType = 'folder';
            childId = _.get(item, 'folders.document.id', '');
          } else if (item.requests) {
            childType = 'request';
            childId = _.get(item, 'requests.document.id', '');
          } else if (item.examples) {
            childType = 'example';
            childId = _.get(item, 'examples.document.id', '');
          }

          if (childType !== '' && childId !== '') {
            AnalyticsService.addEventV2AndPublish({
              category: `search-${this.state.activeScope}`,
              label: 'collection-child-result',
              property: this.property,
              entityId: childId,
              entityType: childType,
              action: 'click',
              traceId: this.traceId
            });
          }
        }

        if ((item.document.documentType === 'team' || item.document.documentType === 'user') && window.SDK_PLATFORM === 'desktop') {
          const { publicHandle, isPublic } = item.document;

          e.preventDefault();
          this.forceBlur();

          return openPublicProfile(publicHandle, isPublic);
        }

        if (window.SDK_PLATFORM !== 'browser' && redirectionPath.includes('/v1/backend/redirect')) {
          e.preventDefault();
          e.stopPropagation();

          return fetch(`${redirectionPath}&json=true`)
            .then((res) => {
              if (!res.ok) {
                throw res.status;
              }

              return res.json();
            })
            .then((json) => {
              this.forceBlur();

              if (pm.isScratchpad) {
                let validUrl;

                try {
                  validUrl = new URL(json.url);
                }
                catch (err) {
                  pm.logger.error('SearchBox ~ invalid URL is provided', json.url);
                }

                const urlPathToNavigate = validUrl.href.substring(validUrl.origin.length + 1);

                ScratchpadService.switchFromScratchpadToRequester(urlPathToNavigate);
              }
              else {
                checkContextAndNavigate(json.url);
              }
            })
            .catch((err) => {
              pm.toasts.error(`This ${_.get(documentTypeMapping, item.document.documentType, 'item')} is not accessible right now`);
            });
        }
        else {
          this.forceBlur();
        }
      }}
      >
        <div className={classnames('pm-search-list-entity', { 'is-focused': focusedListItem === id })}
          key={id}
          data-id={id}
          onMouseEnter={this.handleListMouseEnter}
          onMouseLeave={this.handleListMouseLeave}
          ref={(ref) => ref && focusedListItem === id && this.handleScroll(ref)}
        >
          {this.state.activeType === 'all' && <Icon name={ENABLE_CROSS_RANK ? icon : ''} className='pm-icon' color='content-color-primary' />}
          <span className={classnames('pm-search-entity-title', { 'pm-search-entity-title-extra-spacing': this.state.activeType !== 'all' })}>{name}</span>

          {forkLabel &&
            <React.Fragment>
              <Icon
                className='pm-icon pm-search-fork-label'
                name='icon-action-fork-stroke'
                color='content-color-primary'
              />
              <span className='pm-search-entity-fork-label'>
                {forkLabel}
              </span>
            </React.Fragment>
          }

          {collection &&
            <div className='pm-search-list-entity-collection'>
              <div className='pm-search-list-entity-separator' />
              <span>{collection}</span>
            </div>}

          {publisherName &&
            <div className='pm-search-list-entity-publisher'>
              <div className='pm-search-list-entity-separator' />
              <span>{workspaceName ? (isPublic ? publisherName : workspaceName) : publisherName}</span>
              <div className='pm-search-list-entity-separator' />
              <Icon
                className='pm-icon visibility-status'
                name={isPublic ? iconMap.publicElement : (publisherType === 'user' ? iconMap.user : iconMap.team)}
                color='content-color-secondary'
              />
            </div>}
        </div>
      </Link>
    );
  }

  constructLinkUrl (path, queryParams) {
    return `${path}?${getStringifiedQueryParams(queryParams)}`;
  }

  getSearchResults () {
    const { searchResults, teamResults, searchResultsCount, activeType, activeScope, searchQuery, focusedListItem } = this.state;

    let totalResults = 0;

    if (Array.isArray(searchResults)) {
      totalResults = searchResults.length + teamResults.length;
      if (totalResults === 0) {
        return;
      }
    } else {
      for (let key in searchResults) {
        totalResults += searchResults[key].length;
      }
      if (totalResults === 0) {
        return;
      }
    }

    const searchPageHref = this.constructLinkUrl('search', {
      q: searchQuery,
      scope: activeScope,
      type: activeType
    });

    return (
      <div className='pm-search-list-results' ref={this.searchListRef}>
        <Link
          to={searchPageHref}
          relative
          onClick={(e) => {
            AnalyticsService.addEventV2AndPublish({
              category: `search-${this.state.activeScope}`,
              entityType: 'search-all-suggestion',
              label: 'auto-suggest-result',
              traceId: this.traceId,
              action: 'click'
            });
            this.updateRecentSearches();
            if (pm.isScratchpad) {
              e.preventDefault();
              ScratchpadService.switchFromScratchpadToRequester(searchPageHref);
            }

            this.forceBlur();
          }}
        >
          <div
            className={classnames('pm-search-list-results-header', { 'is-focused': focusedListItem === 'search-on-srp' })}
            onMouseEnter={this.handleListMouseEnter}
            onMouseLeave={this.handleListMouseLeave}
            data-id='search-on-srp'
            ref={(ref) => ref && focusedListItem === 'search-on-srp' && this.handleScroll(ref)}
          >
            <Icon color='content-color-primary' size='large' name='icon-action-search-stroke' className='pm-search-icon' />
            <div className='search-all-row'>
              <div className='expandable-search-query'>{searchQuery}</div>
              <div className='fixed-text'>&nbsp;- Search all {activeType === 'all' ? 'workspaces, collections, APIs and teams' : _.get(_.find(typeFilters, ['action', activeType]), 'label', '')}</div>
            </div>
          </div>
        </Link>
        {Array.isArray(searchResults) ?
          (<React.Fragment>
            {searchResults.map(this.getSearchResultEntity)}
            {teamResults.length > 0 &&
            (
              <React.Fragment>
                <div className='search-result-separator' />
                {teamResults.map((item, index) => this.getSearchResultEntity(item, index + searchResults.length))}
              </React.Fragment>
            )}
          </React.Fragment>
          )
          :
          (_.map(typeFilters, ({ action: entityType, label, icon }) => {
            return (activeType === 'all' || activeType === entityType) &&
              _.get(searchResults, entityType, []).length > 0 && (
              <div key={entityType} className='pm-search-list-results-section'>
                {activeType === 'all' &&
                    <div className='pm-search-list-entity-title'>
                      <Icon
                        name={icon}
                        className='pm-icon'
                        color='content-color-tertiary'
                      />
                      {label}
                    </div>
                }
                {Array.isArray(searchResults[entityType]) && searchResults[entityType].map(this.getSearchResultEntity)}
                {this.shouldDisplayViewAllFor(entityType) && (
                  <Link
                    to={this.constructLinkUrl(
                      'search', {
                        q: searchQuery,
                        scope: activeScope,
                        type: entityType
                      }
                    )}
                    relative
                    onClick={() => {
                      AnalyticsService.addEventV2AndPublish({
                        category: `search-${this.state.activeScope}`,
                        entityType: 'search-all-suggestion',
                        label: 'auto-suggest-result',
                        traceId: this.traceId,
                        action: 'click'
                      });
                      this.updateRecentSearches();
                      this.forceBlur();
                    }}
                  >
                    <div
                      className={classnames('pm-search-list-entity pm-search-show-more', { 'is-focused': focusedListItem === `view-all-${entityType}` })}
                      data-id={`view-all-${entityType}`}
                      onMouseEnter={this.handleListMouseEnter}
                      onMouseLeave={this.handleListMouseLeave}
                      ref={(ref) => ref && focusedListItem === `view-all-${entityType}` && this.handleScroll(ref)}
                    >
                        View all {_.isSafeInteger(searchResultsCount[entityType]) && (searchResultsCount[entityType] < 10 ? '< 10' : util.convertToUserFriendlyMetric(searchResultsCount[entityType]))} {label}
                      <Icon
                        size='small'
                        name='icon-direction-forward'
                        color='content-color-link'
                      />
                    </div>
                  </Link>
                )}
              </div>
            );
          }))
        }
      </div>
    );
  }

  shouldDisplayViewAllFor (entityType) {
    const { searchResultsCount, activeType, searchResults } = this.state;

    return (activeType === 'all' && searchResults[entityType] && (_.isUndefined(searchResultsCount[entityType]) || searchResultsCount[entityType] > 3));
  }

  handleSearchPageRedirect (queryParam) {
    // Save traceId in store. To be used by Search Container (SRP Page).
    SearchStore.updateTraceId(this.traceId);

    let isLoggedIn = CurrentUserDetailsService.getCurrentUserDetails().isLoggedIn,
        isHomePage = isHomePageActive();

    // This section has been added to navigate to search page via openURL navigation
    // when the user is in logged out and in homepage
    if (window.SDK_PLATFORM === 'browser' && !isLoggedIn && isHomePage) {
      let queryParamsString = getStringifiedQueryParams(queryParam),
          resolvedURL = `search?${queryParamsString}`;

      NavigationService.transitionToURL(resolvedURL);
    }
    else {
      if (pm.isScratchpad) {
        const searchPageHref = this.constructLinkUrl('search', queryParam);

        ScratchpadService.switchFromScratchpadToRequester(searchPageHref);
      }
      else {
        NavigationService.transitionTo('search', {}, queryParam);
      }
    }

    this.setState({ isPopupOpen: false, isSearchBoxFocused: false });
    this.inputRef && this.inputRef.current && this.inputRef.current.blur();
    this.searchBoxRef && this.searchBoxRef.current && this.searchBoxRef.current.blur();
  }

  // DO NOT TOUCH THIS LOGIC UNLESS YOU FULLY UNDERSTAND THE FLOW
  // REFER: https://whimsical.com/SvjgX524aZe2ZSA88Hvg12
  // WE KNOW THERE IS A BETTER WAY TO DO THIS, BUT SOME OTHER TIME :)
  handleListKeyDown (event) {
    const { recentSearches, searchResults, teamResults, focusedListItem, showFilterMenu, activeType, showTypeFilters, activeScope, hideSearchResults, searchQuery } = this.state;

    // Unwrap the search result entities including view-all rows into one array
    let focusableItems = [];

    if (!hideSearchResults) {
      if (!_.isEmpty(searchResults) || !_.isEmpty(teamResults)) {
        focusableItems.push({ document: { id: 'search-on-srp' } });
      }

      if (ENABLE_CROSS_RANK && activeType === 'all') {
        if (searchResults.length > 0) {
          focusableItems = focusableItems.concat(searchResults);
        }

        if (teamResults.length > 0) {
          focusableItems = focusableItems.concat(teamResults);
        }
      }
      else {
        focusableItems = focusableItems.concat(typeFilters.map(({ action }) => {
          let items = _.get(searchResults, action, []);

          if (this.shouldDisplayViewAllFor(action)) {
            return items.concat([{
              document: {
                id: `view-all-${action}`
              }
            }]);
          }


          return items;
        }));
      }
    }

    if (showTypeFilters) {
      focusableItems = focusableItems.concat([{
        document: {
          id: 'filter-0'
        }
      }]);
    }

    if (this.shouldDisplayRecentSearches()) {
      focusableItems = focusableItems.concat(recentSearches.map((item, index) => {
        _.set(item, 'document.id', `recent-search-${index}`);

        return item;
      }));
    }

    focusableItems = focusableItems.flat();
    let currentIndex,
        searchQueryLength = focusableItems.length,
        nextIndex,
        filters,
        applyFilter;

    if (showFilterMenu) {
      filters = showFilterMenu === 'scope' ?
        searchUtil.getScopeFilters().filter((filterObj) => {
          if (activeType === 'team') {
            return filterObj.action !== 'team' && filterObj.action !== 'personal';
          }

          return true;
        }) : typeFilters;
      applyFilter = showFilterMenu === 'scope' ? this.handleScopeChange : this.handleTypeChange;
      currentIndex = filters.findIndex((x) => x.action === focusedListItem);
    } else {
      currentIndex = focusableItems.findIndex((x) => x.document.id.toString() === focusedListItem);
    }

    if (util.isArrowUpEvent(event.key)) {
      if (_.invoke(focusedListItem, 'startsWith', 'filter')) {
        // When any filter is visible and focussed
        nextIndex = searchQueryLength - 2;
        if (this.shouldDisplayRecentSearches() || nextIndex === -1) {
          // searchQueryLength will be 1 when only filter selection row is shown
          this.setState({ focusedListItem: '' });

          return;
        }
      }
      else if (currentIndex === -1) {
        if (showFilterMenu) {
          nextIndex = filters.length - 1;
        } else {
          nextIndex = searchQueryLength - 1;
        }
      }
      else {
        nextIndex = currentIndex - 1;
        if (nextIndex === -1) {
          if (showFilterMenu) {
            nextIndex = filters.length - 1;
          } else {
            nextIndex = searchQueryLength - 1;
          }
        }
      }

      if (showFilterMenu) {
        this.setState({ focusedListItem: filters[nextIndex].action });
      } else {
        this.setState({ focusedListItem: _.get(focusableItems, [nextIndex, 'document', 'id'], '').toString() });
      }

      event.preventDefault();
    }
    else if (util.isArrowDownEvent(event.key)) {
      if ((_.invoke(focusedListItem, 'startsWith', 'recent-search') && searchQueryLength - 1 === currentIndex) || (_.invoke(focusedListItem, 'startsWith', 'filter') && searchQueryLength - 1 === 0)) {
        // Special case when no results are being displayed and down key is pressed on last recent search item
        this.setState({ focusedListItem: '' });
      }
      else if (showFilterMenu) {
        nextIndex = (currentIndex + 1) % filters.length;
        this.setState({ focusedListItem: filters[nextIndex].action });
      } else {
        nextIndex = (currentIndex + 1) % searchQueryLength;

        // Special case when recent searches must be next in line (for navigation) to type filters
        if (this.shouldDisplayRecentSearches() && _.invoke(focusedListItem, 'startsWith', 'filter') && !_.invoke(focusedListItem, 'startsWith', 'filter-0')) {
          nextIndex++;
        }

        this.setState({ focusedListItem: _.get(focusableItems, [nextIndex, 'document', 'id'], '').toString() });
      }

      event.preventDefault();
    }
    else if (util.isArrowRightEvent(event.key)) {
      if (showFilterMenu) {
        if (activeType !== 'all') {
          this.setState({ showTypeFilters: true, hideSearchResults: true, focusedListItem: '', showFilterMenu: false });
        }
        else {
          this.setState({ showFilterMenu: false, showTypeFilters: activeType === 'all', loading: this.state.searchQuery.length >= MIN_QUERY_LENGTH, hideSearchResults: false },
            () => this.getSearchData());
          event.preventDefault();
          this.inputRef.current.inputRef.current.focus();
        }
      }
      else if (_.invoke(focusedListItem, 'startsWith', 'filter')) {
        event.preventDefault();
        const index = (parseInt(focusedListItem.replace('filter-', '')) + 1) % 4;

        this.setState({ focusedListItem: `filter-${index}` });
      }
      else if (hideSearchResults && showTypeFilters) {
        this.setState({ showTypeFilters: activeType === 'all', loading: this.state.searchQuery.length >= MIN_QUERY_LENGTH, hideSearchResults: false },
          () => this.getSearchData());
        event.preventDefault();
        this.inputRef.current.inputRef.current.focus();
      }
    }
    else if (util.isArrowLeftEvent(event.key)) {
      if (_.invoke(focusedListItem, 'startsWith', 'filter')) {
        event.preventDefault();
        const index = (parseInt(focusedListItem.replace('filter-', '')) + 3) % 4;

        this.setState({ focusedListItem: `filter-${index}` });
      }
      else if ((event.target.selectionStart === 0 && event.target.selectionEnd === 0) || (showTypeFilters && activeType !== 'all' && focusedListItem === '')) {
        if ((hideSearchResults && showTypeFilters) || activeType === 'all') {
          if (this.currentUser.isLoggedIn) {
            this.popupRef.current.focus();
            this.setState({
              showFilterMenu: 'scope',
              focusedListItem: _.filter(searchUtil.getScopeFilters(), ['action', activeScope])[0].action
            });
          }
        }
        else {
          this.popupRef.current.focus();
          this.setState({ showTypeFilters: true, hideSearchResults: true, focusedListItem: '' });
        }
      }
    }
    else if (util.isEnterEvent(event.key)) {
      this.currentUser = CurrentUserDetailsService.getCurrentUserDetails();

      // this.teamName = globalUtil.getTeamName(this.currentUser);
      if (focusedListItem) {
        if (showFilterMenu) {
          applyFilter(focusedListItem, 'enter');
          this.setState({ focusedListItem: '', showFilterMenu: false, showTypeFilters: activeType === 'all', hideSearchResults: false });
          event.preventDefault();
          this.inputRef.current.inputRef.current.focus();
        }
        else if (focusedListItem.startsWith('filter')) {
          const type = typeFilters[parseInt(focusedListItem.replace('filter-', ''))].action;

          this.setState({ focusedListItem: '' });
          this.initiateMode = 'keyboard';
          this.handleTypeChange(type);
          event.preventDefault();
          this.inputRef.current.inputRef.current.focus();
        }
        else if (focusedListItem === 'search-on-srp') {
          AnalyticsService.addEventV2AndPublish({
            category: `search-${this.state.activeScope}`,
            entityType: 'search-all-suggestion',
            traceId: this.traceId,
            label: 'auto-suggest-result',
            action: 'enter'
          });

          this.updateRecentSearches();
          if ((event.metaKey || event.ctrlKey) && window.SDK_PLATFORM === 'browser') {
            const url = NavigationService.getURLForRoute('search', {}, {
              q: this.state.searchQuery,
              scope: activeScope,
              type: activeType
            });

            return NavigationService.openURL(NavigationService.getBaseURL() + '/' + url, { target: '_blank' });
          }
          else {
            this.handleSearchPageRedirect({
              q: this.state.searchQuery,
              scope: activeScope,
              type: activeType
            });
          }
        }
        else if (focusedListItem.startsWith('recent-search')) {
          const idx = focusedListItem.replace('recent-search-', '');

          this.activateRecentSearch(idx, 'enter');
        }
        else {
          let currentEntity = _.filter(focusableItems, (result) => {
            return result.document.id.toString() === focusedListItem;
          })[0];

          this.updateRecentSearches();
          if (currentEntity.document.id.toString().startsWith('view-all')) {
            let type = currentEntity.document.id.replace('view-all-', ''),
                { searchQuery, activeScope } = this.state;

            if ((event.metaKey || event.ctrlKey) && window.SDK_PLATFORM === 'browser') {
              const url = NavigationService.getURLForRoute('search', {}, {
                q: searchQuery,
                scope: activeScope,
                type: type
              });

              return NavigationService.openURL(NavigationService.getBaseURL() + '/' + url, { target: '_blank' });
            }
            else {
              this.handleSearchPageRedirect({
                q: searchQuery,
                scope: activeScope,
                type: type
              });
            }
          }
          else {
            let { redirectionUrlPath } = this.getEntityItem(currentEntity);

            if (event.metaKey || event.ctrlKey) {
              const url = this.getEntityRedirectionUrl(currentEntity, redirectionUrlPath);

              return NavigationService.openURL(url, { target: '_blank' });
            }
            else {
              this.handleEntityRedirection(currentEntity, redirectionUrlPath, 'enter', currentIndex);
            }
          }
        }
      } else if (this.state.searchQuery !== '') {
        this.updateRecentSearches();
        this.handleSearchPageRedirect({
          q: this.state.searchQuery,
          scope: this.state.activeScope,
          type: this.state.activeType
        });
        this.setState({ isPopupOpen: false });
        this.inputRef.current.blur();
        this.searchBoxRef.current.blur();
      }
    }
    else if (util.isBackspaceEvent(event.key) && event.target.selectionStart === 0 && event.target.selectionEnd === 0 && activeType !== 'all') {
      this.handleTypeChange('all');
    }
    else if (util.isEscapeEvent(event.key)) {
      if (showFilterMenu) {
        this.setState({
          showFilterMenu: false
        });
      }

      this.handleEscape();
    }
    else {
      this.keystrokes++;
    }
  }

  handleListMouseEnter (event) {
    this.setState({
      focusedListItem: _.get(event, 'target.dataset.id', '')
    });
  }

  handleBlur (e) {
    if (e.currentTarget.contains(e.target) && !e.currentTarget.contains(e.relatedTarget)) {
      this.forceBlur();
    }
  }
  forceBlur () {
    this.inputRef.current.blur();
    this.setState({ isSearchBoxFocused: false, showFilterMenu: false });
    this.keystrokes = 0;
    _.delay(this.setState, 500, { isPopupOpen: false });
    this.recentSearchesReactionDisposer && this.recentSearchesReactionDisposer();
    this.recentSearchesReactionDisposer = null;
    this.propertyReactionDisposer && this.propertyReactionDisposer();
    this.propertyReactionDisposer = null;
  }

  handleFocus () {
    // Resetting the tracking flag for recent searches event
    this.isTraceIdConsumedForRecentSearch = false;
    this.triggerWebSocketConnection();

    if (this.traceId === '' || !this.state.isSearchBoxFocused) {
      this.traceId = uuid();
    }

    let updatedSate = {
      isSearchBoxFocused: true,
      isPopupOpen: true
    };

    this.setState(updatedSate);

    this.property = _.get(NavigationService.getRoutesForURL(NavigationService.getCurrentURL()), '0.name', '').split('.')[0];

    if (this.property === '' || this.property === 'home') {
      this.property = CurrentUserDetailsService.getCurrentUserDetails().isLoggedIn ? 'home' : 'lander';
    }

    this.propertyReactionDisposer = when(
      () => CurrentUserDetailsService.getCurrentUserDetails().isLoggedIn,
      () => {
        if (this.property === '' || this.property === 'lander') {
          this.property = 'home';
        }
      }
    );

    if (this.state.recentSearches.length === 0) {
      // Observes user's logged in status in the first
      // function, and once the user logs in, the reaction(when) runs
      // the second function to fetch recent searches using SearchService
      this.recentSearchesReactionDisposer = when(
        () => CurrentUserDetailsService.getCurrentUserDetails().isLoggedIn,
        () => {
          SearchService.getRecentSearchesData()
            .then((response) => {
              this.setState({
                recentSearches: _.get(response, 'data', [])
              });
            })
            .catch((error) => {
              pm.logger.error('SearchPopup~fetchRecentSearches ', error);
              this.setState({
                recentSearches: []
              });
            });
        });
    }

    this.initiateMode = this.initiateMode === '' ? AnalyticsConstants.MOUSE : AnalyticsConstants.KEYBOARD;

    let workspaceData = {},
        path = NavigationService.getRoutesForURL(NavigationService.getCurrentURL());

    if (this.property === 'workspace') {
      if (path.length === 2) {
        workspaceData.entityType = _.get(path[1], 'name').split('.')[1];
        workspaceData.entityId = _.map(path[1].routeParams)[0];
      }
    }

    AnalyticsService.addEventV2AndPublish({
      category: `search-${this.state.activeScope}`,
      property: this.property,
      action: 'initiate',
      label: this.property,
      traceId: this.traceId,
      value: this.initiateMode,
      teamId: _.get(CurrentUserDetailsService.getCurrentUserDetails(), 'teamId'),
      ...workspaceData
    });

    this.initiateMode = '';
  }

  handleListMouseLeave (event) {
    this.state.focusedListItem === _.get(event, 'target.dataset.id') &&
      this.setState({ focusedListItem: '' });
  }

  handleEscape () {
    if (this.state.hideSearchResults) {
      const { activeType } = this.state;

      this.setState({ hideSearchResults: false, focusedListItem: '', showTypeFilters: activeType === 'all' });
    } else if (this.state.showFilterMenu) {
      this.setState({ showFilterMenu: false, focusedListItem: '' });
      this.inputRef.current && this.inputRef.current.focus();
    } else if (this.state.error) {
      this.keystrokes = 0;
      this.setState({ error: false, searchResults: {}, searchQuery: '' });
    } else if (_.isEmpty(this.state.searchResults) && this.state.focusedListItem === '') {
      this.inputRef.current.blur();
      this.searchBoxRef.current.blur();
      this.popupRef.current.blur();
      this.setState({ searchResults: {}, isPopupOpen: false, isSearchBoxFocused: false });
    } else if (this.state.focusedListItem !== '') {
      this.setState({ focusedListItem: '' });
    } else {
      this.keystrokes = 0;
      this.setState({ searchResults: {}, searchQuery: '' });
    }
  }

  handleCancel () {
    const { activeType, searchQuery } = this.state;

    if (activeType === 'all' && searchQuery === '') {
      this.inputRef.current.blur();
      this.searchBoxRef.current.blur();
      this.popupRef.current.blur();

      return;
    }

    this.setState({
      focusedListItem: '',
      showTypeFilters: true,
      searchResults: {},
      searchQuery: '',
      activeType: 'all',
      loading: false
    });
  }

  handleTypeChange (type) {
    if (type === 'team' && (this.state.activeScope === 'team' || this.state.activeScope === 'personal')) {
      this.handleScopeChange('all');
    }

    this.setState({
      activeType: type,
      showTypeFilters: type === 'all',
      hideSearchResults: false,
      focusedListItem: '',
      loading: this.state.searchQuery.length >= MIN_QUERY_LENGTH
    }, () => {
      this.getSearchData();
    });


    if (type !== 'all') {
      this.initiateMode = this.initiateMode === '' ? AnalyticsConstants.MOUSE : AnalyticsConstants.KEYBOARD;
      AnalyticsService.addEventV2AndPublish({
        category: `search-${this.state.activeScope}`,
        property: this.property,
        action: 'filter',
        label: 'auto-suggest-result',
        value: this.initiateMode,
        traceId: this.traceId,
        entityType: type,
        teamId: _.get(CurrentUserDetailsService.getCurrentUserDetails(), 'teamId')
      });
      this.initiateMode = '';
    }
  }

  handleScopeChange (scope, eventValue = 'other') {
    let scopeObject = _.find(searchUtil.getScopeFilters(), ['action', scope]);

    if (this.state.showFilterMenu === 'scope' && scope !== this.state.activeScope) {
      this.handleScopeFilterAnalytics(scope, this.state.activeScope, eventValue);
    }

    if (!scopeObject) {
      scope = 'public';
    }

    this.setState({
      activeScope: scope,
      loading: this.state.searchQuery.length >= MIN_QUERY_LENGTH
    }, () => {
      this.getSearchData();
    });
  }

  handleTypeFilterDropdown () {
    const { hideSearchResults, activeType } = this.state;

    if (hideSearchResults) {
      this.setState({
        hideSearchResults: false,
        showTypeFilters: activeType === 'all'
      });
    } else {
      this.setState({
        hideSearchResults: true,
        showTypeFilters: true
      });
    }
  }

  // We are triggering a websocket connection on hover because we need to capture the intent
  // of the user as early as possible.
  // When the user hovers over the search bos, it means they show an intent to use the search
  // feature. So, we need an active websocket connection for it.
  handleMouseOver () {
    this.triggerWebSocketConnection();
  }

  getCollectionChildEntities (item) {
    const { documentType, name, workspaces, id } = item.document,
          collectionRedirectionBasePath = `${pm.dashboardUrl}/build`;

    let entity = {};

    if (documentType === 'collection') {
      if (item.folders) {
        return {
          icon: iconMap.folder,
          name: item.folders.document.name,
          redirectionUrlPath: `${collectionRedirectionBasePath}/folder/${item.folders.document.id}`
        };
      }
      else if (item.requests) {
        return {
          icon: iconMap.request,
          name: item.requests.document.name,
          redirectionUrlPath: `${collectionRedirectionBasePath}/request/${item.requests.document.id}`
        };
      }
      else if (item.examples) {
        return {
          icon: iconMap.example,
          name: item.examples.document.name,
          redirectionUrlPath: `${collectionRedirectionBasePath}/example/${item.examples.document.id}`
        };
      }
      else {
        return {
          name: name,
          redirectionUrlPath: `${collectionRedirectionBasePath}/collection/${id}`,
          icon: iconMap.collection
        };
      }
    }

    return entity;
  }

  getEntityItem (item) {
    let entity = {};

    const { isPublic, id, publisherType, documentType, publisherId, publicHandle,
      workspaces, name, publisherName, entityType, forkLabel } = item.document;

    entity.id = id.toString();
    entity.name = name;
    entity.publisherName = publisherName;
    entity.isPublic = isPublic;
    entity.publisherType = publisherType;
    entity.forkLabel = forkLabel;

    if (documentType === 'user' || documentType === 'team') {
      entity.redirectionUrlPath = `${window.postman_explore_url}/${publicHandle}`;
      entity.icon = _.get(iconMap, documentType);
    }
    else if (documentType === 'api') {
      entity.redirectionUrlPath = `${pm.dashboardUrl}/build/api/${id}`;
      entity.workspaceName = _.get(item.document, 'workspaces.0.name');
      entity.icon = _.get(iconMap, documentType);
    }
    else if (documentType === 'workspace') {
      entity.redirectionUrlPath = `${pm.dashboardUrl}/build/workspace/${id}`;
      entity.icon = _.get(iconMap, documentType);
    }
    else if (documentType === 'collection') {
      entity.workspaceName = _.get(item.document, 'workspaces.0.name');
      entity = { ...entity, ...this.getCollectionChildEntities(item) };
      if (entity.name !== name) {
        entity.collection = name;
      }
    }

    if (documentType !== 'user') {
      entity.name = entity.name.length > 40 ? `${entity.name.substring(0, 40)}...` : entity.name;
    }

    if (isPublic) {
      switch (documentType) {
        case 'workspace':
        case 'api':
          entity.redirectionUrlPath = `${window.postman_explore_url}/v1/backend/redirect?type=${documentType}&id=${id}&publisherType=${publisherType}&publisherId=${publisherId}`;
          break;
        case 'collection':
          entity.redirectionUrlPath = `${window.postman_explore_url}/v1/backend/redirect?type=${documentType}&id=${id}&publisherType=${publisherType}&publisherId=${publisherId}`;
          switch (entityType) {
            case 'template':
              entity.redirectionUrlPath = `${window.postman_explore_url}/v1/backend/redirect?type=template&id=${id}&documentation=true`;
              break;
            case 'apinetworkentity':
              entity.redirectionUrlPath = `${window.postman_explore_url}/v1/backend/redirect?type=apinetworkentity&id=${id}&documentation=true`;
              break;
          }
      }
    }

    return entity;
  }

  getFilterMenu () {
    let filters = typeFilters,
        filterHeading = 'Choose the type of entity you want to find',
        applyFilter = this.handleTypeChange;

    if (this.state.showFilterMenu === 'scope') {
      filters = searchUtil.getScopeFilters();
      filterHeading = 'Search in',
      applyFilter = this.handleScopeChange;
    }

    return (
      <div className='pm-search-filter-list'>
        <h4 className='pm-search-filter-list__header'>
          {filterHeading}
        </h4>
        {_.map(filters, (filter) => (
          <div
            className={
              classnames('pm-search-filter-list__item',
                { 'is-focused': filter.action === this.state.focusedListItem },
                { 'is-disabled-filter': (filter.action === 'team' || filter.action === 'personal') && this.state.activeType === 'team' })}
            key={filter.action}
            data-id={filter.action}
            onClick={() => {
              applyFilter(filter.action, 'click');
              this.inputRef.current.focus();
              this.setState({
                showFilterMenu: false,
                focusedListItem: ''
              });
            }}
            onMouseEnter={this.handleListMouseEnter}
            onMouseLeave={this.handleListMouseLeave}
          >
            <Badge className={classnames('pm-search-filter-list__badge')}>
              {filter.label}
            </Badge>
          </div>
        ))}
      </div>
    );
  }

  handleScopeFilterAnalytics (newScope, oldScope, eventValue) {
    switch (eventValue) {
      case 'click':
        eventValue = AnalyticsConstants.MOUSE;
        break;
      case 'enter':
        eventValue = AnalyticsConstants.KEYBOARD;
        break;
      default:
        eventValue = AnalyticsConstants.OTHER;
    }

    AnalyticsService.addEventV2AndPublish({
      category: `search-${oldScope}`,
      label: newScope,
      property: this.property,
      action: 'scope-change',
      value: eventValue,
      traceId: this.traceId,
      teamId: CurrentUserDetailsService.getCurrentUserDetails().teamId
    });
  }

  getActiveScopeLabel () {
    const scopeFilters = searchUtil.getScopeFilters();

    let activeScopeObject = _.find(scopeFilters, ['action', this.state.activeScope]);

    return _.get(activeScopeObject, 'label', '');
  }

  getActiveTypeLabel () {
    const { activeType } = this.state;

    let activeTypeObject = _.find(typeFilters, ['action', activeType]);

    return activeType !== 'all' ?
      _.get(activeTypeObject, 'label', '') :
      null;
  }

  // Gets specialized search box placeholder text for different active types and scopes
  getPlaceHolder () {
    const { activeType, activeScope, isSearchBoxFocused } = this.state,
          scopeFilters = searchUtil.getScopeFilters(),
          activeFilterType = activeType === 'all' ? 'anything' : _.get(_.find(typeFilters, ['action', activeType]), 'placeholder'),
          activeFilterScope = _.get(_.find(scopeFilters, ['action', activeScope]), 'placeholder');

    if (!isSearchBoxFocused || !activeFilterType || !activeFilterScope) {
      return 'Search Postman';
    }

    if (activeScope === 'team' || activeScope === 'personal') {
      return `Search for ${activeFilterType} in your ${activeFilterScope}`;
    } else if (activeScope === 'public') {
      return `Search for ${activeFilterType} on the ${activeFilterScope}`;
    } else {
      return `Search for ${activeFilterType} in ${activeFilterScope}`;
    }
  }

  trackRecentSearchViewEvent () {
    if (this.isTraceIdConsumedForRecentSearch) {
      return;
    }

    AnalyticsService.addEventV2AndPublish({
      category: `search-${this.state.activeScope}`,
      label: 'recent-search',
      property: this.property,
      action: 'view',
      value: 'recent searches visible',
      traceId: this.traceId,
      teamId: _.get(CurrentUserDetailsService.getCurrentUserDetails(), 'teamId')
    });
    this.isTraceIdConsumedForRecentSearch = true;
  }

  /**
   * Returns true if ALL of the following are satisfied:
   * - each input is empty
   * - active type filter is all
   * - recentSearches state has at least one item fetched
   *
   * @returns {boolean}
   */
  shouldDisplayRecentSearches () {
    const { searchQuery, activeType, recentSearches } = this.state;

    return searchQuery.length === 0 && activeType === 'all' && this.currentUser.isLoggedIn && !_.isEmpty(recentSearches);
  }

  /**
   * Changes scope filter, type filter and
   * search input to the recent search value
   *
   * @param {String} index - Index of recent search in the recentSearch state
   * @param {String} action - Can be 'click' or 'enter' depending upon the way the item was activated
   */
  activateRecentSearch (index, action = 'click') {
    const { recentSearches } = this.state,
          searchQueryFromRecentSearch = _.get(recentSearches, [index, 'queryString']),
          scopeFromRecentSearch = _.get(recentSearches, [index, 'scope']),
          typeFromRecentSearch = _.get(recentSearches, [index, 'type']);

    if (scopeFromRecentSearch === undefined || typeFromRecentSearch === undefined || searchQueryFromRecentSearch === undefined) {
      return;
    }

    AnalyticsService.addEventV2AndPublish({
      category: `search-${this.state.activeScope}`,
      label: 'recent-search',
      property: this.property,
      action: action,
      value: index,
      traceId: this.traceId,
      teamId: _.get(CurrentUserDetailsService.getCurrentUserDetails(), 'teamId')
    });

    this.setState({
      activeScope: scopeFromRecentSearch,
      activeType: typeFromRecentSearch
    }, () => {
      this.handleChange(searchQueryFromRecentSearch);
    });
  }

  /**
   * Maps values from recentSearches state
   * variable to the 'Recent Searches' list
   *
   * @returns {JSX} - Recent Search Popup element
   */
  getRecentSearchPopup () {
    const { focusedListItem, recentSearches } = this.state,
          scopeFilters = searchUtil.getScopeFilters();

    this.trackRecentSearchViewEvent();

    return (
      <div className='pm-search-recent-search'>
        <div className='pm-search-recent-search-title'>Recent Searches</div>
        <div className='pm-search-recent-search-items'>
          {recentSearches.map((item, index) => {
            let typeFilter = '',
                typeFilterIcon = '',
                typeFilterLabel = '',
                scopeFilter = _.find(scopeFilters, ['action', item.scope]),
                scopeFilterLabel = scopeFilter ? scopeFilter.label : '';

            if (item.type !== 'all') {
              typeFilter = _.find(typeFilters, ['action', item.type]);
              typeFilterIcon = typeFilter ? typeFilter.icon : '';
              typeFilterLabel = typeFilter ? typeFilter.label : '';
            }

            return (
              <div
                key={uuid()}
                data-id={`recent-search-${index}`}
                id={`recent-search-${index}`}
                className={classnames('pm-search-recent-search-items-row', { 'is-focused': focusedListItem === `recent-search-${index}` })}
                onMouseEnter={this.handleListMouseEnter}
                onMouseLeave={this.handleListMouseLeave}
                onClick={(event) => this.activateRecentSearch(index, 'click')}
              >
                <div className='pm-search-recent-search-items-row-badges'>
                  {scopeFilter && (<Badge className='pm-search-recent-search-items-row-badges-item'>{scopeFilterLabel}</Badge>)}
                  {item.type !== 'all' && typeFilter &&
                    (<Badge className='pm-search-recent-search-items-row-badges-item'>
                      <Icon
                        name={typeFilterIcon}
                        className='pm-icon'
                        size='small'
                        color='content-color-primary'
                      />
                      {typeFilterLabel}
                    </Badge>)}
                </div>
                <div className='pm-search-recent-search-items-row-search-text'>{item.queryString}</div>
              </div>
            );
          })}
        </div>
      </div>);
  }

  getErrorPopup () {
    let { errorType, activeScope, activeType } = this.state,
        scopeFilters = searchUtil.getScopeFilters(),
        scopeFilterLabel = CurrentUserDetailsService.teamId && CurrentUserDetailsService.teamName ?
          _.get(_.find(scopeFilters, ['action', 'team']), 'label') :
          _.get(_.find(scopeFilters, ['action', 'personal']), 'label'),
        data = {};

    if (errorType === 'no-results') {
      data.heading = 'No results found';
      data.text = 'Check your spelling, try a different search term, or adjust your filters.';
      data.illustration = <IllustrationSearch />;

      if (activeType !== 'all') {
        data.heading = `No ${_.get(_.find(typeFilters, ['action', activeType]), 'placeholder')} found`;
      }

      if (activeScope !== 'all') {
        let headingScopeInfo = activeScope === 'public' ?
          _.get(_.find(scopeFilters, ['action', 'public']), 'label') :
          scopeFilterLabel;

        data.heading += ` in ${headingScopeInfo}`;
      }

      if (activeType === 'all' && activeScope !== 'all') {
        data.text = 'Check your spelling, try a different search term, or';
        data.filterChangeAction = 'search in ';
        if (activeScope === 'public') {
          data.filterChangeAction += scopeFilterLabel;
        } else if (activeScope === 'team' || activeScope === 'personal') {
          data.filterChangeAction += _.get(_.find(scopeFilters, ['action', 'public']), 'label');
        }
      } else if (activeType !== 'all') {
        data.text = 'Check your spelling, try a different search term, or';
        activeType = activeType === 'api' ? 'API' : activeType;
        data.filterChangeAction = `remove the ${activeType} filter`;
      }
    }
    else if (errorType === 'server-error') {
      data.illustration = <IllustrationInternalServerError />;
      data.icon = 'icon-action-search-stroke';
      data.heading = 'Unable to search';
      data.text = 'We are having trouble searching right now.';
      data.action = 'Try Again';
    }
    else if (errorType === 'user-offline') {
      data.illustration = <IllustrationCheckInternetConnection />;
      data.icon = 'icon-state-offline-stroke';
      data.heading = 'Unable to search as you are offline';
      data.text = 'You need to be online to carry out a search';
      data.action = 'Refresh';
      data.actionIcon = 'icon-action-refresh-stroke';
    }
    else if (errorType === 'query-text-exceeded-limit') {
      data.illustration = <IllustrationSearch />;
      data.icon = 'icon-action-search-stroke';
      data.heading = 'Search query too long';
      data.text = 'Try searching with a shorter query';
    }

    return (
      <div className='error-popup'>
        {data.illustration ?
          <div className='error-popup-illustration'>{data.illustration}</div>
          :
          <div className='error-popup-image'><Icon name={data.icon} className='pm-icon' /></div>
        }
        <div className='error-popup-title'>{data.heading}</div>
        <div className='error-popup-info'>{data.text}</div>
        {data.action &&
          <div className='error-popup-action'
            onClick={() => {
              this.setState({ error: false, errorType: '', loading: true },
                () => { this.getSearchData(); });
            }}
          >
            {data.action}
            {data.actionIcon && <Icon className='error-popup-action-icon' color='content-color-brand' name={data.actionIcon} />}
          </div>
        }
        {data.filterChangeAction &&
          <div className='error-popup-action-filter-change'
            onClick={() => {
              this.setState({ error: false, errorType: '', loading: true },
                () => {
                  if (this.state.activeType === 'all') {
                    if (this.state.activeScope === 'public') {
                      CurrentUserDetailsService.teamName && CurrentUserDetailsService.teamId ?
                        this.handleScopeChange('team') : this.handleScopeChange('personal');
                    } else if (this.state.activeScope === 'team' || this.state.activeScope === 'personal') {
                      this.handleScopeChange('public');
                    }
                  } else {
                    this.handleTypeChange('all');
                  }
                });
            }}
          >
            {data.filterChangeAction}
          </div>
        }
      </div>
    );
  }

  triggerWebSocketConnection () {
    if (window.SDK_PLATFORM === 'browser' || !pm.isScratchpad) {
      return;
    }

    // This uses SyncManagerProxy internally to send a message to SyncManagerNew
    // on the shared process
    pm.syncManager.triggerWebSocketConnection();
  }

  render () {
    this.currentUser = CurrentUserDetailsService.getCurrentUserDetails();

    // this.teamName = globalUtil.getTeamName(this.currentUser);
    const { searchQuery, isPopupOpen, loading, isSearchBoxFocused, showFilterMenu, error, showTypeFilters, hideSearchResults, activeType, focusedListItem } = this.state,
          activeScopeLabel = this.getActiveScopeLabel(),
          activeTypeLabel = this.getActiveTypeLabel();

    // Recieved from header compoonent to manually hide a component on mobile screens
    const { isHiddenOnMobile } = this.props;

    const active_filter_badges = [
      (<React.Fragment key={0}>
        <Badge
          onClick={() => {
            let updatedState = {};

            if (this.state.showFilterMenu === 'scope') {
              updatedState.showFilterMenu = false;
              updatedState.focusedListItem = '';
              updatedState.hideSearchResults = false;
              updatedState.showTypeFilters = activeType === 'all';
              this.inputRef.current.focus();
            }
            else if (this.currentUser.isLoggedIn) {
              updatedState.showFilterMenu = 'scope';
            }

            this.setState(updatedState);
          }}
          className={classnames('input-search-group__badge', { 'is-focussed': showFilterMenu === 'scope' })}
        >
          {activeScopeLabel}
          {this.currentUser.isLoggedIn && <span>
            <Icon
              name={showFilterMenu === 'scope' ? 'icon-direction-up' : 'icon-direction-down'}
              color='content-color-secondary'
              size='small'
              className='pm-icon'
            />
          </span>}
        </Badge>
      </React.Fragment>),
      (<React.Fragment key={1}>
        { activeType !== 'all' &&
          <Badge
            className={classnames('input-search-group__badge',
              {
                'is-focussed': activeType !== 'all' && showTypeFilters && hideSearchResults &&
                  (_.isEmpty(focusedListItem) || _.invoke(focusedListItem, 'startsWith', 'filter'))
              })}
            onClick={this.handleTypeFilterDropdown}
          >
            {activeTypeLabel}
            <span onClick={(e) => {
              e.stopPropagation();
              this.handleTypeChange('all');
            }}
            >
              <Icon
                name='icon-action-close-stroke'
                color='content-color-secondary'
                size='small'
                className='pm-icon'
              />
            </span>
          </Badge>}
      </React.Fragment>)
    ];

    return (
      <React.Fragment>
        <MobileSearchBox
          handleChange={this.handleChange}
          handleSearchPageRedirect={this.handleSearchPageRedirect}
          isHiddenOnMobile={isHiddenOnMobile}
          AnalyticsConstants={AnalyticsConstants}
          activeScope={this.state.activeScope}
          activeType={this.state.activeType}
          initiateMode={this.initiateMode}
        />
        <div tabIndex={-1} className={classnames('pm-search-box-container', { 'is_focused': isSearchBoxFocused, 'is_user_signed_out': !CurrentUserDetailsService.isLoggedIn })} ref={this.popupRef} onBlur={this.handleBlur} onKeyDown={this.handleListKeyDown}>
          <div
            className={classnames('pm-search-box', { 'is_focused': isSearchBoxFocused })}
            ref={this.searchBoxRef}
            onMouseOver={this.handleMouseOver}
          >
            <SearchBoxInput
              ref={this.inputRef}
              inputStyle='search'
              query={searchQuery}
              value={searchQuery}
              badges={active_filter_badges}
              placeholder={this.getPlaceHolder()}
              onChange={this.handleChange}
              onFocus={this.handleFocus}
              onCancel={this.handleCancel}
              onEscape={this.handleEscape}
            />
          </div>
          {isSearchBoxFocused &&
            <div className='pm-search-box-popup'>
              <div className='pm-search-list'>
                {isPopupOpen ?
                  (loading ? this.getPopupLoader() :
                    (showFilterMenu ? this.getFilterMenu() :
                      (error ? this.getErrorPopup() : (
                        <React.Fragment>
                          {!hideSearchResults && this.getSearchResults()}
                          {showTypeFilters && this.getTypeFilters()}
                          {this.shouldDisplayRecentSearches() && this.getRecentSearchPopup()}
                        </React.Fragment>
                      ))
                    )
                  ) : null
                }
              </div>
            </div>
          }
        </div>
      </React.Fragment>
    );
  }
}


export default withLDConsumer()(SearchBox);
