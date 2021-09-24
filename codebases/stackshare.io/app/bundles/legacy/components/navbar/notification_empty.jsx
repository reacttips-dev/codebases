import React, {Component} from 'react';

export default class NotificationEmpty extends Component {
  render() {
    return (
      <div className="navbar__notifications__menu__container empty">
        <p>You have no notifications.</p>
        <p>If you&apos;re looking for something cool to do,</p>
        <p>
          check out{' '}
          <a href="/match" style={{fontWeight: '700'}}>
            Stack Match
          </a>
          .
        </p>
      </div>
    );
  }
}
