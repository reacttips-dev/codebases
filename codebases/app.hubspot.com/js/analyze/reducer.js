'use es6';

import ChannelAnalytics from '../reports/models/ChannelAnalytics';
import { CHANNEL_ANALYTICS_FETCH_BEGAN, CHANNEL_ANALYTICS_FETCH_ERROR, CHANNEL_ANALYTICS_FETCH_SUCCESS } from './youtube/actions/ActionTypes';
var defaultState = {
  channelAnalytics: {}
};
export default (function () {
  var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : defaultState;

  var _ref = arguments.length > 1 ? arguments[1] : undefined,
      type = _ref.type,
      payload = _ref.payload;

  switch (type) {
    case CHANNEL_ANALYTICS_FETCH_BEGAN:
      {
        var meta = payload.meta;
        var channelAnalytics = state.channelAnalytics;
        var ca = channelAnalytics[meta.channelId];

        if (!ca) {
          ca = new ChannelAnalytics({
            fetchStatus: 'loading'
          });
        }

        ca = ca.set('fetchStatus', 'loading');
        channelAnalytics = Object.assign({}, channelAnalytics);
        channelAnalytics[meta.channelId] = ca;
        return Object.assign({}, state, {
          channelAnalytics: channelAnalytics
        });
      }

    case CHANNEL_ANALYTICS_FETCH_SUCCESS:
      {
        var _meta = payload.meta,
            data = payload.data;
        var _channelAnalytics = state.channelAnalytics;
        _channelAnalytics = Object.assign({}, _channelAnalytics);
        _channelAnalytics[_meta.channelId] = data;
        return Object.assign({}, state, {
          channelAnalytics: _channelAnalytics
        });
      }

    case CHANNEL_ANALYTICS_FETCH_ERROR:
      {
        var _channelAnalytics2 = state.channelAnalytics;
        var _meta2 = payload.meta;
        var _ca = _channelAnalytics2[_meta2.channelId];
        _ca = _ca.set('fetchStatus', 'error');
        _channelAnalytics2 = Object.assign({}, _channelAnalytics2);
        _channelAnalytics2[_meta2.channelId] = _ca;
        return Object.assign({}, state, {
          channelAnalytics: _channelAnalytics2
        });
      }

    default:
      return state;
  }
});