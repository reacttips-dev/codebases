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
 * DS202: Simplify dynamic range loops
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const _ = require('underscore');
const { Auth } = require('app/scripts/db/auth');
const { Card } = require('app/scripts/models/card');
const { Board } = require('app/scripts/models/board');
const { List } = require('app/scripts/models/list');
const { Member } = require('app/scripts/models/member');
const Promise = require('bluebird');
const { makeErrorEnum } = require('app/scripts/lib/make-error-enum');
const { ModelCache } = require('app/scripts/db/model-cache');
const xtend = require('xtend');
const {
  currentModelManager,
} = require('app/scripts/controller/currentModelManager');

const PluginHandlerContextError = makeErrorEnum('PluginHandlerContext', [
  'InvalidType',
  'NotSerializable',
  'PluginDisabled',
]);

const elMap = {};

const isCurrentBoard = function (idBoard) {
  let board;
  return (
    (board = currentModelManager.getCurrentBoard()) != null &&
    board.id === idBoard
  );
};

const alphabet =
  '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWYXZ';

const randomId = function (length) {
  if (length == null) {
    length = 16;
  }
  const digits = [];
  for (
    let i = 0, end = length, asc = 0 <= end;
    asc ? i < end : i > end;
    asc ? i++ : i--
  ) {
    digits.push(alphabet[Math.floor(Math.random() * alphabet.length)]);
  }
  return digits.join('');
};

// We have to be able to convert a context object into something we can send
// over postMessage; there are a few special keys that contain complex objects
// that we know how to serialize
const converters = {
  card: {
    type: Card,
    serialize(card) {
      return { value: card.id };
    },
    deserialize(idCard) {
      const requestedCard = ModelCache.get('Card', idCard);
      if (
        requestedCard != null &&
        isCurrentBoard(requestedCard.get('idBoard'))
      ) {
        return requestedCard;
      } else {
        return null;
      }
    },
  },

  board: {
    type: Board,
    serialize(board) {
      return { value: board.id };
    },
    deserialize(idBoard) {
      if (isCurrentBoard(idBoard)) {
        return ModelCache.get('Board', idBoard);
      } else {
        return null;
      }
    },
  },

  list: {
    type: List,
    serialize(list) {
      return { value: list.id };
    },
    deserialize(idList) {
      const requestedList = ModelCache.get('List', idList);
      if (
        requestedList != null &&
        isCurrentBoard(requestedList.get('idBoard'))
      ) {
        return requestedList;
      } else {
        return null;
      }
    },
  },

  member: {
    type: Member,
    serialize(member) {
      return { value: member.id };
    },
    deserialize(idMember) {
      if (Auth.isMe(idMember)) {
        return ModelCache.get('Member', idMember);
      } else {
        return null;
      }
    },
  },

  el: {
    type: Element,
    serialize(element) {
      const ref = randomId();
      elMap[ref] = element;

      return {
        value: ref,
        disposer() {
          return delete elMap[ref];
        },
      };
    },
    deserialize(ref) {
      return elMap[ref];
    },
  },
};

const isSerializable = function (obj) {
  if (
    _.isString(obj) ||
    _.isNumber(obj) ||
    _.isBoolean(obj) ||
    _.isNull(obj) ||
    _.isUndefined(obj)
  ) {
    return true;
  } else if (_.isFunction(obj) || _.isRegExp(obj) || _.isDate(obj)) {
    return false;
  } else if (_.isArray(obj)) {
    return _.every(obj, isSerializable);
  } else if (_.isObject(obj)) {
    return isSerializable(_.values(obj));
  } else {
    return false;
  }
};

const serialize = function (context) {
  const disposers = [];

  return Promise.try(() =>
    _.mapObject(context, function (value, key) {
      let converter;
      if ((converter = converters[key]) != null) {
        if (!(value instanceof converter.type)) {
          if (value == null) {
            return null;
          }

          throw PluginHandlerContextError.InvalidType(
            'value in context did not have the expected type',
          );
        }

        const { value: serialized, disposer } = converter.serialize(value);
        if (disposer != null) {
          disposers.push(disposer);
        }
        return serialized;
      } else if (isSerializable(value)) {
        return value;
      } else {
        throw PluginHandlerContextError.NotSerializable(
          `the value for ${key} was not serializable`,
        );
      }
    }),
  ).disposer(function () {
    for (const disposer of Array.from(disposers)) {
      disposer();
    }
  });
};

const deserialize = function (serialized, idPlugin) {
  const deserialized = _.mapObject(serialized, function (value, key) {
    let converter;
    if (
      value != null &&
      converters.hasOwnProperty(key) &&
      (converter = converters[key]) != null
    ) {
      return converter.deserialize(value);
    } else {
      return value;
    }
  });

  if (
    !(
      deserialized.board || currentModelManager.getCurrentBoard()
    )?.isPluginEnabled(idPlugin) &&
    !currentModelManager.onAnyCardView()
  ) {
    throw PluginHandlerContextError.PluginDisabled(
      `plugin disabled on board idPlugin=${idPlugin}`,
    );
  }

  return deserialized;
};

const extend = (...contexts) => xtend(...Array.from(contexts || []));

module.exports = {
  Error: PluginHandlerContextError,
  serialize,
  deserialize,
  extend,
};
