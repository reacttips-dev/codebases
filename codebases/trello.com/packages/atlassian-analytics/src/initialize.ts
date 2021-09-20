import { Analytics } from './AnalyticsClient';
import { isEmbeddedDocument } from '@trello/browser';
import { memberId } from '@trello/session-cookie';
import { tenantType, userType } from '@atlassiansox/analytics-web-client';

/*
 * list populated from bitbucket names in server at
 * https://bitbucket.org/trello/server/src/b899043498abd922d9a633a7fce88bcf3362ba3f/conf/trellis.defaults.js?fileviewer=file-view-default#trellis.defaults.js-449:465
 */
const emauEmbeddedAllowlist = ['bb', 'bb-staging', 'bb-bello', 'bb-bello-dev'];

// TODO: This is a good candidate for @trello/url
export const getQueryParam = (name: string): string | null => {
  const search = new URLSearchParams(location.search);
  if (search.has(name)) {
    return search.get(name);
  }

  if (location.hash.length) {
    const hash = new URLSearchParams(location.hash.substr(1));
    if (hash.has(name)) {
      return hash.get(name);
    }
  }

  return null;
};

export const initialize = () => {
  const emauEmbeddable = emauEmbeddedAllowlist.includes(
    getQueryParam('iframeSource') || '',
  );

  Analytics.setTenantInfo(tenantType.NONE);

  if (memberId) {
    Analytics.setUserInfo(userType.TRELLO, memberId);

    if (!isEmbeddedDocument() || emauEmbeddable) {
      Analytics.startUIViewedEvent();
    }
  }
};
