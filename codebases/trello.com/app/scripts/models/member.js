/* eslint-disable
    default-case,
    eqeqeq,
    no-constant-condition,
*/
// TODO: This file was created by bulk-decaffeinate.
// Fix any style issues and re-enable lint.
/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS102: Remove unnecessary code created because of implicit returns
 * DS103: Rewrite code to no longer use __guard__
 * DS104: Avoid inline assignments
 * DS205: Consider reworking code to avoid use of IIFEs
 * DS206: Consider reworking classes to avoid initClass
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const {
  isNotificationFilterVisibilityAll,
} = require('app/src/components/NotificationsMenu/notificationsMenuState');

const {
  refreshIfMissing,
} = require('app/src/components/ActionEntities/customActions');
const { ApiAjax } = require('app/scripts/network/api-ajax');
const { ApiPromise } = require('app/scripts/network/api-promise');
const {
  actionFilterFromString,
} = require('app/scripts/lib/util/action-filter-from-string');
const { Auth } = require('app/scripts/db/auth');
const {
  BoardBackgroundList,
} = require('app/scripts/models/collections/BoardBackgroundList');
const {
  BoardStarList,
} = require('app/scripts/models/collections/board-star-list');
const {
  CustomEmojiList,
} = require('app/scripts/models/collections/CustomEmojiList');
const {
  CustomStickerList,
} = require('app/scripts/models/collections/custom-sticker-list');
const {
  DesktopNotification,
} = require('app/src/components/DesktopNotification');
const Language = require('@trello/locale');
const { LimitMixin } = require('app/scripts/lib/limit-mixin');
const { LoginList } = require('app/scripts/models/collections/login-list');
const { ProductFeatures, ProductName } = require('@trello/product-features');
const {
  getUnreadNotifications,
} = require('app/scripts/models/internal/member-helper');
const moment = require('moment');
const {
  ModelWithPreferences,
} = require('app/scripts/models/internal/model-with-preferences');
const { Notification } = require('app/scripts/models/notification');
const {
  NotificationsSeenState,
} = require('app/scripts/view-models/notifications-seen-state');
const { NonPublicMixin } = require('app/scripts/lib/non-public-mixin');
const Payloads = require('app/scripts/network/payloads').default;
const {
  PluginDataList,
} = require('app/scripts/models/collections/plugin-data-list');
const Promise = require('bluebird');
const {
  SavedSearchList,
} = require('app/scripts/models/collections/saved-search-list');
const { TrelloStorage } = require('@trello/storage');
const { Time } = require('app/scripts/lib/time');
const { Util } = require('app/scripts/lib/util');
const _ = require('underscore');
const { l } = require('app/scripts/lib/localize');
const {
  isPaidManagedEnterpriseMember,
  getEmailDomain,
} = require('@trello/members');

// Default new accounts to a simpler detail view
const HIDE_DETAILS_DEFAULT_DATE = new Date(2016, 8, 21);

const ACCOUNT_TRANSFER_BANNER_MESSAGE_NAME = 'AccountTransferRequired';
const PERSONAL_BOARDS_OWNERSHIP_BANNER_MESSAGE_NAME = 'PersonalBoardOwnership';

let EDITING_AUTO_CLEAR_MS = undefined;

function __guard__(value, transform) {
  return typeof value !== 'undefined' && value !== null
    ? transform(value)
    : undefined;
}

class Member extends ModelWithPreferences {
  static initClass() {
    EDITING_AUTO_CLEAR_MS = 10000;
    this.prototype.typeName = 'Member';
    this.prototype.nameAttr = 'fullName';
    this.prototype.urlRoot = '/1/members';
    this.prototype.nonPublicFields = ['avatarUrl', 'fullName', 'initials'];
    this.prototype.nonPublicKey = 'nonPublic';
    this.prototype.loadingNonPublicFields = false;

    this.prototype.defaults = { notificationsCount: {} };

    this.lazy({
      boardList() {
        // Dependency required at call site to avoid import cycles, do not lift to top of module
        const {
          BoardList,
        } = require('app/scripts/models/collections/board-list');
        return new BoardList().syncModel(this, 'idBoards');
      },
      enterpriseList() {
        // Dependency required at call site to avoid import cycles, do not lift to top of module
        const {
          EnterpriseList,
        } = require('app/scripts/models/collections/enterprise-list');
        return new EnterpriseList().syncModel(this, 'enterprises', {
          fxGetIds(enterprises) {
            return (enterprises || [])
              .filter((enterprise) => enterprise.isRealEnterprise !== false)
              .map((enterprise) => enterprise.id);
          },
        });
      },
      organizationList() {
        // Dependency required at call site to avoid import cycles, do not lift to top of module
        const {
          OrganizationList,
        } = require('app/scripts/models/collections/organization-list');
        return new OrganizationList().syncModel(this, 'idOrganizations');
      },
      pluginDataList() {
        return new PluginDataList([], {
          scopeModel: this,
        }).syncCache(this.modelCache, [], (pluginData) => {
          return (
            pluginData.get('idModel') === this.id &&
            pluginData.get('scope') === 'member'
          );
        });
      },
    });

    this.prototype.prefNames = ['minutesBetweenSummaries'];
  }

  constructor() {
    super(...arguments);
    this.loadNonPublicFields = this.loadNonPublicFields.bind(this);
    this.updateNotificationCount = this.updateNotificationCount.bind(this);
  }

  initialize() {
    super.initialize(...arguments);

    // Dependency required at call site to avoid import cycles, do not lift to top of module
    const { ModelLoader } = require('app/scripts/db/model-loader');

    if (Auth.isMe(this)) {
      this.destruct([
        (this.boardStarList = new BoardStarList([], {
          member: this,
        }).syncSubModels(this, 'boardStars')),
        (this.savedSearchList = new SavedSearchList([], {
          member: this,
        }).syncSubModels(this, 'savedSearches')),
        (this.customStickerList = new CustomStickerList([], {
          member: this,
        }).syncSubModels(this, 'customStickers')),
        (this.boardBackgroundList = new BoardBackgroundList([], {
          member: this,
        }).syncSubModels(this, 'boardBackgrounds')),
        (this.customEmojiList = new CustomEmojiList([], {
          member: this,
        }).syncSubModels(this, 'customEmoji')),
        (this.loginList = new LoginList([], { member: this }).syncSubModels(
          this,
          'logins',
        )),
      ]);

      if (this.hasPremiumFeature('customEmoji'))
        ModelLoader.loadMemberCustomEmoji(this.id).done();

      this.listenTo(
        this.modelCache,
        'add:Notification',
        _.debounce(this.ensureGroup, 500),
      );
      this.listenTo(
        this.modelCache,
        'add:Notification',
        this.ensureTranslations,
      );
      this.listenTo(
        this.modelCache,
        'rpc:add:Notification',
        this.updateNotificationCount('add'),
      );
      this.listenTo(
        this.modelCache,
        'change:Notification:unread',
        this.updateNotificationCount('change'),
      );
      this.listenTo(
        this.modelCache,
        'rpc:remove:Notification',
        this.updateNotificationCount('delete'),
      );
      this.initializeNotifications();
    }

    this.listenTo(this, 'change:editing', (member) => {
      return __guard__(
        this.modelCache.get(
          'Card',
          __guard__(member.get('editing'), (x1) => x1.idCard),
        ),
        (x) => x.updateEditing(member),
      );
    });

    // Privacy
    this.listenTo(
      this,
      'change:nonPublicAvailable',
      this.nonPublicAvailableChanged,
    );
    this.listenTo(
      this,
      'change:nonPublicModified',
      this.nonPublicModifiedChanged,
    );
  }

  isVisibleAction(action) {
    if (this._actionFilter == null) {
      this._actionFilter = actionFilterFromString(Payloads.memberActions);
    }
    return this._actionFilter(action);
  }

  isLoggedIn() {
    return !this.get('notLoggedIn');
  }

  loadCustomEmojis() {
    // Dependency required at call site to avoid import cycles, do not lift to top of module
    const { ModelLoader } = require('app/scripts/db/model-loader');
    ModelLoader.loadMemberCustomEmoji(this.id).done();
  }

  getMembershipData(model) {
    const admins = model.adminList.models;
    const isMe = Auth.isMe(this);
    const me = Auth.me();

    // logic
    const isOneOtherAdmin = _.some(admins, (admin) => admin.id !== this.id);
    const isMoreThanOneAdmin = admins.length > 1;
    const isMoreThanOneMember = model.memberList.length > 1;
    const membership = model.getMembershipFor(this);
    const memberIsAdmin =
      model.getExplicitMemberType(this) === 'admin' ||
      (membership != null ? membership.memberType : undefined) === 'admin';
    const memberIsObserver =
      model.getExplicitMemberType(this) === 'observer' ||
      (membership != null ? membership.memberType : undefined) === 'observer';
    const memberIsNormal = !(memberIsAdmin || memberIsObserver);
    const memberIsVirtual = model.isVirtual(this);
    const isAdmin = model.owned(); // this checks whether the current member (me) is an admin
    const notOrg = model.getExplicitMemberType(this) !== 'org';

    // perms
    const canChangeRole = isAdmin;
    const canMakeMember = !memberIsNormal && isOneOtherAdmin && isAdmin;
    const canMakeObserver = !memberIsObserver && isOneOtherAdmin && isAdmin;
    const canMakeAdmin = !memberIsAdmin && isAdmin;

    // For any model, an admin can always remove any member and a member can always
    // remove himself as long as there is more than one member and another admin remaining.
    // For models except orgs, a member can be removed if the current member (me)
    // can invite members to the board and has equal or higher permissions to
    // the member he's removing.
    const canRemove =
      isMoreThanOneMember &&
      ((isOneOtherAdmin && (isAdmin || isMe)) ||
        (!isMe &&
          notOrg &&
          (typeof model.canInviteMembers === 'function'
            ? model.canInviteMembers()
            : undefined) &&
          (typeof model.compareMemberType === 'function'
            ? model.compareMemberType(me, this)
            : undefined) >= 0));
    const canDeactivate =
      canRemove &&
      model.typeName === 'Organization' &&
      isAdmin &&
      !model.isDeactivated(this) &&
      !memberIsVirtual;

    return {
      isMe,
      canRemove,
      canDeactivate,
      canChangeRole,
      memberIsAdmin,
      memberIsObserver,
      memberIsNormal,
      memberIsVirtual,
      canMakeMember,
      canMakeObserver,
      canMakeAdmin,
      isMoreThanOneAdmin,
      isMoreThanOneMember,
    };
  }

  canAddBoardsTo(org) {
    return (
      org.getMembershipFor(this) != null ||
      (org.isEnterprise() &&
        __guard__(org.getEnterprise(), (x) => x.isAdmin(this)))
    );
  }

  addCampaign(data, next) {
    return ApiPromise({
      url: `${this.urlRoot}/me/campaigns`,
      type: 'POST',
      data,
    })
      .then((campaign) => {
        this.set(
          'campaigns',
          _.uniq(this.get('campaigns').concat(campaign), (c) => c.id),
        );
        return typeof next === 'function' ? next() : undefined;
      })
      .done();
  }

  updateCampaign(id, data) {
    return ApiPromise({
      url: `${this.urlRoot}/me/campaigns/${id}`,
      type: 'PUT',
      data,
    }).then(() => {
      return this.set(
        'campaigns',
        this.get('campaigns').map(function (c) {
          if (c.id === id) {
            return _.extend(c, data);
          } else {
            return c;
          }
        }),
      );
    });
  }

  dismissCampaign(name, next) {
    const campaign = this.getCampaign(name);

    if (campaign == null) {
      return Promise.resolve().asCallback(next);
    }

    return this.updateCampaign(
      campaign.id,
      {
        isDismissed: true,
        dateDismissed: new Date(),
      },
      next,
    );
  }

  getCampaign(name) {
    const campaigns = this.get('campaigns' != null ? 'campaigns' : []);
    return _.find(campaigns, (campaign) => campaign.name === name);
  }

  hasCampaign(name) {
    return this.getCampaign(name) != null;
  }

  campaignIsDismissed(name) {
    const campaign = this.getCampaign(name);
    return campaign != null && campaign.dateDismissed !== null;
  }

  campaignIsActive(name) {
    return __guard__(this.getCampaign(name), (x) => x.dateDismissed) === null;
  }

  _oneTimeMessagesDismissedOverride() {
    return TrelloStorage.get('otmd');
  }

  _isOverridingOneTimeMessages() {
    return this._overridingOneTimeMessages != null
      ? this._overridingOneTimeMessages
      : (this._overridingOneTimeMessages =
          this._oneTimeMessagesDismissedOverride() != null);
  }

  isDismissed(name) {
    const dismissed = this._isOverridingOneTimeMessages()
      ? this._oneTimeMessagesDismissedOverride()
      : this.get('oneTimeMessagesDismissed');

    return dismissed != null && Array.from(dismissed).includes(name);
  }

  dismiss(name, next) {
    if (this.isDismissed(name) || !this.isLoggedIn()) {
      return typeof next === 'function' ? next() : undefined;
    }

    if (this._isOverridingOneTimeMessages()) {
      let left;
      TrelloStorage.set('otmd', [
        ...Array.from(
          (left = this._oneTimeMessagesDismissedOverride()) != null ? left : [],
        ),
        name,
      ]);
    }

    return this.addToSet('oneTimeMessagesDismissed', name, next);
  }

  recordDismissed(name) {
    return ApiPromise({
      url: `${this.urlRoot}/me/messagesDismissed`,
      type: 'post',
      data: {
        name,
      },
    })
      .then((data) => {
        return this.set('messagesDismissed', data.messagesDismissed);
      })
      .done();
  }

  dismissAd(adId) {
    return this.recordDismissed(`ad-${adId}`);
  }

  dismissSurveyById(surveyId) {
    return this.recordDismissed(`survey-${surveyId}`);
  }

  getDismissedAd(adId) {
    const messagesDismissed = this.get(
      'messagesDismissed' != null ? 'messagesDismissed' : [],
    );
    return _.find(
      messagesDismissed,
      (dismissedMessage) => dismissedMessage.name === `ad-${adId}`,
    );
  }

  getDismissedSurveys() {
    const messagesDismissed = this.get(
      'messagesDismissed' != null ? 'messagesDismissed' : [],
    );
    // Survey messages dismissed match format "survey-{SURVEY_ID}"
    return _.filter(messagesDismissed, (msg) => msg.name.match(/^survey-.*$/));
  }

  isAdDismissed(adId) {
    const dismissedAd = this.getDismissedAd(adId);
    if (dismissedAd) {
      return moment().diff(moment(dismissedAd.lastDismissed), 'days') <= 14;
    } else {
      return false;
    }
  }

  setDateFirstSawHighlights() {
    return this.recordDismissed('feedback-card-home-page-internal');
  }

  getDateFirstSawHighlights() {
    const messagesDismissed = this.get(
      'messagesDismissed' != null ? 'messagesDismissed' : [],
    );
    const feedbackCard = _.find(
      messagesDismissed,
      (dismissedMessage) =>
        dismissedMessage.name === 'feedback-card-home-page-internal',
    );
    if (!feedbackCard) {
      return null;
    } else {
      return feedbackCard.lastDismissed;
    }
  }

  shouldShowFeedbackCard() {
    if (this.isDismissed('homeFeedbackOrientationCard')) {
      return false;
    }

    const messagesDismissed = this.get(
      'messagesDismissed' != null ? 'messagesDismissed' : [],
    );
    const feedbackCard = _.find(
      messagesDismissed,
      (dismissedMessage) =>
        dismissedMessage.name === 'feedback-card-home-page-internal',
    );
    let days = 0;
    if (feedbackCard) {
      days = moment().diff(moment(feedbackCard.lastDismissed), 'days');
    }
    return days > 7;
  }

  dismissLanguageBannerFor(locale, next) {
    return this.dismiss(`new-lang-${locale}`, next);
  }

  shouldShowNewLanguageBannerFor(locale) {
    locale = Language.normalizeLocale(locale);
    return (
      !this.isDismissed(`new-lang-${locale}`) &&
      this.getLocale() !== locale &&
      Language.currentLocale !== locale &&
      Language.getMostPreferred([this.getLocale(), locale]) === locale
    );
  }

  toggleSubscribeOnComment() {
    return this.dismissAd('subscribeOnComment');
  }

  isSubscribeOnCommentEnabled() {
    let left;
    const dismissalCount =
      (left = __guard__(
        this.getDismissedAd('subscribeOnComment'),
        (x) => x.count,
      )) != null
        ? left
        : 0;
    // Overloading the dismissal count since messagesDismissed
    // does not allow for deletion.
    return dismissalCount % 2 === 0;
  }

  hasDismissedSince(name, period, count) {
    const messagesDismissed = this.get(
      'messagesDismissed' != null ? 'messagesDismissed' : [],
    );
    const message = _.find(
      messagesDismissed,
      (dismissedMessage) => dismissedMessage.name === name,
    );

    if (message) {
      return moment().diff(message.lastDismissed, period) < count;
    }

    return false;
  }

  shouldShowEnterpriseBannerFor(idEnterprise) {
    // don't show the banner if the user dismissed the banner in the past 30 days
    if (
      this.hasDismissedSince(
        `enterprise-license-banner-${idEnterprise}`,
        'days',
        30,
      )
    ) {
      return false;
    }
    return true;
  }

  dismissEnterpriseBannerFor(idEnterprise) {
    return this.recordDismissed(`enterprise-license-banner-${idEnterprise}`);
  }

  dismissAccountTransferBanner(next) {
    return this.dismiss(ACCOUNT_TRANSFER_BANNER_MESSAGE_NAME, next);
  }

  isAccountTransferBannerDismissed() {
    return this.isDismissed(ACCOUNT_TRANSFER_BANNER_MESSAGE_NAME);
  }

  dismissPersonalBoardsOwnershipBanner(next) {
    return this.dismiss(PERSONAL_BOARDS_OWNERSHIP_BANNER_MESSAGE_NAME, next);
  }

  isPersonalBoardOwnershipBannerDismissed() {
    return this.isDismissed(PERSONAL_BOARDS_OWNERSHIP_BANNER_MESSAGE_NAME);
  }

  owned() {
    return Auth.isMe(this);
  }

  getLocale() {
    if (this.getPref('locale')) {
      return Language.normalizeLocale(this.getPref('locale'));
    } else {
      return 'en';
    }
  }

  getLocales() {
    if (this.isLoggedIn()) {
      return [this.getLocale(), 'en'];
    } else {
      return Language.getPreferredLanguages();
    }
  }

  getMemberViewTitle() {
    const username = this.get('username');
    const fullName = this.get('fullName');
    const viewTitle = `${fullName} (${username})`;
    return viewTitle;
  }

  toggleColorBlindMode() {
    if (this.get('prefs') != null) {
      if (this.get('prefs').colorBlind) {
        this.setPref('colorBlind', false).save();
      } else {
        this.setPref('colorBlind', true).save();
      }
    }
  }

  addCurrentBoardToOrgs(currentBoard, organizations) {
    if (organizations[currentBoard.idOrganization]) {
      return organizations[currentBoard.idOrganization].boards.unshift(
        currentBoard,
      );
    } else {
      return (organizations[currentBoard.idOrganization] = {
        boards: [currentBoard],
        displayName: __guard__(
          this.modelCache.get('Organization', currentBoard.idOrganization),
          (x) => x.get('displayName'),
        ),
      });
    }
  }

  getOpenBoardsByOrg(editable, currentBoard) {
    let idOrg;
    const organizations = {};

    for (const board of Array.from(this.boardList.models)) {
      // Do this properly with board.editable when we get memberships working better
      if (board.isOpen()) {
        if (editable && board.get('myPermLevel') === 'observer') {
          continue;
        }
        const boardData = board.toJSON();

        // It's possible to be on a board that you can see the
        // idOrganization for even though you couldn't see the team.
        idOrg = board.getOrganization() != null ? boardData.idOrganization : '';

        if (organizations[idOrg] == null) {
          organizations[idOrg] = {
            boards: [],
            displayName:
              idOrg === ''
                ? l('member boards.boards')
                : __guard__(this.modelCache.get('Organization', idOrg), (x) =>
                    x.get('displayName'),
                  ),
          };
        }

        organizations[idOrg].boards.push(boardData);
      }
    }

    if (currentBoard) {
      this.addCurrentBoardToOrgs(currentBoard, organizations);
    }

    const idOrgsSorted = _.sortBy(_.keys(organizations), function (idOrg) {
      if (idOrg === '') {
        return '';
      } else {
        return organizations[idOrg].displayName;
      }
    });

    return (() => {
      const result = [];
      for (idOrg of Array.from(idOrgsSorted)) {
        result.push(organizations[idOrg]);
      }
      return result;
    })();
  }

  getOpenBoardsInEnterpriseByOrg(editable, idEnterprise, currentBoard) {
    let idOrg;
    const organizations = {};

    for (const board of [...Array.from(this.boardList.models), currentBoard]) {
      // Do this properly with board.editable when we get memberships working better
      if (board && board.isOpen()) {
        if (editable && board.get('myPermLevel') === 'observer') {
          continue;
        }
        const boardData = board.toJSON();

        const enterprise = board.getEnterprise();
        if (!enterprise || enterprise.id !== idEnterprise) {
          continue;
        }

        // It's possible to be on a board that you can see the
        // idOrganization for even though you couldn't see the team.
        const org = board.getOrganization();
        idOrg =
          (org != null ? org.get('idEnterprise') : undefined) === idEnterprise
            ? boardData.idOrganization
            : '';

        if (organizations[idOrg] == null) {
          organizations[idOrg] = {
            boards: [],
            displayName:
              idOrg === ''
                ? l('member boards.boards')
                : __guard__(this.modelCache.get('Organization', idOrg), (x) =>
                    x.get('displayName'),
                  ),
          };
        }

        organizations[idOrg].boards.push(boardData);
      }
    }

    const idOrgsSorted = _.sortBy(_.keys(organizations), function (idOrg) {
      if (idOrg === '') {
        return '';
      } else {
        return organizations[idOrg].displayName;
      }
    });

    return (() => {
      const result = [];
      for (idOrg of Array.from(idOrgsSorted)) {
        result.push(organizations[idOrg]);
      }
      return result;
    })();
  }

  getSortedOrgs() {
    return (
      _.clone(this.organizationList.models)
        // When a user is added to a team, the "sort" operation fails. This is because we're partially updating the state
        // so we end up receiving a team that doesn't yet have a displayName. The root cause should be solved, but by
        // filtering upfront this mitigates the customer impact for now.
        // https://trello.atlassian.net/browse/TRELP-2711
        .filter((a) => a.get('displayName') !== undefined)
        .sort((a, b) =>
          a.get('displayName').localeCompare(b.get('displayName')),
        )
    );
  }

  /**
   * Use hasPremiumFeatures to check feature enablement
   *
   * @deprecated
   */
  isFeatureEnabled(feature) {
    return ProductFeatures.isFeatureEnabled(feature, this.getProduct());
  }

  hasPremiumFeature(feature) {
    return (this.get('premiumFeatures') || []).includes(feature);
  }

  isGold() {
    return ProductFeatures.isGoldProduct(this.getProduct());
  }

  isPaidGold() {
    return (
      ProductFeatures.isGoldProduct(this.getProduct()) &&
      ProductFeatures.getProductName(this.getProduct()) !==
        ProductName.TrelloGoldFromBC
    );
  }

  isInAnyBCOrganization() {
    return this.organizationList.any(
      (org) => org.isPremium() && !org.isStandard(),
    );
  }

  isInAnyStandardOrganization() {
    return this.organizationList.any((org) => org.isStandard());
  }

  hasMemberOrOrgAccount() {
    return this.isGold() || this.organizationList.any((org) => org.isPremium());
  }

  allCustomEmoji() {
    const allEmoji = {};
    if (
      this.hasPremiumFeature('customEmoji') ||
      this.organizationList?.models?.some((org) =>
        org?.hasPremiumFeature('customEmoji'),
      )
    ) {
      for (const emoji of Array.from(this.customEmojiList.models)) {
        allEmoji[emoji.get('name')] = emoji.get('url');
      }
    }

    return allEmoji;
  }

  toJSON(opts) {
    if (opts == null) {
      opts = {};
    }
    const data = super.toJSON(...arguments);
    if (opts.hasPassword) {
      data.hasPassword = Array.from(data.loginTypes).includes('password');
    }

    data.viewTitle = this.getMemberViewTitle();

    return this.handleNonPublicFields(data);
  }

  editing(msg) {
    if (msg == null) {
      msg = {};
    }
    if (_.isEqual(msg, this.lastMessage)) {
      return;
    }

    this.lastMessage = msg;

    clearTimeout(this.clearLastTimeout);

    this.clearLastTimeout = this.setTimeout(() => {
      return (this.lastMessage = null);
    }, EDITING_AUTO_CLEAR_MS / 2);

    if (Auth.isLoggedIn()) {
      return ApiAjax({
        url: `${this.urlRoot}/${this.id}/editing`,
        type: 'post',
        background: true,
        data: _.clone(msg),
      });
    }
  }

  removeMembershipConfirmationKey(model) {
    const isOrg = model.typeName === 'Organization';
    if (Auth.isMe(this)) {
      if (isOrg) {
        return 'leave org';
      } else {
        return 'leave board';
      }
    } else {
      if (isOrg) {
        return 'remove member from org';
      } else if (model.isDeactivated(this)) {
        return 'remove deactivated member from board';
      } else {
        return 'remove member from board';
      }
    }
  }

  unreadNotifications() {
    return getUnreadNotifications(this, this.notificationsSeenState);
  }

  setNotifications({ notifications, setFn, errorFn, data }) {
    _.forEach(notifications, setFn);

    return ApiAjax({
      url: '/1/notifications/all/read',
      type: 'post',
      retry: false,
      data,
      error() {
        return _.forEach(notifications, errorFn);
      },
    });
  }

  clearAllNotifications() {
    const unreadNotifications = this.modelCache
      .all('Notification')
      .filter((notification) => notification.get('unread'));
    const dateRead = new Date();
    const oldCount = this.get('notificationsCount');

    this.setNotifications({
      notifications: unreadNotifications,
      setFn(notif) {
        return notif.set({
          dateRead,
          unread: false,
        });
      },
      errorFn: (notif, i) => {
        if (i === 0) {
          this.set('notificationsCount', oldCount);
        }
        return notif.set({
          dateRead: null,
          unread: true,
        });
      },
    });

    this.set('notificationsCount', {});
  }

  initializeDesktopNotifications() {
    let left;
    this.idLastDesktopNotification =
      (left = _.chain(this.modelCache.all('Notification'))
        .pluck('id')
        .compact()
        .sort()
        .last()
        .value()) != null
        ? left
        : '';

    return this.listenTo(
      this.modelCache,
      'add:Notification',
      this.showDesktopNotification,
    );
  }

  initializeNotifications() {
    // Dependency required at call site to avoid import cycles, do not lift to top of module
    const { ModelLoader } = require('app/scripts/db/model-loader');

    if (!Auth.isLoggedIn()) {
      return;
    }
    const pageSize = Notification.PAGE_SIZE;

    const initialLoad = isNotificationFilterVisibilityAll()
      ? ModelLoader.loadMoreNotificationGroupData(pageSize)
      : ModelLoader.loadMoreUnreadNotifications(pageSize);
    this.loadNotificationsCount().then(() => {
      return initialLoad.then(() => {
        return this.initializeDesktopNotifications();
      });
    });

    return (this.notificationsSeenState = new NotificationsSeenState(this));
  }

  loadNotificationsCount() {
    // Dependency required at call site to avoid import cycles, do not lift to top of module
    const { ModelLoader } = require('app/scripts/db/model-loader');

    return ModelLoader.loadMemberNotificationsCount().then(
      (notificationsCount) => {
        return this.set('notificationsCount', notificationsCount);
      },
    );
  }

  // Ensures that all notifications in the Model Cache have an appropriate group
  ensureGroup() {
    // Dependency required at call site to avoid import cycles, do not lift to top of module
    const { ModelLoader } = require('app/scripts/db/model-loader');

    let idCards = this.modelCache
      .all('Notification')
      .map((notification) =>
        __guard__(
          __guard__(notification.get('data'), (x1) => x1.card),
          (x) => x.id,
        ),
      )
      .filter((idCard) => idCard != null);
    idCards = _.uniq(idCards);

    const idCardGroups = this.modelCache
      .all('NotificationGroup')
      .map((group) => group.get('id'))
      .filter((idGroup) => idGroup.startsWith('Card:'))
      .map((idGroup) => idGroup.replace('Card:', ''));

    const needToFetch = _.difference(idCards, idCardGroups);
    if (needToFetch.length > 0) {
      return ModelLoader.loadNotificationGroups(needToFetch);
    }
  }

  // Ensures translation for custom action based notifications are loaded
  ensureTranslations(notification) {
    if (notification?.get('display')) {
      refreshIfMissing(notification.get('display').translationKey);
    }
  }

  updateNotificationCount(eventType) {
    return (notification) => {
      if (notification != null) {
        let isNew;
        const idCard = __guard__(
          __guard__(notification.get('data'), (x1) => x1.card),
          (x) => x.id,
        );
        const notificationsCount = _.clone(this.get('notificationsCount'));
        const notifType =
          idCard != null
            ? `Card:${idCard}`
            : `Notification:${notification.get('id')}`;

        if (notificationsCount[notifType] == null) {
          notificationsCount[notifType] = 0;
        }
        const isUnread = notification.get('unread');
        switch (eventType) {
          case 'add':
            isNew = !this.modelCache
              .all('Notification')
              .some((n) => n.get('id') > notification.get('id'));
            if (isUnread && isNew) {
              notificationsCount[notifType]++;
            } else if (!isNew) {
              notificationsCount[notifType]--;
            }
            break;
          case 'change':
            if (isUnread) {
              notificationsCount[notifType]++;
            } else {
              notificationsCount[notifType]--;
            }
            break;
          case 'delete':
            if (isUnread) {
              notificationsCount[notifType]--;
            }
            break;
        }

        return this.set(
          'notificationsCount',
          _.pick(notificationsCount, _.identity),
        );
      }
    };
  }

  showDesktopNotification(notification) {
    // Dependency required at call site to avoid import cycles, do not lift to top of module
    const { ModelLoader } = require('app/scripts/db/model-loader');

    if (!DesktopNotification.isEnabled()) {
      return;
    }

    // Only do a desktop notification if this notification is *newer* than the
    // last one we've seen
    if (notification.id <= this.idLastDesktopNotification) {
      return;
    }

    this.idLastDesktopNotification = notification.id;

    return Promise.try(function () {
      // It's possible that we've just re-connected our websocket and we're
      // receiving old notifications.  This commonly happens when a laptop
      // wakes up.
      const delta = Date.now() - Time.serverToClient(notification.get('date'));
      if (delta < Util.getMs({ minutes: 1 })) {
        // The notification just happened, so consider the notification to
        // be current
        return notification;
      } else {
        // The notification happened a while ago, so it's possible that
        // it's actually been read.  Fetch the latest version of the
        // notification
        return ModelLoader.loadNotification(notification.id);
      }
    })
      .then(function (latestNotification) {
        if (latestNotification.get('unread')) {
          return new DesktopNotification({
            id: latestNotification.get('id'),
            type: latestNotification.get('type'),
            unread: latestNotification.get('unread'),
            data: latestNotification.get('data'),
            memberCreator: latestNotification.get('memberCreator'),
            display: latestNotification.get('display'),
            markRead: latestNotification.markRead.bind(latestNotification),
            getUrl: latestNotification.getUrlOfTarget.bind(latestNotification),
          });
        }
      })
      .done();
  }

  getMobileTempPassword(next) {
    ApiAjax({
      url: '/1/members/me/loginToken',
      type: 'post',
      data: {
        mode: 'password',
      },
      success(data) {
        return next(data.password);
      },
    });
  }

  maxFileSize(org) {
    if (
      this.hasPremiumFeature('largeAttachments') ||
      org?.hasPremiumFeature('largeAttachments')
    ) {
      return 250 * 1024 * 1024;
    } else {
      return 10 * 1024 * 1024;
    }
  }

  canUploadAttachment(file, org) {
    return file.size < this.maxFileSize(org);
  }

  accountNewerThan(date) {
    return Util.idToDate(this.id) > date;
  }

  isNewMember() {
    return moment().diff(moment(Util.idToDate(this.id)), 'days') < 7;
  }

  getShowDetails() {
    let left;
    return (left = TrelloStorage.get('showDetails')) != null
      ? left
      : this.accountNewerThan(HIDE_DETAILS_DEFAULT_DATE)
      ? false
      : true;
  }

  setShowDetails(value) {
    return TrelloStorage.set('showDetails', value);
  }

  getEnterprise() {
    return this.modelCache.get('Enterprise', this.get('idEnterprise'));
  }

  // For managed and licensed members of an enterprise, teamless (personal)
  // boards may be restricted to certain visibilities.
  allowedTeamlessBoardVisibilities() {
    const visibilities = ['private', 'public'];
    if (this.isPaidManagedEntMember()) {
      const enterprise = this.getEnterprise();
      if (enterprise) {
        return visibilities.filter((vis) =>
          enterprise.canSetTeamlessBoardVisibility(vis),
        );
      }
    }
    return visibilities;
  }

  // This is due to do the great Map debacle of 2019. Historically, we stored
  // product information in an object, which can only key by string. It
  // was refactored to use a Map instead, which can have keys of any type. We
  // only ever have one product in an array, so e.g. [111].toString() === 111.
  // However, with a map, it becomes map.get([111]), which does not exist. Thus,
  // we retrieve the first element in the array and use that as the key, since
  // that is what the map will have. I hate JavaScript.
  getProduct() {
    return __guard__(this.get('products'), (x) => x[0]);
  }

  missedTransferDate() {
    return this.get('missedTransferDate');
  }

  hasPaidOrgPowerUps() {
    return this.organizationList.any((org) => org.hasPremiumFeature('plugins'));
  }

  // Get the number of power-ups a user is allowed to turn on for a board
  getPowerUpsLimit(org) {
    // All members and orgs should be have the "plugins" feature string,
    // effectively giving everyone unlimited Power-Ups everywhere.
    if (
      org?.hasPremiumFeature('plugins') ||
      this.hasPaidOrgPowerUps() ||
      this.hasPremiumFeature('plugins')
    ) {
      return Infinity;
    } else if (
      org?.hasPremiumFeature('threePlugins') ||
      this.hasPremiumFeature('threePlugins')
    ) {
      return 3;
    } else {
      return 1;
    }
  }

  isPaidManagedEntMember() {
    return isPaidManagedEnterpriseMember({
      confirmed: this.get('confirmed'),
      idEnterprise: this.get('idEnterprise'),
      enterpriseLicenses: this.get('enterpriseLicenses'),
    });
  }

  oldestAdminedTeam() {
    const { ModelLoader } = require('app/scripts/db/model-loader');
    return ModelLoader.loadMemberOrganizationsMemberships(this.get('id')).then(
      () => {
        return this.organizationList.find((org) => {
          return org.ownedByMember(this);
        });
      },
    );
  }

  isManagedEntMemberOf(idEnterprise) {
    return (
      this.get('confirmed') &&
      this.get('idEnterprise') &&
      this.get('idEnterprise') === idEnterprise
    );
  }

  isEnterpriseAdmin() {
    return (
      this.get('confirmed') &&
      __guard__(this.get('idEnterprisesAdmin'), (x) => x.length) > 0
    );
  }

  isEnterpriseAdminOf(enterprise) {
    return (
      this.isEnterpriseAdmin() &&
      this.get('idEnterprisesAdmin').indexOf(enterprise.id) >= 0
    );
  }

  isSSOOnly() {
    let enterprise;
    const idEnterprise = this.get('idEnterprise');

    if (
      idEnterprise &&
      (enterprise = this.modelCache.get('Enterprise', idEnterprise)) != null
    ) {
      return enterprise.get('prefs').ssoOnly;
    } else {
      return false;
    }
  }

  shouldShowMarketingOptIn() {
    // Show marketing opt in survey if the account is confirmed, more than
    // 3 days old, and hasn't previously set marketingOptIn

    return (
      this.get('confirmed') &&
      new Date() - Util.idToDate(this.id) > Util.getMs({ days: 3 }) &&
      !__guard__(this.get('marketingOptIn'), (x) => x.date)
    );
  }

  setMarketingOptIn(optedIn) {
    return this.update('marketingOptIn/optedIn', optedIn, function () {});
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
    return this.pluginDataList.dataForPlugin(idPlugin);
  }

  getPluginDataByKey(idPlugin, visibility, key, defaultVal) {
    return this.pluginDataList.getPluginDataByKey(
      idPlugin,
      visibility,
      key,
      defaultVal,
    );
  }

  clearPluginData(idPlugin) {
    return __guard__(this.pluginDataList.for(idPlugin, 'private'), (x) =>
      x.destroy(),
    );
  }

  snoopPluginData(idPlugin) {
    return this.pluginDataList.snoopDataForPlugin(idPlugin);
  }

  fetchEnterpriseUserType(enterpriseId) {
    // Dependency required at call site to avoid import cycles, do not lift to top of module
    const { ModelLoader } = require('app/scripts/db/model-loader');
    return ModelLoader.loadMemberEnterpriseUserType(
      enterpriseId,
      this.get('id'),
    );
  }

  fetchEnterpriseActive(enterpriseId) {
    // Dependency required at call site to avoid import cycles, do not lift to top of module
    const { ModelLoader } = require('app/scripts/db/model-loader');
    return ModelLoader.loadMemberEnterpriseActive(enterpriseId, this.get('id'));
  }

  shouldShowNoticeOfTosChange() {
    // Show notice of ToS change if the user's account was created before
    // November 1, 2018 and the user has not already dismissed the message by
    // clicking "I Agree"
    const messagesDismissed = this.get(
      'messagesDismissed' != null ? 'messagesDismissed' : [],
    );
    return (
      new Date(2018, 10, 1) > Util.idToDate(this.id) &&
      !_.contains(
        _.pluck(messagesDismissed, 'name'),
        '1-nov-2018-tos-change-accepted',
      )
    );
  }

  agreeToAndDismissTosChange() {
    return this.recordDismissed('1-nov-2018-tos-change-accepted');
  }

  // Privacy
  loadNonPublicFields() {
    // Dependency required at call site to avoid import cycles, do not lift to top of module
    const { ModelLoader } = require('app/scripts/db/model-loader');
    if (!this.loadingNonPublicFields) {
      this.loadingNonPublicFields = true;
      ModelLoader.loadMemberNonPublicFields(this.get('id'))
        .then(() => {
          return this.nonPublicFields.forEach((field) => {
            return this.trigger(`change:${field}`);
          });
        })
        .finally(() => {
          return (this.loadingNonPublicFields = false);
        });
    }
  }

  nonPublicAvailableChanged() {
    const nonPublicAvailable = this.get('nonPublicAvailable');
    const nonPublic = this.get(this.nonPublicKey);

    // We have received a hint that there's a change in non public fields so
    // let's fetch them to get the latest, but only if we don't have any already
    if (nonPublicAvailable && nonPublic == null) {
      this.loadNonPublicFields();

      // The hint is false, this means non public field information is no longer
      // available, we need to clear any data on this member model to clear any
      // cached sensitive information.
    } else if (!nonPublicAvailable) {
      this.unset(this.nonPublicKey);
    }
  }

  nonPublicModifiedChanged() {
    const nonPublicModified = this.get('nonPublicModified');

    // We have received a hint that there's a change in non public fields so
    // let's fetch them to get the latest regardless of what we already have
    if (nonPublicModified) {
      this.loadNonPublicFields();

      // It's important to unset nonPublicModified so that it will cause
      // a re-trigger of the change event again, even if it stays as true
      this.unset('nonPublicModified', { silent: true });
    }
  }

  shouldShowEnterpriseDeprovisioningBannerFor(idEnterprise) {
    // don't show the banner if we have checked or shown the banner in the last
    // hour, or if the user dismissed the banner in the past 24 hours
    if (
      this.hasDismissedSince(
        `enterprise-deprovisioning-banner-shown-${idEnterprise}`,
        'hours',
        1,
      )
    ) {
      return false;
    }
    if (
      this.hasDismissedSince(
        `enterprise-deprovisioning-banner-checked-${idEnterprise}`,
        'hours',
        1,
      )
    ) {
      return false;
    }
    if (
      this.hasDismissedSince(
        `enterprise-deprovisioning-banner-${idEnterprise}`,
        'hours',
        24,
      )
    ) {
      return false;
    }

    return true;
  }

  recordEnterpriseDeprovisioningBannerCheckedFor(idEnterprise) {
    return this.recordDismissed(
      `enterprise-deprovisioning-banner-checked-${idEnterprise}`,
    );
  }

  recordEnterpriseDeprovisioningBannerShownFor(idEnterprise) {
    return this.recordDismissed(
      `enterprise-deprovisioning-banner-shown-${idEnterprise}`,
    );
  }

  dismissEnterpriseDeprovisioningBannerFor(idEnterprise) {
    return this.recordDismissed(
      `enterprise-deprovisioning-banner-${idEnterprise}`,
    );
  }

  canCreateBoardIn(org) {
    return (
      !org ||
      !this.isPaidManagedEntMember() ||
      (org != null ? org.belongsToRealEnterprise() : undefined)
    );
  }

  isEnterpriseMemberOnNonEnterpriseTeam() {
    return (
      this.isPaidManagedEntMember() &&
      this.organizationList.models.some(
        (org) => !org.get('idEnterprise') || org.isBCPO(),
      )
    );
  }

  getMaxPaidStatus() {
    if (this.enterpriseList != null ? this.enterpriseList.length : undefined) {
      return 'enterprise';
    } else if (this.isInAnyBCOrganization()) {
      return 'bc';
    } else if (this.isInAnyStandardOrganization()) {
      return 'standard';
    } else if (this.isGold()) {
      return 'gold';
    } else {
      return 'free';
    }
  }

  getEmailDomain() {
    return getEmailDomain(this.get('email'));
  }

  getBestOrganization() {
    const me = Auth.me();

    // First look by free boards remaining
    const bestOrg =
      me.organizationList != null
        ? me.organizationList.models
            .filter((org) => org.getFreeBoardsRemaining() !== null)
            .sort(
              (a, b) => a.getFreeBoardsRemaining() - b.getFreeBoardsRemaining(),
            )[0]
        : undefined;

    if (bestOrg != null) {
      return bestOrg;
    }

    // Use number of boards per org as backup b/c limits can be null
    const nextBestOrg =
      me.organizationList != null
        ? me.organizationList.models.sort(
            (a, b) =>
              __guard__(b.get('boardList'), (x) => x.length) -
              __guard__(a.get('boardList'), (x1) => x1.length),
          )[0]
        : undefined;

    if (nextBestOrg != null) {
      return nextBestOrg;
    }

    return me.organizationList.models[0] || null;
  }
}
Member.initClass();

_.extend(Member.prototype, LimitMixin, NonPublicMixin);

module.exports.Member = Member;
