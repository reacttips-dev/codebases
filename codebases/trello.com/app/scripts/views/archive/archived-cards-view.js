/* eslint-disable
    eqeqeq,
*/
// TODO: This file was created by bulk-decaffeinate.
// Fix any style issues and re-enable lint.
/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS102: Remove unnecessary code created because of implicit returns
 * DS103: Rewrite code to no longer use __guard__
 * DS104: Avoid inline assignments
 * DS206: Consider reworking classes to avoid initClass
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const { Analytics } = require('@trello/atlassian-analytics');
const ArchivedCardView = require('app/scripts/views/archive/archived-card-view');
const SearchHelpView = require('app/scripts/views/archive/search-help-view');
const { Dates } = require('app/scripts/lib/dates');
const { featureFlagClient } = require('@trello/feature-flag-client');
const { ModelLoader } = require('app/scripts/db/model-loader');
const View = require('app/scripts/views/internal/view');
const _ = require('underscore');
const { l } = require('app/scripts/lib/localize');
const f = require('effing');
const { Util } = require('app/scripts/lib/util');
const { PopOver } = require('app/scripts/views/lib/pop-over');
const React = require('react');
const { renderComponent } = require('app/src/components/ComponentWrapper');
const { ArchivedCards } = require('app/scripts/views/templates/ArchivedCards');

let magicInitialValue = undefined;
let managed = undefined;

function __guardMethod__(obj, methodName, transform) {
  if (
    typeof obj !== 'undefined' &&
    obj !== null &&
    typeof obj[methodName] === 'function'
  ) {
    return transform(obj, methodName);
  } else {
    return undefined;
  }
}

class ArchivedCardsView extends View {
  static initClass() {
    this.prototype.CARDS_PER_PAGE = 30;
    this.prototype.SEARCH_LIMIT = 50;

    // Here's the big idea:

    // A "managed function" can't be invoked directly. It can only be "leased."

    // It can be leased multiple times, but every time you lease a function
    // you invalidate the previously leased function.

    // This prevents the case where we fire off two searches, the second one
    // completes first, then the first one completes and overwrites the result
    // of the second one (which is the only one we care about).

    // The *right* way to do this would be to make the modelLoader return
    // a cancelable promise, so that this isn't necessary. That's out of
    // the scope of this work, though, so we'll do this until that's ready.

    // This might move into effing.js, but honestly this is such an antipattern...
    magicInitialValue = {};
    managed = function (baseFunction) {
      let latestLeasedFunction = magicInitialValue;
      return {
        lease() {
          const leasedFunction = function () {
            if (
              latestLeasedFunction === magicInitialValue ||
              leasedFunction === latestLeasedFunction
            ) {
              baseFunction.apply(this, arguments);
            }
          };
          latestLeasedFunction = leasedFunction;
          return leasedFunction;
        },
      };
    };

    this.prototype.events = {
      'click .js-more-cards': 'getMoreCards',
      'click .js-show-search-tips': 'showSearchTips',
    };

    this.prototype.vigor = this.VIGOR.SOME;
  }

  initialize({ searchText }) {
    this.searchText = searchText;
    this.isLoadingInitialCards = this.slot(false);
    this.isLoadingMoreCards = this.slot(false);
    this.isLoadingSearchResults = this.slot(false);
    this.tooManySearchResults = this.slot(false);

    this.isLoading = this.using(
      this.isLoadingInitialCards.or(this.isLoadingSearchResults),
    );

    this.isSearching = this.using(
      this.searchText.map((text) => text.length > 0).distinct(),
    );
    this.hasMoreCards = this.slot(false);
    this.searchResults = this.slot([]);
    this.sortedContiguousCards = this.slot([]);

    this.sendGASEvent = featureFlagClient.get(
      'dataeng.gasv3-event-tracking',
      false,
    );

    this.updateSearchCallback = managed((cardBlobs) => {
      const cards = cardBlobs.map((cardData) => {
        return this.modelCache.get('Card', cardData.id);
      });

      this.tooManySearchResults.set(cards.length === this.SEARCH_LIMIT);
      this.searchResults.set(cards);
      return this.isLoadingSearchResults.set(false);
    });

    const pullCard = (card) => {
      this.sortedContiguousCards.set(
        _.without(this.sortedContiguousCards.get(), card),
      );
      return this.searchResults.set(_.without(this.searchResults.get(), card));
    };

    this.listenTo(this.modelCache, {
      'remove:Card': pullCard,
      'change:Card:closed': (card) => {
        if (card.get('idBoard') !== this.model.id) {
          return;
        }
        if (card.get('closed')) {
          // because it just changed, it must be newer than everything else...
          this.sortedContiguousCards.set([
            card,
            ...Array.from(this.sortedContiguousCards.get()),
          ]);
        } else {
          pullCard(card);
        }
      },
    });

    return (this.cards = this.using(
      this.isSearching.if(this.searchResults, this.sortedContiguousCards),
    ));
  }
  didBecomeActive() {
    if (this.hasBeenActiveBefore) {
      return;
    }
    this.hasBeenActiveBefore = true;
    const query = { limit: this.CARDS_PER_PAGE };

    this.isLoadingInitialCards.set(true);
    return ModelLoader.loadClosedCards(this.model.id, query)
      .tap(f(this, 'didLoadContiguousCards'))
      .finally(() => {
        return this.isLoadingInitialCards.set(false);
      })
      .done();
  }

  didLoadContiguousCards(cards) {
    this.hasMoreCards.set(cards.length === this.CARDS_PER_PAGE);
    const sortedCards = _.sortBy(cards, (card) => -this.cardSortRank(card));
    const result = [
      ...Array.from(this.sortedContiguousCards.get()),
      ...Array.from(sortedCards),
    ];
    // If the results were actually contiguous or deterministic
    // or anything, the `uniq` call wouldn't be necessary. But.
    return this.sortedContiguousCards.set(_.uniq(result));
  }

  cardSortRank(card) {
    let left;
    return (left = __guardMethod__(
      Dates.parse(card.get('dateLastActivity')),
      'getTime',
      (o) => o.getTime(),
    )) != null
      ? left
      : null;
  }

  getMoreCards() {
    // Although the load more button only appears initially if there are some
    // cards -- at least @CARDS_PER_PAGE, to be precise -- it's possible that
    // the user has *unarchived all of them* and then pressed the load more
    // cards button, so we have to guard against this.
    const lastCard = _.last(this.sortedContiguousCards.get());
    const query = {
      limit: this.CARDS_PER_PAGE,
      before: lastCard != null ? this.cardSortRank(lastCard) : null,
    };

    this.isLoadingMoreCards.set(true);
    return ModelLoader.loadClosedCards(this.model.id, query)
      .tap(f(this, 'didLoadContiguousCards'))
      .finally(() => {
        return this.isLoadingMoreCards.set(false);
      })
      .done();
  }

  removeSubviews(subview) {
    this.unmountArchivedCards && this.unmountArchivedCards();
    return super.removeSubviews(subview);
  }

  remove() {
    this.unmountArchivedCards && this.unmountArchivedCards();
    return super.remove(...arguments);
  }

  renderOnce() {
    if (this.unmountArchivedCards) {
      this.unmountArchivedCards();
    }
    this.unmountArchivedCards = renderComponent(<ArchivedCards />, this.$el[0]);

    this.watch('isLoadingMoreCards', function (isLoadingMore) {
      return this.$('.js-more-cards').attr('disabled', isLoadingMore);
    });

    const showLoadMoreButton = this.hasMoreCards.and(this.isSearching.not());
    this.subscribe(showLoadMoreButton, function (newValue) {
      return this.$('.js-more-cards').toggleClass('hide', !newValue);
    });

    this.$('.js-search-message').html(
      l(
        'too many results',
        {
          limit: `<strong>${this.SEARCH_LIMIT.toString()}+</strong>`,
          learnMoreLink: `<a class="js-show-search-tips" href="#">${l(
            'learn more',
          )}</a>`,
        },
        {
          raw: true,
        },
      ),
    );
    const showSearchMessage = this.tooManySearchResults;
    this.subscribe(showSearchMessage, function (newValue) {
      return this.$('.js-search-message').toggleClass('hide', !newValue);
    });

    this.watch('isSearching', function (isSearching) {
      const key = isSearching ? 'no results' : 'no archived cards';
      return this.$('.js-empty-message').text(l(key));
    });

    this.watch('cards', function (cards) {
      return this.$('.js-empty-message').toggleClass('hide', cards.length > 0);
    });

    this.watch('isLoadingSearchResults', function (isLoadingSearchResults) {
      return this.$('.js-search-loading').toggleClass(
        'hide',
        !isLoadingSearchResults,
      );
    });

    const debouncedSearch = this.debounce(this.loadSearchResults, 400);
    this.subscribe(
      this.searchText.filter((text) => text.length > 0),
      function () {
        this.isLoadingSearchResults.set(true);
        return debouncedSearch.call(this);
      },
    );
    return this.subscribe(this.cards, this.frameDebounce(this.renderCards));
  }

  loadSearchResults() {
    const query = {
      query: `is:archived ${this.searchText.get()}`,
      modelTypes: 'cards',
      idBoards: this.model.id,
      card_stickers: true,
      card_attachments: 'cover',
      partial: true,
      cards_limit: this.SEARCH_LIMIT,
    };

    return ModelLoader.loadSearchData(query)
      .get('cards')
      .then(this.updateSearchCallback.lease())
      .done();
  }

  renderCards() {
    const $archivedItems = this.$('.js-archive-items');

    $archivedItems.children().detach();

    const itemSubviews = Array.from(this.cards.get()).map((card) =>
      this.subview(ArchivedCardView, card, {
        reOpenText: l('unarchive card'),
        canDelete: true,
      }),
    );

    this.appendSubviews(itemSubviews, $archivedItems);
  }

  showSearchTips(e) {
    Util.stop(e);

    Analytics.sendClickedLinkEvent({
      linkName: 'showSearchTipsLink',
      source: 'archiveScreen',
      containers: {
        board: {
          id: this.model.id,
        },
      },
    });

    PopOver.toggle({
      elem: e.target,
      view: SearchHelpView,
    });
  }
}

ArchivedCardsView.initClass();
module.exports = ArchivedCardsView;
