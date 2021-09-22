/**
 * View to handle interactions within the admin menu that appears only for
 * admin users on certain pages of the site.
 *
 * @author      Dan Applegate <dan@skillshare.com>
 */
import SSView from 'core/src/views/base/ss-view';
import Utils from 'core/src/base/utils';

const AdminMenuView = SSView.extend({
  el: '.admin-area',

  actionOnClick: function(confirmationMessage, url, postData, errorMessage, cancelConfirmationCallback, saveConfirmatioCallback) {
    if (confirmationMessage) {
      const confirmResult = window.confirm(confirmationMessage);
      if (!confirmResult) {
        if (cancelConfirmationCallback) {
          cancelConfirmationCallback();
        }
        return;
      }
    }
    this.callApi(url, postData, errorMessage, saveConfirmatioCallback);
  },

  callApi: function(url, postData, errorMessage, saveConfirmatioCallback) {
    Utils.ajaxRequest(url, {
      data: postData,
      type: 'POST',
      success: data => this.onResponse(data, errorMessage, saveConfirmatioCallback),
      error: err => this.onError(errorMessage, err),
    });
  },

  onResponse: function(data, errorMessage, saveConfirmatioCallback) {
    let response = data;
    if (!_.isObject(data)) {
      response = JSON.parse(data);
    }
    const {success} = response;
    if (success) {
      if (response.redirectTo) {
        window.location = response.redirectTo;
      } else {
        if (saveConfirmatioCallback) {
          saveConfirmatioCallback();
        } else {
          window.location.reload();
        }
      }
    } else {
      this.onError(errorMessage);
    }
  },

  onError: function(errorMessage) {
    alert(errorMessage);
  },
});

export default AdminMenuView;

