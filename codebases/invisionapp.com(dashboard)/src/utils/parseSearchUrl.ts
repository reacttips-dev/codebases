import queryString from "query-string";
import { SearchUrlQueryParams } from "../types/SearchUrlQueryParams";

const parseSearchUrl = (search = ""): SearchUrlQueryParams => {
  try {
    const { query } = queryString.parseUrl(search);
    let searchQueryParams: SearchUrlQueryParams = {};

    if (query.search && query.search.length > 0) {
      const searchTerm = Array.isArray(query.search)
        ? query.search.join(" ")
        : query.search;

      // Note that query-string by default decodes query params so no need to apply
      // decodeURIComponent on the search term
      searchQueryParams.search = searchTerm;
    }

    return searchQueryParams;
  } catch (e) {
    console.error("Unable to parse search url, e");
    return {};
  }
};

export default parseSearchUrl;
