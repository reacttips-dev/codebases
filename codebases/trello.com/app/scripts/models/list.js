/* eslint-disable
    eqeqeq,
*/
// TODO: This file was created by bulk-decaffeinate.
// Fix any style issues and re-enable lint.
/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS102: Remove unnecessary code created because of implicit returns
 * DS104: Avoid inline assignments
 * DS206: Consider reworking classes to avoid initClass
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const { ArchivableMixin } = require('app/scripts/lib/archivable-mixin');
const { LimitMixin } = require('app/scripts/lib/limit-mixin');
const TrelloModel = require('app/scripts/models/internal/trello-model');
const { Util } = require('app/scripts/lib/util');
const { containsUrl } = require('app/scripts/lib/util/url/contains-url');
const { truncate } = require('@trello/strings');
const {
  fileUploadOptions,
} = require('app/scripts/network/jquery-file-upload-options');
const xtend = require('xtend');
const _ = require('underscore');

class List extends TrelloModel {
  static initClass() {
    this.prototype.typeName = 'List';
    this.prototype.urlRoot = '/1/lists';

    this.lazy({
      cardList() {
        // Dependency required at call site to avoid import cycles, do not lift to top of module
        const {
          CardList,
        } = require('app/scripts/models/collections/card-list');
        return new CardList(null, { list: this })
          .setOwner(this)
          .syncCache(this.modelCache, ['idList', 'closed'], (card) => {
            return this.id && card.get('idList') === this.id && card.isOpen();
          });
      },
    });
  }

  sync(method, model, options) {
    if (method === 'create' && this.get('idBoard') == null) {
      this.waitForAttrs(this, ['idBoard'], (attrs) => {
        this.set(attrs);
        List.prototype.__proto__.sync.call(this, method, model, options);
      });

      return this.waitForId(this.getBoard(), (id) => this.set('idBoard', id));
    } else {
      return super.sync(...arguments);
    }
  }

  subscribe(subscribed, next) {
    if (subscribed === this.get('subscribed')) {
      return;
    }
    this.update({ subscribed }, next);
  }

  move(index) {
    this.update({ pos: this.getBoard().calcPos(index, this) });
    this.collection.sort({ silent: true });
  }

  close() {
    this.update({ closed: true });
  }

  reopen() {
    this.update({
      closed: false,
      pos: this.getBoard().calcPos(this.collection.length, this),
    });
  }

  onChange() {}

  calcPos(index, card, includeCard) {
    return Util.calcPos(index, this.cardList, card, null, includeCard);
  }

  bottomCardPos() {
    // The cards are sorted by pos, so the next pos is the one right after
    let lastCard;
    if ((lastCard = this.cardList.last()) != null) {
      return lastCard.get('pos') + Util.spacing;
    } else {
      return Util.spacing;
    }
  }

  getBoard() {
    let left;
    return (left = this.modelCache.get('Board', this.get('idBoard'))) != null
      ? left
      : this.collection != null
      ? this.collection.owner
      : undefined;
  }

  selectCardInList(index) {
    const selectCard = this.openCards().at(index);

    if (selectCard != null) {
      this.getBoard().viewState.selectCard(selectCard);
    }
  }

  selectFirstCardInList() {
    return this.selectCardInList(0);
  }

  editable() {
    return this.getBoard().editable();
  }

  isTemplate() {
    return this.getBoard().isTemplate();
  }

  getIndexInList() {
    return _.indexOf(this.getBoard().listList.models, this);
  }

  hasCapacity(item) {
    const list =
      typeof item.getList === 'function' ? item.getList() : undefined;
    if (list != null) {
      return (
        !list.isOverLimit('cards', 'openPerList') &&
        !list.isOverLimit('cards', 'totalPerList') &&
        (typeof item.getBoard === 'function'
          ? item.getBoard().hasCapacity(item)
          : undefined)
      );
    }
    return false;
  }

  openCards() {
    return this.cardList;
  }

  uploadUrl(url, cardData, placeholderText, traceId, next) {
    // Because we have no idea what to call the card that we're creating, but
    // there's a good chance that the server will be able to get a name based
    // on what's at the URL, we're going to have the local card model called
    // something like "Loading from imdb.com…" and then get a better name back
    // from the server
    //
    // We have to specify the local attributes separately from what we send to
    // the server, so we can have a temporary name for the card without sending
    // it to the server
    if (next == null) {
      next = function () {};
    }

    return this.cardList.createWithTracing(
      xtend(
        {
          name: placeholderText,
          pos: this.bottomCardPos(),
        },
        cardData,
      ),
      {
        traceId,
        createData: {
          urlSource: url,
          // explicitly include the name here, even if it's undefined, so we
          // override whatever is being used as a placeholder
          name: cardData != null ? cardData.name : undefined,
        },
      },
      next,
    );
  }

  // Given some arbitrary text, convert it to a name (and possible description)
  _processText(text) {
    // Get an appropriate name/description for an arbitrary blob of text
    let desc, name;
    if (/[\r\n]/.test(text)) {
      // If the text contains a newline, then use the first line as the name
      const [, firstLine] = Array.from(
        new RegExp(`\
^\
\\s*\
([^\\r\\n]+)\
`).exec(text),
      );

      name = truncate(firstLine, 256);
      desc = text;
    } else {
      name = truncate(text, 256);
      // If the name got clipped or contains a URL (which wouldn't be clickable)
      // then also put the text into the description
      if (name !== text || containsUrl(text)) {
        desc = text;
      } else {
        desc = '';
      }
    }

    return { name, desc };
  }

  uploadText(text, traceId, next) {
    if (next == null) {
      next = function () {};
    }
    if (!text) {
      return next();
    }

    const { name, desc } = this._processText(text);

    return this.cardList.createWithTracing(
      {
        name,
        desc,
        pos: this.bottomCardPos(),
      },
      { traceId },
      next,
    );
  }

  upload(file, name, traceId, next) {
    if (next == null) {
      next = function () {};
    }
    const localData = {
      name,
      idList: this.id,
      pos: this.bottomCardPos(),
    };

    const fileOptions = fileUploadOptions(
      _.extend({}, localData, { fileSource: [file, name] }),
    );

    const options = _.assign(fileOptions, { traceId });

    return this.cardList.createWithTracing(localData, options, next);
  }

  setSoftLimit(softLimit) {
    this.update({ softLimit });
  }
}
List.initClass();

_.extend(List.prototype, ArchivableMixin, LimitMixin);

module.exports.List = List;
