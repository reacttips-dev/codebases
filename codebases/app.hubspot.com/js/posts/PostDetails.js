'use es6';

import { jsx as _jsx } from "react/jsx-runtime";
import { jsxs as _jsxs } from "react/jsx-runtime";
import UISection from 'UIComponents/section/UISection';
import { processMessageContent } from '../lib/utils';
import { reportingPostProp } from '../lib/propTypes';
import PostMediaWrapper from './PostMediaWrapper';

var PostDetails = function PostDetails(_ref) {
  var reportingPost = _ref.reportingPost;
  var messageBody = processMessageContent(reportingPost.body, false, undefined, reportingPost.accountSlug).replace(/\n/g, '<br/>');
  return /*#__PURE__*/_jsxs("div", {
    children: [/*#__PURE__*/_jsx(UISection, {
      children: /*#__PURE__*/_jsx("p", {
        className: "emoji-font",
        dangerouslySetInnerHTML: {
          __html: messageBody
        },
        "data-test-id": "broadcast-content"
      })
    }), /*#__PURE__*/_jsx(UISection, {
      className: "reporting-post-details-media",
      children: /*#__PURE__*/_jsx(PostMediaWrapper, {
        post: reportingPost,
        size: "full"
      })
    })]
  });
};

PostDetails.propTypes = {
  reportingPost: reportingPostProp
};
export default PostDetails;