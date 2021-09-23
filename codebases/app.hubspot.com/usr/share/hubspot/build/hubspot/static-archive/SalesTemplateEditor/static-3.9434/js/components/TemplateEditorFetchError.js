'use es6';

import { jsxs as _jsxs } from "react/jsx-runtime";
import { jsx as _jsx } from "react/jsx-runtime";
import { Map as ImmutableMap, List } from 'immutable';
import PropTypes from 'prop-types';
import { Fragment } from 'react';
import FormattedMessage from 'I18n/components/FormattedMessage';
import { connect } from 'react-redux';
import * as DeckActions from 'SalesTemplateEditor/actions/DeckActions';
import * as FolderActions from 'SalesTemplateEditor/actions/FolderActions';
import * as PermissionActions from 'SalesTemplateEditor/actions/PermissionActions';
import * as PropertyActions from 'SalesTemplateEditor/actions/PropertyActions';
import TemplateCreatorModalHeader from './TemplateCreatorModalHeader';
import H2 from 'UIComponents/elements/headings/H2';
import H4 from 'UIComponents/elements/headings/H4';
import UIErrorMessage from 'UIComponents/error/UIErrorMessage';
import UIDialogBody from 'UIComponents/dialog/UIDialogBody';
import UIFlex from 'UIComponents/layout/UIFlex';
import UIButton from 'UIComponents/button/UIButton';

var TemplateEditorFetchError = function TemplateEditorFetchError(_ref) {
  var _ref$ErrorMarker = _ref.ErrorMarker,
      ErrorMarker = _ref$ErrorMarker === void 0 ? Fragment : _ref$ErrorMarker,
      headerText = _ref.headerText,
      _ref$showHeader = _ref.showHeader,
      showHeader = _ref$showHeader === void 0 ? true : _ref$showHeader,
      template = _ref.template,
      decks = _ref.decks,
      folders = _ref.folders,
      permissions = _ref.permissions,
      properties = _ref.properties,
      fetchDecks = _ref.fetchDecks,
      fetchFolders = _ref.fetchFolders,
      initTemplatePermissions = _ref.initTemplatePermissions,
      fetchProperties = _ref.fetchProperties;

  function retryRequests() {
    if (!decks) fetchDecks();
    if (!folders) fetchFolders();
    if (!properties) fetchProperties();
    if (template && !permissions) initTemplatePermissions(template);
  }

  var header = showHeader ? /*#__PURE__*/_jsx(TemplateCreatorModalHeader, {
    headerText: headerText,
    showHeader: showHeader
  }) : /*#__PURE__*/_jsx(H2, {
    className: "m-x-10 m-bottom-8",
    children: headerText
  });
  return /*#__PURE__*/_jsxs("div", {
    className: "template-creator-modal",
    children: [header, /*#__PURE__*/_jsx(UIDialogBody, {
      children: /*#__PURE__*/_jsx(UIFlex, {
        justify: "center",
        style: {
          height: 527
        },
        children: /*#__PURE__*/_jsx(UIErrorMessage, {
          type: "badRequest",
          title: /*#__PURE__*/_jsx(H4, {
            children: /*#__PURE__*/_jsx(FormattedMessage, {
              message: "templateEditor.errorLoading.message"
            })
          }),
          children: /*#__PURE__*/_jsx(UIButton, {
            onClick: retryRequests,
            children: /*#__PURE__*/_jsx(FormattedMessage, {
              message: "templateEditor.errorLoading.tryAgain"
            })
          })
        })
      })
    }), /*#__PURE__*/_jsx(ErrorMarker, {})]
  });
};

TemplateEditorFetchError.propTypes = {
  ErrorMarker: PropTypes.oneOfType([PropTypes.element, PropTypes.func]),
  headerText: PropTypes.node,
  showHeader: PropTypes.bool,
  template: PropTypes.instanceOf(ImmutableMap),
  decks: PropTypes.instanceOf(ImmutableMap),
  folders: PropTypes.instanceOf(List),
  permissions: PropTypes.instanceOf(ImmutableMap),
  properties: PropTypes.instanceOf(ImmutableMap),
  fetchDecks: PropTypes.func.isRequired,
  fetchFolders: PropTypes.func.isRequired,
  initTemplatePermissions: PropTypes.func.isRequired,
  fetchProperties: PropTypes.func.isRequired
};
export default connect(function (state) {
  return {
    template: state.template.get('template'),
    decks: state.decks.get('decks'),
    folders: state.folders.get('folders'),
    permissions: state.permissions.get('permissionsData'),
    properties: state.properties.get('properties')
  };
}, {
  fetchDecks: DeckActions.fetchDecks,
  fetchFolders: FolderActions.fetchFolders,
  initTemplatePermissions: PermissionActions.initTemplatePermissions,
  fetchProperties: PropertyActions.fetchProperties
})(TemplateEditorFetchError);