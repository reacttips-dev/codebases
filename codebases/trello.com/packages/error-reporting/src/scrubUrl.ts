import urlParse from 'url-parse';
import { routes, orderedRouteList } from '@trello/routes';

const applyMatchers = (url: string): string => {
  // let's remove the starting slash to allow our matchers to use ^ properly
  const partialUrl = url.substr(1, url.length);

  for (const { regExp, pattern } of orderedRouteList) {
    if (partialUrl.match(regExp)) {
      return pattern;
    }
  }

  return routes.errorPage.pattern;
};

export const scrubUrl = (url: string) => {
  let parsedUrl;
  try {
    // This is a little bit of a hack, it's really hard to actually get
    // `url-parse` to throw an error, so instead we set the default base URL to
    // be the fallback - if parsing fails the fallback URL will be the parsed URL
    parsedUrl = urlParse(url, routes.errorPage.pattern);
  } catch (ex) {
    // we can't log the original URL or message because we could end up with
    // UGC, so we return a safe fallback URL so we don't lose the error
    return routes.errorPage.pattern;
  }

  const partialUrl = `${parsedUrl.pathname}${parsedUrl.query}`;
  const result = applyMatchers(partialUrl);

  return parsedUrl.protocol && parsedUrl.host
    ? `${parsedUrl.protocol}//${parsedUrl.host}/${result}`
    : `/${result}`;
};
