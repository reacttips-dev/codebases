'use es6';

import { jsxs as _jsxs } from "react/jsx-runtime";
import { jsx as _jsx } from "react/jsx-runtime";
import { unescape, escape } from 'draft-plugins/lib/escapers';
import { Map as ImmutableMap } from 'immutable';
import PropTypes from 'prop-types';
import createReactClass from 'create-react-class';
import PortalIdParser from 'PortalIdParser';
import FormattedHTMLMessage from 'I18n/components/FormattedHTMLMessage';
import FormattedJSXMessage from 'I18n/components/FormattedJSXMessage';
import classNames from 'classnames';
import { EditorState } from 'draft-js';
import { convertFromHTML, convertToHTML } from 'draft-convert';
import { connect } from 'react-redux';
import * as TemplateActions from 'SalesTemplateEditor/actions/TemplateActions';
import UIDialogBody from 'UIComponents/dialog/UIDialogBody';
import UIFlex from 'UIComponents/layout/UIFlex';
import UIFloatingAlertList from 'UIComponents/alert/UIFloatingAlertList';
import FloatingAlertStore from 'UIComponents/alert/FloatingAlertStore';
import UIIcon from 'UIComponents/icon/UIIcon';
import UILink from 'UIComponents/link/UILink';
import UILoadingSpinner from 'UIComponents/loading/UILoadingSpinner';
import TemplateEditor from './TemplateEditor';
import getEditorPlugins from 'SalesTemplateEditor/plugins/compositePlugins/getEditorPlugins';
import { sliceBlocks, setBlockTypes } from '../utils/subjectUtils';
import localSettings from 'SalesTemplateEditor/utils/localSettings';
import { hasSalesPro } from 'SalesTemplateEditor/lib/permissions';
import { hasDoubleBraces, hasTripleBracesInHTML, updateEditorStateWithMeetingsPopover } from 'SalesTemplateEditor/utils/templateContent';
import { HIDE_MEETINGS_PLUGIN_PRO_TIP } from 'draft-plugins/lib/constants';
import TemplateCreatorModalHeader from './TemplateCreatorModalHeader';
import TemplateCreatorModalFooter from './TemplateCreatorModalFooter';
import { onUseSuggestions } from 'SalesTemplateEditor/tracking/TrackingInterface';
import connectSuggestions from 'draft-smart-detections/connectSuggestions';
import SuggestionsPopover from './SuggestionsPopover';
import bodySuggestions from 'SalesTemplateEditor/suggestions/bodySuggestions';
import subjectSuggestions from 'SalesTemplateEditor/suggestions/subjectSuggestions';
import combinedSuggestions from 'SalesTemplateEditor/suggestions/combinedSuggestions';
var SuggestionsDecorator = connectSuggestions({
  bodySuggestions: bodySuggestions,
  subjectSuggestions: subjectSuggestions,
  combinedSuggestions: combinedSuggestions,
  onUseSuggestions: onUseSuggestions
});
var Suggestions = SuggestionsDecorator(SuggestionsPopover);
var TemplateCreatorModal = createReactClass({
  displayName: "TemplateCreatorModal",
  propTypes: {
    SuccessMarker: PropTypes.oneOfType([PropTypes.element, PropTypes.func]),
    template: PropTypes.instanceOf(ImmutableMap).isRequired,
    permissions: PropTypes.instanceOf(ImmutableMap).isRequired,
    permissionsModified: PropTypes.bool.isRequired,
    headerText: PropTypes.node,
    modalPlugins: PropTypes.bool.isRequired,
    saveAs: PropTypes.bool,
    readOnly: PropTypes.bool,
    onRenderComplete: PropTypes.func,
    onConfirm: PropTypes.func.isRequired,
    onReject: PropTypes.func.isRequired,
    gates: PropTypes.object.isRequired,
    userProfile: PropTypes.object.isRequired,
    scopes: PropTypes.object,
    showHeader: PropTypes.bool.isRequired,
    className: PropTypes.string
  },
  getDefaultProps: function getDefaultProps() {
    return {
      readOnly: false,
      saveAs: false,
      showHeader: true
    };
  },
  getInitialState: function getInitialState() {
    var _this$props = this.props,
        readOnly = _this$props.readOnly,
        gates = _this$props.gates,
        scopes = _this$props.scopes,
        modalPlugins = _this$props.modalPlugins;
    var showMeetingsPopup = localSettings.get(HIDE_MEETINGS_PLUGIN_PRO_TIP) !== true;
    var subjectPlugins = getEditorPlugins('subjectPlugins', readOnly, gates, modalPlugins, scopes);
    var bodyPlugins = getEditorPlugins('bodyPlugins', readOnly, gates, modalPlugins, scopes);
    this.subjectFromHTML = subjectPlugins(convertFromHTML);
    this.subjectToHTML = subjectPlugins(convertToHTML);
    this.bodyFromHTML = bodyPlugins(convertFromHTML);
    this.bodyToHTML = bodyPlugins(convertToHTML);
    return {
      bodyState: null,
      subjectState: null,
      showMeetingsPopup: showMeetingsPopup,
      usedSuggestion: false,
      usedAllSuggestions: false,
      hasInvalidTokenInHTML: false,
      edited: true,
      alertStore: FloatingAlertStore.newFloatingAlertStore()
    };
  },
  componentDidMount: function componentDidMount() {
    this.initEditorState();
  },
  initEditorState: function initEditorState() {
    var _this$props2 = this.props,
        template = _this$props2.template,
        onRenderComplete = _this$props2.onRenderComplete;
    this.setState({
      bodyState: EditorState.createWithContent(this.bodyFromHTML(template.get('body').replace(/(\r\n|\n|\r)/gm, '<br />'))),
      subjectState: EditorState.createWithContent(this.subjectFromHTML(escape(template.get('subject'))))
    }, function () {
      if (onRenderComplete) {
        setTimeout(function () {
          return onRenderComplete();
        }, 0);
      }
    });
  },
  templateIsInvalid: function templateIsInvalid() {
    var _this$state = this.state,
        hasInvalidTokenInHTML = _this$state.hasInvalidTokenInHTML,
        edited = _this$state.edited;
    var missingRequiredFields = !this.hasName() || !this.hasBody();
    var hasInvalidContent = this.hasInvalidToken() || hasInvalidTokenInHTML && !edited;
    return missingRequiredFields || hasInvalidContent;
  },
  checkForMeetings: function checkForMeetings() {
    var _this$state2 = this.state,
        bodyState = _this$state2.bodyState,
        showMeetingsPopup = _this$state2.showMeetingsPopup;
    var isSalesPro = hasSalesPro();
    var shouldNotCheckForMeetings = !showMeetingsPopup || !isSalesPro || this.templateIsInvalid();

    if (shouldNotCheckForMeetings) {
      return;
    }

    var updatedEditorState = updateEditorStateWithMeetingsPopover(bodyState);

    if (updatedEditorState) {
      this.setState({
        bodyState: updatedEditorState,
        showMeetingsPopup: false
      });
    }
  },
  handleSubjectChange: function handleSubjectChange(subjectState) {
    this.setState({
      subjectState: subjectState,
      edited: true
    });
  },
  handleBodyChange: function handleBodyChange(bodyState) {
    this.setState({
      bodyState: bodyState,
      edited: true
    });
  },
  showTripleBracesAlert: function showTripleBracesAlert() {
    this.state.alertStore.addAlert({
      message: /*#__PURE__*/_jsx(FormattedHTMLMessage, {
        message: "templateEditor.alert.tripleBrackets.message"
      }),
      titleText: /*#__PURE__*/_jsx(FormattedHTMLMessage, {
        message: "templateEditor.alert.tripleBrackets.title"
      }),
      type: 'danger'
    });
    this.setState({
      hasInvalidTokenInHTML: true,
      edited: false
    });
  },
  handleSave: function handleSave(__e, newTemplateData) {
    var _this$props3 = this.props,
        template = _this$props3.template,
        onConfirm = _this$props3.onConfirm,
        onReject = _this$props3.onReject,
        permissions = _this$props3.permissions,
        permissionsModified = _this$props3.permissionsModified;
    var _this$state3 = this.state,
        subjectState = _this$state3.subjectState,
        bodyState = _this$state3.bodyState;
    var singleBlockSubject = setBlockTypes(sliceBlocks(subjectState, 0, 1), 'unstyled');
    var updatedBody = this.bodyToHTML(bodyState.getCurrentContent());
    var updatedSubject = this.subjectToHTML(singleBlockSubject.getCurrentContent());

    if (hasTripleBracesInHTML(updatedBody) || hasTripleBracesInHTML(updatedSubject)) {
      this.showTripleBracesAlert();
      return;
    } else {
      this.setState({
        hasInvalidTokenInHTML: false
      });
    }

    var convertedTemplate = template.set('body', updatedBody).set('subject', unescape(updatedSubject));

    if (newTemplateData) {
      var name = newTemplateData.name,
          folderId = newTemplateData.folderId;
      convertedTemplate = convertedTemplate.set('name', name).set('folderId', folderId === 0 ? null : folderId).delete('id');
    }

    var savedAsNew = Boolean(newTemplateData);
    TemplateActions.save({
      template: convertedTemplate,
      savedAsNew: savedAsNew,
      permissionsModified: permissionsModified,
      permissions: permissions
    }).then(function (_ref) {
      var savedTemplate = _ref.template,
          permissionsSaveError = _ref.permissionsSaveError;
      onConfirm(savedTemplate, savedAsNew, permissionsSaveError);
    }, function (err) {
      onReject(err);
    });
  },
  hasName: function hasName() {
    var template = this.props.template;
    return template.get('name').trim() !== '';
  },
  hasBody: function hasBody() {
    var bodyState = this.state.bodyState;

    if (bodyState === null) {
      return false;
    }

    var body = bodyState.getCurrentContent().getBlockMap().reduce(function (total, block) {
      return total + block.getText().trim().length;
    }, 0);
    return body > 0;
  },
  hasInvalidToken: function hasInvalidToken() {
    var _this$state4 = this.state,
        subjectState = _this$state4.subjectState,
        bodyState = _this$state4.bodyState;

    if (!subjectState || !bodyState) {
      return false;
    }

    return hasDoubleBraces(subjectState.getCurrentContent()) || hasDoubleBraces(bodyState.getCurrentContent());
  },
  renderBody: function renderBody() {
    var _this$props4 = this.props,
        template = _this$props4.template,
        readOnly = _this$props4.readOnly,
        modalPlugins = _this$props4.modalPlugins,
        gates = _this$props4.gates,
        userProfile = _this$props4.userProfile,
        SuccessMarker = _this$props4.SuccessMarker;
    var _this$state5 = this.state,
        subjectState = _this$state5.subjectState,
        bodyState = _this$state5.bodyState,
        alertStore = _this$state5.alertStore;

    if (subjectState === null || bodyState === null) {
      return /*#__PURE__*/_jsx(UIDialogBody, {
        children: /*#__PURE__*/_jsx(UIFlex, {
          align: "center",
          justify: "center",
          style: {
            height: 382
          },
          children: /*#__PURE__*/_jsx(UILoadingSpinner, {})
        })
      });
    }

    return /*#__PURE__*/_jsxs(UIDialogBody, {
      children: [/*#__PURE__*/_jsx(UIFloatingAlertList, {
        alertStore: alertStore,
        use: "contextual"
      }), /*#__PURE__*/_jsx(TemplateEditor, {
        template: template,
        bodyState: bodyState,
        subjectState: subjectState,
        onSubjectChange: this.handleSubjectChange,
        onBodyChange: this.handleBodyChange,
        onFolderSelect: this.handleFolderSelect,
        modalPlugins: modalPlugins,
        readOnly: readOnly,
        gates: gates,
        userProfile: userProfile,
        SuccessMarker: SuccessMarker
      }), /*#__PURE__*/_jsxs("div", {
        className: "m-top-3",
        children: [/*#__PURE__*/_jsx(UIIcon, {
          name: "signature"
        }), ' ', /*#__PURE__*/_jsx(FormattedJSXMessage, {
          elements: {
            Link: UILink
          },
          message: "templateEditor.signatureMessage_jsx",
          options: {
            external: true,
            href: "/settings/" + PortalIdParser.get() + "/user-preferences/email"
          }
        })]
      })]
    });
  },
  renderSuggestions: function renderSuggestions() {
    var _this = this;

    var template = this.props.template;
    var _this$state6 = this.state,
        bodyState = _this$state6.bodyState,
        subjectState = _this$state6.subjectState;

    if (bodyState !== null && subjectState !== null) {
      return /*#__PURE__*/_jsx(Suggestions, {
        isNew: !template.has('id'),
        bodyState: bodyState,
        subjectState: subjectState,
        setUsedSuggestion: function setUsedSuggestion() {
          return _this.setState({
            usedSuggestion: true
          });
        },
        setUsedAllSuggestions: function setUsedAllSuggestions() {
          return _this.setState({
            usedAllSuggestions: true
          });
        }
      });
    }

    return /*#__PURE__*/_jsx("div", {});
  },
  render: function render() {
    var _this$props5 = this.props,
        headerText = _this$props5.headerText,
        showHeader = _this$props5.showHeader,
        saveAs = _this$props5.saveAs,
        template = _this$props5.template,
        readOnly = _this$props5.readOnly,
        onConfirm = _this$props5.onConfirm,
        onReject = _this$props5.onReject,
        userProfile = _this$props5.userProfile;
    var classes = classNames('template-creator-modal', this.props.className);
    return /*#__PURE__*/_jsxs("div", {
      className: classes,
      children: [/*#__PURE__*/_jsx(TemplateCreatorModalHeader, {
        headerText: headerText,
        showHeader: showHeader
      }), this.renderBody(), /*#__PURE__*/_jsx(TemplateCreatorModalFooter, {
        onSave: this.handleSave,
        saveAs: saveAs,
        template: template,
        readOnly: readOnly,
        onConfirm: onConfirm,
        onReject: onReject,
        checkForMeetings: this.checkForMeetings,
        hasInvalidToken: this.hasInvalidToken(),
        invalidTemplate: this.templateIsInvalid(),
        userProfile: userProfile,
        children: this.renderSuggestions()
      })]
    });
  }
});
export default connect(function (state) {
  return {
    permissions: state.permissions.get('permissionsData'),
    permissionsModified: state.permissions.get('permissionsModified')
  };
})(TemplateCreatorModal);