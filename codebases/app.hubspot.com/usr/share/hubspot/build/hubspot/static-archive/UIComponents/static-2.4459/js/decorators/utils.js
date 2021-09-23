'use es6';

export function getCoreComponent(Component) {
  var node = Component;

  while (node.WrappedComponent) {
    node = node.WrappedComponent;
  }

  return node;
}
export function isFunctionalComponent(Component) {
  return !Component.prototype || !Component.prototype.render;
}
export function attachWrappedComponent(Decorator, WrappedComponent) {
  Decorator.WrappedComponent = WrappedComponent;
  Decorator.CoreComponent = getCoreComponent(WrappedComponent);
}
export function copyMethods(wrappedInstance, decoratorInstance) {
  // Copy all methods from the wrapped component instance to this wrapper,
  // so that this wrapper is usable as a ref.
  if (!wrappedInstance) {
    return;
  }

  Object.getOwnPropertyNames(wrappedInstance).filter(function (key) {
    return key !== 'getDOMNode';
  }) // See #4515
  .forEach(function (key) {
    if (typeof wrappedInstance[key] === 'function' && !decoratorInstance[key]) {
      decoratorInstance[key] = wrappedInstance[key];
    }
  });
}
export var makeDecoratorRefCallback = function makeDecoratorRefCallback(Component, decoratorInstance) {
  if (isFunctionalComponent(Component)) return undefined;
  return function (ref) {
    copyMethods(ref, decoratorInstance);
  };
};