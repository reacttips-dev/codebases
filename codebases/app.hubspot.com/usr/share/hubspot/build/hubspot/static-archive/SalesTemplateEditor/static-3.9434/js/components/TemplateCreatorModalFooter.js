'use es6';

import { jsx as _jsx } from "react/jsx-runtime";
import { jsxs as _jsxs } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import createReactClass from 'create-react-class';
import { Fragment } from 'react';
import { Map as ImmutableMap } from 'immutable';
import { connect } from 'react-redux';
import FormattedMessage from 'I18n/components/FormattedMessage';
import FormattedHTMLMessage from 'I18n/components/FormattedHTMLMessage';
import UIAlert from 'UIComponents/alert/UIAlert';
import UIButton from 'UIComponents/button/UIButton';
import UIButtonWrapper from 'UIComponents/layout/UIButtonWrapper';
import UIDialogFooter from 'UIComponents/dialog/UIDialogFooter';
import UIFlex from 'UIComponents/layout/UIFlex';
import UILink from 'UIComponents/link/UILink';
import UpdateButton from './UpdateButton';
import SaveAsButton from './SaveAsButton';
import CreateEditTemplateTooltip from './CreateEditTemplateTooltip';
import { invalidTemplateArticle } from '../lib/links';
import { onUpdateTemplate } from 'SalesTemplateEditor/tracking/TrackingInterface';
import { canWrite, hasHigherTemplateLimit } from 'SalesTemplateEditor/lib/permissions';
var TemplateCreatorModalFooter = createReactClass({
  displayName: "TemplateCreatorModalFooter",
  propTypes: {
    hasInvalidToken: PropTypes.bool,
    invalidTemplate: PropTypes.bool,
    onSave: PropTypes.func,
    saveAs: PropTypes.bool,
    template: PropTypes.instanceOf(ImmutableMap),
    readOnly: PropTypes.bool,
    onConfirm: PropTypes.func.isRequired,
    onReject: PropTypes.func.isRequired,
    checkForMeetings: PropTypes.func,
    children: PropTypes.node,
    userProfile: PropTypes.object,
    permissions: PropTypes.instanceOf(ImmutableMap),
    permissionsModified: PropTypes.bool,
    usage: PropTypes.instanceOf(ImmutableMap)
  },
  userOwnsTemplate: function userOwnsTemplate() {
    var _this$props = this.props,
        template = _this$props.template,
        userProfile = _this$props.userProfile;
    return template.get('userId') === userProfile['user_id'];
  },
  primaryButtonIsSaveAs: function primaryButtonIsSaveAs() {
    return !this.userOwnsTemplate();
  },
  handleUpdateButtonClick: function handleUpdateButtonClick() {
    onUpdateTemplate({
      ownership: this.userOwnsTemplate()
    });
    this.props.onSave();
  },
  renderSaveActions: function renderSaveActions() {
    var _this$props2 = this.props,
        saveAs = _this$props2.saveAs,
        invalidTemplate = _this$props2.invalidTemplate,
        onSave = _this$props2.onSave,
        onReject = _this$props2.onReject,
        checkForMeetings = _this$props2.checkForMeetings,
        template = _this$props2.template,
        userProfile = _this$props2.userProfile,
        permissions = _this$props2.permissions,
        permissionsModified = _this$props2.permissionsModified,
        usage = _this$props2.usage;
    var disabled = invalidTemplate || !onSave || !canWrite();
    var portalIsAtLimit = usage && usage.get('count') >= usage.get('limit');
    var isAtFreeUserLimit = !hasHigherTemplateLimit() && usage && usage.get('count') >= usage.get('userLimit');

    if (saveAs) {
      var handleSaveAs = function handleSaveAs(newTemplateData) {
        onSave(null, newTemplateData);
      };

      var PrimaryButton = this.primaryButtonIsSaveAs() ? SaveAsButton : UpdateButton;
      var SecondaryButton = this.primaryButtonIsSaveAs() ? UpdateButton : SaveAsButton;
      var baseProps = {
        onSave: handleSaveAs,
        onUpdate: this.handleUpdateButtonClick,
        userOwnsTemplate: this.userOwnsTemplate(),
        userProfile: userProfile,
        permissions: permissions,
        permissionsModified: permissionsModified,
        template: template,
        disabled: disabled,
        usage: usage
      };
      return /*#__PURE__*/_jsxs("div", {
        children: [/*#__PURE__*/_jsx(PrimaryButton, Object.assign({
          use: "primary"
        }, baseProps)), /*#__PURE__*/_jsx(SecondaryButton, Object.assign({
          use: "secondary"
        }, baseProps)), /*#__PURE__*/_jsx(UIButton, {
          onClick: function onClick() {
            return onReject();
          },
          children: /*#__PURE__*/_jsx(FormattedMessage, {
            message: "templateEditor.cancel"
          })
        })]
      });
    }

    return /*#__PURE__*/_jsxs(Fragment, {
      children: [/*#__PURE__*/_jsx(CreateEditTemplateTooltip, {
        usage: usage,
        portalIsAtLimit: portalIsAtLimit,
        buttonCreatesNewTemplate: true,
        children: /*#__PURE__*/_jsx(UIButton, {
          use: "primary",
          disabled: disabled || portalIsAtLimit || isAtFreeUserLimit,
          onClick: onSave,
          onMouseOver: checkForMeetings,
          "data-selenium-test": "save-template-button",
          children: /*#__PURE__*/_jsx(FormattedMessage, {
            message: "templateEditor.saveTemplate"
          })
        })
      }), /*#__PURE__*/_jsx(UIButton, {
        onClick: function onClick() {
          return onReject();
        },
        children: /*#__PURE__*/_jsx(FormattedMessage, {
          message: "templateEditor.cancel"
        })
      })]
    });
  },
  renderInvalidTokenWarning: function renderInvalidTokenWarning() {
    var hasInvalidToken = this.props.hasInvalidToken;

    if (!hasInvalidToken) {
      return null;
    }

    return /*#__PURE__*/_jsx(UIAlert, {
      type: "danger",
      closeable: false,
      use: "inline",
      children: /*#__PURE__*/_jsxs(UIButtonWrapper, {
        children: [/*#__PURE__*/_jsx(FormattedHTMLMessage, {
          message: "templateEditor.invalidToken.bodyWithOptions",
          options: {
            doubleCurlyBracesOpen: '{{',
            doubleCurlyBracesClose: '}}'
          }
        }), /*#__PURE__*/_jsx(UILink, {
          href: invalidTemplateArticle(),
          external: true,
          children: /*#__PURE__*/_jsx(FormattedMessage, {
            message: "templateEditor.invalidToken.learnMore"
          })
        })]
      })
    });
  },
  render: function render() {
    var _this$props3 = this.props,
        readOnly = _this$props3.readOnly,
        onConfirm = _this$props3.onConfirm,
        children = _this$props3.children;

    if (readOnly) {
      return /*#__PURE__*/_jsx("footer", {
        className: "p-all-10",
        children: /*#__PURE__*/_jsx(UIButton, {
          use: "primary",
          onClick: onConfirm,
          children: /*#__PURE__*/_jsx(FormattedMessage, {
            message: "templateEditor.close"
          })
        })
      });
    }

    return /*#__PURE__*/_jsxs(UIDialogFooter, {
      children: [/*#__PURE__*/_jsxs(UIFlex, {
        align: "center",
        children: [this.renderSaveActions(), children]
      }), this.renderInvalidTokenWarning()]
    });
  }
});
export default connect(function (state) {
  return {
    permissions: state.permissions.get('permissionsData'),
    permissionsModified: state.permissions.get('permissionsModified'),
    usage: state.templateUsage.get('usage')
  };
})(TemplateCreatorModalFooter);