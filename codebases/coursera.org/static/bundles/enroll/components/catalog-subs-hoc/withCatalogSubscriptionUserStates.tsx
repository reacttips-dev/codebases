import Naptime from 'bundles/naptimejs';

import React from 'react';
import user from 'js/lib/user';
import { tupleToStringKey } from 'js/lib/stringKeyTuple';
import CatalogSubscriptionsEnrollmentState from 'bundles/enroll/components/catalog-subs-hoc/CatalogSubscriptionsEnrollmentState';
import { SPECIALIZATION, VERIFIED_CERTIFICATE } from 'bundles/payments/common/ProductType';
// @ts-ignore TS7016 Untyped import http://go.dkandu.me/strict-ts-migration#TS7016
import EnrollmentAvailableChoicesV1 from 'bundles/naptimejs/resources/enrollmentAvailableChoices.v1';
import CatalogSubscriptionEligibilitiesV1 from 'bundles/naptimejs/resources/catalogSubscriptionEligibilities.v1';

type Props = {
  courseId?: string;
  s12nId?: string;
  enrollmentAvailableChoices?: EnrollmentAvailableChoicesV1;
  catalogSubscriptionEligibilities?: CatalogSubscriptionEligibilitiesV1;
};

function withCatalogSubscriptionUserStates(Component: any) {
  class CatalogSubscriptionUserStates extends React.Component<Props> {
    render() {
      if (!user.isAuthenticatedUser()) {
        return <Component {...this.props} />;
      }

      const { enrollmentAvailableChoices, catalogSubscriptionEligibilities } = this.props;

      const isMonthlyCatalogSubscriptionEnabled =
        (enrollmentAvailableChoices &&
          (enrollmentAvailableChoices.canSubscribeToCatalog || enrollmentAvailableChoices.isCatalogSubscribed)) ||
        (catalogSubscriptionEligibilities &&
          (!catalogSubscriptionEligibilities.isNotEligible || catalogSubscriptionEligibilities.isSubscribed));

      const catalogSubscriptionsEnrollmentState = isMonthlyCatalogSubscriptionEnabled
        ? new CatalogSubscriptionsEnrollmentState(enrollmentAvailableChoices, catalogSubscriptionEligibilities)
        : null;

      return (
        <Component
          isMonthlyCatalogSubscriptionEnabled={isMonthlyCatalogSubscriptionEnabled}
          catalogSubscriptionsEnrollmentState={catalogSubscriptionsEnrollmentState}
          {...this.props}
        />
      );
    }
  }

  type NaptimeProps = {
    s12nId?: string;
    courseId?: string;
    prioritizeCourse?: boolean;
  };

  const Container = Naptime.createContainer(
    CatalogSubscriptionUserStates,
    ({ s12nId, courseId, prioritizeCourse }: NaptimeProps) => {
      let productType;
      let productId;

      if (s12nId && !prioritizeCourse) {
        productId = s12nId;
        productType = SPECIALIZATION;
      } else if (courseId) {
        productId = courseId;
        productType = VERIFIED_CERTIFICATE;
      }

      const userId = user.get().id;
      return {
        ...(userId &&
          productType &&
          productId && {
            enrollmentAvailableChoices: EnrollmentAvailableChoicesV1.get(
              tupleToStringKey([userId, productType, productId]),
              {
                fields: ['enrollmentChoices', 'enrollmentChoiceReasonCode'],
              }
            ),
          }),
        ...(userId &&
          !productId && {
            catalogSubscriptionEligibilities: CatalogSubscriptionEligibilitiesV1.get(userId, {
              fields: ['id', 'eligibility', 'availableSubscriptions'],
              required: false,
            }),
          }),
      };
    }
  );

  return Container;
}

export default withCatalogSubscriptionUserStates;
