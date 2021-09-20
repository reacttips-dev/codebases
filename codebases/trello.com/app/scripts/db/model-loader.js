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
 * DS201: Simplify complex destructure assignments
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
let ModelLoader;
const { QuickLoad } = require('app/scripts/network/quickload');
const { idCache } = require('@trello/shortlinks');
const { ModelCache } = require('app/scripts/db/model-cache');
const Payloads = require('app/scripts/network/payloads').default;
const PostRender = require('app/scripts/views/lib/post-render');
const Promise = require('bluebird');
const { rpc } = require('app/scripts/network/rpc');
const { Time } = require('app/scripts/lib/time');
const { Util } = require('app/scripts/lib/util');
const _ = require('underscore');
const moment = require('moment');
const xtend = require('xtend');
const { ninvoke } = require('app/scripts/lib/util/ninvoke');
const assert = require('app/scripts/lib/assert');
const { ApiError } = require('app/scripts/network/api-error');
const { ModelName } = require('./ModelName');

const extendQuery = ({ query, mappingRules }, moreQuery) => ({
  query: xtend(query, moreQuery),
  mappingRules,
});
const preloadUncalledSentinel = {};
const REPLAY_CONCURRENCY = 5;

const quickload = function (url) {
  let preload = preloadUncalledSentinel;
  return Promise.fromNode((next) => (preload = QuickLoad.load(url, next)))
    .catch(function (...args) {
      const [statusCode, responseText] = Array.from(args[0]);
      return Promise.reject(ApiError.fromResponse(statusCode, responseText));
    })
    .tap(() =>
      assert(
        preload !== preloadUncalledSentinel,
        "Promises resolved synchronously; didn't get preload information from QuickLoad",
      ),
    )
    .spread((data, xhr) => [data, xhr, preload]);
};

const updateServerTime = function (xhr) {
  let serverTime;
  if ((serverTime = xhr.getResponseHeader('X-Server-Time')) != null) {
    Time.updateServerTime(parseInt(serverTime, 10));
  }
};

// Since we do the board data loads all the time, use this to prevent some of
// the loads from happening if the board looks like it is already up to date
const whenBoardNotUpToDate = (fx) => (id) =>
  Promise.try(function () {
    let left;
    return (left = ModelLoader.getUpToDateBoard(id)) != null
      ? left
      : fx.call(ModelLoader, id);
  });

const _waitComplete = {};
const _waitCallbacks = {};

function __guard__(value, transform) {
  return typeof value !== 'undefined' && value !== null
    ? transform(value)
    : undefined;
}

module.exports.ModelLoader = window.ModelLoader = ModelLoader = {
  _history: [],
  _replaying: false,
  _loadApiData(modelType, id, payload, ...rest) {
    // eslint-disable-next-line prefer-const
    let [path, metadataHeaderName, isHeaderLoad] = Array.from(
      rest.slice(0, rest.length - 0),
    );
    let { query } = payload;
    const mappingRules =
      payload.mappingRules != null ? payload.mappingRules : {};
    // If we gave a class like Board, convert that to "Board"
    if (!_.isString(modelType)) {
      modelType = modelType.prototype.typeName;
    }
    if (typeof path === 'undefined' || path === null) {
      path = `${Util.pluralize(modelType)}/${id}`;
    }

    const invitationTokens = Util.invitationTokens().join(',');
    if (!_.isEmpty(invitationTokens)) {
      // Note that this has to match the behavior of quickload; where
      // invitationTokens is added as the last thing
      query = _.extend({}, query, { invitationTokens });
    }

    const url = QuickLoad.makeUrl(`/1/${path}`, query);

    return quickload(url)
      .spread(function (data, xhr, preload) {
        updateServerTime(xhr);

        return [data, xhr];
      })
      .tap(function () {
        // We skip this logic when we're running GraphiQL because the header is never loaded in that context.
        if (isHeaderLoad) {
          return;
        } else {
          return new Promise(function (resolve) {
            return ModelLoader.waitFor('headerData', resolve);
          });
        }
      })
      .spread(function (data, xhr) {
        // If we're still waiting on a render, see if we can split this data into
        // a high and low priority pieces
        if (PostRender.holding && payload.splitDeferred) {
          let deferred;
          ({ data, deferred } = payload.splitDeferred(data, ModelCache));

          if (deferred) {
            PostRender.enqueue(() =>
              ninvoke(
                ModelCache,
                'enqueueDelta',
                modelType,
                deferred,
                mappingRules,
                query,
              ),
            );
          }
        }

        return Promise.try(function () {
          if (data) {
            return ninvoke(
              ModelCache,
              'enqueueDelta',
              modelType,
              data,
              mappingRules,
              query,
            );
          } else {
            return [];
          }
        }).then(function (models) {
          if (!metadataHeaderName) {
            return models;
          }
          const metadata = window.JSON.parse(
            xhr.getResponseHeader(metadataHeaderName),
          );
          return [models, metadata];
        });
      });
  },

  getUpToDateBoard(idBoardOrShortLink) {
    if (this.isReplaying()) {
      return null;
    }

    const idBoard = idCache.getBoardId(idBoardOrShortLink);
    if (idBoard == null) {
      return null;
    }

    const board = ModelCache.get('Board', idBoard);
    if (board == null) {
      return null;
    }

    const lastUpdateChannel = rpc.getIxLastUpdate(board.id);
    if (lastUpdateChannel != null) {
      return board;
    } else {
      return null;
    }
  },

  isReplaying() {
    return this._replaying;
  },

  replay() {
    this._replaying = true;
    const marker = ModelCache.mark();

    return Promise.map(
      this._history,
      ({ owner, loadName, args }) => {
        return this[loadName](...Array.from(args || []));
      },
      { concurrency: REPLAY_CONCURRENCY },
    )
      .then(() => ModelCache.sweep(marker))
      .finally(() => {
        return (this._replaying = false);
      })
      .return();
  },

  record(owner, loadName, ...args) {
    if (owner != null) {
      return this._history.push({ owner, loadName, args });
    } else {
      throw Error(`Unclaimed ${loadName}`);
    }
  },

  for(owner, loadName, ...args) {
    this.record(owner, loadName, ...Array.from(args));
    return this[loadName](...Array.from(args || []));
  },

  release(owner) {
    this._history = _.reject(this._history, (entry) => entry.owner === owner);
  },

  loadHeaderData() {
    return this._loadApiData(
      ModelName.MEMBER,
      'me',
      Payloads.memberHeader,
      undefined,
      undefined,
      true,
    ).then((delta) => ['Member', delta, Payloads.memberHeader.mappingRules]);
  },

  loadBoardsMenuData() {
    return this._loadApiData(
      ModelName.MEMBER,
      'me',
      Payloads.boardsMenuMinimal,
    ).then((delta) => [
      'Member',
      delta,
      Payloads.boardsMenuMinimal.mappingRules,
    ]);
  },

  loadBoardMinimal(id) {
    return this._loadApiData(ModelName.BOARD, id, Payloads.boardMinimal);
  },

  loadBoardData(id, payload) {
    return this._loadApiData(ModelName.BOARD, id, payload);
  },

  loadBoardMembers(id) {
    return this._loadApiData(ModelName.MEMBER, id, {}, `boards/${id}/members`);
  },

  loadBoardAttachment(idBoard) {
    return this._loadApiData(
      ModelName.BOARD,
      idBoard,
      Payloads.boardAttachment,
    );
  },

  loadCardData(...args) {
    const adjustedLength = Math.max(args.length, 1),
      [idBoard] = Array.from(args.slice(0, adjustedLength - 1)),
      idOrShortId = args[adjustedLength - 1];
    if (typeof idBoard !== 'undefined' && idBoard !== null) {
      return this._loadApiData(
        ModelName.CARD,
        idOrShortId,
        Payloads.card,
        `boards/${idBoard}/cards/${idOrShortId}`,
      );
    } else {
      return this._loadApiData(ModelName.CARD, idOrShortId, Payloads.card);
    }
  },
  loadCardLinkData(idOrShortId) {
    const query = { fields: ['name', 'shortLink', 'idBoard'].join(',') };
    return this._loadApiData(ModelName.CARD, idOrShortId, { query });
  },
  loadCardCompleterData(id) {
    return this._loadApiData(ModelName.CARD, id, Payloads.cardCompleter);
  },
  loadCardId(idBoard, idShort) {
    return this._loadApiData(
      ModelName.CARD,
      idShort,
      Payloads.idCard,
      `boards/${idBoard}/cards/${idShort}`,
    ).get('id');
  },
  loadCardDetails(idCard, limit) {
    return this._loadApiData(
      ModelName.CARD,
      idCard,
      extendQuery(Payloads.cardDetails, { actions_limit: limit }),
      `cards/${idCard}`,
    );
  },
  loadCardHideDetails(idCard, limit) {
    return this._loadApiData(
      ModelName.CARD,
      idCard,
      extendQuery(Payloads.cardDetails, {
        actions: 'commentCard,copyCommentCard,createCard,copyCard',
        actions_limit: limit,
      }),
      `cards/${idCard}`,
    );
  },
  loadCardVoters(id) {
    return this._loadApiData(
      ModelName.CARD,
      id,
      Payloads.cardVoters,
      `cards/${id}`,
    );
  },
  loadCardCopyData(idBoard, idOrShortId) {
    return this._loadApiData(
      ModelName.CARD,
      idOrShortId,
      Payloads.cardCopy,
      `boards/${idBoard}/cards/${idOrShortId}`,
    );
  },
  loadCardAttachment(idCard) {
    return this._loadApiData(ModelName.CARD, idCard, Payloads.cardAttachment);
  },

  loadNotification(id) {
    return this._loadApiData(ModelName.NOTIFICATION, id, {
      query: {
        fields: 'all',
      },
    });
  },

  loadNotificationGroups(idCards) {
    return this._loadApiData(
      ModelName.NOTIFICATION_GROUP,
      null,
      { query: { idCards } },
      'notificationGroups',
    );
  },

  loadMoreUnreadNotifications(limit) {
    const unreads = ModelCache.all('Notification').filter((notification) =>
      notification.get('unread'),
    );
    const query = {
      display: true,
      limit,
      read_filter: 'unread',
      page: Math.floor(unreads.length / limit),
    };
    const path = 'members/me/notifications';

    return this._loadApiData(ModelName.NOTIFICATION, null, { query }, path);
  },

  loadMoreNotificationGroupData(limit, skip) {
    if (skip == null) {
      skip = ModelCache.all('NotificationGroup').length;
    }
    const query = {
      limit,
      skip,
      card_fields: [
        'cardRole',
        'due',
        'dueComplete',
        'idBoard',
        'idList',
        'isTemplate',
        'name',
        'subscribed',
      ],
    };
    const path = 'members/me/notificationGroups';

    return this._loadApiData(
      ModelName.NOTIFICATION_GROUP,
      null,
      { query },
      path,
    );
  },

  loadMemberNotificationsCount() {
    const query = { filter: 'all', grouped: true };
    const path = 'members/me/notificationsCount';

    return this._loadApiData('notificationsCount', null, { query }, path);
  },

  loadMinimumMemberDataForTemplatePage(idOrUsername) {
    return this._loadApiData(ModelName.MEMBER, idOrUsername, {
      query: {
        organizations: 'all',
        organization_fields: 'products,premiumFeatures',
        organization_paidAccount: 'true',
        organization_paidAccount_fields: Payloads.paidAccountFieldsMinimal,
        fields: 'oneTimeMessagesDismissed',
      },
    });
  },

  loadMemberBoardsData(idOrUsername) {
    return this._loadApiData(
      ModelName.MEMBER,
      idOrUsername,
      Payloads.memberBoards,
    );
  },

  loadMemberCardsData(idOrUsername) {
    return this._loadApiData(
      ModelName.MEMBER,
      idOrUsername,
      Payloads.memberCards,
    );
  },

  loadMemberCards(idOrUsername, { modifiedSince, limit, before } = {}) {
    const query = {
      filter: 'visible',
      stickers: true,
      attachments: true,
      members: true,
      sort: '-id',
    };

    if (modifiedSince) {
      query.modifiedSince = modifiedSince;
    }

    if (limit) {
      query.limit = limit;
    }

    if (before) {
      query.before = before;
    }

    return this._loadApiData(
      ModelName.CARD,
      null,
      { query },
      `members/${idOrUsername}/cards`,
    );
  },

  loadMemberEmail(idOrUsername) {
    return this._loadApiData(ModelName.MEMBER, idOrUsername, {
      query: {
        fields: 'email',
        invitationTokens: Util.invitationTokens().join(','),
      },
    });
  },

  loadOrganizationMemberGhost(idOrg, username) {
    // If we have an invite to this organization (i.e. an invitation token
    // in our cookies) then we need to load the ghost data so we can
    // display the invitation banner
    const idGhost = __guard__(
      Util.inviteTokenFor(idOrg),
      (x) => x.split('-')[0],
    );
    if (idGhost == null) {
      return Promise.resolve({});
    }

    const query = {
      fields: Payloads.memberFields,
      invitationTokens: Util.invitationTokens().join(','),
    };

    // Maybe the invitation has already been used or something; we
    // never want to prevent loading of the organization page
    return this._loadApiData(ModelName.MEMBER, idGhost, {
      query,
    }).catch(ApiError, () => ({}));
  },

  loadOrganizationCredits(idOrOrgName) {
    return this._loadOrganizationPayload(
      Payloads.organizationCredits,
      idOrOrgName,
    );
  },

  loadMoreActionData(modelType, idOrName, page, limit, ...rest) {
    const [idModels, filter] = Array.from(rest.slice(0, rest.length - 0));
    const query = { filter: 'all', limit, page, display: true };
    if (typeof idModels !== 'undefined' && idModels !== null) {
      query.idModels = idModels.join(',');
    }
    if (typeof filter !== 'undefined' && filter !== null) {
      query.filter = filter;
    }

    return this._loadApiData(
      ModelName.ACTION,
      idOrName,
      { query },
      `${modelType}s/${idOrName}/actions`,
    );
  },

  loadClosedCards(idBoard, { limit, before }) {
    const query = {
      stickers: true,
      attachments: true,
      pluginData: true,
      customFieldItems: true,
    };
    if (limit != null) {
      query.limit = limit;
    }
    if (before != null) {
      query.before = before;
    }

    return this._loadApiData(
      ModelName.CARD,
      idBoard,
      { query },
      `boards/${idBoard}/cards/closed`,
    );
  },

  loadListCards(idList) {
    return this._loadApiData(ModelName.LIST, idList, Payloads.listCards);
  },

  loadArchivedLists(idBoard) {
    return this._loadApiData(ModelName.BOARD, idBoard, Payloads.archivedLists);
  },

  loadArchivedListsAndCards(idBoard) {
    return this._loadApiData(
      ModelName.BOARD,
      idBoard,
      Payloads.archivedListsAndCards,
    );
  },

  loadMemberAccountData(idOrUsername) {
    return this._loadApiData(
      ModelName.MEMBER,
      idOrUsername,
      Payloads.memberAccount,
    );
  },

  loadMemberBillingData(idOrUsername) {
    return this._loadApiData(
      ModelName.MEMBER,
      idOrUsername,
      Payloads.memberBilling,
    );
  },

  loadMemberLogins(idOrUsername) {
    return this._loadApiData(ModelName.MEMBER, idOrUsername, {
      query: {
        fields: 'email',
        logins: true,
      },
    });
  },

  loadMemberProfileData(idOrUsername) {
    const payload = Payloads.memberProfile;
    const daysBack = Payloads.memberProfile_daysBack;
    payload.action_since = moment().subtract(daysBack, 'days').toString();
    return this._loadApiData(
      ModelName.MEMBER,
      idOrUsername,
      Payloads.memberProfile,
    );
  },

  loadMemberProfileMinimal(idOrUsername) {
    return this._loadApiData(
      ModelName.MEMBER,
      idOrUsername,
      Payloads.memberMinimal,
    );
  },

  loadMemberCustomBackgrounds(idOrUsername) {
    return this._loadApiData(ModelName.MEMBER, idOrUsername, {
      query: {
        fields: '',
        boardBackgrounds: 'custom',
      },
    });
  },

  loadMemberCustomStickers(idOrUsername) {
    return this._loadApiData(ModelName.MEMBER, idOrUsername, {
      query: {
        fields: '',
        customStickers: 'all',
      },
    });
  },

  loadMemberCustomEmoji(idOrUsername) {
    return this._loadApiData(ModelName.MEMBER, idOrUsername, {
      query: {
        fields: '',
        customEmoji: 'all',
      },
    });
  },

  loadMemberEnterpriseUserType(enterpriseIdOrName, idOrUsername) {
    const query = { fields: 'userType' };
    return this._loadApiData(
      ModelName.MEMBER,
      idOrUsername,
      { query },
      `enterprises/${enterpriseIdOrName}/members/${idOrUsername}`,
    );
  },

  loadMemberEnterpriseActive(enterpriseIdOrName, idOrUsername) {
    const query = { fields: 'active' };
    return this._loadApiData(
      ModelName.MEMBER,
      idOrUsername,
      { query },
      `enterprises/${enterpriseIdOrName}/members/${idOrUsername}`,
    );
  },

  loadMemberNonPublicFields(idOrUsername) {
    const query = { fields: 'nonPublic' };
    return this._loadApiData(
      ModelName.MEMBER,
      idOrUsername,
      { query },
      `members/${idOrUsername}`,
    );
  },

  _loadOrganizationPayload(payload, idOrOrgName) {
    return this._loadApiData(ModelName.ORGANIZATION, idOrOrgName, payload);
  },

  loadOrganizationPlugins(idOrOrgName) {
    const query = { enabledBoards: true };
    return this._loadApiData(
      ModelName.PLUGIN,
      null,
      { query },
      `organizations/${idOrOrgName}/plugins`,
    );
  },

  loadOrganizationData(idOrOrgName) {
    return this._loadOrganizationPayload(Payloads.organization, idOrOrgName);
  },

  loadOrganizationBoardsData(idOrOrgName) {
    return this._loadOrganizationPayload(
      Payloads.organizationBoardsPage,
      idOrOrgName,
    );
  },

  loadWorkspaceBoardsData(idOrOrgName) {
    return this._loadOrganizationPayload(
      Payloads.workspaceBoardsPage,
      idOrOrgName,
    );
  },

  loadWorkspaceBoardsDataMinimal(idOrOrgName) {
    return this._loadOrganizationPayload(
      Payloads.workspaceBoardsPageMinimal,
      idOrOrgName,
    );
  },

  loadOrganizationMinimal(idOrOrgName) {
    return this._loadOrganizationPayload(
      Payloads.organizationMinimal,
      idOrOrgName,
    );
  },

  loadOrganizationMembersData(idOrOrgName) {
    return this._loadOrganizationPayload(
      Payloads.organizationMembers,
      idOrOrgName,
    );
  },

  loadOrganizationMembersDataWithAvailableLicenseCount(idOrOrgName) {
    return this._loadOrganizationPayload(
      Payloads.organizationMembersWithAvailableLicenseCount,
      idOrOrgName,
    );
  },

  loadOrganizationMembersBoards(idOrOrgName) {
    return this._loadOrganizationPayload(
      Payloads.organizationMembersBoards,
      idOrOrgName,
    );
  },

  loadOrganizationMembersCollaborators(idOrOrgName) {
    return this._loadOrganizationPayload(
      Payloads.organizationMembersCollaborators,
      idOrOrgName,
    );
  },

  loadOrganizationMembersMinimal(idOrOrgName) {
    return this._loadOrganizationPayload(
      Payloads.organizationMembersMinimal,
      idOrOrgName,
    );
  },

  loadOrganizationMembersMinimalWithAvailableLicenseCount(idOrOrgName) {
    return this._loadOrganizationPayload(
      Payloads.organizationFieldsMinimalWithAvailableLicenseCount,
      idOrOrgName,
    );
  },

  loadOrganizationMaximumAndAvailableLicenseCount(idOrOrgName) {
    return this._loadOrganizationPayload(
      Payloads.organizationFieldsMaximumAndAvailableLicenseCount,
      idOrOrgName,
    );
  },

  loadOrganizationExportData(idOrOrgName) {
    return this._loadOrganizationPayload(
      Payloads.organizationExports,
      idOrOrgName,
    );
  },

  loadMemberOrganizationsDeactivatedMembers() {
    return this._loadApiData(
      ModelName.ORGANIZATION,
      null,
      Payloads.memberOrganizationDeactivatedMembers,
      'members/me/organizations',
    );
  },

  loadOrgMemberCardData(idOrOrgName, idOrUsername) {
    const path = `organization/${idOrOrgName}/members/${idOrUsername}/cards`;
    return this._loadApiData(
      ModelName.CARD,
      idOrOrgName,
      Payloads.orgMemberCards,
      path,
    );
  },

  loadOrgNameById(idOrganization) {
    const query = { fields: 'name' };
    return this._loadApiData(ModelName.ORGANIZATION, idOrganization, {
      query,
    }).call('get', 'name');
  },

  loadCurrentBoardData: whenBoardNotUpToDate(function (id) {
    return this.loadBoardData(id, Payloads.currentBoardMinimal);
  }),

  loadCurrentBoardCalendarData: whenBoardNotUpToDate(function (id) {
    return this.loadBoardData(id, Payloads.currentCalendarMinimal);
  }),

  loadCurrentBoardWithLabelData: whenBoardNotUpToDate(function (id) {
    Payloads.currentBoardMinimal.query.labels = 'all';
    Payloads.currentBoardMinimal.query.labels_limit = 1000;
    delete Payloads.currentBoardSecondary.labels;
    delete Payloads.currentBoardSecondary.labels_limit;
    return this.loadBoardData(id, Payloads.currentBoardMinimal);
  }),

  loadBoardMinimalForDisplayCard: whenBoardNotUpToDate(function (id) {
    return this.loadBoardData(id, Payloads.boardMinimalForDisplayCard);
  }),

  loadBoardSecondary: whenBoardNotUpToDate(function (id) {
    return this._loadApiData(
      ModelName.BOARD,
      id,
      Payloads.currentBoardSecondary,
    );
  }),

  loadBoardPluginData: whenBoardNotUpToDate(function (id) {
    return this._loadApiData(
      ModelName.BOARD,
      id,
      Payloads.currentBoardPluginData,
    );
  }),

  loadBoardChecklists(id) {
    return this._loadApiData(ModelName.BOARD, id, Payloads.boardChecklists);
  },

  loadBoardCompleterData(id) {
    return this._loadApiData(ModelName.BOARD, id, Payloads.boardCompleter);
  },

  loadBoardName(idBoard) {
    const query = { fields: ['name', 'closed', 'shortLink'].join(',') };
    return this._loadApiData(ModelName.BOARD, idBoard, { query }).call(
      'get',
      'name',
    );
  },

  loadBoardPrefs(idBoard) {
    const query = { fields: ['prefs'].join(',') };
    return this._loadApiData(ModelName.BOARD, idBoard, { query }).call(
      'get',
      'prefs',
    );
  },

  loadMembersOfEnterprise(enterpriseIdOrName, params) {
    const query = _.extend({ fields: Payloads.enterpriseMemberFields }, params);
    return this._loadApiData(
      ModelName.MEMBER,
      enterpriseIdOrName,
      { query },
      `enterprises/${enterpriseIdOrName}/members`,
      'X-Trello-API-Query-Meta',
    );
  },

  loadEnterpriseOrganizations(enterpriseIdOrName, params) {
    const query = _.extend(
      { fields: Payloads.enterpriseOrganizationFields },
      params,
    );
    return this._loadApiData(
      ModelName.ORGANIZATION,
      enterpriseIdOrName,
      { query },
      `enterprises/${enterpriseIdOrName}/organizations`,
      'X-Trello-API-Query-Meta',
    );
  },

  loadEnterprisePendingOrganizations(enterpriseIdOrName, query) {
    return this._loadApiData(
      ModelName.PENDING_ORGANIZATION,
      enterpriseIdOrName,
      { query, mappingRules: Payloads.pendingOrganizations.mappingRules },
      `enterprises/${enterpriseIdOrName}/pendingOrganizations`,
      'X-Trello-API-Query-Meta',
    );
  },

  loadEnterprisePublicBoards(enterpriseIdOrName, params) {
    const query = _.extend(params, {
      filter: 'public',
      organization: true,
      members: 'admins',
    });

    return this._loadApiData(
      ModelName.BOARD,
      enterpriseIdOrName,
      { query },
      `enterprises/${enterpriseIdOrName}/boards`,
      'X-Trello-API-Query-Meta',
    );
  },

  loadEnterpriseStanding(modelType, orgOrEnterpriseId) {
    const url = `${Util.pluralize(modelType)}/${orgOrEnterpriseId}/paidAccount`;
    const query = {
      fields: 'enterpriseStanding,pendingDeprovision',
    };
    return this._loadApiData(modelType, orgOrEnterpriseId, { query }, url);
  },

  loadEnterprise(enterpriseIdOrName, query) {
    if (query == null) {
      query = {
        organizations: 'all',
        fields: [
          'displayName',
          'idAdmins',
          'idOrganizations',
          'pendingOrganizations',
          'name',
          'organizationPrefs',
          'prefs',
          'products',
          'ssoActivationFailed',
          'ssoDateDelayed',
          'pluginWhitelistingEnabled',
        ].join(','),
      };
    }
    return this._loadApiData(ModelName.ENTERPRISE, enterpriseIdOrName, {
      query,
    });
  },

  loadHighlights({ before, since, organization }) {
    const query = {
      board_customFields: true,
      board_memberships: 'all',
      card_customFieldItems: true,
      action_reactions: true,
    };

    if (before) {
      query.before = before;
    }
    if (since) {
      query.since = since;
    }
    if (organization) {
      query.organization = organization;
    }

    return this._loadApiData(
      'highlights',
      null,
      { query },
      'members/me/highlights',
    );
  },

  loadUpNext() {
    const query = {
      board_customFields: true,
      board_memberships: 'all',
      card_customFieldItems: true,
      action_reactions: true,
    };

    return this._loadApiData('upNext', null, { query }, 'members/me/upNext');
  },

  loadMyOrganizations() {
    return this.loadMemberOrganizations('me');
  },

  loadMyOrganizationsWithoutBoards() {
    return this.loadMemberOrganizations(
      'me',
      Payloads.organizationsWithoutBoards,
    );
  },

  loadMyOrganizationsMinimal() {
    return this.loadMemberOrganizations('me', Payloads.organizationsMinimal);
  },

  loadMemberOrganizationsMemberships(idMember) {
    return this.loadMemberOrganizations(
      idMember,
      Payloads.organizationsMemberships,
    );
  },

  loadMemberOrganizations(idMember, payload) {
    if (payload == null) {
      payload = Payloads.organizations;
    }
    return this._loadApiData(ModelName.MEMBER, idMember, payload);
  },

  loadSearchData(query) {
    return this._loadApiData('search', null, { query }, 'search');
  },

  loadModel(modelType, id, payload) {
    return this._loadApiData(modelType, id, payload);
  },

  loadBoardPlugins(id, locales) {
    // load public plugins, which are cached based on locale
    // then load private ones separately which are not cached
    if (!locales) {
      locales = 'en';
    }
    return Promise.all([
      this._loadApiData(
        ModelName.PLUGIN,
        null,
        {
          query: { preferredLocales: locales },
        },
        'plugins/public',
      ),
      this._loadApiData(
        ModelName.PLUGIN,
        null,
        {
          query: { filter: 'private' },
        },
        `boards/${id}/plugins`,
      ),
    ]).spread((publicPlugins, privatePlugins) => {
      return publicPlugins.concat(privatePlugins);
    });
  },

  loadBoardEnabledPlugins(id) {
    return this._loadApiData(
      ModelName.PLUGIN,
      null,
      {
        query: { filter: 'enabled' },
      },
      `boards/${id}/plugins`,
    );
  },

  loadEnterprisePlugins(id) {
    return this._loadApiData(
      ModelName.PLUGIN,
      null,
      {
        query: { filter: 'all' },
      },
      `enterprises/${id}/plugins`,
    );
  },

  loadPluginsWithClaimedDomains(id) {
    return this._loadApiData(
      ModelName.PLUGIN,
      null,
      {
        query: { filter: 'hasClaimedDomains' },
      },
      `boards/${id}/plugins`,
    );
  },

  loadCustomFields(id) {
    return this._loadApiData(ModelName.BOARD, id, Payloads.customFields);
  },

  loadQuickBoardsData() {
    return this._loadApiData(
      ModelName.MEMBER,
      'me',
      Payloads.memberQuickBoards,
    );
  },

  loadQuickBoardsSearch(search) {
    return this._loadApiData(
      'search',
      null,
      {
        query: Payloads.quickBoardsSearch.query(search),
      },
      'search',
    );
  },

  loadAction(id) {
    return this._loadApiData(ModelName.ACTION, id, Payloads.action);
  },

  loadReactions(idAction) {
    return this._loadApiData(
      ModelName.REACTION,
      idAction,
      {},
      `actions/${idAction}/reactions`,
    );
  },

  triggerWaits(type) {
    _waitComplete[type] = true;

    for (const callback of Array.from(
      _waitCallbacks[type] != null ? _waitCallbacks[type] : [],
    )) {
      callback();
    }
    return delete _waitCallbacks[type];
  },

  waitFor(type, callback) {
    if (_waitComplete[type]) {
      return callback();
    } else {
      return (_waitCallbacks[type] != null
        ? _waitCallbacks[type]
        : (_waitCallbacks[type] = [])
      ).push(callback);
    }
  },

  await(type) {
    return new Promise((resolve) => {
      return this.waitFor(type, resolve);
    });
  },
};
