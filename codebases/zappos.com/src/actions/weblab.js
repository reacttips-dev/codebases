import ab from 'react-redux-hydra';

import { getMafiaAndCredentials } from 'store/ducks/readFromStore';
import { MAFIA_NEXT_SHIPPING_OPTION_321483, ZAPPOS_LWA_PRIME_270010 } from 'constants/weblabs';
import { HYDRA_CHECKOUT_NEXT_DAY_SHIPPING, HYDRA_PRIME_TWO_DAY_SHIPPING } from 'constants/hydraTests';
import { processHeadersMiddleware } from 'middleware/processHeadersMiddlewareFactory';
import { fetchNon200Middleware } from 'middleware/fetchErrorMiddleware';
import { setSessionCookies } from 'actions/session';
import { weblabTrigger } from 'apis/mafia';
import marketplace from 'cfg/marketplace.json';
const { cookieDomain } = marketplace;

const weblabExperimentToHydraAssignment = assignment => {
  switch (assignment) {
    case 'C':
      return 0;
    case 'T1':
      return 1;
    case 'T2':
      return 2;
    case 'T3':
      return 3;
    default:
      return 0;
  }
};

export const forceAssignTwoDayPrimeShipping = () => dispatch => {
  dispatch(workRequestTriggerWeblabAssignment({ weblab: ZAPPOS_LWA_PRIME_270010, hydraTest: HYDRA_PRIME_TWO_DAY_SHIPPING }));
};

export const forceAssignAssignNextShipOption = () => dispatch => {
  dispatch(workRequestTriggerWeblabAssignment({ weblab: MAFIA_NEXT_SHIPPING_OPTION_321483, hydraTest: HYDRA_CHECKOUT_NEXT_DAY_SHIPPING }));
};

export function workRequestTriggerWeblabAssignment({ hydraTest, weblab }, fetcher = weblabTrigger, forceAssignment = ab.actions.forceAssignment) {
  return (dispatch, getState) => {
    const { mafia, credentials } = getMafiaAndCredentials(getState());
    return fetcher(mafia, weblab, credentials)
      .then(processHeadersMiddleware(setSessionCookies(dispatch, getState)))
      .then(fetchNon200Middleware)
      .then(resp => {
        if (resp) {
          if (hydraTest) {
            const assignment = weblabExperimentToHydraAssignment(resp);
            dispatch(forceAssignment({ domain: cookieDomain }, hydraTest, assignment));
          }
          return resp;
        }
      });
  };
}
