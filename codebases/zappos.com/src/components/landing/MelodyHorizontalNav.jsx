import { Component } from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';

import { stripSpecialChars } from 'helpers';
import LandingPageLink from 'components/landing/LandingPageLink';
import { withErrorBoundary } from 'components/common/MartyErrorBoundary';

import css from 'styles/components/landing/melodyHorizontalNav.scss';

export class MelodyHorizontalNav extends Component {
  state = {
    openedDropdown: null
  };

  onHeadingClick = e => {
    const headingIndex = e.currentTarget.getAttribute('data-heading-index');
    if (this.state.openedDropdown === headingIndex) {
      this.setState({ openedDropdown: null }); // close dropdown if heading clicked while open
    } else {
      this.setState({ openedDropdown: headingIndex });
    }
  };

  makeCrumbs() {
    const { slotDetails: { crumbs }, onComponentClick, slotIndex } = this.props;
    const crumbsArr = [];
    crumbs.map((crumb, index) => {
      const { link, gae, text } = crumb;
      const linkProps = {
        'onClick': onComponentClick,
        'data-eventlabel': 'melodyHorizontalNav',
        'data-eventvalue': gae,
        'data-slotindex': slotIndex
      };
      if (index === crumbs.length - 1) { // last crumb - do not render as a link
        crumbsArr.push(
          <li key={gae}><span>{text}</span></li>
        );
      } else {
        crumbsArr.push(
          <li key={gae}>
            <LandingPageLink url={link} {...linkProps}>
              {text}
            </LandingPageLink>
          </li>
        );
      }
    });
    return (
      <ul className={css.crumbsList}>
        {crumbsArr}
      </ul>
    );
  }

  makeHorizontalNavMenu({ headingtext, links }, index) {
    const { onComponentClick, slotIndex } = this.props;
    const { testId } = this.context;
    return (
      <li key={`${stripSpecialChars(headingtext)}_${index}`}>
        <button
          type="button"
          onClick={this.onHeadingClick}
          aria-expanded={this.state.openedDropdown && this.state.openedDropdown === `${index}` ? 'true' : 'false'}
          data-heading-index={index}
          data-test-id={testId('melodyHorizontalNavDropDownButton')}>
          {headingtext}
        </button>
        <ul data-test-id={testId('melodyHorizontalNavDropDown')}>
          {links.map((individualLink, j) => {
            const { link, gae, text } = individualLink;
            const linkProps = {
              'onClick': onComponentClick,
              'data-eventlabel': 'melodyHorizontalNav',
              'data-eventvalue': gae,
              'data-slotindex': slotIndex
            };
            return (
              <li key={`${stripSpecialChars(link)}_${j}`}>
                <LandingPageLink url={link} {...linkProps}>
                  {text}
                </LandingPageLink>
              </li>
            );
          })}
        </ul>
      </li>
    );
  }

  render() {
    const { slotName, slotDetails: { linkSections, monetateId } } = this.props;
    const { openedDropdown } = this.state;
    const { testId } = this.context;
    return (
      <div className={css.wrap} data-slot-id={slotName} data-monetate-id={monetateId}>
        {/* This style linter is a real piece of work sometimes. hasOpenedNav falsey coming up as undefined */}
        {/* eslint-disable-next-line css-modules/no-undef-class */}
        <div className={cn(css.content, { [css.hasOpenedNav] : openedDropdown })}>
          {this.makeCrumbs()}
          <ul className={css.dropdownsWrap} data-test-id={testId('melodyHorizontalNavDropDownWrap')}>
            {linkSections.map((navSection, index) => this.makeHorizontalNavMenu(navSection, index))}
          </ul>
        </div>
      </div>
    );
  }
}

MelodyHorizontalNav.contextTypes = {
  testId: PropTypes.func
};

export default withErrorBoundary('MelodyHorizontalNav', MelodyHorizontalNav);
