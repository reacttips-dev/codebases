'use es6';

import { jsxs as _jsxs } from "react/jsx-runtime";
import { jsx as _jsx } from "react/jsx-runtime";
import I18n from 'I18n';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import UIDescriptionList from 'UIComponents/list/UIDescriptionList';
import FormattedMessage from 'I18n/components/FormattedMessage';
import { reportingPostProp } from '../lib/propTypes';
import { BROADCAST_STATE_TO_VERB_KEY } from '../lib/constants';
import { getCreatedByUserFromProps } from './selectors';
import { getUserId } from '../redux/selectors/user';

var PostDetailsMeta = function PostDetailsMeta(_ref) {
  var reportingPost = _ref.reportingPost,
      userIsHubspotter = _ref.userIsHubspotter;
  var userId = useSelector(getUserId);
  var createdByUser = useSelector(function (state) {
    return getCreatedByUserFromProps(state, {
      userId: reportingPost.createdBy
    });
  });

  var renderDt = function renderDt(id, label, value) {
    return [/*#__PURE__*/_jsx("dt", {
      children: label
    }, "label-" + id), /*#__PURE__*/_jsx("dd", {
      children: value
    }, "value-" + id)];
  };

  var renderCreatedBy = function renderCreatedBy() {
    if (!createdByUser) {
      return null;
    }

    return [/*#__PURE__*/_jsx("dt", {
      children: /*#__PURE__*/_jsx(FormattedMessage, {
        message: "sui.details.createdBy.label"
      })
    }, "label"), /*#__PURE__*/_jsx("dd", {
      children: createdByUser.id === userId ? /*#__PURE__*/_jsx(FormattedMessage, {
        message: "sui.details.createdBy.yourself"
      }) : createdByUser.getFullName()
    }, "value")];
  };

  var renderCreatedVia = function renderCreatedVia() {
    var source = reportingPost.metadata.get('source');
    return source && renderDt('source', /*#__PURE__*/_jsx(FormattedMessage, {
      message: "sui.details.createdVia.label"
    }), source);
  };

  var renderDate = function renderDate() {
    var dateLabelKey = BROADCAST_STATE_TO_VERB_KEY.published;
    var dateDisplay = I18n.moment(reportingPost.publishedAt).portalTz().format('lll');
    return renderDt('date', /*#__PURE__*/_jsx(FormattedMessage, {
      message: dateLabelKey
    }), dateDisplay);
  };

  var renderInternalExtra = function renderInternalExtra() {
    var extraEls = [/*#__PURE__*/_jsx("br", {}, "br")];

    if (reportingPost.metadata.isTargeted()) {
      if (!reportingPost.metadata.targetCountries.isEmpty()) {
        extraEls.push(renderDt('tc', 'Targeted Countries', reportingPost.metadata.targetLocationLabels.join(', ')));
      }

      if (!reportingPost.metadata.targetLanguages.isEmpty()) {
        extraEls.push(renderDt('tl', 'Targeted Languages', reportingPost.metadata.targetLanguageLabels.join(', ')));
      }
    }

    return extraEls;
  };

  return /*#__PURE__*/_jsxs(UIDescriptionList, {
    className: "broadcast-details-meta",
    children: [renderDate(), renderCreatedBy(), renderCreatedVia(), userIsHubspotter && renderInternalExtra()]
  });
};

PostDetailsMeta.propTypes = {
  reportingPost: reportingPostProp,
  userIsHubspotter: PropTypes.bool.isRequired
};
export default PostDetailsMeta;