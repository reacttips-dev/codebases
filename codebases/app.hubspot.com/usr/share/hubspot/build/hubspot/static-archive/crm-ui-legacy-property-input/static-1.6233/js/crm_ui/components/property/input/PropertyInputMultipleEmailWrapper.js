'use es6';

import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import _possibleConstructorReturn from "@babel/runtime/helpers/esm/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/esm/getPrototypeOf";
import _assertThisInitialized from "@babel/runtime/helpers/esm/assertThisInitialized";
import _inherits from "@babel/runtime/helpers/esm/inherits";
import { jsx as _jsx } from "react/jsx-runtime";
import I18n from 'I18n';
import PropTypes from 'prop-types';
import { addSecondaryEmail, deleteSecondaryEmail, promoteEmailToPrimary, updateContactProperties, updateSecondaryEmail } from 'crm_data/contacts/ContactsActions';
import PureComponent from 'customer-data-ui-utilities/component/PureComponent';
import partial from 'transmute/partial';
import memoize from 'transmute/memoize';
import { addDanger, addSuccess } from 'customer-data-ui-utilities/alerts/Alerts';
import PropertyInputMultipleEmail from 'customer-data-properties/input/PropertyInputMultipleEmail';
import { CrmLogger } from 'customer-data-tracking/loggers';
import { handleContactExistsError } from '../../../contacts/ContactsActionsErrorHandlers';
import SubjectType from 'customer-data-objects-ui-components/propTypes/SubjectType';
import ImmutablePropTypes from 'react-immutable-proptypes';
import ReferenceResolverType from 'reference-resolvers/schema/ReferenceResolverType';
var propTypes = {
  logEvent: PropTypes.func,
  readOnly: PropTypes.bool,
  resolver: PropTypes.oneOfType([ImmutablePropTypes.mapContains({
    contacts: ReferenceResolverType.isRequired,
    contactsEmail: ReferenceResolverType.isRequired
  }), ReferenceResolverType]),
  subject: SubjectType,
  subjectId: PropTypes.string,
  value: PropTypes.string
};
var ACTIONS = {
  addSecondaryEmail: addSecondaryEmail,
  deleteSecondaryEmail: deleteSecondaryEmail,
  promoteEmailToPrimary: promoteEmailToPrimary,
  updateContactProperties: updateContactProperties,
  updateSecondaryEmail: updateSecondaryEmail
};

function isGDPRError(error) {
  return error.responseJSON && error.responseJSON.message && error.responseJSON.message.indexOf('GdprBlacklistedEmailException') > -1;
}

var PropertyInputMultipleEmailWrapper = /*#__PURE__*/function (_PureComponent) {
  _inherits(PropertyInputMultipleEmailWrapper, _PureComponent);

  function PropertyInputMultipleEmailWrapper(props) {
    var _this;

    _classCallCheck(this, PropertyInputMultipleEmailWrapper);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(PropertyInputMultipleEmailWrapper).call(this, props)); // In new code, please use ES6 spread args rather than partials
    // for easier debugging and readability:
    // (...args) => myFunction('partiallyAppliedParam', ...args)

    _this.handleOnPrimaryPromotedError = function () {
      addDanger('propertyInputMultipleEmail.errorSaving');
    };

    _this.handleOnPrimaryPromoted = function (email) {
      addSuccess('propertyInputMultipleEmail.successSaving.description', {
        email: email
      }, {
        titleText: I18n.text('propertyInputMultipleEmail.successSaving.title')
      });
    };

    _this.handleOnPrimaryUpdatedError = function (property, error) {
      if (isGDPRError(error)) {
        addDanger('propertyInputMultipleEmail.errorGDPR', {
          email: property.get('email')
        });
        return;
      }

      handleContactExistsError(property, error);
    };

    _this.handleOnSecondaryAdded = function () {
      _this.logSecondaryEmailChange('add new secondary in multiple emails');
    };

    _this.handleOnSecondaryDeleted = function () {
      _this.logSecondaryEmailChange('delete secondary in multiple emails');
    };

    _this.handleOnSecondaryDeletedError = function () {
      addDanger('propertyInputMultipleEmail.errorSaving');
    };

    _this.handleOnSecondaryUpdated = function () {
      _this.logSecondaryEmailChange('update secondary in multiple emails');
    };

    _this.handleOnSecondaryUpdatedError = function () {
      addDanger('propertyInputMultipleEmail.errorSaving');
    };

    _this.partial = memoize(partial);
    _this.focus = _this.focus.bind(_assertThisInitialized(_this));
    return _this;
  }

  _createClass(PropertyInputMultipleEmailWrapper, [{
    key: "logPrimaryEmailChange",
    value: function logPrimaryEmailChange() {
      CrmLogger.log('savedProperties', {
        action: 'changes primary email in multiple email property input',
        property: 'email'
      });
    }
  }, {
    key: "logSecondaryEmailChange",
    value: function logSecondaryEmailChange(action) {
      CrmLogger.log('savedProperties', {
        action: action,
        property: 'email'
      });
    }
  }, {
    key: "focus",
    value: function focus() {
      return typeof this.refs.input.focus === 'function' ? this.refs.input.focus() : undefined;
    }
  }, {
    key: "render",
    value: function render() {
      return /*#__PURE__*/_jsx(PropertyInputMultipleEmail, Object.assign({}, this.props, {
        actions: ACTIONS,
        onPrimaryPromoted: this.handleOnPrimaryPromoted,
        onPrimaryPromotedError: this.handleOnPrimaryPromotedError,
        onPrimaryUpdated: this.logPrimaryEmailChange,
        onPrimaryUpdatedError: this.handleOnPrimaryUpdatedError,
        onSecondaryAdded: this.handleOnSecondaryAdded,
        onSecondaryDeleted: this.handleOnSecondaryDeleted,
        onSecondaryDeletedError: this.handleOnSecondaryDeletedError,
        onSecondaryUpdated: this.handleOnSecondaryUpdated,
        onSecondaryUpdatedError: this.handleOnSecondaryUpdatedError,
        onTracking: this.logPrimaryEmailChange,
        ref: "input"
      }));
    }
  }]);

  return PropertyInputMultipleEmailWrapper;
}(PureComponent);

PropertyInputMultipleEmailWrapper.propTypes = propTypes;
export default PropertyInputMultipleEmailWrapper;