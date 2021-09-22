import queryString from "query-string";
import { IFilters } from "../types/IFilters";
import { IGlobalSearchQueryParams } from "../types/IGlobalSearchQueryParams";
import { SearchScope } from "../types/SearchScope";

// Generates the search query params for the GlobalNavigation-web search endpoint.
// This is mostly the same as the params generated for home-web search, except for the
// type query param.
// Also, auto-search results impose a limit of 5 items only
const generateGlobalSearchQueryParams = (filters: IFilters) => {
  if (!filters) {
    return "";
  }

  const { keywords, tags } = filters;
  let params: IGlobalSearchQueryParams = {
    includeAssetURLs: true,
  };

  // SpaceID
  if (tags && tags.length > 0) {
    let spaceID: Array<string> = [];
    let projectID: Array<string> = [];

    tags.forEach((tag) => {
      if (tag.scope === SearchScope.space && tag.id) {
        spaceID.push(tag.id);
      }

      if (tag.scope === SearchScope.project && tag.id) {
        projectID.push(tag.id);
      }
    });

    if (projectID.length > 0) {
      params.projectID = projectID;
    } else if (spaceID.length > 0) {
      params.spaceID = spaceID;
    }
  }

  if (keywords && keywords.length > 0) {
    // Note that the query-string npm also properly html encodes query params,
    // so no need to use encodeURIComponent to encode the search term
    params.search = keywords;
  }

  // Show 5 most relevant results only
  if (Object.keys(params).length > 1) {
    params.limit = 5;
  }

  return queryString.stringify(params, {
    skipNull: true,
    skipEmptyString: true,
  });
};

export default generateGlobalSearchQueryParams;
