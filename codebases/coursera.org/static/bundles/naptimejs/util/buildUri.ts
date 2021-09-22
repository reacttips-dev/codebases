import Uri from 'jsuri';

/**
 * Given a base Uri object and an object of parameters, build the final url
 * @param  {Uri} baseUri    base url
 * @param  {object} params  query parameters
 * @return {Uri}            constructed url with parameters
 */
export default (baseUri: Uri, params: { [key: string]: string }): Uri => {
  Object.keys(params || {}).forEach((paramKey) => {
    const paramValue = params[paramKey];
    if (typeof paramValue === 'undefined') {
      const error = new Error('missing value for param key ' + paramKey);
      Object.assign(error, { pathname: baseUri.path() });
      throw error;
    }
    baseUri.addQueryParam(paramKey, paramValue.toString());
  });

  return baseUri;
};
