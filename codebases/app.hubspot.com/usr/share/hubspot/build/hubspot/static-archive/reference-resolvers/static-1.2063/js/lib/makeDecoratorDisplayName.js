'use es6';

var makeDecoratorDisplayName = function makeDecoratorDisplayName(decoratorName, DecoratingComponent) {
  var decoratingName = DecoratingComponent.displayName || DecoratingComponent.name || 'Component';
  return decoratorName + "(" + decoratingName + ")";
};

export default makeDecoratorDisplayName;