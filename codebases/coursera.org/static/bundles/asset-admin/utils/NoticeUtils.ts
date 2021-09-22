const DISMISS_NOTICE_KEY = 'AssetAdminModalNoticeDismissed';

export const dismissNoticeMessage = () => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(DISMISS_NOTICE_KEY, 'true');
  }
};

export const isNoticeMessageDismissed = () => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem(DISMISS_NOTICE_KEY) !== null;
  } else {
    return false;
  }
};
