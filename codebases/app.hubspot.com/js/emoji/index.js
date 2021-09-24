'use es6'; // somewhat useless currently but want an explicit way apps activate this as we are attempting to lazy load / code split
// TODO: Refactor to use Redux state to indicate when emoji images have loaded
// https://git.hubteam.com/HubSpot/SocialMediaTeam/issues/759

export var enableEmojiImages = function enableEmojiImages() {
  window._useEmojiImages = true;
  document.querySelector('html').classList.add('emoji-plugin');
};