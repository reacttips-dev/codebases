'use es6';

import { jsx as _jsx } from "react/jsx-runtime";
import Loadable from 'UIComponents/decorators/Loadable';
import FormattedMessage from 'I18n/components/FormattedMessage';
import UILoadingSpinner from 'UIComponents/loading/UILoadingSpinner';
import UIAlert from 'UIComponents/alert/UIAlert';
import UIButton from 'UIComponents/button/UIButton';

var ErrorComponent = function ErrorComponent(_ref) {
  var retry = _ref.retry;
  return /*#__PURE__*/_jsx(UIAlert, {
    titleText: /*#__PURE__*/_jsx(FormattedMessage, {
      message: "follow-up-task.asyncError.title"
    }),
    type: "danger",
    children: /*#__PURE__*/_jsx(UIButton, {
      use: "link",
      onClick: retry,
      children: /*#__PURE__*/_jsx(FormattedMessage, {
        message: "follow-up-task.asyncError.retryCTA"
      })
    })
  });
};

var AsyncFollowUpTask = Loadable({
  loader: function loader() {
    return import(
    /* webpackChunkName: "follow-up-task" */
    './FollowUpTaskContainer');
  },
  LoadingComponent: function LoadingComponent(_ref2) {
    var pastDelay = _ref2.pastDelay;
    return pastDelay && /*#__PURE__*/_jsx(UILoadingSpinner, {});
  },
  ErrorComponent: ErrorComponent
});
export default AsyncFollowUpTask;