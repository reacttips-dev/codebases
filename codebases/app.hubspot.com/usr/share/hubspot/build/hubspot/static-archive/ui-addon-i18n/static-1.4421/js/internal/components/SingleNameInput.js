'use es6';

import _objectWithoutProperties from "@babel/runtime/helpers/esm/objectWithoutProperties";
import PropTypes from 'prop-types';
import createReactClass from 'create-react-class';
import * as CustomRenderer from 'UIComponents/utils/propTypes/customRenderer';
import createLazyPropType from 'UIComponents/utils/propTypes/createLazyPropType';
import lazyEval from 'UIComponents/utils/lazyEval';
import classNames from 'classnames';
export default createReactClass({
  displayName: "SingleNameInput",
  propTypes: {
    input: CustomRenderer.propType.isRequired,
    label: createLazyPropType(PropTypes.node).isRequired
  },
  render: function render() {
    var _this$props = this.props,
        className = _this$props.className,
        input = _this$props.input,
        label = _this$props.label,
        passThroughProps = _objectWithoutProperties(_this$props, ["className", "input", "label"]);

    var inputClass = input.props && input.props.className;
    return CustomRenderer.render(input, Object.assign({
      label: lazyEval(label)
    }, passThroughProps, {}, input.props, {
      className: classNames(inputClass, className)
    }), {
      mergeType: 'aggressive'
    });
  }
});