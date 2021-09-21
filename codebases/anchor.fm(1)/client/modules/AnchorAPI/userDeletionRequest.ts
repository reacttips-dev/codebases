import AnchorAPIError from './AnchorAPIError';

const fetchUserDeletionRequest = (userId: number) =>
  new Promise<any>((resolve, reject) => {
    const url = `/api/proxy/v3/users/${userId}/deletion_request`;
    fetch(url, {
      credentials: 'same-origin',
      method: 'GET',
    }).then(
      (response: any): void => {
        if (response.ok) {
          response.json().then((responseJson: any) => {
            resolve(responseJson);
          });
        } else {
          const error = new AnchorAPIError(response, 'Server error.');
          reject(error);
        }
      }
    );
  });

const requestUserDeletion = (userId: number) =>
  new Promise<any>((resolve, reject) => {
    const url = '/api/proxy/v3/users/request_deletion';
    fetch(url, {
      method: 'POST',
      headers: new Headers({
        'Content-Type': 'application/json',
      }),
      body: JSON.stringify({ userId }),
    }).then(
      (response: any): void => {
        if (response.ok) {
          response.json().then((responseJson: any) => {
            resolve(responseJson);
          });
        } else {
          const error = new AnchorAPIError(response, 'Server error.');
          reject(error);
        }
      }
    );
  });

export { fetchUserDeletionRequest, requestUserDeletion };
