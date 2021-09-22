import PropTypes from 'prop-types';
import React, { Component } from 'react';
import classNames from 'classnames';
import _t from 'i18n!nls/page';
import { css, StyleSheet } from '@coursera/coursera-ui';
import cookie from 'js/lib/cookie';
import { getActionUrl } from 'bundles/user-account/common/lib';

import TrackedButton from 'bundles/page/components/TrackedButton';

const styles = StyleSheet.create({
  SignoutForm: {
    width: '100%',
    height: '100%',
    padding: 0,
  },
});

export default class SignoutButton extends Component {
  static propTypes = {
    mobileOnly: PropTypes.bool,
    tabIndex: PropTypes.number,
    onKeyDown: PropTypes.func,
    targetRef: PropTypes.func,
  };

  state = {
    componentDidMount: false,
  };

  componentDidMount() {
    this.setState(() => ({ componentDidMount: true }));
  }

  render() {
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'mobileOnly' does not exist on type 'Read... Remove this comment to see the full error message
    const { mobileOnly, onKeyDown, tabIndex, targetRef } = this.props;
    const { componentDidMount } = this.state;
    const csrfToken = cookie.get('CSRF3-Token');
    const liClassName = classNames(
      'c-ph-right-nav-button',
      'rc-HeaderRightNavButton',
      mobileOnly && 'c-ph-right-nav-mobile-only'
    );
    const trackingName = 'logout_btn';

    // @ts-expect-error ts-migrate(2345) FIXME: Argument of type 'string | null' is not assignable... Remove this comment to see the full error message
    const action = (componentDidMount && getActionUrl('logout', csrfToken)) || '';

    return (
      <li className={liClassName} role="none">
        <form
          role="none"
          {...css('c-ph-right-nav-button isLohpRebrand', styles.SignoutForm)}
          action={action}
          method="post"
        >
          <TrackedButton
            id="logout-btn"
            trackingName={trackingName}
            role="menuitem"
            tabIndex={tabIndex}
            ref={targetRef}
            onKeyDown={onKeyDown}
            className="sign-out"
            type="submit"
            data-popup-close
            style={{ border: 'none' }}
          >
            {_t('Log Out')}
          </TrackedButton>
        </form>
      </li>
    );
  }
}
