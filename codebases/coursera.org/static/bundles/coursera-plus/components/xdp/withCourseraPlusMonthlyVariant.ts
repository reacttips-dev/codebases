import { compose, mapProps } from 'recompose';

import epic from 'bundles/epic/client';
import Naptime from 'bundles/naptimejs';
// @ts-ignore TS7016 Untyped import http://go.dkandu.me/strict-ts-migration#TS7016
import EnrollmentAvailableChoicesV1 from 'bundles/naptimejs/resources/enrollmentAvailableChoices.v1';
// @ts-ignore TS7016 Untyped import http://go.dkandu.me/strict-ts-migration#TS7016
import ExternallyAccessibleNostosV1 from 'bundles/naptimejs/resources/externallyAccessibleNostos.v1';
import OnDemandSpecializationsV1 from 'bundles/naptimejs/resources/onDemandSpecializations.v1';
import S12nDerivativesV1 from 'bundles/naptimejs/resources/s12nDerivatives.v1';
import withPromotionInfo, { PropsFromWithPromotionInfo } from 'bundles/promotions/components/withPromotionInfo';

type InputProps = {
  s12nId?: string;
  s12n?: OnDemandSpecializationsV1;
  enrollmentAvailableChoices?: EnrollmentAvailableChoicesV1;
};

type PropsFromNaptimeS12nDerivatives = {
  multiS12nDerivatives?: Array<S12nDerivativesV1>;
};

type PropsFromNaptimeNostos = {
  s12nsInPlusPricedAtFortyNineUsd?: Array<ExternallyAccessibleNostosV1>;
};

export type PropsFromWithCourseraPlusMonthlyVariant = {
  canSubscribeToCourseraPlusMonthly: boolean;
};

const withCourseraPlusMonthlyVariant = <PropsFromCaller extends InputProps>(isNotRequired?: boolean) =>
  compose<PropsFromCaller & PropsFromWithCourseraPlusMonthlyVariant, PropsFromCaller>(
    withPromotionInfo<PropsFromCaller>(isNotRequired),
    Naptime.createContainer<PropsFromNaptimeS12nDerivatives, PropsFromCaller>(({ enrollmentAvailableChoices }) => {
      if (enrollmentAvailableChoices?.canSubscribeToMultipleS12ns) {
        const enrollmentS12nIds = enrollmentAvailableChoices.subscriptionEnrollmentS12nIds;
        return {
          multiS12nDerivatives: S12nDerivativesV1.multiGet(enrollmentS12nIds, {
            fields: ['catalogPrice'],
            required: !isNotRequired,
          }),
        };
      } else {
        return {};
      }
    }),
    Naptime.createContainer<
      PropsFromNaptimeNostos,
      PropsFromCaller & PropsFromWithPromotionInfo & PropsFromNaptimeS12nDerivatives
    >(({ s12nId, s12n, enrollmentAvailableChoices, promotionEligibilities, multiS12nDerivatives }) => {
      let s12nProductKey = s12nId ?? s12n?.id;

      // If the user can enroll in multiple s12ns (Mix and Match) and every s12n has the same price, select the first s12nId from availableS12nSubscriptions
      // Once we know every s12n has the same price, we can then check any of the s12ns
      if (enrollmentAvailableChoices?.canSubscribeToMultipleS12ns && multiS12nDerivatives?.length) {
        const firstPriceAmount = multiS12nDerivatives[0]?.catalogPrice?.amount;
        const hasAllS12nsAtSamePrice = multiS12nDerivatives.every(
          (s12nDerivatives) => s12nDerivatives?.catalogPrice?.amount === firstPriceAmount
        );
        s12nProductKey = hasAllS12nsAtSamePrice
          ? enrollmentAvailableChoices.s12nSubscriptionEnrollmentChoiceDataDefinition?.s12Ids?.[0] // BE has typo for `s12Ids`
          : undefined;
      }

      // Only query for product price when the product is a s12n / part of s12n (exclude standalone courses and projects)
      // and user can subscribe to Coursera Plus (doesn't need to be monthly, since we're also checking in control)
      // and user is not already enrolled through audit
      // and user is not eligible for a promotion (which changes the s12n price)
      if (
        !s12nProductKey ||
        !enrollmentAvailableChoices?.canSubscribeToCourseraPlus ||
        enrollmentAvailableChoices?.isEnrolled ||
        promotionEligibilities?.isEligible
      ) {
        return {};
      }

      return {
        // Nostos job: https://tools.coursera.org/mega/nostos/aiZ1YCkGEeufn4ezOPtr3A~NOSTOS_IGUAZU_JOB@1
        s12nsInPlusPricedAtFortyNineUsd: ExternallyAccessibleNostosV1.finder('getAllProperties', {
          params: { job_name: 's12ns_with_49_dollar_price', keys: s12nProductKey },
          required: !isNotRequired,
        }),
      };
    }),
    mapProps<PropsFromWithCourseraPlusMonthlyVariant, PropsFromNaptimeNostos>(
      ({ s12nsInPlusPricedAtFortyNineUsd, ...props }) => {
        const isS12nInPlusPricedAtFortyNineUsd =
          (s12nsInPlusPricedAtFortyNineUsd && s12nsInPlusPricedAtFortyNineUsd.length > 0) ?? false;
        const monthlyExperimentVariant = epic.preview('XDP', 'courseraPlusMonthlyVariant');

        // Only record experiment impressions for s12ns part of Plus and priced at $49
        // This includes recording impressions for control, so don't check for variant
        if (isS12nInPlusPricedAtFortyNineUsd) {
          epic.get('payments', 'courseraPlusMonthlyEnabled');
        }

        return {
          canSubscribeToCourseraPlusMonthly: isS12nInPlusPricedAtFortyNineUsd && monthlyExperimentVariant !== 'control',
          ...props,
        };
      }
    )
  );

export default withCourseraPlusMonthlyVariant;
