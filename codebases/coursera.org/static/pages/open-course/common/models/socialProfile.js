/*
 * SocialProfile's attributes are exactly the attributes returned by APIs that return social profiles as defined in
 *  infra-services/blob/master/libs/models/src/main/scala/org/coursera/opencourse/social/SocialProfile.scala.
 *
 * No APIs return the social profile directly, but many include it as a linked resource. One example is the naptime api
 *  /api/discourseQuestions.v1/:questionId?includes=creatorId
 *
 * Warning: ./currentSocialProfile.js constructs a SocialProfile using information that does not come from a social
 * profile api, so you must update it in conjunction with any changes to the social profile apis.
 */

import Backbone from 'backbone-associations';

const SocialProfile = Backbone.AssociatedModel.extend({
  idAttribute: 'userId',
  defaults: {
    fullName: 'Unknown',
    photoUrl: 'https://coursera-profile-photos.s3.amazonaws.com/18/44206023dd11e4a371d9d7bccf5822/avatar.png',
    externalUserId: 'someExternalUserId',
    isDefaultPhoto: true,
  },

  getProfileImageUrl() {
    return this.get('isDefaultPhoto') ? '' : this.get('photoUrl') || '';
  },

  initialize() {
    // Since passed-in attributes are not overridden when undefined, this sets the photo URL to
    // the default when the user does not have a profile pic.
    if (!this.get('photoUrl')) {
      this.set('photoUrl', this.defaults.photoUrl);
    } else if (this.get('photoUrl') !== this.defaults.photoUrl) {
      this.set('isDefaultPhoto', false);
    }
  },
});

export default SocialProfile;
