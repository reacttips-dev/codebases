/* eslint-disable
    default-case,
    eqeqeq,
    no-undef,
    no-unreachable,
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
 * DS204: Change includes calls to have a more natural evaluation order
 * DS205: Consider reworking code to avoid use of IIFEs
 * DS206: Consider reworking classes to avoid initClass
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const {
  Analytics,
  getScreenFromUrl,
  tracingCallback,
} = require('@trello/atlassian-analytics');
const { ApiAjax } = require('app/scripts/network/api-ajax');
const { ApiError } = require('app/scripts/network/api-error');
const { ApiPromise } = require('app/scripts/network/api-promise');
const { ArchivableMixin } = require('app/scripts/lib/archivable-mixin');
const { Auth } = require('app/scripts/db/auth');
const { Backgrounds } = require('app/scripts/data/backgrounds');
const { Batcher } = require('app/scripts/network/rpc/batcher');
const {
  BoardPluginList,
} = require('app/scripts/models/collections/BoardPluginList');
const { BoardState } = require('app/scripts/view-models/board-state');
const { CardComposer } = require('app/scripts/view-models/card-composer');
const { CardFilter } = require('app/scripts/view-models/card-filter');
const { Urls } = require('app/scripts/controller/urls');
const { getBoardInvitationLinkUrl, getBoardUrl, getBoardShortUrl } = Urls;
const {
  CustomFieldList,
} = require('app/scripts/models/collections/custom-field-list');
const { dontUpsell } = require('@trello/browser');
const { featureFlagClient } = require('@trello/feature-flag-client');
const Hearsay = require('hearsay');
const { idCache } = require('@trello/shortlinks');
const { Label } = require('app/scripts/models/label');
const { LabelList } = require('app/scripts/models/collections/label-list');
const { LegacyPowerUps } = require('app/scripts/data/legacy-power-ups');
const { LimitMixin } = require('app/scripts/lib/limit-mixin');
const { ListComposer } = require('app/scripts/view-models/list-composer');
const {
  MembershipModel,
} = require('app/scripts/models/internal/membership-model');
const {
  ModelWithPersonalPreferences,
} = require('app/scripts/models/internal/model-with-personal-preferences');
const { PremiumFeature } = require('@trello/product-features');
const Payloads = require('app/scripts/network/payloads').default;
const {
  PluginDataList,
} = require('app/scripts/models/collections/plugin-data-list');
const Promise = require('bluebird');
const { Util } = require('app/scripts/lib/util');
const {
  actionFilterFromString,
} = require('app/scripts/lib/util/action-filter-from-string');
const xtend = require('xtend');
const _ = require('underscore');
const moment = require('moment');
const { isShortId } = require('@trello/shortlinks');
const {
  BoardInviteRestrictValues,
} = require('app/scripts/views/organization/constants');
const { client, syncDeltaToCache } = require('@trello/graphql');

const { BUTLER_POWER_UP_ID } = require('app/scripts/data/butler-id');
const CUSTOM_FIELDS_ID = require('@trello/config').customFieldsId;
const LIST_LIMITS_POWER_UP_ID = require('@trello/config').listLimitsPowerUpId;
const MAP_POWER_UP_ID = require('@trello/config').mapPowerUpId;
const WELCOME_BOARD_THRESHOLD = 10000;

function __guard__(value, transform) {
  return typeof value !== 'undefined' && value !== null
    ? transform(value)
    : undefined;
}

class Board extends ModelWithPersonalPreferences {
  static initClass() {
    this.prototype.typeName = 'Board';
    this.prototype.urlRoot = '/1/boards';

    this.lazy({
      boardPluginList() {
        return new BoardPluginList([], { board: this }).syncCache(
          this.modelCache,
          ['idBoard'],
          (boardPlugin) => {
            return boardPlugin.get('idBoard') === this.id;
          },
        );
      },
      listList() {
        // Dependency required at call site to avoid import cycles, do not lift to top of module
        const {
          ListList,
        } = require('app/scripts/models/collections/list-list');
        return new ListList(null, { board: this })
          .setOwner(this)
          .syncCache(this.modelCache, ['idBoard', 'closed'], (list) => {
            return list.get('idBoard') === this.id && list.isOpen();
          });
      },
      invitationList() {
        // Dependency required at call site to avoid import cycles, do not lift to top of module
        const {
          BoardInvitationList,
        } = require('app/scripts/models/collections/BoardInvitationList');
        return new BoardInvitationList([], {
          modelCache: this.modelCache,
          board: this,
        });
      },
      checklistList() {
        // Dependency required at call site to avoid import cycles, do not lift to top of module
        const {
          ChecklistList,
        } = require('app/scripts/models/collections/checklist-list');
        return new ChecklistList([], {
          modelCache: this.modelCache,
          board: this,
        });
      },
      customFieldList() {
        return new CustomFieldList().syncCache(
          this.modelCache,
          ['idModel'],
          (customField) => {
            return customField.get('idModel') === this.id;
          },
        );
      },
      labelList() {
        return new LabelList().syncCache(
          this.modelCache,
          ['idBoard'],
          (label) => {
            return label.get('idBoard') === this.id;
          },
        );
      },
      memberList() {
        // Dependency required at call site to avoid import cycles, do not lift to top of module
        const {
          MemberList,
        } = require('app/scripts/models/collections/member-list');
        return new MemberList().syncModel(this, 'memberships', {
          fxGetIds(memberships) {
            return _.pluck(memberships, 'idMember');
          },
        });
      },
      adminList() {
        // Dependency required at call site to avoid import cycles, do not lift to top of module
        const {
          MemberList,
        } = require('app/scripts/models/collections/member-list');
        return new MemberList().syncModel(this, 'memberships', {
          fxGetIds: (memberships) => {
            // Because a member could be the admin of a premium org (and thus be
            // an implicit admin of this board) but not an admin on the board, we
            // need to also check if the member is a premium org admin.  This check
            // needs to be done directly since getExplicitMemberType may return
            // that the member is an admin due to its board membership info not
            // being updated yet
            const adminMemberships = _.filter(memberships, (membership) => {
              const member = this.modelCache.get('Member', membership.idMember);
              return (
                membership.memberType === 'admin' ||
                (member != null &&
                  __guard__(this.getOrganization(), (x) =>
                    x.isPremOrgAdmin(member),
                  ))
              );
            });

            return _.pluck(adminMemberships, 'idMember');
          },
        });
      },
      pluginDataList() {
        return new PluginDataList([], {
          scopeModel: this,
        }).syncCache(this.modelCache, [], (pluginData) => {
          return (
            pluginData.get('idModel') === this.id &&
            pluginData.get('scope') === 'board'
          );
        });
      },
      filter() {
        return new CardFilter(this, { modelCache: this.modelCache });
      },
      composer() {
        return new CardComposer(null, {
          board: this,
          modelCache: this.modelCache,
        });
      },
      listComposer() {
        return new ListComposer(this, { modelCache: this.modelCache });
      },
      viewState() {
        return new BoardState(null, {
          modelCache: this.modelCache,
          board: this,
        });
      },
    });

    this.prototype.prefNames = [
      'permissionLevel',
      'voting',
      'comments',
      'invitations',
      'selfJoin',
      'background',
      'cardAging',
      'calendarFeedEnabled',
    ];
    this.prototype.myPrefNames = [
      'showSidebar',
      'showSidebarMembers',
      'showSidebarBoardActions',
      'showSidebarActivity',
      'emailKey',
      'idEmailList',
      'emailPosition',
      'calendarKey',
      'fullEmail',
    ];
  }
  initialize() {
    super.initialize(...arguments);

    this.listenForPermChange();
    return this.cacheShortLink();
  }

  isVisibleAction(action) {
    if (this._actionFilter == null) {
      this._actionFilter = actionFilterFromString(Payloads.boardActions);
    }
    return this._actionFilter(action);
  }

  cacheShortLink() {
    return this.waitForAttrs(this, ['id', 'shortLink'], ({ id, shortLink }) =>
      idCache.setBoardId(shortLink, id),
    );
  }

  hasCapacity(item) {
    if (item.getList != null) {
      // Card
      return (
        !this.isOverLimit('cards', 'totalPerBoard') &&
        !this.isOverLimit('cards', 'openPerBoard')
      );
    } else {
      // List
      return (
        !this.isOverLimit('lists', 'totalPerBoard') &&
        !this.isOverLimit('lists', 'openPerBoard')
      );
    }
  }

  close(opts, next) {
    const traceId = opts.traceId;

    this.update({ closed: true, traceId }, next);

    // Optimistically attempt to update free board limit
    this.getOrganization()?.incrementFreeBoardLimitCount(-1);
  }

  reopen(param, next) {
    if (param == null) {
      param = {};
    }
    const traceId = param?.traceId;

    let { newBillableGuests, keepBillableGuests } = param;
    if (newBillableGuests == null) {
      newBillableGuests = [];
    }
    if (keepBillableGuests == null) {
      keepBillableGuests = false;
    }

    // If we are keeping billable guests upon re-opening, invoke the attribute
    // specific endpoint with the keepBillableGuests param to let server know not to drop
    // them
    if (keepBillableGuests) {
      this.set('closed', false);
      this.api(
        {
          type: 'put',
          method: 'closed?value=false&keepBillableGuests=true',
          traceId,
        },
        (err, response) => {
          if (next) {
            next(err, response);
          }
        },
      );
      return;
    }

    // Otherwise, if necessary, optimistically remove any billable guests
    if (newBillableGuests.length > 0) {
      this.set(
        'memberships',
        _.reject(this.get('memberships'), (membership) =>
          _.some(
            newBillableGuests,
            (guest) => membership.idMember === guest.id,
          ),
        ),
      );
    }

    this.update({ closed: false, traceId }, next);

    // Optimistically attempt to update free board limit
    this.getOrganization()?.incrementFreeBoardLimitCount(-1);
  }

  markAsViewed() {
    if (!Auth.isLoggedIn()) {
      return;
    }
    // Set day last viewed for invite acceptance notification
    this.set('previousDateLastView', this.get('dateLastView'));
    this.set(
      {
        dateLastView: new Date().toISOString(),
      },
      { broadcast: true },
    );
    syncDeltaToCache(client, this.typeName, this.toJSON());

    return ApiAjax({
      url: `${this.urlRoot}/${this.id}/markAsViewed`,
      type: 'post',
      background: true,
    });
  }

  subscribe(subscribed, next) {
    if (subscribed === this.get('subscribed')) {
      return;
    }
    this.update({ subscribed }, next);
  }

  subscribeWithTracing(subscribed, tracingCallbackArgs) {
    const { traceId, next, ...tracingArgs } = tracingCallbackArgs;

    this.update(
      { subscribed, traceId },
      tracingCallback({ traceId, ...tracingArgs }, next),
    );
  }

  isStarred() {
    return Auth.me().boardStarList.getBoardStar(this.id) != null;
  }

  hasUnseenActivity() {
    const dtView = this.get('dateLastView');
    const dtActivity = this.get('dateLastActivity');
    return dtView != null && dtActivity != null && dtView < dtActivity;
  }

  daysUntilPluginsDisable() {
    let date;
    if ((date = this.get('datePluginDisable')) != null) {
      return moment(date).diff(moment(), 'days');
    } else {
      return null;
    }
  }

  isLessActive() {
    let left;
    const dtLastActivity =
      (left = this.get('dateLastActivity')) != null
        ? left
        : new Date(Util.idToDate(this.id));
    const sixMonthsAgo = moment().subtract(6, 'months');
    return sixMonthsAgo.isAfter(dtLastActivity);
  }

  getAvailableRoles() {
    if (this.hasObservers()) {
      return ['admin', 'normal', 'observer'];
    } else {
      return ['admin', 'normal'];
    }
  }

  hasObservers() {
    return __guard__(this.getOrganization(), (x) =>
      x.isFeatureEnabled('observers'),
    );
  }

  hasAdvancedChecklists() {
    return this.isFeatureEnabled(PremiumFeature.AdvancedChecklists);
  }

  upsellAdvancedChecklists() {
    return this.editable() && !dontUpsell() && !this.hasAdvancedChecklists();
  }

  isFeatureEnabled(feature) {
    return __guard__(this.get('premiumFeatures'), (x) => x.includes(feature));
  }

  getPermLevel() {
    return this.getPref('permissionLevel');
  }

  _normalizePref(pref) {
    if (pref === 'none') {
      return 'disabled';
    } else {
      return pref;
    }
  }

  getCommentPerm() {
    return this._normalizePref(this.get('prefs').comments);
  }

  getInvitePerm() {
    return this._normalizePref(this.get('prefs').invitations);
  }

  toJSON(opts) {
    if (opts == null) {
      opts = {};
    }
    const data = super.toJSON(...arguments);

    if (opts.org) {
      const organization = this.getOrganization();
      if (organization != null) {
        data.hasOrg = true;
        data.org = organization.toJSON({ url: true });
      }
    }

    if (opts.url) {
      if (data.url == null) {
        data.url = getBoardUrl(this);
      }
    }

    if (opts.shortUrl) {
      if (data.shortUrl == null) {
        data.shortUrl = getBoardShortUrl(this);
      }
    }

    return data;
  }

  calcPos(index, list) {
    return Util.calcPos(index, this.listList, list, (list) => list.isOpen());
  }

  getCard(idCard) {
    if (isShortId(idCard)) {
      return this.modelCache.findOne('Card', 'idShort', Number(idCard));
    } else {
      return this.modelCache.get('Card', idCard);
    }
  }

  getList(idList) {
    return this.listList.get(idList);
  }

  getUrl() {
    return getBoardUrl(this);
  }

  getChecklist(idChecklist) {
    return this.modelCache.get('Checklist', idChecklist);
  }

  getBoardInvitation(idBoardInvitation) {
    return this.invitationList.get(idBoardInvitation);
  }

  getCheckItem(idCheckItem) {
    for (const checklist of Array.from(this.checklistList.models)) {
      const checkItem = __guard__(
        checklist != null ? checklist.checkItemList : undefined,
        (x) => x.get(idCheckItem),
      );
      if (checkItem) {
        return checkItem;
      }
    }
  }

  editable() {
    const me = Auth.me();
    return me && (this.editableByMember(me) || this.isEditableByTeamMember());
  }

  isEditableByTeamMember() {
    const org = this.getOrganization();
    if (org == null) {
      return false;
    }

    const me = Auth.me();

    if (this.isObserver(me)) {
      return false;
    }

    const isOrgMember = org.isMember(me);
    return this.isPremOrgAdmin(me) || (this.allowsSelfJoin() && isOrgMember);
  }

  isEditableByTeamMemberAndIsNotABoardMember() {
    return (
      this.isEditableByTeamMember() && this.getMembershipFor(Auth.me()) == null
    );
  }

  editableByMember(member) {
    return this.isMember(member);
  }

  isGuest(member) {
    let needle;
    return (
      ((needle = this.getMemberType(member)),
      ['virtual', 'normal', 'admin', 'observer'].includes(needle)) &&
      this.hasOrganization() &&
      !member
        .getSortedOrgs()
        .find((org) => org.get('id') === this.get('idOrganization'))
    );
  }

  getMembershipCount() {
    let left, left1;
    return (left =
      (left1 = __guard__(this.get('membershipCounts'), (x) => x.active)) != null
        ? left1
        : __guard__(this.get('memberships'), (x1) => x1.length)) != null
      ? left
      : 1;
  }

  getStarCount(type) {
    let left;
    return (left = __guard__(this.get('starCounts'), (x) => x[type])) != null
      ? left
      : 0;
  }

  getIdTags() {
    let left;
    return (left = this.get('idTags')) != null ? left : [];
  }

  owned() {
    const me = Auth.me();
    return me && this.ownedByMember(me);
  }

  ownedByMember(member) {
    return this.getMemberType(member) === 'admin';
  }

  allowsSelfJoin() {
    // Templates can still return selfJoin: true, even though users
    // aren't allowed to self join
    return (this.getPref('selfJoin') ?? false) && !this.isTemplate();
  }

  isTemplate() {
    if (!this.getPref('isTemplate')) {
      return false;
      //  Any public boards can be templates
    } else if (this.isPublic() || this.isFeatureEnabled('privateTemplates')) {
      return true;
    }

    return false;
  }

  canAdd() {
    const org = this.getOrganization();
    if (org) {
      return org.canAddBoard(this);
    }
    const ent = this.getEnterprise();
    return !ent || ent.canAddTeamlessBoard(this);
  }

  canDelete() {
    const org = this.getOrganization();
    if (org) {
      return this.owned() && (!org || org.canDeleteBoard(this));
    }
    const ent = this.getEnterprise();
    return this.owned() && (!ent || ent.canDeleteTeamlessBoard(this));
  }

  canSetVisibility(vis) {
    const org = this.getOrganization();
    if (org) {
      return org.canSetVisibility(vis);
    }
    const ent = this.getEnterprise();
    return !ent || ent.canSetTeamlessBoardVisibility(vis);
  }

  canJoin() {
    const org = this.getOrganization();
    if (org == null && this.get('idEnterprise') == null) {
      return false;
    }

    const me = Auth.me();

    const prefs = this.get('prefs') || {};

    const isBoardEnterpriseJoinable =
      this.isEnterpriseBoard() &&
      this.allowsSelfJoin() &&
      this.get('idEnterprise') === me.get('idEnterprise') &&
      prefs.permissionLevel == 'enterprise' &&
      featureFlagClient.get('enterprise.enterprise-joinable-boards', false);

    // We check for the existence of a membership; the might have a
    // memberType of admin due to being a BC admin
    if (this.getMembershipFor(me) != null || this.isObserver(me)) {
      return false;
    }

    const isOrgMember = org && org.isMember(me);
    return (
      this.isPremOrgAdmin(me) ||
      (this.allowsSelfJoin() && isOrgMember) ||
      (this.isEnterpriseBoard() &&
        __guard__(this.getEnterprise(), (x) => x.isAdmin(me))) ||
      isBoardEnterpriseJoinable
    );
  }

  canInviteMembers() {
    let typeAllowedtoInvite;
    if (this.getOrganization() == null && !this.getPref('canInvite')) {
      return false;
    }

    if (__guard__(this.get('prefs'), (x) => x.invitations) === 'admins') {
      typeAllowedtoInvite = 'admin';
    } else if (
      __guard__(this.get('prefs'), (x1) => x1.invitations) === 'members'
    ) {
      typeAllowedtoInvite = 'normal';
    }

    return (
      this.getMemberType(Auth.me()) === 'admin' ||
      typeAllowedtoInvite === this.getMemberType(Auth.me())
    );
  }

  canUpsellToEnterprise() {
    const me = Auth.me();

    return (
      !this.isGuest(me) &&
      !me.isDismissed('enterprise-upsell-board-sidebar') &&
      (me.enterpriseList != null ? me.enterpriseList.length : undefined) ===
        0 &&
      this.hasOrganization() &&
      !this.hasEnterprise() &&
      __guard__(this.getOrganization(), (x) => x.get('memberships').length) >=
        20
    );
  }

  compareMemberType(memberA, memberB, opts) {
    return Util.compareMemberType(this, memberA, memberB, opts);
  }

  isMemberPublic(member) {
    return this.getMemberType(member) === 'public';
  }

  isMemberOrg(member) {
    return this.getMemberType(member) === 'org';
  }

  isMemberObserver(member) {
    return this.getMemberType(member) === 'observer';
  }

  memberMatchesSetting(member, setting) {
    switch (this.getPref(setting)) {
      case 'public':
        return Auth.isLoggedIn();
      case 'org':
        return (
          this.isMember(member) ||
          this.isMemberOrg(member) ||
          this.isMemberObserver(member)
        );
      case 'observers':
        return this.isMember(member) || this.isMemberObserver(member);
      case 'members':
        return this.isMember(member);
      case 'admins':
        return this.ownedByMember(member);
      default:
        // 'none'
        return false;
    }
  }

  isPowerUpEnabled(name) {
    // in some cases we don't *know* about a board's power ups, because we've
    // loaded it (for example) on the "my cards" page, and we want to keep
    // data down to minimum. But we also don't want to pretend like it's empty,
    // since that could be weirder, so we just don't have that field at all.
    // This means that we don't actually *know* if this power up is enabled, so
    // we default to false when we don't have enough information to answer.
    let needle, needle1, needle2;
    const powerUps = this.get('powerUps');
    return (
      (powerUps != null && Array.from(powerUps).includes(name)) ||
      (name === 'calendar' &&
        ((needle = LegacyPowerUps.calendar),
        Array.from(this.idPluginsEnabled()).includes(needle))) ||
      ((needle1 = name === 'cardAging' && LegacyPowerUps.cardAging),
      Array.from(this.idPluginsEnabled()).includes(needle1)) ||
      ((needle2 = name === 'voting' && LegacyPowerUps.voting),
      Array.from(this.idPluginsEnabled()).includes(needle2))
    );
  }

  isButlerCore() {
    // almost a tautology, since for Butler to be core, by definition Trello server
    // would have served us a boardPlugin record meaning it would be enabled
    let needle;
    if (!this.isPluginEnabled(BUTLER_POWER_UP_ID)) {
      return false;
    }

    const idEnterprise = this.get('idEnterprise');
    if (
      idEnterprise &&
      ((needle = idEnterprise),
      Array.from(
        featureFlagClient.get(
          'workflowers.enterprise-butler-core-blocklist',
          [],
        ),
      ).includes(needle))
    ) {
      return false;
    }
    return true;
  }

  // Bloomberg has requested that the Butler dashboard only be available to
  // their Enterprise admins. This function will return whether a user can
  // access the Butler directory on a board
  canShowButlerUI() {
    if (this.hasEnterprise()) {
      if (
        featureFlagClient
          .get('workflowers.butler-ent-admin-only-allowlist', [])
          .includes(this.get('idEnterprise'))
      ) {
        return (
          this.getEnterprise().isAdmin(Auth.me()) ||
          (this.get('idOrganization') &&
            this.getOrganization()?.isAdmin(Auth.me()))
        );
      }
    }
    return true;
  }

  powerUpsCount() {
    const isMapCore = this.isMapCore();
    const countCustomFields = featureFlagClient.get(
      'ecosystem.custom-fields-sku-relocation',
      false,
    );
    // Things in the powerUps list are grandfathered and don't count against the limit
    return this.boardPluginList.filter((boardPlugin) => {
      if (boardPlugin.isButler()) return false;
      if (isMapCore && boardPlugin.isMap()) return false;
      if (countCustomFields && boardPlugin.isCustomFields()) return false;
      return true;
    }).length;
  }

  limitedPowerUpsCount() {
    // promotional plugins don't count towards the users Power-Up limit on this board
    return this.boardPluginList.filter(
      (boardPlugin) => !boardPlugin.get('promotional'),
    ).length;
  }

  canEnableAdditionalPowerUps() {
    return (
      Auth.isLoggedIn() &&
      this.limitedPowerUpsCount() <
        Auth.me().getPowerUpsLimit(this.getOrganization())
    );
  }

  isPluginEnabled(idPlugin) {
    if (
      idPlugin === MAP_POWER_UP_ID &&
      this.isFeatureEnabled(PremiumFeature.Views) &&
      featureFlagClient.get('ecosystem.pups-views-transition', false)
    ) {
      return true;
    }

    return this.boardPluginList.any(
      (boardPlugin) => boardPlugin.get('idPlugin') === idPlugin,
    );
  }

  isCustomFieldsEnabled() {
    return this.isPluginEnabled(CUSTOM_FIELDS_ID);
  }

  isListLimitsPowerUpEnabled() {
    return this.isPluginEnabled(LIST_LIMITS_POWER_UP_ID);
  }

  isMapPowerUpEnabled() {
    return this.isPluginEnabled(MAP_POWER_UP_ID);
  }

  enablePlugin(idPlugin, tags = []) {
    const promotional = tags.includes('promotional');

    return new Promise((resolve, reject) => {
      this.boardPluginList.create(
        { idPlugin, promotional },
        {
          success: resolve,
          error: (status, textStatus) => {
            return reject({ status, textStatus });
          },
        },
      );

      const idOrganization = this.get('idOrganization');
      if (idOrganization) {
        return Analytics.sendTrackEvent({
          action: 'enabled',
          actionSubject: 'powerUp',
          objectType: 'powerUp',
          objectId: idPlugin,
          containers: {
            board: {
              id: this.id,
            },
            organization: {
              id: idOrganization,
            },
          },
          source: 'createBoardModal',
          attributes: {
            isBCFeature: true,
            requiredBC: false,
            tags,
          },
        });
      }
    });
  }

  enablePluginWithTracing(idPlugin, tracingCallbackArgs) {
    const { next, traceId, attributes } = tracingCallbackArgs;
    const promotional = attributes?.pluginTags?.includes('promotional');

    return new Promise((resolve, reject) => {
      this.boardPluginList.createWithTracing(
        { idPlugin, promotional },
        {
          traceId,
          success: resolve,
          error: (_model, _err, xhrResponse) => {
            return reject(xhrResponse);
          },
        },
        tracingCallback(tracingCallbackArgs, next),
      );

      const idOrganization = this.get('idOrganization');
      if (idOrganization) {
        return Analytics.sendTrackEvent({
          action: 'enabled',
          actionSubject: 'powerUp',
          objectType: 'powerUp',
          objectId: idPlugin,
          containers: {
            board: {
              id: this.id,
            },
            organization: {
              id: idOrganization,
            },
          },
          source: 'createBoardModal',
          attributes: {
            isBCFeature: true,
            requiredBC: false,
            tags: attributes?.pluginTags,
            taskId: traceId,
          },
        });
      }
    });
  }

  disablePlugin(idPlugin) {
    const boardPlugin = this.boardPluginList.find(
      (boardPlugin) => boardPlugin.get('idPlugin') === idPlugin,
    );
    return boardPlugin.destroy();
  }

  disablePluginWithTracing(idPlugin, tracingCallbackArgs = {}) {
    const { next, traceId } = tracingCallbackArgs;
    const boardPlugin = this.boardPluginList.find(
      (boardPlugin) => boardPlugin.get('idPlugin') === idPlugin,
    );
    return boardPlugin.destroyWithTracing(
      {
        traceId,
      },
      tracingCallback(tracingCallbackArgs, next),
    );
  }

  canVote(member) {
    return (
      this.memberMatchesSetting(member, 'voting') ||
      (this.isEditableByTeamMember() && this.getPref('voting') !== 'disabled')
    );
  }

  canComment(member) {
    return (
      this.memberMatchesSetting(member, 'comments') ||
      (this.isEditableByTeamMember() && this.getPref('comments') !== 'disabled')
    );
  }
  canInvite(member) {
    return this.memberMatchesSetting(member, 'invitations');
  }

  isPublic() {
    return this.getPref('permissionLevel') === 'public';
  }
  isPrivate() {
    return this.getPref('permissionLevel') === 'private';
  }

  getIdBoardMems() {
    return _.map(this.memberList.models, (member) => member.id);
  }

  getOrganization() {
    return this.modelCache.get('Organization', this.get('idOrganization'));
  }

  getEnterprise() {
    if (this.get('idEnterprise')) {
      return this.modelCache.get('Enterprise', this.get('idEnterprise'));
    } else {
      return __guard__(this.getOrganization(), (x) => x.getEnterprise());
    }
  }

  // We can't necessarily see the org
  hasOrganization() {
    return this.get('idOrganization');
  }

  hasEnterprise() {
    // Directly owned by an enterprise
    if (this.get('idEnterprise') != null) {
      // Ideally we should be checking this looking at the products field of
      // the enterprise that owns this board, and not through the org, but we
      // can't load the products field of the enterprise from server so we will
      // need to fix that first, then come back here and refactor this method.
      const org = this.getOrganization();
      if (!!org && org.isBCPO()) {
        return false;
      } else {
        return true;
      }
    }

    // Owned by an enterprise via an org
    const org = this.getOrganization();
    return (
      (org != null ? org.get('idEnterprise') : undefined) != null &&
      !(org != null ? org.isBCPO() : undefined)
    );
  }

  isOrgAtOrOverFreeBoardLimit() {
    return (
      __guard__(this.getOrganization(), (x) => x.isAtOrOverFreeBoardLimit()) ||
      false
    );
  }

  snoopOrganization() {
    return this.snoop('idOrganization').map(() => this.getOrganization());
  }

  orgMembersAvailable() {
    const organization = this.getOrganization();
    return _.chain(
      organization.memberList.filter((member) => {
        return !organization.isDeactivated(member);
      }),
    )
      .difference(this.memberList.models)
      .value();
  }

  optimisticJoinBoard() {
    const me = Auth.me();
    const isPremOrgAdmin = this.isPremOrgAdmin(me);

    // Fake out idBoards/idPremOrgsAdmin client-side, so we don't have to
    // wait for the response back from the server

    if (isPremOrgAdmin) {
      let left;
      me.set(
        'idPremOrgsAdmin',
        ((left = me.get('idPremOrgsAdmin')) != null ? left : []).concat(
          this.id,
        ),
      );
    }
    return me.set('idBoards', me.get('idBoards').concat(this.id));
  }

  joinBoard(traceId, next) {
    const me = Auth.me();
    const isPremOrgAdmin = this.isPremOrgAdmin(me);
    const memberType = isPremOrgAdmin ? 'admin' : 'normal';

    this.optimisticJoinBoard();

    return this.addMember(me, traceId, memberType, next);
  }

  addMember(member, traceId, ...rest) {
    const adjustedLength = Math.max(rest.length, 1);
    // eslint-disable-next-line prefer-const
    let [memberType, invitationMessage] = Array.from(
      rest.slice(0, adjustedLength - 1),
    );
    const next = rest[adjustedLength - 1];
    if (typeof memberType === 'undefined' || memberType === null) {
      memberType = 'normal';
    }
    let { id } = member;
    const email = member.get('email');
    const data = {
      type: memberType,
      invitationMessage,
      allowBillableGuest: true,
    };

    // [TRELP-1453]
    // If we have the email use that instead of the id, this should
    // only be the case when the user has manually entered a full valid
    // email address and not searched. If we have an email we also don't
    // want to allow the server to accept an unconfirmed member directly
    // to the board this protects against a potential phishing attack
    if (email) {
      id = '';
      data.email = email;
    } else {
      data.acceptUnconfirmed = true;
    }

    return this.api(
      {
        type: 'put',
        method: `members/${id}`,
        data,
        traceId,
      },
      (err, response) => {
        let idOrganization;
        if (next) {
          next(err, response);
        }

        if (err) {
          return;
        }

        Analytics.sendTrackEvent({
          action: 'added',
          actionSubject: 'member',
          actionSubjectId: member.id,
          source: getScreenFromUrl(),
          containers: {
            board: {
              id: this.get('id'),
            },
            organization: {
              id: this.get('idOrganization'),
            },
          },
          attributes: {
            addedTo: 'board',
            confirmed: !!member.get('confirmed'),
            memberType,
            taskId: traceId,
          },
        });

        if (
          memberType === 'observer' &&
          (idOrganization = this.get('idOrganization')) != null
        ) {
          return Analytics.sendTrackEvent({
            action: 'added',
            actionSubject: 'observer',
            containers: {
              board: {
                id: this.id,
              },
              organization: {
                id: idOrganization,
              },
            },
            source: 'boardScreen',
            attributes: {
              isBCFeature: true,
              requiredBC: true,
              taskId: traceId,
            },
          });
        }
      },
    );
  }

  removeMemberWithTracing(member, traceId, next) {
    //Optimistically remove membership
    this.set(
      'memberships',
      _.reject(
        this.get('memberships'),
        (membership) => membership.idMember === member.id,
      ),
    );

    return this.memberList.removeMembershipWithTracing(
      member,
      { traceId },
      next,
    );
  }

  removeMember(member) {
    this.memberList.removeMembership(member);

    return this.set(
      'memberships',
      _.reject(
        this.get('memberships'),
        (membership) => membership.idMember === member.id,
      ),
    );
  }

  changeMemberRole(member, opts, traceId) {
    let idOrganization;
    if (
      (opts != null ? opts.type : undefined) === 'observer' &&
      (idOrganization = this.get('idOrganization')) != null
    ) {
      Analytics.sendTrackEvent({
        action: 'added',
        actionSubject: 'observer',
        containers: {
          board: {
            id: this.id,
          },
          organization: {
            id: idOrganization,
          },
        },
        source: 'boardScreen',
        attributes: {
          isBCFeature: true,
          requiredBC: true,
          taskId: traceId,
        },
      });
    }

    // Copied inline from membership-model mixin in sake of bulk decaf.
    // Is duplicated in the corresponding method of organization model
    if (opts.type != null) {
      this.setOnMembership(member, { memberType: opts.type });
    }

    return ApiPromise({
      type: 'PUT',
      url: `/1/${this.typeName.toLowerCase()}/${this.id}/members/${member.id}`,
      data: opts,
      traceId,
    }).then(() =>
      Analytics.sendTrackEvent({
        action: 'updated',
        actionSubject: 'role',
        source: 'boardScreen',
        attributes: {
          taskId: traceId,
          updatedOn: 'member',
          value: opts.type,
        },
      }),
    );
  }

  getObserverList() {
    return (() => {
      const result = [];
      for (const member of Array.from(this.memberList.models)) {
        if (this.isObserver(member)) {
          result.push(member);
        }
      }
      return result;
    })();
  }

  filterLabels(term) {
    const labels = this.getLabels();

    return labels?.filter((label) => {
      const name = (label?.get('name') ?? '').toLowerCase();
      const color = (label?.get('color') ?? '').toLowerCase();

      return (
        name.indexOf(term) > -1 ||
        color.indexOf(term) === 0 ||
        // TRELP-3230
        // Labels.colors puts black as the last label with a index of 9,
        // but everywhere in hotkeys and the app refer to the black color
        // as 0 in the color list so if the color of the current label in
        // the filter is black and the term is exactly "0" then we want to
        // return the black labels
        (color === 'black' && term === '0') ||
        // eslint-disable-next-line radix
        label.get('color') === Label.colors[parseInt(term) - 1]
      );
    });
  }

  labelForColor(color) {
    return _.chain(this.getLabels())
      .filter((label) => label.get('color') === color)
      .first()
      .value();
  }

  labelsForColors() {
    return _.chain(this.getLabels())
      .groupBy((label) => label.get('color'))
      .value();
  }

  createLabel(name, color, traceId, onFail, onAbort, onSuccess) {
    const label = _.find(
      this.getLabels(),
      (label) => label.get('name') === name && label.get('color') === color,
    );
    if (!label) {
      const createdLabel = this.labelList.createWithTracing(
        { name, color: color != null ? color : '' },
        {
          traceId,
          url: `/1/board/${this.id}/labels/`,
          error: (model, err) => {
            onFail(err);
            // The label is optimistically added.
            // If the add fails, remove the label
            return this.labelList.remove(createdLabel);
          },
          success: () => {
            onSuccess();
          },
        },
      );
    } else {
      onAbort(new Error('Label already exists'));
    }
  }

  labelColors() {
    return Label.colors;
  }

  getLabels() {
    return this.labelList.models.sort(Label.compare);
  }

  _generateKey(type) {
    return this.api({
      type: 'post',
      method: `${type}Key/generate`,
    });
  }

  generateEmailKey() {
    return this._generateKey('email');
  }

  generateCalendarKey() {
    return this._generateKey('calendar');
  }

  openCards() {
    return _.flatten(
      Array.from(this.listList.models).map((list) => list.openCards().models),
    );
  }

  listenForPermChange() {
    if (!Auth.isLoggedIn()) {
      return; // nothing to listen for
    }

    let lastPermState = this.getViewPermState(Auth.me());
    let lastOwned = this.owned();

    const checkChange = this.callOnceAfter(() => {
      const currentPermState = this.getViewPermState(Auth.me());
      if (currentPermState !== lastPermState) {
        lastPermState = currentPermState;
        this.trigger('permChange', currentPermState);
      }

      const currentOwned = this.owned();
      if (currentOwned !== lastOwned) {
        lastOwned = currentOwned;
        this.trigger('ownedChange', currentOwned);
      }
    });

    this.listenTo(Auth.me().boardList, 'add remove reset', checkChange);
    this.listenTo(Auth.me().organizationList, 'add remove reset', checkChange);
    this.listenTo(this.memberList, 'add remove reset', checkChange);
    return this.listenTo(
      this,
      'change:memberships change:prefs.permissionLevel',
      checkChange,
    );
  }

  getViewPermState(member) {
    let needle;
    if (this.isObserver(member)) {
      return 'observer';
    } else if (
      ((needle = this.getMemberType(member)),
      ['normal', 'admin'].includes(needle))
    ) {
      return 'member';
    } else if (Util.hasValidInviteTokenFor(this, member)) {
      return 'inviteToken';
    } else if (
      __guard__(this.getOrganization(), (x) => x.isMember(member)) &&
      this.getPref('permissionLevel') === 'org'
    ) {
      return 'org';
    } else if (this.getPref('permissionLevel') === 'public') {
      return 'public';
    } else if (
      __guard__(this.getEnterprise(), (x1) =>
        x1.canViewEnterpriseVisibleBoard(member),
      ) &&
      this.getPref('permissionLevel') === 'enterprise'
    ) {
      return 'enterprise';
    } else {
      return 'none';
    }
  }

  getClientBackgroundColor(background) {
    return (Backgrounds[background] != null
      ? Backgrounds[background].color
      : undefined) != null
      ? Backgrounds[background] != null
        ? Backgrounds[background].color
        : undefined
      : Backgrounds['blue'].color;
  }

  dataForLabel(label) {
    return label.toJSON();
  }

  isViewableBy(member) {
    return this.getViewPermState(member) !== 'none';
  }

  toggleTag(idTag, traceId, tracingCallback) {
    let needle;
    return this.toggle(
      'idTags',
      idTag,
      ((needle = idTag), !Array.from(this.getIdTags()).includes(needle)),
      { traceId },
      tracingCallback,
    );
  }

  setPluginData(idPlugin, visibility, data) {
    return this.pluginDataList.upsert(idPlugin, visibility, data);
  }

  setPluginDataByKey(idPlugin, visibility, key, val) {
    return this.pluginDataList.setPluginDataByKey(
      idPlugin,
      visibility,
      key,
      val,
    );
  }

  getPluginData(idPlugin) {
    return xtend(
      __guard__(this.getOrganization(), (x) => x.getPluginData(idPlugin)),
      this.pluginDataList.dataForPlugin(idPlugin),
    );
  }

  getPluginDataByKey(idPlugin, visibility, key, defaultVal) {
    return this.pluginDataList.getPluginDataByKey(
      idPlugin,
      visibility,
      key,
      defaultVal,
    );
  }

  snoopPluginData(idPlugin) {
    const orgPluginData = this.snoopOrganization()
      .map(function (org) {
        if (org != null) {
          return org.snoopPluginData(idPlugin);
        } else {
          return Hearsay.const(null);
        }
      })
      .latest();

    const boardPluginData = this.pluginDataList.snoopDataForPlugin(idPlugin);

    return Hearsay.combine(orgPluginData, boardPluginData).map((entries) =>
      xtend(...Array.from(entries || [])),
    );
  }

  clearPluginData(idPlugin) {
    const boardData = this.pluginDataList.for(idPlugin, 'private');
    if (boardData != null) {
      boardData.destroy();
    }
    const orgData = __guard__(this.getOrganization(), (x) =>
      x.pluginDataList.for(idPlugin, 'private'),
    );
    if (orgData != null) {
      return orgData.destroy();
    }
  }

  idPluginsEnabled() {
    return this.boardPluginList.pluck('idPlugin');
  }

  snoopIdPluginsEnabled() {
    return Hearsay.combine(this.boardPluginList.snoop()).map(function (
      ...args
    ) {
      const [boardPluginList] = Array.from(args[0]);
      return boardPluginList.pluck('idPlugin');
    });
  }

  invitationUrl(secret) {
    return getBoardInvitationLinkUrl(secret);
  }

  startDelete(traceId, next) {
    this._isDeleting = true;
    this.trigger('deleting');

    // This *starts* the delete, but it may take a while for it to actually
    // be deleted
    return ApiPromise({
      method: 'delete',
      url: this.url(),
      traceId,
    })
      .then(() => {
        return new Promise((resolve) => {
          const checkBoard = () => {
            return ApiPromise({
              url: this.url(),
              fields: '',
              traceId,
            })
              .then(() => {
                return setTimeout(checkBoard, 500);
              })
              .catch(ApiError.NotFound, () => {
                return resolve();
              })
              .done();
          };

          return checkBoard();
        });
      })
      .then((response) => {
        next(null, response);
        return this.modelCache.remove(this);
      })
      .catch((err) => {
        next(err);
      })
      .return();
  }

  isDeleting() {
    return this._isDeleting;
  }

  getBoardList() {
    const me = Auth.me();
    return me?.boardList.toJSON();
  }

  getCurrentBoard() {
    const boards = this.getBoardList();
    const boardIdx = boards?.findIndex((board) => board.id === `${this.id}`);
    return boards[boardIdx];
  }

  isBcBoard() {
    const currentBoard = this.getCurrentBoard();
    return currentBoard?.premiumFeatures.includes('isBc');
  }

  isStandardBoard() {
    const currentBoard = this.getCurrentBoard();
    // BC premium features also contain 'isStandard' so this checks if it's just Standard
    return (
      !currentBoard?.premiumFeatures.includes('isBc') &&
      currentBoard?.premiumFeatures.includes('isStandard')
    );
  }

  isOrgBoard() {
    // We consider it to be an org board if it belongs to an organization that
    // the member is part of
    let needle;
    const idOrg = __guard__(this.getOrganization(), (x) => x.id);
    return (
      idOrg != null &&
      ((needle = idOrg),
      Array.from(Auth.me().get('idOrganizations')).includes(needle))
    );
  }

  isEnterpriseBoard() {
    // We consider it to be an enterprise board if one of the
    //# following is true:
    // - it has an `idEnterprise` set
    // - it belongs to an organization that belongs to an
    //# enterprise. We also check if it's a real enterprise,
    //# because we still have BCPO teams in the enterprises collection :/
    return (
      this.get('idEnterprise') != null ||
      (__guard__(this.getOrganization(), (x) => x.isEnterprise()) &&
        __guard__(this.getOrganization(), (x1) => x1.belongsToRealEnterprise()))
    );
  }

  isWelcomeBoard() {
    // creationMethod will always be demo for welcome boards
    // NOTE: we still use the old logic w/ threshold bc older welcome boards
    // don't have the creationMethod set
    let middle;
    return (
      this.get('creationMethod') === 'demo' ||
      (0 <=
        (middle = Util.idToDate(this.get('id')) - Util.idToDate(Auth.myId())) &&
        middle < WELCOME_BOARD_THRESHOLD)
    );
  }

  isFirstOwnedBoard() {
    // Use a tighter threshold for boards created shortly after account creation,
    // including the skipBoardsPage board
    const welcomeBoardThreshold = 1000;
    // This is not quite the same as the check done in create board component
    // or view, but should be good enough for new users without waiting on
    // Auth.me().boardList being completely loaded since we have all the idBoards
    // that a member is on, including the current board.
    const me = Auth.me();
    const idBoards = me.get('idBoards');
    const nonInvitedOrWelcomeBoardIds = _.filter(
      idBoards,
      (idBoard) =>
        // Boards created after member was created
        !me.accountNewerThan(Util.idToDate(idBoard)) &&
        // Non-welcome boards
        Util.idToDate(idBoard) - Util.idToDate(Auth.myId()) >
          welcomeBoardThreshold,
    );
    return nonInvitedOrWelcomeBoardIds.length === 1;
  }

  loadPlugins() {
    // Dependency required at call site to avoid import cycles, do not lift to top of module
    const { ModelLoader } = require('app/scripts/db/model-loader');
    this.availablePlugins = ModelLoader.loadBoardPlugins(
      this.id,
      __guard__(Auth.me(), (x) => x.getLocale()),
    );

    if (this.isButlerCore()) {
      this.availablePlugins = this.availablePlugins.filter(
        (plugin) => plugin.id !== BUTLER_POWER_UP_ID,
      );
    }

    return this.availablePlugins;
  }

  isMapCore() {
    const hasViewsFeature = this.isFeatureEnabled(PremiumFeature.Views);

    return (
      hasViewsFeature &&
      featureFlagClient.get('ecosystem.pups-views-transition', false)
    );
  }

  isCustomFieldsCore() {
    // it seems like this.isFeatureEnabled() doesn't recieve socket updates, so it may return
    // an incorrect value. But org.hasPremiumFeature() does, so we use it instead.
    const hasPaidCorePlugins = this.getOrganization()?.hasPremiumFeature(
      PremiumFeature.PaidCorePlugins,
    );

    return (
      hasPaidCorePlugins &&
      featureFlagClient.get('ecosystem.custom-fields-sku-relocation', false)
    );
  }

  getAvailablePlugins() {
    return this.availablePlugins != null
      ? this.availablePlugins
      : (this.availablePlugins = this.loadPlugins());
  }

  hasCustomField(type, name, isSuggestedField = false) {
    return this.customFieldList.some(
      (cf) =>
        cf.get('type') === type &&
        cf.get('name') === name &&
        (!isSuggestedField || cf.get('isSuggestedField')),
    );
  }

  getCustomField(type, name, isSuggestedField = false) {
    return this.customFieldList.find(
      (cf) =>
        cf.get('type') === type &&
        cf.get('name') === name &&
        (!isSuggestedField || cf.get('isSuggestedField')),
    );
  }

  getAttachmentRestrictions() {
    if (this.getEnterprise() != null) {
      return this.getEnterprise().getOrganizationPref('attachmentRestrictions');
    } else {
      return __guard__(getOrganization(), (x) =>
        x.getPref('attachmentRestrictions'),
      );
    }
  }

  getRestrictedAttachmentTypes() {
    if (this.getEnterprise() != null) {
      return this.getEnterprise().getRestrictedAttachmentTypes();
    } else {
      return __guard__(this.getOrganization(), (x) =>
        x.getRestrictedAttachmentTypes(),
      );
    }
  }

  attachmentTypeRestricted(attachmentType) {
    return (
      __guard__(this.getEnterprise(), (x) =>
        x.attachmentTypeRestricted(attachmentType),
      ) ||
      __guard__(this.getOrganization(), (x1) =>
        x1.attachmentTypeRestricted(attachmentType),
      )
    );
  }

  attachmentUrlRestricted(url) {
    return (
      __guard__(this.getEnterprise(), (x) => x.attachmentUrlRestricted(url)) ||
      __guard__(this.getOrganization(), (x1) => x1.attachmentUrlRestricted(url))
    );
  }

  canRemoveMember(member) {
    return (
      this.getMembershipFor(member) &&
      (!this.ownedByMember(member) ||
        (this.ownedByMember(member) && this.adminList.length > 1))
    );
  }

  getNewBillableGuests() {
    if (!Auth.isLoggedIn()) {
      return Promise.resolve([]);
    }

    const org = this.getOrganization();
    if (
      (org != null ? org.paysWithPurchaseOrder() : undefined) &&
      (org != null ? org.isBusinessClass() || org.isStandard() : undefined)
    ) {
      const response = {};
      const batcher = new Batcher();
      [
        `/1/organizations/${org.id}/newBillableGuests/${this.id}`,
        `/1/organizations/${org.id}?fields=availableLicenseCount`,
      ].map((url) =>
        batcher
          .request(url)
          .then(function (res) {
            if (!response.newBillableGuests) {
              response.newBillableGuests = res;
            } else {
              response.availableLicenseCount =
                res.availableLicenseCount === null
                  ? Infinity
                  : res.availableLicenseCount;
            }
            return Promise.resolve(response);
          })
          .error(() => Promise.resolve([])),
      );
      return batcher.send().then(() => response);
    } else {
      const hasBillableGuestsFeature =
        org != null ? org.isFeatureEnabled('multiBoardGuests') : undefined;

      if (hasBillableGuestsFeature) {
        return ApiPromise({
          url: `/1/organizations/${org.id}/newBillableGuests/${this.id}`,
          type: 'get',
          background: true,
        }).then((response) => ({
          newBillableGuests: response,
          availableLicenseCount: Infinity,
        }));
      } else {
        return Promise.resolve({
          newBillableGuests: [],
          availableLicenseCount: Infinity,
        });
      }
    }
  }

  shouldRenderPluginSuggestionSection(idPlugin) {
    if (!this.editable()) {
      return false;
    }
    if (this.isPluginEnabled(idPlugin)) {
      return false;
    }
    if (
      this.isEnterpriseBoard() &&
      !__guard__(this.getEnterprise(), (x) => x.isPluginAllowed(idPlugin))
    ) {
      return false;
    }

    return !this.getPluginDataByKey(
      idPlugin,
      'private',
      'dismissedSection',
      false,
    );
  }

  getPaidStatus() {
    if (this.isEnterpriseBoard()) {
      return 'enterprise';
    } else if (this.getOrganization()?.isBusinessClass()) {
      return 'bc';
    } else if (this.getOrganization()?.isStandard()) {
      return 'standard';
    } else {
      return 'free';
    }
  }

  countDueDates() {
    return this.listList.reduce(
      (acc, list) =>
        acc + list.openCards().filter((card) => card.get('due') != null).length,
      0,
    );
  }

  hasInvitationRestrictions() {
    const org = this.getOrganization();
    const enterprise = this.getEnterprise();

    if (org) {
      return (
        org.onlyOrgMembers() ||
        org.onlyManagedMembers() ||
        org.onlyOrgOrManagedMembers()
      );
    } else if (enterprise) {
      return (
        enterprise.onlyLicensedMembers() ||
        enterprise.onlyManagedMembers() ||
        enterprise.onlyLicensedOrManagedMembers()
      );
    }

    return false;
  }

  getInviteURLParams() {
    const org = this.getOrganization();
    const enterprise = this.getEnterprise();

    if (org) {
      switch (org.getPref('boardInviteRestrict')) {
        case BoardInviteRestrictValues.ORG:
          return { onlyOrgMembers: true };
          break;
        case BoardInviteRestrictValues.MANAGED:
          return { onlyManagedMembers: true };
          break;
        case BoardInviteRestrictValues.ORG_OR_MANAGED:
          return { onlyOrgOrManagedMembers: true };
          break;
      }
    } else if (enterprise) {
      switch (enterprise.getPref('personalBoardInviteRestrict')) {
        case BoardInviteRestrictValues.LICENSED:
          return { idEnterprise: enterprise.id, onlyLicensedMembers: true };
          break;
        case BoardInviteRestrictValues.MANAGED:
          return { idEnterprise: enterprise.id, onlyManagedMembers: true };
          break;
        case BoardInviteRestrictValues.LICENSED_OR_MANAGED:
          return {
            idEnterprise: enterprise.id,
            onlyLicensedOrManagedMembers: true,
          };
          break;
      }
    }

    return {};
  }

  getAnalyticsContainers() {
    return {
      board: { id: this.id },
      organization: {
        id: this.get('idOrganization') || undefined,
      },
      enterprise: {
        id: this.get('idEnterprise') || undefined,
      },
    };
  }
}
Board.initClass();

_.extend(Board.prototype, MembershipModel, ArchivableMixin, LimitMixin);

module.exports.Board = Board;
