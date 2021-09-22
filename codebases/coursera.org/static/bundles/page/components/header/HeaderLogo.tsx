import PropTypes from 'prop-types';
import React, { Component } from 'react';
import _t from 'i18n!nls/page';
import { StyleSheet, css, color } from '@coursera/coursera-ui';
import { TrackedLink2 } from 'bundles/page/components/TrackedLink2';
import classNames from 'classnames';
import { compose } from 'recompose';
import URI from 'jsuri';
import { forEach } from 'lodash';

import Naptime from 'bundles/naptimejs';
// @ts-ignore ts-migrate(7016) FIXME: Could not find a declaration file for module 'bund... Remove this comment to see the full error message
import ThirdPartyOrganizationV1 from 'bundles/naptimejs/resources/thirdPartyOrganizations.v1';
// @ts-ignore ts-migrate(7016) FIXME: Could not find a declaration file for module 'bund... Remove this comment to see the full error message
import EnterpriseProgramsV1 from 'bundles/naptimejs/resources/enterprisePrograms.v1';
// @ts-ignore ts-migrate(7016) FIXME: Could not find a declaration file for module 'bund... Remove this comment to see the full error message
import Degrees from 'bundles/naptimejs/resources/degrees.v1';

import { SvgNavigationExpandLess, SvgNavigationExpandMore } from '@coursera/coursera-ui/svg';

import CourseraLogo from 'bundles/page/components/CourseraLogo';
import UniversityLogo from 'bundles/page/components/header/UniversityLogo';
import ThirdPartyOrganizationLogo from 'bundles/page/components/header/ThirdPartyOrganizationLogo';
import { TEAMS_LOGO_URL } from 'bundles/teams-landing/constants';

const dusk800 = '#7a7d7f';

const styles = StyleSheet.create({
  HeaderLogo: {
    minHeight: 30,
    maxHeight: 32,
    maxWidth: 200,
    minWidth: 30,
  },
  courseraLogoImage: {
    width: 127,
    height: 32,
  },
  courseraTeamsLogoImage: {
    width: 237,
    height: 32,
  },
  switcherButton: {
    ':hover': {
      textDecoration: 'none !important',
      color: color.primary,
    },
  },
  switcherLogo: {
    height: '100%',
    lineHeight: 0,
    borderRadius: 16,
    border: `1px solid ${color.divider}`,
    ':hover': {
      border: `1px solid ${color.darkGray}`,
    },
  },
  pipe: {
    margin: '8px 21px',
    height: 26,
    borderLeft: `2px solid ${color.dividerThemeDark}`,
  },
});

class HeaderLogo extends Component {
  static propTypes = {
    course: PropTypes.shape({
      id: PropTypes.string,
      name: PropTypes.string,
      brandingImageUrl: PropTypes.string,
    }),

    program: PropTypes.instanceOf(EnterpriseProgramsV1),
    degree: PropTypes.instanceOf(Degrees),
    toggleMobileMenu: PropTypes.func,
    thirdPartyOrganization: PropTypes.instanceOf(ThirdPartyOrganizationV1),
    affiliateElement: PropTypes.func,
    hexColorCode: PropTypes.string,
    disableUserInteraction: PropTypes.bool,
    enableCourseraLogoOnly: PropTypes.bool,
    handleProgramSwitcherToggle: PropTypes.func,
    isOpened: PropTypes.bool,
    displaySwitcher: PropTypes.bool,
    showEnterpriseLogo: PropTypes.bool,
    logoWrapper: PropTypes.string,
    logoQueryParams: PropTypes.object,
    isAdminOrTeachPage: PropTypes.bool
  };

  static defaultProps = {
    hexColorCode: dusk800,
    logoWrapper: 'div',
  };

  renderLogos(
    disableUserInteraction: $TSFixMe,
    enableCourseraLogoOnly: $TSFixMe,
    hexColorCode: $TSFixMe,
    showEnterpriseLogo: $TSFixMe,
    logoQueryParams: $TSFixMe
  ) {
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'program' does not exist on type 'Readonl... Remove this comment to see the full error message
    const { program, degree, course, thirdPartyOrganization, affiliateElement, logoWrapper, isAdminOrTeachPage } = this.props;
    const LogoComponentWrapperTag = logoWrapper;

    if (disableUserInteraction) {
      return (
        <LogoComponentWrapperTag className="m-a-0 body">
          <CourseraLogo hexColorCode={hexColorCode} {...css(styles.courseraLogoImage)} />
        </LogoComponentWrapperTag>
      );
    } else {
      const homeURL = new URI('/');
      if (isAdminOrTeachPage) {
        homeURL.setPath('/admin');
      } else if (showEnterpriseLogo) {
        homeURL.setPath('/business/teams');
      } else if (program) {
        const {
          program: {
            definition: {
              metadata: { slug },
            },
          },
        } = program;
        homeURL.setPath(`/programs/${slug}`);
      } else if (degree) {
        const { slug } = degree;
        homeURL.setPath(`/degrees/${slug}/home`);
      }

      forEach(logoQueryParams, (value, key) => {
        if (value === undefined) {
          return;
        }

        homeURL.addQueryParam(key, value);
      });

      let otherLogo;
      let label;

      if (enableCourseraLogoOnly) {
        otherLogo = null;
        label = null;
      } else if (showEnterpriseLogo) {
        label = _t('Coursera for Teams');

        if (affiliateElement) {
          otherLogo = (
            <span className="horizontal-box align-items-absolute-center  c-ph-logo-desktop-only">
              <div {...css('horizontal-box align-items-vertical-center', styles.HeaderLogo)}>
                <div {...css(styles.pipe)} />
                {affiliateElement}
              </div>
            </span>
          );
        }
      } else if (thirdPartyOrganization) {
        otherLogo = (
          <span className="horizontal-box align-items-absolute-center  c-ph-logo-desktop-only">
            <div {...css('horizontal-box align-items-vertical-center', styles.HeaderLogo)}>
              <div {...css(styles.pipe)} />
              <ThirdPartyOrganizationLogo thirdPartyOrganization={thirdPartyOrganization} logoWidth={160} />
            </div>
          </span>
        );
        const { name } = thirdPartyOrganization;
        label = _t('Coursera for #{name}', { name });
      } else if (course || degree) {
        if (course) {
          const { name } = course;
          label = _t('#{name} home page | Coursera', { name });
        }

        if (degree) {
          const { name } = degree;
          label = _t('#{name} home page | Coursera', { name });
        }
        // @ts-ignore ts-migrate(2741) FIXME: Property 'partner' is missing in type '{ course: a... Remove this comment to see the full error message
        otherLogo = <UniversityLogo course={course} degree={degree} />;
      }

      return (
        <LogoComponentWrapperTag className="m-a-0 body">
          <TrackedLink2
            href={homeURL.toString()}
            className="c-logo horizontal-box align-items-vertical-center nostyle"
            trackingName="logo"
            aria-label={label || 'Coursera'}
          >
            {showEnterpriseLogo ? (
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <CourseraLogo
                  key="courseraLogo"
                  hexColorCode={hexColorCode}
                  imgSrc={TEAMS_LOGO_URL}
                  ariaHidden
                  {...css(styles.courseraTeamsLogoImage)}
                />
                {affiliateElement && otherLogo}
              </div>
            ) : (
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <CourseraLogo key="courseraLogo" ariaHidden {...css(styles.courseraLogoImage)} />
                {otherLogo}
              </div>
            )}
          </TrackedLink2>
        </LogoComponentWrapperTag>
      );
    }
  }

  render() {
    const {
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'hexColorCode' does not exist on type 'Re... Remove this comment to see the full error message
      hexColorCode,
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'disableUserInteraction' does not exist o... Remove this comment to see the full error message
      disableUserInteraction,
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'enableCourseraLogoOnly' does not exist o... Remove this comment to see the full error message
      enableCourseraLogoOnly,
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'handleProgramSwitcherToggle' does not ex... Remove this comment to see the full error message
      handleProgramSwitcherToggle,
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'isOpened' does not exist on type 'Readon... Remove this comment to see the full error message
      isOpened,
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'displaySwitcher' does not exist on type ... Remove this comment to see the full error message
      displaySwitcher,
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'showEnterpriseLogo' does not exist on ty... Remove this comment to see the full error message
      showEnterpriseLogo,
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'logoQueryParams' does not exist on type ... Remove this comment to see the full error message
      logoQueryParams,
    } = this.props;

    const colorCode = disableUserInteraction ? dusk800 : hexColorCode;
    const headerLogoWrapperClass = classNames([
      'rc-HeaderLogo',
      'c-ph-logo',
      'bt3-navbar-header',
      'horizontal-box',
      'align-items-vertical-center',
      'align-items-absolute-center',
    ]);
    const SwitcherComponent = isOpened ? SvgNavigationExpandLess : SvgNavigationExpandMore;

    return (
      <div className={headerLogoWrapperClass}>
        <div className="horizontal-box align-items-vertical-center">
          {this.renderLogos(
            disableUserInteraction,
            enableCourseraLogoOnly,
            colorCode,
            showEnterpriseLogo,
            logoQueryParams
          )}
          {displaySwitcher && (
            <button
              type="button"
              {...css(
                'button-link horizontal-box align-items-absolute-center m-l-1 c-ph-logo-desktop-only',
                styles.switcherButton
              )}
              onClick={handleProgramSwitcherToggle}
              data-e2e="SwitcherButton"
              id="switcher-expander"
              aria-expanded={isOpened}
              aria-haspopup={true}
              aria-label={_t('Select Coursera Membership')}
            >
              <span {...css('align-items-absolute-center', styles.switcherLogo)}>
                <SwitcherComponent
                  size={18}
                  hoverColor={color.primary}
                  htmlAttributes={{ focusable: 'false' }}
                  title={isOpened ? _t('Close Coursera membership menu') : _t('Open Coursera membership menu')}
                />
              </span>
            </button>
          )}
        </div>
      </div>
    );
  }
}

export default compose(
  // @ts-expect-error ts-migrate(2339) FIXME: Property 'thirdPartyOrganizationId' does not exist... Remove this comment to see the full error message
  Naptime.createContainer(({ thirdPartyOrganizationId }) => ({
    thirdPartyOrganization: thirdPartyOrganizationId
      ? ThirdPartyOrganizationV1.get(thirdPartyOrganizationId, {
          fields: ['rectangularLogo', 'squareLogo', 'name'],
          required: false,
        })
      : null,
  }))
  // @ts-expect-error ts-migrate(2345) FIXME: Argument of type 'typeof HeaderLogo' is not assign... Remove this comment to see the full error message
)(HeaderLogo);
