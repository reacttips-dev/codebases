import React from 'react';
import Media from 'react-media';

import epic from 'bundles/epic/client';

import HeaderRightNavButton from 'bundles/page/components/header/HeaderRightNavButton';
import UniversityLinkDropdown from 'bundles/page/components/header/UniversityLinkDropdown';

import _t from 'i18n!nls/page';

type Props = {
  hideEnterprise?: boolean;
  showAdminLinks?: boolean;
  showExploreCatalog?: boolean;
  isEnterprise?: boolean;
};

const StudentLink = ({ hideEnterprise, showAdminLinks, showExploreCatalog, isEnterprise }: Props) => {
  const shouldShowStudentLink =
    !hideEnterprise &&
    !showAdminLinks &&
    !showExploreCatalog &&
    !isEnterprise &&
    epic.get('pageHeader', 'enableForStudentsHeaderButtonV2');

  if (shouldShowStudentLink) {
    const enableGlobalNavUniversity = epic.get('Enterprise', 'enableGlobalNavUniversityDropdown');

    if (enableGlobalNavUniversity) {
      return <UniversityLinkDropdown />;
    }

    const label = _t('For Students');
    const forStudentsButtonProps = {
      href:
        '/for-university-and-college-students/?utm_campaign=header-for-students&utm_content=corp-to-landing-for-students&utm_medium=coursera&utm_source=header-for-students-link',
      label,
      name: 'student',
      noBorder: true,
      wrapperClassName: 'c-ph-student',
    };
    return (
      <Media query={{ maxWidth: 1080, minWidth: 925 }} defaultMatches={false}>
        {(matches) =>
          matches ? (
            <HeaderRightNavButton {...forStudentsButtonProps} key={label} label={_t('Students')} />
          ) : (
            <HeaderRightNavButton {...forStudentsButtonProps} key={label} />
          )
        }
      </Media>
    );
  } else {
    return null;
  }
};

export default StudentLink;
