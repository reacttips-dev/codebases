import _objectWithoutProperties from "@babel/runtime/helpers/esm/objectWithoutProperties";
import { jsx as _jsx } from "react/jsx-runtime";
import { useContext } from 'react';
import PropTypes from 'prop-types';
import FormattedJSXMessage from 'I18n/components/FormattedJSXMessage';
import emptyFunction from 'react-utils/emptyFunction';
import UIButton from 'UIComponents/button/UIButton';
import UIIcon from 'UIComponents/icon/UIIcon';
import TourContext from '../contexts/TourContext';
import handleCallback from '../lib/handleCallback';

var UITourBackButton = function UITourBackButton(props) {
  var _useContext = useContext(TourContext),
      tour = _useContext.tour;

  var beforeBack = props.beforeBack,
      _props$children = props.children,
      children = _props$children === void 0 ? /*#__PURE__*/_jsx(FormattedJSXMessage, {
    elements: {
      UIIcon: UIIcon
    },
    options: {
      name: 'left'
    },
    message: "shepherd-react.back_jsx"
  }) : _props$children,
      buttonProps = _objectWithoutProperties(props, ["beforeBack", "children"]);

  if (!tour.canGoBack()) {
    return /*#__PURE__*/_jsx("div", {});
  }

  var back = tour.back,
      getTour = tour.getTour,
      getStep = tour.getStep;

  var handleClick = function handleClick() {
    var _props$tourKey = props.tourKey,
        tourKey = _props$tourKey === void 0 ? getTour() : _props$tourKey,
        _props$stepKey = props.stepKey,
        stepKey = _props$stepKey === void 0 ? getStep() : _props$stepKey;
    handleCallback(beforeBack, back, {
      tourKey: tourKey,
      stepKey: stepKey
    });
  };

  return /*#__PURE__*/_jsx(UIButton, Object.assign({}, buttonProps, {
    onClick: handleClick,
    children: children
  }));
};

UITourBackButton.propTypes = {
  beforeBack: PropTypes.func.isRequired,
  tourKey: PropTypes.string,
  stepKey: PropTypes.string,
  children: PropTypes.node
};
UITourBackButton.defaultProps = {
  beforeBack: emptyFunction
};
export default UITourBackButton;