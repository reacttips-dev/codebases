import React from 'react';
import Media from 'react-media';
import epic from 'bundles/epic/client';

import HeaderRightNavButton from 'bundles/page/components/header/HeaderRightNavButton';
import EnterpriseLinkDropdown from 'bundles/page/components/header/EnterpriseLinkDropdown';

import _t from 'i18n!nls/page';

export type Props = {
  hideEnterprise?: boolean;
  showAdminLinks?: boolean;
  showExploreCatalog?: boolean;
};

const EnterpriseLink = ({ hideEnterprise, showAdminLinks, showExploreCatalog }: Props) => {
  /* Hide `For Enterprise` link only for pages under `/admin` and `/teach` route (apps) */
  const shouldShowEnterpriceLink = !hideEnterprise && !showAdminLinks && !showExploreCatalog;

  if (shouldShowEnterpriceLink) {
    const enableGlobalNavEnterpriseDropdown = epic.get('Enterprise', 'enableGlobalNavEnterpriseDropdown');

    if (enableGlobalNavEnterpriseDropdown) {
      return <EnterpriseLinkDropdown />;
    }

    const label = _t('For Enterprise');
    const forEnterpriseButtonProps = {
      href:
        '/business/?utm_campaign=website&utm_content=corp-to-home-for-enterprise&utm_medium=coursera&utm_source=enterprise',
      label,
      name: 'enterprise',
      noBorder: true,
      wrapperClassName: 'c-ph-enterprise',
    };
    return (
      <Media query={{ maxWidth: 1080, minWidth: 925 }} defaultMatches={false}>
        {(matches) =>
          matches ? (
            <HeaderRightNavButton {...forEnterpriseButtonProps} key={label} label={_t('Enterprise')} />
          ) : (
            <HeaderRightNavButton {...forEnterpriseButtonProps} key={label} />
          )
        }
      </Media>
    );
  } else {
    return null;
  }
};

export default EnterpriseLink;
