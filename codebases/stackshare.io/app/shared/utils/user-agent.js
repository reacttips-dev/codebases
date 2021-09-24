export const isMac = () =>
  typeof window === 'undefined' ? true : window.navigator.platform.indexOf('Mac') > -1;

export const isMobileSafari = () => {
  const ua = window.navigator.userAgent;
  const iOS = !!ua.match(/iPad/i) || !!ua.match(/iPhone/i);
  const webkit = !!ua.match(/WebKit/i);
  const iOSSafari = iOS && webkit && !ua.match(/CriOS/i);
  return iOSSafari;
};

export const KEY_MODIFIER_SYMBOL = isMac() ? '\u2318' : 'ctrl';
