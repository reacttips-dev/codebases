'use es6';

import http from 'hub-http/clients/apiClient';
import Campaign from '../../data/model/Campaign';
import actionTypes from './actionTypes';
export var fetchCampaigns = function fetchCampaigns() {
  return function (dispatch) {
    return dispatch({
      type: actionTypes.CAMPAIGNS_FETCH,
      apiRequest: function apiRequest() {
        return http.get('campaigns/v1/campaigns').then(function (data) {
          return Campaign.createFromArray(data);
        });
      }
    });
  };
};