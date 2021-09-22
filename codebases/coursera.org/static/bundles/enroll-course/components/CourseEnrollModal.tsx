import React from 'react';
import Naptime from 'bundles/naptimejs';
import { branch, compose, withProps } from 'recompose';
import _ from 'lodash';

import user from 'js/lib/user';

import CourseEnrollS12nSelectionModal from 'bundles/enroll-course/components/CourseEnrollS12nSelectionModal';
import ClosedCourseEnrollModal from 'bundles/enroll-course/components/ClosedCourseEnrollModal';
import CourseEnrollChoiceDescription from 'bundles/enroll-course/components/CourseEnrollChoiceDescription';
import CourseEnrollModalWithData from 'bundles/enroll-course/components/CourseEnrollModalWithData';
import UserInterestModal from 'bundles/enroll/components/user-interest/UserInterestModal';
import CourseWithFullDiscountEnrollModal from 'bundles/enroll-course/components/CourseWithFullDiscountEnrollModal';
import type { PropsFromWithCourseraPlusMonthlyVariant } from 'bundles/coursera-plus/components/xdp/withCourseraPlusMonthlyVariant';
import withCourseraPlusMonthlyVariant from 'bundles/coursera-plus/components/xdp/withCourseraPlusMonthlyVariant';

import {
  getAvailableGroups,
  getAvailablePrograms,
  getAvailableInvitedPrograms, // @ts-ignore TS7016 Untyped import http://go.dkandu.me/strict-ts-migration#TS7016
} from 'bundles/enroll-course/lib/apiClient';
import CourseraPlusEnrollModal from 'bundles/enroll/components/coursera-plus/CourseraPlusEnrollModal';
import S12nBulkPayEnrollModal from 'bundles/s12n-enroll/components/bulk-pay/S12nBulkPayEnrollModal';
import NonRecurringEnrollModal from 'bundles/s12n-enroll/components/non-recurring/NonRecurringEnrollModal';
import S12nPaymentMethodEnrollModal from 'bundles/s12n-enroll/components/non-recurring/S12nPaymentMethodEnrollModal';
import SubscriptionEnrollModal from 'bundles/enroll/components/subscriptions/SubscriptionEnrollModal';
import CatalogSubscriptionEnrollModal from 'bundles/enroll/components/subscriptions/catalogSubscription/CatalogSubscriptionEnrollModal';
import CatalogSubscriptionSpecialStandaloneEnrollModal from 'bundles/enroll/components/subscriptions/catalogSubscription/CatalogSubscriptionSpecialStandaloneEnrollModal';
import GuidedProjectEnrollModal from 'bundles/enroll/components/guided-project/GuidedProjectEnrollModal';
import CourseTypeMetadataV1 from 'bundles/naptimejs/resources/courseTypeMetadata.v1';

import CoursesV1 from 'bundles/naptimejs/resources/courses.v1';
// @ts-ignore TS7016 Untyped import http://go.dkandu.me/strict-ts-migration#TS7016
import type EnrollmentAvailableChoicesV1 from 'bundles/naptimejs/resources/enrollmentAvailableChoices.v1';
import OnDemandSpecializationsV1 from 'bundles/naptimejs/resources/onDemandSpecializations.v1';
// @ts-ignore TS7016 Untyped import http://go.dkandu.me/strict-ts-migration#TS7016
import { improved } from 'bundles/enroll/components/subscriptions/catalogSubscription/utils/experiment21Variants';
import ApplicationStoreClass from 'bundles/ssr/stores/ApplicationStore';
import SubscriptionSubscribedModal from 'bundles/enroll/components/subscriptions/catalogSubscription/SubscriptionSubscribedModal';
import type { Program, ThirdPartyOrganization, Group } from 'bundles/enroll-course/common/Enterprise';
import S12nDerivativesV1 from 'bundles/naptimejs/resources/s12nDerivatives.v1';
import epic from 'bundles/epic/client';
import connectToStores from 'js/lib/connectToStores';
import EnterpriseEnrollmentChoiceModalForXDP from 'bundles/program-common/components/EnterpriseEnrollmentChoiceModalForXDP';
import { PRODUCT_TYPES } from 'bundles/program-common/constants/ProgramActionConstants';
import withEnrollmentGraphql from 'bundles/enroll/components/xdp/withEnrollmentGraphql';

import 'css!./__styles__/CourseEnrollModal';

type PropsFromCaller = {
  courseId: string;
  onClose: (event?: React.MouseEvent<HTMLElement>) => void;
  disableAuditOption?: boolean;
  s12nIdBySlug?: string;
  defaultChoice?: string | null;
};

type PropsFromStores = PropsFromCaller & {
  userId: number;
  requestCountryCode: string;
};

type PropsFromNaptimeCourse = PropsFromStores & {
  course: CoursesV1;
  courseTypeMetadataWithVersion: CourseTypeMetadataV1;
};

type PropsFromNaptimeEac = PropsFromNaptimeCourse & {
  enrollmentAvailableChoices?: EnrollmentAvailableChoicesV1;
};

type PropsFromNaptimeS12n = {
  s12n?: OnDemandSpecializationsV1 | null;
  s12nDerivatives?: S12nDerivativesV1;
};

type PropsFromNaptimeS12nNonNull = {
  s12n?: OnDemandSpecializationsV1;
  s12nDerivatives?: S12nDerivativesV1;
};

type PropsToComponent = PropsFromCaller &
  PropsFromStores &
  PropsFromNaptimeCourse &
  PropsFromNaptimeEac &
  PropsFromNaptimeS12nNonNull &
  PropsFromWithCourseraPlusMonthlyVariant;

type State = {
  selectedS12nId: string | null;
  program?: Program;
  programs?: Program[];
  invitedPrograms?: Program[];
  thirdPartyOrganization?: ThirdPartyOrganization;
  thirdPartyOrganizations?: ThirdPartyOrganization[];
  invitedThirdPartyOrganizations?: ThirdPartyOrganization[];
  group?: Group;
};

export class CourseEnrollModal extends React.Component<PropsToComponent, State> {
  state: State = {
    selectedS12nId: null,
  };

  componentDidMount() {
    const { enrollmentAvailableChoices, course } = this.props;

    if (enrollmentAvailableChoices && enrollmentAvailableChoices.canEnrollThroughProgram) {
      getAvailablePrograms(course.id)
        .then((
          {
            program,
            programs,
            thirdPartyOrganization,
            thirdPartyOrganizations,
          }: $TSFixMe /* TODO: type getAvailablePrograms */
        ) => this.setState(() => ({ program, programs, thirdPartyOrganization, thirdPartyOrganizations })))
        .done();
    }
    if (enrollmentAvailableChoices && enrollmentAvailableChoices.canEnrollThroughProgramInvitation) {
      getAvailableInvitedPrograms(course.id)
        .then(({ invitedPrograms, invitedThirdPartyOrganizations }: $TSFixMe) =>
          this.setState(() => ({ invitedPrograms, invitedThirdPartyOrganizations }))
        )
        .done();
    } else if (enrollmentAvailableChoices && enrollmentAvailableChoices.canEnrollThroughGroup) {
      getAvailableGroups(course.id)
        .then((group: $TSFixMe /* TODO: type getAvailableGroups */) => this.setState(() => ({ group })))
        .done();
    }
  }

  setSelectedS12nId = (selectedS12nId: string) => {
    this.setState(() => ({ selectedS12nId }));
  };

  // we show the closed course enroll modal only if the course is NOT part of a s12n.
  renderEnrollmentModal() {
    const {
      course,
      s12n,
      enrollmentAvailableChoices,
      courseTypeMetadataWithVersion,
      onClose,
      courseId,
      s12nDerivatives,
    } = this.props;
    const {
      program,
      programs,
      thirdPartyOrganization,
      thirdPartyOrganizations,
      group,
      selectedS12nId,
      invitedPrograms,
      invitedThirdPartyOrganizations,
    } = this.state;

    if (!enrollmentAvailableChoices) {
      return null;
    }

    const {
      isCatalogSubscribed,
      canSubscribeToCatalog,
      canSubscribeToS12n,
      canBulkPaySpecialization,
      canEnrollThroughS12nPrepaid,
      canEnrollThroughCourseraPlus,
      hasFreeEnrollOptionIntoCourse,
      isCatalogSubscriptionStandaloneCourse,
      didPurchase,
      isSpecializationUpgradeRequired,
      canEnrollThroughProgram,
      canPurchaseSingleCourse,
      canEnrollCourseWithFullDiscount,
      canEnrollThroughProgramInvitation,
    } = enrollmentAvailableChoices;

    const additionalProps = { program, programs, thirdPartyOrganization, thirdPartyOrganizations, group };

    // Enrolling in the user selected s12nId or the only available s12n enrollment option
    const s12nId = (selectedS12nId || s12n?.id) ?? undefined;

    const indiaBulkPayIds = epic.get('payments-backend', 'indiaBulkpayEnabledS12nIds');
    const isInIndiaBulkPayRollout = indiaBulkPayIds.includes(s12nId);

    const { isClosedCourse } = course;

    // No matter what happens, show the product interest modal if the course is not launched
    if (s12nDerivatives?.isSubscription && !course.isLaunched) {
      return <UserInterestModal courseId={courseId} onClose={onClose} />;
    } else if (isCatalogSubscribed) {
      return <SubscriptionSubscribedModal {...this.props} courseId={course.id} />;
    } else if (canSubscribeToCatalog && !hasFreeEnrollOptionIntoCourse && !isCatalogSubscriptionStandaloneCourse) {
      return (
        <CatalogSubscriptionEnrollModal {...this.props} courseId={course.id} s12nId={s12nId} prioritizeCourse={true} />
      );
    } else if (
      canSubscribeToCatalog &&
      isCatalogSubscriptionStandaloneCourse &&
      epic.get('CatalogSubscriptions', 'catalogSubscriptionsV2_1') === improved
    ) {
      return <CatalogSubscriptionSpecialStandaloneEnrollModal {...this.props} />;
      // Only trigger Coursera Plus flow for users who are already subscribed users
    } else if (canEnrollThroughCourseraPlus) {
      return (
        <CourseraPlusEnrollModal
          {...this.props}
          s12nId={s12nId}
          isGuidedProject={courseTypeMetadataWithVersion.isGuidedProject}
          isFromS12nSelection={!!selectedS12nId}
        />
      );
    } else if (canBulkPaySpecialization && isInIndiaBulkPayRollout && s12nId) {
      return (
        <S12nBulkPayEnrollModal
          {...this.props}
          s12nId={s12nId}
          courseIdOverride={course.id}
          onSdp={false}
          isFromS12nSelection={!!selectedS12nId}
        />
      );
    } else if (canEnrollThroughS12nPrepaid && enrollmentAvailableChoices?.prepaidEnrollmentS12nIds?.includes(s12nId)) {
      const PrepaidModal = enrollmentAvailableChoices?.subscriptionEnrollmentS12nIds.includes(s12nId)
        ? S12nPaymentMethodEnrollModal
        : NonRecurringEnrollModal;
      return (
        <PrepaidModal
          {...this.props}
          s12nId={s12nId!} // eslint-disable-line @typescript-eslint/no-non-null-assertion
          courseIdOverride={course.id}
          onSdp={false}
          isFromS12nSelection={!!selectedS12nId}
        />
      );
    } else if (canSubscribeToS12n && typeof s12nId === 'string') {
      return (
        <SubscriptionEnrollModal
          {...this.props}
          s12nId={s12nId!} // eslint-disable-line @typescript-eslint/no-non-null-assertion
          courseIdOverride={course.id}
          onSdp={false}
          isFromS12nSelection={!!selectedS12nId}
        />
      );
    } else if (canEnrollCourseWithFullDiscount) {
      return <CourseWithFullDiscountEnrollModal courseId={courseId} onClose={onClose} />;
    }
    // Technically Guided Project is a closed course. We don't want to show the Closed course modal for this so
    // the Guided Project check should be placed before closed course.
    else if (courseTypeMetadataWithVersion.isGuidedProject && canPurchaseSingleCourse) {
      return (
        <GuidedProjectEnrollModal
          enrollmentAvailableChoices={enrollmentAvailableChoices}
          courseId={course.id}
          onClose={onClose}
        />
      );
    } else if (isClosedCourse && !didPurchase && !canEnrollThroughProgram && !isSpecializationUpgradeRequired) {
      return <ClosedCourseEnrollModal {...this.props} />;
    } else if (canEnrollThroughProgram || canEnrollThroughProgramInvitation) {
      return (
        <EnterpriseEnrollmentChoiceModalForXDP
          thirdPartyOrganizations={thirdPartyOrganizations}
          programs={programs}
          invitedThirdPartyOrganizations={invitedThirdPartyOrganizations}
          invitedPrograms={invitedPrograms}
          productId={course.id}
          productType={PRODUCT_TYPES.COURSE}
          userId={user.get().id}
          handleClose={onClose}
        />
      );
    } else {
      return <CourseEnrollModalWithData {...this.props} {...additionalProps} />;
    }
  }

  renderS12nSelectionModal() {
    const { course, enrollmentAvailableChoices, onClose } = this.props;

    if (!enrollmentAvailableChoices) {
      return null;
    }

    return (
      <CourseEnrollS12nSelectionModal
        courseId={course.id}
        s12nIds={enrollmentAvailableChoices.enrollmentS12nIds}
        onClose={onClose}
        onSubmit={this.setSelectedS12nId}
        isTerminal={enrollmentAvailableChoices.canEnrollThroughCourseraPlus}
      />
    );
  }

  render() {
    const { course, enrollmentAvailableChoices } = this.props;
    const { selectedS12nId } = this.state;

    if (!enrollmentAvailableChoices || !course) {
      return false;
    }

    // If user can enroll into multiple s12ns, have user first select a specific s12n to enroll in
    if (enrollmentAvailableChoices && enrollmentAvailableChoices.canSubscribeToMultipleS12ns && !selectedS12nId) {
      return this.renderS12nSelectionModal();
    }

    return this.renderEnrollmentModal();
  }
}

export default compose<PropsToComponent, PropsFromCaller>(
  connectToStores<PropsFromStores, PropsFromCaller, ApplicationStoreClass>(
    [ApplicationStoreClass],
    (ApplicationStore) => {
      return {
        userId: user.get().id,
        requestCountryCode: ApplicationStore.getRequestCountryCode(),
      };
    }
  ),
  Naptime.createContainer<PropsFromNaptimeCourse, PropsFromStores>(({ courseId }) => ({
    course: CoursesV1.get(courseId, {
      fields: ['id', 'name', 'premiumExperienceVariant', 's12nIds', 'courseStatus'],
      params: {
        showHidden: true,
      },
      subcomponents: [CourseEnrollChoiceDescription, CourseEnrollS12nSelectionModal],
    }),
    courseTypeMetadataWithVersion: CourseTypeMetadataV1.get(courseId),
  })),
  withEnrollmentGraphql(),
  // don't retrieve s12n if user can enroll into multiple s12ns and needs to make a selection first
  branch<PropsFromCaller & PropsFromNaptimeCourse & PropsFromNaptimeEac & PropsFromNaptimeS12n>(
    ({ enrollmentAvailableChoices }) => !enrollmentAvailableChoices?.canSubscribeToMultipleS12ns,
    Naptime.createContainer<PropsFromNaptimeS12n, PropsFromCaller & PropsFromNaptimeCourse & PropsFromNaptimeEac>(
      ({ enrollmentAvailableChoices, course, userId, courseId }) => {
        let enrollmentS12nId;

        if (enrollmentAvailableChoices?.canSubscribeToS12n) {
          const s12nIds = enrollmentAvailableChoices.s12nSubscriptionEnrollmentChoiceDataDefinition?.s12Ids; // BE has typo for "s12Ids" prop
          enrollmentS12nId = !_.isEmpty(s12nIds) && s12nIds[0];
        }

        const parentS12nId = course?.s12nIds?.[0];

        // If enrolling user into s12n, we need to grab the s12nId returned from enrollmentAvailableChoices
        // to ensure we're displaying the same s12n that will show up on checkout
        // 'productVariant' and 'partnerIds' are used in child components and need to be requested here due to Naptime caching
        if (enrollmentS12nId) {
          return {
            s12n: OnDemandSpecializationsV1.get(enrollmentS12nId, {
              fields: ['name', 'courseIds', 'productVariant', 'partnerIds'],
            }),
            s12nDerivatives: S12nDerivativesV1.get(enrollmentS12nId, {
              fields: ['catalogPrice'],
            }),
          };
          // Otherwise, if the course has a parent s12n, use the primary finder when enrolling in catalog sub
          // because enrollmentAvailableChoices doesn't return a s12nId for catalog sub
        } else if (parentS12nId && userId) {
          return {
            s12n: OnDemandSpecializationsV1.primary(userId, courseId, {
              fields: ['name', 'courseIds', 'productVariant', 'partnerIds'],
            }),
            s12nDerivatives: S12nDerivativesV1.get(parentS12nId, {
              fields: ['catalogPrice'],
            }),
          };
        } else {
          return {};
        }
      }
    )
  ),
  // s12n can be `null` because `OnDemandSpecializationsV1.primary` is a finder, so remove `null` to satisfy TS
  withProps<PropsFromNaptimeS12nNonNull, PropsFromNaptimeS12n>(({ s12n }) => ({ s12n: s12n ?? undefined })),
  withCourseraPlusMonthlyVariant<PropsFromNaptimeEac & PropsFromNaptimeS12nNonNull>()
)(CourseEnrollModal);
