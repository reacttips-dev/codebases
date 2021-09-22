import { GET_PROJECTS_IDS } from "./serverUrls";
import queryString from "query-string";
import api from "./api";

const fetchProjectsId = async (ids: Array<string>) => {
  if (!ids || ids.length === 0) {
    return Promise.resolve({ requestTime: 0 });
  }

  let query = {
    ids,
    includeDocumentCounts: true,
  };

  const queryParams = queryString.stringify(query);

  return api(`${GET_PROJECTS_IDS}?${queryParams}`, {
    method: "GET",
    headers: new Headers({ "Content-Type": "application/json" }),
  });
};

export default fetchProjectsId;
