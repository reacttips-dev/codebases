export interface QueryParams {
    [param: string]: string;
}

export const parseQueryString = (queryString: string): QueryParams => {
    const params = {};
    // Split into key/value pairs
    if (!queryString.startsWith("?")) {
        return params;
    }
    const queries = queryString.substring(1).split("&");
    // Convert the array of strings into an object
    return queries.reduce((acc, pair) => {
        const [key, value] = pair.split("=");
        return {
            ...acc,
            [key]: decodeURIComponent(value),
        };
    }, {});
};

export const buildQueryString = (queryParams: {[key: string]: string}): string =>
    queryParams && Object.keys(queryParams).length > 0
        ? "?" +
          Object.keys(queryParams)
              .map((key) => key + "=" + queryParams[key])
              .join("&")
        : "";

export const generateQueryParamMap = (queryParams) =>
    // Converts the url into small subparts
    queryParams
        .replace("?", "")
        .split("&")
        .reduce((acc, queryParam, index) => {
            const entry = queryParam.split("=");
            const key = entry[0];
            const value = entry[1];
            acc[key] = value;
            return acc;
        }, {});
