import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import CurrentUserDetailsService from '../../services/CurrentUserDetailsService';

// import { getStore } from '../../stores/get-store';
import { Icon } from '@postman/aether';
import Link from '../../../appsdk/components/link/Link';

const AvatarContainer = ({ userId, customUrl, linkProfile, children }) => {
  if (!userId || !linkProfile) {
    return children;
  }
  const url = customUrl ? customUrl : `${pm.dashboardUrl}/users/${userId}`;
  return (
    <Link to={url}>{ children }</Link>
  );
};

class Avatar extends Component {
  constructor (props) {
    super(props);
  }

  getUserClasses (hideStockProfilePic) {
    let userId = parseInt(this.props.userId);
    return classnames({
      'pm-user-hide-stock-profile-pic': hideStockProfilePic,
      'icon-user-avatar-default': true,
      'pm-user-avatar-icon': true,
      [`pm-user-avatar-icon-${userId % 10}`]: true,
      'pm-icon-xs': this.props.size === 'x-small',
      'pm-icon-sm': this.props.size === 'small',
      'pm-icon-md': this.props.size === 'medium',
      'pm-icon-lg': this.props.size === 'large',
      'pm-icon-xl': this.props.size === 'x-large',
      'pm-icon-xxl': this.props.size === 'xx-large'
    });
  }

  getProfilePicUrl (org, id) {
    if (_.size(org) > 0 && id) {
      const user = _.find(org[0].team_users, (user) => {
        return user.id.toString() === id.toString();
      });

      if (user) {
        return user.profile_pic_url;
      }
    }

    return null;
  }

  render () {
    let currentUser = this.props.user || CurrentUserDetailsService.getCurrentUserDetails(),

        // Do not modify this order of how the profilePicUrl is set
        // If a customPic doesn't exist, only then it'll use the userID logic.
        // If the order is modified, then it has scope for breaking at multiple places
        profilePicUrl = this.props.customPic || this.getProfilePicUrl(currentUser.organizations, this.props.userId);

    return (
      <AvatarContainer linkProfile={this.props.linkProfile} customUrl={this.props.customUrl} userId={this.props.userId}>
        <div className='avatar' ref={this.props.innerRef}>
          {
            this.props.type === 'user' &&
              <span className={this.getUserClasses(!!profilePicUrl)}>
                {profilePicUrl &&
                  <div
                    className='pm-user-avatar-custompic'
                    style={{ backgroundImage: `url(${profilePicUrl})` }}
                  />
                }
              </span>
          }
          {
            this.props.type === 'adduser' &&
              <Icon
                name='icon-action-add-stroke'
                color='content-color-tertiary'
                className='icon__circular'
                size='small'
              />
          }
        </div>
      </AvatarContainer>
    );
  }
}

Avatar.propTypes = {
  customPic: PropTypes.string,
  linkProfile: PropTypes.bool,
  innerRef: PropTypes.any,
  size: PropTypes.string,
  type: PropTypes.string,
  userId: PropTypes.any,
  customUrl: PropTypes.string
};

Avatar.defaultProps = {
  type: 'user',
  size: 'large',
  linkProfile: true
};

export default React.forwardRef((props, ref) => <Avatar {...props} innerRef={ref} />);
