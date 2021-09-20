/* eslint-disable
    eqeqeq,
    */
// TODO: This file was created by bulk-decaffeinate.
// Fix any style issues and re-enable lint.
/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS102: Remove unnecessary code created because of implicit returns
 * DS206: Consider reworking classes to avoid initClass
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const $ = require('jquery');
const Browser = require('@trello/browser');
const CardView = require('app/scripts/views/card/card-view');
const CollectionView = require('app/scripts/views/internal/collection-view');
const DragSort = require('app/scripts/views/lib/drag-sort');
const PostRender = require('app/scripts/views/lib/post-render');
const View = require('app/scripts/views/internal/view');
const _ = require('underscore');
const { chunkArray } = require('./chunkArray');
const { featureFlagClient } = require('@trello/feature-flag-client');

// I know, I know. IE masks it's user agent and this is as close as we get.
// We’re “jostling” the board to trigger a redraw which will ensure
// .list-cards is correctly sized. It will otherwise overflow the list.
// We need to do this after the cards are rendered.
const jostle =
  !['chrome', 'firefox', 'opera'].includes(Browser.browserStr) &&
  Browser.osStr === 'windows'
    ? _.debounce(() =>
        PostRender.enqueue('jostleBoard', function () {
          $('#board').css('bottom', 1);
          return _.defer(() => $('#board').css('bottom', 0));
        }),
      )
    : function () {};

class CardListView extends CollectionView {
  static initClass() {
    this.prototype.viewType = CardView;
  }

  getModels() {
    return this.collection.models;
  }

  constructor() {
    super(...arguments);

    this.debouncedRefreshIfInitialized = this.debounce(
      this.refreshIfInitialized,
      10,
    );
  }

  initialize() {
    super.initialize(...arguments);

    if (featureFlagClient.get('fep.check-card-idboards', false)) {
      this.listenTo(this.collection, 'change:idBoard', (card, idBoard) => {
        if (idBoard !== this.collection.list.get('idBoard')) {
          // The card (or possibly the list the card is on) is being moved
          // to another board.  We don't want to render the card in this
          // view anymore (it shouldn't be displayed on whatever list we're
          // rendering, and if we try to render it it'll have errors if
          // we haven't loaded the new board, e.g. if the new board is one
          // we can't see)
          this.removeModel(card);
        }
      });
    }
  }

  removeModel(model, options) {
    if (featureFlagClient.get('fep.check-card-idboards', false)) {
      // We may have pre-emptively removed the card from this view
      // when we saw that it moved to another board, in which case
      // we don't need to worry about removing it again
      if (!this.existingSubviewOrUndefined(this.viewType, model)) {
        return;
      }
    }

    return super.removeModel(...arguments);
  }

  render() {
    if (this.options.deferCards) {
      // If our whole list is not initial visible, wait to render any of
      // these cards
      this.whenIdle(`deferredCardList_${this.cid}`, () => {
        return this.progressiveRender();
      });
    } else {
      this.progressiveRender();
    }

    return this;
  }

  progressiveRender() {
    const allModels = this.getModels();

    const append = (models) => {
      return this.appendSubviews(
        Array.from(models).map((model) => this.subview(this.viewType, model)),
      );
    };

    const maxVisibleCards = Math.max(10, Math.ceil(window.innerHeight / 32)); // Hard-coded minimum card height
    const visible = _.first(allModels, maxVisibleCards);
    append(visible);

    const chunks = chunkArray(
      _.rest(allModels, maxVisibleCards),
      maxVisibleCards,
    );
    return chunks.forEach((chunked, index) => {
      return this.whenIdle(
        `deferredHiddenCards_${this.cid}_chunk${index}`,
        () => {
          append(chunked);
          return jostle();
        },
      );
    });
  }

  insertSubview(subview, target, $el) {
    if ($el == null) {
      ({ $el } = this);
    }
    // Turn target from an index or a view into an element
    if (typeof target === 'number') {
      if (target <= 0) {
        target = $el.children().eq(0);
      } else if (target < $el.children().length) {
        target = $el.children().eq(target);
      } else {
        target = undefined;
      }
    } else if (target instanceof View) {
      target = target.$el;
    }

    const card = subview.model;

    if (subview.$el.is(':empty')) {
      // If the subview is empty then it needs to be rendered.
      subview.delegateEvents();
      subview.render();
    } else if (
      !$el.hasClass('hide') &&
      !card.getBoard().filter.satisfiesFilter(card)
    ) {
      // If the subview is rendered but meant to be filtered, then call renderFiltered()
      subview.renderFiltered();
    }

    if ((target != null ? target.length : undefined) > 0) {
      subview.$el.insertBefore(target);
    } else {
      $el.append(subview.$el);
    }

    return this.debouncedRefreshIfInitialized();
  }

  refreshIfInitialized() {
    return DragSort.refreshIfInitialized(this.$el);
  }

  scrollToCardView(card) {
    const cardSubview = this.viewForModel(card);
    if (cardSubview) {
      const cardSubviewElement = cardSubview.$el[0];
      return this.$el.scrollTop(
        cardSubviewElement.offsetTop + cardSubviewElement.offsetHeight,
      );
    }
  }
}
CardListView.initClass();

module.exports = CardListView;
