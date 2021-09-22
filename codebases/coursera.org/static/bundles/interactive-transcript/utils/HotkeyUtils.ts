import _t from 'i18n!nls/interactive-transcript';

export const getModifierKeyForPlatform = () => {
  let isMac = false;
  if (typeof window !== 'undefined') {
    isMac = window.navigator.platform.includes('Mac');
  }

  return isMac ? '⌘' : _t('CTRL');
};
