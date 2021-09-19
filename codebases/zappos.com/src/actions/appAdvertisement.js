import {
  DID_SHOW_BANNER
} from 'constants/reduxActions';

export function didShowBanner(isShowing) {
  return {
    type: DID_SHOW_BANNER,
    isShowing
  };
}
