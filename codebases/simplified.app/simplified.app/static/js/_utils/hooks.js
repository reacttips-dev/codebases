import queryString from "query-string";
import { useState } from "react";

const responseTypeLocationKeys = {
  code: "search",
  token: "hash",
};

const responseTypeDataKeys = {
  code: "code",
  token: "access_token",
};

function toQuery(params, delimiter = "&") {
  const keys = Object.keys(params);

  return keys.reduce((str, key, index) => {
    let query = `${str}${key}=${params[key]}`;

    if (index < keys.length - 1) {
      query += delimiter;
    }

    return query;
  }, "");
}

class PopupWindow {
  constructor(id, url, popupOptions = {}, otherOptions = {}) {
    this.id = id;
    this.url = url;
    this.popupOptions = popupOptions;
    this.locationKey = otherOptions.locationKey;
  }

  open() {
    const { url, id, popupOptions } = this;

    this.window = window.open(url, id, toQuery(popupOptions, ","));
  }

  close() {
    this.cancel();
    this.window.close();
  }

  poll() {
    this.promise = new Promise((resolve, reject) => {
      this.iid = window.setInterval(() => {
        try {
          const popup = this.window;

          if (!popup || popup.closed !== false) {
            this.close();

            reject(new Error("The popup was closed for an unexpected reason"));

            return;
          }

          if (
            popup.location.href === this.url ||
            popup.location.pathname === "blank"
          ) {
            // location unchanged, still polling
            return;
          }

          if (!["search", "hash"].includes(this.locationKey)) {
            reject(
              new Error(
                `Cannot get data from location.${this.locationKey}, check the responseType prop`
              )
            );
            this.close();
            return;
          }
          const locationValue = popup.location[this.locationKey];
          const params = queryString.parse(locationValue);
          resolve(params);

          this.close();
        } catch (error) {
          /*
           * Ignore DOMException: Blocked a frame with origin from accessing a
           * cross-origin frame.
           */
        }
      }, 500);
    });
  }

  cancel() {
    if (this.iid) {
      window.clearInterval(this.iid);
      this.iid = null;
    }
  }

  then(...args) {
    return this.promise.then(...args);
  }

  catch(...args) {
    return this.promise.catch(...args);
  }

  static open(...args) {
    const popup = new this(...args);

    popup.open();
    popup.poll();

    return popup;
  }
}

/**
 *
 * OAuth2 application login generic hook
 *
 * @param {id} string unique identifier for popup js
 * @param {authorizationUrl} string Oauth2 Authorization url
 * @param {clientId} string clientId of Oauth2 Application
 * @param {redirectUri} string Redirect URI for Oauth2 app
 * @param {responseType} string 'code' | 'access_token'
 * @param {onSuccess} function on successful authentication
 * @param {onFailure} function on failed authentication
 * @param {onRequest} function when the popup is opened
 * @param {scope} string Scopes for the Oauth2 application
 * @param {extraQueryParams} Object extra query parameters passed in the Oauth2 URL
 * @returns {requestSignIn, loading} requestSignin method to open Oauth2 Popup
 */
export const useOauth2Login = ({
  id,
  authorizationUrl,
  clientId,
  redirectUri,
  responseType = "access_token",
  onSuccess = (res) => {},
  onFailure = (res) => {},
  onRequest = (res) => {},
  scope,
  extraQueryParams = {},
}) => {
  let popup = null;

  const [loading, setLoading] = useState(false);

  const handleSuccess = (data) => {
    const responseKey = responseTypeDataKeys[responseType];
    if (!data[responseKey]) {
      console.error("received data", data);
      return onFailure(data);
    }
    setLoading(false);
    return onSuccess(data);
  };

  const handleFailure = (data) => {
    setLoading(false);
    return onFailure(data);
  };

  const requestSignIn = () => {
    // Prepare payload and query params for oauth popup
    const requestPayload = {
      client_id: clientId,
      scope,
      redirect_uri: redirectUri,
      response_type: responseType,
      ...extraQueryParams,
    };
    const search = queryString.stringify(requestPayload);
    const width = 680;
    const height = 440;
    const left = window.screenX + (window.outerWidth - width) / 2;
    const top = window.screenY + (window.outerHeight - height) / 2.5;
    const locationKey = responseTypeLocationKeys[responseType];

    // Open a popup and call onRequest callback
    popup = PopupWindow.open(
      id,
      `${authorizationUrl}?${search}`,
      {
        height,
        width,
        top,
        left,
      },
      {
        locationKey,
      }
    );
    setLoading(true);
    onRequest();

    // Handle on success and on failure scenarios
    popup.then(handleSuccess).catch(handleFailure);
  };

  return { requestSignIn, loading };
};
