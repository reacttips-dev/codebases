import PropTypes from 'prop-types';
import React from 'react';
import classNames from 'classnames';
import ProfileImage from 'bundles/phoenix/components/ProfileImage';
import _t from 'i18n!nls/classmates';
import 'css!bundles/classmates/components/__styles__/ProfileImageWithRole';

class ProfileImageWithRole extends React.Component {
  static propTypes = {
    courseRole: PropTypes.string,
    fullName: PropTypes.string.isRequired,
    profileImageUrl: PropTypes.string,
    alt: PropTypes.string,
    ariaHidden: PropTypes.bool,
  };

  static defaultProps = {
    ariaHidden: false,
  };

  getCourseRoleIconInfo(courseRole: $TSFixMe) {
    switch (courseRole) {
      case 'INSTRUCTOR':
        return {
          letter: _t('I'),
          className: 'bgcolor-primary',
        };
      case 'COURSE_ASSISTANT':
      case 'MENTOR':
        return {
          letter: _t('M'),
          className: 'bgcolor-accent-brown',
        };
      case 'UNIVERSITY_ADMIN':
      case 'DATA_COORDINATOR':
        return {
          letter: _t('S'),
          className: 'bgcolor-accent-brown',
        };
      case 'TOP_CONTRIBUTOR':
        return {
          letter: _t('C'),
          className: 'bgcolor-accent-brown',
        };
      default:
        return undefined;
    }
  }

  render() {
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'courseRole' does not exist on type 'Read... Remove this comment to see the full error message
    const courseRoleInfo = this.getCourseRoleIconInfo(this.props.courseRole);
    const className = classNames(
      'course-role-icon',
      'caption-text',
      'horizontal-box',
      'align-items-absolute-center',
      courseRoleInfo && courseRoleInfo.className
    );
    return (
      <span className="rc-ProfileImageWithRole">
        <ProfileImage
          // @ts-expect-error ts-migrate(2339) FIXME: Property 'fullName' does not exist on type 'Readon... Remove this comment to see the full error message
          fullName={this.props.fullName}
          // @ts-expect-error ts-migrate(2339) FIXME: Property 'profileImageUrl' does not exist on type ... Remove this comment to see the full error message
          profileImageUrl={this.props.profileImageUrl}
          // @ts-expect-error ts-migrate(2339) FIXME: Property 'alt' does not exist on type 'Readonly<{}... Remove this comment to see the full error message
          alt={this.props.alt}
          // @ts-expect-error ts-migrate(2339) FIXME: Property 'ariaHidden' does not exist on type 'Read... Remove this comment to see the full error message
          ariaHidden={this.props.ariaHidden}
          width={36}
          height={36}
        />
        {courseRoleInfo && <span className={className}>{courseRoleInfo.letter}</span>}
      </span>
    );
  }
}

export default ProfileImageWithRole;
