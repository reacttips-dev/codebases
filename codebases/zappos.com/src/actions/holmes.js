import {
  STORE_HOLMES
} from 'constants/reduxActions';

export function storeHolmes(holmes) {
  return {
    type: STORE_HOLMES,
    holmes
  };
}

export function setupHolmes(storeHolmesFn = storeHolmes) {
  return function(dispatch, getState) {
    const { holmes } = getState().cookies;
    try {
      if (holmes) {
        const holmesData = JSON.parse(holmes);
        // Sometimes the holmes cookie gets made incorrectly with the name "Zappos"
        holmesData.firstName = holmesData.firstName.toLowerCase() === 'zappos' ? null : holmesData.firstName;
        holmesData && dispatch(storeHolmesFn(holmesData));
      }
    } catch (e) { /* dont blow up if it cant store holmes */ }
  };
}
