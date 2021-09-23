'use es6';

import _toConsumableArray from "@babel/runtime/helpers/esm/toConsumableArray";
import ReportingPost from '../data/model/ReportingPost';
import { OrderedMap, Set as ImmutableSet } from 'immutable';
import actionTypes from '../redux/actions/actionTypes';
import { POSTS_FETCH_BEGAN, POSTS_FETCH_SUCCESS, POSTS_UPDATE_CAMPAIGN_SUCCESS, POST_DELETE_SUCCESS } from './actionTypes';
import { BROADCAST_POSTS_FETCH_BEGAN, BROADCAST_POSTS_FETCH_SUCCESS, BROADCAST_POST_DELETE_SUCCESS } from '../broadcasts/actionTypes';
import Broadcast from '../data/model/Broadcast';
var defaultState = {
  broadcastPostsToDelete: new ImmutableSet(),
  broadcasts: new OrderedMap(),
  individuallyFetchedPost: null,
  posts: new OrderedMap(),
  postsToDelete: new ImmutableSet(),
  total: null
};
export default (function () {
  var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : defaultState;

  var _ref = arguments.length > 1 ? arguments[1] : undefined,
      type = _ref.type,
      payload = _ref.payload,
      data = _ref.data;

  switch (type) {
    case BROADCAST_POSTS_FETCH_BEGAN:
      return Object.assign({}, state);

    case POSTS_FETCH_BEGAN:
      return Object.assign({}, state);

    case BROADCAST_POSTS_FETCH_SUCCESS:
      return Object.assign({}, state, {
        posts: new OrderedMap(),
        broadcasts: new OrderedMap(payload.broadcasts.map(function (broadcastPost) {
          return [broadcastPost.broadcastGuid, Broadcast.createFrom(broadcastPost)];
        })),
        total: payload.total
      });

    case POSTS_FETCH_SUCCESS:
      return Object.assign({}, state, {
        broadcasts: new OrderedMap(),
        posts: new OrderedMap(payload.results.map(function (post) {
          return [post.id.toString(), new ReportingPost.createFrom(post)];
        })),
        total: payload.total
      });

    case actionTypes.REPORTING_POST_FETCH_SUCCESS:
      {
        return Object.assign({}, state, {
          individuallyFetchedPost: data
        });
      }

    case POSTS_UPDATE_CAMPAIGN_SUCCESS:
      {
        var posts = state.posts,
            individuallyFetchedPost = state.individuallyFetchedPost;
        posts = new OrderedMap([].concat(_toConsumableArray(posts), _toConsumableArray(payload.map(function (post) {
          return [post.id.toString(), new ReportingPost.createFrom(post)];
        })))); // if page loaded with post details open, then individuallyFetchedPost will be where the post data is coming from
        // in that case we need to update individuallyFetchedPost as well

        if (individuallyFetchedPost && individuallyFetchedPost.id) {
          var updatedPost = payload.find(function (post) {
            return post.id === individuallyFetchedPost.id;
          });

          if (updatedPost) {
            individuallyFetchedPost = individuallyFetchedPost.set('campaignGuid', updatedPost.campaignGuid);
          }
        }

        return Object.assign({}, state, {
          posts: posts,
          individuallyFetchedPost: individuallyFetchedPost
        });
      }

    case POST_DELETE_SUCCESS:
    case BROADCAST_POST_DELETE_SUCCESS:
    case actionTypes.BROADCAST_CORE_DELETE:
      return Object.assign({}, state);

    default:
      return state;
  }
});