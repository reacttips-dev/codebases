'use es6';

import { jsx as _jsx } from "react/jsx-runtime";
import { Map as ImmutableMap, List } from 'immutable';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { errorFetchingData as errorFetchingDataSelector } from 'SalesTemplateEditor/selectors/errorSelectors';
import contextWrapper from 'SalesTemplateEditor/utils/contextWrapper';
import TemplateCreatorModal from 'SalesTemplateEditor/components/TemplateCreatorModal';
import TemplateCreatorModalLoader from 'SalesTemplateEditor/components/TemplateCreatorModalLoader';
import TemplateEditorFetchError from 'SalesTemplateEditor/components/TemplateEditorFetchError';

var TemplateEditorContainer = function TemplateEditorContainer(_ref) {
  var headerText = _ref.headerText,
      saveAs = _ref.saveAs,
      readOnly = _ref.readOnly,
      modalPlugins = _ref.modalPlugins,
      onConfirm = _ref.onConfirm,
      onReject = _ref.onReject,
      gates = _ref.gates,
      userProfile = _ref.userProfile,
      className = _ref.className,
      template = _ref.template,
      folders = _ref.folders,
      permissions = _ref.permissions,
      properties = _ref.properties,
      decks = _ref.decks,
      ErrorMarker = _ref.ErrorMarker,
      SuccessMarker = _ref.SuccessMarker,
      errorFetchingData = _ref.errorFetchingData;

  if (errorFetchingData) {
    return /*#__PURE__*/_jsx(TemplateEditorFetchError, {
      headerText: headerText,
      onReject: onReject,
      showHeader: true,
      ErrorMarker: ErrorMarker
    });
  }

  if (!template || !folders || !decks || !permissions || !properties) {
    return /*#__PURE__*/_jsx(TemplateCreatorModalLoader, {
      headerText: headerText,
      onConfirm: onConfirm,
      onReject: onReject
    });
  }

  return /*#__PURE__*/_jsx(TemplateCreatorModal, {
    className: className,
    template: template,
    headerText: headerText,
    modalPlugins: modalPlugins,
    saveAs: saveAs,
    readOnly: readOnly,
    onConfirm: onConfirm,
    onReject: onReject,
    gates: gates,
    userProfile: userProfile,
    SuccessMarker: SuccessMarker
  });
};

TemplateEditorContainer.propTypes = {
  ErrorMarker: PropTypes.oneOfType([PropTypes.element, PropTypes.func]).isRequired,
  SuccessMarker: PropTypes.oneOfType([PropTypes.element, PropTypes.func]).isRequired,
  headerText: PropTypes.node.isRequired,
  saveAs: PropTypes.bool.isRequired,
  readOnly: PropTypes.bool.isRequired,
  modalPlugins: PropTypes.bool.isRequired,
  onConfirm: PropTypes.func.isRequired,
  onReject: PropTypes.func.isRequired,
  gates: PropTypes.object.isRequired,
  userProfile: PropTypes.object.isRequired,
  className: PropTypes.string,
  template: PropTypes.instanceOf(ImmutableMap),
  folders: PropTypes.instanceOf(List),
  permissions: PropTypes.instanceOf(ImmutableMap),
  properties: PropTypes.instanceOf(ImmutableMap),
  decks: PropTypes.instanceOf(ImmutableMap),
  errorFetchingData: PropTypes.bool
};
export var ConnectedTemplateEditorContainer = connect(function (state) {
  return {
    template: state.template.get('template'),
    folders: state.folders.get('folders'),
    decks: state.decks.get('decks'),
    properties: state.properties.get('properties'),
    permissions: state.permissions.get('permissionsData'),
    errorFetchingData: errorFetchingDataSelector(state)
  };
})(TemplateEditorContainer);
export default contextWrapper(ConnectedTemplateEditorContainer);