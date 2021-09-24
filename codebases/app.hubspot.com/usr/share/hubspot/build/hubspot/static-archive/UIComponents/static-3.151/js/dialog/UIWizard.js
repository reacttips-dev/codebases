'use es6';

import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import _possibleConstructorReturn from "@babel/runtime/helpers/esm/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/esm/getPrototypeOf";
import _inherits from "@babel/runtime/helpers/esm/inherits";
import { jsxs as _jsxs } from "react/jsx-runtime";
import { jsx as _jsx } from "react/jsx-runtime";
import I18n from 'I18n';
import PropTypes from 'prop-types';
import { Children, PureComponent } from 'react';
import classNames from 'classnames';
import SyntheticEvent from '../core/SyntheticEvent';
import Controllable from '../decorators/Controllable';
import lazyEval from '../utils/lazyEval';
import createLazyPropType from '../utils/propTypes/createLazyPropType';
import * as CustomRenderer from '../utils/propTypes/customRenderer';
import passthroughProps from '../utils/propTypes/passthroughProps';
import UIWizardHeader from './UIWizardHeader';
import UIWizardFooter from './UIWizardFooter';
import UIButton from '../button/UIButton';
import UITooltip from '../tooltip/UITooltip';

var UIWizard = /*#__PURE__*/function (_PureComponent) {
  _inherits(UIWizard, _PureComponent);

  function UIWizard() {
    var _getPrototypeOf2;

    var _this;

    _classCallCheck(this, UIWizard);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _possibleConstructorReturn(this, (_getPrototypeOf2 = _getPrototypeOf(UIWizard)).call.apply(_getPrototypeOf2, [this].concat(args)));

    _this.scrollToTop = function () {
      if (_this._wrapper) {
        _this._wrapper.scrollTop = 0;
      }
    };

    _this.handleClickBack = function () {
      var stepIndex = _this.props.stepIndex;

      _this.props.onStepIndexChange(SyntheticEvent(stepIndex - 1));
    };

    _this.handleClickNext = function () {
      var stepIndex = _this.props.stepIndex;

      _this.props.onStepIndexChange(SyntheticEvent(stepIndex + 1));
    };

    return _this;
  }

  _createClass(UIWizard, [{
    key: "componentDidUpdate",
    value: function componentDidUpdate(prevProps) {
      // On step change, scroll to top if we have a non-sticky header
      if (prevProps.stepIndex !== this.props.stepIndex) {
        if (!this.props.stickyHeader) {
          this.scrollToTop();
        }
      }
    }
    /**
     * Resets the scroll position of the content area.
     *
     * @instance
     * @public
     */

  }, {
    key: "getStep",
    value: function getStep() {
      var _this$props = this.props,
          children = _this$props.children,
          stepIndex = _this$props.stepIndex;
      var steps = Children.toArray(children);
      return steps[stepIndex];
    }
  }, {
    key: "isFirstStep",
    value: function isFirstStep() {
      var stepIndex = this.props.stepIndex;
      var step = this.getStep();
      return !!(stepIndex === 0 || step.props.isFirstStep);
    }
  }, {
    key: "isLastStep",
    value: function isLastStep() {
      var _this$props2 = this.props,
          children = _this$props2.children,
          stepIndex = _this$props2.stepIndex;
      var steps = Children.toArray(children);
      var step = this.getStep();
      return !!(stepIndex === steps.length - 1 || step.props.isLastStep);
    }
  }, {
    key: "renderHeader",
    value: function renderHeader() {
      var headerComponent = this.props.headerComponent;

      if (headerComponent == null) {
        return null;
      }

      var step = this.getStep();
      var Header = headerComponent; // JSX needs a capitalized var name!

      return /*#__PURE__*/_jsx(Header, {
        stepProps: step.props,
        wizardProps: this.props
      });
    }
  }, {
    key: "renderBody",
    value: function renderBody() {
      return this.getStep();
    }
  }, {
    key: "renderFooter",
    value: function renderFooter() {
      var _this$props3 = this.props,
          defaultBackButton = _this$props3.defaultBackButton,
          defaultBackLabel = _this$props3.defaultBackLabel,
          defaultCancelButton = _this$props3.defaultCancelButton,
          defaultCancelLabel = _this$props3.defaultCancelLabel,
          defaultDoneButton = _this$props3.defaultDoneButton,
          defaultDoneLabel = _this$props3.defaultDoneLabel,
          defaultNextButton = _this$props3.defaultNextButton,
          defaultNextLabel = _this$props3.defaultNextLabel,
          footerComponent = _this$props3.footerComponent,
          onConfirm = _this$props3.onConfirm,
          onReject = _this$props3.onReject,
          stepIndex = _this$props3.stepIndex;
      var stepProps = this.getStep().props;
      var isFirstStep = this.isFirstStep();
      var isLastStep = this.isLastStep();
      var Footer = footerComponent; // JSX needs a capitalized var name!

      return /*#__PURE__*/_jsx(Footer, {
        backButton: stepProps.backButton || defaultBackButton,
        backLabel: stepProps.backLabel || lazyEval(defaultBackLabel),
        cancelButton: stepProps.cancelButton || defaultCancelButton,
        cancelLabel: stepProps.cancelLabel || lazyEval(defaultCancelLabel),
        doneButton: stepProps.doneButton || defaultDoneButton,
        doneLabel: stepProps.doneLabel || lazyEval(defaultDoneLabel),
        hidePrimaryControls: stepProps.hidePrimaryControls,
        hideSecondaryControls: stepProps.hideSecondaryControls,
        isFirstStep: isFirstStep,
        isLastStep: isLastStep,
        nextButton: stepProps.nextButton || defaultNextButton,
        nextLabel: stepProps.nextLabel || lazyEval(defaultNextLabel),
        onClickBack: this.handleClickBack,
        onClickCancel: onReject,
        onClickDone: onConfirm,
        onClickNext: this.handleClickNext,
        stepIndex: stepIndex,
        stepProps: stepProps,
        wizardProps: this.props
      });
    }
  }, {
    key: "render",
    value: function render() {
      var _this2 = this;

      var _this$props4 = this.props,
          stickyHeader = _this$props4.stickyHeader,
          dataTestId = _this$props4['data-test-id'];
      var className = classNames("uiWizard private-wizard private-modal__content-wrapper", this.props.className);

      if (stickyHeader) {
        return /*#__PURE__*/_jsxs("div", {
          className: className,
          "data-test-id": dataTestId,
          children: [this.renderHeader(), this.renderBody(), this.renderFooter()]
        });
      }

      return /*#__PURE__*/_jsxs("div", {
        className: className,
        "data-test-id": dataTestId,
        children: [/*#__PURE__*/_jsxs("div", {
          className: "private-wizard__content-wrapper",
          ref: function ref(_ref) {
            _this2._wrapper = _ref;
          },
          children: [this.renderHeader(), this.renderBody()]
        }), this.renderFooter()]
      });
    }
  }]);

  return UIWizard;
}(PureComponent);
/* eslint-disable react/no-unused-prop-types */


UIWizard.propTypes = {
  backable: PropTypes.bool.isRequired,
  cancellable: PropTypes.bool.isRequired,
  children: PropTypes.node.isRequired,
  defaultBackButton: CustomRenderer.propType,
  defaultBackLabel: createLazyPropType(PropTypes.node).isRequired,
  defaultCancelButton: CustomRenderer.propType,
  defaultCancelLabel: createLazyPropType(PropTypes.node).isRequired,
  defaultDoneButton: CustomRenderer.propType,
  defaultDoneLabel: createLazyPropType(PropTypes.node).isRequired,
  defaultHeading: PropTypes.node,
  defaultNextButton: CustomRenderer.propType,
  defaultNextLabel: createLazyPropType(PropTypes.node).isRequired,
  disablePrimaryButton: PropTypes.bool.isRequired,
  footerComponent: PropTypes.elementType.isRequired,
  headerComponent: PropTypes.elementType,
  onConfirm: PropTypes.func.isRequired,
  onReject: PropTypes.func.isRequired,
  onStepIndexChange: PropTypes.func,
  primaryButtonTooltip: PropTypes.node,
  primaryButtonTooltipProps: passthroughProps(UITooltip),
  stepIndex: PropTypes.number,
  stickyHeader: PropTypes.bool
};
/* eslint-enable react/no-unused-prop-types */

UIWizard.defaultProps = {
  backable: true,
  cancellable: false,
  defaultBackButton: UIButton,
  defaultBackLabel: function defaultBackLabel() {
    return I18n.text('salesUI.UIWizard.back');
  },
  defaultCancelButton: UIButton,
  defaultCancelLabel: function defaultCancelLabel() {
    return I18n.text('salesUI.UIWizard.cancel');
  },
  defaultDoneButton: UIButton,
  defaultDoneLabel: function defaultDoneLabel() {
    return I18n.text('salesUI.UIWizard.done');
  },
  defaultNextButton: UIButton,
  defaultNextLabel: function defaultNextLabel() {
    return I18n.text('salesUI.UIWizard.next');
  },
  disablePrimaryButton: false,
  footerComponent: UIWizardFooter,
  headerComponent: UIWizardHeader,
  stepIndex: 0,
  stickyHeader: true
};
UIWizard.displayName = 'UIWizard';
export default Controllable(UIWizard, ['stepIndex']);