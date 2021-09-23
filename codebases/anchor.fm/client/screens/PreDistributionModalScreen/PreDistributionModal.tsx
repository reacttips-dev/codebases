import { useOptimizelyFeature } from 'client/hooks/useOptimizelyFeature';
import { Global } from '@emotion/core';
import { css } from 'emotion';
import React, { useEffect, useState } from 'react';
import { useQueryClient } from 'react-query';
import { connect } from 'react-redux';
import { useCurrentUserCtx } from 'contexts/CurrentUser';
import { useFeatureFlagsCtx } from 'contexts/FeatureFlags';
import { AnchorAPI } from 'modules/AnchorAPI';
import { getIsEPEnabled } from 'modules/FeatureFlags';
import { Modal } from 'shared/Modal';
import { CenteredSpinner } from 'shared/Spinner';
import { Metadata } from 'types/Metadata';
import { useFetchDistributionData } from 'client/hooks/distribution/useFetchDistributionData';
import { useFetchAndConstructPodcastObject } from 'client/hooks/podcast/useFetchAndConstructPodcastObject';
import { useFetchPodcastCategories } from 'client/hooks/podcast/useFetchPodcastCategories';
import {
  FETCH_PODCAST_OBJECT_QUERY,
  useOptOutOfPodcastDistribution,
} from 'client/hooks/distribution/useOptOutOfPodcastDistribution';
import { mapPodcastCategories } from 'screens/SettingsScreen/components/SettingsForm/SettingsForm';
import { CoverArtModalScreenContainer } from '../CoverArtModalScreen';
import { duckOperations as coverArtModalScreenDuckOperations } from '../CoverArtModalScreen/duck';
import { DistributionConfirmation } from './components/DistributionConfirmation';
import { DistributionPrompt } from './components/DistributionPrompt';
import { ConfirmationModal } from './components/BinaryDistributionPrompt/ConfirmationModal';
import MetadataForm, { FormData } from './components/MetadataForm';
import { events } from './events';
import {
  GlobalOverrides,
  PodcastSetupSubtitle,
  PodcastSetupTitle,
} from './styles';
import { BinaryDistributionPrompt } from './components/BinaryDistributionPrompt';
import { ERROR_MESSAGES } from '../SettingsScreen/components/SettingsForm/constants';

type Props = {
  onHideModal: () => void;
  isWordPressPublishedEpisode?: boolean;
  setFinishedDistributionFlow?: (isFinished: boolean) => void;
  setDismissedDistributionMilestone?: (params: {
    userId: number | null;
    webStationId: string | null;
  }) => void;
  onSubmitFormFinish?: (
    updatedMetadata: Metadata,
    podcastImageFull?: string
  ) => void;
  onFinishAcceptDistribution?: () => void;
  onFinishDeclineDistribution?: () => void;
  onFinishSubmitCoverArt?: (params: {
    image400: string;
    image: string;
  }) => void;
  resetCoverArtModalState: () => void;
  setupCoverArtModalStore: () => void;
  onMTAcceptSuccess?: () => void;
  onSpotifyDistributionAcceptSuccess?: () => void;
  onRSSAcceptClick?: () => void;
  containsMusicSegments?: boolean;
  isMilestone?: boolean;
};

function DistributionModal({
  isWordPressPublishedEpisode,
  onHideModal,
  setFinishedDistributionFlow,
  setDismissedDistributionMilestone, // legacy
  onSubmitFormFinish,
  onFinishAcceptDistribution, // legacy
  onFinishDeclineDistribution, // legacy
  onFinishSubmitCoverArt,
  resetCoverArtModalState,
  setupCoverArtModalStore,
  onMTAcceptSuccess,
  onSpotifyDistributionAcceptSuccess,
  onRSSAcceptClick,
  containsMusicSegments,
  isMilestone,
}: Props) {
  const {
    state: { featureFlags },
  } = useFeatureFlagsCtx();
  const [isManualDistributionEnabled] = useOptimizelyFeature(
    'manual_distribution'
  );
  const {
    state: { webStationId, userId },
  } = useCurrentUserCtx();
  const queryClient = useQueryClient();

  const [scene, setScene] = useState<
    'form' | 'publishing' | 'confirmation' | 'coverArt'
  >('form');

  // data requests
  const {
    podcast,
    handleSetPodcast,
    isLoadingPodcast,
  } = useFetchAndConstructPodcastObject();

  const { distributionData } = useFetchDistributionData();

  const { podcastCategoriesData } = useFetchPodcastCategories();

  const { handleOptOutPodcastDistribution } = useOptOutOfPodcastDistribution(
    webStationId,
    onFinishDeclineDistribution
  );

  const podcastCategoryOptions = mapPodcastCategories(
    podcastCategoriesData?.podcastCategoryOptions || []
  );
  const isEPEnabled = getIsEPEnabled(featureFlags);
  const publishedEpisodes =
    podcast?.podcastEpisodes?.filter(
      episode => episode.isPublished || episode.publishOn !== null
    ) || [];
  const hasOnlyPublishedMTEpisodes =
    podcast?.podcastEpisodes &&
    publishedEpisodes.length > 0 &&
    publishedEpisodes.every(episode => episode.isMT);
  const isOptedIntoSpotifyDistribution =
    podcast?.status.podcastStatus === 'optedinspotify' ||
    podcast?.status.podcastStatus === 'active';
  const isRssFeedEnabled = !!distributionData?.isRssFeedEnabled;
  const isSpotifyExclusive = containsMusicSegments || isEPEnabled;
  const canEnableRss = !!distributionData?.canEnableRss;

  const stationType = isSpotifyExclusive ? 'show' : 'podcast';
  const {
    podcastName,
    language,
    podcastDescription,
    itunesCategory,
    podcastImageFull,
  } = podcast?.metadata || {};

  useEffect(() => {
    // since cover art modal is still tapped into redux we have to
    // reset the state even though this component is managing the cover
    // art modal's `isShowing` piece of state
    // in a perfect world with infinite time to refactor, the cover art
    // state wouldn't be globally exposed and we wouldn't have to reset its
    // state when it's no longer on the dom
    resetCoverArtModalState();
    events.viewPodcastSetupModal();

    return () => {
      // reset the state of the cover art modal when we're done
      resetCoverArtModalState();
    };
  }, [resetCoverArtModalState]);

  useEffect(() => {
    // if the user has already filled out podcast info and
    // selected an image, go to distribution prompt
    // unless it's the milestone step
    const hasMetadata = !!(
      podcastName &&
      language &&
      podcastDescription &&
      itunesCategory &&
      podcastImageFull
    );
    if (hasMetadata && !(isManualDistributionEnabled && isMilestone)) {
      setScene('publishing');
    }
  }, [
    podcastName,
    language,
    podcastDescription,
    itunesCategory,
    podcastImageFull,
    isMilestone,
    isManualDistributionEnabled,
  ]);

  // podcast form callbacks
  const onSubmitSuccess = (data: any, imageFull?: string) => {
    const hasPodcastCoverArt = !!imageFull;
    if (!hasPodcastCoverArt) {
      // show cover art modal then dispatch action to set up store
      setScene('coverArt');
      setupCoverArtModalStore();
    } else if (!(isManualDistributionEnabled && isMilestone)) {
      setScene('publishing');
    }
    if (onSubmitFormFinish) onSubmitFormFinish(data, imageFull);
  };

  const onSubmitForm = async (
    updatedMetadata: FormData,
    imageFull?: string
  ) => {
    const {
      podcastName: name,
      language: podcastLanguage,
      podcastDescription: description,
      itunesCategory: podcastCategory,
    } = updatedMetadata;
    const resp = await AnchorAPI.updatePodcastMetadata(
      {
        userId: userId!,
        webStationId: webStationId!,
        metadata: {
          podcastName: name,
          podcastDescription: description,
          podcastLanguage, // this api is expecting 'podcastLanguage' and 'podcastCategory' in the request body
          podcastCategory,
        },
      },
      true
    );

    if (
      typeof resp !== 'number' &&
      resp.errors?.includes(ERROR_MESSAGES.PODCAST_NAME_NOT_ALLOWED)
    ) {
      throw new Error(ERROR_MESSAGES.PODCAST_NAME_NOT_ALLOWED);
    }
    onSubmitSuccess(updatedMetadata, imageFull);
    queryClient.invalidateQueries(FETCH_PODCAST_OBJECT_QUERY);
  };

  // cover art modal callbacks
  const onWillCloseCoverArtModal = () => {
    // close all the modals!
    resetCoverArtModalState();
    onHideModal();
  };

  const onDidPressNavigateFromChooseScene = () => {
    setScene('form');
    resetCoverArtModalState();
  };

  const onCoverArtFinish = ({
    image400,
    image,
  }: {
    image: string;
    image400: string;
  }) => {
    resetCoverArtModalState();
    if (isManualDistributionEnabled && isMilestone) {
      onHideModal();
    } else {
      setScene('publishing');
    }
    handleSetPodcast();
    if (onFinishSubmitCoverArt) onFinishSubmitCoverArt({ image400, image });
  };

  // distribution callbacks
  const onAcceptDistribution = () => {
    setScene('confirmation');
    if (onFinishAcceptDistribution) onFinishAcceptDistribution();
  };

  const onDeclineDistribution = () => {
    handleOptOutPodcastDistribution();
    // close this modal
    onHideModal();
  };

  const Spinner = () => (
    <div
      className={css`
        height: 400px;
      `}
      aria-label="loading next step"
    >
      <CenteredSpinner />
    </div>
  );

  switch (scene) {
    case 'form':
      return (
        <Modal
          contentClassName={css`
            max-width: 600px;
            width: 100%;
            margin: 0 auto;
          `}
          isShowing={true}
          isShowingCloseButton={scene === 'form'}
          onClickClose={onHideModal}
          renderContent={() =>
            podcastCategoryOptions && !isLoadingPodcast ? (
              <div>
                <Global styles={GlobalOverrides} />
                <PodcastSetupTitle>Set up your {stationType}</PodcastSetupTitle>
                <PodcastSetupSubtitle>
                  {isSpotifyExclusive
                    ? 'Before we can distribute your show to Spotify, you just need to fill in a few things.'
                    : 'Before we can distribute your podcast to additional listening platforms, you just need to fill in a few things.'}
                </PodcastSetupSubtitle>
                <PodcastSetupSubtitle>
                  (You can always change these later.)
                </PodcastSetupSubtitle>
                <MetadataForm
                  stationType={stationType}
                  podcastCategoryOptions={podcastCategoryOptions}
                  defaultValues={{
                    podcastName: podcastName || '',
                    podcastDescription: podcastDescription || '',
                    itunesCategory: itunesCategory || '',
                    language: language || '',
                  }}
                  onSubmit={(data: FormData) =>
                    onSubmitForm(data, podcastImageFull)
                  }
                />
              </div>
            ) : (
              <Spinner />
            )
          }
        />
      );
    case 'coverArt':
      return (
        <CoverArtModalScreenContainer
          onFinishSubmitCoverArt={onCoverArtFinish}
          onWillClose={onWillCloseCoverArtModal}
          onDidPressNavigateFromChooseScene={onDidPressNavigateFromChooseScene}
        />
      );
    case 'publishing':
      return isManualDistributionEnabled ? (
        <BinaryDistributionPrompt
          isSpotifyExclusive={isSpotifyExclusive}
          isOptedIntoSpotifyDistribution={isOptedIntoSpotifyDistribution}
          hasOnlyPublishedMTEpisodes={hasOnlyPublishedMTEpisodes}
          isRssFeedEnabled={isRssFeedEnabled}
          podcastImageFull={podcastImageFull}
          stationId={webStationId}
          onClickClose={onHideModal}
          canEnableRss={canEnableRss}
          onMTAcceptSuccess={() => {
            if (onMTAcceptSuccess) onMTAcceptSuccess();
          }}
          onSpotifyDistributionAcceptSuccess={() => {
            setScene('confirmation');
          }}
          onRSSAcceptClick={() => {
            if (onRSSAcceptClick) onRSSAcceptClick();
          }}
        />
      ) : (
        <Modal
          contentClassName={css`
            max-width: 600px;
            width: 100%;
            margin: 0 auto;
          `}
          isShowing={true}
          renderContent={() =>
            userId ? (
              <DistributionPrompt
                userId={userId}
                podcastImageFull={podcastImageFull || ''}
                onAcceptDistribution={() => {
                  onAcceptDistribution();
                  events.clickOptInToDistribution();
                }}
                onDeclineDistribution={() => {
                  onDeclineDistribution();
                  events.clickOptOutToDistribution();
                }}
                setDismissedDistributionMilestone={() => {
                  if (setDismissedDistributionMilestone)
                    setDismissedDistributionMilestone({ userId, webStationId });
                }}
                webStationId={webStationId}
                isSpotifyExclusive={isSpotifyExclusive}
                isWordPressPublishedEpisode={isWordPressPublishedEpisode}
                isEPEnabled={isEPEnabled}
              />
            ) : (
              <Spinner />
            )
          }
        />
      );
    case 'confirmation':
      return isManualDistributionEnabled ? (
        <ConfirmationModal
          onClickClose={onHideModal}
          onClickContinue={() => {
            if (onSpotifyDistributionAcceptSuccess)
              onSpotifyDistributionAcceptSuccess();
            if (setFinishedDistributionFlow) setFinishedDistributionFlow(true);
            onHideModal();
          }}
        />
      ) : (
        <Modal
          contentClassName={css`
            max-width: 600px;
            width: 100%;
            margin: 0 auto;
          `}
          isShowing={true}
          renderContent={() => (
            <DistributionConfirmation
              isWordPressPublishedEpisode={isWordPressPublishedEpisode}
              onAcceptDistributionConfirmation={() => {
                if (setFinishedDistributionFlow)
                  setFinishedDistributionFlow(true);
                onHideModal();
              }}
              isSpotifyExclusive={isSpotifyExclusive}
              stationType={stationType}
              podcastImageFull={podcastImageFull}
            />
          )}
        />
      );
    default:
      return null;
  }
}

// If we ever refactor the cover art modal and remove its reliance on redux,
// this can go and we'd manage it's visibility state in the DistributionModal component
const mapDispatchToProps = (dispatch: any) => {
  return {
    resetCoverArtModalState: () => {
      dispatch(coverArtModalScreenDuckOperations.closeAndResetState());
    },
    setupCoverArtModalStore: () => {
      dispatch(coverArtModalScreenDuckOperations.openAndSetupStore());
    },
  };
};

const PreDistributionModal = connect(
  null,
  mapDispatchToProps
)(DistributionModal);

export { PreDistributionModal };
