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
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const React = require('react');
const $ = require('jquery');
const { renderComponent } = require('app/src/components/ComponentWrapper');
const { ModelLoader } = require('app/scripts/db/model-loader');
const BrowserWillBeUnsupportedView = require('app/scripts/views/header/browser-will-be-unsupported-view');
const InvitedBannerView = require('app/scripts/views/header/invited-banner-view');
const { ModelCache } = require('app/scripts/db/model-cache');
const AccountTransferRequiredBannerView = require('app/scripts/views/header/account-transfer-required-banner-view');
const ConfirmEmailBannerView = require('app/scripts/views/header/confirm-email-banner-view');
const DowngradePeriodBannerView = require('app/scripts/views/board-limits/downgrade-period-banner-view');
const LoggedInPublicBoardBannerView = require('app/scripts/views/header/logged-in-public-board-banner-view');
const OverdueBannerView = require('app/scripts/views/header/overdue-banner-view');
const PublicBoardBannerView = require('app/scripts/views/header/public-board-banner-view');
const SetPasswordBannerView = require('app/scripts/views/header/set-password-banner-view');
const TwoFactorBackupsBannerView = require('app/scripts/views/header/two-factor-backups-banner-view');
const TemplateBannerView = require('app/scripts/views/header/template-banner-view');
const PersonalBoardsOwnershipBanner = require('app/scripts/views/header/personal-boards-ownership-banner-view');
const FreeTrialBanner = require('app/scripts/views/header/free-trial-banner');
const { MigrationWizardLazy } = require('app/src/components/MigrationWizard');
const NewLocaleBannerView = require('app/scripts/views/header/new-locale-banner-view');
const { Util } = require('app/scripts/lib/util');
const { isProblem, getNextBillingDate } = require('@trello/paid-account');
const { Auth } = require('app/scripts/db/auth');
const { isBrowserSupported, isDesktop } = require('@trello/browser');
const { featureFlagClient } = require('@trello/feature-flag-client');
const _ = require('underscore');
const locales = require('@trello/locale').supportedLocales;
const { sendErrorEvent } = require('@trello/error-reporting');
const { Feature } = require('app/scripts/debug/constants');
const {
  currentModelManager,
} = require('app/scripts/controller/currentModelManager');

const needBackupCodes = function (member) {
  const twoFactorPrefs = member.getPref('twoFactor');
  return (
    (twoFactorPrefs != null ? twoFactorPrefs.enabled : undefined) &&
    twoFactorPrefs.needsNewBackups
  );
};

const getOverdueOrganization = function (member) {
  const bcOrgs = member.organizationList.filter(
    (org) =>
      org.isPremium() &&
      org.ownedByMember(member) &&
      !org.paysWithPurchaseOrder(),
  );

  for (const bcOrg of Array.from(bcOrgs)) {
    const paidAccount = bcOrg.get('paidAccount');

    if (!paidAccount) {
      continue;
    }

    const billingDate = (
      getNextBillingDate(paidAccount) ?? new Date()
    ).getTime();
    const bannerName = `OverdueBanner-${bcOrg.id}-${billingDate}`;
    if (
      isProblem(paidAccount.standing) &&
      !paidAccount.needsCreditCardUpdate &&
      !member.isDismissed(bannerName)
    ) {
      return bcOrg;
    }
  }
};

const showSeatCapBannerForEntity = (
  member,
  entity,
  idEnterprise,
  maxMembers,
  available,
  headerCache,
  topLevelView,
) => {
  // Dependency required at call site to avoid import cycles, do not lift to top of module
  const EnterpriseLicenseBannerView = require('app/scripts/views/header/enterprise-license-banner-view');
  const threshold = Math.min(Math.ceil(maxMembers * 0.05), 20);
  if (available <= threshold) {
    const data = {
      displayName: entity.get('displayName'),
      idEnterprise,
      seats: { max: maxMembers, available },
      cid: entity.cid,
    };
    return $('#banners').prepend(
      topLevelView(EnterpriseLicenseBannerView, data, {
        modelCache: headerCache,
      }).render().el,
    );
  }
};

const showSeatCapBanner = (member, headerCache, topLevelView) => {
  // get the enterprises this member is the admin of
  const enterprises = member.enterpriseList.filter(
    (e) =>
      member.isEnterpriseAdminOf(e) &&
      member.shouldShowEnterpriseBannerFor(e.id),
  );

  enterprises.forEach(function (enterprise) {
    // check the cache first to prevent re-requesting this data on every in-app navigation
    let maxMembers = enterprise.getPref('maxMembers');
    let available = enterprise.getAvailableLicenses();
    if (_.isNumber(maxMembers) && _.isNumber(available)) {
      return showSeatCapBannerForEntity(
        member,
        enterprise,
        enterprise.id,
        maxMembers,
        available,
        headerCache,
        topLevelView,
      );
    } else {
      // load license data asynchronously and display the banner if needed
      return enterprise.loadMaxMembers().then(() => {
        // don't try to load the license data if max members is not set.
        // child enterprises do not have max members set, so this also
        // excludes showing the banner for child enterprises
        if (!(maxMembers = enterprise.getPref('maxMembers'))) {
          return;
        }
        return enterprise.loadLicenses().then(() => {
          available = enterprise.getAvailableLicenses();
          return showSeatCapBannerForEntity(
            member,
            enterprise,
            enterprise.id,
            maxMembers,
            available,
            headerCache,
            topLevelView,
          );
        });
      });
    }
  });

  // find bpco orgs this member is the admin of and hasn't already had
  // its banner shown recently. if there are more than one related bcpo
  // org, only grab one
  let bcpoOrgs = member.organizationList.models.filter(
    (org) =>
      org.paysWithPurchaseOrder() &&
      (org.isBusinessClass() || org.isStandard()) &&
      org.ownedByMember(member) &&
      member.shouldShowEnterpriseBannerFor(org.get('idEnterprise')),
  );
  bcpoOrgs = _.uniq(bcpoOrgs, (org) => org.get('idEnterprise'));

  // load license data asynchronously and display the banner if needed
  return bcpoOrgs.forEach(function (org) {
    const idEnterprise = org.get('idEnterprise');
    return org.loadLicenses().then(() => {
      const max = org.get('maximumLicenseCount');
      const available = org.get('availableLicenseCount');
      return showSeatCapBannerForEntity(
        member,
        org,
        idEnterprise,
        max,
        available,
        headerCache,
        topLevelView,
      );
    });
  });
};

const showEnterpriseDeprovisioningBannerForEntity = (
  member,
  entity,
  idEnterprise,
  enterpriseStanding,
  pendingDeprovision,
  headerCache,
  topLevelView,
) => {
  // Dependency required at call site to avoid import cycles, do not lift to top of module
  const EnterpriseDeprovisioningBannerView = require('app/scripts/views/header/enterprise-deprovisioning-banner-view');
  const data = {
    displayName: entity.get('displayName'),
    idEnterprise,
    enterpriseStanding,
    pendingDeprovision,
    cid: entity.cid,
  };
  $('#banners').prepend(
    topLevelView(EnterpriseDeprovisioningBannerView, data, {
      modelCache: headerCache,
    }).render().el,
  );

  //record that the banner was shown for this user, so we don't show it again right away
  return member.recordEnterpriseDeprovisioningBannerShownFor(idEnterprise);
};

const showEnterpriseDeprovisioningBanner = (
  member,
  headerCache,
  topLevelView,
) => {
  // get the enterprises this member administers that we haven't displayed the
  // de-provisioning banner for recently
  const enterprises = member.enterpriseList.filter(
    (e) =>
      member.isEnterpriseAdminOf(e) &&
      member.shouldShowEnterpriseDeprovisioningBannerFor(e.id),
  );

  // load billing data asynchronously and display the banner if needed
  enterprises.forEach(function (enterprise) {
    //record that we checked if we needed to show the banner, so we don't check again right away
    member.recordEnterpriseDeprovisioningBannerCheckedFor(enterprise.id);
    return ModelLoader.loadEnterpriseStanding('enterprise', enterprise.id).then(
      ({ enterpriseStanding, pendingDeprovision }) => {
        if (enterpriseStanding > 0) {
          return showEnterpriseDeprovisioningBannerForEntity(
            member,
            enterprise,
            enterprise.id,
            enterpriseStanding,
            pendingDeprovision,
            headerCache,
            topLevelView,
          );
        }
      },
    );
  });

  // find bpco orgs this member administers that we haven't displayed the
  // de-provisioning banner for recently.
  let bcpoOrgs = member.organizationList.models.filter(
    (org) =>
      org.paysWithPurchaseOrder() &&
      (org.isBusinessClass() || org.isStandard()) &&
      org.ownedByMember(member) &&
      member.shouldShowEnterpriseDeprovisioningBannerFor(
        org.get('idEnterprise'),
      ),
  );
  bcpoOrgs = _.uniq(bcpoOrgs, (org) => org.get('idEnterprise'));

  // load billing data asynchronously and display the banner if needed
  return bcpoOrgs.forEach(function (org) {
    const idEnterprise = org.get('idEnterprise');
    //record that we checked if we needed to show the banner, so we don't check again right away
    member.recordEnterpriseDeprovisioningBannerCheckedFor(idEnterprise);
    return ModelLoader.loadEnterpriseStanding('organization', org.id).then(
      ({ enterpriseStanding, pendingDeprovision }) => {
        if (enterpriseStanding > 0) {
          return showEnterpriseDeprovisioningBannerForEntity(
            member,
            org,
            idEnterprise,
            enterpriseStanding,
            pendingDeprovision,
            headerCache,
            topLevelView,
          );
        }
      },
    );
  });
};

const showEnterpriseNotificationBanner = function (
  enterprise,
  headerCache,
  topLevelView,
  banner,
) {
  // Dependencies required at call site to avoid import cycles, do not lift to top of module
  const EnterpriseNotificationBannerView = require('app/scripts/views/header/enterprise-notification-banner-view');
  const Format = require('app/scripts/lib/markdown/format');

  let idSuffix = '';
  // Support for legacy HTML based banner, id was specific to the enterprise
  if (banner._id) {
    idSuffix = `-${banner._id}`;
  }

  const oneTimeMessageId = `enterprise-notification-banner-${enterprise.get(
    'id',
  )}${idSuffix}`;
  const alreadyExists = $('#banners').find(`.${oneTimeMessageId}`).length > 0;
  if (
    !alreadyExists &&
    banner.message &&
    !Auth.me().isDismissed(oneTimeMessageId)
  ) {
    // Support for legacy HTML based banner
    // Markdown banners will have an _id
    let formattedMessage = banner.message;

    if (banner._id) {
      // Markdown banners will have an _id
      formattedMessage = Format.markdownAsHtml(banner.message);
    }

    const data = {
      id: enterprise.get('id'),
      displayName: enterprise.get('displayName'),
      message: formattedMessage,
      oneTimeMessageId,
    };
    return $('#banners').prepend(
      topLevelView(EnterpriseNotificationBannerView, data, {
        modelCache: headerCache,
      }).render().el,
    );
  }
};

function __guard__(value, transform) {
  return typeof value !== 'undefined' && value !== null
    ? transform(value)
    : undefined;
}

const showEnterpriseNotificationBanners = (member, headerCache, topLevelView) =>
  member.enterpriseList.forEach(function (enterprise) {
    const banners =
      __guard__(
        __guard__(enterprise.get('prefs'), (x1) => x1.notifications),
        (x) => x.banners,
      ) || [];
    const notification = __guard__(
      __guard__(enterprise.get('prefs'), (x3) => x3.notifications),
      (x2) => x2.banner,
    );
    if (notification) {
      banners.push({
        _id: null,
        message: notification,
      });
    }

    return banners.forEach((banner) =>
      showEnterpriseNotificationBanner(
        enterprise,
        headerCache,
        topLevelView,
        banner,
      ),
    );
  });
module.exports.renderBannerContent = function (selector) {
  let opts;
  const me = Auth.me();
  const headerCache = ModelCache;
  const container = $('#banners');

  const bannerLocales = _.chain(locales)
    .pluck('code')
    .filter((locale) => locale.indexOf('en') !== 0)
    .value();

  // See if we need to display a "your browser is old" message
  const showUnsupportedBanner = !isBrowserSupported() && !isDesktop();

  if (showUnsupportedBanner) {
    container.append(
      this.topLevelView(BrowserWillBeUnsupportedView, me, {
        modelCache: headerCache,
      }).render().el,
    );
  }

  // See if there are any important messages we'd like to convey to the user
  const currentModel = this.currentModel.get();
  if (currentModel && Util.hasValidInviteTokenFor(currentModel, Auth.me())) {
    opts = {
      modelCache: this.getCurrentModelCache(),
      idMemberAdder: Util.inviteTokenFor(currentModel.id).split('-')[1],
    };

    if (currentModelManager.onAnyBoardView()) {
      opts.idBoard = currentModel.id;
    } else if (currentModelManager.onAnyOrganizationView()) {
      opts.idOrganization = currentModel.id;
    }

    return container
      .append(
        this.topLevelView(InvitedBannerView, me, opts, currentModel.id).render()
          .el,
      )
      .toggleClass('personalized-invite', !Auth.isLoggedIn());
  } else {
    if (Auth.isLoggedIn()) {
      // Only show the banner to confirmed users
      let enterprise, locale, org;
      if (Auth.confirmed() && currentModel && this.getCurrentModelCache()) {
        try {
          const freeTrialBanner = this.topLevelView(
            FreeTrialBanner,
            currentModel,
            { modelCache: this.getCurrentModelCache() },
          ).render();
          container.append(freeTrialBanner.el);
        } catch (err) {
          sendErrorEvent(err, {
            tags: {
              ownershipArea: 'trello-bizteam',
              feature: Feature.FreeTrialExistingTeam,
            },
            extraData: {
              component: 'renderBannerContent',
            },
          });
        }
      }

      if (currentModelManager.onAnyBoardView()) {
        // Show template banner even if another banner is showing but defer to
        // view for watching if board is a template, in the case where a board
        // is converted into a template.
        const templateBanner = this.topLevelView(
          TemplateBannerView,
          currentModel,
          { modelCache: this.getCurrentModelCache() },
        ).render();
        container.append(templateBanner.el);

        // Show logged in public board banner even if another banner is showing,
        // but defer to view for watching if board is public. This handles the case
        // when a board is private but becomes public.
        const publicBoardBanner = this.topLevelView(
          LoggedInPublicBoardBannerView,
          currentModel,
          { modelCache: this.getCurrentModelCache() },
        ).render();
        container.append(publicBoardBanner.el);

        // Show the downgrade banner on any board view, regardless of template or visibility
        const downgradeBanner = this.topLevelView(
          DowngradePeriodBannerView,
          currentModel,
          { modelCache: this.getCurrentModelCache() },
        ).render();
        container.append(downgradeBanner.el);
      }

      if (!Auth.confirmed()) {
        container.append(
          this.topLevelView(ConfirmEmailBannerView, me, {
            modelCache: headerCache,
          }).render().el,
        );
      } else if (!Auth.canLogIn()) {
        container.append(
          this.topLevelView(SetPasswordBannerView, me, {
            modelCache: headerCache,
          }).render().el,
        );
      } else if (
        (enterprise = Auth.me().get('enterpriseWithRequiredConversion')) &&
        !me.isAccountTransferBannerDismissed()
      ) {
        opts = {
          modelCache: headerCache,
          locale,
          enterprise,
        };
        container.append(
          this.topLevelView(
            AccountTransferRequiredBannerView,
            me,
            opts,
          ).render().el,
        );
      } else if (
        (enterprise = Auth.me().get('enterpriseToExplicitlyOwnBoards')) &&
        !_.isEmpty(enterprise) &&
        !me.isPersonalBoardOwnershipBannerDismissed()
      ) {
        container.append(
          this.topLevelView(PersonalBoardsOwnershipBanner, me, {
            enterpriseName: enterprise.name,
            idEnterprise: enterprise.id,
            ownDate: enterprise.ownDate,
          }).render().el,
        );
      } else if ((org = getOverdueOrganization(Auth.me()))) {
        container.append(
          this.topLevelView(OverdueBannerView, org, {
            modelCache: headerCache,
          }).render().el,
        );
      } else if (needBackupCodes(Auth.me())) {
        container.append(
          this.topLevelView(TwoFactorBackupsBannerView, me, {
            modelCache: headerCache,
          }).render().el,
        );
      } else if (
        (locale = _.find(bannerLocales, (locale) =>
          Auth.me().shouldShowNewLanguageBannerFor(locale),
        ))
      ) {
        container.append(
          this.topLevelView(NewLocaleBannerView, me, {
            modelCache: headerCache,
            locale,
          }).render().el,
        );
      }

      // always try to add the Migration Wizard banner even if another banner is showing
      // and let the banner view control it's visibility thereafter.
      try {
        if (featureFlagClient.get('btg.migration-wizard', false)) {
          let reactMount;
          if (!container.find('.react-banners').length) {
            reactMount = document.createElement('div');
            reactMount.className = 'react-banners';
            container.append(reactMount);
          } else {
            reactMount = container.find('.react-banners')[0];
          }

          renderComponent(<MigrationWizardLazy />, reactMount);
        }
      } catch (err) {
        sendErrorEvent(err, {
          tags: {
            ownershipArea: 'trello-bizteam',
            feature: Feature.MigrationWizard,
          },
          extraData: {
            component: 'renderBannerContent',
          },
        });
      }

      // always try to add the seat cap banner, even if another banner is showing
      showSeatCapBanner(Auth.me(), headerCache, this.topLevelView.bind(this));

      // always try to add the enterprise deprovisioning banner, even if another banner is showing
      showEnterpriseDeprovisioningBanner(
        Auth.me(),
        headerCache,
        this.topLevelView.bind(this),
      );

      // always show enterprise notification banners, even if other banners are showing
      return showEnterpriseNotificationBanners(
        Auth.me(),
        headerCache,
        this.topLevelView.bind(this),
      );
    } else {
      if (currentModelManager.onAnyBoardView() && currentModel.isPublic()) {
        if (currentModel.isTemplate()) {
          return container.append(
            this.topLevelView(TemplateBannerView, currentModel, {
              modelCache: this.getCurrentModelCache(),
            }).render().el,
          );
        } else {
          return container.append(
            this.topLevelView(PublicBoardBannerView, currentModel, {
              modelCache: this.getCurrentModelCache(),
            }).render().el,
          );
        }
      }
    }
  }
};
