/* eslint-disable
    eqeqeq,
    @typescript-eslint/no-use-before-define,
*/
// TODO: This file was created by bulk-decaffeinate.
// Fix any style issues and re-enable lint.
/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS102: Remove unnecessary code created because of implicit returns
 * DS103: Rewrite code to no longer use __guard__
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const {
  currentModelManager,
} = require('app/scripts/controller/currentModelManager');
const FileLinkHandler = require('app/scripts/views/internal/file-link-handler');
const {
  isWebClientPage,
} = require('app/scripts/lib/util/url/is-web-client-page');
const Layout = require('app/scripts/views/lib/layout');
const { ModelCache } = require('app/scripts/db/model-cache');
const {
  shouldHandleClick,
} = require('app/scripts/lib/util/should-handle-click');
const { Util } = require('app/scripts/lib/util');
const { PopOver } = require('app/scripts/views/lib/pop-over');
const $ = require('jquery');
const { siteDomain } = require('@trello/config');
const { navigate } = require('app/scripts/controller/navigate');

const handleLinkClick = function (e) {
  const $a = $(e.target).closest('a');
  const href = $a.attr('href');
  if (!href || href === '#') {
    Util.preventDefault(e);
  } else if (href.indexOf('file://') === 0) {
    Util.preventDefault(e);
    FileLinkHandler($a[0]);
  } else if (href.indexOf('/') === 0 || href.indexOf(siteDomain + '/') === 0) {
    const urlTarget = href
      .replace(new RegExp(`^${siteDomain}`), '')
      .replace(new RegExp(`^/(?=.)`), '');

    // location.pathname has a leading "/"; urlTarget does not
    const isNewUrl = urlTarget !== location.pathname.slice(1);

    if (window !== window.top && navigatesOffBoard(urlTarget)) {
      Util.preventDefault(e);
      window.open(urlTarget);
      return;
    }

    // If the page is just a virtual route served by the controller, we don't
    // need to reload the page. Unless it has target="_blank", because when
    // you "attach" a Trello card to another card you get an "open in a new
    // tab" link that we don't want to intercept.
    if (isWebClientPage(href) && $a.attr('target') == null) {
      Util.preventDefault(e);
      if (isNewUrl) {
        navigate(urlTarget, { trigger: true });
      }
    }
  }
};

// In cases where we're framed, we want to intercept navigation to other parts
// of Trello, and open those in new windows
const navigatesOffBoard = function (urlTarget) {
  let currentBoard;
  if ((currentBoard = currentModelManager.getCurrentBoard()) != null) {
    // If we're not a relative URL for a card or board, then we can't be on
    // the same board
    const parts = new RegExp(`^([bc])/([^/]+)`).exec(urlTarget);
    if (parts == null) {
      return true;
    }

    const [, modelLetter, shortLink] = Array.from(parts);

    switch (modelLetter) {
      case 'b':
        return shortLink !== currentBoard.get('shortLink');
      case 'c':
        return (
          __guard__(ModelCache.get('Card', shortLink), (x) => x.getBoard()) !==
          currentBoard
        );
      default:
        return true;
    }
  } else {
    // If we're not on a board right now, don't worry about navigating
    // off of it
    return false;
  }
};

module.exports = function (e) {
  const $target = $(e.target);

  // This does a blanket selections for any classic fields using
  // 'editable-view.js' that are currently editing (as well as some other
  // selectors). We should aim to move this logic closer to the components that
  // need it (or into the editable-view).
  //
  // The giant if/else-if statement that used to live here would implicitly
  // ignore the Layout.isEditing() check for any clicks inside popovers. Removing
  // this check today causes any popovers that use the selectors checked for in
  // Layout.isEditing() to break (an example of this is the custom fields popover
  // that allows you to customize the options in a 'dropdown' custom field, where
  // you can no longer change the name of the option due to it being immediately
  // canceled without this check).
  //
  // Removal tracked in: FEPLAT-505
  const clickInPopover =
    PopOver.isVisible && $target.closest('.pop-over').length > 0;

  if (!clickInPopover && Layout.isEditing()) {
    Layout.cancelEdits();
  }

  const $a = $target.closest('a');
  // If it's not a link or they're trying to do some fancy click (that opens in
  // a new tab, etc) don't try to subvert it
  if ($a.length && shouldHandleClick(e)) {
    handleLinkClick(e);
  }
};

function __guard__(value, transform) {
  return typeof value !== 'undefined' && value !== null
    ? transform(value)
    : undefined;
}
