import generateGlobalSearchQueryParams from "./generateGlobalSearchQueryParams";
import { GET_SEARCH } from "./serverUrls";
import { IFilters } from "../types/IFilters";
import api from "./api";

const fetchSearch = async (filters: IFilters) => {
  if (!filters) {
    return Promise.resolve({ requestTime: 0 });
  }

  // Do no search if less than 1 char
  const keywords = filters?.keywords;
  if (!keywords || keywords?.length === 0) {
    return Promise.resolve({});
  }

  const params = generateGlobalSearchQueryParams(filters);
  const queryParams = params.length > 0 ? `?${params}` : "";

  return await api(`${GET_SEARCH}${queryParams}`, {
    method: "GET",
    headers: new Headers({ "Content-Type": "application/json" }),
  });
};

export default fetchSearch;
