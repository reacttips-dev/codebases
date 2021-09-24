export const redirectTo = location =>
  (window.location = location.startsWith('/') ? location : `/${location}`);
export const approve = message => confirm(message);
