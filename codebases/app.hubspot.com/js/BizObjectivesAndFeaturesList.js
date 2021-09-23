'use es6';

import { jsx as _jsx } from "react/jsx-runtime";
import ApiNameToBizObjectives from 'self-service-api/constants/ApiNameToBizObjectives';
import BizObjectivesMap from 'self-service-api/constants/BizObjectivesMap';
import BizObjective from './BizObjective';
import UIList from 'UIComponents/list/UIList';
import FeatureLink from './FeatureLink';
import Raven from 'Raven';
import UpgradeProductToApiNameMap from 'self-service-api/constants/UpgradeProductToApiNameMap';
import FeaturesMap from 'self-service-api/constants/FeaturesMap';
import memoize from 'hs-lodash/memoize';
export var filterOutFeaturesWithNoLink = memoize(function (feature) {
  if (!FeaturesMap[feature]) {
    Raven.captureMessage('Missing FeaturesMap definition for given feature', {
      extra: {
        feature: feature
      }
    });
    return false;
  }

  if (FeaturesMap[feature].hrefNotAvailable) {
    return false;
  }

  if (!FeaturesMap[feature].href) {
    Raven.captureMessage('Missing link for given feature', {
      extra: {
        feature: feature
      }
    });
    return false;
  }

  return true;
});

var BizObjectivesAndFeaturesList = function BizObjectivesAndFeaturesList(_ref) {
  var upgradeProduct = _ref.upgradeProduct;
  var apiName = UpgradeProductToApiNameMap[upgradeProduct];
  var bizObjectives = ApiNameToBizObjectives[apiName];

  if (!apiName || !bizObjectives) {
    Raven.captureMessage('Unexpected upgrade product', {
      extra: {
        upgradeProduct: upgradeProduct
      }
    });
    return null;
  }

  return bizObjectives.map(function (bizObj) {
    var filteredFeatures = BizObjectivesMap[bizObj].features.filter(filterOutFeaturesWithNoLink);

    if (!filteredFeatures.length) {
      return null;
    }

    return /*#__PURE__*/_jsx(BizObjective, {
      bizObjective: bizObj,
      children: /*#__PURE__*/_jsx(UIList, {
        childClassName: "m-bottom-2",
        children: filteredFeatures.map(function (feature) {
          return /*#__PURE__*/_jsx(FeatureLink, {
            feature: feature
          }, feature);
        })
      })
    }, bizObj);
  });
};

export default BizObjectivesAndFeaturesList;