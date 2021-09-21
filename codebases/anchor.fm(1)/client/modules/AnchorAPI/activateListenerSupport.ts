export function activateListenerSupport(_csrf: string) {
  return fetch('/auth/money/product/activate?product=ListenerSupport', {
    method: 'POST',
    credentials: 'same-origin',
    headers: new Headers({
      'Content-Type': 'application/json',
    }),
    body: JSON.stringify({ _csrf }),
  })
    .then(response => {
      if (response.ok) {
        return response;
      }
      throw new Error('Unable to activate listener support');
    })
    .catch(err => {
      throw new Error(err);
    });
}
