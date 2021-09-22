import _ from 'underscore';
import PropTypes from 'prop-types';
import React from 'react';
import classNames from 'classnames';
import { getClassmatesProfile } from 'bundles/classmates/actions/ClassmatesProfileActions';
import ProfileImageWithRole from 'bundles/classmates/components/ProfileImageWithRole';
import {
  getProgressString,
  getCourseRoleString,
  hasModeratorAccess,
  getCourseRoleValue,
  isTopContributor,
} from 'bundles/classmates/utils/lib';
import ClassmatesProfileStore from 'bundles/classmates/stores/ClassmatesProfileStore';
import Icon from 'bundles/iconfont/Icon';
// @ts-ignore ts-migrate(7016) FIXME: Could not find a declaration file for module 'js/l... Remove this comment to see the full error message
import provideFluxibleAppContext from 'js/lib/provideFluxibleAppContext';
// @ts-ignore ts-migrate(7016) FIXME: Could not find a declaration file for module 'js/l... Remove this comment to see the full error message
import setupFluxibleApp from 'js/lib/setupFluxibleApp';
import { FormattedMessage } from 'js/lib/coursera.react-intl';
import connectToStores from 'vendor/cnpm/fluxible.v0-4/addons/connectToStores';
import _t from 'i18n!nls/classmates';
import 'css!./__styles__/MiniProfile';

class MiniProfile extends React.Component {
  static propTypes = {
    externalId: PropTypes.string.isRequired,
    courseId: PropTypes.string,
    courseRole: PropTypes.string,
    orientationClass: PropTypes.string.isRequired,
    profile: PropTypes.object,
    profileRequested: PropTypes.bool,
    toolTipId: PropTypes.string,
  };

  static contextTypes = {
    executeAction: PropTypes.func.isRequired,
  };

  state = {
    transitionContainer: false,
  };

  componentWillMount() {
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'profile' does not exist on type 'Readonl... Remove this comment to see the full error message
    if (!this.props.profile || _(this.props.profile).isEmpty()) {
      this.context.executeAction(getClassmatesProfile, {
        // @ts-expect-error ts-migrate(2339) FIXME: Property 'externalId' does not exist on type 'Read... Remove this comment to see the full error message
        externalId: this.props.externalId,
        // @ts-expect-error ts-migrate(2339) FIXME: Property 'courseId' does not exist on type 'Readon... Remove this comment to see the full error message
        courseId: this.props.courseId,
      });
    }
  }

  componentDidMount() {
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'transitionTimeout' does not exist on typ... Remove this comment to see the full error message
    this.transitionTimeout = setTimeout(() => {
      this.setState({ transitionContainer: true });
    }, 100);
  }

  componentWillUnmount() {
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'transitionTimeout' does not exist on typ... Remove this comment to see the full error message
    if (this.transitionTimeout) {
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'transitionTimeout' does not exist on typ... Remove this comment to see the full error message
      clearTimeout(this.transitionTimeout);
    }
  }

  hasLoaded() {
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'profile' does not exist on type 'Readonl... Remove this comment to see the full error message
    return this.props.profile && !_(this.props.profile).isEmpty();
  }

  getProfileDescription(courseRole: $TSFixMe, profile: $TSFixMe) {
    if (hasModeratorAccess(courseRole) || isTopContributor(courseRole)) {
      return getCourseRoleString(courseRole);
    }
    return getProgressString(profile.courseProgressPercentage, profile.isCourseCompleted);
  }

  renderMiniProfile() {
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'profile' does not exist on type 'Readonl... Remove this comment to see the full error message
    const { profile, toolTipId } = this.props;
    const courseRole = getCourseRoleValue(
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'courseRole' does not exist on type 'Read... Remove this comment to see the full error message
      profile.courseRole || this.props.courseRole,
      profile['forumHelpers.v1'] && profile['forumHelpers.v1'].helperStatus
    );
    const profileFooterClassnames = classNames(
      'profile-footer',
      'caption-text',
      'color-secondary-text',
      'bgcolor-black-g1',
      'horizontal-box',
      'align-items-absolute-center'
    );
    return (
      <div className="vertical-box" id={toolTipId} role="tooltip">
        <div className="vertical-box profile-header align-items-vertical-center">
          <div className="profile-photo">
            <ProfileImageWithRole
              courseRole={courseRole}
              fullName={profile.fullName}
              profileImageUrl={profile.photoUrl || ''}
            />
          </div>
          <div className="body-1-text pii-hide">{profile.fullName}</div>
          <div className="caption-text color-secondary-text">{this.getProfileDescription(courseRole, profile)}</div>
        </div>

        <div className={profileFooterClassnames}>
          <FormattedMessage
            message={_t('{postsCount} {postsCount, plural, =1 { post} other { posts}}')}
            postsCount={profile.postsCount || '0'}
          />
          <span className="dot-spacing"> · </span>
          <FormattedMessage
            message={_t('{upvotes} {upvotes, plural, =1 { upvote} other { upvotes}}')}
            upvotes={profile.votesReceivedCount || '0'}
          />
        </div>
      </div>
    );
  }

  renderProfileUnavailable() {
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'profileRequested' does not exist on type... Remove this comment to see the full error message
    if (this.props.profileRequested) {
      return (
        <div className="unavailable-state">
          <FormattedMessage message={_t('Profile not available')} />
        </div>
      );
    }
    return (
      <div className="loading-state">
        <Icon name="spinner" size="3x" spin={true} />
      </div>
    );
  }

  render() {
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'orientationClass' does not exist on type... Remove this comment to see the full error message
    const containerClasses = classNames('rc-MiniProfile', 'card-one-clicker', this.props.orientationClass, {
      'transition-in': this.state.transitionContainer,
    });

    return (
      <div className={containerClasses}>
        {this.hasLoaded() ? this.renderMiniProfile() : this.renderProfileUnavailable()}
      </div>
    );
  }
}

export default _.compose(
  provideFluxibleAppContext((fluxibleContext: $TSFixMe) => {
    return setupFluxibleApp(fluxibleContext, (app: $TSFixMe) => {
      app.registerStore(ClassmatesProfileStore);

      return fluxibleContext;
    });
  }),
  connectToStores(
    ['CourseStore', 'ClassmatesProfileStore'],
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'externalId' does not exist on type '{}'.
    ({ CourseStore, ClassmatesProfileStore: myClassmatesProfileStore }, { externalId }) => {
      return {
        courseId: CourseStore.getCourseId(),
        profile: _(myClassmatesProfileStore.profiles).findWhere({ externalId }),
        profileRequested: myClassmatesProfileStore.profilesRequested.includes(externalId),
      };
    }
  )
)(MiniProfile);
