import UserAgent from 'js/lib/useragent';
import inServerContext from 'bundles/ssr/util/inServerContext';

export const isVideoHighlightingEnabled = (courseId: string): boolean => {
  if (inServerContext) {
    return false;
  }

  const userAgentInfo = new UserAgent(navigator.userAgent);
  const isIE = userAgentInfo.browser && userAgentInfo.browser.name === 'IE';
  const isEdge = userAgentInfo.browser && userAgentInfo.browser.name === 'Edge';

  // Feature is not supported on IE or Edge
  if (isIE || isEdge) {
    return false;
  }

  return true;
};
