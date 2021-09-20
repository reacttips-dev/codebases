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
 * DS206: Consider reworking classes to avoid initClass
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const { ApiError } = require('app/scripts/network/api-error');
const { ApiPromise } = require('app/scripts/network/api-promise');
const { Auth } = require('app/scripts/db/auth');
const Payloads = require('app/scripts/network/payloads').default;
const {
  ModelWithPreferences,
} = require('app/scripts/models/internal/model-with-preferences');
const { logoDomain } = require('@trello/config');
const Promise = require('bluebird');
const _ = require('underscore');
const { ProductFeatures, Products } = require('@trello/product-features');
const { AttachmentTypes } = require('app/scripts/data/attachment-types');
const {
  attachmentTypeFromUrl,
} = require('app/scripts/lib/util/url/attachment-type-from-url');
const {
  BoardInviteRestrictValues,
} = require('app/scripts/views/organization/constants');

function __guard__(value, transform) {
  return typeof value !== 'undefined' && value !== null
    ? transform(value)
    : undefined;
}

class Enterprise extends ModelWithPreferences {
  static initClass() {
    this.prototype.typeName = 'Enterprise';
    this.prototype.nameAttr = 'name';
    this.prototype.urlRoot = '/1/enterprises';

    this.lazy({
      organizationList() {
        // Dependency required at call site to avoid import cycles, do not lift to top of module
        const {
          OrganizationList,
        } = require('app/scripts/models/collections/organization-list');
        return new OrganizationList();
      },

      memberList() {
        // Dependency required at call site to avoid import cycles, do not lift to top of module
        const {
          MemberList,
        } = require('app/scripts/models/collections/member-list');
        return new MemberList();
      },

      pendingOrganizationList() {
        // Dependency required at call site to avoid import cycles, do not lift to top of module
        const {
          PendingOrganizationList,
        } = require('app/scripts/models/collections/PendingOrganizationList');
        return new PendingOrganizationList();
      },

      publicBoardList() {
        // Dependency required at call site to avoid import cycles, do not lift to top of module
        const {
          PublicBoardList,
        } = require('app/scripts/models/collections/public-board-list');
        return new PublicBoardList();
      },
    });
  }

  constructor() {
    super(...arguments);
    this._initSubEventsOn('organizationPrefs');
    this.enablePluginWhitelisting = this.enablePluginWhitelisting.bind(this);
    this.disablePluginWhitelisting = this.disablePluginWhitelisting.bind(this);
  }

  initialize() {
    super.initialize(...arguments);

    this.licensesLoading = true;
    this.licensesLoadFailed = false;
    this.pluginsLoading = true;
    return (this.pluginWhitelistingLoading = false);
  }

  getOrganizationPref(name) {
    return __guard__(this.get('organizationPrefs'), (x) => x[name]);
  }

  setOrganizationPref(name, value, opts, next) {
    return this.update(`organizationPrefs/${name}`, value, opts, (err) => {
      if (!err) {
        this._cascadeOrganizationPrefs(name, value);
      }
      if (_.isFunction(next)) {
        return next(err);
      }
    });
  }

  setOrganizationPrefWithTracing(name, value, opts, next) {
    //TraceId is based in opts to keep with TrelloModel's update param pattern
    return this.update(
      `organizationPrefs/${name}`,
      value,
      opts,
      (err, success) => {
        if (!err) {
          this._cascadeOrganizationPrefs(name, value);
        }
        if (_.isFunction(next)) {
          return next(err, success);
        }
      },
    );
  }

  // Optimistically update all cached orgs in this enterprise
  _cascadeOrganizationPrefs(name, value) {
    return this.modelCache
      .all('Organization')
      .filter((cachedOrg) => {
        return cachedOrg.get('idEnterprise') === this.id;
      })
      .forEach((enterpriseOrg) => {
        return enterpriseOrg.set({ [`prefs/${name}`]: value });
      });
  }

  deleteOrganizationPrefWithTracing(name, traceId, next) {
    this.set({ [`organizationPrefs/${name}`]: undefined });
    return this.api(
      {
        type: 'delete',
        method: `organizationPrefs/${name}`,
        traceId,
      },
      next,
    );
  }

  deleteOrganizationPref(name, next) {
    this.set({ [`organizationPrefs/${name}`]: undefined });
    return this.api(
      {
        type: 'delete',
        method: `organizationPrefs/${name}`,
      },
      next,
    );
  }

  setIdpValue(field, value) {
    return ApiPromise({
      url: `/1/enterprises/${this.id}/idp/${field}`,
      type: 'PUT',
      data: {
        value,
      },
    }).then(() => {
      this.set({ [`idp/${field}`]: value });
      return this.trigger('change:idp');
    });
  }

  loadPageOfMembers(query) {
    // Dependency required at call site to avoid import cycles, do not lift to top of module
    const { ModelLoader } = require('app/scripts/db/model-loader');
    return ModelLoader.loadMembersOfEnterprise(this.get('name'), query).tap(
      (...args) => {
        const [members] = Array.from(args[0]);
        if (members.length > 0) {
          return this.memberList.add(members);
        }
      },
    );
  }

  loadLicenses() {
    // Dependency required at call site to avoid import cycles, do not lift to top of module
    const { ModelLoader } = require('app/scripts/db/model-loader');
    if (this.licensesLoadFailed) {
      return Promise.resolve();
    }

    this.licensesLoading = true;
    this.trigger('loading:licenses');

    return ModelLoader.loadEnterprise(this.id, {
      fields: 'licenses',
      organizations: 'none',
    })
      .catch(ApiError.Server, function (err) {
        this.licensesLoadFailed = true;
        if (err.message !== 'Gateway Timeout') {
          throw err;
        }
      })
      .then(() => {
        this.licensesLoading = false;
        return this.trigger('change:licenses');
      });
  }

  loadPageOfOrganizations(query) {
    // Dependency required at call site to avoid import cycles, do not lift to top of module
    const { ModelLoader } = require('app/scripts/db/model-loader');
    return ModelLoader.loadEnterpriseOrganizations(this.get('name'), query).tap(
      (...args) => {
        const [organizations] = Array.from(args[0]);
        if (organizations.length > 0) {
          return this.organizationList.add(organizations, { merge: true });
        }
      },
    );
  }

  loadMaxMembers() {
    // Dependency required at call site to avoid import cycles, do not lift to top of module
    const { ModelLoader } = require('app/scripts/db/model-loader');
    return ModelLoader.loadEnterprise(this.id, {
      // load prefs to refresh maxMembers
      fields: 'prefs',
      organizations: 'none',
    });
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
    return ModelLoader.loadEnterprisePlugins(this.id)
      .then((plugins) => {
        this.plugins = plugins;
        return (this.pluginsLoading = false);
      })
      .catch((err) => {
        this.pluginsLoading = false;
        throw err;
      });
  }

  allowPlugin(idPlugin) {
    // Dependency required at call site to avoid import cycles, do not lift to top of module
    const { ModelLoader } = require('app/scripts/db/model-loader');
    return ApiPromise({
      url: `/1/enterprises/${this.id}/allowedPlugins`,
      type: 'POST',
      data: {
        idPlugin,
      },
    })
      .then(() => {
        return ModelLoader.loadEnterprise(this.id, {
          fields: 'idPluginsAllowed',
        });
      })
      .then(() => {
        return ModelLoader.loadEnterprisePlugins(this.id).then((plugins) => {
          return (this.plugins = plugins);
        });
      });
  }

  disablePlugin(idPlugin) {
    // Dependency required at call site to avoid import cycles, do not lift to top of module
    const { ModelLoader } = require('app/scripts/db/model-loader');
    return ApiPromise({
      url: `/1/enterprises/${this.id}/allowedPlugins`,
      type: 'DELETE',
      data: {
        idPlugin,
      },
    })
      .then(() => {
        return ModelLoader.loadEnterprise(this.id, {
          fields: 'idPluginsAllowed',
        });
      })
      .then(() => {
        return ModelLoader.loadEnterprisePlugins(this.id).then((plugins) => {
          return (this.plugins = plugins);
        });
      });
  }

  loadPageOfPendingOrganizations(query) {
    // Dependency required at call site to avoid import cycles, do not lift to top of module
    const { ModelLoader } = require('app/scripts/db/model-loader');
    return ModelLoader.loadEnterprisePendingOrganizations(
      this.get('name'),
      query,
    ).tap((...args) => {
      const [pendingOrganizations] = Array.from(args[0]);
      if (pendingOrganizations.length > 0) {
        return this.pendingOrganizationList.add(pendingOrganizations);
      }
    });
  }

  loadPageOfPublicBoards(query) {
    // Dependency required at call site to avoid import cycles, do not lift to top of module
    const { ModelLoader } = require('app/scripts/db/model-loader');
    return ModelLoader.loadEnterprisePublicBoards(this.get('name'), query).tap(
      (...args) => {
        const [publicBoards] = Array.from(args[0]);
        if (publicBoards.length > 0) {
          return this.publicBoardList.add(publicBoards);
        }
      },
    );
  }

  // This is silly, but the enterprises endpoint serves more than actual
  // enterprises. There there's also other "collections of teams" that we use to
  // configure sso and for recurring billing. This is how we tell if something
  // from that endpoint is actually an enterprise:
  isRealEnterprise() {
    return ProductFeatures.isEnterpriseProduct(this.getProduct());
  }

  isEnterpriseProductWithoutSSO() {
    return [Products.Enterprise.v2_1, Products.Enterprise.v2_2].includes(
      this.getProduct(),
    );
  }

  atlassianOrgLinkingEnabled() {
    return !!__guard__(
      this.get('prefs'),
      (x) => x.atlassianOrganizationLinking,
    );
  }

  declinePendingOrganization(pendingOrganization) {
    // This is the same as org.cancelEnterpriseJoinRequest, but we can't invoke
    // that from here because the enterprise admin might not have permission to
    // access the org and therefore we might not have the org as a backbone
    // model.
    return ApiPromise({
      url: `/1/organizations/${pendingOrganization.id}/enterpriseJoinRequest`,
      type: 'DELETE',
    }).then(() => {
      return this.pendingOrganizationList.remove(pendingOrganization);
    });
  }

  acceptPendingOrganization(pendingOrganization) {
    return ApiPromise({
      url: `/1/enterprises/${this.id}/organizations`,
      type: 'PUT',
      data: {
        idOrganization: pendingOrganization.id,
      },
    }).then((response) => {
      this.pendingOrganizationList.remove(pendingOrganization);

      const teamAttrs = _.isArray(response)
        ? _.find(response, (team) => team.id === pendingOrganization.id)
        : response;

      let team = this.modelCache.get('Organization', pendingOrganization.id);
      if (team == null) {
        // Dependency required at call site to avoid import cycles, do not lift to top of module
        const { Organization } = require('app/scripts/models/organization');
        team = new Organization(teamAttrs, { modelCache: this.modelCache });
      } else {
        team.set(teamAttrs);
      }

      this.organizationList.add(team);
      return this.trigger('accept:pendingOrganization', pendingOrganization);
    });
  }

  updatePublicBoardsVisibility(boards, permissionLevel, traceId, next) {
    const idBoards = _.pluck(boards, 'id');

    return ApiPromise({
      url: `/1/enterprises/${this.id}/boards/prefs/permissionLevel`,
      type: 'PUT',
      traceId,
      data: {
        idBoards,
        value: permissionLevel,
        filter: 'public',
      },
    })
      .then((response) => {
        this.publicBoardList.remove(boards);
        next(null, response);
        // If the user tries to access the board view after
        // updating the visibility in the enterprise dashboard,
        // it will not have the new visibility so we have to
        // update the modelCache if it exists
        for (const idBoard of Array.from(idBoards)) {
          const board = this.modelCache.get('Board', idBoard);
          if (board != null) {
            const updateBoardPrefs = _.extend(board.get('prefs'), {
              permissionLevel,
            });
            board.set(updateBoardPrefs);
          }
        }

        return this.trigger('change:enterprisePublicBoards');
      })
      .catch((error) => {
        next(error);
      });
  }

  getAvailableLicenses() {
    if (this.get('licenses') != null) {
      if (__guard__(this.get('licenses'), (x) => x.maxMembers)) {
        return (
          this.get('licenses').maxMembers - this.get('licenses').totalMembers
        );
      } else {
        return Infinity;
      }
    }
  }

  getAttachmentRestrictions() {
    const attachmentRestrictions = __guard__(
      this.get('organizationPrefs'),
      (x) => x.attachmentRestrictions,
    );

    if (attachmentRestrictions != null) {
      return {
        enabled: attachmentRestrictions,
        disabled: _.difference(AttachmentTypes, attachmentRestrictions),
      };
    } else {
      return { enabled: AttachmentTypes, disabled: [] };
    }
  }

  getRestrictedAttachmentTypes() {
    return this.getAttachmentRestrictions().disabled;
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

  getHeaderLogo() {
    if (this.get('logoHash') != null) {
      return `${logoDomain}/${this.get('logoHash')}/60.png`;
    } else {
      return null;
    }
  }

  grantMemberLicense(member) {
    return ApiPromise({
      url: `/1/enterprises/${this.id}/members/${member.id}/licensed`,
      type: 'PUT',
      data: {
        fields: Payloads.enterpriseMemberFields,
        value: true,
      },
    }).tap((data) => {
      this.modelCache.enqueueDelta(member, data);
      return this.trigger('change:memberLicensed');
    });
  }

  setMemberActive(member, active, traceId) {
    return ApiPromise({
      url: `/1/enterprises/${this.id}/members/${member.id}/deactivated`,
      // Larger enterprises were experiencing deactivation request times that exceeded
      // the default 32 second timeout, so it's increased here to the maximum allowed by
      // server for PUT requests, 2 minutes
      timeout: 120000,
      type: 'PUT',
      traceId,
      data: {
        fields: Payloads.enterpriseMemberFields,
        value: !active,
      },
    }).tap((data) => {
      this.modelCache.enqueueDelta(member, data);
      return this.trigger('change:memberActive');
    });
  }

  removeMember(member) {
    return ApiPromise({
      url: `/1/enterprises/${this.id}/members/${member.id}`,
      type: 'DELETE',
      // Larger enterprises were experiencing request times that exceeded the
      // default 32 second timeout, so it's increased here to the maximum allowed by
      // server for DELETE requests, 2 minutes
      timeout: 120000,
    });
  }

  assignMemberAdmin(member) {
    const memberModel = this.memberList.get(member.id);
    const roles = memberModel.get('roles');
    const isMemberAlreadyAdmin = roles.find(
      (role) => role === 'enterprise.admin',
    );
    if (!isMemberAlreadyAdmin) {
      const newRoles = _.clone(roles);
      newRoles.push('enterprise.admin');
      return memberModel.set('roles', newRoles);
    }
  }

  revokeMemberAdmin(member) {
    const memberModel = this.memberList.get(member.id);
    const roles = memberModel.get('roles');
    const isMemberAlreadyAdmin = roles.find(
      (role) => role === 'enterprise.admin',
    );
    if (isMemberAlreadyAdmin) {
      const newRoles = _.clone(roles).filter(
        (role) => role !== 'enterprise.admin',
      );
      return memberModel.set('roles', newRoles);
    }
  }

  getTotalMembers() {
    return __guard__(this.get('licenses'), (x) => x.totalMembers);
  }

  isNearMaxMembers() {
    const max = this.getMaxMembers();
    if (max == null) {
      return false;
    }
    const count = this.getTotalMembers();
    // “near” means < 5% capacity remaining, or 20 seats, whichever is less
    return max - count <= Math.min(Math.ceil(max * 0.05), 20);
  }

  isAtMaxMembers() {
    const max = this.getMaxMembers();
    return max != null && max <= this.getTotalMembers();
  }

  getMaxMembers() {
    if (this.get('licenses')) {
      return this.get('licenses').maxMembers;
    } else {
      return __guard__(this.get('prefs'), (x) => x.maxMembers);
    }
  }

  getMemberCounts() {
    return __guard__(this.get('licenses'), (x) => x.relatedEnterprises);
  }

  hasRelatedEnterprises() {
    return (
      __guard__(this.get('licenses'), (x) => x.relatedEnterprises.length) > 1
    );
  }

  parentEnterprise() {
    return __guard__(this.get('licenses'), (x) => x.parent);
  }

  isPluginAllowed(idPlugin) {
    if (this.get('pluginWhitelistingEnabled')) {
      let needle;
      return (
        (needle = idPlugin),
        Array.from(this.get('idPluginsAllowed') || []).includes(needle)
      );
    } else {
      return true;
    }
  }

  isPluginWhitelistingEnabled() {
    return this.get('pluginWhitelistingEnabled');
  }

  getPluginUsageGroups() {
    const result = {
      inUse: [],
      notInUse: [],
      allowed: [],
    };

    if (!this.plugins) {
      return result;
    }

    return this.plugins.reduce((acc, plugin) => {
      let needle;
      if (plugin.attributes.boardsCount > 0) {
        acc.inUse.push(plugin);
      } else {
        acc.notInUse.push(plugin);
      }

      if (
        ((needle = plugin.id),
        Array.from(this.get('idPluginsAllowed')).includes(needle))
      ) {
        acc.allowed.push(plugin);
      }

      return acc;
    }, result);
  }

  getInUsePlugins() {
    return this.getPluginUsageGroups().inUse;
  }

  getAllowedPlugins() {
    return this.getPluginUsageGroups().allowed;
  }

  getNotInUsePlugins() {
    return this.getPluginUsageGroups().notInUse;
  }

  // Plugins that would be disabled if PUPs allowlisting were to be turned on.
  getWouldBeDisabledPlugins() {
    return _.uniq(
      _.difference(this.getNotInUsePlugins(), this.getAllowedPlugins()),
    );
  }

  // Plugins that would remain allowed if PUPs allowlisting were to be turned on.
  getWouldRemainAllowedPlugins() {
    return _.uniq(_.union(this.getInUsePlugins(), this.getAllowedPlugins()));
  }

  setPluginWhitelisting(enabled) {
    this.pluginWhitelistingLoading = true;
    this.trigger('loading:pluginWhitelistingEnabled');
    return ApiPromise({
      url: `/1/enterprises/${this.id}/pluginWhitelistingEnabled`,
      type: 'PUT',
      data: {
        value: enabled,
      },
    })
      .then(() => {
        this.set({ pluginWhitelistingEnabled: enabled });
        this.pluginWhitelistingLoading = false;
        return this.trigger('change:pluginWhitelistingEnabled');
      })
      .catch((err) => {
        this.pluginWhitelistingLoading = false;
        this.trigger('change:pluginWhitelistingEnabled');
        throw err;
      });
  }

  enablePluginWhitelisting() {
    return this.setPluginWhitelisting(true);
  }

  disablePluginWhitelisting() {
    return this.setPluginWhitelisting(false);
  }

  canViewEnterpriseVisibleBoard(member) {
    const idEnterprise = this.get('id');
    return member.organizationList.any(
      (org) => org.get('idEnterprise') === idEnterprise,
    );
  }

  canAddTeamlessBoard(board) {
    if (!this.get('isRealEnterprise')) {
      return true;
    }
    const vis = board.get('prefs').permissionLevel;
    return this.canSetTeamlessBoardVisibility(vis);
  }

  canDeleteTeamlessBoard(board) {
    if (!this.get('isRealEnterprise')) {
      return true;
    }
    const vis = board.get('prefs').permissionLevel;
    const organizationPrefs = this.get('organizationPrefs');
    const pref =
      organizationPrefs &&
      organizationPrefs.boardDeleteRestrict &&
      organizationPrefs.boardDeleteRestrict[vis];
    return (
      !pref ||
      pref === 'org' ||
      (pref === 'admin' && this.isTeamAdmin(Auth.me()))
    );
  }

  canSetTeamlessBoardVisibility(vis) {
    if (!this.get('isRealEnterprise')) {
      return true;
    }
    if (['org', 'enterprise'].includes(vis)) {
      return false;
    }
    const organizationPrefs = this.get('organizationPrefs');
    const pref =
      organizationPrefs &&
      organizationPrefs.boardVisibilityRestrict &&
      organizationPrefs.boardVisibilityRestrict[vis];
    return (
      !pref ||
      pref === 'org' ||
      (pref === 'admin' && this.isTeamAdmin(Auth.me()))
    );
  }

  isAdmin(member) {
    let needle;
    return (
      member != null &&
      ((needle = member.id),
      Array.from(this.get('idAdmins') || []).includes(needle))
    );
  }

  isTeamAdmin(member) {
    if (this.isAdmin(member)) {
      // ent admins are always team admins
      return true;
    }
    const idEnterprise = this.get('id');
    return (
      member &&
      member.organizationList.any(
        (org) =>
          org.get('idEnterprise') === idEnterprise &&
          org.isPremOrgAdmin(member),
      )
    );
  }

  getAuditLog() {
    return ApiPromise({
      url: `/1/enterprises/${this.id}/auditlog`,
      type: 'GET',
    });
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

  onlyLicensedMembers() {
    return (
      this.getPref('personalBoardInviteRestrict') &&
      this.getPref('personalBoardInviteRestrict') ===
        BoardInviteRestrictValues.LICENSED
    );
  }

  onlyManagedMembers() {
    return (
      this.getPref('personalBoardInviteRestrict') &&
      this.getPref('personalBoardInviteRestrict') ===
        BoardInviteRestrictValues.MANAGED
    );
  }

  onlyLicensedOrManagedMembers() {
    return (
      this.getPref('personalBoardInviteRestrict') &&
      this.getPref('personalBoardInviteRestrict') ===
        BoardInviteRestrictValues.LICENSED_OR_MANAGED
    );
  }
}
Enterprise.initClass();

module.exports.Enterprise = Enterprise;
