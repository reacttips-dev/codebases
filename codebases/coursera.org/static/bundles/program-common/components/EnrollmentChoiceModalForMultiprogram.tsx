/** @jsx jsx */
/** @jsxFrag React.Fragment */
import * as React from 'react';
import { compose, getDisplayName, setDisplayName } from 'recompose';
import { graphql } from 'react-apollo';
import { jsx } from '@emotion/react';
import { Button } from '@coursera/cds-core';
import { EnrollmentChoiceModalQuery } from 'bundles/program-common/components/EnrollmentChoiceModalQuery';
import type {
  EnrollmentChoiceModalQuery as EnrollmentChoiceModalQueryType,
  EnrollmentChoiceModalQueryVariables,
} from 'bundles/program-common/components/__generated__/EnrollmentChoiceModalQuery';
import { org_coursera_program_membership_ProgramMembershipState as MembershipState } from 'bundles/program-common/components/__generated__/globalTypes';
import { tupleToStringKey } from 'js/lib/stringKeyTuple';
import {
  PRODUCT_TYPES,
  PRODUCT_TYPES_SERVER,
  PRODUCT_ID_INFIX,
} from 'bundles/program-common/constants/ProgramActionConstants';
import filterExistsOrDefault from 'bundles/program-common/utils/filterExistsOrDefault';
import EnrollmentChoiceModal from 'bundles/program-common/components/EnrollmentChoiceModal';
import EnrollmentChoiceModalProductDescription from 'bundles/program-common/components/EnrollmentChoiceModalProductDescriptionWithProductIdAndType';
import EnrollmentChoiceModalProgramList from 'bundles/program-common/components/EnrollmentChoiceModalProgramList';
import EnrollmentChoiceModalSingleProgram from 'bundles/program-common/components/EnrollmentChoiceModalSingleProgram';
import {
  ProgramProductMetadataMultiGetQuery,
  EnterpriseProgramSessionAssociationsByProgramsAndCourseQuery,
} from 'bundles/program-common/constants/ProgramCommonGraphqlQueries';
import type {
  CommonProgramProductMetadataMultiGetQuery as ProgramProductMetadataMultiGetQueryData,
  CommonProgramProductMetadataMultiGetQueryVariables as ProgramProductMetadataMultiGetQueryVariables,
} from 'bundles/program-common/constants/__generated__/CommonProgramProductMetadataMultiGetQuery';
import type {
  EnterpriseProgramSessionAssociationsByProgramsAndCourseQuery as EnterpriseProgramSessionAssociationsByProgramsAndCourseQueryType,
  EnterpriseProgramSessionAssociationsByProgramsAndCourseQueryVariables,
  EnterpriseProgramSessionAssociationsByProgramsAndCourseQuery_EnterpriseProgramSessionAssociationsV1Resource_byProgramsAndCourse_elements as EnterpriseProgramSessionAssociation,
} from 'bundles/program-common/constants/__generated__/EnterpriseProgramSessionAssociationsByProgramsAndCourseQuery';

type PropsFromCaller = {
  onClose: () => void;
  onSelect: (programId: string) => void;
  productId: string;
  productType: string;
  programIds: string[];
  programJoinTrackingVerbiage: boolean;
  thirdPartyOrgName: string;
  userId: number;
  headerTitle: string;
  buttonTitle: string;
};

type ProgramOption = {
  programId: string;
  programName: string;
  date: Date;
  isInvitation: boolean;
};

type PropsFromGraphql = {
  loading: boolean;
  error: boolean;
  programOptions: Array<ProgramOption>;
};

type PropsFromGraphql2 = {
  programsWithCredits?: Array<string | undefined>;
  programsWithCreditsLoading: boolean;
  programsWithCreditsError: boolean;
};

type PropsFromGraphql3 = {
  enterpriseProgramAssociations?: { [key: string]: EnterpriseProgramSessionAssociation };
  enterpriseProgramAssociationsLoading: boolean;
  enterpriseProgramAssociationsError: boolean;
};

type Props = PropsFromCaller & PropsFromGraphql & PropsFromGraphql2 & PropsFromGraphql3;

const EnrollmentChoiceModalForMultiprogram = ({
  onClose,
  onSelect,
  productId,
  productType,
  programJoinTrackingVerbiage,
  loading,
  programIds,
  programOptions,
  thirdPartyOrgName,
  headerTitle,
  buttonTitle,
  programsWithCredits,
  enterpriseProgramAssociations,
}: Props) => {
  const [programId, setProgramId] = React.useState<string | undefined>();

  React.useEffect(() => {
    if (programId == null && programOptions.length) {
      setProgramId(programOptions[0].programId);
    }
  }, [programId, programOptions, setProgramId]);

  const onChangeRadio = React.useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => setProgramId(event.target.value),
    [setProgramId]
  );

  const onSelectProgram = React.useCallback(() => {
    if (programId) {
      onSelect(programId);
    }
  }, [onSelect, programId]);

  const programCount = loading ? programIds.length : programOptions.length;
  const isMultiProgram = programCount > 1;

  // ---

  return (
    <EnrollmentChoiceModal
      headerTitle={headerTitle}
      onClose={onClose}
      button={
        <Button variant="primary" onClick={onSelectProgram}>
          {buttonTitle}
        </Button>
      }
    >
      <EnrollmentChoiceModalProductDescription productId={productId} productType={productType} />
      {isMultiProgram && (
        <EnrollmentChoiceModalProgramList
          programId={programId}
          productType={productType}
          programJoinTrackingVerbiage={programJoinTrackingVerbiage}
          thirdPartyOrgName={thirdPartyOrgName}
          programCount={programCount}
          programOptions={programOptions}
          onChangeRadio={onChangeRadio}
          programsWithCredits={programsWithCredits}
          enterpriseProgramAssociations={enterpriseProgramAssociations}
        />
      )}
      {!isMultiProgram && (
        <EnrollmentChoiceModalSingleProgram
          programOption={programOptions[0]}
          productType={productType}
          programJoinTrackingVerbiage={programJoinTrackingVerbiage}
          thirdPartyOrgName={thirdPartyOrgName}
          programsWithCredits={programsWithCredits}
          enterpriseProgramAssociations={enterpriseProgramAssociations}
        />
      )}
    </EnrollmentChoiceModal>
  );
};

export const enhancer = compose<Props, PropsFromCaller>(
  setDisplayName(getDisplayName(EnrollmentChoiceModalForMultiprogram)),
  // TODO(ppaskaris): The XDP metadata query uses fragments that cannot be cached effectively, causing the query to
  // always hit the network. Implement the IntrospectionFragmentMatcher (Frederik has made some progress with this) to
  // fix this issue and be able to serve this query from cache.
  graphql<PropsFromCaller, EnrollmentChoiceModalQueryType, EnrollmentChoiceModalQueryVariables, PropsFromGraphql>(
    EnrollmentChoiceModalQuery,
    {
      options: ({ programIds, userId }) => ({
        variables: {
          programMembershipIds: programIds.map((programId) => tupleToStringKey([userId, programId])),
        },
      }),
      props: ({ data }) => {
        const programEnrollments = filterExistsOrDefault(data?.ProgramMembershipsV2Resource?.multiGet?.elements);
        const programOptions = programEnrollments
          .filter(({ enterpriseProgram, createdAt }) => enterpriseProgram != null && createdAt != null)
          .map(({ programId, enterpriseProgram, createdAt, membershipState }) => ({
            programId,
            // See above filter().
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            programName: enterpriseProgram!.metadata.name,
            // See above filter().
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            date: new Date(createdAt!),
            isInvitation: membershipState === MembershipState.INVITED,
          }))
          .sort((a, b) => b.date.getTime() - a.date.getTime());
        return {
          loading: data?.loading ?? true,
          error: Boolean(data?.error),
          programOptions,
        };
      },
    }
  ),
  graphql<
    PropsFromCaller,
    ProgramProductMetadataMultiGetQueryData,
    ProgramProductMetadataMultiGetQueryVariables,
    PropsFromGraphql2
  >(ProgramProductMetadataMultiGetQuery, {
    options: ({ productType, productId: productId0, programIds }) => {
      const productType0 =
        productType === PRODUCT_TYPES.SPECIALIZATION ? PRODUCT_ID_INFIX.S12N : PRODUCT_ID_INFIX.COURSE;
      const productId = tupleToStringKey([productType0, productId0]);
      const programProductIds = programIds.map((programId) => `${programId}~${productId}`);
      return {
        variables: {
          ids: programProductIds,
        },
      };
    },
    props: ({ data }) => {
      const programProductMetadata = data?.ProgramProductMetadataV1Resource?.multiGet?.elements;
      const programsWithCredits = programProductMetadata
        ?.filter(
          (curProgramProductMetadata) =>
            curProgramProductMetadata?.metadataType &&
            'course' in curProgramProductMetadata.metadataType &&
            curProgramProductMetadata.metadataType.course.isSelectedForCredit
        )
        .map((curProgramProductMetadata) => curProgramProductMetadata?.programId);
      return {
        programsWithCredits,
        programsWithCreditsLoading: data?.loading ?? true,
        programsWithCreditsError: Boolean(data?.error),
      };
    },
  }),
  graphql<
    PropsFromCaller,
    EnterpriseProgramSessionAssociationsByProgramsAndCourseQueryType,
    EnterpriseProgramSessionAssociationsByProgramsAndCourseQueryVariables,
    PropsFromGraphql3
  >(EnterpriseProgramSessionAssociationsByProgramsAndCourseQuery, {
    skip: ({ productType }) => productType === PRODUCT_TYPES_SERVER.SPECIALIZATION,
    options: ({ productId, programIds }) => {
      return {
        variables: {
          courseId: productId,
          programIds,
        },
      };
    },
    props: ({ data }) => {
      const enterpriseProgramAssociations =
        data?.EnterpriseProgramSessionAssociationsV1Resource?.byProgramsAndCourse?.elements;
      const enterpriseProgramAssociationsMap = enterpriseProgramAssociations?.reduce(
        (result: { [programId: string]: EnterpriseProgramSessionAssociation }, enterpriseProgramAssociation) => {
          if (enterpriseProgramAssociation?.programId) {
            // eslint-disable-next-line no-param-reassign
            result[enterpriseProgramAssociation.programId] = enterpriseProgramAssociation;
            return result;
          }
          return result;
        },
        {}
      );
      return {
        enterpriseProgramAssociations: enterpriseProgramAssociationsMap,
        enterpriseProgramAssociationsLoading: data?.loading ?? true,
        enterpriseProgramAssociationsError: Boolean(data?.error),
      };
    },
  })
);

export default enhancer(EnrollmentChoiceModalForMultiprogram);
