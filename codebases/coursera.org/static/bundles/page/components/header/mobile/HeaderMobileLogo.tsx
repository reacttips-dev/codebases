import React from 'react';
import classNames from 'classnames';
import { StyleSheet, css } from '@coursera/coursera-ui';
import CourseraLogo from 'bundles/page/components/CourseraLogo';
import { TrackedLink2 } from 'bundles/page/components/TrackedLink2';
import { TEAMS_LOGO_URL } from 'bundles/teams-landing/constants';
import { REBRAND_COLORS } from 'bundles/front-page/components/modules/buttons/sharedStyles';

import 'css!./__styles__/HeaderMobileLogo';

const styles = StyleSheet.create({
  courseraTeamsLogoImage: {
    width: 215,
    height: 21,
  },
});

type Props = {
  showEnterpriseLogo?: boolean;
  showAccountDropdown?: boolean;
  isAdminOrTeachPage?: boolean;
};

const HeaderMobileLogo: React.FC<Props> = ({ showEnterpriseLogo, showAccountDropdown, isAdminOrTeachPage }) => {
  let logoHref: string;

  if (isAdminOrTeachPage) {
    logoHref = '/admin';
  } else if (showEnterpriseLogo) {
    logoHref = '/business/teams';
  } else {
    logoHref = '/';
  }

  return (
    <TrackedLink2
      href={logoHref}
      className={classNames('c-mobile-logo horizontal-box align-items-vertical-center isLohpRebrand', {
        'mobile-header-logo-center': showAccountDropdown,
      })}
      trackingName="mobile_header_logo"
    >
      {showEnterpriseLogo ? (
        <CourseraLogo key="courseraLogo" imgSrc={TEAMS_LOGO_URL} ariaHidden {...css(styles.courseraTeamsLogoImage)} />
      ) : (
        <div style={{ display: 'flex' }}>
          <CourseraLogo hexColorCode={REBRAND_COLORS.BLUE} />
        </div>
      )}
    </TrackedLink2>
  );
};

export default HeaderMobileLogo;
