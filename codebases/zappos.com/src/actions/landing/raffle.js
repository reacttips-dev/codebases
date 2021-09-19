import {
  RAFFLE_SUBMIT_ERROR,
  RAFFLE_SUBMIT_IN_PROGRESS,
  RAFFLE_SUBMIT_SUCCESS
} from 'constants/reduxActions';
import { trackError } from 'helpers/ErrorUtils';
import { submitRaffle } from 'apis/mafia';
import { formInputsToObject } from 'helpers/HtmlHelpers';

export function setRaffleSuccess() {
  return {
    type: RAFFLE_SUBMIT_SUCCESS
  };
}

export function setRaffleInProgress() {
  return {
    type: RAFFLE_SUBMIT_IN_PROGRESS
  };
}

export function setRaffleError() {
  return {
    type: RAFFLE_SUBMIT_ERROR
  };
}

export function submitRaffleData(event, callback, submit = submitRaffle) {
  event.preventDefault();
  const data = formInputsToObject(event.target);
  return (dispatch, getState) => {
    dispatch(setRaffleInProgress());
    const { cookies, environmentConfig: { api: { mafia } } } = getState();
    return submit(mafia, cookies, data)
      .then(() => {
        dispatch(setRaffleSuccess());
        callback && callback();
      })
      .catch(err => {
        dispatch(setRaffleError());
        callback && callback();
        trackError('ERROR', 'Failed to submit survey data', err);
      });
  };
}
