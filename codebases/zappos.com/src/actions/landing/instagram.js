import { RECEIVE_INSTAGRAM_PICS } from 'constants/reduxActions';
import 'isomorphic-fetch';
import { fetchErrorMiddleware } from 'middleware/fetchErrorMiddleware';
import marketplace from 'cfg/marketplace.json';
import { trackError } from 'helpers/ErrorUtils';

export function receiveInstagramPics(instagram) {
  return {
    type: RECEIVE_INSTAGRAM_PICS,
    instagram: instagram
  };
}

export function fetchInstagramPics(images) {
  return function(dispatch) {
    const { instagramService } = marketplace.landing.instagramComponent;

    // images already received from ZCS
    if (images) {
      return dispatch(receiveInstagramPics(images));
    }

    return fetch(instagramService)
      .then(fetchErrorMiddleware)
      .then(response => {
        dispatch(receiveInstagramPics(response));
      })
      .catch(e => {
        dispatch(receiveInstagramPics({
          success: false,
          message: []
        }));
        trackError('NON-FATAL', 'Could not load instagram image data.', e);
      });
  };
}
