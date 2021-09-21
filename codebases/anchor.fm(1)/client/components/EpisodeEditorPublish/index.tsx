import React, { useState, useEffect } from 'react';
import Modal from 'react-bootstrap/lib/Modal';
import { useForm } from 'react-hook-form';
import moment from 'moment';
import { css } from '@emotion/core';
import { css as className } from 'emotion';
import { useFetchPodcastMetadata } from 'client/hooks/useFetchPodcastMetadata';
import { useOptimizelyFeature } from 'hooks/useOptimizelyFeature';
import { EmailVerificationModal } from 'screens/SettingsScreen/components/EmailVerificationModal';
import { AnchorAPI } from 'modules/AnchorAPI';
import { useFeatureFlagsCtx } from 'contexts/FeatureFlags';
import { getIsEPEnabled } from 'modules/FeatureFlags';
import { useFetchDistributionData } from 'client/hooks/distribution/useFetchDistributionData';
import { EpisodeState } from 'client/types/Episodes';
import { Metadata } from 'client/types/Metadata';
import { Button } from 'shared/Button/NewButton';
import { PreDistributionModal } from 'screens/PreDistributionModalScreen/PreDistributionModal';
import Text from 'shared/Text';
import {
  ControlledFieldInput,
  ControlledFieldToggle,
  ControlledFieldDatePicker,
  ControlledFieldRadioToggle,
} from 'components/Field';
import { FieldLabel } from 'components/FieldLabel';
import { HorizontalRule } from 'components/HorizontalRule';
import { DEFAULT_IMAGE } from 'client/onboarding';
import { UnpublishEpisodeErrorModal } from 'components/UnpublishEpisodeErrorModal';
import { ResendEmailWarning } from 'components/ResendEmailWarning';
import { Spinner } from 'client/shared/Spinner';
import { AdInsertionWrapper } from 'components/AdInsertion/components/AdInsertionWrapper';
import { ENABLE_WAVEFORM_AD_INSERTION } from 'components/AdInsertion';
import { InteractiveQuestion } from './components/InteractiveQuestion';
import { InteractivePoll } from './components/InteractivePoll';
import { MusicNotAllowedErrorModal } from './components/MusicNotAllowedErrorModal';
import { DistributeToSpotifyModal } from './components/DistributeToSpotifyModal';
import { ControlledFieldRichTextEditor } from './components/FieldRichTextEditor/ControlledFieldRichTextEditor';
import events from './events/index';
import {
  PublishEpisodeHeader,
  PublishMusicHeader,
  PublishDateContainer,
  FieldToggleContainer,
  MainOptionsSection,
  MobileButtonContainer,
  SectionWrapper,
  DraftButton,
  SaveButton,
  FormContainer,
  ResendEmailContainer,
  CustomizeOptionsHeaderContainer,
  CustomizeOptionsHeader,
  CustomizeOptionsFormContainer,
  CustomizeOptionsFieldContainer,
  Form,
  Header,
  HeaderContainer,
  DesktopButtonContainer,
  ImageUploader,
  InlineField,
  Label,
  ErrorAlert,
  NumberInputStyles,
  ModalButton,
  InlineLabelStyles,
  SpinnerContainer,
} from './styles';
import {
  FormValues,
  SubmitButtonTitleType,
  EpisodeEditorPublishProps,
  EpisodeAudioProps,
  NonNormalizedFormValues,
  EpisodeEditorPublishHelperProps,
} from './types';
import { BUTTON_COPY } from './constants';
import { NoTaxiDistributionErrorModal } from './components/NoTaxiDistributionErrorModal';

const UNVERIFIED = 'unverified'; // TODO: Extract this value from the UserVerificationState type in AnchorAPI.verifyUserEmail

export const EpisodeEditorPublishErrors = {
  MUSIC_NOT_ALLOWED: 'MUSIC_NOT_ALLOWED',
};

const getEpisodeState = (values: FormValues): EpisodeState => {
  if (!values) return null;
  const { publishOn } = values;
  const now = moment().toString();
  if (!publishOn) return 'isDraft';
  if (moment(now).isAfter(publishOn)) return 'isPublished';
  if (moment(publishOn).isAfter(now)) return 'isScheduled';
  return null;
};

const getFormatedTime = (dateTime: string) =>
  moment.utc(dateTime).local().format('M/D/YY [at] h:mm A');

const normalizeFormValues = (
  formValues: NonNormalizedFormValues
): FormValues => {
  const {
    podcastEpisodeNumber,
    podcastSeasonNumber,
    publishOn,
    podcastEpisodeIsExplicit,
  } = formValues;

  const newPublishOn =
    (typeof publishOn === 'string' && publishOn) ||
    (typeof publishOn === 'object' &&
      moment(publishOn || undefined).toISOString()) ||
    new Date().toISOString();

  const newPodcastEpisodeNumber = podcastEpisodeNumber?.length
    ? parseInt(podcastEpisodeNumber, 10)
    : undefined;
  const newPodcastSeasonNumber = podcastSeasonNumber?.length
    ? parseInt(podcastSeasonNumber, 10)
    : undefined;

  return {
    ...formValues,
    publishOn: newPublishOn,
    podcastEpisodeIsExplicit: podcastEpisodeIsExplicit === 'true',
    podcastEpisodeNumber: newPodcastEpisodeNumber || undefined,
    podcastSeasonNumber: newPodcastSeasonNumber || undefined,
  };
};

const getDefaultValues = (
  initialValues: FormValues,
  podcastImage?: string
): NonNormalizedFormValues => ({
  ...initialValues,
  podcastEpisodeNumber: initialValues.podcastEpisodeNumber?.toString() || '',
  podcastSeasonNumber: initialValues.podcastSeasonNumber?.toString() || '',
  podcastEpisodeIsExplicit:
    initialValues.podcastEpisodeIsExplicit?.toString() || 'false',
  isPW: initialValues.isPW || false,
  title: initialValues.title || '',
  episodeImage: (!!initialValues.episodeImage?.image &&
    initialValues.episodeImage) ||
    (podcastImage && { image: podcastImage }) || {
      image: DEFAULT_IMAGE,
    },
});

const EpisodeEditorPublishHelper = ({
  actions: { fetchUserVerificationState, dismissAudioError },
  episodeEditorScreen: { podcastEpisodeId, addAudioError, episodeAudios },
  match: {
    match: { params, path },
  },
  onSubmit,
  podcastMetadata,
  initialValues,
  userId,
  containsMusicSegments,
  stationId,
  userVerificationState,
  onEpisodeEditorPopupView,
  hasOnlyPublishedMTEpisodes,
  podcastStatus,
}: EpisodeEditorPublishHelperProps) => {
  const [isPollsOptimizelyEnabled] = useOptimizelyFeature('episode_polls');
  const [isQnAOptimizelyEnabled] = useOptimizelyFeature('episode_q_a');
  const [isManualDistributionEnabled] = useOptimizelyFeature(
    'manual_distribution'
  );

  const initialEpisodeState = getEpisodeState(initialValues);
  const {
    handleSubmit,
    formState: { isSubmitting, errors },
    control,
    getValues,
    watch,
  } = useForm<NonNormalizedFormValues>({
    defaultValues: getDefaultValues(
      initialValues,
      podcastMetadata.podcastImage
    ),
  });

  const [globalError, setGlobalError] = useState<string | null>(null);
  const [
    submitButtonTitle,
    setSubmitButtonTitle,
  ] = useState<SubmitButtonTitleType>(null);
  const [doPersistError, setDoPersistError] = useState(false);
  const [
    isEmailVerificationModalOpen,
    setIsEmailVerificationModalOpen,
  ] = useState(false);
  const [
    emailVerificationRequestSent,
    setEmailVerificationRequestSent,
  ] = useState(false);
  const [
    isSpotifyDistributionModalOpen,
    setIsSpotifyDistributionModalOpen,
  ] = useState(false);
  const [isPreDistributionModalOpen, setIsPreDistributionModalOpen] = useState(
    false
  );
  const [
    isPublishingForTheFirstTime,
    setIsPublishingForTheFirstTime,
  ] = useState(false);
  const [
    isNoTaxiDistributionErrorModalOpen,
    setIsNoTaxiDistributionErrorModalOpen,
  ] = useState(false);

  const {
    state: { featureFlags },
  } = useFeatureFlagsCtx();

  const { distributionData } = useFetchDistributionData();
  const isRssFeedEnabled = distributionData?.isRssFeedEnabled ?? false;
  const isPaywallsEnabled =
    (podcastMetadata?.isPWEnabled && podcastMetadata?.isPWSetup) ?? false;
  const isEPEnabled = getIsEPEnabled(featureFlags);
  const isSpotifyExclusive = isEPEnabled || containsMusicSegments;
  const canEnableRss = distributionData?.canEnableRss ?? false;
  const spotifyDistributionStatus = distributionData?.spotifyDistributionStatus;
  const distributionEligibilityForPaywalls =
    podcastMetadata?.distributionEligibilityForPaywalls;
  const isOptedIntoSpotifyDistribution =
    spotifyDistributionStatus === 'on' || podcastStatus === 'optedinspotify';
  const isMusicAndTalkFastTrackEnabled =
    podcastMetadata?.isMusicAndTalkFastTrackEnabled ?? false;
  const isImportedPodcast =
    !!distributionData?.podcastExternalSource ||
    !!distributionData?.podcastExternalSourceRedirected;
  const isLegacyOptedOut =
    podcastStatus === 'optedout' &&
    distributionData?.spotifyDistributionStatus === 'pending';
  const isExemptFromDistributionPrompt = isLegacyOptedOut || isImportedPodcast;
  const isKidsFamilyCategory = getIsKidsFamily(podcastMetadata);
  const isPollsEnabled = isPollsOptimizelyEnabled && !isKidsFamilyCategory;
  const isListenerQuestionEnabled =
    isQnAOptimizelyEnabled && !isKidsFamilyCategory;

  useEffect(() => {
    fetchUserVerificationState();
    const requestedPodcastEpisodeId = params?.podcastEpisodeId || null;

    setIsPublishingForTheFirstTime(path === '/dashboard/episode/new/publish');

    if (requestedPodcastEpisodeId) {
      events.trackMetadataEditPageView();
    } else {
      events.publishEpisodePageViewed();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getDraftButtonText = (episodeState: EpisodeState) => {
    switch (episodeState) {
      case 'isDraft':
        return isPublishingForTheFirstTime
          ? BUTTON_COPY.SAVE_DRAFT
          : BUTTON_COPY.UPDATE_DRAFT;
      case 'isScheduled':
        return BUTTON_COPY.REVERT_DRAFT;
      case 'isPublished':
        return BUTTON_COPY.REVERT_DRAFT;
      default:
        return null;
    }
  };

  const getPublishButtonText = (episodeState: EpisodeState) => {
    const { publishOn: initialPublishOn } = initialValues;
    const publishOn = watch('publishOn');
    const isPublishOnValueUpdated = !moment(
      initialPublishOn || undefined
    ).isSame(publishOn || undefined);
    const isPublishOnValueNeverSet = !publishOn && !initialPublishOn;
    const publishText = [
      !isOptedIntoSpotifyDistribution && isManualDistributionEnabled
        ? BUTTON_COPY.NEXT
        : BUTTON_COPY.PUBLISH,
      BUTTON_COPY.PUBLISHING,
    ];
    const updateText = [BUTTON_COPY.UPDATE_EPISODE, BUTTON_COPY.UPDATING];
    const scheduleText = [BUTTON_COPY.SCHEDULE_EPISODE, BUTTON_COPY.SCHEDULING];
    switch (episodeState) {
      case 'isDraft':
        if (isPublishOnValueNeverSet) return publishText;
        if (isPublishingForTheFirstTime) {
          return publishOn ? scheduleText : publishText;
        }
        return isPublishOnValueUpdated ? scheduleText : publishText;
      case 'isScheduled':
        return publishOn ? updateText : publishText;
      case 'isPublished':
        return publishOn && isPublishOnValueUpdated ? scheduleText : updateText;
      default:
        return updateText;
    }
  };

  const handleClickDismissAudioErrorModal = () => {
    if (dismissAudioError) dismissAudioError();
    setDoPersistError(true);
  };

  const handleShowAudioErrorModal = () => {
    onEpisodeEditorPopupView('add_audio_error');
  };

  const handleShowCropperModal = () => {
    onEpisodeEditorPopupView('image_editor');
  };

  const renderSubHeaderContent = (episodeState: EpisodeState) => {
    const { created, publishOn } = initialValues;

    switch (episodeState) {
      case 'isDraft':
        return !isPublishingForTheFirstTime && !!created ? (
          <Text color="#5f6369" size="lg">
            Created on: {getFormatedTime(created)}
          </Text>
        ) : null;
      case 'isScheduled':
        return publishOn ? (
          <Text color="#5f6369" size="lg">
            Scheduled for: {getFormatedTime(publishOn)}
          </Text>
        ) : null;
      case 'isPublished':
        return publishOn ? (
          <Text color="#5f6369" size="lg">
            Published on: {getFormatedTime(publishOn)}
          </Text>
        ) : null;
      default:
        return null;
    }
  };

  const isUnverified = () => {
    return userVerificationState === UNVERIFIED;
  };

  const handleError = ({ message }: Error) => {
    setGlobalError(message);
  };

  const handleSaveDraft = handleSubmit(
    (nonNormalizedValues: NonNormalizedFormValues) => {
      const values = normalizeFormValues(nonNormalizedValues);
      setSubmitButtonTitle('draft');
      if (isPublishingForTheFirstTime) {
        // if in new publish view we want to fire off the event that has the location as 'episode_edit'
        // otherwise fire off event that has location as 'episode_metadata_edit'
        events.trackSaveAsDraftButtonClicked();
      } else {
        events.trackMetadataEditSaveAsDraftButtonClicked();
      }

      return onSubmit(
        {
          ...values,
          isDraft: true,
          publishOn: null,
        },

        initialValues
      ).catch(handleError);
    }
  );

  const renderDraftButton = (episodeState: EpisodeState | null) => {
    return (
      <DraftButton
        kind="button"
        type="submit"
        onClick={handleSaveDraft}
        isDisabled={isSubmitting || doPersistError}
      >
        {submitButtonTitle === 'draft' && isSubmitting
          ? BUTTON_COPY.SAVING
          : getDraftButtonText(episodeState)}
      </DraftButton>
    );
  };

  const isPodcastSetup = () => {
    const {
      podcastName,
      podcastDescription,
      language,
      itunesCategory,
      podcastImage,
    } = podcastMetadata;
    return (
      podcastName &&
      podcastDescription &&
      language &&
      itunesCategory &&
      podcastImage
    );
  };

  const renderSaveButtonSpotifyExclusive = () => {
    // Only music episodes need review before publishing
    // Partnered M+T shows do not (isMusicAndTalkFastTrackEnabled)
    const needsReview =
      containsMusicSegments && !isMusicAndTalkFastTrackEnabled;
    const idleButtonCopy =
      !isOptedIntoSpotifyDistribution && isManualDistributionEnabled
        ? BUTTON_COPY.NEXT
        : needsReview
        ? BUTTON_COPY.NEEDS_REVIEW
        : BUTTON_COPY.SPOTIFY_EXCLUSIVE_PUBLISH;
    return (
      <Button
        kind="button"
        color="purple"
        onClick={handleSubmit(
          async (nonNormalizedValues: NonNormalizedFormValues) => {
            const values = normalizeFormValues(nonNormalizedValues);
            setSubmitButtonTitle('publish');

            events.publishMenuButtonClicked({ location: 'episode_edit' });

            // new distribution logic
            if (isManualDistributionEnabled) {
              if (!isPodcastSetup() || !isOptedIntoSpotifyDistribution) {
                return setIsPreDistributionModalOpen(true);
              }
            } else {
              // old logic
              try {
                const {
                  externalUrls: { spotify },
                  podcastDistributionStatus,
                } = await AnchorAPI.fetchDistributionData({
                  currentUserId: userId,
                });

                if (
                  podcastDistributionStatus === 'noActionTaken' ||
                  !isPodcastSetup()
                ) {
                  return setIsPreDistributionModalOpen(true);
                }
                if (
                  !spotify ||
                  (spotifyDistributionStatus === 'off' &&
                    podcastDistributionStatus === 'optedout')
                ) {
                  return setIsSpotifyDistributionModalOpen(true);
                }
              } catch (err) {
                // https://github.com/Microsoft/TypeScript/issues/20024
                throw new Error((err as Error).message);
              }
            }

            return onSubmit(
              {
                ...values,
                isDraft: false,
              },
              initialValues
            ).catch(handleError);
          }
        )}
        css={css`
          width: 270px;
          flex: 1;
        `}
      >
        {submitButtonTitle === 'publish' && isSubmitting
          ? BUTTON_COPY.SUBMITTING
          : idleButtonCopy}
      </Button>
    );
  };

  const renderSaveButton = (episodeState: EpisodeState) => {
    const [buttonText, processingButtonText] = getPublishButtonText(
      episodeState
    );

    return (
      <SaveButton
        kind="button"
        color="purple"
        css={css`
          width: 270px;
        `}
        onClick={handleSubmit(
          (nonNormalizedFormValues: NonNormalizedFormValues) => {
            const values = normalizeFormValues(nonNormalizedFormValues);
            if (!episodeAudios.length) return null;
            const unverified = isUnverified();
            setSubmitButtonTitle('publish');
            setIsEmailVerificationModalOpen(unverified);
            setEmailVerificationRequestSent(unverified);
            setIsPublishingForTheFirstTime(!unverified);

            const isBackgroundAudioPresent = episodeAudios.some(
              (audio: EpisodeAudioProps) => {
                const {
                  audioTransformationName,
                  url,
                  derivedFromAudioId,
                } = audio;
                return (
                  url &&
                  audioTransformationName === 'backgroundTrack2' &&
                  Boolean(derivedFromAudioId)
                );
              }
            );
            // only fire publish events if an episode is going from non-published to published
            // aka isDraft === true or it doesn't have a publishOn date already
            if ((!isUnverified() && values.isDraft) || !values.publishOn) {
              events.episodePublished(userId);
              if (isBackgroundAudioPresent) {
                events.episodePublishedWithBackgroundTracks({
                  podcastEpisodeId,
                });
              }
            }

            if (isUnverified()) return null;

            if (isManualDistributionEnabled) {
              if (
                !isPodcastSetup() ||
                (!isOptedIntoSpotifyDistribution &&
                  !isExemptFromDistributionPrompt) ||
                (!isRssFeedEnabled &&
                  hasOnlyPublishedMTEpisodes &&
                  canEnableRss)
              ) {
                setIsPreDistributionModalOpen(true);
                return null;
              }
            }

            return onSubmit(
              {
                ...values,
                isDraft: false,
              },
              initialValues
            ).catch(handleError);
          }
        )}
        isDisabled={
          isSubmitting ||
          doPersistError ||
          !episodeAudios.length ||
          emailVerificationRequestSent
        }
      >
        {submitButtonTitle === 'publish' && isSubmitting
          ? processingButtonText
          : buttonText}
      </SaveButton>
    );
  };

  const handlePublish = handleSubmit(
    (nonNormalizedValues: NonNormalizedFormValues) => {
      const values = normalizeFormValues(nonNormalizedValues);
      setSubmitButtonTitle('publish');
      events.publishMenuButtonClicked({ location: 'episode_edit' });

      return onSubmit(
        {
          ...values,
          isDraft: false,
        },
        initialValues
      ).catch(handleError);
    }
  );

  const getDefaultSubmitType = () => {
    const publishOn = watch('publishOn');
    return !publishOn ? 'draft' : 'publish';
  };

  const defaultSubmitType = getDefaultSubmitType();

  if (!featureFlags) return null;

  return (
    <FormContainer>
      {isUnverified() && (
        <ResendEmailContainer>
          <ResendEmailWarning userId={userId} />
        </ResendEmailContainer>
      )}
      <Form
        method="POST"
        onSubmit={handleSubmit(
          (nonNormalizedValues: NonNormalizedFormValues) => {
            const values = normalizeFormValues(nonNormalizedValues);

            setSubmitButtonTitle(defaultSubmitType);
            events.publishMenuButtonClicked({ location: 'episode_edit' });

            return onSubmit(
              {
                ...values,
                isDraft: defaultSubmitType === 'draft',
              },
              initialValues
            ).catch(handleError);
          }
        )}
      >
        <>
          <MainOptionsSection>
            {isSpotifyExclusive ? (
              <div>
                <PublishMusicHeader>
                  <HeaderContainer>
                    <Header>Submit to Spotify</Header>
                  </HeaderContainer>
                  <DesktopButtonContainer>
                    {renderDraftButton(initialEpisodeState)}
                    {renderSaveButtonSpotifyExclusive()}
                  </DesktopButtonContainer>
                </PublishMusicHeader>
                {containsMusicSegments && (
                  <p
                    css={css`
                      margin-bottom: 24px;
                      font-size: 1.6rem;
                    `}
                  >
                    Since this episode contains songs, it will only be available
                    on Spotify, and needs to be reviewed before it goes live.
                    We’ll let you know as soon as it’s approved. If you schedule
                    this episode for a future date, we’ll review your episode as
                    quickly as possible, but can’t guarantee it will be done
                    before your scheduled publishing date/time.
                  </p>
                )}
              </div>
            ) : (
              <PublishEpisodeHeader>
                <HeaderContainer>
                  <Header>Episode options</Header>
                  <div
                    css={css`
                      margin-top: 8px;
                    `}
                  >
                    {renderSubHeaderContent(initialEpisodeState)}
                  </div>
                </HeaderContainer>
                <DesktopButtonContainer>
                  {renderDraftButton(initialEpisodeState)}
                  {renderSaveButton(initialEpisodeState)}
                </DesktopButtonContainer>
              </PublishEpisodeHeader>
            )}
            {globalError &&
              globalError !== 'public_feed_empty' &&
              globalError !== 'private_feed_empty' &&
              globalError !== EpisodeEditorPublishErrors.MUSIC_NOT_ALLOWED && (
                <ErrorAlert>
                  <span>
                    We’re unable to publish your episode. Revert to draft to
                    make any edits and submit again.
                  </span>
                </ErrorAlert>
              )}
            {globalError === EpisodeEditorPublishErrors.MUSIC_NOT_ALLOWED && (
              <MusicNotAllowedErrorModal
                onDismiss={() => {
                  setGlobalError(null);
                }}
              />
            )}
            <FieldLabel htmlFor="title">
              <Label>Episode title*</Label>
            </FieldLabel>
            <ControlledFieldInput
              name="title"
              type="text"
              showCharacterCount={true}
              maxCharacterLength={200}
              placeholder="What do you want to call this episode?"
              rules={{
                required: 'Required field',
              }}
              cssProp={css`
                margin-bottom: 18px;
              `}
              control={control}
              error={errors.title}
            />

            <ControlledFieldRichTextEditor
              className={className`
                  margin-bottom: 18px;
                `}
              label="Episode description*"
              name="description"
              maxLength={4000}
              placeholder="What else do you want your listeners to know?"
              rules={{
                validate: (value: string) =>
                  (value && value !== '<p><br></p>' && value !== '<p></p>') ||
                  'Required field',
              }}
              control={control}
            />
            <PublishDateContainer>
              <ControlledFieldDatePicker
                name="publishOn"
                label="Publish date:"
                control={control}
              />
              {isPaywallsEnabled && !containsMusicSegments && (
                <FieldToggleContainer>
                  <ControlledFieldToggle
                    id="isPW"
                    name="isPW"
                    label="Subscription only"
                    control={control}
                    onChange={() => {
                      events.episodeSubscriptionToggled({
                        podcastEpisodeId,
                        toggledOn: !getValues('isPW'),
                      });
                    }}
                  />
                  <FieldLabel
                    htmlFor="isPW"
                    css={css`
                      color: #292f36;
                      font-size: 16px;
                      font-weight: 500;
                    `}
                  >
                    Subscription only
                  </FieldLabel>
                </FieldToggleContainer>
              )}
            </PublishDateContainer>
            <MobileButtonContainer>
              {renderDraftButton(initialEpisodeState)}
              {renderSaveButton(initialEpisodeState)}
            </MobileButtonContainer>
          </MainOptionsSection>
          {ENABLE_WAVEFORM_AD_INSERTION && (
            <SectionWrapper>
              <AdInsertionWrapper webEpisodeId={podcastEpisodeId} />
            </SectionWrapper>
          )}
          <SectionWrapper>
            <HorizontalRule marginTop={46} marginBottom={46} />
          </SectionWrapper>
          {podcastEpisodeId && isPollsEnabled && (
            <InteractivePoll episodeId={podcastEpisodeId} userId={userId} />
          )}
          {podcastEpisodeId && isListenerQuestionEnabled && (
            <InteractiveQuestion episodeId={podcastEpisodeId} />
          )}
          <SectionWrapper>
            <CustomizeOptionsHeaderContainer>
              <CustomizeOptionsHeader>
                Customize this episode
              </CustomizeOptionsHeader>
              <Text color="#7f8287" size="md">
                (Optional)
              </Text>
            </CustomizeOptionsHeaderContainer>
            <CustomizeOptionsFormContainer>
              <CustomizeOptionsFieldContainer>
                <ImageUploader
                  name="episodeImage"
                  control={control}
                  uploadOptions={{
                    isEpisode: true,
                    doOverrideSize: true,
                  }}
                  uploadLinkLabel="Upload new episode art"
                  onShowCropper={handleShowCropperModal}
                  screen="episode_edit"
                  clickEventName="change_image_clicked"
                  altText="Episode cover art"
                  isPW={
                    isPaywallsEnabled && !containsMusicSegments && watch('isPW')
                  }
                />
              </CustomizeOptionsFieldContainer>
              <CustomizeOptionsFieldContainer>
                <InlineField>
                  <FieldLabel
                    htmlFor="podcastSeasonNumber"
                    cssProp={InlineLabelStyles}
                  >
                    <Label>Season number</Label>
                  </FieldLabel>
                  <ControlledFieldInput
                    id="podcastSeasonNumber"
                    name="podcastSeasonNumber"
                    control={control}
                    type="number"
                    cssProp={NumberInputStyles}
                    min={0}
                  />
                </InlineField>
                <InlineField>
                  <FieldLabel
                    htmlFor="podcastEpisodeNumber"
                    cssProp={InlineLabelStyles}
                  >
                    <Label>Episode number</Label>
                  </FieldLabel>
                  <ControlledFieldInput
                    id="podcastEpisodeNumber"
                    name="podcastEpisodeNumber"
                    control={control}
                    type="number"
                    cssProp={NumberInputStyles}
                    min={0}
                  />
                </InlineField>
                <ControlledFieldRadioToggle
                  cssProp={css`
                    margin-bottom: 30px;
                    max-width: 369px;
                  `}
                  label={<Label>Episode type</Label>}
                  name="podcastEpisodeType"
                  control={control}
                  options={[
                    { label: 'Full', value: 'full' },
                    { label: 'Trailer', value: 'trailer' },
                    { label: 'Bonus', value: 'bonus' },
                  ]}
                />
                <ControlledFieldRadioToggle
                  cssProp={css`
                    max-width: 246px;
                  `}
                  label={<Label>Content</Label>}
                  name="podcastEpisodeIsExplicit"
                  control={control}
                  options={[
                    { label: 'Clean', value: 'false' },
                    { label: 'Explicit', value: 'true' },
                  ]}
                />
              </CustomizeOptionsFieldContainer>
            </CustomizeOptionsFormContainer>
          </SectionWrapper>
        </>
      </Form>
      <Modal
        show={addAudioError && addAudioError.isModal}
        onHide={handleClickDismissAudioErrorModal}
        onEntered={handleShowAudioErrorModal}
      >
        {!!addAudioError && (
          <Modal.Body key="errorPrompt" className="text-center">
            <h2>{addAudioError.title}</h2>
            <p>{addAudioError.subTitle}</p>
          </Modal.Body>
        )}
        <Modal.Footer>
          <ModalButton
            color="purple"
            onClick={handleClickDismissAudioErrorModal}
            kind="link"
            href="/dashboard/episode/new/upload"
          >
            Try uploading again
          </ModalButton>
          <ModalButton onClick={handleClickDismissAudioErrorModal}>
            Cancel
          </ModalButton>
        </Modal.Footer>
      </Modal>
      {isEmailVerificationModalOpen && (
        <EmailVerificationModal
          onClickClose={() => {
            setIsEmailVerificationModalOpen(false);
            handleSaveDraft();
          }}
          type="publish"
        />
      )}
      {(globalError === 'public_feed_empty' ||
        globalError === 'private_feed_empty') && (
        <UnpublishEpisodeErrorModal
          action="unpublish"
          onClose={() => {
            setGlobalError(null);
          }}
        />
      )}
      {isSpotifyDistributionModalOpen && (
        <DistributeToSpotifyModal
          onClickClose={(e: React.MouseEvent<HTMLButtonElement>) => {
            setIsSpotifyDistributionModalOpen(false);
            handleSaveDraft(e);
          }}
          onSubmit={async e => {
            try {
              await AnchorAPI.requestSpotifyOnlyDistribution({
                stationId,
              });
              // after distributing to Spotify we can submit the episode
              // call the form's submit function from the modal
              handlePublish(e);
            } catch (err) {
              throw new Error((err as Error).message);
            }
          }}
          podcastImage={podcastMetadata.podcastImage}
        />
      )}
      {isNoTaxiDistributionErrorModalOpen && (
        <NoTaxiDistributionErrorModal
          onClickClose={handleSubmit((values: FormValues) => {
            setIsNoTaxiDistributionErrorModalOpen(false);
            return onSubmit(
              {
                ...values,
                isDraft: false,
              },
              initialValues
            );
          })}
        />
      )}
      {isPreDistributionModalOpen && (
        <PreDistributionModal
          containsMusicSegments={containsMusicSegments}
          onFinishAcceptDistribution={handlePublish} // legacy
          onHideModal={() => setIsPreDistributionModalOpen(false)}
          onMTAcceptSuccess={handleSubmit(
            (nonNormalizedValues: NonNormalizedFormValues) => {
              setIsPreDistributionModalOpen(false);
              // in the case where a legacy account has prev opted out of the old distribution flow
              // we need to check if they have a taxi feed, if not prompt them to contact
              // support so that we can resubmit their m+t episode
              if (
                podcastStatus === 'optedout' &&
                distributionEligibilityForPaywalls === 'no_taxi_distribution'
              ) {
                return setIsNoTaxiDistributionErrorModalOpen(true);
              }
              return onSubmit(
                {
                  ...normalizeFormValues(nonNormalizedValues),
                  isDraft: false,
                },
                initialValues
              ).catch(handleError);
            }
          )}
          onSpotifyDistributionAcceptSuccess={handleSubmit(
            (nonNormalizedFormValues: NonNormalizedFormValues) => {
              return onSubmit(
                {
                  ...normalizeFormValues(nonNormalizedFormValues),
                  isDraft: false,
                },
                initialValues,
                {
                  optedIntoDistribution: true,
                  isOpenToolTip: true,
                  delayRedirect: 500,
                }
              ).catch(handleError);
            }
          )}
          onRSSAcceptClick={() => {
            setIsPreDistributionModalOpen(false);
            handleSubmit((nonNormalizedFormValues: NonNormalizedFormValues) => {
              return onSubmit(
                {
                  ...normalizeFormValues(nonNormalizedFormValues),
                  isDraft: false,
                },
                initialValues,
                { optedIntoDistribution: true, isOpenToolTip: false }
              ).catch(handleError);
            });
          }}
        />
      )}
    </FormContainer>
  );
};

function getIsKidsFamily(metadata?: Metadata) {
  if (!metadata) return false;
  return metadata.itunesCategory?.includes('Kids & Family');
}

export const EpisodeEditorPublish = (props: EpisodeEditorPublishProps) => {
  const { data: podcastMetadata, status } = useFetchPodcastMetadata();

  if (status === 'loading' || !podcastMetadata) {
    return (
      <SpinnerContainer>
        <Spinner color="gray" />
      </SpinnerContainer>
    );
  }

  return (
    <EpisodeEditorPublishHelper {...props} podcastMetadata={podcastMetadata!} />
  );
};
