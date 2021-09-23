'use es6';

import _objectWithoutProperties from "@babel/runtime/helpers/esm/objectWithoutProperties";
import { jsxs as _jsxs } from "react/jsx-runtime";
import { jsx as _jsx } from "react/jsx-runtime";
import classNames from 'classnames';
import createReactClass from 'create-react-class';
import { LABEL_DEFAULT_PADDING_BOTTOM, LABEL_DEFAULT_PADDING_TOP } from 'HubStyleTokens/sizes';
import PropTypes from 'prop-types';
import { createRef, Children, cloneElement } from 'react';
import devLogger from 'react-utils/devLogger';
import getComponentName from 'react-utils/getComponentName';
import styled from 'styled-components';
import { FieldsetContextConsumer } from '../context/FieldsetContext';
import { Small } from '../elements';
import UIHelpIcon from '../icon/UIHelpIcon';
import UICheckbox from '../input/UICheckbox';
import HoverProvider from '../providers/HoverProvider';
import { PLACEMENTS } from '../tooltip/PlacementConstants';
import UITooltip from '../tooltip/UITooltip';
import { hidden } from '../utils/propTypes/decorators';
import { getComponentPropType } from '../utils/propTypes/componentProp';
import deprecated from '../utils/propTypes/deprecated';
import { uniqueId } from '../utils/underscore';
import { warnIfFragment } from '../utils/devWarnings';
import { getCoreComponent } from '../decorators/utils';
import UIFormLabel from './UIFormLabel';
import validateUIFormControlValidationMessage from './utils/validateUIFormControlValidationMessage';
var InlineFormLabel = styled(UIFormLabel).withConfig({
  displayName: "UIFormControl__InlineFormLabel",
  componentId: "hr4q23-0"
})(["&&{display:inline;}"]);
var LabelWrapper = styled.div.withConfig({
  displayName: "UIFormControl__LabelWrapper",
  componentId: "hr4q23-1"
})(["&&{padding-bottom:", ";padding-top:", ";}"], function (_ref) {
  var hasLabel = _ref.hasLabel,
      hasHelp = _ref.hasHelp;
  return (hasLabel || hasHelp) && LABEL_DEFAULT_PADDING_BOTTOM;
}, function (_ref2) {
  var hasLabel = _ref2.hasLabel,
      hasHelp = _ref2.hasHelp;
  return hasHelp && !hasLabel && LABEL_DEFAULT_PADDING_TOP;
});

var getClassName = function getClassName(className, error, label, verticalSeparation) {
  return classNames('private-form__set', className, !!error && 'private-form__set--error', !label && 'private-form__set--no-label', {
    'flush': 'private-form__set--flush',
    'separated': 'private-form__set--separated'
  }[verticalSeparation]);
};

var getClosestDescendantId = function getClosestDescendantId(child) {
  var element = child;
  var id = element.props.id;

  while (id == null) {
    try {
      element = Children.only(element.props.children);
    } catch (e) {
      break;
    }

    id = element.props.id;
  }

  return id;
};

var getDerivedId = function getDerivedId(inputProps, id) {
  var IDs = Object.keys(inputProps).filter(function (prop) {
    return inputProps[prop];
  }).map(function (prop) {
    if (!inputProps[prop]) return '';
    return id + "-" + prop;
  });
  if (IDs.length > 0) return IDs.join(' ');
  return undefined;
};

var getHtmlFor = function getHtmlFor(propValue, children) {
  var firstChild = Children.only(children);

  if (propValue) {
    return propValue;
  }

  if (firstChild) {
    return getClosestDescendantId(firstChild) || name;
  }

  return null;
};

var renderInput = function renderInput(ariaLabel, ariaLabelledBy, children, description, error, help, required, validationMessage, disabledFieldset, fallbackId) {
  var child = Children.only(children);
  warnIfFragment(child, 'UIFormControl');
  var origRequired = child.props.required; // if the child input doesn't declare `required`, pass it down

  var newRequired = required === true ? true : origRequired;
  var newError = error === true ? 'true' : undefined;
  var cloneProps = {
    'aria-label': ariaLabel,
    'aria-labelledby': ariaLabelledBy,
    required: newRequired,
    'aria-invalid': newError,
    'aria-required': newRequired
  }; // only add id prop if it doesn't have it already

  var descendantId = getClosestDescendantId(child);

  if (!descendantId) {
    cloneProps.id = fallbackId;
  } // only add error prop if there is an error, to avoid potential "Unknown prop" warnings


  if (error) {
    cloneProps.error = !!error;
  } // disable the input if we're within a disabled fieldset (#3356)


  if (disabledFieldset) {
    cloneProps.disabled = true;
  } // aggregate IDs to pass into aria-describedby


  var newDescribedBy = getDerivedId({
    validationMessage: validationMessage,
    help: help,
    description: description
  }, cloneProps.id); // derive ID and spread back into cloneProps

  var describedCloneProps = {
    'aria-describedby': newDescribedBy
  };
  var mergedCloneProps = Object.assign({}, cloneProps, {}, describedCloneProps);
  return /*#__PURE__*/cloneElement(child, mergedCloneProps);
};

var warnOnBrokenChildPropInjection = function warnOnBrokenChildPropInjection(child, htmlFor) {
  // Source: https://html.spec.whatwg.org/multipage/forms.html#category-label
  var validFormElementTypes = ['INPUT', 'TEXTAREA', 'SELECT', 'PROGRESS', 'METER', 'OUTPUT'];
  var componentName = Children.only(child) && getComponentName(getCoreComponent(Children.only(child).type));

  if (
  /*
      These components have existing issues, but we don't want to add noise to downstream devs:
        - `UISelect` can render a `<button>`, but we don't want to allow `<button>` since that can cause issues
          See: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/label#buttons
        - `UIToggleGroup` routes the labelId to the inputs, but has the `for` on a `<div>`.
        - `UICopyInput` doesn't pass remainder of unspecified props to `UITextInput`.
    */
  !['UISelect', 'UIToggleGroup', 'UICopyInput'].includes(componentName)) {
    var renderedChild = document.getElementById(htmlFor);

    if (renderedChild && !validFormElementTypes.includes(renderedChild.nodeName)) {
      devLogger.warn({
        message: 'UIFormControl: For accessibility props to work correctly, the direct descendant should be a valid form element.',
        key: 'UIFormControl: validchild',
        url: 'https://tools.hubteamqa.com/ui-library/show/UIComponents/form/UIFormControl#uiformcontrol/prop-passing-to-child'
      });
    }
  }
};

var renderLabel = function renderLabel(children, label, labelClassName, error, htmlFor, labelId, required, tooltip, tooltipPlacement, tooltipProps, renderedInput, handleLabelClick, disabledFieldset, FormLabel, labelTargetRef) {
  if (!label) return null;
  var _Children$only$props = Children.only(children).props,
      childDisabled = _Children$only$props.disabled,
      childReadOnly = _Children$only$props.readOnly;
  var computedHtmlFor = getHtmlFor(htmlFor, renderedInput);

  if (process.env.NODE_ENV !== 'production') {
    warnOnBrokenChildPropInjection(renderedInput, computedHtmlFor);
  }

  var renderedLabel = /*#__PURE__*/_jsx(FormLabel, {
    className: classNames(labelClassName, !!tooltip && 'private-form__label--with-tooltip'),
    error: !!error,
    htmlFor: computedHtmlFor,
    id: labelId,
    onClick: handleLabelClick,
    readOnly: childDisabled || childReadOnly || disabledFieldset,
    required: required,
    children: /*#__PURE__*/_jsx("span", {
      ref: labelTargetRef,
      children: label
    })
  });

  return tooltip ? /*#__PURE__*/_jsx(UIHelpIcon, {
    className: "private-form__help-tooltip",
    title: tooltip,
    tooltipPlacement: tooltipPlacement,
    tooltipProps: tooltipProps,
    children: renderedLabel
  }) : renderedLabel;
};

var renderHelp = function renderHelp(help, helpClassName, renderedInputId) {
  if (!help) return null;
  return /*#__PURE__*/_jsx(Small, {
    className: classNames('private-form__inlinehelp', helpClassName),
    id: getDerivedId({
      help: help
    }, renderedInputId),
    tabIndex: -1,
    use: "help",
    children: help
  });
};

var renderValidation = function renderValidation(error, validationMessage, inputId) {
  var validationClass = 'private-form__validation';

  if (validationMessage) {
    validateUIFormControlValidationMessage({
      error: error,
      validationMessage: validationMessage
    });
    return /*#__PURE__*/_jsx(Small, {
      className: validationClass,
      id: getDerivedId({
        validationMessage: validationMessage
      }, inputId),
      tabIndex: -1,
      use: error ? 'error' : 'success',
      children: validationMessage
    });
  }

  return null;
};

var renderCounter = function renderCounter(characterCount) {
  return characterCount == null ? null : /*#__PURE__*/_jsx(Small, {
    className: "private-form__counter",
    children: characterCount
  });
};

var renderDescription = function renderDescription(description, inputId) {
  if (!description) return null;
  devLogger.warn({
    message: "UIFormControl: the `description` prop has been deprecated. Please use the `help` prop instead.",
    key: "UIFormControl: description prop"
  });
  return /*#__PURE__*/_jsx(Small, {
    className: "private-form__description",
    id: getDerivedId({
      description: description
    }, inputId),
    tabIndex: -1,
    use: "help",
    children: description
  });
};
/**
 * Group a form field, label, notes, and errors/alerts together
 **/


var UIFormControl = createReactClass({
  displayName: 'UIFormControl',
  propTypes: {
    /**
     * Instructional text that is not visible to accompany the field label for screen readers
     **/
    'aria-label': PropTypes.string,

    /** List of IDs that label this input. Their contents will be read alongside the aria-label by screen readers. */
    'aria-labelledby': PropTypes.string,

    /**
     * When wrapped in a UICharacterCounter, provides the character count metadata beneath the input
     */
    characterCount: PropTypes.node,

    /**
     * Sets the content that will render within the component, usually a form input. Label will be associated with the input using the input's `id` or a random unique ID if none is provided.
     **/
    children: PropTypes.node.isRequired,

    /**
     * This prop is deprecated. Use `help` instead to add help text to the component.
     **/
    description: deprecated(PropTypes.oneOfType([PropTypes.node, PropTypes.bool])),

    /**
     * Sets if an error state is shown on the component's children. `true` indicates this field is in an error state.
     **/
    error: PropTypes.bool,

    /**
     * Sets the component used to render the label text. Typically should be a `UIFormLabel`.
     */
    FormLabel: getComponentPropType(UIFormLabel),

    /**
     * Message to be displayed at the bottom of the input
     *
     * By default the text is green
     * If `error` is set to `true` then the text is red
     **/
    validationMessage: PropTypes.node,

    /**
     * Instructional text to display with the field label
     **/
    help: PropTypes.node,

    /**
     * Class name for the `<span>` wrapper around the rendered `help` node
     **/
    helpClassName: PropTypes.string,

    /**
     * Set to the `id` attribute of the input field you want the label to be associated with. By default, the `<label />` will be associated with the embedded form field using the `for` attribute. Use this prop if you need to override that behavior.
     **/
    htmlFor: PropTypes.string,

    /**
     * Renders a clickable `UIFormLabel` alongside input with this text as content
     **/
    label: PropTypes.node,

    /**
     * Class name for the rendered `UIFormLabel` component
     **/
    labelClassName: PropTypes.string,

    /**
     * Renders a `UITooltip` around the rendered `UIFormLabel` component. Differs from the `tooltip` prop, which displays a `UITooltip` only on the "?" icon. Typically used to clarify to users why the input is disabled or read only.
     **/
    labelTooltip: PropTypes.node,

    /**
     * `true` indicates the field is required and will be styled accordingly
     **/
    required: PropTypes.bool.isRequired,

    /**
     * Provides instructional text in a `UITooltip` which is displayed by hovering on the "?" icon
     **/
    tooltip: PropTypes.node,

    /**
     * Placement of the tooltip that appears on the "?" icon
     **/
    tooltipPlacement: PropTypes.oneOf(PLACEMENTS).isRequired,

    /**
     * Props passed through to the `UITooltip` that displays on the "?" icon
     **/
    tooltipProps: UIHelpIcon.propTypes.tooltipProps,

    /**
     * @private
     * Used internally to help determine open state of `labelTooltip`
     **/
    hovered: hidden(PropTypes.bool),

    /**
     * Allows adjustment of automatic vertical spacing between children
     **/
    verticalSeparation: PropTypes.oneOf(['flush', 'separated'])
  },
  getDefaultProps: function getDefaultProps() {
    return {
      error: false,
      FormLabel: InlineFormLabel,
      required: false,
      tooltipPlacement: 'top'
    };
  },
  getInitialState: function getInitialState() {
    return {
      labelTarget: null
    };
  },
  UNSAFE_componentWillMount: function UNSAFE_componentWillMount() {
    this._fallbackId = "UIFormControl-" + uniqueId();
    this._labelId = "UIFormControl-label-" + uniqueId();
    this.labelTargetRef = /*#__PURE__*/createRef();
  },
  componentDidMount: function componentDidMount() {
    var hovered = this.props.hovered; // Edge case: If we're hovered on mount, the label tooltip rendered with no `target`.

    if (hovered) this.forceUpdate();
  },
  handleLabelClick: function handleLabelClick(evt) {
    var labeledElement = document.getElementById(evt.target.htmlFor);
    var labelableTagNames = ['BUTTON', 'INPUT', 'SELECT', 'TEXTAREA'];

    if (labeledElement && labelableTagNames.indexOf(labeledElement.tagName) === -1) {
      labeledElement.click();
    }
  },
  render: function render() {
    var _this = this;

    var _this$props = this.props,
        ariaLabel = _this$props['aria-label'],
        ariaLabelledBy = _this$props['aria-labelledby'],
        characterCount = _this$props.characterCount,
        _children = _this$props.children,
        className = _this$props.className,
        description = _this$props.description,
        error = _this$props.error,
        FormLabel = _this$props.FormLabel,
        validationMessage = _this$props.validationMessage,
        help = _this$props.help,
        helpClassName = _this$props.helpClassName,
        __hovered = _this$props.hovered,
        htmlFor = _this$props.htmlFor,
        label = _this$props.label,
        labelClassName = _this$props.labelClassName,
        labelTooltip = _this$props.labelTooltip,
        required = _this$props.required,
        tooltip = _this$props.tooltip,
        tooltipPlacement = _this$props.tooltipPlacement,
        tooltipProps = _this$props.tooltipProps,
        verticalSeparation = _this$props.verticalSeparation,
        rest = _objectWithoutProperties(_this$props, ["aria-label", "aria-labelledby", "characterCount", "children", "className", "description", "error", "FormLabel", "validationMessage", "help", "helpClassName", "hovered", "htmlFor", "label", "labelClassName", "labelTooltip", "required", "tooltip", "tooltipPlacement", "tooltipProps", "verticalSeparation"]);

    if (!label && !ariaLabel && !ariaLabelledBy && Children.only(_children).type !== UICheckbox) {
      devLogger.warn({
        message: "UIFormControl: For better accessibility, if you're going to omit `label`, please include an `aria-label` or `aria-labelledby` property.",
        key: 'UIFormControl: label'
      });
    }

    return /*#__PURE__*/_jsx(HoverProvider, Object.assign({}, this.props, {
      children: function children(hoverProviderProps) {
        return /*#__PURE__*/_jsx(FieldsetContextConsumer, {
          children: function children(fieldsetContext) {
            var hovered = hoverProviderProps.hovered,
                hoverProviderRestProps = _objectWithoutProperties(hoverProviderProps, ["hovered"]);

            var classes = getClassName(className, error, label, verticalSeparation);
            var renderedInput = renderInput(ariaLabel, ariaLabelledBy || _this._labelId, _children, description, error, help, required, validationMessage, fieldsetContext.disabled, _this._fallbackId);
            var inputId = renderedInput && renderedInput.props && renderedInput.props.id;
            return /*#__PURE__*/_jsx("div", Object.assign({
              className: classes
            }, rest, {}, hoverProviderRestProps, {
              children: /*#__PURE__*/_jsxs("div", {
                className: "private-form__control-wrapper",
                children: [(label != null || help != null) && /*#__PURE__*/_jsxs(LabelWrapper, {
                  className: "private-form__label-wrapper",
                  hasLabel: label != null,
                  hasHelp: help != null,
                  children: [renderLabel(_children, label, labelClassName, error, htmlFor, _this._labelId, required, tooltip, tooltipPlacement, tooltipProps, renderedInput, _this.handleLabelClick, fieldsetContext.disabled, FormLabel, _this.labelTargetRef), renderHelp(help, helpClassName, inputId)]
                }), /*#__PURE__*/_jsx("div", {
                  className: "private-form__input-wrapper",
                  children: /*#__PURE__*/_jsx(UITooltip, {
                    title: labelTooltip,
                    open: hovered || undefined,
                    placement: "top right",
                    autoPlacement: false,
                    target: _this.labelTargetRef.current,
                    children: renderedInput
                  })
                }), /*#__PURE__*/_jsxs("div", {
                  className: "private-form__meta",
                  children: [/*#__PURE__*/_jsx("div", {
                    className: "private-form__messages",
                    children: renderValidation(error, validationMessage, inputId)
                  }), renderCounter(characterCount)]
                }), renderDescription(description, inputId)]
              })
            }));
          }
        });
      }
    }));
  }
});
export default UIFormControl;