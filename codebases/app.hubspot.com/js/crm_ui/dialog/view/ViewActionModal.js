'use es6';

import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import _possibleConstructorReturn from "@babel/runtime/helpers/esm/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/esm/getPrototypeOf";
import _inherits from "@babel/runtime/helpers/esm/inherits";
import { jsxs as _jsxs } from "react/jsx-runtime";
import { jsx as _jsx } from "react/jsx-runtime";
import { USER } from 'reference-resolvers/constants/ReferenceObjectTypes';
import { Map as ImmutableMap } from 'immutable';
import { SHARING } from 'customer-data-objects/view/ViewTypes';
import { connect } from 'general-store';
import ConnectedAPIDropdown from 'customer-data-reference-ui-components/connector/ConnectedAPIDropdown';
import FormattedHTMLMessage from 'I18n/components/FormattedHTMLMessage';
import FormattedMessage from 'I18n/components/FormattedMessage';
import H2 from 'UIComponents/elements/headings/H2';
import ImmutablePropTypes from 'react-immutable-proptypes';
import ScopesContainer from '../../../containers/ScopesContainer';
import PromptablePropInterface from 'UIComponents/decorators/PromptablePropInterface';
import PropTypes from 'prop-types';
import { Component, Fragment } from 'react';
import UIAlert from 'UIComponents/alert/UIAlert';
import UIButton from 'UIComponents/button/UIButton';
import UIConfirmModal from 'UIComponents/dialog/UIConfirmModal';
import UIDialogBody from 'UIComponents/dialog/UIDialogBody';
import UIDialogCloseButton from 'UIComponents/dialog/UIDialogCloseButton';
import UIDialogFooter from 'UIComponents/dialog/UIDialogFooter';
import UIDialogHeader from 'UIComponents/dialog/UIDialogHeader';
import UIForm from 'UIComponents/form/UIForm';
import UIFormControl from 'UIComponents/form/UIFormControl';
import UIModal from 'UIComponents/dialog/UIModal';
import UITextInput from 'UIComponents/input/UITextInput';
import ViewSharingOptionsField from './ViewSharingOptionsField';
import ViewsStore from '../../flux/views/ViewsStore';
import get from 'transmute/get';
import getIn from 'transmute/getIn';
import unescapedText from 'I18n/utils/unescapedText';
import ViewsLimitsStore from '../../flux/views/ViewsLimitsStore';
import { isScoped } from '../../../containers/ScopeOperators';
import { MAX_VIEW_NAME_LENGTH } from '../../views/ViewNameLengthLimit';

var cleanViewName = function cleanViewName(name) {
  return name.trim().toLowerCase();
};

var ViewActionModal = /*#__PURE__*/function (_Component) {
  _inherits(ViewActionModal, _Component);

  function ViewActionModal(props) {
    var _this;

    _classCallCheck(this, ViewActionModal);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(ViewActionModal).call(this, props));

    _this.handleNameChange = function (evt) {
      var value = evt.target.value;

      _this.setState({
        formNameValue: value
      });
    };

    _this.handleOwnerIdChange = function (evt) {
      var value = evt.target.value;

      _this.setState({
        viewOwnerId: value,
        viewPrivate: true
      });
    };

    _this.handleViewSharingOptionsFieldChange = function (evt) {
      var _evt$target = evt.target,
          _evt$target$name = _evt$target.name,
          name = _evt$target$name === void 0 ? SHARING.TEAM : _evt$target$name,
          value = _evt$target.value;

      _this.setState({
        viewTeamId: name === SHARING.TEAM ? Number(value) : null,
        viewPrivate: name !== SHARING.PUBLIC
      });
    };

    _this.handleDone = function (evt) {
      var _this$props = _this.props,
          onConfirm = _this$props.onConfirm,
          view = _this$props.view;
      var _this$state = _this.state,
          formNameValue = _this$state.formNameValue,
          viewOwnerId = _this$state.viewOwnerId,
          viewPrivate = _this$state.viewPrivate,
          viewTeamId = _this$state.viewTeamId;
      var nextView = view.set('name', formNameValue).set('ownerId', viewOwnerId).set('private', viewPrivate).set('teamId', viewTeamId ? "" + viewTeamId : null);

      if (typeof evt === 'object') {
        evt.preventDefault();
        evt.stopPropagation();
      }

      _this.setState({
        confirmedView: nextView
      });

      onConfirm(nextView);
    };

    _this.handleStopPropagation = function (evt) {
      evt.stopPropagation();
      return false;
    };

    _this.state = {
      didBlurNameField: false,
      formNameValue: _this.getInitialViewName(props),
      viewOwnerId: props.view.get('ownerId'),
      viewPrivate: props.view.get('private'),
      viewTeamId: props.view.get('teamId'),
      confirmedView: null
    };
    return _this;
  }

  _createClass(ViewActionModal, [{
    key: "getInitialViewName",
    value: function getInitialViewName(props) {
      var action = props.action,
          view = props.view;
      var name = view.get('name');

      switch (action) {
        case 'create':
        case 'createAsCopy':
          return '';

        case 'clone':
          return unescapedText('filterSidebar.modifyView.nameClone', {
            name: name
          });

        default:
          return name;
      }
    }
  }, {
    key: "getIsNameDuplicate",
    value: function getIsNameDuplicate(value) {
      var _this$props2 = this.props,
          viewNames = _this$props2.viewNames,
          view = _this$props2.view;
      var _this$state2 = this.state,
          confirmedView = _this$state2.confirmedView,
          formNameValue = _this$state2.formNameValue; // The current view matches the new view name

      if (cleanViewName(formNameValue) === cleanViewName(view.get('name'))) {
        return true;
      } // Other views match the new view name


      var expected = cleanViewName(value);
      var confirmedViewName = confirmedView && cleanViewName(confirmedView.name);
      return viewNames.remove(confirmedViewName).has(expected);
    }
  }, {
    key: "getIsNameValid",
    value: function getIsNameValid(str) {
      return str && str.length > 0 && !this.getIsNameDuplicate(str);
    }
  }, {
    key: "getViewShareValue",
    value: function getViewShareValue(viewState) {
      var viewPrivate = viewState.viewPrivate,
          viewTeamId = viewState.viewTeamId;
      return viewPrivate ? viewTeamId || SHARING.PRIVATE : SHARING.PUBLIC;
    }
  }, {
    key: "render",
    value: function render() {
      var _this2 = this;

      var _this$props3 = this.props,
          action = _this$props3.action,
          isOwner = _this$props3.isOwner,
          objectType = _this$props3.objectType,
          onReject = _this$props3.onReject,
          view = _this$props3.view,
          viewUsageCount = _this$props3.viewUsageCount,
          viewUsageLimit = _this$props3.viewUsageLimit,
          viewUsageLimitThreshold = _this$props3.viewUsageLimitThreshold;
      var _this$state3 = this.state,
          didBlurNameField = _this$state3.didBlurNameField,
          formNameValue = _this$state3.formNameValue,
          viewPrivate = _this$state3.viewPrivate,
          viewTeamId = _this$state3.viewTeamId;
      var actionNamesForLimitEnforcement = ['clone', 'create', 'createAsCopy'];
      var actionNamesForNameField = ['clone', 'create', 'createAsCopy', 'rename'];
      var actionNamesForShareField = ['create', 'createAsCopy', 'manageSharing', 'share'];
      var actionNamesForShareSettings = ['manageSharing', 'share'];
      var isUsageNearLimit = actionNamesForLimitEnforcement.includes(action) && !!viewUsageCount && !!viewUsageLimit && viewUsageCount + viewUsageLimitThreshold >= viewUsageLimit;
      var isViewNameInputInErrorState = actionNamesForNameField.includes(action) && didBlurNameField && !this.getIsNameValid(formNameValue);
      var isSubmitDisabled = actionNamesForLimitEnforcement.includes(action) && !!viewUsageCount && !!viewUsageLimit && viewUsageCount >= viewUsageLimit || actionNamesForNameField.includes(action) && !this.getIsNameValid(formNameValue) || ['manageSharing', 'share'].includes(action) && viewPrivate === view.get('private') && Number(viewTeamId) === Number(view.get('teamId'));

      if (action === 'delete') {
        return /*#__PURE__*/_jsx(UIConfirmModal, {
          "data-selenium-test": "view-deletion-modal",
          onClick: this.handleStopPropagation,
          use: "danger",
          message: /*#__PURE__*/_jsx(FormattedMessage, {
            message: "filterSidebar.modifyView.delete"
          }),
          confirmLabel: /*#__PURE__*/_jsx(FormattedMessage, {
            message: "deleteModal.buttonText"
          }),
          onConfirm: this.handleDone,
          onReject: onReject,
          description: /*#__PURE__*/_jsxs(Fragment, {
            children: [/*#__PURE__*/_jsx(FormattedHTMLMessage, {
              message: "deleteModal.message",
              options: {
                type: formNameValue
              }
            }), !isOwner && /*#__PURE__*/_jsx("p", {
              children: /*#__PURE__*/_jsx(FormattedMessage, {
                message: "filterSidebar.modifyView.notOwner"
              })
            })]
          })
        });
      }

      return /*#__PURE__*/_jsx(UIModal, {
        onClick: this.handleStopPropagation,
        children: /*#__PURE__*/_jsxs(UIForm, {
          disabled: isSubmitDisabled,
          onSubmit: this.handleDone,
          children: [/*#__PURE__*/_jsxs(UIDialogHeader, {
            children: [/*#__PURE__*/_jsx(UIDialogCloseButton, {
              onClick: onReject
            }), /*#__PURE__*/_jsx(H2, {
              children: /*#__PURE__*/_jsx(FormattedMessage, {
                message: "filterSidebar.modifyView." + action
              })
            })]
          }), /*#__PURE__*/_jsxs(UIDialogBody, {
            children: [isUsageNearLimit && /*#__PURE__*/_jsx(UIAlert, {
              className: "m-bottom-2",
              type: "info",
              titleText: /*#__PURE__*/_jsx(FormattedMessage, {
                message: "filterSidebar.savedViewLimitAlert.title",
                options: {
                  count: viewUsageCount,
                  limit: viewUsageLimit,
                  objectTypeLabel: unescapedText("genericTypes." + objectType)
                }
              }),
              children: /*#__PURE__*/_jsx(FormattedMessage, {
                message: "filterSidebar.savedViewLimitAlert.text",
                options: {
                  count: viewUsageCount,
                  limit: viewUsageLimit,
                  objectTypeLabel: unescapedText("genericTypes." + objectType)
                }
              })
            }), actionNamesForNameField.includes(action) && /*#__PURE__*/_jsx(UIFormControl, {
              error: isViewNameInputInErrorState,
              label: /*#__PURE__*/_jsx(FormattedMessage, {
                message: "filterSidebar.viewName"
              }),
              onBlur: function onBlur() {
                _this2.setState({
                  didBlurNameField: true
                });
              },
              onKeyDown: this.handleStopPropagation,
              required: true,
              validationMessage: formNameValue && this.getIsNameDuplicate(formNameValue) && /*#__PURE__*/_jsx(FormattedHTMLMessage, {
                message: "filterSidebar.modifyView.duplicate",
                options: {
                  name: formNameValue
                }
              }),
              children: /*#__PURE__*/_jsx(UITextInput, {
                autoComplete: "off",
                maxLength: MAX_VIEW_NAME_LENGTH,
                autoFocus: true,
                "data-selenium-test": "view-name-input",
                defaultValue: formNameValue,
                onChange: this.handleNameChange
              })
            }), actionNamesForShareField.includes(action) && /*#__PURE__*/_jsx(ViewSharingOptionsField, {
              disableCurrentSettingView: !actionNamesForShareSettings.includes(action),
              onChange: this.handleViewSharingOptionsFieldChange,
              onKeyDown: this.handleStopPropagation,
              value: this.getViewShareValue(this.state)
            }), action === 'send' && isScoped(ScopesContainer.get(), 'bet-send-view') && /*#__PURE__*/_jsx(UIFormControl, {
              label: /*#__PURE__*/_jsx(FormattedMessage, {
                message: "filterSidebar.createForUser"
              }),
              children: /*#__PURE__*/_jsx(ConnectedAPIDropdown, {
                onChange: this.handleOwnerIdChange,
                referenceObjectType: USER
              })
            })]
          }), /*#__PURE__*/_jsxs(UIDialogFooter, {
            children: [/*#__PURE__*/_jsx(UIButton, {
              "data-selenium-test": "view-modal-save-btn",
              disabled: isSubmitDisabled,
              onClick: this.handleDone,
              use: "primary",
              children: /*#__PURE__*/_jsx(FormattedMessage, {
                message: "crm_components.GenericModal.saveActionButton"
              })
            }), /*#__PURE__*/_jsx(UIButton, {
              onClick: onReject,
              use: "secondary",
              children: /*#__PURE__*/_jsx(FormattedMessage, {
                message: "crm_components.GenericModal.saveChangesCancel"
              })
            })]
          })]
        })
      });
    }
  }]);

  return ViewActionModal;
}(Component);

ViewActionModal.propTypes = Object.assign({}, PromptablePropInterface, {
  action: PropTypes.oneOf(['clone', 'create', 'createAsCopy', 'delete', 'manageSharing', 'rename', 'send', 'share']).isRequired,
  objectType: PropTypes.string.isRequired,
  view: ImmutablePropTypes.contains({
    id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
    name: PropTypes.string.isRequired,
    ownerId: PropTypes.number.isRequired,
    private: PropTypes.bool.isRequired,
    teamId: PropTypes.number
  }).isRequired,
  viewNames: ImmutablePropTypes.setOf(PropTypes.string).isRequired,
  viewUsageCount: PropTypes.number,
  viewUsageLimit: PropTypes.number,
  viewUsageLimitThreshold: PropTypes.number
});
ViewActionModal.defaultProps = {
  viewUsageLimitThreshold: 5
};
var deps = {
  viewNames: {
    stores: [ViewsStore],
    deref: function deref(props) {
      var objectType = props.objectType,
          view = props.view;
      var views = ViewsStore.get(ImmutableMap({
        objectType: objectType
      })) || ImmutableMap();
      return views.valueSeq().map(get('name')).map(function (str) {
        return str.toLowerCase();
      }).toSet().delete(view.get('name').toLowerCase());
    }
  },
  viewUsageCount: {
    stores: [ViewsLimitsStore],
    deref: function deref(props) {
      var objectType = props.objectType;
      var viewUsageLimitCountsByObjectType = ViewsLimitsStore.get();
      return getIn([objectType, 'count'], viewUsageLimitCountsByObjectType);
    }
  },
  viewUsageLimit: {
    stores: [ViewsLimitsStore],
    deref: function deref(props) {
      var objectType = props.objectType;
      var viewUsageLimitCountsByObjectType = ViewsLimitsStore.get();
      return getIn([objectType, 'limit'], viewUsageLimitCountsByObjectType);
    }
  }
};
export default connect(deps)(ViewActionModal);