'use es6';

export var isComposerEmbed = function isComposerEmbed(state) {
  return Boolean(state.composerEmbed || state.embeddedContext);
};
export var isComposerExtension = function isComposerExtension(state) {
  return Boolean(state.extension);
};
export var getEmbeddedContext = function getEmbeddedContext(state) {
  return state.embeddedContext;
};