'use es6';

import { Map as ImmutableMap, List } from 'immutable';
import PortalIdParser from 'PortalIdParser';
export var toggleDependency = function toggleDependency(_ref) {
  var dependencies = _ref.dependencies,
      dependencyType = _ref.dependencyType,
      reliesOnUniqueId = _ref.reliesOnUniqueId;
  return dependencies.has(reliesOnUniqueId) ? dependencies.delete(reliesOnUniqueId) : dependencies.set(reliesOnUniqueId, ImmutableMap({
    dependencyType: dependencyType
  }));
};
export var convertStepDependenciesToDependencies = function convertStepDependenciesToDependencies(steps) {
  return steps.filter(function (step) {
    return step.has('dependencies');
  }).filterNot(function (step) {
    return step.get('dependencies').isEmpty();
  }).reduce(function (dependencies, step) {
    var dependency = step.get('dependencies').first();
    var reliesOnStepOrder = dependency.get('reliesOnStepOrder');
    var dependencyType = dependency.get('dependencyType');
    var reliesOnUniqueId = steps.getIn([reliesOnStepOrder, 'uniqueId']);
    return dependencies.set(reliesOnUniqueId, ImmutableMap({
      dependencyType: dependencyType
    }));
  }, ImmutableMap());
};
export var convertDependenciesToStepDependencies = function convertDependenciesToStepDependencies(sequence) {
  var portalId = PortalIdParser.get();
  var sequenceId = sequence.get('id');
  var steps = sequence.get('steps');
  var lastStepUniqueId = steps.last().get('uniqueId');
  return sequence.get('dependencies').delete(lastStepUniqueId).reduce(function (_steps, dependency, reliesOnUniqueId) {
    var dependencyType = dependency.get('dependencyType');

    var reliesOnStep = _steps.find(function (step) {
      return step.get('uniqueId') === reliesOnUniqueId;
    });

    var reliesOnStepOrder = reliesOnStep.get('stepOrder');
    var requiredByStepOrder = reliesOnStepOrder + 1;
    var stepDependency = ImmutableMap({
      portalId: portalId,
      requiredByStepOrder: requiredByStepOrder,
      reliesOnStepOrder: reliesOnStepOrder,
      dependencyType: dependencyType,
      sequenceId: sequenceId
    });
    return _steps.update(requiredByStepOrder, function (step) {
      return step.withMutations(function (_step) {
        return _step.set('portalId', portalId).set('sequenceId', sequenceId).set('dependencies', List([stepDependency]));
      });
    });
  }, steps);
};