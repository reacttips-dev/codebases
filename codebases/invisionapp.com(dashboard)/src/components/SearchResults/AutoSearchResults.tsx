import React, { useCallback, useEffect, useRef, memo } from "react";

import { useGlobalSearchUiContext } from "../GlobalSearchUiProvider";
import ResultsModal from "./ResultsModal";

import { IFilters } from "../../types/IFilters";

import debounce from "lodash/debounce";
import trackEvent from "../../utils/analytics";
import fetchSearch from "../../utils/fetchSearch";
import fetchResourcesDetail from "../../utils/fetchResourcesDetail";

import { SearchScope } from "../../types/SearchScope";
import { ISearchResource } from "../../types/SearchResults/ISearchResource";

export const shouldShowResultsModal = ({
  closeAutoSearchModal,
  searchResults,
  hasFocus,
  keywords,
}: {
  closeAutoSearchModal?: boolean;
  searchResults?: any;
  hasFocus: boolean;
  keywords?: string;
}) => {
  return (
    !closeAutoSearchModal &&
    searchResults.length > 0 &&
    hasFocus &&
    !!keywords &&
    keywords.length > 0
  );
};

const AutoSearchResults = ({
  onSubmitSearch,
}: {
  onSubmitSearch?: (
    keywords: string,
    method?: string,
    openInNewWindow?: boolean
  ) => void;
}) => {
  const {
    keywords,
    tags,
    selectedSearchOption,
    hasFocus,
    closeAutoSearchModal,
    setSearchResults,
    searchResults,
  } = useGlobalSearchUiContext();

  // Note we delay sending the analytics events until getAssetsDocumentsCounts is invoke.
  // This is done so that we can measure how long it took to fetch resources, assets and
  // spaceIds separately, in a single event.
  const getDocumentCounts = useCallback(
    ({
      resources,
      renderTime,
      searchFetchTime,
    }: {
      resources: Array<ISearchResource>;
      renderTime: number;
      searchFetchTime: number;
    }) => {
      const spaceFilter = tags
        ? tags.filter((tag) => tag.scope === SearchScope.space).length > 0
        : false;

      if (!resources || resources.length === 0) {
        setSearchResults([]);
        trackEvent("App.Search.Data.Fetched", {
          status: 200,
          timeToResourcesFetched: searchFetchTime,
          spacesIdsLoadTime: 0,
          renderTime: renderTime,
          permissionsLoadTime: 0,
          resourcesReturned: resources.length,
          requestPageCount: 1,
          pageSize: 5,
          pageContext: "search-quickList",
          sort: "relevance",
          spaceFilter,
        });
        return;
      }

      fetchResourcesDetail(resources)
        .then((results: any) => {
          const updatedResources = results.resources || [];
          if (updatedResources.length > 0) {
            setSearchResults(updatedResources);
          }

          trackEvent("App.Search.Data.Fetched", {
            status: 200,
            timeToResourcesFetched: searchFetchTime,
            spacesIdsLoadTime: results.fetchSpacesIdsRequestTime,
            renderTime: renderTime,
            permissionsLoadTime: 0,
            resourcesReturned: resources.length,
            requestPageCount: 1,
            pageSize: 5,
            pageContext: "search-quickList",
            sort: "relevance",
            spaceFilter,
          });
        })
        .catch((error) => {
          trackEvent("App.Search.Data.Fetched", {
            status: error,
            renderTime,
            timeToResourcesFetched: searchFetchTime,
            spacesIdsLoadTime: -1,
            permissionsLoadTime: -1,
            resourcesReturned: resources ? resources.length : 0,
            requestPageCount: 1,
            pageSize: 5,
            pageContext: "search-quickList",
            sort: "relevance",
            spaceFilter,
          });
        });
    },
    [setSearchResults, tags]
  );

  const getSearch = ({ keywords, tags }: IFilters) => {
    const renderStartTime = window.performance.now();

    // Nothing to search
    if (!keywords || keywords?.length === 0) {
      setSearchResults([]);
      return;
    }

    const spaceFilter = tags
      ? tags.filter((tag) => tag.scope === SearchScope.space).length > 0
      : false;

    return fetchSearch({ keywords, tags })
      .then((results: any) => {
        const resources = results.resources || [];
        const renderFinishTime = window.performance.now();

        // Track rendering and fetch times
        const renderTime = renderFinishTime - renderStartTime;
        const searchFetchTime = results.requestTime;

        // Finally, fetch document counts separately, and update the search results
        getDocumentCounts({ resources, searchFetchTime, renderTime });
      })
      .catch((error) => {
        const renderFinishTime = window.performance.now();
        const renderTime = renderFinishTime - renderStartTime;

        trackEvent("App.Search.Data.Fetched", {
          status: error,
          renderTime,
          timeToResourcesFetched: -1,
          spacesIdsLoadTime: -1,
          permissionsLoadTime: -1,
          resourcesReturned: -1,
          requestPageCount: -1,
          pageSize: -1,
          pageContext: "search-quickList",
          sort: "relevance",
          spaceFilter,
        });

        setSearchResults([]);
      });
  };

  // Use a single debounce function
  const thisRef = useRef(getSearch);
  const debounceGetSearch = useCallback(
    debounce(
      ({ keywords, tags }) => thisRef && thisRef.current({ keywords, tags }),
      200
    ),
    []
  );

  // Stringfy tags triggers the effect when the content a tag changes (ref. https://twitter.com/dan_abramov/status/1104414469629898754?lang=en)
  const stringifiedTag = JSON.stringify(tags);
  useEffect(() => {
    debounceGetSearch({ keywords, tags });
  }, [keywords, stringifiedTag, tags, debounceGetSearch]);

  const open = shouldShowResultsModal({
    closeAutoSearchModal,
    searchResults,
    hasFocus,
    keywords,
  });

  return (
    <ResultsModal
      open={open}
      searchResults={searchResults}
      selectedSearchOption={selectedSearchOption}
      keywords={keywords}
      onSubmitSearch={onSubmitSearch}
    />
  );
};

export default memo(AutoSearchResults);
