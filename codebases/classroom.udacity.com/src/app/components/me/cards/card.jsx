import { IconCourse, IconEdit, IconNanodegree } from '@udacity/veritas-icons';

import { ColorSchemeConstants } from 'constants/style';
import { Heading } from '@udacity/veritas-components';
import { OmacPlaceholder } from 'components/common/omac-placeholder';
import PropTypes from 'prop-types';
import RouteHelper from 'helpers/route-helper';
import RouteMixin from 'mixins/route-mixin';
import SemanticTypes from 'constants/semantic-types';
import StateHelper from 'helpers/state-helper';
import SubscriptionHelper from 'helpers/subscription-helper';
import { __ } from 'services/localization-service';
import { connect } from 'react-redux';
import { routerShape } from 'react-router/lib/PropTypes';
import styles from './card.scss';

const mapStateToProps = (state, { nanodegreeKey }) => ({
  subscription:
    (nanodegreeKey &&
      StateHelper.getSubscriptionByNanodegreeKey(state, nanodegreeKey)) ||
    {},
});

@cssModule(styles)
class Card extends React.Component {
  static displayName = 'me/cards/card';

  static propTypes = {
    colorScheme: PropTypes.oneOf(_.values(ColorSchemeConstants)),
    courseKey: PropTypes.string,
    nanodegreeKey: PropTypes.string,
    partKey: PropTypes.string,
    summary: PropTypes.string,
    title: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    isExecutiveProgram: PropTypes.bool,
    isLatest: PropTypes.bool,
    isPaidSingleCourse: PropTypes.bool,
    showColorScheme: PropTypes.bool,
    isGraduationLegacy: PropTypes.bool,
    renderFooter: PropTypes.func,
    renderButton: PropTypes.func,
    path: PropTypes.string,
    isReadyForGraduation: PropTypes.bool,
  };

  static defaultProps = {
    colorScheme: '',
    courseKey: '000',
    nanodegreeKey: '000',
    isExecutiveProgram: false,
    isReadyForGraduation: false,
    isLatest: false,
    isPaidSingleCourse: false,
    showColorScheme: false,
    isGraduationLegacy: false,
    renderFooter: _.noop,
    renderButton: _.noop,
    path: null,
  };

  static contextTypes = {
    router: routerShape,
  };

  mixins: [RouteMixin];

  _getLinkPath() {
    const { subscription, nanodegreeKey, partKey } = this.props;

    const isSuspended = SubscriptionHelper.isSuspended(subscription);
    const isChinaPayment = SubscriptionHelper.isChinaPayment(subscription);
    const isIndiaPayment = SubscriptionHelper.isIndiaPayment(subscription);

    if (isSuspended) {
      return isIndiaPayment || isChinaPayment
        ? RouteHelper.settingsPath('subscriptions')
        : RouteHelper.settingsPath('billing');
    }

    if (partKey) {
      return RouteHelper.paidCoursePath({ courseKey: partKey });
    }
    return RouteHelper.nanodegreePath({ nanodegreeKey });
  }

  _getProgramIcon() {
    const {
      isExecutiveProgram,
      isPaidSingleCourse,
      isGraduated,
      partKey,
    } = this.props;
    const isPart = !!partKey;
    if (isPart || (isPaidSingleCourse && !isExecutiveProgram)) {
      return (
        <IconCourse color={isGraduated ? 'silver' : 'orange-light'} size="lg" />
      );
    } else {
      return (
        <IconNanodegree
          color={isGraduated ? 'silver' : 'cerulean-dark'}
          size="lg"
        />
      );
    }
  }

  _getHeading(isOmac) {
    const {
      isPaidSingleCourse,
      isExecutiveProgram,
      nanodegreeKey,
    } = this.props;
    const isNanodegree = !!nanodegreeKey;

    if (isNanodegree) {
      if (isOmac) {
        if (isPaidSingleCourse) {
          if (isExecutiveProgram) {
            return __('Executive Program');
          }
          return __('Paid Course');
        }
        return __('Nanodegree Program');
      }
      return __('Nanodegree Program');
    }
    return __('Course');
  }

  handleCardClick = (evt) => {
    const {
      type,
      courseKey,
      nanodegreeKey,
      partKey,
      path,
      isReadyForGraduation,
    } = this.props;

    evt.preventDefault();

    switch (type) {
      case SemanticTypes.POPULARND:
        window.location.href = path;
        break;

      case SemanticTypes.NANODEGREE:
        isReadyForGraduation
          ? (window.location.href = `${CONFIG.graduationUrl}/${nanodegreeKey}`)
          : this.context.router.push(this._getLinkPath());
        break;

      case SemanticTypes.COURSE:
        this.context.router.push(RouteHelper.coursePath({ courseKey }));
        break;

      case SemanticTypes.PART:
        isReadyForGraduation
          ? (window.location.href = `${CONFIG.graduationUrl}/${partKey}`)
          : this.context.router.push(this._getLinkPath());
        break;
    }
  };

  render() {
    const {
      title,
      summary,
      type,
      colorScheme,
      isGraduated,
      isLatest,
      nanodegreeKey,
      partKey,
      renderButton,
      renderFooter,
      showColorScheme,
    } = this.props;

    const paidEnrollmentHeading = this._getHeading();
    const paidEnrollmentOmacPlaceholder = this._getHeading(true);

    return (
      <li styleName="card">
        <button styleName="curtain" onClick={this.handleCardClick}>
          {title}
        </button>
        <div styleName={isLatest ? 'latest-content' : 'content'}>
          <div>
            <div styleName="header">
              {type === 'Application' && (
                <Heading size="h5" as="h3">
                  <IconEdit size="lg" /> {__('Enrollment Application')}
                </Heading>
              )}
              {type === SemanticTypes.POPULARND && (
                <Heading size="h5" as="h3">
                  <IconNanodegree color="cerulean-dark" size="lg" />{' '}
                  <OmacPlaceholder
                    root={{ key: nanodegreeKey }}
                    placeholder={__('Popular Nanodegree Program')}
                  >
                    {__('Popular Program')}
                  </OmacPlaceholder>
                </Heading>
              )}
              {(type === SemanticTypes.NANODEGREE ||
                type === SemanticTypes.PART) && (
                <Heading size="h5" as="h3">
                  {this._getProgramIcon()}{' '}
                  <OmacPlaceholder
                    root={{ key: nanodegreeKey || partKey }}
                    placeholder={paidEnrollmentOmacPlaceholder}
                  >
                    {paidEnrollmentHeading}
                  </OmacPlaceholder>
                </Heading>
              )}
              {type === SemanticTypes.COURSE && (
                <Heading size="h5" as="h3">
                  <IconCourse
                    color={isGraduated ? 'silver' : 'green'}
                    size="lg"
                  />{' '}
                  {__('Free Course')}
                </Heading>
              )}
              <Heading size="h4">{title}</Heading>
            </div>

            <div styleName="summary">
              <p>{summary}</p>
            </div>
          </div>
          <div styleName="action">
            {showColorScheme && <span styleName={colorScheme} />}
            {renderButton(this.handleCardClick, this.props)}
          </div>
        </div>

        {renderFooter(this.props)}
      </li>
    );
  }
}

export default connect(mapStateToProps)(Card);
