import { RECEIVE_BRAND_NOTIFY_CONFIRMATION } from 'constants/reduxActions';
import { sendNotificationSubscriptions } from 'actions/productdetail/sharing';

export function receiveBrandNotifyConfirmation(response) {
  return {
    type: RECEIVE_BRAND_NOTIFY_CONFIRMATION,
    validEmailReponse: response
  };
}

export function submitNotifyBrandEmail({ emailAddress, brandId }) {
  return dispatch =>
    // Post form data and display message that email has been recorded even without explicit confirmation.
    dispatch(sendNotificationSubscriptions(emailAddress, null, null, brandId))
      .then(response => {
        dispatch(receiveBrandNotifyConfirmation(response));
      })
      .catch(error => { // dispatch confirmation anyway
        dispatch(receiveBrandNotifyConfirmation(error));
      });
}
