import _objectWithoutProperties from "@babel/runtime/helpers/esm/objectWithoutProperties";
import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import _possibleConstructorReturn from "@babel/runtime/helpers/esm/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/esm/getPrototypeOf";
import _inherits from "@babel/runtime/helpers/esm/inherits";
import { jsx as _jsx } from "react/jsx-runtime";
import { PureComponent } from 'react';
import PropTypes from 'prop-types';
import emptyFunction from 'react-utils/emptyFunction';
import FormattedMessage from 'I18n/components/FormattedMessage';
import UIButton from 'UIComponents/button/UIButton';
import TourContext from '../contexts/TourContext';
import handleCallback from '../lib/handleCallback';
import { deactivateTour } from '../lib/deactivateTour';

var UITourCancelButton = /*#__PURE__*/function (_PureComponent) {
  _inherits(UITourCancelButton, _PureComponent);

  function UITourCancelButton() {
    _classCallCheck(this, UITourCancelButton);

    return _possibleConstructorReturn(this, _getPrototypeOf(UITourCancelButton).apply(this, arguments));
  }

  _createClass(UITourCancelButton, [{
    key: "render",
    value: function render() {
      var tour = this.context.tour;
      var getTour = tour.getTour,
          getStep = tour.getStep;

      var _this$props = this.props,
          beforeCancel = _this$props.beforeCancel,
          tourKey = _this$props.tourKey,
          onClick = _this$props.onClick,
          buttonProps = _objectWithoutProperties(_this$props, ["beforeCancel", "tourKey", "onClick"]);

      var handleClick = function handleClick() {
        handleCallback(beforeCancel, function () {
          if (typeof onClick === 'function') {
            onClick();
          }

          deactivateTour(tour, tourKey);
        }, {
          tourKey: tourKey || getTour(),
          stepKey: getStep()
        });
      };

      return /*#__PURE__*/_jsx(UIButton, Object.assign({
        use: "secondary"
      }, buttonProps, {
        onClick: handleClick
      }));
    }
  }]);

  return UITourCancelButton;
}(PureComponent);

UITourCancelButton.defaultProps = {
  beforeCancel: emptyFunction,
  children: /*#__PURE__*/_jsx(FormattedMessage, {
    message: "shepherd-react.cancel"
  })
};
UITourCancelButton.propTypes = {
  beforeCancel: PropTypes.func,
  children: PropTypes.node,
  onClick: PropTypes.func,
  tourKey: PropTypes.string
};
UITourCancelButton.contextType = TourContext;
export default UITourCancelButton;