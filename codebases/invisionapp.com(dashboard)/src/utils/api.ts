const api = async (url: string, params: any = {}) => {
  params.credentials = "include";

  const GLOBAL_SEARCH_UI = "global-search-ui";
  if (params.hasOwnProperty("headers")) {
    params.headers.set("Request-Source", GLOBAL_SEARCH_UI);
    params.headers.set("Calling-Service", GLOBAL_SEARCH_UI);
    params.headers.set("Request-ID", GLOBAL_SEARCH_UI);
  } else {
    params.headers = new window.Headers({
      "Request-Source": GLOBAL_SEARCH_UI,
      "Calling-Service": GLOBAL_SEARCH_UI,
      "Request-ID": GLOBAL_SEARCH_UI,
    });
  }

  async function fetchUrl(url: string) {
    if (!url) {
      return Promise.reject("url is required");
    }

    const beginFetch = window.performance.now();
    const response = await fetch(url, params);
    const endFetch = window.performance.now();

    if (response.ok) {
      const json = await response.json();
      json.requestTime = endFetch - beginFetch;
      return json;
    }

    return Promise.reject("error fetching");
  }

  return await fetchUrl(url);
};

export default api;
