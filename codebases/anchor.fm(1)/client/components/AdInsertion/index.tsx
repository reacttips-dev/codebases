import { css } from 'emotion';
import React, { useEffect, useState } from 'react';
import Icon from 'shared/Icon';
import { UploadErrorIcon } from 'shared/Icon/components/UploadErrorIcon';
import { events } from 'screens/EpisodeScreen/events';
import { WaveformAudioInfo } from 'screens/EpisodeScreen/context';
import { DURATION_ERROR_MESSAGE } from 'screens/EpisodeScreen/components/CuePoints/constants';
import { useCuePoints } from 'screens/EpisodeScreen/components/CuePoints/useCuePoints';
import { SetPodcastEpisodeId } from 'screens/EpisodeScreen/components/Form/types';
import { SAIWaveformModal } from 'screens/EpisodeScreen/components/AdInsertion/WaveformModal';
import { StyledButton } from 'screens/EpisodeScreen/components/MediaUploader/styles';
import {
  Container,
  IconWrapper,
  ModuleHeader,
  Info,
} from 'components/AdInsertion/styles';
import { AdInsertionContext } from 'components/AdInsertion/context';
import { Button } from 'client/shared/Button/NewButton';
import { AdInsertionErrorModal } from 'components/AdInsertion/components/AdInsertionErrorModal';
import { AdInsertionUIType } from 'components/AdInsertion/types';

export const ENABLE_WAVEFORM_AD_INSERTION = false;

type AdInsertionProps = {
  podcastEpisodeId?: string;
  duration: number;
  waveformAudioInfo: WaveformAudioInfo;
  setPodcastEpisodeId: SetPodcastEpisodeId;
  isWaveformEnabled?: boolean;
  kind?: AdInsertionUIType;
};

export function AdInsertion({
  duration,
  waveformAudioInfo,
  podcastEpisodeId,
  setPodcastEpisodeId,
  isWaveformEnabled = true,
  kind = 'section',
}: AdInsertionProps) {
  const [showModal, setShowModal] = useState(false);
  const [cuePointCount, setCuePointCount] = useState<number | null>(null);
  const [hasInvalidCuePointError, setHasInvalidCuePointError] = useState(false);
  const {
    state: { newCuePoint, status, errors, savedCuePoints, errorModal },
    updateNewCuePoint,
    addCuePoint,
    removeCuePoint,
    editCuePoint,
    dismissErrorModal,
    clearErrors,
  } = useCuePoints({
    initialPodcastEpisodeId: podcastEpisodeId,
    setPodcastEpisodeId,
    mediaDuration: duration,
  });

  useEffect(() => {
    if (savedCuePoints) {
      setCuePointCount(
        savedCuePoints.reduce((acc, curr) => acc + curr.adCount, 0)
      );
    }
  }, [savedCuePoints]);

  useEffect(() => {
    if (errors && errors.find(err => err.message === DURATION_ERROR_MESSAGE)) {
      setHasInvalidCuePointError(true);
    } else {
      setHasInvalidCuePointError(false);
    }
  }, [errors]);

  useEffect(() => {
    // file has been removed most likely
    if (duration === 0) {
      setHasInvalidCuePointError(false);
    }
  }, [duration]);

  const onButtonClick = () => {
    events.trackInsertAdButtonClick();
    setShowModal(true);
  };

  const onClickClose = () => {
    setShowModal(false);
  };

  const fillColor = hasInvalidCuePointError
    ? '#ffffff'
    : cuePointCount && cuePointCount > 0
    ? '#70EA65'
    : '#dedfe0';

  const bodyCopy =
    cuePointCount && cuePointCount > 0
      ? 'Edit, add, or remove your ad slots.'
      : 'Insert your ad slots to monetize your podcast.';

  /**
   * different UIs to render for ad insertion, depending on the `kind` prop passed
   */
  function renderAdInsertionUI() {
    switch (kind) {
      case 'addAdSegmentButton':
        // this is the button that would live in the episode staging area
        return (
          <Button
            className={css`
              width: 100%;
            `}
            onClick={onButtonClick}
          >
            Add ad locations
          </Button>
        );
      // TODO: update this button name to be more descriptive, less generic
      // https://anchorfm.atlassian.net/browse/PODRACER-1965
      case 'button':
        // this is a standalone button that can either open the waveform or link to the episode builder
        return (
          <>
            {isWaveformEnabled ? (
              <Button color="green" onClick={onButtonClick}>
                Edit ad locations
              </Button>
            ) : (
              <Button
                color="green"
                kind="link"
                href={`/dashboard/episode/${podcastEpisodeId}/edit`}
              >
                Edit ad locations
              </Button>
            )}
          </>
        );
      case 'section':
        // this is a page-wide section for ad insertion
        return (
          <div>
            <ModuleHeader>Ad insertion</ModuleHeader>
            <Container opacity={1}>
              <IconWrapper fillColor={fillColor}>
                {hasInvalidCuePointError ? (
                  <UploadErrorIcon size={{ width: 64, height: 64 }} />
                ) : (
                  <Icon type="dollar_sign" fillColor="#ffffff" />
                )}
              </IconWrapper>
              <Info hasError={hasInvalidCuePointError}>
                {hasInvalidCuePointError ? (
                  <>
                    <h3>One or more of your ad slots has been disabled.</h3>
                    <h3>Edit ads to resolve errors.</h3>
                  </>
                ) : (
                  <>
                    <p>{bodyCopy}</p>
                  </>
                )}
              </Info>
              {isWaveformEnabled ? (
                <StyledButton
                  className={css`
                    width: 175px;
                  `}
                  onClick={onButtonClick}
                  color="white"
                >
                  {!cuePointCount && !hasInvalidCuePointError
                    ? 'Insert ads'
                    : `Edit ads (${cuePointCount})`}
                </StyledButton>
              ) : (
                <StyledButton
                  kind="link"
                  className={css`
                    width: 175px;
                  `}
                  href={`/dashboard/episode/${podcastEpisodeId}/edit`}
                  color="white"
                >
                  Insert ads
                </StyledButton>
              )}
            </Container>
          </div>
        );
      default:
        return null;
    }
  }
  return (
    <AdInsertionContext.Provider
      value={{
        setCuePointCount,
        setHasInvalidCuePointError,
        cuePointsState: { newCuePoint, status, errors, savedCuePoints },
        updateNewCuePoint,
        addCuePoint,
        removeCuePoint,
        editCuePoint,
        clearErrors,
      }}
    >
      {renderAdInsertionUI()}
      {showModal && (
        <SAIWaveformModal
          duration={duration}
          onClickClose={onClickClose}
          waveformAudioInfo={waveformAudioInfo}
        />
      )}

      {errorModal && (
        <AdInsertionErrorModal
          errorModal={errorModal}
          dismissErrorModal={dismissErrorModal}
        />
      )}
    </AdInsertionContext.Provider>
  );
}
