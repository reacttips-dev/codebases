const Browser = require('@trello/browser');
const $ = require('jquery');
const gammaHeaderBranding = require('./header-branding');
const { importWithRetry } = require('@trello/use-lazy-component');
const {
  currentModelManager,
} = require('app/scripts/controller/currentModelManager');

module.exports.Header = {
  renderBannerContent: function (...args) {
    return importWithRetry(() =>
      import(/* webpackChunkName: "banner-content" */ './renderBannerContent'),
    ).then(({ renderBannerContent }) => {
      renderBannerContent.call(this, ...args);
    });
  },
  headerBranding: gammaHeaderBranding.headerBranding,
  embeddedDocumentCheck: function () {
    if (Browser.isEmbeddedDocument()) {
      if (currentModelManager.onAnyBoardView()) {
        // We won't show the header if the board is embedded.
        $('[data-js-id="header-container"]').hide();
      } else {
        // We only need the logo if Trello is embedded.
        $('[data-js-id="header-container"]').show();
      }
    } else {
      // show the header otherwise
      $('[data-js-id="header-container"]').show();
    }
  },
  showHeader: function (opts = {}) {
    this.embeddedDocumentCheck();
    this.headerBranding(opts);
    this.renderBannerContent();
  },
};
