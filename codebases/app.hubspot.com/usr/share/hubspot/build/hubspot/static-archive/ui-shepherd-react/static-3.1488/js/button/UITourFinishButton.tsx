import _objectWithoutProperties from "@babel/runtime/helpers/esm/objectWithoutProperties";
import { jsx as _jsx } from "react/jsx-runtime";
import { useContext } from 'react';
import PropTypes from 'prop-types';
import FormattedMessage from 'I18n/components/FormattedMessage';
import emptyFunction from 'react-utils/emptyFunction';
import UIButton from 'UIComponents/button/UIButton';
import handleCallback from '../lib/handleCallback';
import TourContext from '../contexts/TourContext';

var UITourFinishButton = function UITourFinishButton(props) {
  var _useContext = useContext(TourContext),
      tour = _useContext.tour;

  var beforeFinish = props.beforeFinish,
      _props$children = props.children,
      children = _props$children === void 0 ? /*#__PURE__*/_jsx(FormattedMessage, {
    message: "shepherd-react.finish"
  }) : _props$children,
      buttonProps = _objectWithoutProperties(props, ["beforeFinish", "children"]);

  var finish = tour.finish,
      getTour = tour.getTour,
      getStep = tour.getStep;

  var handleClick = function handleClick() {
    return handleCallback(beforeFinish, finish, {
      tourKey: getTour(),
      stepKey: getStep()
    });
  };

  return /*#__PURE__*/_jsx(UIButton, Object.assign({}, buttonProps, {
    onClick: handleClick,
    children: children
  }));
};

UITourFinishButton.propTypes = {
  beforeFinish: PropTypes.func.isRequired,
  children: PropTypes.node
};
UITourFinishButton.defaultProps = {
  beforeFinish: emptyFunction
};
export default UITourFinishButton;