import * as React from 'react';
import { Button } from '@coursera/cds-core';
import EnrollmentChoiceModal from 'bundles/program-common/components/EnrollmentChoiceModal';
import EnrollmentChoiceModalProductDescription from 'bundles/program-common/components/EnrollmentChoiceModalProductDescriptionWithProductIdAndType';
import EnrollmentChoiceModalOptionListContainer from 'bundles/program-common/components/EnrollmentChoiceModalOptionListContainer';

type Props = {
  onClose: () => void;
  productId: string;
  productType: string;
  headerTitle: string;
  buttonTitle: string;
};

const EnrollmentChoiceModalPlaceholder = ({ onClose, productId, productType, headerTitle, buttonTitle }: Props) => (
  <EnrollmentChoiceModal
    headerTitle={headerTitle}
    onClose={onClose}
    button={
      <Button variant="primary" disabled>
        {buttonTitle}
      </Button>
    }
  >
    <EnrollmentChoiceModalProductDescription productId={productId} productType={productType} />
    <EnrollmentChoiceModalOptionListContainer.Placeholder />
  </EnrollmentChoiceModal>
);

export default EnrollmentChoiceModalPlaceholder;
