import _ from 'underscore';

/* eslint-disable import/prefer-default-export */
export const legacyHydrate = (naptimeResponse) => {
  return _(naptimeResponse.elements).each(function (item) {
    _(naptimeResponse.links.elements).each(function (link, linkId) {
      /*
          For user profile, we get the creator of the post or we get the user
          who posted last to the thread. The profile.v0 from the linked object
          is an array with both these pieces of information. Hence this requires special treatment.
          The creator for the post is now stored in "creator" object and lastAnsweredBy details is
          updated to "lastAnsweredBy" object.
         */
      if (link === 'profiles.v0') {
        const relLinkId = linkId === 'creatorId' ? 'creator' : linkId;
        const userId = item[linkId];
        item[relLinkId] = _(naptimeResponse.linked[link]).where({ id: userId })[0];
      } else {
        item[link] = _(naptimeResponse.linked[link]).where({
          id: item[linkId],
        })[0];
      }
    });
  });
};
