'use es6';

import { jsxs as _jsxs } from "react/jsx-runtime";
import { jsx as _jsx } from "react/jsx-runtime";
import { Map as ImmutableMap } from 'immutable';
import PropTypes from 'prop-types';
import createReactClass from 'create-react-class';
import I18n from 'I18n';
import FormattedMessage from 'I18n/components/FormattedMessage';
import FormattedHTMLMessage from 'I18n/components/FormattedHTMLMessage';
import FolderDropdown from './editor/FolderDropdown';
import CreateEditTemplateTooltip from './CreateEditTemplateTooltip';
import { hasHigherTemplateLimit } from 'SalesTemplateEditor/lib/permissions';
import UISection from 'UIComponents/section/UISection';
import UIPopover from 'UIComponents/tooltip/UIPopover';
import UIButton from 'UIComponents/button/UIButton';
import UIFormControl from 'UIComponents/form/UIFormControl';
import UITextInput from 'UIComponents/input/UITextInput';
var TEMPLATE_NAME_CHAR_LIMIT = 256;
export default createReactClass({
  displayName: "SaveAsButton",
  propTypes: {
    template: PropTypes.instanceOf(ImmutableMap).isRequired,
    onSave: PropTypes.func.isRequired,
    use: PropTypes.string.isRequired,
    disabled: PropTypes.bool.isRequired,
    className: PropTypes.string,
    permissions: PropTypes.instanceOf(ImmutableMap),
    usage: PropTypes.instanceOf(ImmutableMap)
  },
  getInitialState: function getInitialState() {
    return {
      open: false,
      name: this.props.template.get('name'),
      folderId: null
    };
  },
  togglePopover: function togglePopover() {
    var template = this.props.template;
    var name = template.get('name');

    if (typeof template.get('nameEdited') === 'undefined') {
      name = I18n.text('templateEditor.saveAsModal.copy', {
        name: name
      });
    }

    this.setState({
      name: name,
      folderId: null,
      open: !this.state.open
    });
  },
  onSelectFolder: function onSelectFolder(folderId) {
    this.setState({
      folderId: folderId
    });
  },
  editName: function editName(e) {
    this.setState({
      name: e.target.value
    });
  },
  onConfirm: function onConfirm() {
    var _this$state = this.state,
        name = _this$state.name,
        folderId = _this$state.folderId;
    this.props.onSave({
      name: name,
      folderId: folderId
    });
  },
  validateName: function validateName() {
    var name = this.state.name;
    var trimmedName = name ? name.trim() : '';
    var validationMessage = null;

    if (!trimmedName) {
      validationMessage = /*#__PURE__*/_jsx(FormattedMessage, {
        message: 'templateEditor.saveAsModal.error.noName'
      });
    }

    if (trimmedName.length >= TEMPLATE_NAME_CHAR_LIMIT) {
      validationMessage = /*#__PURE__*/_jsx(FormattedMessage, {
        message: 'templateEditor.saveAsModal.error.nameTooLong'
      });
    }

    return {
      nameIsInvalid: !!validationMessage,
      validationMessage: validationMessage
    };
  },
  renderPermissions: function renderPermissions() {
    var permissions = this.props.permissions;
    var message = permissions.get('private') ? 'templateEditor.saveAsModal.sharing.private' : 'templateEditor.saveAsModal.sharing.sharedWithEveryone';
    return /*#__PURE__*/_jsx(FormattedHTMLMessage, {
      message: message
    });
  },
  render: function render() {
    var _this$state2 = this.state,
        open = _this$state2.open,
        name = _this$state2.name,
        folderId = _this$state2.folderId;
    var _this$props = this.props,
        usage = _this$props.usage,
        className = _this$props.className,
        use = _this$props.use;

    var _this$validateName = this.validateName(),
        nameIsInvalid = _this$validateName.nameIsInvalid,
        validationMessage = _this$validateName.validationMessage;

    var portalIsAtLimit = usage && usage.get('count') >= usage.get('limit');
    var isAtFreeUserLimit = !hasHigherTemplateLimit() && usage && usage.get('count') >= usage.get('userLimit');
    return /*#__PURE__*/_jsx(UIPopover, {
      open: open,
      className: "template-footer-popover save-as-button",
      content: {
        body: /*#__PURE__*/_jsxs("div", {
          children: [/*#__PURE__*/_jsxs(UISection, {
            children: [/*#__PURE__*/_jsx(UIFormControl, {
              label: /*#__PURE__*/_jsx(FormattedMessage, {
                message: "templateEditor.saveAsModal.name"
              }),
              verticalSeparation: "flush",
              error: nameIsInvalid,
              validationMessage: validationMessage,
              children: /*#__PURE__*/_jsx(UITextInput, {
                value: name,
                onChange: this.editName
              })
            }), /*#__PURE__*/_jsx(UIFormControl, {
              label: /*#__PURE__*/_jsx(FormattedMessage, {
                message: "templateEditor.saveAsModal.folder.label"
              }),
              verticalSeparation: "flush",
              children: /*#__PURE__*/_jsx(FolderDropdown, {
                folderId: folderId,
                readOnly: false,
                buttonUse: "form",
                selectFolder: this.onSelectFolder,
                useSelectFolderPrompt: true
              })
            })]
          }), this.renderPermissions()]
        }),
        footer: /*#__PURE__*/_jsxs("div", {
          children: [/*#__PURE__*/_jsx(UIButton, {
            size: "small",
            use: "tertiary",
            onClick: this.onConfirm,
            disabled: nameIsInvalid,
            children: /*#__PURE__*/_jsx(FormattedMessage, {
              message: "templateEditor.saveAsModal.save"
            })
          }), /*#__PURE__*/_jsx(UIButton, {
            size: "small",
            use: "tertiary-light",
            onClick: this.togglePopover,
            children: /*#__PURE__*/_jsx(FormattedMessage, {
              message: "templateEditor.saveAsModal.cancel"
            })
          })]
        })
      },
      children: /*#__PURE__*/_jsx(CreateEditTemplateTooltip, {
        usage: usage,
        portalIsAtLimit: portalIsAtLimit,
        buttonCreatesNewTemplate: true,
        children: /*#__PURE__*/_jsx(UIButton, {
          className: className,
          "data-selenium-test": "sales-template-editor-save-as-button",
          disabled: this.props.disabled || portalIsAtLimit || isAtFreeUserLimit,
          use: use,
          onClick: this.togglePopover,
          children: /*#__PURE__*/_jsx(FormattedMessage, {
            message: "templateEditor.saveAs"
          })
        })
      })
    });
  }
});