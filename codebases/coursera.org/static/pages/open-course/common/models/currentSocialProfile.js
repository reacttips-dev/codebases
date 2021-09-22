import user from 'js/lib/user';
import SocialProfile from 'pages/open-course/common/models/socialProfile';

export default () =>
  new SocialProfile({
    userId: user.get().id,
    externalUserId: user.get().external_id,
    fullName: user.get().display_name,
    photoUrl: user.get().photo_120,
  });
