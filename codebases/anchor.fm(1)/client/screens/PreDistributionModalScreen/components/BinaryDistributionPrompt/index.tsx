import { useRequestSpotifyOnlyDistribution } from 'client/hooks/distribution/useRequestSpotifyOnlyDistribution';
import { useUpdateDistribution } from 'client/hooks/distribution/useUpdateDistribution';
import React from 'react';
import { EnableRSSFeedModal } from './EnableRSSFeedModal';
import { MTSpotifyDistributionModal } from './MTSpotifyDistributionModal';
import { SpotifyOnlyDistributionModal } from './SpotifyOnlyDistributionModal';

type Props = {
  isSpotifyExclusive: boolean;
  isOptedIntoSpotifyDistribution: boolean;
  hasOnlyPublishedMTEpisodes?: boolean;
  isRssFeedEnabled?: boolean;
  onMTAcceptSuccess: () => void;
  onSpotifyDistributionAcceptSuccess: () => void;
  onRSSAcceptClick: () => void;
  onClickClose: () => void;
  podcastImageFull?: string;
  stationId: string | null;
  canEnableRss?: boolean;
};

function BinaryDistributionPrompt({
  isSpotifyExclusive,
  isOptedIntoSpotifyDistribution,
  hasOnlyPublishedMTEpisodes,
  isRssFeedEnabled,
  onMTAcceptSuccess,
  onSpotifyDistributionAcceptSuccess,
  onRSSAcceptClick,
  onClickClose,
  podcastImageFull,
  stationId,
  canEnableRss,
}: Props) {
  const {
    handleSpotifyOnlyDistribution,
    isLoadingDistribution,
    isErrorDistribution,
  } = useRequestSpotifyOnlyDistribution(stationId);

  const { updateDistribution } = useUpdateDistribution();

  if (isSpotifyExclusive && !isOptedIntoSpotifyDistribution) {
    return (
      <MTSpotifyDistributionModal
        onClickClose={onClickClose}
        onOptInClick={async () => {
          try {
            await handleSpotifyOnlyDistribution(undefined, {
              onSuccess: () => {
                onMTAcceptSuccess();
              },
            });
          } catch (err) {
            throw new Error(
              `Couldn't opt into spotify distribution; error: ${err}`
            );
          }
        }}
        isLoading={isLoadingDistribution}
        isError={isErrorDistribution}
        podcastImageFull={podcastImageFull}
      />
    );
  }

  if (hasOnlyPublishedMTEpisodes && !isRssFeedEnabled && canEnableRss) {
    return (
      <EnableRSSFeedModal
        onClickClose={onClickClose}
        onClickEnable={async () => {
          await updateDistribution(
            { isRssFeedEnabled: true },
            {
              onSuccess: () => {
                onRSSAcceptClick();
              },
            }
          );
        }}
      />
    );
  }

  return (
    <SpotifyOnlyDistributionModal
      onClickClose={onClickClose}
      onOptInClick={async () => {
        try {
          await handleSpotifyOnlyDistribution(undefined, {
            onSuccess: () => {
              onSpotifyDistributionAcceptSuccess();
            },
          });
        } catch (e) {
          throw new Error(`Couldn't distribute to Spotify`);
        }
      }}
      isLoading={isLoadingDistribution}
      isError={isErrorDistribution}
    />
  );
}

export { BinaryDistributionPrompt };
