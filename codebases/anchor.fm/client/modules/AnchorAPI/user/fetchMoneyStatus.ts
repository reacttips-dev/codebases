import AnchorAPIError from '../AnchorAPIError';

export type MoneyStatusResponse = {
  hasAuthenticatedStripe: boolean;
  hasSupportersEnabled: boolean;
  isAllowedToAuthenticateStripe: boolean;
  loginLink: string | null;
};

export const fetchMoneyStatus = (): Promise<MoneyStatusResponse> =>
  new Promise((resolve, reject) => {
    fetch('/api/user/money/status', {
      method: 'GET',
      credentials: 'same-origin',
    })
      .then(response => {
        if (response.status === 200) {
          response.json().then(responseJSON => {
            resolve(responseJSON);
          });
        } else {
          reject(
            new AnchorAPIError(
              response,
              `Non 200 response status: ${response.status}`
            )
          );
        }
      })
      .catch(err => {
        reject(err);
      });
  });
