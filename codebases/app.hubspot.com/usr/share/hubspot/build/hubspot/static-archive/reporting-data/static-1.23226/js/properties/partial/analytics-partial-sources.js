'use es6';

import { Map as ImmutableMap, List } from 'immutable';
import prefix from '../../lib/prefix';
import convertPropertiesToOptions from '../convertPropertiesToOptions';
var translate = prefix('reporting-data');

var sourcesGroup = function sourcesGroup() {
  return ImmutableMap({
    name: 'sources',
    displayName: translate('groups.sources.sources'),
    displayOrder: 0,
    hubspotDefined: true,
    // Should these be metrics instead?
    properties: List([ImmutableMap({
      name: 'direct',
      type: 'string',
      label: translate('properties.sessions.direct')
    }), ImmutableMap({
      name: 'email',
      type: 'enumeration',
      label: translate('properties.sessions.email')
    }), ImmutableMap({
      name: 'offline',
      type: 'string',
      label: translate('properties.sessions.offline')
    }), ImmutableMap({
      name: 'organic',
      type: 'string',
      label: translate('properties.sessions.organic')
    }), ImmutableMap({
      name: 'social',
      type: 'string',
      label: translate('properties.sessions.social')
    }), ImmutableMap({
      name: 'paid',
      type: 'string',
      label: translate('properties.sessions.paid')
    }), ImmutableMap({
      name: 'referrals',
      type: 'string',
      label: translate('properties.sessions.referrals')
    }), ImmutableMap({
      name: 'paid-social',
      type: 'string',
      label: translate('properties.sessions.paid-social')
    }), ImmutableMap({
      name: 'other',
      type: 'string',
      label: translate('properties.sessions.other')
    })])
  });
};

var engines = function engines() {
  return List([ImmutableMap({
    value: 'GOOGLE',
    type: 'string',
    label: translate('search-engines.google')
  }), ImmutableMap({
    value: 'MSN',
    type: 'string',
    label: translate('search-engines.msn')
  }), ImmutableMap({
    value: 'YAHOO',
    type: 'string',
    label: translate('search-engines.yahoo')
  }), ImmutableMap({
    value: 'AOL',
    type: 'string',
    label: translate('search-engines.aol')
  }), ImmutableMap({
    value: 'ASK',
    type: 'string',
    label: translate('search-engines.ask')
  }), ImmutableMap({
    value: 'BING',
    type: 'string',
    label: translate('search-engines.bing')
  }), ImmutableMap({
    value: 'GOOGLE_IMAGES',
    type: 'string',
    label: translate('search-engines.google-images')
  }), ImmutableMap({
    value: 'YANDEX',
    type: 'string',
    label: translate('search-engines.yandex')
  }), ImmutableMap({
    value: 'BAIDU',
    type: 'string',
    label: translate('search-engines.baidu')
  }), ImmutableMap({
    value: 'LYCOS',
    type: 'string',
    label: translate('search-engines.lycos')
  }), ImmutableMap({
    value: 'DUCKDUCKGO',
    type: 'string',
    label: translate('search-engines.duckduckgo')
  })]);
};

export default (function () {
  return List([sourcesGroup(), ImmutableMap({
    name: 'sourceInfo',
    displayName: translate('groups.sources.sourceInfo'),
    displayOrder: 0,
    hubspotDefined: true,
    properties: List([ImmutableMap({
      name: 'source',
      type: 'enumeration',
      label: translate('properties.sessions.source'),
      options: convertPropertiesToOptions(sourcesGroup().get('properties'))
    }), ImmutableMap({
      name: 'keyword',
      type: 'string',
      label: translate('properties.sessions.keyword')
    }), ImmutableMap({
      name: 'searchEngine',
      type: 'enumeration',
      label: translate('properties.sessions.searchEngine'),
      options: engines()
    }), ImmutableMap({
      name: 'emailCampaign',
      type: 'string',
      label: translate('properties.sessions.emailCampaign')
    }), ImmutableMap({
      name: 'emailId',
      type: 'enumeration',
      label: translate('properties.sessions.email')
    }), ImmutableMap({
      name: 'paidCampaign',
      type: 'string',
      label: translate('properties.sessions.campaign')
    }), ImmutableMap({
      name: 'paidTerm',
      type: 'string',
      label: translate('properties.sessions.term')
    }), ImmutableMap({
      name: 'socialNetwork',
      type: 'string',
      label: translate('properties.sessions.site')
    }), ImmutableMap({
      name: 'socialCampaign',
      type: 'string',
      label: translate('properties.sessions.campaign')
    }), ImmutableMap({
      name: 'paidSocialNetwork',
      type: 'string',
      label: translate('properties.sessions.site')
    }), ImmutableMap({
      name: 'paidSocialCampaign',
      type: 'string',
      label: translate('properties.sessions.campaign')
    }), ImmutableMap({
      name: 'otherCampaign',
      type: 'string',
      label: translate('properties.sessions.campaign')
    }), ImmutableMap({
      name: 'sourceMedium',
      type: 'string',
      label: translate('properties.sessions.sourceMedium')
    }), ImmutableMap({
      name: 'referrer',
      type: 'string',
      label: translate('properties.sessions.referrer')
    }), ImmutableMap({
      name: 'referUrl',
      type: 'string',
      label: translate('properties.sessions.url')
    }), ImmutableMap({
      name: 'offlineSource',
      type: 'string',
      label: translate('properties.sessions.source')
    }), ImmutableMap({
      name: 'integrationsPlatform',
      type: 'enumeration',
      label: translate('properties.sessions.integrationsPlatform')
    }), ImmutableMap({
      name: 'entranceUrl',
      type: 'string',
      label: translate('properties.sessions.entranceUrl')
    })])
  })]);
});