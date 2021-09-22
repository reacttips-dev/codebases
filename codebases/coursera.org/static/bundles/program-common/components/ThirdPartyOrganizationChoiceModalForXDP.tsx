import * as React from 'react';
import { Button } from '@coursera/cds-core';
import _t from 'i18n!nls/program-common';
import EnrollmentChoiceModal from 'bundles/program-common/components/EnrollmentChoiceModal';
import EnrollmentChoiceModalProductDescriptionWithProductIdAndType from 'bundles/program-common/components/EnrollmentChoiceModalProductDescriptionWithProductIdAndType';
import EnrollmentChoiceModalOrganizationList from 'bundles/program-common/components/EnrollmentChoiceModalOrganizationList';

type ThirdPartyOrganization = {
  id: string;
  name: string;
};

type PropsFromCaller = {
  onSelect: (thirdPartyOrganizationId?: string) => void;
  onClose: () => void;
  thirdPartyOrganizations: ThirdPartyOrganization[];
  productId: string;
  productType: string;
  defaultOrgId?: string;
};

type Props = PropsFromCaller;

const ThirdPartyOrganizationChoiceModalForXDP = ({
  thirdPartyOrganizations,
  onSelect,
  onClose,
  productId,
  productType,
  defaultOrgId,
}: Props) => {
  const [thirdPartyOrganizationId, setThirdPartyOrganizationId] = React.useState<string | undefined>(defaultOrgId);

  const onChangeRadio = React.useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => setThirdPartyOrganizationId(event.target.value),
    [setThirdPartyOrganizationId]
  );

  const onContinue = React.useCallback(() => onSelect(thirdPartyOrganizationId), [onSelect, thirdPartyOrganizationId]);

  return (
    <EnrollmentChoiceModal
      onClose={onClose}
      headerTitle={_t('Enroll through my organization')}
      button={
        <Button variant="primary" onClick={onContinue}>
          {_t('Continue')}
        </Button>
      }
    >
      <EnrollmentChoiceModalProductDescriptionWithProductIdAndType productId={productId} productType={productType} />
      <EnrollmentChoiceModalOrganizationList
        orgId={thirdPartyOrganizationId}
        orgOptions={thirdPartyOrganizations}
        productType={productType}
        onChangeRadio={onChangeRadio}
      />
    </EnrollmentChoiceModal>
  );
};

export default ThirdPartyOrganizationChoiceModalForXDP;
