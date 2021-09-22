import React, { RefObject, useRef, useCallback } from "react";
import theme, { colors } from "@invisionapp/helios/css/theme";

import styled from "styled-components";
import cx from "classnames";
import queryString from "query-string";
import { ThemeProvider } from "styled-components";
import { Search as SearchIcon } from "@invisionapp/helios/icons";

import SearchInput from "./SearchInput";
import SearchTagList from "./SearchTagList";
import { useGlobalSearchUiContext } from "./GlobalSearchUiProvider";

import { SearchTagType } from "../types/SearchTagType";
import { SearchUrlQueryParams } from "../types/SearchUrlQueryParams";

import navigate from "../utils/navigate";
import mapPaths from "../utils/mapPaths";
import trackEvent from "../utils/analytics";
import useOnClickOutside from "../utils/hooks/useOnClickOutside";
import { SearchScope } from "../types/SearchScope";

const StylesSearchIcon = styled(SearchIcon)`
   {
    flex-grow: 0;
    flex-shrink: 0;
  }
`;

const StyledGlobalSearchUi = styled.div`
  display: flex;
  align-items: center;
  height: 100%;
  width: calc(100% - 36px);
  cursor: text;

  @media (max-width: ${theme.breakpoints.m - 1}px) {
    display: none;
  }

  @media (min-width: ${theme.breakpoints.m}px) and (max-width: ${theme
      .breakpoints.l + 280}px) {
    &:focus-within,
    &.has-search-term {
      top: 0;
      position: absolute;
      background: ${colors.white};
      z-index: ${theme.zindex.global};
      width: calc(100% - 78px);
    }
  }
`;

const GlobalSearchUi = () => {
  const {
    keywords,
    tags,
    setTags,
    viewType,
    hasFocus,
    setHasFocus,
    isLastTagActive,
    setSelectedSearchOption,
  } = useGlobalSearchUiContext();

  // Track clicks outrside the global search
  const ref: RefObject<HTMLElement> = useRef() as React.MutableRefObject<
    HTMLElement
  >;
  const onClickOutside = useCallback(
    (e: MouseEvent) => {
      // Ignore clicks on tag close button
      let tagName: string = (e.target as HTMLElement)?.tagName;
      tagName = tagName ? tagName.toLowerCase() : "";
      if (tagName === "svg" || tagName === "path") {
        e.stopPropagation();
        e.preventDefault();

        return;
      }

      setHasFocus(false);
      setSelectedSearchOption(-1);
    },
    [setHasFocus, setSelectedSearchOption]
  );
  useOnClickOutside(ref, onClickOutside);

  // Internal handlers
  const handleOnClick = (e: React.MouseEvent<HTMLElement>): void => {
    if (!hasFocus) {
      let pageContext = mapPaths(window.location?.pathname);
      if (pageContext === "search") {
        pageContext =
          viewType === "spaces" ? "search-spaces" : "search-documents";
      }

      trackEvent("App.Search.Selected", {
        pageContext,
      });

      setHasFocus(true);
    }

    // Unselect any option from quick results
    setSelectedSearchOption(-1);
  };

  const handleRemoveTag = (index: number): void => {
    const updatedTags: SearchTagType[] = tags;
    updatedTags.splice(index, 1);

    // Force re-render by regenerating an array with the updated values
    setTags([...updatedTags]);

    // Force a new search if in search view
    if (viewType === "search") {
      onSubmitSearch(keywords);
    }
  };

  const getFilteredTags = (filterScope: SearchScope) => {
    if (tags) {
      return tags
        .filter(
          ({ id, scope }) =>
            id && typeof id !== "undefined" && scope === filterScope
        )
        .map(({ id }) => id);
    }

    return [];
  };

  const onSubmitSearch = (
    search: string,
    method?: string,
    openInNewWindow?: boolean
  ) => {
    let searchQueryParams: SearchUrlQueryParams = {};

    // build target url based on search filters
    if (tags) {
      const spaceID = getFilteredTags(SearchScope.space);
      const projectID = getFilteredTags(SearchScope.project);

      if (projectID.length > 0) {
        searchQueryParams.projectID = projectID;
      } else if (spaceID.length > 0) {
        searchQueryParams.spaceID = spaceID;
      }
    }

    // No need to encode the search querey, as query-string by default html encodes query params
    searchQueryParams.search = search;
    if (viewType === "spaces") {
      searchQueryParams.types = "spaces";
    }

    const queryParams = queryString.stringify(Object(searchQueryParams));
    const targetUrl = `/search/${
      queryParams.length > 0 ? `?${queryParams}` : ""
    }`;

    let pageContext = mapPaths(window.location?.pathname);
    if (pageContext === "search") {
      pageContext =
        viewType === "spaces" ? "search-spaces" : "search-documents";
    }

    trackEvent("App.Search.Submitted", {
      pageContext,
      projectFilter:
        !!searchQueryParams.projectID && searchQueryParams.projectID.length > 0,
      spaceFilter:
        !!searchQueryParams.spaceID && searchQueryParams.spaceID.length > 0,
      method: method || "search-bar",
    });

    navigate(targetUrl, !!openInNewWindow);
    setHasFocus(false);
  };

  return (
    <ThemeProvider theme={theme}>
      <StyledGlobalSearchUi
        data-testid="global-search-ui"
        onClick={handleOnClick}
        className={cx({ "has-search-term": keywords.length > 0 })}
        ref={ref as RefObject<HTMLDivElement>}
      >
        <StylesSearchIcon fill="text-lightest" />
        <SearchTagList
          hasFocus={hasFocus}
          tags={tags}
          onRemove={handleRemoveTag}
          keepVisible={viewType === "search"}
          isLastTagActive={isLastTagActive}
        />
        <SearchInput onSubmitSearch={onSubmitSearch} />
      </StyledGlobalSearchUi>
    </ThemeProvider>
  );
};

export default GlobalSearchUi;
