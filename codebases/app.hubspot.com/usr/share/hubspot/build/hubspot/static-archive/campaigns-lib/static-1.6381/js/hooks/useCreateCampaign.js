'use es6';

import _slicedToArray from "@babel/runtime/helpers/esm/slicedToArray";
import I18n from 'I18n';
import { useState, useCallback } from 'react';
import CampaignRecord from 'campaigns-lib/data/CampaignRecord';
import { createCampaign } from 'campaigns-lib/data/CampaignDao';
import { getCampaignRenamingErrorType } from 'campaigns-lib/util/campaignName';

var parseCampaignCreationError = function parseCampaignCreationError(error) {
  try {
    var data = JSON.parse(error.data);
    var message;

    if (error.status === 406) {
      message = I18n.text('campaignsLib.errors.invalidCharacters.message');
    } else if (error.status === 409) {
      var errorKey = getCampaignRenamingErrorType(error);
      message = I18n.text("campaignsLib.errors." + errorKey + ".message");
    } else {
      message = data.message || '';
    }

    return message;
  } catch (e) {
    return null;
  }
};

export default function useCreateCampaign(_ref) {
  var showError = _ref.showError;

  var _useState = useState(false),
      _useState2 = _slicedToArray(_useState, 2),
      loading = _useState2[0],
      setLoading = _useState2[1];

  var _useState3 = useState(false),
      _useState4 = _slicedToArray(_useState3, 2),
      failed = _useState4[0],
      setFailed = _useState4[1];

  var onCreateCampaign = useCallback(function (campaignData) {
    setLoading(true);
    setFailed(false);
    var newCampaign = new CampaignRecord(campaignData).toJS();
    return createCampaign(newCampaign).then(function (createdCampaign) {
      if (!createdCampaign) {
        throw new Error('Did not receive created campaign');
      }

      return createdCampaign;
    }).catch(function (error) {
      showError(parseCampaignCreationError(error));
      setFailed(true);
      throw error;
    }).finally(function () {
      return setLoading(false);
    });
  }, [showError]);
  return {
    loading: loading,
    failed: failed,
    createCampaign: onCreateCampaign
  };
}