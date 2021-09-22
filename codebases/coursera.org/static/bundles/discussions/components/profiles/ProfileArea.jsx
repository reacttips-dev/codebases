import React from 'react';
import _ from 'underscore';
import PropTypes from 'prop-types';
import { Link } from 'react-router';
import { getCourseRoleString, getCourseRoleValue } from 'bundles/classmates/utils/lib';
import ProfileImageWithRole from 'bundles/classmates/components/ProfileImageWithRole';
import MiniProfileRenderer from 'bundles/classmates/components/MiniProfileRenderer';
import { getProfileLink } from 'bundles/discussions/utils/discussionsUrl';
import connectToStores from 'vendor/cnpm/fluxible.v0-4/addons/connectToStores';
import 'css!./__styles__/ProfileArea';

class ProfileArea extends React.Component {
  static propTypes = {
    externalUserId: PropTypes.string.isRequired,
    fullName: PropTypes.string.isRequired,
    profileImageUrl: PropTypes.string,
    courseRole: PropTypes.string,
    helperStatus: PropTypes.string,
    onDisplayMiniProfile: PropTypes.func,
    profile: PropTypes.object,
  };

  static contextTypes = {
    router: PropTypes.object.isRequired,
    executeAction: PropTypes.func.isRequired,
  };

  render() {
    const {
      externalUserId,
      fullName,
      profileImageUrl,
      courseRole,
      profile,
      onDisplayMiniProfile,
      helperStatus,
    } = this.props;

    const role = getCourseRoleValue(courseRole, helperStatus);

    const roleString = getCourseRoleString(role);
    const hasRole = typeof roleString !== 'undefined' && roleString !== 'undefined';
    const ariaLabel = `Name: ${fullName}, 
                       ${hasRole ? `Role: ${roleString}, ` : ''}
                       ${profile ? `${profile.postsCount} posts, ` : ''}
                       ${profile ? `${profile.votesReceivedCount} votes` : ''}`;
    const toolTipId = `${externalUserId}-tooltip`;

    return (
      <span className="rc-ProfileArea">
        <Link
          className="nostyle c-profile-image-wrapper pii-hide"
          to={getProfileLink(externalUserId)}
          onMouseEnter={(e) => {
            if (onDisplayMiniProfile) {
              onDisplayMiniProfile(this.miniProfile);
            }

            this.miniProfile.display(e);
          }}
          onFocus={(e) => {
            if (onDisplayMiniProfile) {
              onDisplayMiniProfile(this.miniProfile);
            }

            this.miniProfile.display({
              pageY: e.target.offsetTop,
            });
          }}
          onMouseLeave={(e) => this.miniProfile.hide(e)}
          onBlur={(e) => this.miniProfile.hide(e)}
          aria-label={ariaLabel}
        >
          <ProfileImageWithRole
            courseRole={role}
            profileImageUrl={profileImageUrl}
            fullName={fullName}
            alt={fullName}
          />
        </Link>

        <span data-js="mini-profile" aria-hidden="true">
          <MiniProfileRenderer
            ref={(c) => {
              this.miniProfile = c;
            }}
            source="profileArea"
            externalId={externalUserId}
            courseRole={role}
            toolTipId={toolTipId}
          />
        </span>
      </span>
    );
  }
}

export default _.compose(
  connectToStores(
    ['CourseStore', 'ClassmatesProfileStore'],
    ({ CourseStore, ClassmatesProfileStore: classmatesProfileStore }, { externalUserId }) => {
      return {
        courseId: CourseStore.getCourseId(),
        profile: _(classmatesProfileStore.profiles).findWhere({ externalId: externalUserId }),
      };
    }
  )
)(ProfileArea);
