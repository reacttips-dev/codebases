export var getStepId = function getStepId(stepIndex) {
  return "step " + stepIndex;
};

var transformTourSteps = function transformTourSteps(tourSteps) {
  return tourSteps.map(function (step, index) {
    return Object.assign({}, step, {
      id: getStepId(index + 1)
    });
  });
};

export var transformTour = function transformTour(tourSteps) {
  return transformTourSteps(tourSteps);
};