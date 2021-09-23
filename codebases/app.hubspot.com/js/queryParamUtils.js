'use es6';

import { CMS_PROFESSIONAL, OPERATIONS_PROFESSIONAL } from 'self-service-api/constants/UpgradeProducts';
import { parse } from 'hub-http/helpers/params';
import { ACTIVE_BANNER_TYPES, EXPIRED_BANNER_TYPES } from './BannerTypes';
import { MARKETING_PRO, SALES_PROFESSIONAL } from 'self-service-api/constants/UpgradeProducts';
import Raven from 'Raven';
import { TRIAL_STATUS_TYPES } from 'ui-addon-upgrades/_core/trial/constants';

var _queryParams = parse(window.location.search.substring(1));

var _root = _queryParams.root;

function fixTrialName(trial) {
  // Temporary hack bc the "cms" upgradeProduct has been deprecated, but the BE has not renamed "cms" trials to "cms-professional"
  // See issue https://git.hubteam.com/HubSpot/Trials/issues/266
  var trialName = trial.trialName === 'cms' ? CMS_PROFESSIONAL : trial.trialName;
  var rawTrialName = trial.trialName;
  return Object.assign({}, trial, {
    trialName: trialName,
    rawTrialName: rawTrialName
  });
} // exported for testing purposes


export function _getFrameProps(queryParams) {
  try {
    var trialBannerState = JSON.parse(queryParams.trialState).map(fixTrialName);
    var preferredTrial = trialBannerState[0];
    return {
      trialBannerState: trialBannerState,
      preferredTrial: preferredTrial
    };
  } catch (e) {
    Raven.captureMessage('Error parsing frame props', {
      extra: {
        queryParams: queryParams,
        e: e
      }
    });
    return {};
  }
}
export var frameProps = _getFrameProps(_queryParams);
export function getTrialFromTrialState(upgradeProduct) {
  return frameProps.trialBannerState.find(function (trial) {
    return trial.trialName === upgradeProduct;
  });
}
export var isTrialActive = function isTrialActive(status) {
  return status === TRIAL_STATUS_TYPES.ACTIVE || status === TRIAL_STATUS_TYPES.EXPIRING_SOON;
};
export function determineTrialBannerType(trial) {
  var trialName = trial.trialName;
  var isActive = isTrialActive(trial.status);
  var isInternalBannerType = trial.type === 'DEVELOPER_TRIAL' || trialName === 'transactional-email';

  if (isInternalBannerType) {
    return isActive ? ACTIVE_BANNER_TYPES.ACTIVE_INTERNAL : EXPIRED_BANNER_TYPES.EXPIRED_INTERNAL;
  }

  if (trialName === MARKETING_PRO) {
    return isActive ? ACTIVE_BANNER_TYPES.ACTIVE_MARKETING_PRO : EXPIRED_BANNER_TYPES.EXPIRED_MARKETING_PRO;
  }

  if (trialName === OPERATIONS_PROFESSIONAL) {
    return isActive ? ACTIVE_BANNER_TYPES.ACTIVE_OPERATIONS_PROFESSIONAL : EXPIRED_BANNER_TYPES.EXPIRED_OPERATIONS_PROFESSIONAL;
  }

  if (trialName === SALES_PROFESSIONAL && isActive) {
    return ACTIVE_BANNER_TYPES.ACTIVE_SALES_PROFESSIONAL;
  }

  return isActive ? ACTIVE_BANNER_TYPES.ACTIVE_TALK_TO_SALES : EXPIRED_BANNER_TYPES.EXPIRED_TALK_TO_SALES;
}
export var screen = _root;
export var app = 'trial-banner';
export var boxShadow = "0 30px 30px 0 rgba(0, 0, 0, 0.11), 0 15px 15px 0 rgba(0, 0, 0, 0.08)";
export function getAppContext(upgradeProduct) {
  if (upgradeProduct !== MARKETING_PRO) {
    return null;
  }

  var trial = getTrialFromTrialState(upgradeProduct);

  if (trial && trial.context) {
    return trial.context;
  }

  switch (_root) {
    case 'campaigns':
      return 'CAMPAIGNS';

    case 'workflows':
      return 'WORKFLOWS';

    case 'analytics':
    case 'reports-list':
    case 'reports-dashboard':
      return 'REPORTING';

    default:
      return null;
  }
}