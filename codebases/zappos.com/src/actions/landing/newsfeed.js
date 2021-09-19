import {
  DELETE_EXPLICIT_FIT,
  RECEIVE_EXPLICIT_FIT,
  RECEIVE_EXPLICIT_FITS,
  SEND_FITSURVEY_REPLY,
  SEND_NEWSFEED_DISMISSAL,
  SEND_NEWSFEED_IMPRESSION,
  SET_RANDOM_NEWSFEED_WIDGET
} from 'constants/reduxActions';
import { fetchErrorMiddleware, fetchErrorMiddlewareMaybeJson } from 'middleware/fetchErrorMiddleware';
import { trackError } from 'helpers/ErrorUtils';
import { dismissNewsfeed, getExplicitFits, postFitSurveyReply, postNewsfeedImpression, updateFitSurveyReply } from 'apis/mafia';
import { err, setError } from 'actions/errors';

export function setRandomNewsfeedWidget(data) {
  return {
    type: SET_RANDOM_NEWSFEED_WIDGET,
    data
  };
}

export function sendNewsfeedImpression() {
  return {
    type: SEND_NEWSFEED_IMPRESSION
  };
}

export function sendFitSurveyReply() {
  return {
    type: SEND_FITSURVEY_REPLY
  };
}

export function sendNewsfeedDismissal() {
  return {
    type: SEND_NEWSFEED_DISMISSAL
  };
}

export function receiveExplicitFits(fits) {
  return {
    type: RECEIVE_EXPLICIT_FITS,
    fits
  };
}

export function receiveExplicitFit(fit) {
  return {
    type: RECEIVE_EXPLICIT_FIT,
    fit
  };
}

export function deleteExplicitFit(id) {
  return {
    type: DELETE_EXPLICIT_FIT,
    id
  };
}

export function selectWidget(data) {
  return dispatch => {
    if (data) {
      const { events } = JSON.parse(data);
      if (events && events.length) {
        const randomProduct = events[Math.floor(Math.random() * events.length)];
        dispatch(setRandomNewsfeedWidget(randomProduct));
      }
    }
  };
}

export function newsfeedImpression(eventId, data, completed, newsfeedImpressionApi = postNewsfeedImpression) {
  const { lineItemId } = data;
  const impressionData = {
    'type': 'fitSurvey',
    eventId,
    lineItemId,
    completed
  };
  return (dispatch, getState) => {
    dispatch(sendNewsfeedImpression());
    const state = getState();
    const { cookies, environmentConfig: { api: { mafia } } } = state;
    return newsfeedImpressionApi(mafia, impressionData, cookies)
      .then(fetchErrorMiddleware)
      .then(response => { // endpoint does a fire and forget so client not expecting a response
        if (response !== 'OK') {
          trackError('NON-FATAL', 'Cronkite newsfeed impression response returned error.');
        }
      })
      .catch(e => {
        trackError('NON-FATAL', 'Could not send newsfeed impression.', e);
      });
  };
}

// productIdentifier should be an object with either/both a `stockId` or `asin` to identify the product we're replying for
export function fitSurveyReply(productIdentifier, fitValue, fitSurveyReplyApi = postFitSurveyReply) {
  const dataScienceData = {
    ...productIdentifier,
    'indicator': fitValue
  };
  return (dispatch, getState) => {
    dispatch(sendFitSurveyReply());
    const state = getState();
    const { cookies, environmentConfig: { api: { mafia } } } = state;
    return fitSurveyReplyApi(mafia, dataScienceData, cookies)
      .then(fetchErrorMiddleware)
      .then(({ fit }) => {
        dispatch(receiveExplicitFit(fit));
      })
      .catch(e => {
        trackError('NON-FATAL', 'Sending fit survey reply', e);
      });
  };
}

export function updateFitSurvey({ stockId, id, deleteFit = false }, fitValue, fitSurveyReplyApi = updateFitSurveyReply) {
  const dataScienceData = {
    stockId,
    'indicator': fitValue
  };
  return (dispatch, getState) => {
    dispatch(sendFitSurveyReply());
    const state = getState();
    const { cookies, environmentConfig: { api: { mafia } } } = state;
    return fitSurveyReplyApi(mafia, { id, deleteFit }, dataScienceData, cookies)
      .then(fetchErrorMiddlewareMaybeJson) // method delete doesnt send back anything
      .then(response => {
        if (deleteFit) {
          dispatch(deleteExplicitFit(id));
        } else {
          dispatch(receiveExplicitFit(response.fit));
        }
      })
      .catch(() => {
        dispatch(setError(err.GENERIC, new Error('Updating fit survey reply')));
      });
  };
}

export function getCustomerFits(getExplicitFitsApi = getExplicitFits) {
  return (dispatch, getState) => {
    const state = getState();
    const { cookies, environmentConfig: { api: { mafia } } } = state;
    return getExplicitFitsApi(mafia, cookies)
      .then(fetchErrorMiddleware)
      .then(response => {
        dispatch(receiveExplicitFits(response));
        return response;
      })
      .catch(() => {
        dispatch(setError(err.GENERIC, new Error('Getting customer fit surveys')));
      });
  };
}

export function newsfeedDismissal(data, dismissNewsfeedApi = dismissNewsfeed) {
  return (dispatch, getState) => {
    dispatch(sendNewsfeedDismissal());
    const state = getState();
    const { cookies, environmentConfig: { api: { mafia } } } = state;
    return dismissNewsfeedApi(mafia, data, cookies)
      .then(fetchErrorMiddleware)
      .then(response => {
        // do nothing with response for now, maybe eventually store in state?
        // eslint-disable-next-line no-console
        console.log('Response: ', response);
      })
      .catch(() => {
        dispatch(setError(err.GENERIC, new Error('Dismiss newsfeed error.')));
      });
  };
}
