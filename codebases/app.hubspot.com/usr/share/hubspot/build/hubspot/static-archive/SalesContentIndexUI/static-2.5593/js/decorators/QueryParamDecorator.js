/* eslint-disable no-undefined */
'use es6';

import { jsx as _jsx } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import createReactClass from 'create-react-class';
import identity from 'transmute/identity';
import debounce from 'transmute/debounce';
import SearchDebounceDelay from 'SalesContentIndexUI/data/constants/SearchDebounceDelay';
import connect from 'SalesContentIndexUI/data/redux/connect';
import SearchActions from 'SalesContentIndexUI/data/actions/SearchActions';
import * as FilterTypes from 'SalesContentIndexUI/data/lib/FilterTypes';
export default (function (Component) {
  var RouteChangeHandler = createReactClass({
    displayName: "RouteChangeHandler",
    propTypes: {
      searchFromQueryParams: PropTypes.func.isRequired,
      getPage: PropTypes.func.isRequired,
      setSearchQuery: PropTypes.func.isRequired,
      setSort: PropTypes.func.isRequired,
      setSelectedFolder: PropTypes.func.isRequired,
      setViewFilter: PropTypes.func.isRequired
    },
    contextTypes: {
      router: PropTypes.object.isRequired,
      location: PropTypes.object.isRequired
    },
    UNSAFE_componentWillMount: function UNSAFE_componentWillMount() {
      this.debouncedUpdateRoute = debounce(SearchDebounceDelay, this.updateRoute);
    },
    componentDidMount: function componentDidMount() {
      this.unlisten = this.context.router.listen(this.listenToRouter);
    },
    componentWillUnmount: function componentWillUnmount() {
      this.unlisten();
    },
    listenToRouter: function listenToRouter(_ref) {
      var action = _ref.action,
          query = _ref.query;

      if (action !== 'POP') {
        return;
      }

      this.props.searchFromQueryParams({
        queryParams: query
      });
    },
    setQueryParam: function setQueryParam(query) {
      this.context.router.push({
        pathname: this.context.location.pathname,
        query: query
      });
    },
    updateRoute: function updateRoute(updatedQuery) {
      var _this$context$locatio = this.context.location,
          query = _this$context$locatio.query,
          pathname = _this$context$locatio.pathname;
      this.context.router.push({
        pathname: pathname,
        query: Object.assign({}, query, {}, updatedQuery)
      });
    },
    getPage: function getPage(page) {
      this.updateRoute({
        page: page + 1
      });
      this.props.getPage(page);
    },
    setSort: function setSort(_ref2) {
      var selectedSort = _ref2.selectedSort,
          resetSearch = _ref2.resetSearch;
      this.updateRoute(Object.assign({}, selectedSort.toJS(), {
        page: 1
      }));
      this.props.setSort({
        selectedSort: selectedSort,
        resetSearch: resetSearch
      });
    },
    setSelectedFolder: function setSelectedFolder(folderSearchResult) {
      this.updateRoute({
        folder: folderSearchResult && folderSearchResult.contentId,
        page: 1,
        q: undefined
      });
      this.props.setSelectedFolder(folderSearchResult);
    },
    setViewFilter: function setViewFilter(selectedViewFilter, id) {
      var queryParams = {
        view: selectedViewFilter.id,
        page: 1
      };

      if (selectedViewFilter.type !== FilterTypes.CUSTOM) {
        queryParams.type = selectedViewFilter.type;
      }

      this.setQueryParam(queryParams);
      this.props.setViewFilter(selectedViewFilter, id);
    },
    setSearchQuery: function setSearchQuery(query) {
      this.debouncedUpdateRoute({
        q: query,
        page: 1,
        folder: undefined,
        field: undefined,
        order: undefined
      });
      this.props.setSearchQuery(query);
    },
    render: function render() {
      return /*#__PURE__*/_jsx(Component, Object.assign({}, this.props, {
        getPage: this.getPage,
        setSort: this.setSort,
        setSelectedFolder: this.setSelectedFolder,
        setViewFilter: this.setViewFilter,
        setSearchQuery: this.setSearchQuery
      }));
    }
  });
  return connect(identity, SearchActions.get())(RouteChangeHandler);
});