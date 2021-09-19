import {
  RECEIVE_INSTAGRAM_PICS
} from 'constants/reduxActions';

export default function instagram(state = { isLoading: true, instagramData: {} }, action) {
  const { type, instagram = {} } = action;

  switch (type) {
    case RECEIVE_INSTAGRAM_PICS:
      const { message = [] } = instagram || {};
      const instagramData = { ...instagram, instaImages: message.filter(m => m.link && m.images?.small) };
      delete instagramData.message;
      return { ...state, isLoading: false, instagramData };
    default:
      return state;
  }
}
