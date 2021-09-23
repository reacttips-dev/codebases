'use es6';

import { jsxs as _jsxs } from "react/jsx-runtime";
import { jsx as _jsx } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import createReactClass from 'create-react-class';
import I18n from 'I18n';
import unescapedText from 'I18n/utils/unescapedText';
import FormattedMessage from 'I18n/components/FormattedMessage';
import SearchResultRecord from 'SalesContentIndexUI/data/records/SearchResultRecord';
import * as NameCharacterLimit from 'SalesContentIndexUI/constants/NameCharacterLimit';
import UIModal from 'UIComponents/dialog/UIModal';
import UIDialogBody from 'UIComponents/dialog/UIDialogBody';
import UIDialogFooter from 'UIComponents/dialog/UIDialogFooter';
import UIButton from 'UIComponents/button/UIButton';
import UIFormControl from 'UIComponents/form/UIFormControl';
import UITextInput from 'UIComponents/input/UITextInput';
import H2 from 'UIComponents/elements/headings/H2';
import UIDialogHeader from 'UIComponents/dialog/UIDialogHeader';
import UIForm from 'UIComponents/form/UIForm';
import UISelect from 'UIComponents/input/UISelect';
import * as folderOptions from '../../utils/folderOptions';
import { FOLDER_CONTENT_TYPES } from 'SalesContentIndexUI/data/constants/FolderContentTypes';
import UIDialogCloseButton from 'UIComponents/dialog/UIDialogCloseButton';
export default createReactClass({
  displayName: "CloneModal",
  propTypes: {
    CloneOptionsComponent: PropTypes.elementType,
    folderContentType: PropTypes.oneOf(FOLDER_CONTENT_TYPES),
    searchResult: PropTypes.instanceOf(SearchResultRecord).isRequired,
    onConfirm: PropTypes.func.isRequired,
    onReject: PropTypes.func.isRequired,
    loadFolderOptions: PropTypes.func
  },
  getInitialState: function getInitialState() {
    var searchResult = this.props.searchResult;
    return {
      cloneOptions: {},
      folderId: searchResult.get('folderId', null),
      folderOptions: null,
      name: unescapedText('salesContentIndexUI.clone', {
        name: searchResult.get('name')
      })
    };
  },
  submit: function submit(evt) {
    if (evt) {
      evt.preventDefault();
    }

    var _this$state = this.state,
        cloneOptions = _this$state.cloneOptions,
        name = _this$state.name,
        folderId = _this$state.folderId;

    var _this$validateName = this.validateName(),
        nameIsInvalid = _this$validateName.nameIsInvalid;

    if (nameIsInvalid) {
      return null;
    }

    return this.props.onConfirm(Object.assign({
      name: name,
      folderId: folderId
    }, cloneOptions));
  },
  updateCloneOptions: function updateCloneOptions(updatedCloneOptions) {
    this.setState({
      cloneOptions: Object.assign({}, this.state.cloneOptions, {}, updatedCloneOptions)
    });
  },
  handleNameChange: function handleNameChange(name) {
    this.setState({
      name: name
    });
  },
  validateName: function validateName() {
    var searchResult = this.props.searchResult;
    var name = this.state.name;
    var contentType = searchResult.get('contentType');
    var validName = name ? name.length > 0 && name.length < NameCharacterLimit[contentType] : false;
    var validationMessage = null;

    if (!name) {
      validationMessage = /*#__PURE__*/_jsx(FormattedMessage, {
        message: "salesContentIndexUI.cloneModal.name.error." + contentType + ".noName"
      });
    }

    if (name.length >= NameCharacterLimit[contentType]) {
      validationMessage = /*#__PURE__*/_jsx(FormattedMessage, {
        message: "salesContentIndexUI.cloneModal.name.error." + contentType + ".nameTooLong"
      });
    }

    return {
      nameIsInvalid: !validName,
      validationMessage: validationMessage
    };
  },
  renderNameControl: function renderNameControl(_ref) {
    var _this = this;

    var contentType = _ref.contentType,
        nameIsInvalid = _ref.nameIsInvalid,
        validationMessage = _ref.validationMessage;
    var name = this.state.name;
    return /*#__PURE__*/_jsx(UIFormControl, {
      error: nameIsInvalid,
      label: /*#__PURE__*/_jsx(FormattedMessage, {
        message: "salesContentIndexUI.cloneModal.name.label." + contentType
      }),
      validationMessage: validationMessage,
      children: /*#__PURE__*/_jsx(UITextInput, {
        autoFocus: true,
        defaultValue: name,
        placeholder: I18n.text("salesContentIndexUI.cloneModal.name.placeholder." + contentType),
        onChange: function onChange(_ref2) {
          var value = _ref2.target.value;
          return _this.handleNameChange(value);
        }
      })
    });
  },
  renderFolderControl: function renderFolderControl(_ref3) {
    var _this2 = this;

    var contentType = _ref3.contentType;
    var _this$props = this.props,
        folderContentType = _this$props.folderContentType,
        loadFolderOptions = _this$props.loadFolderOptions;
    var folderId = this.state.folderId; // Temporary until we migrate consumers to pass `folderContentType`.

    var loadOptions = loadFolderOptions;

    if (folderContentType) {
      loadOptions = function loadOptions(searchString, callback) {
        return folderOptions.loadFolderOptions(folderContentType, searchString, callback);
      };
    }

    var showFolderSelect = Boolean(loadOptions);

    var onSelectFolder = function onSelectFolder(_ref4) {
      var value = _ref4.target.value;
      return _this2.setState({
        folderId: value || null
      });
    };

    if (showFolderSelect) {
      return /*#__PURE__*/_jsx(UIFormControl, {
        label: /*#__PURE__*/_jsx(FormattedMessage, {
          message: "salesContentIndexUI.cloneModal.folder.label." + contentType
        }),
        children: /*#__PURE__*/_jsx(UISelect, {
          clearable: true,
          loadOptions: loadOptions,
          onChange: onSelectFolder,
          placeholder: I18n.text("salesContentIndexUI.cloneModal.folder.placeholder." + contentType),
          value: folderId
        })
      });
    }

    return null;
  },
  renderCloneOptionFields: function renderCloneOptionFields() {
    var CloneOptionsComponent = this.props.CloneOptionsComponent;

    if (CloneOptionsComponent) {
      return /*#__PURE__*/_jsx(CloneOptionsComponent, {
        cloneOptions: this.state.cloneOptions,
        searchResult: this.props.searchResult,
        updateCloneOptions: this.updateCloneOptions
      });
    }

    return null;
  },
  render: function render() {
    var _this$props2 = this.props,
        searchResult = _this$props2.searchResult,
        onReject = _this$props2.onReject;
    var contentType = searchResult.get('contentType');

    var _this$validateName2 = this.validateName(),
        nameIsInvalid = _this$validateName2.nameIsInvalid,
        validationMessage = _this$validateName2.validationMessage;

    return /*#__PURE__*/_jsx(UIModal, {
      dialogClassName: "clone-modal",
      size: "auto",
      onEsc: onReject,
      children: /*#__PURE__*/_jsxs(UIForm, {
        onSubmit: this.submit,
        children: [/*#__PURE__*/_jsxs(UIDialogHeader, {
          children: [/*#__PURE__*/_jsx(UIDialogCloseButton, {
            onClick: onReject
          }), /*#__PURE__*/_jsx(H2, {
            children: /*#__PURE__*/_jsx(FormattedMessage, {
              message: "salesContentIndexUI.cloneModal.heading." + contentType
            })
          })]
        }), /*#__PURE__*/_jsxs(UIDialogBody, {
          children: [this.renderNameControl({
            contentType: contentType,
            nameIsInvalid: nameIsInvalid,
            validationMessage: validationMessage
          }), this.renderFolderControl({
            contentType: contentType
          }), this.renderCloneOptionFields()]
        }), /*#__PURE__*/_jsxs(UIDialogFooter, {
          children: [/*#__PURE__*/_jsx(UIButton, {
            disabled: nameIsInvalid,
            "data-selenium-test": "clone-save-button",
            type: "submit",
            use: "primary",
            children: /*#__PURE__*/_jsx(FormattedMessage, {
              message: "salesContentIndexUI.cloneModal.save"
            })
          }), /*#__PURE__*/_jsx(UIButton, {
            use: "tertiary-light",
            onClick: onReject,
            children: /*#__PURE__*/_jsx(FormattedMessage, {
              message: "salesContentIndexUI.cloneModal.cancel"
            })
          })]
        })]
      })
    });
  }
});