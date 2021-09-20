/* eslint-disable
    eqeqeq,
*/
// TODO: This file was created by bulk-decaffeinate.
// Fix any style issues and re-enable lint.
/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const $ = require('jquery');
const Browser = require('@trello/browser');
const { getKey, Key } = require('@trello/keybindings');
const { Util } = require('app/scripts/lib/util');
const featureFlagClient = require('@trello/feature-flag-client')
  .featureFlagClient;

const removeSafariTabindexOverride = featureFlagClient.get(
  'teamplates.web.remove-safari-tabindex-override',
  false,
);

if (!removeSafariTabindexOverride) {
  // Safari doesn't respect tabindex for some elements unless you've enabled the
  // Preferences > Advanced > Press Tab to highlight each item on a webpage
  // This can cause behavior that we don't expect, so attempt to force safari to
  // behave like other browsers
  if (Browser.isSafari()) {
    $(document).on('keydown', function (e) {
      const key = getKey(e);
      if (key !== Key.Tab || e.metaKey || e.shiftKey || e.ctrlKey) {
        return;
      }

      const $target = $(e.target);

      if (!$target.attr('tabindex')) {
        return;
      }

      const initialIndex = parseInt($target.attr('tabindex'), 10);

      const $tabParent = $target.closest('body,.js-tab-parent');

      const $tabElements = $tabParent.find('[tabindex]');

      let $best = null;
      let $first = null;
      let bestIndex = Infinity;
      let firstIndex = Infinity;

      $tabElements.each(function () {
        const testIndex = parseInt($(this).attr('tabindex'), 10);
        if (initialIndex < testIndex && testIndex < bestIndex) {
          bestIndex = testIndex;
          $best = $(this);
        }

        if ($best == null && testIndex < firstIndex) {
          firstIndex = testIndex;
          return ($first = $(this));
        }
      });

      if ($best == null) {
        $best = $first;
      }

      if ($best != null) {
        Util.stop(e);
        $best.focus();
      }
    });
  }
}
