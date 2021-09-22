import * as React from 'react';
import _t from 'i18n!nls/program-common';
import ThirdPartyOrganizationChoiceModalForXDP from 'bundles/program-common/components/ThirdPartyOrganizationChoiceModalForXDP';
import EnrollmentChoiceModalForMultiprogram from 'bundles/program-common/components/EnrollmentChoiceModalForMultiprogram';
import redirect from 'js/lib/coursera.redirect';
import URI from 'jsuri';
import uniqBy from 'lodash/uniqBy';
import ProgramActionApiManager from 'bundles/program-common/models/ProgramActionApiManager';
import type { InjectedNaptime } from 'bundles/naptimejs';
import Naptime from 'bundles/naptimejs';
import { compose } from 'recompose';
import { PRODUCT_TYPES } from 'bundles/program-common/constants/ProgramActionConstants';
import raven from 'raven-js';
import EnrollmentChoiceModalPlaceholder from 'bundles/program-common/components/EnrollmentChoiceModalPlaceholder';

type ThirdPartyOrganization = {
  id: string;
  name: string;
};

type Program = {
  id: string;
  metadata?: {
    slug: string;
    name: string;
  };
  thirdPartyOrganizationId: string;
};

type PropsFromCaller = {
  thirdPartyOrganizations?: ThirdPartyOrganization[];
  programs?: Program[];
  productId: string;
  productType: string;
  userId: number;
  handleClose: () => void;
  invitedPrograms?: Program[];
  invitedThirdPartyOrganizations?: ThirdPartyOrganization[];
};

type Props = PropsFromCaller & { naptime: InjectedNaptime };

const EnterpriseEnrollmentChoiceModalForXDP = ({
  thirdPartyOrganizations = [],
  invitedThirdPartyOrganizations = [],
  programs = [],
  invitedPrograms = [],
  productId,
  productType,
  userId,
  handleClose,
  naptime,
}: Props) => {
  const [thirdPartyOrganizationId, setThirdPartyOrganizationId] = React.useState<string | undefined>();
  const [displayOrgListModal, setDisplayOrgListModal] = React.useState<boolean>(false);
  const [displayProgramListModal, setDisplayProgramListModal] = React.useState<boolean>(false);
  const [isEnrolling, setIsEnrolling] = React.useState(false);
  const allThirdPartyOrganizations = uniqBy([...thirdPartyOrganizations, ...invitedThirdPartyOrganizations], 'id');
  const allPrograms = uniqBy([...programs, ...invitedPrograms], 'id');

  React.useEffect(() => {
    if (allThirdPartyOrganizations.length > 0) {
      if (allThirdPartyOrganizations.length === 1) {
        setThirdPartyOrganizationId(allThirdPartyOrganizations[0].id);
        setDisplayProgramListModal(true);
      } else if (thirdPartyOrganizationId === undefined) {
        setThirdPartyOrganizationId(allThirdPartyOrganizations[0].id);
        setDisplayOrgListModal(true);
      }
    }
  }, [
    thirdPartyOrganizationId,
    allThirdPartyOrganizations,
    setThirdPartyOrganizationId,
    setDisplayOrgListModal,
    setDisplayProgramListModal,
  ]);

  const onSelect = React.useCallback(
    (orgId?: string) => {
      setThirdPartyOrganizationId(orgId);
      setDisplayOrgListModal(false);
      setDisplayProgramListModal(true);
    },
    [setThirdPartyOrganizationId, setDisplayOrgListModal, setDisplayProgramListModal]
  );

  const onOrgModalClose = React.useCallback(() => {
    setDisplayOrgListModal(false);
    handleClose();
  }, [setDisplayOrgListModal, handleClose]);

  const onProgramModalClose = React.useCallback(() => {
    setDisplayProgramListModal(false);
    handleClose();
  }, [setDisplayProgramListModal, handleClose]);

  const onProgramSelect = React.useCallback(
    async (programId: string) => {
      if (isEnrolling) {
        return;
      }

      // If they're already a program member, enroll here on consumer to reduce friction.
      const isInvited = invitedPrograms.find((x) => x.id === programId) != null;
      if (!isInvited) {
        const apiManager = new ProgramActionApiManager({ programId, naptime, userId });
        setIsEnrolling(true);
        const enrollPromise =
          productType === PRODUCT_TYPES.SPECIALIZATION
            ? apiManager.getEnrollInS12nPromise({ firstCourseId: null, s12nId: productId, collectionId: null })
            : apiManager.getEnrollInCoursePromise({ courseId: productId, collectionId: null });
        try {
          await enrollPromise;
        } catch (err) {
          // If this fails for some reason, we'll report it, but continue redirecting to program-home, so that they
          // aren't stuck on consumer.
          Object.assign(err, { enrollParams: { programId, productType, productId } });
          raven.captureException(err);
        }
      }

      const selectedProgram = allPrograms.find((program) => program.id === programId);
      const programSlug = selectedProgram?.metadata?.slug;
      if (programSlug) {
        const uri = new URI(`/programs/${programSlug}`)
          .addQueryParam('productId', productId)
          .addQueryParam('productType', productType)
          .addQueryParam('showMiniModal', true)
          .addQueryParam('eoc', true);
        redirect.setLocation(uri.toString());
      } else {
        handleClose();
      }
    },
    [allPrograms, productId, productType, userId, naptime, isEnrolling, handleClose, invitedPrograms]
  );

  if (displayOrgListModal) {
    return (
      <ThirdPartyOrganizationChoiceModalForXDP
        thirdPartyOrganizations={allThirdPartyOrganizations}
        defaultOrgId={allThirdPartyOrganizations?.[0]?.id}
        productId={productId}
        productType={productType}
        onSelect={onSelect}
        onClose={onOrgModalClose}
      />
    );
  }

  if (displayProgramListModal) {
    const programIds = allPrograms
      .filter((program) => program.thirdPartyOrganizationId === thirdPartyOrganizationId)
      .map((program) => program.id);
    const thirdPartyOrganizationName = allThirdPartyOrganizations.find(
      (thirdPartyOrganization) => thirdPartyOrganization.id === thirdPartyOrganizationId
    )?.name;
    if (thirdPartyOrganizationName) {
      return (
        <EnrollmentChoiceModalForMultiprogram
          productId={productId}
          productType={productType}
          programIds={programIds}
          headerTitle={_t('Enroll through my organization')}
          buttonTitle={isEnrolling ? _t('Enrolling...') : _t('Continue')}
          thirdPartyOrgName={thirdPartyOrganizationName}
          onClose={onProgramModalClose}
          userId={userId}
          programJoinTrackingVerbiage={true}
          onSelect={onProgramSelect}
        />
      );
    }
  }

  return (
    <EnrollmentChoiceModalPlaceholder
      productId={productId}
      productType={productType}
      headerTitle={_t('Enroll through my organization')}
      buttonTitle={_t('Continue')}
      onClose={handleClose}
    />
  );
};

export default compose<Props, PropsFromCaller>(
  // Get an InjectedNaptime instance for ProgramActionApiManager
  Naptime.createContainer(() => ({}))
)(EnterpriseEnrollmentChoiceModalForXDP);
