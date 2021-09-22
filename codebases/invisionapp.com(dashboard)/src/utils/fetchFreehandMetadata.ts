import { GET_FREEHAND_METADATA } from "./serverUrls";
import api from "./api";

const fetchFreehandMetadata = async (documentIds: Array<Array<string>>) => {
  if (documentIds && documentIds.length > 0) {
    const search = new URLSearchParams(documentIds).toString();

    return await api(`${GET_FREEHAND_METADATA}?${search}`, {
      method: "GET",
      headers: new Headers({
        "Content-Type": "application/json",
        "Calling-Service": "global-search-ui",
      }),
    });
  }

  return Promise.resolve({
    requestTime: 0,
  });
};

export default fetchFreehandMetadata;
