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
 * DS204: Change includes calls to have a more natural evaluation order
 * DS205: Consider reworking code to avoid use of IIFEs
 * DS206: Consider reworking classes to avoid initClass
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const { ApiAjax } = require('app/scripts/network/api-ajax');
const { ApiError } = require('app/scripts/network/api-error');
const { ApiPromise } = require('app/scripts/network/api-promise');
const { Auth } = require('app/scripts/db/auth');
const { Urls } = require('app/scripts/controller/urls');
const { getOrganizationInvitationLinkUrl, getOrganizationUrl } = Urls;
const { Member } = require('app/scripts/models/member');
const { LimitMixin } = require('app/scripts/lib/limit-mixin');
const {
  MembershipModel,
} = require('app/scripts/models/internal/membership-model');
const {
  ModelWithPreferences,
} = require('app/scripts/models/internal/model-with-preferences');
const { ProductFeatures, Products } = require('@trello/product-features');
const { AttachmentTypes } = require('app/scripts/data/attachment-types');
const Promise = require('bluebird');
const SlackAjax = require('app/scripts/network/slack-ajax');
const { TagList } = require('app/scripts/models/collections/tag-list');
const {
  PluginDataList,
} = require('app/scripts/models/collections/plugin-data-list');
const {
  attachmentTypeFromUrl,
} = require('app/scripts/lib/util/url/attachment-type-from-url');
const _ = require('underscore');
const {
  slackTrelloDomain,
  slackTrelloMicrosDomain,
} = require('@trello/config');
const { Analytics, getScreenFromUrl } = require('@trello/atlassian-analytics');
const {
  BoardInviteRestrictValues,
} = require('app/scripts/views/organization/constants');
const {
  canSetVisibilityOnBoard,
  canAddBoardToOrganization,
  getFreeTrialProperties,
  hasFreeTrialCredit,
} = require('@trello/organizations');
const { importWithRetry } = require('@trello/use-lazy-component');
const { featureFlagClient } = require('@trello/feature-flag-client');

const isSlackTrelloOnMicros = featureFlagClient.get(
  'product-integrations.trello-slack-micros',
  false,
);
const slackTrelloBaseUrl = isSlackTrelloOnMicros
  ? slackTrelloMicrosDomain
  : slackTrelloDomain;

let getMemberFromUser = undefined;

function __guard__(value, transform) {
  return typeof value !== 'undefined' && value !== null
    ? transform(value)
    : undefined;
}

class Organization extends ModelWithPreferences {
  static initClass() {
    this.prototype.typeName = 'Organization';
    this.prototype.nameAttr = 'displayName';
    this.prototype.urlRoot = '/1/organizations';

    this.lazy({
      invitationList() {
        // Dependency required at call site to avoid import cycles, do not lift to top of module
        const {
          OrganizationInvitationList,
        } = require('app/scripts/models/collections/OrganizationInvitationList');
        return new OrganizationInvitationList([]);
      },
      boardList() {
        // Dependency required at call site to avoid import cycles, do not lift to top of module
        const {
          BoardList,
        } = require('app/scripts/models/collections/board-list');
        return new BoardList().syncModel(this, 'idBoards');
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
            // The only admins of organizations are those flagged as such on the
            // memberships subdoc.
            const isActiveAdmin = ({ memberType, deactivated }) =>
              // NOTE: Can't check for deactivated == false; deactivated might not
              // be set, e.g. for non BC orgs
              memberType === 'admin' && !deactivated;
            return _.pluck(_.filter(memberships, isActiveAdmin), 'idMember');
          },
        });
      },
      collaboratorList() {
        // Dependency required at call site to avoid import cycles, do not lift to top of module
        const {
          MemberList,
        } = require('app/scripts/models/collections/member-list');
        return new MemberList().syncModel(this, 'collaborators', {
          fxGetIds(member) {
            return _.pluck(member, 'id');
          },
        });
      },
      tagList() {
        return new TagList().syncSubModels(this, 'tags');
      },
      pluginDataList() {
        return new PluginDataList([], {
          scopeModel: this,
        }).syncCache(this.modelCache, [], (pluginData) => {
          return (
            pluginData.get('idModel') === this.id &&
            pluginData.get('scope') === 'organization'
          );
        });
      },
    });

    this.prototype.prefNames = [
      'permissionLevel',
      'boardInviteRestrict',
      'orgInviteRestrict',
      'boardVisibilityRestrict',
      'boardDeleteRestrict',
    ];

    // checks to see if input is already a member
    getMemberFromUser = function (user) {
      if (user != null ? user.id : undefined) {
        if (!user.idOrganizations && user.attributes) {
          user.idOrganizations = user.attributes.idOrganizations || [];
        }
        return Promise.resolve(user);
      } else if (_.isString(user)) {
        // need to fetch member
        return ApiPromise({
          method: 'get',
          url: `/1/members/${user}`,
          data: { fields: 'idOrganizations' },
        }).catch(ApiError.NotFound, (err) => null);
      } else {
        return Promise.resolve(null);
      }
    };
  }

  initialize() {
    super.initialize();

    return (this._slackAssociation = null);
  }

  editable() {
    return this.ownedByMember(Auth.me());
  }

  isPublic() {
    return this.getPref('permissionLevel') === 'public';
  }

  /**
   * For feature checks, use:
   * - hasPremiumFeature(featureKey)
   *
   * For product checks, use one of the following:
   * - isStandard()
   * - isBusinessClass()
   * - belongsToRealEnterprise()
   * - isEnterprise()
   * - getPaidStatus()
   *
   * @deprecated
   */
  isPremium() {
    return ProductFeatures.hasProduct(this.getProduct());
  }

  isStandard() {
    return ProductFeatures.isStandardProduct(this.getProduct());
  }

  isBusinessClass() {
    return ProductFeatures.isBusinessClassProduct(this.getProduct());
  }

  isRetiredBusinessClass() {
    return ProductFeatures.isRetiredBusinessClassProduct(this.getProduct());
  }

  // note: this is identical to isRealEnterprise in models/enterprise.js
  belongsToRealEnterprise() {
    return ProductFeatures.isEnterpriseProduct(this.getProduct());
  }

  isEnterprise() {
    return this.get('idEnterprise') != null;
  }

  paysWithPurchaseOrder() {
    return ProductFeatures.usesPurchaseOrder(this.getProduct());
  }

  needsBCUpgrade() {
    return (
      _.intersection(
        [
          Products.Organization.BusinessClass.current.monthly,
          Products.Organization.BusinessClass.current.yearly,
        ],
        this.get('products'),
      ).length === 0 && !this.isEnterprise()
    );
  }

  isBCPO() {
    return (
      ProductFeatures.isBusinessClassProduct(this.getProduct()) &&
      ProductFeatures.usesPurchaseOrder(this.getProduct())
    );
  }

  isGrandfatheredBoardLimit() {
    const limit = this.getFreeBoardLimit();

    if ((limit != null ? limit.disableAt : undefined) > 10) {
      return true;
    }
    return false;
  }

  ownedByMember(member) {
    return this.getMemberType(member) === 'admin';
  }

  canAddBoard(board) {
    // Delegate to our extracted typescript business logic
    return canAddBoardToOrganization({
      org: this.toJSON(),
      board: board.toJSON(),
      isOrgAdmin: this.owned(),
    });
  }

  canDeleteBoard(board) {
    const vis = board.get('prefs').permissionLevel;
    const pref = this.get('prefs').boardDeleteRestrict[vis];

    return !pref || pref === 'org' || (pref === 'admin' && this.owned());
  }

  canSetVisibility(vis) {
    // Delegate to our extracted typescript business logic
    return canSetVisibilityOnBoard({
      org: this.toJSON(),
      boardVisibility: vis,
      isOrgAdmin: this.owned(),
    });
  }

  owned() {
    return this.getMemberType(Auth.me()) === 'admin';
  }

  isLinkedToGoogleApps() {
    return (
      this.isFeatureEnabled('googleApps') && this.get('prefs').associatedDomain
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

  snoopIsFeatureEnabled(feature) {
    return this.snoop('products')
      .map(() => this.isFeatureEnabled(feature))
      .distinct();
  }

  toJSON(opts) {
    if (opts == null) {
      opts = {};
    }
    const data = super.toJSON(...arguments);

    if (opts.url) {
      data.url = getOrganizationUrl(this.get('name'));
    }

    return data;
  }

  getPermLevel() {
    return this.get('prefs').permissionLevel;
  }

  getAvailableRoles() {
    if (this.hasPremiumFeature('superAdmins')) {
      return ['superadmin', 'normal'];
    } else {
      return ['admin', 'normal'];
    }
  }

  hasObservers() {
    return false;
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

  snoopPluginData(idPlugin) {
    return this.pluginDataList.snoopDataForPlugin(idPlugin);
  }

  getPluginCount() {
    return ApiPromise({
      url: `/1/organizations/${this.id}/plugins`,
      method: 'GET',
    }).then((plugins) => {
      return plugins.length;
    });
  }

  getPublicBoardCount() {
    return ApiPromise({
      url: `/1/organizations/${this.id}/boards`,
      method: 'GET',
      data: {
        filter: 'public',
        fields: 'id',
      },
    }).then((publicBoards) => {
      return publicBoards.length;
    });
  }

  invitationUrl(secret) {
    return getOrganizationInvitationLinkUrl(secret);
  }

  boardMembershipRestricted() {
    return (
      this.isFeatureEnabled('inviteBoard') &&
      this.getPref('boardInviteRestrict') &&
      this.getPref('boardInviteRestrict') !== BoardInviteRestrictValues.ANY
    );
  }

  onlyOrgMembers() {
    return (
      this.isFeatureEnabled('inviteBoard') &&
      this.getPref('boardInviteRestrict') &&
      this.getPref('boardInviteRestrict') === BoardInviteRestrictValues.ORG
    );
  }

  onlyManagedMembers() {
    return (
      this.isFeatureEnabled('inviteBoard') &&
      this.getPref('boardInviteRestrict') &&
      this.getPref('boardInviteRestrict') === BoardInviteRestrictValues.MANAGED
    );
  }

  onlyOrgOrManagedMembers() {
    return (
      this.isFeatureEnabled('inviteBoard') &&
      this.getPref('boardInviteRestrict') &&
      this.getPref('boardInviteRestrict') ===
        BoardInviteRestrictValues.ORG_OR_MANAGED
    );
  }

  changeMemberRole(member, opts) {
    if (opts.type != null) {
      this.setOnMembership(member, { memberType: opts.type });
    }

    return ApiPromise({
      type: 'PUT',
      url: `/1/${this.typeName.toLowerCase()}/${this.id}/members/${member.id}`,
      data: opts,
    }).then(() =>
      Analytics.sendTrackEvent({
        action: 'updated',
        actionSubject: 'role',
        source: getScreenFromUrl(),
        containers: {
          workspace: {
            id: this.id,
          },
          enterprise: {
            id: this.getEnterprise()?.id,
          },
        },
        attributes: {
          updatedOn: 'member',
          value: opts.type,
        },
      }),
    );
  }

  // Copied inline from membership-model mixin in sake of bulk decaf.
  // Partially duplicates the corresponding method from board model
  reactivateMember(member) {
    this.setOnMembership(member, { deactivated: false });

    return this.addMembers(member, { reactivate: true }).then((grouped) => {
      if (!grouped[grouped._categories.ADDED]) {
        this.setOnMembership(member, { deactivated: true });
      }
      return grouped;
    });
  }

  deactivateMember(member, traceId, onSuccess, onError) {
    ApiAjax({
      url: `/1/organizations/${this.id}/members/${member.id}/deactivated`,
      type: 'PUT',
      data: {
        value: true,
      },
      traceId,
      success: () => {
        Analytics.sendTrackEvent({
          action: 'deactivated',
          actionSubject: 'member',
          source: getScreenFromUrl(),
          containers: {
            workspace: {
              id: this.id,
            },
            enterprise: {
              id: this.getEnterprise()?.id,
            },
          },
          attributes: {
            taskId: traceId,
          },
        });

        onSuccess();
      },
      error(xhr) {
        const errorMessage = ApiError.parseErrorMessage(xhr);
        const error = ApiError.fromResponse(xhr.status, errorMessage);

        onError(error);
      },
    });

    this.setOnMembership(member, { deactivated: true });
  }

  addMember(member) {
    // Enterprise admins will have a memberType of 'admin' even if they are
    // not real members of the team.
    const type = this.getMemberType(member) === 'admin' ? 'admin' : 'normal';

    return ApiPromise({
      url: `/1/organizations/${this.id}/members/${member.id}`,
      type: 'put',
      data: { type, acceptUnconfirmed: true },
      dataType: 'json',
    }).then((data) => {
      if (
        data.token == null &&
        !this.memberList.find((m) => m.id === member.id)
      ) {
        this.memberList.add(member);
        Analytics.sendTrackEvent({
          action: 'added',
          actionSubject: 'member',
          source: getScreenFromUrl(),
          containers: {
            workspace: {
              id: this.id,
            },
            enterprise: {
              id: this.getEnterprise()?.id,
            },
          },
          attributes: {
            role: 'member',
          },
        });
      }
    });
  }

  updateBulkAddMemberErrors(errorCategories) {
    const existingErrors = this.get('bulkAddMemberErrors');
    let errorMessages = null;
    let changed = false;

    // null clears errors
    if (errorCategories === null && existingErrors) {
      changed = true;
    } else {
      if (existingErrors) {
        for (const category of Array.from(
          _.values(existingErrors._categories),
        )) {
          if (
            (errorCategories[category] != null
              ? errorCategories[category].length
              : undefined) > 0
          ) {
            existingErrors[category] = _.union(
              existingErrors[category] || [],
              errorCategories[category],
            );
          }
        }
        errorMessages = existingErrors;
        changed = true;
      } else if (
        !_.isEmpty(_.omit(errorCategories, '_categories', '_categoryOrder'))
      ) {
        errorMessages = errorCategories;
        changed = true;
      }
    }

    // don't want to trigger a react update if there's no change
    if (changed) {
      this.set('bulkAddMemberErrors', errorMessages);
      return this.trigger('change:bulkAddMemberErrors');
    }
  }

  getBulkAddMemberErrors() {
    return this.get('bulkAddMemberErrors');
  }

  addMembers(users, options, progressHandler) {
    if (typeof options === 'function') {
      progressHandler = options;
      options = undefined;
    }

    const CATEGORIES = {
      RESTRICTED: 'restricted',
      MUST_REACTIVATE: 'must-reactivate',
      USERNAME_NOT_FOUND: 'username-not-found',
      NOT_IN_ENTERPRISE: 'not-in-enterprise',
      NO_ENTERPRISE_LICENSES: 'no-enterprise-licenses',
      RATE_LIMIT: 'rate-limit-exceeded',
      UNKNOWN: 'unknown',
      EXISTING: 'existing',
      ADDED: 'added',
      TOO_MANY_MEMBERS: 'too-many-members',
      MEMBER_TOO_MANY_ORGS: 'member-too-many-orgs',
      DEACTIVATED_IN_THE_ENTERPRISE: 'deactivated-in-the-enterprise',
      MUST_BE_MANAGED_ENT_MEMBER_OR_VALID_EMAIL:
        'not-managed-ent-member-or-valid-email',
      MUST_BE_MANAGED_ENT_MEMBER: 'not-managed-ent-member',
      MEMBERSHIPS_TOO_MANY_UNCONFIRMED_INVITATIONS: 'member-unconfirmed',
    };

    // This is the order the errors are displayed; sorted by most to least interesting
    const CATEGORY_ORDER = [
      CATEGORIES.RESTRICTED,
      CATEGORIES.MUST_REACTIVATE,
      CATEGORIES.USERNAME_NOT_FOUND,
      CATEGORIES.NOT_IN_ENTERPRISE,
      CATEGORIES.NO_ENTERPRISE_LICENSES,
      CATEGORIES.UNKNOWN,
      CATEGORIES.EXISTING,
      CATEGORIES.TOO_MANY_MEMBERS,
      CATEGORIES.MEMBER_TOO_MANY_ORGS,
      CATEGORIES.DEACTIVATED_IN_THE_ENTERPRISE,
      CATEGORIES.MUST_BE_MANAGED_ENT_MEMBER_OR_VALID_EMAIL,
      CATEGORIES.MUST_BE_MANAGED_ENT_MEMBER,
      CATEGORIES.ADDED,
      CATEGORIES.MEMBERSHIPS_TOO_MANY_UNCONFIRMED_INVITATIONS,
    ];

    const emailRegex = /^[^@]+@[a-z0-9-]+(\.[a-z0-9-]+)+$/i;
    users = users.length != null ? users : [users];

    const updateProgress = (completed) =>
      typeof progressHandler === 'function'
        ? progressHandler({ completed, length: users.length })
        : undefined;

    let completed = 0;
    updateProgress(completed);

    return Promise.map(
      users,
      (user) => {
        return getMemberFromUser(user)
          .then((member) => {
            let type;
            if (member != null) {
              if (Array.from(member.idOrganizations).includes(this.id)) {
                throw new ApiError.Conflict('already in organization');
              }

              if (options != null ? options.reactivate : undefined) {
                return ApiPromise({
                  method: 'put',
                  url: `/1/organizations/${this.id}/members/${member.id}/deactivated`,
                  data: {
                    value: false,
                  },
                });
              } else {
                // We can't call @getMemberType here because `member` here isn't
                // really a member doc.
                type =
                  this.isEnterprise() &&
                  __guard__(this.getEnterprise(), (x) => x.isAdmin(member))
                    ? 'admin'
                    : 'normal';

                return ApiPromise({
                  method: 'put',
                  url: `/1/organizations/${this.id}/members/${member.id}`,
                  data: {
                    type,
                    invitationMessage:
                      options != null ? options.invitationMessage : undefined,
                    acceptUnconfirmed: true,
                  },
                });
              }
            } else if (emailRegex.test(user)) {
              return ApiPromise({
                method: 'post',
                url: `/1/organizations/${this.id}/memberships`,
                data: {
                  email: user,
                  type: 'normal',
                },
              });
            } else if (emailRegex.test(user.email)) {
              return ApiPromise({
                method: 'put',
                url: `/1/organizations/${this.id}/members`,
                data: {
                  invitationMessage:
                    options != null ? options.invitationMessage : undefined,
                  ...user,
                },
                dataType: 'json',
              }).then((data) => {
                return (() => {
                  const result = [];
                  for (const _member of Array.from(data.members)) {
                    member = new Member(_member, {
                      modelCache: this.modelCache,
                    });
                    if (!this.memberList.get(member.id)) {
                      this.memberList.add(member);
                      result.push(
                        Analytics.sendTrackEvent({
                          action: 'sent',
                          actionSubject: 'emailOrganizationInvitation',
                          source: getScreenFromUrl(),
                          containers: {
                            workspace: {
                              id: this.id,
                            },
                            enterprise: {
                              id: this.getEnterprise()?.id,
                            },
                          },
                          attributes: {
                            role: _member.type,
                          },
                        }),
                      );
                    }
                  }
                  return result;
                })();
              });
            } else {
              throw new ApiError.NotFound('username not found');
            }
          })
          .then((response) => CATEGORIES.ADDED)
          .catch(ApiError, function (err) {
            const response = err.message;
            if (/email restricted/.test(response)) {
              return CATEGORIES.RESTRICTED;
            } else if (
              /already invited|already in organization/.test(response)
            ) {
              return CATEGORIES.EXISTING;
            } else if (/Must reactivate/.test(response)) {
              return CATEGORIES.MUST_REACTIVATE;
            } else if (/username not found/.test(response)) {
              return CATEGORIES.USERNAME_NOT_FOUND;
            } else if (/Must first transfer account to the/.test(response)) {
              return CATEGORIES.NOT_IN_ENTERPRISE;
            } else if (/No Enterprise licenses/.test(response)) {
              return CATEGORIES.NO_ENTERPRISE_LICENSES;
            } else if (
              /rate limit|invitation quota|sign-up quota/.test(response)
            ) {
              return CATEGORIES.RATE_LIMIT;
            } else if (/ORGANIZATION_TOO_MANY_MEMBERSHIPS/.test(response)) {
              return CATEGORIES.TOO_MANY_MEMBERS;
            } else if (/MEMBER_TOO_MANY_MEMBERSHIPS/.test(response)) {
              return CATEGORIES.MEMBER_TOO_MANY_ORGS;
            } else if (/DEACTIVATED_IN_ENTERPRISE/.test(response)) {
              return CATEGORIES.DEACTIVATED_IN_THE_ENTERPRISE;
            } else if (
              /must be a managed enterprise member or have valid email/.test(
                response,
              )
            ) {
              return CATEGORIES.MUST_BE_MANAGED_ENT_MEMBER_OR_VALID_EMAIL;
            } else if (/must be a managed enterprise member/.test(response)) {
              return CATEGORIES.MUST_BE_MANAGED_ENT_MEMBER;
            } else if (
              /confirm account to send more invitations/.test(response)
            ) {
              return CATEGORIES.MEMBERSHIPS_TOO_MANY_UNCONFIRMED_INVITATIONS;
            } else {
              return CATEGORIES.UNKNOWN;
            }
          })
          .then(function (state) {
            completed++;
            updateProgress(completed);
            const username =
              (user.attributes != null
                ? user.attributes.username
                : undefined) || user.username;

            return {
              user: username || user.email || user,
              state,
            };
          });
      },
      { concurrency: 2 },
    ).then((results) => {
      const sortByUser = (entries) =>
        _.chain(entries)
          .pluck('user')
          .sortBy((user) => user.toLowerCase().replace(/@.*$/, ''))
          .value();

      const groupUsersByCategory = (results) =>
        _.chain(results)
          .groupBy('state')
          .pairs()
          .map(function (...args) {
            const [category, entries] = Array.from(args[0]);
            return [category, sortByUser(entries)];
          })
          .object()
          .value();

      const grouped = groupUsersByCategory(results);
      grouped._categories = CATEGORIES;
      grouped._categoryOrder = CATEGORY_ORDER;

      if (!(options != null ? options.ignoreErrors : undefined)) {
        this.updateBulkAddMemberErrors(_.omit(grouped, CATEGORIES.ADDED));
      }
      return grouped;
    });
  }

  getGoogleAppsMappings() {
    return ApiPromise({
      url: `/1/organizations/${this.id}/googleApps/mappings`,
    });
  }

  ensureSlackAssociation() {
    return this._updateSlackAssociationOnce != null
      ? this._updateSlackAssociationOnce
      : (this._updateSlackAssociationOnce = this.updateSlackAssociation());
  }

  updateSlackAssociation(next) {
    return importWithRetry(() =>
      import(
        /* webpackChunkName: "fingerprint-js" */ '@fingerprintjs/fingerprintjs'
      ),
    ).then(({ default: FingerprintJS }) =>
      FingerprintJS.load()
        .then((fp) => fp.get())
        .then((result) => {
          const {
            deviceMemory,
            cookiesEnabled,
            canvas,
            vendorFlavors,
            ...components
          } = result.components;
          // we need to get rid of this parameter because of the Safari
          // bug that prevents us from getting the same fingreprint
          // both for the web and the PUp
          delete canvas.value.text;
          const visitorId = FingerprintJS.hashComponents({
            ...components,
            canvas,
          });
          return SlackAjax.ajaxTrello({
            url: `/trello/${this.id}/association?fp=${visitorId}`,
          }).tap((response) => {
            const [association, status] = Array.from(response);
            if (status === 'success') {
              if (
                (association != null ? association.associated : undefined) &&
                !association.teams
              ) {
                // upgrade old response schema to new schema
                this._slackAssociation = {
                  associated: true,
                  canChange: association.canChange,
                  adminOnly: association.adminOnly,
                  teams: [
                    {
                      domain: association.domain,
                      name: association.domain,
                      icon: slackTrelloBaseUrl + '/img/slack-default-logo.png',
                      id: association.id,
                      selfJoin: association.selfJoin,
                    },
                  ],
                };
              } else {
                this._slackAssociation = association;
              }
              // Ensure the tracingCallback fires a taskSuccess
              if (next) {
                next(null);
              }
              return this.trigger('change:slack-association');
            }
          });
        }),
    );
  }

  deleteSlackAssociation(idSlackTeam) {
    return SlackAjax.ajaxTrello({
      url: `/trello/${this.id}/association?idSlackTeam=${idSlackTeam}`,
      type: 'DELETE',
    }).tap(() => {
      return this.updateSlackAssociation();
    });
  }

  getLatestSlackAssociation() {
    return this._slackAssociation;
  }

  changeSlackSelfJoin(enabled, idSlackTeam) {
    return SlackAjax.ajaxTrello({
      url: `/trello/${this.id}/selfJoin?idSlackTeam=${idSlackTeam}&value=${enabled}`,
      type: 'PUT',
    }).tap(() => {
      return this.updateSlackAssociation();
    });
  }

  changeSlackAdminOnlyLinking(adminOnly, next) {
    return SlackAjax.ajaxTrello({
      url: `/trello/${this.id}/adminOnlyLinking?value=${adminOnly}`,
      type: 'PUT',
    })
      .tap(() => {
        return this.updateSlackAssociation(next);
      })
      .catch((error) => {
        next(error);
      });
  }

  getEnterprise() {
    return this.modelCache.get('Enterprise', this.get('idEnterprise'));
  }

  fetchCollaborators() {
    return ApiPromise({
      url: `/1/organizations/${this.id}/collaborators`,
    }).then((data) => {
      return this.updateCollaboratorList(data);
    });
  }

  updateCollaboratorList(collaboratorArr) {
    this.set('collaborators', collaboratorArr);
    return this.trigger('change:collaborators');
  }

  getFreeTrialCredits() {
    return (this.getFreeTrialCreditsPromise = ApiPromise({
      url: `/1/organizations/${this.id}/credits?filter=freeTrial`,
      type: 'GET',
    }).then((credits) => {
      return credits;
    }));
  }

  hasFreeTrialCredits() {
    return hasFreeTrialCredit(this.get('credits'));
  }

  isFreeTrialActive() {
    const creditsPromise =
      this.getFreeTrialCreditsPromise || this.getFreeTrialCredits();
    return creditsPromise.then((credits) => {
      if (!_.isEmpty(credits)) {
        const trialProperties = getFreeTrialProperties(
          credits,
          this.get('products'),
          this.get('paidAccount')?.trialExpiration || '',
        );

        return trialProperties && trialProperties.isActive;
      }
    });
  }

  requestToJoinAnEnterprise(enterprise, traceId) {
    return ApiPromise({
      url: `/1/organizations/${this.id}/enterpriseJoinRequest`,
      type: 'PUT',
      traceId,
      data: {
        value: enterprise.get('id'),
      },
    }).then(({ enterpriseJoinRequest, idEnterprise }) => {
      if (!_.isEmpty(idEnterprise)) {
        this.set({ idEnterprise });
      }
      if (_.isEmpty(enterpriseJoinRequest)) {
        return undefined;
      } else {
        return {
          enterprise: this.modelCache.get(
            'Enterprise',
            enterpriseJoinRequest.idEnterprise,
          ),
          member: this.modelCache.get('Member', enterpriseJoinRequest.idMember),
        };
      }
    });
  }

  getEnterpriseJoinRequest() {
    return ApiPromise({
      url: `/1/organizations/${this.id}/enterpriseJoinRequest`,
    }).then((joinRequest) => {
      if (!_.isEmpty(joinRequest)) {
        return {
          enterprise: this.modelCache.get(
            'Enterprise',
            joinRequest.idEnterprise,
          ),
          member: this.modelCache.get('Member', joinRequest.idMember),
        };
      }
    });
  }

  cancelEnterpriseJoinRequest(traceId) {
    return ApiPromise({
      url: `/1/organizations/${this.id}/enterpriseJoinRequest`,
      type: 'DELETE',
      traceId,
    });
  }

  getRestrictedAttachmentTypes() {
    if (this.getPref('attachmentRestrictions') != null) {
      return _.difference(
        AttachmentTypes,
        this.getPref('attachmentRestrictions'),
      );
    } else {
      return [];
    }
  }

  attachmentTypeRestricted(attachmentType) {
    let needle;
    return (
      (needle = attachmentType),
      Array.from(this.getRestrictedAttachmentTypes()).includes(needle)
    );
  }

  attachmentUrlRestricted(url) {
    const attachmentType = attachmentTypeFromUrl(url);
    return this.attachmentTypeRestricted(attachmentType);
  }

  getAvailableLicenseCount() {
    if (
      this.get('availableLicenseCount') === null ||
      this.get('availableLicenseCount') === undefined
    ) {
      return Infinity;
    } else {
      return this.get('availableLicenseCount');
    }
  }

  loadLicenses() {
    // Dependency required at call site to avoid import cycles, do not lift to top of module
    const { ModelLoader } = require('app/scripts/db/model-loader');
    return ModelLoader.loadOrganizationMaximumAndAvailableLicenseCount(this.id);
  }

  getFreeBoardLimit() {
    return __guard__(
      __guard__(this.get('limits'), (x1) => x1.orgs),
      (x) => x.freeBoardsPerOrg,
    );
  }

  // The number of free boards the org can still create, or null if the limit is not close
  // or relevant (eg. this is a premium team)
  getFreeBoardsRemaining() {
    const limit = this.getFreeBoardLimit();
    let delta = null;

    if (
      !this.isPremium() &&
      (limit != null ? limit.disableAt : undefined) &&
      (limit != null ? limit.count : undefined)
    ) {
      delta = limit.disableAt - limit.count;
      if (delta < 0) {
        return 0;
      } else {
        return delta;
      }
    }

    return null;
  }

  // The number of free boards an org has exceeded the limit by. This will only apply
  // to orgs grandfathered through the board limits, with more than 10 boards.
  getFreeBoardsOver() {
    const limit = this.getFreeBoardLimit();
    let delta = null;

    if (
      (limit != null ? limit.disableAt : undefined) &&
      (limit != null ? limit.count : undefined)
    ) {
      delta = limit.disableAt - limit.count;
    }

    if (delta != null && delta < 0) {
      return Math.abs(delta);
    } else {
      return 0;
    }
  }

  // Whether the org is within 7 boards of their free board limit, or it has been
  // met / exceeded.
  isCloseToFreeBoardLimit() {
    const limit = this.getFreeBoardLimit();
    const remaining = this.getFreeBoardsRemaining();

    if (remaining === null) {
      return false;
    } else {
      return remaining <= limit.disableAt - limit.warnAt;
    }
  }

  // Whether the org has reached their limit, or it is exceeded.
  isAtOrOverFreeBoardLimit() {
    const remaining = this.getFreeBoardsRemaining();
    return remaining != null && remaining === 0;
  }

  isFreeBoardLimitOverridden() {
    const limit = this.getFreeBoardLimit();
    return (
      (limit != null ? limit.disableAt : undefined) &&
      (limit != null ? limit.disableAt : undefined) !== 10
    );
  }

  incrementFreeBoardLimitCount(incrementBy) {
    const limits = this.get('limits');
    const openBoardCount =
      __guard__(
        __guard__(
          limits != null ? limits.orgs : undefined,
          (x1) => x1.freeBoardsPerOrg,
        ),
        (x) => x.count,
      ) != null;

    if (!openBoardCount) {
      return;
    }

    let { count, status } = limits.orgs.freeBoardsPerOrg;
    const { disableAt, warnAt } = limits.orgs.freeBoardsPerOrg;

    // calculate the new count
    count += incrementBy;

    // calculate the new status
    if (count > disableAt) {
      status = 'maxExceeded';
    } else if (count === disableAt) {
      status = 'disabled';
    } else if (count >= warnAt) {
      status = 'warn';
    } else {
      status = 'ok';
    }

    // optimistically update the limit
    limits.orgs.freeBoardsPerOrg.count = count;
    limits.orgs.freeBoardsPerOrg.status = status;
    return this.set({ limits });
  }

  getUrl() {
    return getOrganizationUrl(this.get('name'));
  }

  getBillingUrl() {
    return this.getUrl() + '/billing';
  }

  getPrivateBoardCount() {
    const openBoards = this.boardList.models.filter(
      (board) => !board.attributes.closed,
    );
    return (
      __guard__(this.getFreeBoardLimit(), (x) => x.count) - openBoards.length
    );
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

  loadPlugins(opts) {
    // Dependency required at call site to avoid import cycles, do not lift to top of module
    if (opts == null) {
      opts = {};
    }
    const { ModelLoader } = require('app/scripts/db/model-loader');

    if (this.plugins && !opts.force) {
      return Promise.resolve();
    }

    this.pluginsLoading = true;
    return ModelLoader.loadOrganizationPlugins(this.id)
      .then((plugins) => {
        this.plugins = plugins;
        return (this.pluginsLoading = false);
      })
      .catch((err) => {
        this.pluginsLoading = false;
        throw err;
      });
  }

  getPaidStatus() {
    if (this.belongsToRealEnterprise()) {
      return 'enterprise';
    } else if (this.isBusinessClass()) {
      return 'bc';
    } else if (this.isStandard()) {
      return 'standard';
    } else {
      return 'free';
    }
  }

  isAdmin(member) {
    return this.getMemberType(member) === 'admin';
  }
}
Organization.initClass();

_.extend(Organization.prototype, MembershipModel, LimitMixin);

module.exports.Organization = Organization;
