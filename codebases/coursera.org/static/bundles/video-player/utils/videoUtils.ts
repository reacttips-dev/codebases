import _ from 'underscore';

import config from 'js/app/config';

import constants from 'pages/open-course/common/constants';

export const getDefaultVideoResolution = () => {
  if (_(constants.lowBandwidthCountries).contains(config.requestCountryCode)) {
    return constants.defaultLowBandwidthVideoPlayerResolution;
  } else {
    return constants.defaultNormalBandwidthVideoPlayerResolution;
  }
};

// Format resolutions into the format expected by VideoJS's resolutions plugin.
export const formatSourcesByResolution = (sources: $TSFixMe) => {
  const sourcesByResolution = {};
  _(sources).each(function (resolutionSources, resolution) {
    // @ts-ignore ts-migrate(7053) FIXME: Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
    sourcesByResolution[resolution] = _(resolutionSources).map(function (src, type) {
      return { type, src };
    });
  });
  return sourcesByResolution;
};
