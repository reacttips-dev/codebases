/* eslint-disable
    eqeqeq,
    no-prototype-builtins,
*/
// TODO: This file was created by bulk-decaffeinate.
// Fix any style issues and re-enable lint.
/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS102: Remove unnecessary code created because of implicit returns
 * DS103: Rewrite code to no longer use __guard__
 * DS201: Simplify complex destructure assignments
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const _ = require('underscore');
const { Dates } = require('app/scripts/lib/dates');
const { makeVisitor, visit } = require('app/scripts/lib/babble');
const f = require('effing');
const { sendErrorEvent } = require('@trello/error-reporting');
const locale = require('locale');
const {
  isTrelloAttachment,
} = require('app/scripts/lib/util/url/is-trello-attachment');
const { isTrello } = require('app/scripts/lib/util/url/is-trello');
const { isUrl } = require('app/scripts/lib/util/url/is-url');
const { siteDomain } = require('@trello/config');

const makeTextEntity = function (text, idContext, hideIfContext) {
  if (hideIfContext == null) {
    hideIfContext = false;
  }
  return { type: 'text', text, hideIfContext, idContext };
};

const entityListVisitor = makeVisitor(
  makeTextEntity,
  (key, display) => display.entities[key],
);

const stringVisitor = makeVisitor(f.id, function (key, subs) {
  if (subs.hasOwnProperty(key)) {
    return subs[key];
  } else {
    sendErrorEvent(new Error(`substitution key ${key} not found!`));
    return '';
  }
});

const makeEntityFriendly = function (entity) {
  if (!entity.url && (entity.urlContext || isUrl(entity.text))) {
    entity.url = entity.urlContext || entity.text;
    entity.isFriendly = true;

    if (entity.type === 'text') {
      entity.type = 'attachment';
    }
  }

  if (entity.url != null) {
    entity.isTrelloAttachment = isTrelloAttachment(entity.url);
    entity.isTrello = isTrello(entity.url);
  }

  return entity;
};

// Common info our views expect to be part of 'display'
const withAdditionalInfo = function (entityIn) {
  const entity = _.clone(entityIn);
  // There's no proper library for getting short links right now, and we would
  // prefer not to refer to controller here. This should be fixed as soon as
  // we have a shortlink lib.
  switch (entity.type) {
    case 'card':
      entity.url = `${siteDomain}/c/${entity.shortLink ?? entity.id}`;
      break;
    case 'board':
      entity.url = `${siteDomain}/b/${entity.shortLink ?? entity.id}`;
      break;
    case 'organization':
      entity.url = `${siteDomain}/${entity.name ?? entity.id}`;
      break;
    case 'enterprise':
      entity.url = `${siteDomain}/e/${entity.name ?? entity.id}/admin/teams`;
      break;
    case 'attachment':
      makeEntityFriendly(entity);
      break;
    case 'text':
      makeEntityFriendly(entity);
      break;
    default:
      break;
  }

  return entity;
};

const applyTo = (type, fn) =>
  function (entity) {
    if (entity.type === type) {
      return fn(entity);
    } else {
      return entity;
    }
  };

const addUrlContext = function (entities, urlContext) {
  _.each(entities, function (entity) {
    if (entity.type === 'text' && !entity.idContext && urlContext) {
      return (entity.urlContext = urlContext);
    }
  });

  return entities;
};

module.exports.EntityDisplay = class EntityDisplay {
  constructor(type) {
    this.type = type;
    this.visit = f(visit, locale);
  }

  translationKeys(display, idContext) {
    // FIX ME: this hack for changing the string key
    // for removing due date on a card. Normally this would be
    // provided by the server, so once this is fixed serverside,
    // we should remove this condition
    // cache the variable here to 'break' the reference to the original object.
    let { translationKey } = display;
    if (
      translationKey === 'notification_changed_due_date' &&
      display.entities.card?.due === null &&
      this.type === 'notificationsGrouped'
    ) {
      translationKey = 'notification_removed_due_date';
    }
    // We also manually provide a date entity for use in the string keys
    if (
      [
        'notification_changed_due_date',
        'notification_added_a_due_date',
      ].includes(translationKey)
    ) {
      display.entities.date = {
        type: 'date',
        text: Dates.getDateDeltaString(display.entities.card.due, new Date()),
        date: display.entities.card.due,
      };
    }

    const nonContextKeys = [translationKey];
    if (idContext == null) {
      return nonContextKeys;
    }

    const matchingPair = _.find(_.pairs(display.entities), function (...args) {
      const [, entity] = Array.from(args[0]);
      return entity.id === idContext;
    });

    if (matchingPair != null) {
      const matchingType = matchingPair[0];
      return [
        [translationKey, matchingType].join('@'),
        ...Array.from(nonContextKeys),
      ];
    } else {
      return nonContextKeys;
    }
  }

  // Converts a 'display' object to a localized list of 'entity' objects
  getEntities(display, idContext) {
    if (display.translationKey === 'unknown') {
      return [];
    }

    const urlContext = _.find(display.entities, ({ type }) =>
      ['attachment', 'attachmentPreview'].includes(type),
    )?.originalUrl;

    const entityList = _.chain(this.translationKeys(display, idContext))
      .map((key) =>
        this.visit(
          `${
            this.type === 'action' || this.type === 'notification'
              ? this.type + 's'
              : this.type
          }.${key}`,
          entityListVisitor,
          display,
        ),
      )
      .compact()
      .first()
      .tap((entities) => addUrlContext(entities, urlContext))
      .value();

    if (entityList == null) {
      sendErrorEvent(
        new Error(`display key '${display.translationKey}' not found!`),
      );
      return [];
    }

    return entityList
      .map(applyTo('translatable', this._textFromTranslatable.bind(this)))
      .map(applyTo('relDate', this._localizedRelDate.bind(this)))
      .map(withAdditionalInfo);
  }

  _format(key, subs) {
    if (subs == null) {
      subs = {};
    }
    return this.visit(
      `${
        this.type === 'action' || this.type === 'notification'
          ? this.type + 's'
          : this.type
      }.${key}`,
      stringVisitor,
      subs,
    ).join('');
  }

  // Takes a translatable and returns its translation in this context
  _textFromTranslatable(entity) {
    const text = this._format(entity.translationKey);
    return makeTextEntity(text, entity.idContext, entity.hideIfContext);
  }

  // Replaces entity.current from the server with a localized version
  _localizedRelDate(entity) {
    return _.defaults({ current: this.relDateText(entity.date) }, entity);
  }

  // Generate the localized message for a relDate entity
  // Exposed so that the client can update relative dates as time progresses
  relDateText(dateStr, now) {
    if (now == null) {
      now = new Date();
    }
    const date = new Date(dateStr);
    const period = Dates.getDateDeltaString(date, now);
    const relDateKey =
      date > now ? 'notification_is_due' : 'notification_was_due';
    return this._format(relDateKey, { period });
  }
};
