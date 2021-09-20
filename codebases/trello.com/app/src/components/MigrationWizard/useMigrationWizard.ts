import { useState, useEffect, useCallback, useMemo } from 'react';
import { ApolloError, ApolloQueryResult } from '@apollo/client';
import { isDesktop } from '@trello/browser';
import {
  useMigrationWizardQuery,
  MigrationWizardQuery,
  MigrationWizardQueryVariables,
} from './MigrationWizardQuery.generated';
import { useDismissMigrationMessageMutation } from './DismissMigrationMessageMutation.generated';
import { DismissMessageKeys } from './constants';
import { MigrationWizardExperience } from './types';
import { useMigratedBoards } from './useMigratedBoards';
import { sendErrorEvent } from '@trello/error-reporting';
import { Feature } from 'app/scripts/debug/constants';
import { useFeatureFlag } from '@trello/feature-flag-client';
import { BillingDates, ExpirationDates } from '@trello/product-features';
import { deserializeJSONString } from '@trello/graphql';
import { useSunsetGold } from 'app/src/components/GoldSunset';
import { useWorkspaceMigrationSuccessFlag } from './useWorkspaceMigrationSuccessFlag';
import Cookies from 'js-cookie';

interface UseMigrationWizardArguments {
  skip?: boolean;
}

interface MigrationWizard {
  loading: boolean;
  loadingMigratedBoards: boolean;
  error?: ApolloError | Error;
  experience: MigrationWizardExperience;
  teamify?: NonNullable<MigrationWizardQuery['member']>['teamify'];
  migrationDate?: string;
  memberId: string;
  memberName: string;
  dismissMessage: (key: DismissMessageKeys) => void;
  hasDismissedPostMigrationBanner: boolean;
  checkExperience: () => void;
  hasDismissedAutoShow: boolean;
  refetch: (
    variables?: MigrationWizardQueryVariables | undefined,
  ) => Promise<ApolloQueryResult<MigrationWizardQuery>>;
}

const reportError = (error: ApolloError | undefined) => {
  if (error) {
    sendErrorEvent(error, {
      tags: {
        ownershipArea: 'trello-bizteam',
        feature: Feature.MigrationWizard,
      },
      extraData: {
        hook: 'useMigrationWizard',
      },
    });
  }
};

export const useMigrationWizard = ({
  skip = false,
}: UseMigrationWizardArguments = {}): MigrationWizard => {
  const isMigrationWizardFlagEnabled = useFeatureFlag(
    'btg.migration-wizard',
    false,
  );
  const isVeryHeavyUsageFlagEnabled = useFeatureFlag(
    'btg.migration-wizard.50-plus',
    false,
  );

  const [experience, setExperience] = useState<MigrationWizardExperience>(
    MigrationWizardExperience.None,
  );
  const [
    shouldRecheckExperience,
    setShouldRecheckExperience,
  ] = useState<boolean>(false);

  const { data, loading, error, refetch } = useMigrationWizardQuery({
    skip: !isMigrationWizardFlagEnabled || skip,
  });

  useEffect(() => {
    reportError(error);
  }, [error]);

  const member = data?.member;
  const memberId = member?.id || 'me';
  const memberName = member?.nonPublic?.fullName ?? member?.fullName ?? '';
  const confirmed = Boolean(member?.confirmed);
  const oneTimeMessagesDismissed = useMemo(
    () => data?.member?.oneTimeMessagesDismissed ?? [],
    [data?.member?.oneTimeMessagesDismissed],
  );

  const simulation = Cookies.get('teamify') || '{}';
  const simulatedTeamify = useMemo(() => {
    try {
      const val = JSON.parse(simulation);
      return {
        ...member?.teamify,
        ...val,
      };
    } catch (err) {
      return null;
    }
  }, [simulation, member?.teamify]);

  // teamify properties
  const teamify = simulatedTeamify || member?.teamify;
  const state = teamify?.state;
  const impact = teamify?.impact;
  const voluntaryDone = teamify?.voluntaryDone;
  const collaborativeTeamlessBoards = teamify?.collaborativeTeamlessBoards ?? 0;
  const soloTeamlessBoards = teamify?.soloTeamlessBoards ?? 0;
  const idOrgCreated = teamify?.idOrgCreated;
  const idOrgSelected = teamify?.idOrgSelected;

  // Sunsetting Trello Gold logic
  const paidAccount = data?.member?.paidAccount;
  const { goldSunsetEnabled, goldIsActive } = useSunsetGold({
    products: paidAccount?.products ?? [],
    standing: paidAccount?.standing ?? -1,
    billingDates:
      deserializeJSONString<BillingDates>(paidAccount?.billingDates) ?? {},
    expirationDates:
      deserializeJSONString<ExpirationDates>(paidAccount?.expirationDates) ??
      {},
  });

  const isQualifiedGoldUser = goldSunsetEnabled && goldIsActive;

  const {
    migrationOrg,
    migratedBoards,
    loading: loadingMigratedBoards,
    error: migratedBoardsError,
  } = useMigratedBoards({
    idOrg: idOrgCreated || idOrgSelected || '',
  });

  useEffect(() => {
    reportError(migratedBoardsError);
  }, [migratedBoardsError]);

  const [
    dismiss,
    { loading: isDismissing },
  ] = useDismissMigrationMessageMutation();

  const hasDismissedPostMigrationBanner = oneTimeMessagesDismissed.includes(
    DismissMessageKeys.TidyUp,
  );

  const hasDismissedAutoShow = oneTimeMessagesDismissed.includes(
    DismissMessageKeys.AutoShow,
  );

  const dismissMessage = useCallback(
    (messageId: DismissMessageKeys) => {
      if (isDismissing || oneTimeMessagesDismissed.includes(messageId)) {
        return;
      }

      dismiss({
        variables: {
          messageId,
        },
        optimisticResponse: {
          __typename: 'Mutation',
          addOneTimeMessagesDismissed: {
            id: 'me',
            oneTimeMessagesDismissed: [...oneTimeMessagesDismissed, messageId],
            __typename: 'Member',
          },
        },
      });
    },
    [dismiss, isDismissing, oneTimeMessagesDismissed],
  );

  const getExperience = useCallback(() => {
    let result = MigrationWizardExperience.None;

    if (state === 'nope' || !confirmed) {
      result = MigrationWizardExperience.None;
    } else if (state === 'pending') {
      if (
        isQualifiedGoldUser &&
        collaborativeTeamlessBoards + soloTeamlessBoards > 0
      ) {
        result = MigrationWizardExperience.GoldUserWithTeamlessBoards;
      } else if (collaborativeTeamlessBoards + soloTeamlessBoards >= 50) {
        if (isVeryHeavyUsageFlagEnabled) {
          result = MigrationWizardExperience.VeryHeavyUsage;
        } else {
          result = MigrationWizardExperience.None;
        }
      } else if (isMigrationWizardFlagEnabled) {
        if (collaborativeTeamlessBoards <= 0 && soloTeamlessBoards <= 0) {
          result = MigrationWizardExperience.None;
        } else if (isDesktop()) {
          result = MigrationWizardExperience.Desktop;
        } else if (voluntaryDone) {
          result = MigrationWizardExperience.Advanced;
        } else {
          result = MigrationWizardExperience.Pre;
        }
      } else {
        result = MigrationWizardExperience.None;
      }
    } else if (state === 'done') {
      if (migratedBoards.length >= 50) {
        result = MigrationWizardExperience.SuccessVeryHeavyUsage;
      } else {
        if (isMigrationWizardFlagEnabled) {
          if (
            hasDismissedPostMigrationBanner ||
            impact === 'none' ||
            (!idOrgCreated && !idOrgSelected) ||
            migratedBoards.length <= 0
          ) {
            result = MigrationWizardExperience.None;
          } else if (isDesktop()) {
            result = MigrationWizardExperience.Desktop;
          } else {
            result = MigrationWizardExperience.Post;
          }
        } else {
          result = MigrationWizardExperience.None;
        }
      }
    }

    return result;
  }, [
    collaborativeTeamlessBoards,
    confirmed,
    hasDismissedPostMigrationBanner,
    idOrgCreated,
    idOrgSelected,
    impact,
    isMigrationWizardFlagEnabled,
    isQualifiedGoldUser,
    isVeryHeavyUsageFlagEnabled,
    migratedBoards,
    soloTeamlessBoards,
    state,
    voluntaryDone,
  ]);

  useEffect(() => {
    if (experience === MigrationWizardExperience.SuccessVeryHeavyUsage) {
      dismissMessage(DismissMessageKeys.TidyUp);
    }
  }, [experience, dismissMessage]);

  useWorkspaceMigrationSuccessFlag(
    experience,
    migrationOrg,
    oneTimeMessagesDismissed,
  );

  useEffect(() => {
    // If the user is not seeing any of our banners, continuosly check if they
    // have become eligible for one.  Also recheck when we force it; this is
    // used mainly when closing the dialog, to check if we should also hide the
    // banner.
    if (
      !loading &&
      !loadingMigratedBoards &&
      (experience === MigrationWizardExperience.None || shouldRecheckExperience)
    ) {
      // conditionally set the state variable to avoid infinite renders
      const nextExperience = getExperience();
      if (nextExperience !== experience) {
        setExperience(nextExperience);
      }

      if (shouldRecheckExperience) {
        setShouldRecheckExperience(false);
      }
    }
  }, [
    experience,
    getExperience,
    loading,
    loadingMigratedBoards,
    setExperience,
    setShouldRecheckExperience,
    shouldRecheckExperience,
  ]);

  const checkExperience = useCallback(() => {
    refetch();
    setShouldRecheckExperience(true);
  }, [refetch, setShouldRecheckExperience]);

  return {
    loading,
    loadingMigratedBoards,
    error,
    experience,
    teamify,
    memberId,
    memberName,
    hasDismissedPostMigrationBanner,
    refetch,
    checkExperience,
    hasDismissedAutoShow,
    dismissMessage,
  };
};
