import PropTypes from 'prop-types';
import React, { Component } from 'react';
import classNames from 'classnames';
import { TrackedA } from 'bundles/page/components/TrackedLink2';

import _t from 'i18n!nls/page';

import 'css!./__styles__/HeaderRightNavButton';

class HeaderRightNavButton extends Component {
  static propTypes = {
    href: PropTypes.string,
    label: PropTypes.string.isRequired,
    name: PropTypes.string,
    onClick: PropTypes.func,
    mobileOnly: PropTypes.bool,
    wrapperClassName: PropTypes.string,
    linkClassName: PropTypes.string,
    linkRel: PropTypes.string,
    htmlAttributes: PropTypes.object,
    noBorder: PropTypes.bool,
    openInNewWindow: PropTypes.bool,
    isEnterpriseLink: PropTypes.bool,
    icon: PropTypes.element,
    // below props injected by withKeyboardControls HOC in ./AuthenticatedAccountDropdown.jsx
    tabIndex: PropTypes.number,
    onKeyDown: PropTypes.func,
    targetRef: PropTypes.func,
    domRef: PropTypes.func,
  };

  static defaultProps = {
    href: '#', // for accessibility
  };

  handleClick(ev: $TSFixMe) {
    const { props } = this;
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'onClick' does not exist on type 'Readonl... Remove this comment to see the full error message
    if (typeof this.props.onClick === 'function') {
      ev.preventDefault();
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'onClick' does not exist on type 'Readonl... Remove this comment to see the full error message
      props.onClick(ev);
    }
  }

  renderButton = () => {
    const {
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'linkClassName' does not exist on type 'R... Remove this comment to see the full error message
      linkClassName,
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'href' does not exist on type 'Readonly<{... Remove this comment to see the full error message
      href,
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'label' does not exist on type 'Readonly<... Remove this comment to see the full error message
      label,
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'name' does not exist on type 'Readonly<{... Remove this comment to see the full error message
      name,
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'linkRel' does not exist on type 'Readonl... Remove this comment to see the full error message
      linkRel,
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'htmlAttributes' does not exist on type '... Remove this comment to see the full error message
      htmlAttributes,
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'tabIndex' does not exist on type 'Readon... Remove this comment to see the full error message
      tabIndex,
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'onKeyDown' does not exist on type 'Reado... Remove this comment to see the full error message
      onKeyDown,
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'targetRef' does not exist on type 'Reado... Remove this comment to see the full error message
      targetRef,
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'openInNewWindow' does not exist on type ... Remove this comment to see the full error message
      openInNewWindow,
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'icon' does not exist on type 'Readonly<{... Remove this comment to see the full error message
      icon: Icon,
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'linkRole' does not exist on type 'Readon... Remove this comment to see the full error message
      linkRole,
    } = this.props;

    // NOTE: Ensure that label prop has already been localized e.g <HeaderRightNavButton label=_t(...) />
    const ariaLabel =
      label === _t('For Enterprise') ? _t('For Enterprise. See information about Coursera for Business') : label;

    const role = linkRole;
    const newHtmlAttributes = openInNewWindow ? { target: '_blank', ...htmlAttributes } : htmlAttributes;

    return (
      <TrackedA
        aria-label={ariaLabel}
        href={href}
        id={`${name}-link`}
        className={linkClassName}
        role={role}
        trackingName={name ? `header_right_nav_button_${name.split('-').join('_')}` : 'header_right_nav_button'}
        data={{ name }}
        rel={linkRel}
        onClick={(ev) => this.handleClick(ev)}
        onKeyDown={onKeyDown}
        refAlt={targetRef}
        tabIndex={tabIndex}
        {...newHtmlAttributes}
      >
        {Icon && <Icon size={20} />}
        {label}
      </TrackedA>
    );
  };

  render() {
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'name' does not exist on type 'Readonly<{... Remove this comment to see the full error message
    const { name, mobileOnly, noBorder, wrapperClassName, isEnterpriseLink, domRef } = this.props;

    const elClassName = classNames('rc-HeaderRightNavButton', 'c-ph-right-nav-button', wrapperClassName, {
      'c-ph-right-nav-mobile-only': mobileOnly,
      'c-ph-right-nav-no-border': noBorder,
      'c-ph-enterprise': isEnterpriseLink,
      isLohpRebrand: true,
    });

    if (name === 'enterprise' || name === 'student') {
      return <span className={elClassName}>{this.renderButton()}</span>;
    }

    return (
      <li role="none" className={elClassName} ref={domRef}>
        {this.renderButton()}
      </li>
    );
  }
}

export default HeaderRightNavButton;
