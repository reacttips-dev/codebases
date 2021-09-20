/**
 * @author Félix Girault <felix.girault@gmail.com>
 * @license MIT
 */
'use strict';

var warning = require('fbjs/lib/warning');
var shallowEqual = require('fbjs/lib/shallowEqual');



/**
 * Tells if a component should update given it's next props
 * and state.
 *
 * @param object nextProps Next props.
 * @param object nextState Next state.
 */
function shouldComponentUpdate(nextProps, nextState) {
  return !shallowEqual(this.props, nextProps) || !shallowEqual(this.state, nextState);
}

/**
 * Returns a text description of the component that can be
 * used to identify it in error messages.
 *
 * @see https://github.com/facebook/react/blob/v15.4.0-rc.3/src/renderers/shared/stack/reconciler/ReactCompositeComponent.js#L1143
 * @param {function} component The component.
 * @return {string} The name of the component.
 */
function getComponentName(component) {
  var constructor = component.prototype && component.prototype.constructor;

  return (
    component.displayName
    || (constructor && constructor.displayName)
    || component.name
    || (constructor && constructor.name)
    || 'a component'
  );
}

/**
 * Makes the given component "pure".
 *
 * @param object component Component.
 */
function pureRenderDecorator(component) {
  if (component.prototype.shouldComponentUpdate !== undefined) {
    // We're not using the condition mecanism of warning()
    // here to avoid useless calls to getComponentName().
    warning(
      false,
      'Cannot decorate `%s` with @pureRenderDecorator, '
      + 'because it already implements `shouldComponentUpdate().',
      getComponentName(component)
    )
  }

  component.prototype.shouldComponentUpdate = shouldComponentUpdate;
  return component;
}



module.exports = pureRenderDecorator;
