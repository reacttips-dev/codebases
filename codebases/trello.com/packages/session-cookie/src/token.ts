import Cookies from 'js-cookie';

const cookieName = 'token';
const defaultPort = '3000';

export const getToken = (): string | null => {
  if (typeof window === 'undefined') {
    return null;
  }
  return (
    Cookies.get(cookieName) ||
    Cookies.get(`${cookieName}${window.location.port}`) ||
    Cookies.get(`${cookieName}${defaultPort}`) ||
    null
  );
};

export const getMyId = (): string | null => {
  const cookie = getToken();

  return cookie ? cookie.split('/')[0] : null;
};

// eslint-disable-next-line @trello/no-module-logic
export let memberId: string | null = getMyId();
// eslint-disable-next-line @trello/no-module-logic
export let token: string | null = getToken();

export const clearCookie = (): void => {
  memberId = null;
  token = null;
  Cookies.remove(cookieName, { path: '/' });
};
