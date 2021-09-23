'use es6';

import { jsx as _jsx } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import { fromJS } from 'immutable';
import FormattedMessage from 'I18n/components/FormattedMessage';
import { connect } from 'react-redux';
import { getCurrentUserView } from 'SequencesUI/util/convertToSearchResult';
import GateContainer from 'SequencesUI/data/GateContainer';
import ScopeContainer from 'SequencesUI/data/ScopeContainer';
import UserContainer from 'SequencesUI/data/UserContainer';
import FloatingAlertStore from 'UIComponents/alert/FloatingAlertStore';
import TemplateCreatorDialog from 'SalesTemplateEditor/components/TemplateCreatorDialog';
var newEmptyTemplate = fromJS({
  subject: '',
  body: '',
  name: '',
  private: false
});

var TemplateModal = function TemplateModal(_ref) {
  var _ref$originalTemplate = _ref.originalTemplate,
      originalTemplate = _ref$originalTemplate === void 0 ? newEmptyTemplate : _ref$originalTemplate,
      edit = _ref.edit,
      onConfirm = _ref.onConfirm,
      onReject = _ref.onReject,
      templatesUsage = _ref.templatesUsage;

  function handleConfirm(template, savedAsNew, permissionsSaveError) {
    if (permissionsSaveError) {
      FloatingAlertStore.addAlert({
        titleText: /*#__PURE__*/_jsx(FormattedMessage, {
          message: "sequences.alerts.template.editSharingFailed"
        }),
        message: /*#__PURE__*/_jsx(FormattedMessage, {
          message: "sequences.alerts.template.tryAgain"
        }),
        type: 'warning'
      });
    }

    if (edit) {
      var templateWithUserViewAdded = template.set('userView', getCurrentUserView());
      var updatedTemplate = savedAsNew ? templateWithUserViewAdded : template;
      onConfirm({
        template: updatedTemplate,
        savedAsNew: savedAsNew,
        permissionsSaveError: permissionsSaveError
      });
    } else {
      onConfirm({
        template: template,
        permissionsSaveError: permissionsSaveError
      });
    }
  }

  function handleReject(err) {
    if (err) {
      var title = edit ? 'sequences.alerts.template.editFailed' : 'sequences.alerts.template.createFailed';
      FloatingAlertStore.addAlert({
        titleText: /*#__PURE__*/_jsx(FormattedMessage, {
          message: title
        }),
        message: /*#__PURE__*/_jsx(FormattedMessage, {
          message: "sequences.alerts.template.tryAgain"
        }),
        type: 'danger'
      });
    }

    if (onReject) onReject(err);
  }

  var headerText = edit ? /*#__PURE__*/_jsx(FormattedMessage, {
    message: "edit.templateNode.editTemplateTitle"
  }) : /*#__PURE__*/_jsx(FormattedMessage, {
    message: "edit.sidebarTemplateList.createNewTemplate"
  });
  return /*#__PURE__*/_jsx(TemplateCreatorDialog, {
    template: originalTemplate,
    headerText: headerText,
    saveAs: edit,
    gates: GateContainer.get(),
    scopes: ScopeContainer.get(),
    userProfile: UserContainer.get(),
    onConfirm: handleConfirm,
    onReject: handleReject,
    usage: templatesUsage
  });
};

TemplateModal.propTypes = {
  originalTemplate: PropTypes.object,
  edit: PropTypes.bool,
  onConfirm: PropTypes.func.isRequired,
  onReject: PropTypes.func.isRequired,
  templatesUsage: PropTypes.object
};
export default connect(function (state) {
  return {
    templatesUsage: state.templatesUsage
  };
})(TemplateModal);