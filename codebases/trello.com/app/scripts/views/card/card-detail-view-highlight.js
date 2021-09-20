/* eslint-disable
    eqeqeq,
*/
// TODO: This file was created by bulk-decaffeinate.
// Fix any style issues and re-enable lint.
/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const { Util } = require('app/scripts/lib/util');
const { Controller } = require('app/scripts/controller');
const Dialog = require('app/scripts/views/lib/dialog');

module.exports.highlight = function (highlight, scrollIntoView) {
  let parts;
  if ((parts = /^([a-z]+)-([a-f0-9]{24})$/.exec(highlight)) != null) {
    const [, type, id] = Array.from(parts);
    switch (type) {
      case 'action':
      case 'comment':
        this.actionListView.setHighlight(id);
        if (!this.model.actionList.get(id)) {
          this.showAllActions();
        }
        if (scrollIntoView) {
          this.scrollToHighlight();
        }
        break;
      default:
        break;
    }
  }
};

// If the user clicks on a link that points to something on the card we're
// already looking at, don't do the whole navigation thing and instead just
// skip to running the highlight code
module.exports.interceptHighlightLink = function (e) {
  // So I'm not sure how exactly this happens, given that we've selected
  // for a[href], but we are getting error reports that indicate that
  // e.target.href is undefined sometimes
  let parts;
  if (!e.target.href) {
    return;
  }

  const url = Util.relativeUrl(e.target.href);
  const cardUrl = Controller.getCardUrl(this.model);
  if ((parts = new RegExp(`^${cardUrl}\\#([^\\#]+)$`).exec(url)) != null) {
    const [, highlight] = Array.from(parts);
    if (highlight) {
      Util.stop(e);

      // Toggle the hash off if we're already on this one
      if (highlight === location.hash.substr(1)) {
        history.replaceState(null, null, location.pathname);
        this.actionListView.setHighlight(null);
      } else {
        history.replaceState(null, null, location.pathname + '#' + highlight);
        this.highlight(highlight, true);
      }
    }
  }
};

module.exports.scrollToHighlight = function () {
  let lastScroll = Date.now();

  cancelAnimationFrame(this.scrollInterval);
  let snapTo = null;

  let prevHighlightedTop = -1;
  let highlightedMoved = false;

  let scrollTimeout = false;
  setTimeout(() => {
    scrollTimeout = true;
  }, 30000);

  const updateScroll = () => {
    let el;
    if (
      (Dialog.scrolledSince(lastScroll) && !highlightedMoved) ||
      scrollTimeout
    ) {
      return;
    }

    if ((el = this.$('.mod-highlighted')[0]) != null) {
      const rect = el.getBoundingClientRect();

      // highlightedMoved flags whether the viewport top of the highlighted
      // element was changed between animation frames. If it's false and a
      // scroll occurred, stop looping because the user did the scroll.
      if (rect.top != prevHighlightedTop) {
        highlightedMoved = true;
      } else {
        highlightedMoved = false;
      }
      prevHighlightedTop = rect.top;

      if (!snapTo) {
        if (rect.top < 0) {
          snapTo = 'top';
        } else if (rect.top + rect.height > window.innerHeight) {
          snapTo = 'bottom';
        } else {
          snapTo = null;
        }
      }

      if (snapTo === 'top') {
        el.scrollIntoView(true);
      } else if (snapTo === 'bottom') {
        el.scrollIntoView(false);
      }

      lastScroll = Date.now();
    }

    this.scrollInterval = this.requestAnimationFrame(updateScroll);
  };

  updateScroll();
};
