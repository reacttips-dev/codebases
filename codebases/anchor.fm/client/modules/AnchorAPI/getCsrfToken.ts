type GetCsrfTokenResponse = {
  csrfToken: string;
};

export function getCsrfToken(): Promise<GetCsrfTokenResponse> {
  return fetch('/api/csrf', {
    method: 'GET',
    credentials: 'same-origin',
    headers: new Headers({
      'Content-Type': 'application/json',
    }),
  })
    .then(response => {
      if (response.ok) {
        return response.json();
      }
      throw new Error('Unable to get CSRF token');
    })
    .catch(err => {
      throw new Error(err);
    });
}
