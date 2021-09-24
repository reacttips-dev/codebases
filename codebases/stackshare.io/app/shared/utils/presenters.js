import {stripURL} from './strip-text';

export const toolsPresenter = (key, tools) => {
  if (tools) {
    return {
      [key + '.total']: tools.length,
      [key + '.name']: tools.map(t => t.name),
      [key + '.id']: tools.map(t => t.id),
      [key + '.following']: tools.map(t => t.following),
      [key + '.followContext']: tools.map(t => t.followContext),
      [key + '.canonicalUrl']: tools.map(t => t.canonicalUrl)
    };
  }
  return {};
};

export const linkPresenter = (key, linkUrl) => {
  if (linkUrl) {
    return {
      [key + '.url']: linkUrl,
      [key + '.trimmedUrl']: stripURL(linkUrl)
    };
  }
  return {};
};
