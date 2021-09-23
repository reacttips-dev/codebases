'use es6';

var STRING_COLLATOR = window.Intl && typeof window.Intl === 'object' && new Intl.Collator();
export default (function (option1, option2) {
  var comparisonResult = 0;

  if (STRING_COLLATOR) {
    comparisonResult = STRING_COLLATOR.compare(option1, option2);
  } else if (option1 > option2) {
    comparisonResult = 1;
  } else if (option1 > option2) {
    comparisonResult = -1;
  }

  return comparisonResult;
});