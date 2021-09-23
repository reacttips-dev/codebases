'use es6';

import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import http from 'hub-http/clients/apiClient';
import I18n from 'I18n';
import { AD_CAMPAIGN_STATUSES } from '../lib/constants';

var AdManager = /*#__PURE__*/function () {
  function AdManager(client) {
    _classCallCheck(this, AdManager);

    this.client = client;
  }

  _createClass(AdManager, [{
    key: "fetchCampaigns",
    value: function fetchCampaigns(networkAccountIds) {
      var now = I18n.moment(); // The /all-campaigns endpoint returns reporting data, which we don't
      // consume in the context of the boost and broadcast details panels.
      // At some point, it'd be nice to get a specific endpoint for only
      // retrieving entity data, but for now, default to retieving a single
      // day of data (to cut down on the time it takes for the call to finish).

      return this.client.get('ads/v1/reports/all-campaigns', {
        query: Object.assign({
          status: Object.keys(AD_CAMPAIGN_STATUSES),
          from: now.clone().subtract(1, 'days').valueOf(),
          to: now.valueOf()
        }, networkAccountIds)
      });
    }
  }, {
    key: "fetchBoostedPosts",
    value: function fetchBoostedPosts(__foreignIds) {
      return this.client.get('ads/v1/facebook/boosted-posts');
    }
  }], [{
    key: "getInstance",
    value: function getInstance() {
      return new AdManager(http);
    }
  }]);

  return AdManager;
}();

export { AdManager as default };