'use es6';

import _slicedToArray from "@babel/runtime/helpers/esm/slicedToArray";
import { jsx as _jsx } from "react/jsx-runtime";
import { jsxs as _jsxs } from "react/jsx-runtime";
import { Fragment as _Fragment } from "react/jsx-runtime";
import { useState } from 'react';
import I18n from 'I18n';
import PropTypes from 'prop-types';
import BulkActionButton from './BulkActionButton';
import BulkActionPropsType from '../../../utils/BulkActionPropsType';
import SurveysSidebarContainer from 'surveymonkey-crm-card/components/sidebar/SurveysSidebarContainer';
import { useStoreDependency } from 'general-store';
import SurveyMonkeyInstalledStore from '../../../../surveys/SurveyMonkeyInstalledStore';
import { isResolved } from 'crm_data/flux/LoadingStatus';

var BulkSendSurveyMonkeySurveyButton = function BulkSendSurveyMonkeySurveyButton(_ref) {
  var selection = _ref.bulkActionProps.selection,
      options = _ref.options;

  var _useState = useState(false),
      _useState2 = _slicedToArray(_useState, 2),
      sidebarOpen = _useState2[0],
      setSidebarOpen = _useState2[1];

  var isSurveyMonkeyIntegrationInstalled = useStoreDependency(SurveyMonkeyInstalledStore);

  if (!isResolved(isSurveyMonkeyIntegrationInstalled) || !isSurveyMonkeyIntegrationInstalled) {
    return null;
  }

  return /*#__PURE__*/_jsxs(_Fragment, {
    children: [/*#__PURE__*/_jsx(BulkActionButton, {
      icon: "blank",
      onClick: function onClick() {
        return setSidebarOpen(true);
      },
      options: options,
      title: I18n.text('bulkActions.bulkSendSurveyMonkeySurvey')
    }), /*#__PURE__*/_jsx(SurveysSidebarContainer, {
      closeSidebar: function closeSidebar() {
        return setSidebarOpen(false);
      },
      contactVids: selection.toArray() //this param is critical to ensure that clicking in the sidebar doesn't close it
      ,
      onClick: function onClick(evt) {
        return evt.stopPropagation();
      },
      sidebarOpen: sidebarOpen
    })]
  });
};

BulkSendSurveyMonkeySurveyButton.propTypes = {
  bulkActionProps: BulkActionPropsType.isRequired,
  options: PropTypes.object
};
export default BulkSendSurveyMonkeySurveyButton;