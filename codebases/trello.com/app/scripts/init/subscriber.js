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
const { Auth } = require('app/scripts/db/auth');
const Backbone = require('@trello/backbone');
const { Board } = require('app/scripts/models/board');
const { Card } = require('app/scripts/models/card');
const { Controller } = require('app/scripts/controller');
const { Organization } = require('app/scripts/models/organization');
const { rpc } = require('app/scripts/network/rpc');
const _ = require('underscore');
const { alertSyncErrors } = require('app/scripts/network/alert-sync-errors');

const setEqual = (a, b) =>
  a.length === b.length && b.length === _.union(a, b).length;

class BoundedUniqueQueue {
  constructor(maxLength) {
    this.maxLength = maxLength;
    this.contents = [];
  }

  pushift(x) {
    this.contents = _.without(this.contents, x);
    this.contents.push(x);
    if (this.contents.length > this.maxLength) {
      return this.contents.shift();
    } else {
      return null;
    }
  }

  remove(x) {
    return (this.contents = _.without(this.contents, x));
  }

  map(f) {
    return this.contents.map(f);
  }
}

const getMySubscriptions = function () {
  if (Auth.isLoggedIn()) {
    return [
      {
        modelType: 'Member',
        idModel: Auth.myId(),
        tags: ['messages', 'updates'],
      },
    ];
  } else {
    return [];
  }
};

const getOrgSubscriptions = (org) => [
  {
    modelType: 'Organization',
    idModel: org.id,
    tags: ['allActions', 'updates'],
  },
];
const getBoardSubscriptions = function (board) {
  let org;
  return [
    {
      modelType: 'Board',
      idModel: board.id,
      tags: ['clientActions', 'updates'],
    },
  ].concat(
    (org = board.getOrganization()) != null ? getOrgSubscriptions(org) : [],
  );
};

const getCardSubscriptions = (card) => [
  {
    modelType: 'Board',
    idModel: card.get('idBoard'),
    tags: ['clientActions', 'updates'],
  },
];
class Subscriber {
  static initClass() {
    _.extend(this.prototype, Backbone.Events);
  }

  constructor() {
    this.boards = new BoundedUniqueQueue(5);
    this.orgs = new BoundedUniqueQueue(1);
    this.cards = new BoundedUniqueQueue(1);
    this.custom = new Set();
  }

  addModel(model) {
    this.waitForId(model, () => {
      if (model instanceof Board) {
        this.syncBoard(model);
      }
      if (model instanceof Organization) {
        this.syncOrg(model);
      }
      if (model instanceof Card) {
        this.syncCard(model);
      }

      return this.ensureSubscriptions();
    });
  }

  addCustom(entry) {
    this.custom.add(entry);
    this.ensureSubscriptions();

    return () => {
      this.custom.delete(entry);
      return this.ensureSubscriptions();
    };
  }

  removeModel(model) {
    if (model instanceof Board) {
      this.boards.remove(model);
    }
    if (model instanceof Organization) {
      this.orgs.remove(model);
    }
    if (model instanceof Card) {
      this.cards.remove(model);
    }

    return this.ensureSubscriptions();
  }

  syncBoard(board) {
    let evictedBoard;
    if ((evictedBoard = this.boards.pushift(board)) != null) {
      this.stopListening(evictedBoard);
    }

    this.listenTo(board, 'change:idOrganization', this.ensureSubscriptions);
    this.listenTo(board, 'destroy deleting', () => this.removeModel(board));
  }

  syncOrg(org) {
    this.orgs.pushift(org);
    this.listenTo(org, 'destroy', () => this.removeModel(org));
  }

  syncCard(card) {
    this.cards.pushift(card);

    this.listenTo(card, 'change:idBoard', this.ensureSubscriptions);
    return this.listenTo(card, 'destroy deleting', () =>
      this.removeModel(card),
    );
  }

  ensureSubscriptions() {
    let idModel, modelType, tags;
    const desiredSubscriptions = _.flatten([
      getMySubscriptions(),
      this.boards.map(getBoardSubscriptions),
      this.orgs.map(getOrgSubscriptions),
      this.cards.map(getCardSubscriptions),
      Array.from(this.custom),
    ]);

    const subscriptionMap = {};
    for ({ modelType, idModel, tags } of Array.from(desiredSubscriptions)) {
      if (subscriptionMap[idModel] == null) {
        subscriptionMap[idModel] = {
          tags: [],
          modelType,
        };
      }
      subscriptionMap[idModel].tags.push(...Array.from(tags || []));
      subscriptionMap[idModel].tags = _.uniq(subscriptionMap[idModel].tags);
    }

    // Unsubscribe from any models we don't care about anymore
    for (idModel in rpc.currentSubscriptions) {
      ({ modelType } = rpc.currentSubscriptions[idModel]);
      if (subscriptionMap[idModel] == null) {
        rpc.unsubscribe(modelType, idModel);
      }
    }

    // Unsubscribe from any models that we want to change tags on
    for (idModel in rpc.currentSubscriptions) {
      let subscribedTags;
      ({ tags: subscribedTags, modelType } = rpc.currentSubscriptions[idModel]);
      if (subscriptionMap[idModel] != null) {
        const desiredTags = subscriptionMap[idModel].tags;
        if (!setEqual(subscribedTags, desiredTags)) {
          rpc.unsubscribe(modelType, idModel);
        }
      }
    }

    // Subscribe to all models we aren't already subscribed to
    for (idModel in subscriptionMap) {
      ({ tags, modelType } = subscriptionMap[idModel]);
      if (rpc.currentSubscriptions[idModel] == null) {
        rpc.subscribe(modelType, idModel, tags);
      }
    }
  }
}
Subscriber.initClass();

const subscriber = new Subscriber();

Controller.currentModel.subscribe(function (model) {
  if (model != null) {
    subscriber.addModel(model);
  } else {
    subscriber.ensureSubscriptions();
  }
});

alertSyncErrors();

module.exports.addSubscription = (spec) => subscriber.addCustom(spec);
