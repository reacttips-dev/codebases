'use es6';

import ReportingPost from '../../data/model/ReportingPost';
import ReportingPostManager from '../../data/ReportingPostManager';
import { getUser } from '../selectors/user';
import actionTypes from './actionTypes';
var reportingPostManager = ReportingPostManager.getInstance();
export var fetchSinglePostByParams = function fetchSinglePostByParams(channelSlug, channelId, foreignId) {
  return function (dispatch, getState) {
    dispatch({
      type: actionTypes.REPORTING_POST_FETCH_BEGAN
    });
    var locale = getUser(getState()).locale;
    return reportingPostManager.fetchSinglePostByParams(channelSlug, channelId, foreignId, locale).then(function (data) {
      dispatch({
        type: actionTypes.REPORTING_POST_FETCH_SUCCESS,
        data: new ReportingPost.createFrom(data)
      });
    }).catch(function (error) {
      dispatch({
        type: actionTypes.REPORTING_POST_FETCH_ERROR,
        error: error
      });
    });
  };
};