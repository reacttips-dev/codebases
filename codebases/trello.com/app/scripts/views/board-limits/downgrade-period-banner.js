const { ProductFeatures } = require('@trello/product-features');

const { Analytics, getScreenFromUrl } = require('@trello/atlassian-analytics');
const { isProblem, getExpirationDate } = require('@trello/paid-account');
const { Auth } = require('app/scripts/db/auth');
const isDesktop = require('@trello/browser').isDesktop();
const moment = require('moment');
const { NoticeBanner } = require('app/src/components/NoticeBanner');
const React = require('react');
const { forTemplate } = require('@trello/i18n');
const { navigate } = require('app/scripts/controller/navigate');

const format = forTemplate('board_limits');
class DowngradePeriodBanner extends React.Component {
  render() {
    if (
      isDesktop ||
      !(this.state.showDowngradeBanner || this.state.showForcedDowngradeBanner)
    ) {
      return null;
    }

    if (
      !Auth.me().isDismissed(
        `BoardLimitsDowngradePeriod-${this.state.org?.id}`,
      ) &&
      !this.state.showForcedDowngradeBanner &&
      this.state.showDowngradeBanner
    ) {
      const downgradeCopy = this.state.isBcToStandardDowngrade
        ? this.state.isRetiredBC
          ? 'downgrade-period-retired-BC-standard'
          : 'downgrade-period-BC-standard'
        : this.state.isStandardToFreeDowngrade
        ? 'downgrade-period-standard-free'
        : this.state.isRetiredBC
        ? 'downgrade-period-retired-bc'
        : 'downgrade-period';
      return (
        <div className="board-limits-downgrade-period-banner">
          <NoticeBanner
            // eslint-disable-next-line react/jsx-no-bind
            onDismiss={this.dismissBanner.bind(
              this,
              `BoardLimitsDowngradePeriod-${this.state.org?.id}`,
            )}
            actionButton={{
              text: this.state.isRetiredBC
                ? format('restore-retired-business-class')
                : format('restore-business-class'),
              onClick: this.navigateToBillingPage,
            }}
          >
            {format(downgradeCopy, {
              downgradeDate: moment(this.state.expirationDate).format('LL'),
              orgName: <>{this.state.org.get('displayName')}</>,
            })}
          </NoticeBanner>
        </div>
      );
    }

    if (
      !Auth.me().isDismissed(
        `BoardLimitsForcedDowngradePeriod-${this.state.org?.id}`,
      ) &&
      this.state.showForcedDowngradeBanner
    ) {
      return (
        <div className="board-limits-downgrade-period-banner">
          <NoticeBanner
            // eslint-disable-next-line react/jsx-no-bind
            onDismiss={this.dismissBanner.bind(
              this,
              `BoardLimitsForcedDowngradePeriod-${this.state.org?.id}`,
            )}
            actionButton={{
              text: format('restore-business-class'),
              onClick: this.navigateToBillingPage,
            }}
          >
            {format('forced-downgrade-message', {
              orgName: this.state.org.get('displayName'),
            })}
          </NoticeBanner>
        </div>
      );
    }

    return null;
  }

  constructor(props) {
    super(props);
    this.dismissBanner = this.dismissBanner.bind(this);
    this.navigateToBillingPage = this.navigateToBillingPage.bind(this);

    const typeName = this.props.model?.typeName;
    const org =
      typeName === 'Board'
        ? this.props.model.getOrganization()
        : typeName === 'Organization'
        ? this.props.model
        : null;
    const paidAccount = org?.get('paidAccount') ?? null;

    const currentProduct = paidAccount?.products[0];
    const isStandardToFreeDowngrade = ProductFeatures.isStandardProduct(
      currentProduct,
    );
    const isBcToStandardDowngrade =
      paidAccount &&
      ProductFeatures.isStandardProduct(
        paidAccount?.scheduledChange?.ixSubscriptionProduct,
      ) &&
      org.isBusinessClass();
    const isRetiredBC = ProductFeatures.isRetiredBusinessClassProduct(
      currentProduct,
    );

    const bannerDismissed = false;
    let showDowngradeBanner = false;
    let showForcedDowngradeBanner = false;

    if (!paidAccount || (!org.isBusinessClass() && !org.isStandard())) {
      this.state = {
        org,
        bannerDismissed,
        showDowngradeBanner,
        showForcedDowngradeBanner,
        isBcToStandardDowngrade,
        isStandardToFreeDowngrade,
        isRetiredBC: isRetiredBC,
      };
      return;
    } else {
      const expirationDate = getExpirationDate(paidAccount);
      showDowngradeBanner =
        expirationDate &&
        moment().isBefore(expirationDate) &&
        moment().isSameOrAfter(moment(expirationDate).subtract(30, 'days'));
      showForcedDowngradeBanner =
        isProblem(paidAccount.standing) && paidAccount.needsCreditCardUpdate;
      this.state = {
        org,
        bannerDismissed,
        showDowngradeBanner,
        showForcedDowngradeBanner,
        expirationDate,
        isBcToStandardDowngrade,
        isStandardToFreeDowngrade,
        isRetiredBC: isRetiredBC,
      };
    }
  }

  componentDidMount() {
    if (
      this.state.showDowngradeBanner ||
      this.state.showForcedDowngradeBanner
    ) {
      Analytics.sendViewedBannerEvent({
        bannerName: this.state.showForcedDowngradeBanner
          ? 'boardLimitsForcedDowngradeBanner'
          : 'boardLimitsDowngradeBanner',
        source: getScreenFromUrl(),
        containers: {
          organization: {
            id: this.state.org?.id,
          },
        },
      });
      this.props.setShown(true);
    }
    this.props.setShown(false);
  }

  dismissBanner(bannerId) {
    Auth.me().dismiss(bannerId);
    this.setState({
      bannerDismissed: true,
    });

    Analytics.sendDismissedComponentEvent({
      componentType: 'banner',
      componentName: this.state.showForcedDowngradeBanner
        ? 'boardLimitsForcedDowngradeBanner'
        : 'boardLimitsDowngradeBanner',
      source: getScreenFromUrl(),
      containers: {
        organization: {
          id: this.state.org?.id,
        },
      },
    });
  }

  navigateToBillingPage() {
    Analytics.sendClickedButtonEvent({
      buttonName: 'restoreBCButton',
      source: this.state.showForcedDowngradeBanner
        ? 'boardLimitsForcedDowngradeBanner'
        : 'boardLimitsDowngradeBanner',
      containers: {
        organization: {
          id: this.state.org?.id,
        },
      },
    });

    return navigate(this.state.org.getBillingUrl(), { trigger: true });
  }
}

module.exports = DowngradePeriodBanner;
