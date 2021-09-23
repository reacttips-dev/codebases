'use es6';

import _defineProperty from "@babel/runtime/helpers/esm/defineProperty";
import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import _possibleConstructorReturn from "@babel/runtime/helpers/esm/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/esm/getPrototypeOf";
import _assertThisInitialized from "@babel/runtime/helpers/esm/assertThisInitialized";
import _inherits from "@babel/runtime/helpers/esm/inherits";
import { jsxs as _jsxs } from "react/jsx-runtime";
import { jsx as _jsx } from "react/jsx-runtime";
import { List, Map as ImmutableMap, Record } from 'immutable';
import I18n from 'I18n';
import FormattedHTMLMessage from 'I18n/components/FormattedHTMLMessage';
import PropTypes from 'prop-types';
import { Fragment } from 'react';
import emptyFunction from 'react-utils/emptyFunction';
import { mapContains } from 'react-immutable-proptypes';
import uniqueId from 'transmute/uniqueId';
import ReferenceResolverType from 'reference-resolvers/schema/ReferenceResolverType';
import { EERIE, CALYPSO_DARK } from 'HubStyleTokens/colors';
import UIButton from 'UIComponents/button/UIButton';
import HR from 'UIComponents/elements/HR';
import UIForm from 'UIComponents/form/UIForm';
import UIFormLabel from 'UIComponents/form/UIFormLabel';
import UIGrid from 'UIComponents/grid/UIGrid';
import UIGridItem from 'UIComponents/grid/UIGridItem';
import UIIcon from 'UIComponents/icon/UIIcon';
import UIPopover from 'UIComponents/tooltip/UIPopover';
import UITruncateString from 'UIComponents/text/UITruncateString';
import ContactRecord from 'customer-data-objects/contact/ContactRecord';
import PureComponent from 'customer-data-ui-utilities/component/PureComponent';
import partial from 'transmute/partial';
import memoize from 'transmute/memoize';
import DeleteEmailPrompt from 'customer-data-properties/prompt/DeleteEmailPrompt';
import PropertyInputMultipleEmailInput from 'customer-data-properties/input/PropertyInputMultipleEmailInput';
import { addError } from 'customer-data-ui-utilities/alerts/Alerts';

var handleError = function handleError(property, error) {
  if (error && error.responseJSON && error.responseJSON.message) {
    return addError(error.responseJSON.message);
  }

  return addError('customerDataProperties.PropertyInputMultipleEmail.genericError');
};

var propTypes = {
  actions: PropTypes.shape({
    addSecondaryEmail: PropTypes.func.isRequired,
    deleteSecondaryEmail: PropTypes.func.isRequired,
    promoteEmailToPrimary: PropTypes.func.isRequired,
    updateContactProperties: PropTypes.func.isRequired,
    updateSecondaryEmail: PropTypes.func.isRequired
  }),
  onPrimaryPromoted: PropTypes.func.isRequired,
  onPrimaryPromotedError: PropTypes.func.isRequired,
  onPrimaryUpdated: PropTypes.func.isRequired,
  onPrimaryUpdatedError: PropTypes.func.isRequired,
  onSecondaryAdded: PropTypes.func.isRequired,
  onSecondaryAddedError: PropTypes.func.isRequired,
  onSecondaryDeleted: PropTypes.func.isRequired,
  onSecondaryDeletedError: PropTypes.func.isRequired,
  onSecondaryUpdated: PropTypes.func.isRequired,
  onSecondaryUpdatedError: PropTypes.func.isRequired,
  onTracking: PropTypes.func,
  readOnly: PropTypes.bool.isRequired,
  disabled: PropTypes.bool.isRequired,
  resolver: PropTypes.oneOfType([mapContains({
    contacts: ReferenceResolverType.isRequired,
    contactsEmail: ReferenceResolverType.isRequired
  }), ReferenceResolverType]),
  additionalEmails: PropTypes.string,
  subject: PropTypes.instanceOf(ContactRecord).isRequired,
  subjectId: PropTypes.string,
  value: PropTypes.string.isRequired,
  'data-selenium-test': PropTypes.string
};
var defaultProps = {
  onPrimaryPromoted: emptyFunction,
  onPrimaryPromotedError: handleError,
  onPrimaryUpdated: emptyFunction,
  onSecondaryAdded: emptyFunction,
  onPrimaryUpdatedError: handleError,
  onSecondaryAddedError: handleError,
  onSecondaryDeleted: emptyFunction,
  onSecondaryDeletedError: handleError,
  onSecondaryUpdated: emptyFunction,
  onSecondaryUpdatedError: handleError,
  readOnly: false,
  disabled: false
};
var DraftEmailRecord = Record({
  value: null,
  isPrimary: false,
  isNewEmail: false
});

var generateId = function generateId() {
  return uniqueId('new-email');
};

var PropertyInputMultipleEmail = /*#__PURE__*/function (_PureComponent) {
  _inherits(PropertyInputMultipleEmail, _PureComponent);

  function PropertyInputMultipleEmail(props) {
    var _this;

    _classCallCheck(this, PropertyInputMultipleEmail);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(PropertyInputMultipleEmail).call(this, props)); // In new code, please use ES6 spread args rather than partials
    // for easier debugging and readability:
    // (...args) => myFunction('partiallyAppliedParam', ...args)

    _this.handleShowPopover = function () {
      _this.setState({
        open: true
      });
    };

    _this.handleEmailDraftChange = function (key, value) {
      var draftValue = _this.state.emailDraftValues.get(key);

      var nextDraftValue = draftValue.set('value', value);

      var emailDraftValues = _this.state.emailDraftValues.set(key, nextDraftValue);

      _this.setState({
        emailDraftValues: emailDraftValues
      });
    };

    _this.handleSaveEmailDraftChanges = function (email) {
      var emailDraftValues = _this.state.emailDraftValues;
      var emailToUpdate = emailDraftValues.get(email);
      var nextDraftValues = emailDraftValues.delete(email);

      if (emailToUpdate.get('isPrimary')) {
        _this.savePrimaryChanges(email, emailToUpdate, nextDraftValues);
      } else if (emailToUpdate.get('isNewEmail')) {
        _this.saveNewEmail(email, emailToUpdate, nextDraftValues);
      } else {
        _this.saveSecondaryChanges(email, emailToUpdate, nextDraftValues);
      }
    };

    _this.handleCancelEmailDraftChanges = function (value) {
      var emailDraftValues = _this.state.emailDraftValues;
      var draftEmail = emailDraftValues.get(value);
      var isNewEmail = draftEmail.get('isNewEmail');

      if (isNewEmail) {
        _this.setState({
          emailDraftValues: emailDraftValues.delete(value)
        });

        return;
      }

      var updatedDraftEmail = draftEmail.set('value', value);

      _this.setState({
        emailDraftValues: emailDraftValues.set(value, updatedDraftEmail)
      });
    };

    _this.handlePromoteToPrimary = function (emailToPromote) {
      var emailDraftValues = _this.state.emailDraftValues;
      var _this$props = _this.props,
          onPrimaryPromoted = _this$props.onPrimaryPromoted,
          onPrimaryPromotedError = _this$props.onPrimaryPromotedError,
          subject = _this$props.subject,
          promoteEmailToPrimary = _this$props.actions.promoteEmailToPrimary,
          onTracking = _this$props.onTracking; // handling catch here (and similarly in other save methods here)
      // so we can maintain the order of the drafts on save

      promoteEmailToPrimary(subject, emailToPromote).then(_this.partial(onPrimaryPromoted, emailToPromote)).catch(function (error) {
        onPrimaryPromotedError(null, error);

        _this.setState({
          emailDraftValues: emailDraftValues
        });
      });
      var nextDraftValues = emailDraftValues.map(function (email) {
        var isThisPrimary = emailToPromote === email.value;
        return email.set('isPrimary', isThisPrimary);
      });

      if (typeof onTracking === 'function') {
        onTracking('changes primary email in multiple email property input');
      }

      return _this.setState({
        emailDraftValues: nextDraftValues
      });
    };

    _this.handleConfirmDelete = function (emailToDelete) {
      var emailDraftValues = _this.state.emailDraftValues;
      var _this$props2 = _this.props,
          onPrimaryUpdatedError = _this$props2.onPrimaryUpdatedError,
          onPrimaryUpdated = _this$props2.onPrimaryUpdated,
          onSecondaryDeleted = _this$props2.onSecondaryDeleted,
          onSecondaryDeletedError = _this$props2.onSecondaryDeletedError,
          subject = _this$props2.subject,
          _this$props2$actions = _this$props2.actions,
          deleteSecondaryEmail = _this$props2$actions.deleteSecondaryEmail,
          updateContactProperties = _this$props2$actions.updateContactProperties;
      var draftEmail = emailDraftValues.get(emailToDelete);
      var isPrimaryEmail = draftEmail.get('isPrimary');
      var nextDraftValues;

      if (isPrimaryEmail) {
        updateContactProperties(subject, ImmutableMap({
          email: ''
        }), onPrimaryUpdatedError);
        nextDraftValues = emailDraftValues.filter(function (email) {
          return email.get('value') !== emailToDelete;
        });
        onPrimaryUpdated();
      } else {
        deleteSecondaryEmail(subject, emailToDelete).catch(function (error) {
          onSecondaryDeletedError(null, error);

          _this.setState({
            emailDraftValues: emailDraftValues
          });
        });
        nextDraftValues = emailDraftValues.filter(function (email) {
          return email.get('value') !== emailToDelete;
        });
        onSecondaryDeleted();
      }

      return _this.setState({
        emailDraftValues: nextDraftValues
      });
    };

    _this.handleEmailDelete = function (email) {
      var emailDraftValues = _this.state.emailDraftValues;
      var draftEmail = emailDraftValues.get(email);

      if (draftEmail.get('isNewEmail')) {
        var nextDraftValues = emailDraftValues.delete(email);

        _this.setState({
          emailDraftValues: nextDraftValues
        });

        return;
      }

      DeleteEmailPrompt(_this.partial(_this.handleConfirmDelete, email), _this.handleRejectDeletePrompt, email);
    };

    _this.handleAddNewEmailInput = function () {
      var emailDraftValues = _this.state.emailDraftValues; // case: we have deleted all emails, and are adding a new default email
      // without reloading the page

      var isFirstEmail = emailDraftValues.size === 0;
      var emailDraftProperties = {
        isNewEmail: true,
        value: '',
        isPrimary: isFirstEmail
      };

      if (emailDraftValues.size === 0) {
        emailDraftProperties.isPrimary = true;
      }

      var nextDrafts = emailDraftValues.set(generateId(), DraftEmailRecord(emailDraftProperties));

      _this.setState({
        emailDraftValues: nextDrafts
      });
    };

    _this.partial = memoize(partial);
    _this.focus = _this.focus.bind(_assertThisInitialized(_this));
    _this.renderEmailInput = _this.renderEmailInput.bind(_assertThisInitialized(_this));
    _this.state = {
      open: false,
      emailDraftValues: _this.getInitialDraftValues(),
      newEmailsDraft: null
    };
    return _this;
  }

  _createClass(PropertyInputMultipleEmail, [{
    key: "getInitialDraftValues",
    value: function getInitialDraftValues() {
      var additionalEmails = this.props.additionalEmails;
      var value = this.props.value.trim();
      var secondaryEmailValues = List();
      var primaryDraft;

      if (value) {
        primaryDraft = _defineProperty({}, value, DraftEmailRecord({
          value: value,
          isPrimary: true
        }));
      } else {
        primaryDraft = _defineProperty({}, generateId, DraftEmailRecord({
          value: '',
          isNewEmail: true,
          isPrimary: true
        }));
      }

      if (additionalEmails && additionalEmails.length) {
        secondaryEmailValues = List(additionalEmails.split(';'));
      }

      return secondaryEmailValues.reduce(function (acc, email) {
        if (email === value) {
          return acc;
        }

        return acc.set(email, DraftEmailRecord({
          value: email
        }));
      }, ImmutableMap(primaryDraft));
    } // called from parent

  }, {
    key: "focus",
    value: function focus() {
      var open = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;
      this.setState({
        open: open
      });

      if (!open) {
        this.setState({
          emailDraftValues: this.getInitialDraftValues(),
          newEmailsDraft: null
        });
      }
    }
  }, {
    key: "getPropertyInputEmailDefaultProps",
    value: function getPropertyInputEmailDefaultProps() {
      return {
        showError: true,
        subjectId: this.props.subjectId,
        onCancel: emptyFunction,
        readOnly: this.props.readOnly,
        disabled: this.props.disabled
      };
    }
  }, {
    key: "getDraftEmails",
    value: function getDraftEmails() {
      return this.state.emailDraftValues.reduce(function (acc, email) {
        acc.push(email.get('value'));
        return acc;
      }, []);
    }
  }, {
    key: "savePrimaryChanges",
    value: function savePrimaryChanges(email, emailToUpdate, nextDraftValues) {
      var _this$props3 = this.props,
          onPrimaryUpdated = _this$props3.onPrimaryUpdated,
          subject = _this$props3.subject,
          updateContactProperties = _this$props3.actions.updateContactProperties,
          onPrimaryUpdatedError = _this$props3.onPrimaryUpdatedError;
      var nextEmailValue = emailToUpdate.get('value'); // contact never had an email value

      if (emailToUpdate.get('isNewEmail')) {
        var nextEmailDraft = emailToUpdate.set('isNewEmail', false);
        nextDraftValues = nextDraftValues.set(nextEmailValue, nextEmailDraft);
      } else {
        nextDraftValues = nextDraftValues.set(nextEmailValue, emailToUpdate);
      }

      updateContactProperties(subject, ImmutableMap({
        email: nextEmailValue
      }), onPrimaryUpdatedError);
      onPrimaryUpdated();
      this.setState({
        emailDraftValues: nextDraftValues
      });
    }
  }, {
    key: "saveNewEmail",
    value: function saveNewEmail(email, emailToUpdate, nextDraftValues) {
      var _this2 = this;

      var _this$props4 = this.props,
          onSecondaryAdded = _this$props4.onSecondaryAdded,
          onSecondaryAddedError = _this$props4.onSecondaryAddedError,
          subject = _this$props4.subject,
          addSecondaryEmail = _this$props4.actions.addSecondaryEmail;
      var nextEmailValue = emailToUpdate.get('value');
      emailToUpdate = emailToUpdate.set('isNewEmail', false);
      nextDraftValues = nextDraftValues.set(nextEmailValue, emailToUpdate);
      addSecondaryEmail(subject, nextEmailValue).catch(function (error) {
        _this2.setState({
          emailDraftValues: nextDraftValues.delete(nextEmailValue)
        });

        onSecondaryAddedError(null, error);
      });
      this.setState({
        emailDraftValues: nextDraftValues
      });
      onSecondaryAdded();
    }
  }, {
    key: "saveSecondaryChanges",
    value: function saveSecondaryChanges(email, emailToUpdate, nextDraftValues) {
      var _this$props5 = this.props,
          onSecondaryUpdated = _this$props5.onSecondaryUpdated,
          onSecondaryUpdatedError = _this$props5.onSecondaryUpdatedError,
          subject = _this$props5.subject,
          updateSecondaryEmail = _this$props5.actions.updateSecondaryEmail;
      var nextEmailValue = emailToUpdate.get('value');
      nextDraftValues = nextDraftValues.set(nextEmailValue, emailToUpdate);
      updateSecondaryEmail(subject, email, nextEmailValue).catch(function (error) {
        onSecondaryUpdatedError(null, error);
      });
      this.setState({
        emailDraftValues: nextDraftValues
      });
      onSecondaryUpdated();
    }
  }, {
    key: "renderInlineEmails",
    value: function renderInlineEmails() {
      var value = this.props.value;
      var className = value === ' ' ? 'p-bottom-5' : 'p-top-1';
      var emails = this.getDraftEmails();
      return /*#__PURE__*/_jsx("div", {
        onClick: this.partial(this.focus, !this.state.open),
        className: className,
        "data-selenium-test": this.props['data-selenium-test'],
        children: /*#__PURE__*/_jsx(UITruncateString, {
          children: emails.join(I18n.text('customerDataProperties.PropertyInputMultipleEmail.commaSeparatorKey'))
        })
      });
    }
  }, {
    key: "renderEmailInput",
    value: function renderEmailInput(emailKey, idx) {
      var emailDraftValues = this.state.emailDraftValues;
      var subject = this.props.subject;
      var resolver = this.props.resolver;

      if (ImmutableMap.isMap(resolver)) {
        resolver = resolver.get('contactsEmail');
      }

      return /*#__PURE__*/_jsxs(Fragment, {
        children: [idx > 0 && /*#__PURE__*/_jsx(HR, {
          className: "m-bottom-3 m-top-5"
        }), /*#__PURE__*/_jsx(PropertyInputMultipleEmailInput, {
          draftEmails: emailDraftValues,
          onCancel: this.handleCancelEmailDraftChanges,
          onChange: this.handleEmailDraftChange,
          onDelete: this.handleEmailDelete,
          onSave: this.handleSaveEmailDraftChanges,
          promoteToPrimary: this.handlePromoteToPrimary,
          propertyInputEmailDefaultProps: this.getPropertyInputEmailDefaultProps(),
          resolver: resolver,
          subject: subject,
          value: emailKey,
          "data-selenium-test": this.props['data-selenium-test']
        }, emailKey)]
      }, emailKey);
    }
  }, {
    key: "renderAddNewEmailButton",
    value: function renderAddNewEmailButton() {
      if (this.props.readOnly || this.props.disabled) {
        return null;
      }

      return /*#__PURE__*/_jsxs(UIButton, {
        use: "transparent",
        onClick: this.handleAddNewEmailInput,
        className: "p-left-0 m-top-3 m-left-4 m-bottom-0",
        children: [/*#__PURE__*/_jsx(UIIcon, {
          name: "add",
          size: "xxs",
          color: CALYPSO_DARK
        }), /*#__PURE__*/_jsx(FormattedHTMLMessage, {
          message: "customerDataProperties.PropertyInputMultipleEmail.addEmail"
        })]
      });
    }
  }, {
    key: "renderPopoverBody",
    value: function renderPopoverBody() {
      var emailDraftValues = this.state.emailDraftValues;
      return /*#__PURE__*/_jsxs("div", {
        children: [/*#__PURE__*/_jsxs(UIForm, {
          className: "m-top-0 m-left-4",
          children: [/*#__PURE__*/_jsxs(UIGrid, {
            children: [/*#__PURE__*/_jsx(UIGridItem, {
              size: {
                xs: 10
              },
              className: "p-left-0",
              children: /*#__PURE__*/_jsx(UIFormLabel, {
                children: /*#__PURE__*/_jsx(FormattedHTMLMessage, {
                  message: "customerDataProperties.PropertyInputMultipleEmail.label"
                })
              })
            }), /*#__PURE__*/_jsx(UIGridItem, {
              size: {
                xs: 2
              },
              className: "justify-end",
              children: /*#__PURE__*/_jsx(UIIcon, {
                name: "remove",
                size: "xxs",
                color: EERIE,
                onClick: this.partial(this.focus, false)
              })
            })]
          }), /*#__PURE__*/_jsx("div", {
            className: 'overflow-y-auto overflow-x-hidden ',
            style: {
              maxHeight: '60vh'
            },
            children: emailDraftValues.keySeq().map(this.renderEmailInput)
          })]
        }), this.renderAddNewEmailButton()]
      });
    }
  }, {
    key: "render",
    value: function render() {
      return /*#__PURE__*/_jsx(UIGridItem, {
        size: {
          xs: 12
        },
        className: "p-x-0",
        children: /*#__PURE__*/_jsx(UIPopover, {
          open: this.state.open && !(this.props.readOnly || this.props.disabled),
          closeOnOutsideClick: true,
          content: {
            body: this.renderPopoverBody()
          },
          width: 450,
          className: "p-bottom-4",
          placement: "right",
          autoPlacement: "horiz",
          children: this.renderInlineEmails()
        })
      });
    }
  }]);

  return PropertyInputMultipleEmail;
}(PureComponent);

PropertyInputMultipleEmail.propTypes = propTypes;
PropertyInputMultipleEmail.defaultProps = defaultProps;
export default PropertyInputMultipleEmail;