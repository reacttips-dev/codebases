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
 * DS104: Avoid inline assignments
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const _ = require('underscore');
const { makeErrorEnum } = require('app/scripts/lib/make-error-enum');

const PluginModelSerializerError = makeErrorEnum('PluginModelSerializer', [
  'InvalidField',
]);

const readJSONFields = function (json, allowedFields, fields) {
  if (_.isEqual(['all'], _.values(fields))) {
    fields = allowedFields;
  }

  if (_.any(fields, (field) => !Array.from(allowedFields).includes(field))) {
    throw PluginModelSerializerError.InvalidField();
  }

  return _.pick(json, fields);
};

const readModelFields = function (model, allowedFields, fields, getters) {
  if (getters == null) {
    getters = {};
  }
  if (_.isEqual(['all'], _.values(fields))) {
    fields = allowedFields;
  }

  return _.chain(fields)
    .map(function (field) {
      if (!Array.from(allowedFields).includes(field)) {
        throw PluginModelSerializerError.InvalidField();
      }

      const value = getters[field]?.(model, field) ?? model.get(field);

      return [field, value];
    })
    .object()
    .value();
};

const serializePreview = function (preview, fields) {
  if (fields == null) {
    fields = ['bytes', 'height', 'scaled', 'url', 'width'];
  }
  return readJSONFields(
    preview,
    ['bytes', 'height', 'scaled', 'url', 'width'],
    fields,
  );
};

const serializePreviews = (previews, fields) =>
  previews.map(_.partial(serializePreview, _, fields));

const serializeAttachment = function (attachment, fields) {
  if (fields == null) {
    fields = ['all'];
  }
  const allowed = [
    'date',
    'edgeColor',
    'id',
    'idMember',
    'name',
    'previews',
    'url',
  ];
  return readModelFields(attachment, allowed, fields, {
    previews() {
      // We load the previews asynchronously, so we might not have them yet
      return serializePreviews(attachment.get('previews') ?? []);
    },
  });
};

const serializeAttachments = (attachments, fields) =>
  attachments.map(_.partial(serializeAttachment, _, fields));

const serializeBoard = function (board, fields) {
  if (fields == null) {
    fields = ['id', 'name'];
  }
  const allowed = [
    'customFields',
    'dateLastActivity',
    'id',
    'idOrganization',
    'labels',
    'members',
    'memberships',
    'name',
    'shortLink',
    'url',
    'paidStatus',
  ];
  return readModelFields(board, allowed, fields, {
    customFields() {
      // confirm custom fields Power-Up is enabled on board
      if (board.isCustomFieldsEnabled()) {
        return serializeCustomFields(board.customFieldList);
      } else {
        return [];
      }
    },
    labels() {
      return serializeLabels(board.labelList, ['all']);
    },
    members() {
      return serializeMembers(board.memberList, ['all']);
    },
    memberships() {
      return serializeMemberships(board.get('memberships'), ['all']);
    },
    paidStatus() {
      return board.getPaidStatus();
    },
  });
};

const serializeOrganization = function (organization, fields) {
  if (fields == null) {
    fields = ['id'];
  }
  return readModelFields(organization, ['id', 'name', 'paidStatus'], fields, {
    paidStatus() {
      return organization.getPaidStatus();
    },
  });
};

const serializeCard = function (card, fields) {
  if (fields == null) {
    fields = ['id', 'name'];
  }
  const allowed = [
    'address',
    'attachments',
    'badges',
    'closed',
    'coordinates',
    'cover',
    'customFieldItems',
    'dateLastActivity',
    'desc',
    'due',
    'dueComplete',
    'id',
    'idList',
    'idShort',
    'labels',
    'locationName',
    'members',
    'name',
    'pos',
    'shortLink',
    'staticMapUrl',
    'url',
  ];
  return readModelFields(card, allowed, fields, {
    attachments() {
      return serializeAttachments(card.attachmentList);
    },

    cover() {
      let idAttachmentCover;
      if ((idAttachmentCover = card.get('idAttachmentCover')) != null) {
        let cover;
        if ((cover = card.attachmentList.get(idAttachmentCover)) != null) {
          return serializeAttachment(cover);
        }
      }

      return null;
    },

    customFieldItems() {
      if (card.getBoard().isCustomFieldsEnabled()) {
        return serializeCustomFieldItems(card.customFieldItemList);
      } else {
        return [];
      }
    },

    labels() {
      return serializeLabels(card.labelList);
    },

    members() {
      return serializeMembers(card.memberList, ['all']);
    },
  });
};

const serializeCards = function (cards, fields) {
  // filter cards down to only those that have an ID
  // i.e. we want to ignore optimistically created cards that don't
  // exist for sure yet
  if (fields == null) {
    fields = ['id', 'name'];
  }
  return _.filter(cards, (card) => card.get('id') != null).map(
    _.partial(serializeCard, _, fields),
  );
};

const serializeCustomFieldOption = function (customFieldOption, fields) {
  if (fields == null) {
    fields = ['all'];
  }
  return readModelFields(
    customFieldOption,
    ['id', 'color', 'value', 'pos'],
    fields,
  );
};

const serializeCustomFieldOptions = function (customFieldOptions, fields) {
  if (fields == null) {
    fields = ['all'];
  }
  return customFieldOptions.map(
    _.partial(serializeCustomFieldOption, _, fields),
  );
};

const serializeCustomField = function (customField, fields) {
  if (fields == null) {
    fields = ['id', 'name', 'type'];
  }
  const allowed = ['id', 'fieldGroup', 'name', 'pos', 'type', 'display'];
  if (customField.isList()) {
    return readModelFields(customField, allowed.concat(['options']), fields, {
      options() {
        return serializeCustomFieldOptions(customField.optionList);
      },
    });
  } else {
    return readModelFields(customField, allowed, _.without(fields, 'options'));
  }
};

const serializeCustomFields = function (customFields, fields) {
  if (fields == null) {
    fields = ['all'];
  }
  return customFields.map(_.partial(serializeCustomField, _, fields));
};

const serializeCustomFieldItem = function (customFieldItem, fields) {
  if (fields == null) {
    fields = ['all'];
  }
  if (customFieldItem.getType() === 'list') {
    return readModelFields(
      customFieldItem,
      ['id', 'idCustomField', 'idValue'],
      _.without(fields, 'value'),
    );
  } else {
    return readModelFields(
      customFieldItem,
      ['id', 'idCustomField', 'value'],
      _.without(fields, 'idValue'),
    );
  }
};

const serializeCustomFieldItems = function (customFieldItems, fields) {
  if (fields == null) {
    fields = ['all'];
  }
  const nonEmptyItems = _.filter(customFieldItems.models, (i) => !i.isEmpty());
  return nonEmptyItems.map(_.partial(serializeCustomFieldItem, _, fields));
};

const serializeLabel = function (label, fields) {
  if (fields == null) {
    fields = ['id', 'name', 'color'];
  }
  return readModelFields(label, ['id', 'name', 'color'], fields);
};

const serializeLabels = (labels, fields) =>
  labels.map(_.partial(serializeLabel, _, fields));

const serializeList = function (list, fields) {
  if (fields == null) {
    fields = ['id', 'name'];
  }
  return readModelFields(list, ['id', 'name', 'cards'], fields, {
    cards() {
      return serializeCards(list.cardList.models, ['all']);
    },
  });
};

const serializeLists = function (lists, fields) {
  if (fields == null) {
    fields = ['id', 'name'];
  }
  return lists.map(_.partial(serializeList, _, fields));
};

const serializeMember = function (member, fields) {
  if (fields == null) {
    fields = ['id', 'fullName', 'username'];
  }
  return readModelFields(
    member,
    ['id', 'fullName', 'username', 'initials', 'avatar', 'paidStatus'],
    fields,
    {
      fullName() {
        return member.get('fullName', false);
      },

      initials() {
        return member.get('initials', false);
      },

      avatar() {
        const avatarUrl = member.get('avatarUrl', false);
        if (avatarUrl) {
          return [avatarUrl, '170.png'].join('/');
        }
        return null;
      },

      paidStatus() {
        return member.getMaxPaidStatus();
      },
    },
  );
};

const serializeMembers = (members, fields) =>
  members.map(_.partial(serializeMember, _, fields));

const serializeMembership = function (membership, fields) {
  if (fields == null) {
    fields = ['idMember', 'memberType'];
  }
  return readJSONFields(
    membership,
    ['deactivated', 'id', 'idMember', 'memberType', 'unconfirmed'],
    fields,
  );
};

const serializeMemberships = (memberships, fields) =>
  memberships.map(_.partial(serializeMembership, _, fields));

module.exports = {
  Error: PluginModelSerializerError,
  attachment: serializeAttachment,
  attachments: serializeAttachments,
  board: serializeBoard,
  card: serializeCard,
  cards: serializeCards,
  list: serializeList,
  lists: serializeLists,
  member: serializeMember,
  organization: serializeOrganization,
};
