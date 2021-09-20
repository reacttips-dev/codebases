const mostCommonNoisyErrors = [
  'Failed to fetch',
  'NetworkError when attempting to fetch resource.',
  'The operation was aborted. ',
  'The request timed out.',
  'Se agotó el tiempo de espera.',
  'The network connection was lost.',
  'cancelled',
  'La requête a expiré.',
  'TypeMismatchError',
  'An SSL error has occurred and a secure connection to the server cannot be made.',
  'Zeitüberschreitung bei der Anforderung.',
  'A server with the specified hostname could not be found.',
  'The Internet connection appears to be offline.',
];

export const isExcludedNoisyError = (message?: string) => {
  return mostCommonNoisyErrors.some((err) => err === message);
};
