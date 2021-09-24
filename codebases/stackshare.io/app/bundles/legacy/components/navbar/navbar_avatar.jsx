import React, {Component} from 'react';
import {truncateText} from '../../../../shared/utils/truncate-text';

export default class NavbarAvatar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false
    };
  }

  avatarClick = () => {
    this.setState({open: !this.state.open});
  };

  hideMenu = () => {
    this.setState({open: false});
  };

  render() {
    const {
      companies,
      personal_stack,
      current_user: {username, image_url},
      stripe_portal_url
    } = this.props;

    return (
      <div className={`navbar__avatar${this.state.open ? ' open' : ''}`} onClick={this.avatarClick}>
        <img src={image_url} alt={username} />
        {this.state.open && (
          <div className="navbar__menu">
            <a href={`/${username}`}>Profile</a>
            <a href="/settings/email" className="navbar__avatar__divider">
              Email Settings
            </a>
            {companies.map(company => {
              return (
                <a href={company.canonical_url} key={`company-${company.id}`}>
                  {company.name}
                </a>
              );
            })}
            {stripe_portal_url && (
              <a href={`${stripe_portal_url}`} target="_blank" rel="noopener noreferrer">
                Payment Settings
              </a>
            )}
            {personal_stack && personal_stack.canonical_url && (
              <a href={`${personal_stack.canonical_url}`}>
                {truncateText(personal_stack.name, 25, '... ')}
              </a>
            )}
            <a href="/create-stack/scan" className="navbar__avatar__divider">
              Create A Stack
            </a>
            <a
              href="/users/logout"
              onClick={event => {
                event.preventDefault();
                if (window.analytics) {
                  window.analytics.reset();
                }
                window.location = event.target.href;
              }}
            >
              Sign Out
            </a>
          </div>
        )}
        {this.state.open && !this.state.hovering && (
          <div className="react-overlay transparent" onClick={this.hideMenu} />
        )}
      </div>
    );
  }
}
