import PropTypes from 'prop-types';
import React from 'react';
/* @ts-ignore ts-migrate(7016) FIXME: Untyped import */
import type Programs from 'bundles/naptimejs/resources/enterprisePrograms.v1';
import UserS12n from 'bundles/s12n-common/service/models/userS12n';
import PaymentChoice from 'bundles/s12n-enroll/components/PaymentChoice';
import Naptime from 'bundles/naptimejs';
import OnDemandSpecializationsV1 from 'bundles/naptimejs/resources/onDemandSpecializations.v1';
/* @ts-ignore ts-migrate(7016) FIXME: Untyped import */
import ThirdPartyOrganizationsV1 from 'bundles/naptimejs/resources/thirdPartyOrganizations.v1';
import getS12nProductLabels from 'bundles/s12n-common/constants/s12nProductLabels';
import { FormattedMessage } from 'js/lib/coursera.react-intl';
import _t from 'i18n!nls/s12n-enroll';

type Props = {
  thirdPartyOrganization: ThirdPartyOrganizationsV1;
};

class PaymentChoiceProgram extends React.Component<Props> {
  static contextTypes = {
    userS12n: PropTypes.instanceOf(UserS12n),
  };

  getBodyMessage() {
    const { userS12n } = this.context;
    const { thirdPartyOrganization } = this.props;

    // TODO (htran) refactor to use Naptime after Backbone is completely removed from S12nEnrollModal component hierarchy
    const productVariant = userS12n.getMetadata('productVariant');
    const { isProfessionalCertificate } = new OnDemandSpecializationsV1({ productVariant });
    const { SPECIALIZATION_LABEL, PROFESSIONAL_CERTIFICATE_LABEL } = getS12nProductLabels();

    if (thirdPartyOrganization) {
      return (
        <FormattedMessage
          message={_t(
            `Your enrollment in this {productType} is sponsored by {orgName}.
            Join the full {productType} today to access all {numOfCourses} courses, and complete all courses
          and the Capstone project to earn your {certificate}.`
          )}
          productType={isProfessionalCertificate ? PROFESSIONAL_CERTIFICATE_LABEL : SPECIALIZATION_LABEL}
          certificate={isProfessionalCertificate ? _t('Certificate') : _t('Specialization Certificate')}
          orgName={thirdPartyOrganization.name}
          numOfCourses={userS12n.getNumCourses()}
        />
      );
    }
    return null;
  }

  render() {
    return (
      <PaymentChoice title={_t('Enroll with Learning Programs')} type="program" currentType="program">
        {this.getBodyMessage()}
      </PaymentChoice>
    );
  }
}

// @ts-expect-error TSMIGRATION
export default Naptime.createContainer(PaymentChoiceProgram, ({ program }: { program?: Programs }) => {
  const thirdPartyOrganizationId = program && program.thirdPartyOrganizationId;

  if (thirdPartyOrganizationId) {
    return {
      thirdPartyOrganization: ThirdPartyOrganizationsV1.get(thirdPartyOrganizationId, {
        fields: ['name'],
      }),
    };
  }

  return {};
});
