'use es6';

import _slicedToArray from "@babel/runtime/helpers/esm/slicedToArray";
import { jsx as _jsx } from "react/jsx-runtime";
import { jsxs as _jsxs } from "react/jsx-runtime";
import PostActions from '../manage/PostActions';
import ChannelName from '../components/channel/ChannelName';
import I18n from 'I18n';
import { useState, useCallback, useContext } from 'react';
import SocialContext from '../components/app/SocialContext';
import UIConfirmModal from 'UIComponents/dialog/UIConfirmModal';
import UIGrid from 'UIComponents/grid/UIGrid';
import UIGridItem from 'UIComponents/grid/UIGridItem';
import UIMediaObject from 'UIComponents/layout/UIMediaObject';
import UIAvatar from 'ui-addon-avatars/UIAvatar';
import { deletePosts, fetchPosts } from './actions';
import { parse, stringify } from 'hub-http/helpers/params';
import { push } from 'react-router-redux';
import { useDispatch } from 'react-redux';

function PostDetailsHeader(_ref) {
  var channel = _ref.channel,
      reportingPost = _ref.reportingPost,
      location = _ref.location;
  var dispatch = useDispatch();

  var _useContext = useContext(SocialContext),
      trackInteraction = _useContext.trackInteraction;

  var _useState = useState(false),
      _useState2 = _slicedToArray(_useState, 2),
      deleting = _useState2[0],
      setDeleting = _useState2[1];

  var showDeleteModal = useCallback(function () {
    setDeleting(true);
  }, [setDeleting]);
  var handleDeletePost = useCallback(function () {
    var queryStringParams = parse(location.search.substring(1));
    var pathname = location.pathname;
    var idParam = {
      post: null
    };
    trackInteraction('delete broadcast');
    dispatch(deletePosts([reportingPost])).then(function () {
      dispatch(push({
        pathname: pathname,
        search: "?" + stringify(Object.assign({}, queryStringParams, {}, idParam))
      }));
      dispatch(fetchPosts());
    });
    setDeleting(false);
  }, [dispatch, trackInteraction, reportingPost, location]);
  var handleCancelDelete = useCallback(function () {
    trackInteraction('cancel delete broadcast');
    setDeleting(false);
  }, [trackInteraction]);
  return /*#__PURE__*/_jsxs(UIGrid, {
    children: [deleting && /*#__PURE__*/_jsx(UIConfirmModal, {
      message: I18n.text('sui.broadcastDetails.delete.confirmMessage'),
      description: I18n.text('sui.broadcastDetails.delete.confirmBlurb'),
      confirmUse: "danger",
      confirmLabel: I18n.text('sui.broadcastDetails.delete.buttonText'),
      rejectLabel: I18n.text('sui.confirm.rejectLabel'),
      onConfirm: handleDeletePost,
      onReject: handleCancelDelete
    }), /*#__PURE__*/_jsx(UIGridItem, {
      "data-test-id": "avatar-container",
      size: 9,
      children: channel && /*#__PURE__*/_jsx(UIMediaObject, {
        align: "center",
        itemLeft: /*#__PURE__*/_jsx(UIAvatar, {
          size: "md",
          socialNetwork: channel.accountSlug,
          src: channel.getAvatarUrl()
        }),
        children: /*#__PURE__*/_jsx(ChannelName, {
          channel: channel
        })
      })
    }), /*#__PURE__*/_jsx(UIGridItem, {
      size: 3,
      className: "justify-end align-start",
      children: /*#__PURE__*/_jsx(PostActions, {
        post: reportingPost,
        handleDelete: showDeleteModal,
        size: {
          width: 100
        },
        buttonSize: "md",
        isDetailsPanel: true,
        placement: 'bottom left'
      })
    })]
  });
}

export default PostDetailsHeader;