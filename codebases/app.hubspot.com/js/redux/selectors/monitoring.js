'use es6';

import { createSelector } from 'reselect';
import { createTruthySelector } from 'truthy-selector';
import { getProfile, getSocialContacts } from '../selectors';
import { FEED_ACTION_TYPES, LANDSCAPE_SETTING } from '../../lib/constants';
export var getInteractions = createTruthySelector([getProfile], function (profile) {
  return profile && profile.interactions;
});
export var getNonRetweetInteractions = createTruthySelector([getInteractions], function (interactions) {
  return interactions.filterNot(function (i) {
    return i.interactionType === FEED_ACTION_TYPES.MATCH_STREAM_RETWEET;
  });
});
export var getRetweets = createTruthySelector([getInteractions], function (interactions) {
  var favorites = interactions.filter(function (i) {
    return i.interactionType === 'YOU_FAVORITE';
  });
  var retweets = interactions.filter(function (i) {
    return i.interactionType === FEED_ACTION_TYPES.MATCH_STREAM_RETWEET;
  });
  return retweets.map(function (interaction) {
    return interaction.setIn(['renderContext', 'favoriteInteraction'], favorites.find(function (favorite) {
      return favorite.foreignId === interaction.foreignId;
    }));
  });
});
export var getProfileDetailed = createSelector([getProfile, getSocialContacts], function (profile, socialContacts) {
  if (profile && socialContacts) {
    var networkContacts = socialContacts.getNetwork(profile.network);

    if (networkContacts.get(profile.getUserId())) {
      var contactMatch = networkContacts.get(profile.getUserId());
      return profile.set('contact', contactMatch.contact);
    }
  }

  return profile;
});
export var getLandscapeId = function getLandscapeId(state) {
  var hubSettings = state.hubSettings;
  return hubSettings && hubSettings.get(LANDSCAPE_SETTING) && hubSettings.get(LANDSCAPE_SETTING).get('id');
};