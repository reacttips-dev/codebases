'use es6';

export var SIZE_CLASSES = {
  auto: '',
  medium: 'private-modal--medium',
  short: 'private-modal--short',
  tall: 'private-modal--tall'
};
export var MODAL_USE_CLASSES = {
  default: 'private-modal--default private-modal--is-popup',
  conversational: 'private-modal--conversational private-modal--is-popup',
  info: 'private-modal--info private-modal--is-popup',
  success: 'private-modal--success private-modal--is-popup',
  danger: 'private-modal--danger private-modal--is-popup',
  fullscreen: 'private-modal--fullscreen',
  lightbox: 'private-modal--lightbox',
  upgrades: 'private-modal--upgrades private-modal--is-popup'
};
export var DIALOG_USE_CLASSES = Object.assign({}, MODAL_USE_CLASSES, {
  sidebar: 'private-modal--sidebar'
});