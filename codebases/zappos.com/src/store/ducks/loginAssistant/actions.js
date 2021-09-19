import {
  CLOSE_LA,
  LOGIN_FROM_LA,
  REDIRECT_FROM_LA,
  SHOW_LA
} from 'store/ducks/loginAssistant/types';

export const onCloseLoginAssistantClick = buttonText => ({ type: CLOSE_LA, actionType: 'DISMISS', buttonText });
export const onLoginFromLoginAssistantClick = (buttonText, redirectPath) => ({ type: LOGIN_FROM_LA, actionType: 'LOGIN', buttonText, redirectPath });
export const onRedirectFromLoginAssistantClick = (buttonText, redirectPath) => ({ type: REDIRECT_FROM_LA, buttonText, redirectPath });
export const onShowLoginAssistant = () => ({ type: SHOW_LA });
