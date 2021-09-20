import { AgeRequirement } from './types';

// default to no age requirement. If geode lookup fails in
// app.jsx we want to fail open.
let _ageRequirement: AgeRequirement = { ageRequired: false, ageMinimum: 0 };

export default {
  setAgeRequirement: function(a: AgeRequirement): void {
    _ageRequirement = a;
  },
  getAgeRequirement: function(): AgeRequirement {
    return _ageRequirement;
  }
};
