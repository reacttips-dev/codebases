import React, {
  useCallback,
  useEffect,
  useMemo,
  useState,
  useRef,
} from 'react';
import { Feature } from 'app/scripts/debug/constants';
import { ErrorBoundary } from 'app/src/components/ErrorBoundary';
import { TeamlessBoard, useTeamlessBoards } from './useTeamlessBoards';
import { useDialog } from 'app/src/components/Dialog';
import { MigrationWizardExperience, MigrationWizardSteps } from './types';
import { useMigrationWizard } from './useMigrationWizard';
import { useBoardSelector, SelectedBoardsAction } from './useBoardSelector';
import { Analytics } from '@trello/atlassian-analytics';
import { screenToSource, DismissMessageKeys } from './constants';
import { useTeamGuests } from './useTeamGuests';
import { MigrationWizardQuery } from './MigrationWizardQuery.generated';
import { useSocketSubscription } from 'app/scripts/init/useSocketSubscription';
import { useLocation } from '@trello/router';
import { getRouteIdFromPathname, isCardRoute } from '@trello/routes';
import { useFeatureFlag } from '@trello/feature-flag-client';
import { ModelLoader } from 'app/scripts/db/model-loader';
import { memberId } from '@trello/session-cookie';

const defaultStep = MigrationWizardSteps.INTRO;

function usePrevious<T>(value: T) {
  const ref = useRef<T>();

  // Store current value in ref
  useEffect(() => {
    ref.current = value;
  }, [value]);

  // Return previous value (happens before update in useEffect above)
  return ref.current;
}

export const useMigrationWizardContext = () => {
  const {
    memberName,
    loading: loadingWizard,
    teamify,
    experience,
    hasDismissedPostMigrationBanner,
    refetch: refetchMigrationWizardQuery,
    checkExperience,
    hasDismissedAutoShow,
    dismissMessage,
  } = useMigrationWizard();

  const previousTeamifyState = usePrevious(teamify?.state);
  const isAutoShowEnabled = useFeatureFlag('btg.wizard-auto-show', false);
  const { dialogProps, show } = useDialog();
  const { teamlessBoards } = useTeamlessBoards({
    skip:
      loadingWizard ||
      (experience !== MigrationWizardExperience.Pre &&
        experience !== MigrationWizardExperience.Advanced &&
        experience !== MigrationWizardExperience.Post),
  });
  const [orgId, setOrgId] = useState<string>('');
  const [initialVoluntaryDone, setInitialVoluntaryDone] = useState<
    string | null | undefined
  >(null);
  const [
    hasSetInitialVoluntaryDone,
    setHasSetInitialVoluntaryDone,
  ] = useState<boolean>(false);
  const { teamGuests, loading: teamGuestsLoading } = useTeamGuests(orgId);
  const [teamName, setTeamName] = useState('');
  const [currentStep, setCurrentStep] = useState<MigrationWizardSteps>(
    defaultStep,
  );
  const [previousStep, setPreviousStep] = useState<MigrationWizardSteps>();
  const [selectedBoards, updateBoards] = useBoardSelector();
  const [
    shouldCheckEligibilityOnClose,
    setShouldCheckEligibilityOnClose,
  ] = useState<boolean>(false);

  useSocketSubscription('Organization', orgId, !orgId || !dialogProps.isOpen);

  const { pathname } = useLocation();

  const voluntaryDone = teamify?.voluntaryDone;

  const setNewStep = useCallback(
    (step?: MigrationWizardSteps) => {
      if (step) {
        switch (step) {
          case MigrationWizardSteps.MEMBERSHIPS:
            updateBoards({ type: 'clear' });
            setTeamName('');
            if (!teamGuestsLoading && orgId !== '') {
              if (teamGuests?.length === 0) {
                setCurrentStep(MigrationWizardSteps.BOARD_VISIBILITY);
              } else {
                setCurrentStep(step);
              }
            }
            break;
          default:
            setCurrentStep(step);
            break;
        }
        setPreviousStep(currentStep);
      }
    },
    [currentStep, updateBoards, teamGuests, teamGuestsLoading, orgId],
  );

  const onNext = useCallback(
    (step: MigrationWizardSteps) => {
      setNewStep(step);
    },
    [setNewStep],
  );

  useEffect(() => {
    if (dialogProps.isOpen) {
      if (
        (currentStep === MigrationWizardSteps.MOVE_YOUR_BOARDS ||
          currentStep === MigrationWizardSteps.BC_FOR_FREE) &&
        orgId !== ''
      ) {
        return;
      }
      Analytics.sendScreenEvent({
        name: screenToSource[currentStep],
        containers: {
          organization: {
            id: orgId,
          },
        },
        attributes: {
          forcedMigration:
            experience === MigrationWizardExperience.Post ? 'post' : 'pre',
        },
      });
    }
  }, [dialogProps.isOpen, currentStep, orgId, experience]);

  const onBack = useCallback(() => {
    if (currentStep === MigrationWizardSteps.BC_FOR_FREE) {
      Analytics.sendClickedButtonEvent({
        buttonName: 'backButton',
        source: 'teamifyBCModal',
      });
    }
    if (previousStep) {
      setNewStep(previousStep);
    }
  }, [setNewStep, previousStep, currentStep]);

  const hideWizard = useCallback(() => {
    dialogProps.hide();
    setNewStep(MigrationWizardSteps.INTRO);
    updateBoards({ type: 'clear' });
    setInitialVoluntaryDone(voluntaryDone);
    setOrgId('');

    // refresh model cache for certain pages that don't
    // get the complete socket deltas to render properly
    if (orgId) {
      ModelLoader.loadMemberBoardsData(memberId!);
      ModelLoader.loadOrganizationBoardsData(orgId);
    }

    if (shouldCheckEligibilityOnClose) {
      checkExperience();
      setShouldCheckEligibilityOnClose(false);
    }
  }, [
    dialogProps,
    setNewStep,
    updateBoards,
    voluntaryDone,
    checkExperience,
    shouldCheckEligibilityOnClose,
    setShouldCheckEligibilityOnClose,
    orgId,
  ]);

  const checkEligibilityOnClose = useCallback(() => {
    if (!shouldCheckEligibilityOnClose) {
      setShouldCheckEligibilityOnClose(true);
    }
  }, [shouldCheckEligibilityOnClose]);

  /**
   * Sets initial voluntary done so that we can switch to complex
   * only when the user first opens the modal
   */
  useEffect(() => {
    if (loadingWizard || hasSetInitialVoluntaryDone) {
      return;
    }

    setHasSetInitialVoluntaryDone(true);
    setInitialVoluntaryDone(voluntaryDone);
  }, [
    loadingWizard,
    setInitialVoluntaryDone,
    hasSetInitialVoluntaryDone,
    setHasSetInitialVoluntaryDone,
    voluntaryDone,
  ]);

  useEffect(() => {
    if (!loadingWizard && memberName) {
      setTeamName(`${memberName}'s workspace`);
    }
  }, [loadingWizard, memberName, setTeamName]);

  useEffect(() => {
    if (!dialogProps.isOpen && teamify?.state !== previousTeamifyState) {
      checkExperience();
    }
  }, [
    dialogProps.isOpen,
    checkExperience,
    previousTeamifyState,
    teamify?.state,
  ]);

  useEffect(() => {
    if (loadingWizard || !hasSetInitialVoluntaryDone) {
      return;
    }

    if (teamify?.state === 'done') {
      // skips to post-migration if backend migration has finished
      setNewStep(MigrationWizardSteps.POST_MIGRATION);
    } else if (
      initialVoluntaryDone &&
      currentStep !== MigrationWizardSteps.COMPLEX_MOVE_BOARDS
    ) {
      // skips to complex if they've already completed the simple flow
      setNewStep(MigrationWizardSteps.COMPLEX_MOVE_BOARDS);
    }
  }, [
    loadingWizard,
    initialVoluntaryDone,
    setNewStep,
    currentStep,
    teamify?.state,
    hasSetInitialVoluntaryDone,
  ]);

  useEffect(() => {
    if (
      isAutoShowEnabled && // the feature flag for auto show is enabled
      experience === MigrationWizardExperience.Pre && // this user is eligible for the wizard
      !dialogProps.isOpen && // the wizard isn't already open
      !hasDismissedAutoShow && // the user hasn't already been automatically shown the wizard
      !loadingWizard && // we're not still loading user data
      !isCardRoute(getRouteIdFromPathname(pathname)) // the user isn't on a cardback
    ) {
      show();
      dismissMessage(DismissMessageKeys.AutoShow);
    }
  }, [
    dialogProps.isOpen,
    dismissMessage,
    experience,
    hasDismissedAutoShow,
    isAutoShowEnabled,
    loadingWizard,
    pathname,
    show,
  ]);

  return useMemo(
    () => ({
      teamlessBoards,
      currentStep,
      previousStep,
      onNext,
      onBack,
      orgId,
      setOrgId,
      selectedBoards,
      updateBoards,
      teamName,
      setTeamName,
      dialogProps,
      hideWizard,
      experience,
      teamify,
      dismissMessage,
      hasDismissedPostMigrationBanner,
      refetchMigrationWizardQuery,
      checkEligibilityOnClose,
    }),
    [
      teamlessBoards,
      currentStep,
      previousStep,
      onNext,
      onBack,
      orgId,
      setOrgId,
      selectedBoards,
      updateBoards,
      teamName,
      setTeamName,
      dialogProps,
      hideWizard,
      experience,
      teamify,
      dismissMessage,
      hasDismissedPostMigrationBanner,
      refetchMigrationWizardQuery,
      checkEligibilityOnClose,
    ],
  );
};

export interface MigrationWizardContextState {
  teamlessBoards: TeamlessBoard[];
  currentStep: MigrationWizardSteps;
  previousStep?: MigrationWizardSteps;
  onNext?: (step?: MigrationWizardSteps) => void;
  onBack?: () => void;
  orgId: string;
  setOrgId(id: string): void;
  teamName: string;
  setTeamName(id: string): void;
  selectedBoards: string[];
  updateBoards: React.Dispatch<SelectedBoardsAction>;
  dialogProps: {
    hide: () => void;
    show: () => void;
    toggle: () => void;
    isOpen: boolean;
  };
  hideWizard: () => void;
  experience: MigrationWizardExperience;
  teamify?: NonNullable<MigrationWizardQuery['member']>['teamify'] | null;
  hasDismissedPostMigrationBanner: boolean;
  refetchMigrationWizardQuery:
    | ReturnType<typeof useMigrationWizard>['refetch']
    | (() => void);
  checkEligibilityOnClose: () => void;
  dismissMessage: (messageId: DismissMessageKeys) => void;
}

export const migrationWizardContextDefaults: MigrationWizardContextState = {
  teamlessBoards: [],
  currentStep: defaultStep,
  onNext: () => {},
  onBack: () => {},
  setOrgId: () => {},
  orgId: '',
  selectedBoards: [],
  updateBoards: () => {},
  teamName: '',
  setTeamName: () => {},
  dialogProps: {
    hide: () => {},
    show: () => {},
    toggle: () => {},
    isOpen: false,
  },
  hideWizard: () => {},
  experience: MigrationWizardExperience.None,
  teamify: null,
  hasDismissedPostMigrationBanner: false,
  refetchMigrationWizardQuery: () => {},
  checkEligibilityOnClose: () => {},
  dismissMessage: () => {},
};

export const MigrationWizardContext = React.createContext<MigrationWizardContextState>(
  migrationWizardContextDefaults,
);

interface MigrationWizardContextProps {}

export const MigrationWizardProvider: React.FC<MigrationWizardContextProps> = ({
  children,
}) => {
  const context = useMigrationWizardContext();
  return (
    <ErrorBoundary
      tags={{
        ownershipArea: 'trello-bizteam',
        feature: Feature.MigrationWizard,
      }}
    >
      <MigrationWizardContext.Provider value={context}>
        {children}
      </MigrationWizardContext.Provider>
    </ErrorBoundary>
  );
};
