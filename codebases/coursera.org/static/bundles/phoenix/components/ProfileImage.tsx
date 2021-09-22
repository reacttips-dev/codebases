import classNames from 'classnames';
import React from 'react';
import _t from 'i18n!nls/phoenix';

import Imgix from 'js/components/Imgix';

import 'css!bundles/phoenix/components/__styles__/ProfileImage';

type Props = {
  profileImageUrl?: string | null;
  fullName?: string | null;
  width?: number;
  height?: number;
  alt?: string;
  ariaHidden?: boolean;
  imgixParams?: any;
  className?: string;
};

class ProfileImage extends React.Component<Props> {
  static defaultProps = {
    width: 36,
    height: 36,
    alt: '',
    ariaHidden: true,
  };

  render() {
    const { fullName, profileImageUrl, alt, ariaHidden } = this.props;

    let altName = alt;
    if (ariaHidden) {
      altName = ''; // IE11 does not interpret aria-hidden properly
    } else if (!altName) {
      if (fullName) {
        altName = _t('Profile image for #{learnerName}', { learnerName: fullName });
      } else {
        altName = _t('Profile image');
      }
    }

    let profile;
    if (profileImageUrl) {
      profile = <Imgix src={profileImageUrl} {...this.props} alt={altName} />;
    } else if (fullName && typeof fullName.trim === 'function') {
      const allNames = fullName.trim().split(' ');
      const firstInitial = allNames[0][0];
      const lastInitial = allNames.length > 1 ? allNames[allNames.length - 1][0] : '';

      profile = (
        <div className="horizontal-box align-items-absolute-center">
          <p>{firstInitial + lastInitial}</p>
          <div className="sr-only">{altName}</div>
        </div>
      );
    }

    const classes = classNames('c-profile-image', this.props.className || '', {
      'c-profile-initials': !profileImageUrl,
    });

    return (
      <div className="rc-ProfileImage pii-hide">
        <div
          className={classes}
          style={{ width: this.props.width, height: this.props.height }}
          aria-hidden={this.props.ariaHidden}
        >
          {profile}
        </div>
      </div>
    );
  }
}

export default ProfileImage;
