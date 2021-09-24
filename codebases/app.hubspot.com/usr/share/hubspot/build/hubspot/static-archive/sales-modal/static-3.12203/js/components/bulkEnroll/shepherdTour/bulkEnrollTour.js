'use es6';

import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import _possibleConstructorReturn from "@babel/runtime/helpers/esm/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/esm/getPrototypeOf";
import _assertThisInitialized from "@babel/runtime/helpers/esm/assertThisInitialized";
import _inherits from "@babel/runtime/helpers/esm/inherits";
import { jsx as _jsx } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import { Component } from 'react';
import * as UsersApi from 'sales-modal/api/UserApi';
import { getBulkEnrollShepherdTourCompletedKey } from 'sales-modal/constants/UserAttributeKeys';
import connectBulkEnrollTour from './connectBulkEnrollTour';
import TourContext from 'ui-shepherd-react/contexts/TourContext';
import * as localSettings from 'sales-modal/lib/localSettings';
import { BULK_ENROLL_SHEPHERD_DISMISSED } from 'sales-modal/constants/LocalStorageKeys';
export default (function (Container) {
  var ContainerWithBulkEnrollTour = /*#__PURE__*/function (_Component) {
    _inherits(ContainerWithBulkEnrollTour, _Component);

    function ContainerWithBulkEnrollTour(props, context) {
      var _this;

      _classCallCheck(this, ContainerWithBulkEnrollTour);

      _this = _possibleConstructorReturn(this, _getPrototypeOf(ContainerWithBulkEnrollTour).call(this, props, context));
      _this.finishTour = _this.finishTour.bind(_assertThisInitialized(_this));
      _this.setTourAsCompleted = _this.setTourAsCompleted.bind(_assertThisInitialized(_this));
      return _this;
    }

    _createClass(ContainerWithBulkEnrollTour, [{
      key: "getChildContext",
      value: function getChildContext() {
        return {
          bulkEnrollTour: {
            finishTour: this.finishTour,
            setTourAsCompleted: this.setTourAsCompleted
          }
        };
      }
    }, {
      key: "componentDidMount",
      value: function componentDidMount() {
        var _this2 = this;

        UsersApi.getUserAttributes(getBulkEnrollShepherdTourCompletedKey()).then(function (attributes) {
          var hasCompletedTour = attributes.get(getBulkEnrollShepherdTourCompletedKey()) && attributes.get(getBulkEnrollShepherdTourCompletedKey()) !== 'false';

          if (hasCompletedTour) {
            return;
          } // This shepherd used to use local storage so we need to check that or existing
          // users will see the shepherd tour again. Since local storage isn't permanent
          // we should then save this in user attributes.


          if (localSettings.get(BULK_ENROLL_SHEPHERD_DISMISSED)) {
            UsersApi.setUserAttribute({
              key: getBulkEnrollShepherdTourCompletedKey(),
              value: true
            });
            return;
          }

          _this2.context.tour.start('bulk-enroll-tour');
        });
      }
    }, {
      key: "finishTour",
      value: function finishTour() {
        this.context.tour.finish();
        this.context.tour.deactivate();
        this.setTourAsCompleted();
      }
    }, {
      key: "setTourAsCompleted",
      value: function setTourAsCompleted() {
        UsersApi.setUserAttribute({
          key: getBulkEnrollShepherdTourCompletedKey(),
          value: true
        });
      }
    }, {
      key: "render",
      value: function render() {
        return /*#__PURE__*/_jsx(Container, Object.assign({}, this.props));
      }
    }]);

    return ContainerWithBulkEnrollTour;
  }(Component);

  ContainerWithBulkEnrollTour.contextType = TourContext;
  ContainerWithBulkEnrollTour.childContextTypes = {
    bulkEnrollTour: PropTypes.object
  };
  return connectBulkEnrollTour(ContainerWithBulkEnrollTour);
});