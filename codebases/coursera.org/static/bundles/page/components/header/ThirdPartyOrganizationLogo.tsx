import React from 'react';
import Imgix from 'js/components/Imgix';

// @ts-ignore TS7016 Untyped import http://go.dkandu.me/strict-ts-migration#TS7016
import ThirdPartyOrganizationV1 from 'bundles/naptimejs/resources/thirdPartyOrganizations.v1';

import DefaultCompanyLogo from 'bundles/program-common/components/DefaultCompanyLogo';

type Props = {
  thirdPartyOrganization: ThirdPartyOrganizationV1;
  preferRectangle?: boolean;
  logoHeight?: number;
  logoWidth?: number;
  defaultSize?: number;
};

const ThirdPartyOrganizationLogo = ({
  thirdPartyOrganization,
  preferRectangle = true,
  logoHeight = 32,
  logoWidth = 32,
  defaultSize = 32,
}: Props) => {
  const showThirdPartyOrganizationLogo = !!thirdPartyOrganization;
  const thirdPartyOrganizationLogo = preferRectangle
    ? (thirdPartyOrganization || {}).rectangularLogo || (thirdPartyOrganization || {}).squareLogo
    : (thirdPartyOrganization || {}).squareLogo || (thirdPartyOrganization || {}).rectangularLogo;

  return showThirdPartyOrganizationLogo && thirdPartyOrganizationLogo ? (
    <Imgix src={thirdPartyOrganizationLogo} width={logoWidth} height={logoHeight} alt={thirdPartyOrganization.name} />
  ) : (
    <DefaultCompanyLogo size={defaultSize} />
  );
};

export default ThirdPartyOrganizationLogo;
