var BODY_CLASS_NAME = 'onboarding-tour--active';
export var addOnboardingTourBodyClass = function addOnboardingTourBodyClass() {
  document.body.classList.add(BODY_CLASS_NAME);
};
export var removeOnboardingTourBodyClass = function removeOnboardingTourBodyClass() {
  document.body.classList.remove(BODY_CLASS_NAME);
};