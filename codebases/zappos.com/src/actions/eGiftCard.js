import { RECEIVE_EGC_DATA, SET_EGC_DESIGN } from 'constants/reduxActions';
import { err, setError } from 'actions/errors';
import { getEGiftCardDesigns } from 'apis/mafia';
import { fetchErrorMiddleware } from 'middleware/fetchErrorMiddleware';

// data is structured like: //[{asin:'BT00K59JMQ',physicalId:'41iRySjX4NL',designName:'Classic',minPrice:10,maxPrice:1000,imageUrl:'https://images-na.ssl-images-amazon.com/images/I/41iRySjX4NL.jpg'}]
export function receiveEGCData(data) {
  return {
    type: RECEIVE_EGC_DATA,
    data
  };
}

export function setGiftCardDesign(asin) {
  return { type: SET_EGC_DESIGN, asin };
}

export function fetchEGiftCardDesigns(giftCardFetcher = getEGiftCardDesigns) {
  return (dispatch, getState) => {
    const { environmentConfig: { api: { mafia } } } = getState();
    return giftCardFetcher(mafia)
      .then(fetchErrorMiddleware)
      .then(data => {
        if (data && data.length > 0) {
          dispatch(receiveEGCData(data));
        } else {
          dispatch(setError(err.GENERIC, new Error('No gift card designs received.')));
        }
      })
      .catch(e => {
        dispatch(setError(err.GENERIC, e));
      });
  };
}
