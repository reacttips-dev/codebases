/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import React, { useCallback, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import serverRenderingUtils from 'helpers/serverRenderingUtils';
import {
  ControlledFieldInput,
  FieldLabel,
  ControlledFieldRadioToggle,
  ControlledFieldTextArea,
  ControlledFieldToggle,
  FieldInput,
  ControlledFieldSelect,
  FieldSelect,
  ControlledFieldHex,
} from 'components/Field';
import { OptGroupType, OptionType } from 'components/FieldSelect/types';
import { WarningIcon, WarningMessage } from 'components/WarningMessage';
import { useUnsavedChangesWarning } from 'contexts/UnsavedChangesWarning';
import { useCurrentUserCtx } from 'contexts/CurrentUser';
import { AnchorAPI } from 'modules/AnchorAPI';
import { SocialUrlBody } from 'modules/AnchorAPI/updateSocialUrls';
import { getIsValidUrl } from 'modules/Url';
import { Button } from 'shared/Button/NewButton';
import { Tooltip, TOOLTIP_INFO_ID } from 'shared/Tooltip';
import { Metadata } from 'types/Metadata';
import { useFeatureFlagsCtx } from 'contexts/FeatureFlags';
import { getIsEPEnabled } from 'modules/FeatureFlags';
import { PodcastCategory } from 'client/modules/AnchorAPI/fetchPodcastCategories';
import { isValidEmail } from '../../../../user';
import { LabelHeading } from '../../styles';
import { DeleteAccount } from '../DeleteAccount';
import { PendingEmailVerification } from '../PendingEmailVerification';
import { PodcastCoverArt } from '../PodcastCoverArt';
import { SocialConnection } from '../SocialConnection';
import { ERROR_MESSAGES } from './constants';
import {
  ExplicitFieldCss,
  ExplicitFieldWrapper,
  FieldDescription,
  FieldSelectWrapper,
  FieldToggleContainer,
  FieldWrapper,
  Form,
  Heading,
  HeadingContainer,
  HorizontalRule,
  InlineLabelHeading,
  MobileSaveButtonCss,
  MobileSaveContainer,
  MobileSaveErrorText,
  ProfileHeaderColorFieldCss,
  SectionHeading,
  VanitySlugAndColorContainer,
  VanitySlugFieldContainer,
  VanitySlugLabelHeadingCss,
  WhiteFormSection,
} from './styles';
import { NavigatedFromParam } from '../../types';

const UNSAVED_CHANGES_KEY = 'settingsForm';
const REQUIRED_TEXT = "This can't be left empty.";

type SubmissionData = Metadata & SocialUrlBody;
// This input can only accept string values, while we want to submit a boolean
type FormData = Omit<SubmissionData, 'isExplicit'> & { isExplicit?: string };

type SubCategory = {
  value: string;
  display: string;
};

type SettingsFormProps = {
  userId: number;
  userEmailValue: string;
  hasEpisodes: boolean;
  navigatedFrom: NavigatedFromParam;
  onSubmit: (data: SubmissionData) => Promise<SubmissionData>;
  initialValues: SubmissionData;
};

export function SettingsForm({
  userId,
  onSubmit,
  userEmailValue,
  hasEpisodes,
  initialValues: {
    podcastImage,
    podcastImageFull,
    isExplicit,
    ...defaultValues
  },
  navigatedFrom,
}: SettingsFormProps) {
  const formData: FormData = {
    ...defaultValues,
    isExplicit: isExplicit?.toString() || 'false',
  };
  const {
    formState: { isDirty, isSubmitting, errors, isSubmitSuccessful },
    handleSubmit,
    register,
    setFocus,
    setError,
    setValue,
    control,
    reset,
    watch,
  } = useForm({
    mode: 'onSubmit',
    defaultValues: formData,
    shouldFocusError: true,
  });

  const errorLength = !!Object.keys(errors).length;

  // For when your inputs are valid, but the API has returned an error.
  // This is put in state because it shouldn't prevent you from submitting
  // the form, since you won't necessairly have to change an input to resubmit.
  const [formError, setFormError] = useState(false);

  const [buttonCopy, setButtonCopy] = useState('Save');

  useEffect(() => {
    if (isSubmitting && !errorLength && !formError) {
      setButtonCopy('Saving...');
    } else if (isSubmitSuccessful && !isDirty) {
      setButtonCopy('Saved!');
      setTimeout(() => setButtonCopy('Save'), 2000);
    } else {
      setButtonCopy('Save');
    }
  }, [isSubmitting, errorLength, formError, isSubmitSuccessful, isDirty]);

  const {
    state: { webStationId: stationId },
  } = useCurrentUserCtx();

  const [podcastCategories, setPodcastCategories] = useState<
    (OptGroupType | OptionType)[]
  >([]);

  const {
    resetUnsavedChanges,
    addUnsavedKey,
    removeUnsavedKey,
  } = useUnsavedChangesWarning();
  const {
    state: { featureFlags },
  } = useFeatureFlagsCtx();

  const isEPEnabled = getIsEPEnabled(featureFlags);

  useEffect(() => {
    getPodcastCategories()
      .then(categories => setPodcastCategories(categories))
      .catch(err => {
        throw new Error(err.message);
      });
  }, []);

  const [hasFetchedSocialUrls, setHasFetchedSocialUrls] = useState(false);

  useEffect(() => {
    if (stationId) {
      AnchorAPI.fetchSocialUrls({ stationId }).then(({ userSocialUrls }) => {
        userSocialUrls.forEach(({ type, username }) =>
          setValue(`${type}SocialUsername`, username)
        );
        setHasFetchedSocialUrls(true);
      });
    }
  }, [setValue, stationId]);

  // Focus Podcast description field to catch user attention when Subscribers link is added
  useEffect(() => {
    if (navigatedFrom === 'subscribersLinkCTA') {
      setFocus('podcastDescription');
    }
  }, [navigatedFrom, setFocus]);

  // Reset unsaved changes state if the component unmounts
  useEffect(() => () => resetUnsavedChanges(), [resetUnsavedChanges]);

  const handleUnsavedChanges = useCallback(() => {
    if (isDirty) {
      addUnsavedKey(UNSAVED_CHANGES_KEY);
    } else {
      removeUnsavedKey(UNSAVED_CHANGES_KEY);
    }
  }, [addUnsavedKey, removeUnsavedKey, isDirty]);

  const hasChosenToHideEmail = (email: string) =>
    email.trim().endsWith('@privaterelay.appleid.com');

  useEffect(() => {
    handleUnsavedChanges();
  }, [handleUnsavedChanges]);

  const onValid = (data: FormData) => {
    setFormError(false);
    return onSubmit({ ...data, isExplicit: data.isExplicit === 'true' })
      .then(values => {
        reset({
          ...values,
          isExplicit: values.isExplicit?.toString() || 'false',
        });
      })
      .catch(({ message }) => {
        switch (message) {
          case ERROR_MESSAGES.EMAIL_TAKEN:
            setError('userEmail', {
              message:
                'We found an existing account with this email. Try another!',
            });
            break;
          case ERROR_MESSAGES.VANITY_SLUG_TAKEN:
            setError('vanitySlug', {
              message: 'This Anchor URL is not available.',
            });
            break;
          case ERROR_MESSAGES.PODCAST_NAME_NOT_ALLOWED:
            setError('podcastName', {
              message: ERROR_MESSAGES.PODCAST_NAME_NOT_ALLOWED,
            });
            break;
          default:
            break;
        }
        setFormError(true);
      });
  };

  return (
    <Form method="POST" onSubmit={handleSubmit(onValid)} noValidate={true}>
      {(formError || errorLength) && (
        <WarningMessage
          css={css`
            margin-bottom: 60px;
            @media (max-width: 600px) {
              display: none;
            }
          `}
        >
          <WarningIcon>!</WarningIcon>Oops, looks like something went wrong. We
          were unable to save. Please try again.
        </WarningMessage>
      )}
      <section>
        <HeadingContainer>
          <Heading>Podcast settings</Heading>
          <Button
            css={css`
              width: 210px;
              @media (max-width: 600px) {
                display: none;
              }
            `}
            color="purple"
            type="submit"
            height={40}
            isDisabled={isSubmitting}
            dataCy="settingsSaveButtonDesktop"
          >
            {buttonCopy}
          </Button>
        </HeadingContainer>
        <div>
          <SectionHeading>About your podcast</SectionHeading>
          <WhiteFormSection>
            <div>
              <FieldLabel htmlFor="podcastName">
                <LabelHeading>Podcast name</LabelHeading>
              </FieldLabel>
              <ControlledFieldTextArea
                name="podcastName"
                id="podcastName"
                placeholder="Your podcast name is how people will find your podcast, both on Anchor and on other platforms."
                maxLength={100}
                rows={2}
                cssProp={css`
                  textarea {
                    resize: none;
                  }
                `}
                control={control}
                error={
                  errors.podcastName?.message ===
                  ERROR_MESSAGES.PODCAST_NAME_NOT_ALLOWED
                    ? {
                        message: (
                          <React.Fragment>
                            {/* eslint-disable-next-line react/no-unescaped-entities */}
                            You're a VIP! Please reach out to our{' '}
                            <a
                              href="https://help.anchor.fm/hc/en-us/requests/new"
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              support team
                            </a>{' '}
                            to finish your setup.
                          </React.Fragment>
                        ),
                      }
                    : errors.podcastName
                }
              />
            </div>
            <div>
              <FieldLabel htmlFor="podcastDescription">
                <LabelHeading>Podcast description</LabelHeading>
              </FieldLabel>
              <ControlledFieldTextArea
                name="podcastDescription"
                id="podcastDescription"
                placeholder="Tell people what your podcast is about. You can always change this later."
                maxLength={600}
                rows={5}
                cssProp={css`
                  textarea {
                    resize: none;
                  }
                `}
                control={control}
              />
            </div>
            <PodcastCoverArt
              podcastImage={podcastImage}
              podcastImageFull={podcastImageFull}
            />
          </WhiteFormSection>
          <FieldSelectWrapper>
            <FieldLabel htmlFor="itunesCategory">
              <LabelHeading>Podcast category</LabelHeading>
            </FieldLabel>
            <ControlledFieldSelect
              name="itunesCategory"
              id="itunesCategory"
              options={podcastCategories}
              placeholder="Choose one..."
              control={control}
            />
          </FieldSelectWrapper>
          <FieldSelectWrapper
            css={css`
              margin-bottom: 56px;
            `}
          >
            <FieldLabel htmlFor="language">
              <LabelHeading>Podcast language</LabelHeading>
            </FieldLabel>
            <FieldSelect
              {...register('language')}
              id="language"
              options={serverRenderingUtils.LANGUAGES}
              placeholder="Choose one..."
            />
          </FieldSelectWrapper>
        </div>
        <div>
          <SectionHeading>Advanced options</SectionHeading>
          <div
            css={css`
              @media (max-width: 600px) {
                padding: 0 24px;
              }
            `}
          >
            <ExplicitFieldWrapper>
              <ControlledFieldRadioToggle
                cssProp={ExplicitFieldCss}
                label="Content"
                name="isExplicit"
                id="isExplicit"
                options={[
                  { label: 'Clean', value: 'false' },
                  { label: 'Explicit', value: 'true' },
                ]}
                control={control}
              />
            </ExplicitFieldWrapper>
          </div>
        </div>
        {!isEPEnabled && (
          <div>
            <FieldToggleContainer>
              <ControlledFieldToggle
                id="hasAnchorBranding"
                name="hasAnchorBranding"
                label="Show Anchor logo on cover art"
                cssProp={css`
                  margin-right: 20px;
                `}
                control={control}
              />
              <FieldLabel htmlFor="hasAnchorBranding">
                <InlineLabelHeading>
                  Show Anchor logo on cover art
                </InlineLabelHeading>
              </FieldLabel>
            </FieldToggleContainer>
            <FieldToggleContainer>
              <ControlledFieldToggle
                id="isPublicCallinShownOnWeb"
                name="isPublicCallinShownOnWeb"
                label="Show Voice Messages button on your Anchor profile"
                cssProp={css`
                  margin-right: 20px;
                `}
                control={control}
              />
              <FieldLabel htmlFor="isPublicCallinShownOnWeb">
                <InlineLabelHeading>
                  Show Voice Messages button on your Anchor profile
                </InlineLabelHeading>
              </FieldLabel>
            </FieldToggleContainer>
            <FieldToggleContainer>
              <ControlledFieldToggle
                id="isPublicCallinShownFromRSS"
                name="isPublicCallinShownFromRSS"
                label="Include Voice Messages link in your episode descriptions"
                cssProp={css`
                  margin-right: 20px;
                `}
                control={control}
              />
              <FieldLabel htmlFor="isPublicCallinShownFromRSS">
                <InlineLabelHeading>
                  Include Voice Messages link in your episode descriptions
                </InlineLabelHeading>
              </FieldLabel>
            </FieldToggleContainer>
          </div>
        )}
      </section>
      <HorizontalRule />
      <section>
        <HeadingContainer>
          <Heading>Account settings</Heading>
        </HeadingContainer>
        <div>
          <SectionHeading>About you</SectionHeading>
          <WhiteFormSection>
            <FieldWrapper>
              <FieldLabel htmlFor="authorName">
                <LabelHeading>Display name</LabelHeading>
              </FieldLabel>
              <ControlledFieldInput
                name="authorName"
                id="authorName"
                type="text"
                placeholder="Carrie Bradshaw"
                maxCharacterLength={80}
                showCharacterCount={true}
                rules={{
                  required: REQUIRED_TEXT,
                  minLength: {
                    value: 2,
                    message: 'Name must have at least 2 characters.',
                  },
                }}
                control={control}
              />
            </FieldWrapper>
            <FieldWrapper>
              <div
                css={css`
                  display: flex;
                  justify-content: space-between;
                `}
              >
                <FieldLabel htmlFor="userEmail">
                  <LabelHeading>Your email</LabelHeading>
                </FieldLabel>
                <PendingEmailVerification userId={userId} />
              </div>
              <FieldInput
                {...register('userEmail', {
                  required: REQUIRED_TEXT,
                  validate: v =>
                    isValidEmail(v) || 'This must be a valid email address.',
                })}
                error={errors.userEmail}
                id="userEmail"
                type="email"
                placeholder="carriebradshaw@mail.com"
                disabled={isEPEnabled}
              />
              {userEmailValue && hasChosenToHideEmail(userEmailValue) && (
                <FieldDescription>
                  This forwarding email is provided by Apple. Changing your
                  email address here will still allow you to Sign in with Apple.{' '}
                </FieldDescription>
              )}
            </FieldWrapper>
            <div>
              <FieldLabel htmlFor="userBioUrl">
                <LabelHeading>Your website</LabelHeading>
              </FieldLabel>
              <FieldInput
                {...register('userBioUrl', {
                  validate: v => {
                    if (!v) {
                      // Do not validate the input if null or empty
                      return true;
                    }

                    return getIsValidUrl(v) || 'This must be a valid URL.';
                  },
                })}
                error={errors.userBioUrl}
                name="userBioUrl"
                id="userBioUrl"
                placeholder="https://mywebsite.com"
                type="url"
              />
            </div>
          </WhiteFormSection>
          {!isEPEnabled && (
            <VanitySlugAndColorContainer>
              <VanitySlugFieldContainer>
                <div
                  css={css`
                    display: flex;
                    align-items: baseline;
                  `}
                >
                  <FieldLabel
                    htmlFor="vanitySlug"
                    css={
                      !hasEpisodes
                        ? css`
                            margin-right: 6px;
                          `
                        : ''
                    }
                  >
                    <LabelHeading id="vanitySlug-label">
                      Your custom URL
                    </LabelHeading>
                  </FieldLabel>
                  {!hasEpisodes && (
                    <Tooltip text="Your URL is active once you publish your first episode" />
                  )}
                </div>
                <div
                  css={css`
                    display: flex;
                    align-items: flex-start;
                  `}
                >
                  <LabelHeading css={VanitySlugLabelHeadingCss}>
                    anchor.fm/
                  </LabelHeading>
                  <ControlledFieldInput
                    cssProp={css`
                      width: 100%;
                      max-width: 300px;
                    `}
                    name="vanitySlug"
                    id="vanitySlug"
                    maxCharacterLength={25}
                    showCharacterCount={true}
                    disabled={!hasEpisodes}
                    aria-describedby={!hasEpisodes ? TOOLTIP_INFO_ID : ''}
                    type="text"
                    rules={{
                      required: REQUIRED_TEXT,
                      minLength: {
                        value: 2,
                        message: 'URL must have at least 2 characters.',
                      },
                      pattern: {
                        value: /^[a-zA-Z0-9_-]*$/,
                        message: "URL can't contain special characters.",
                      },
                    }}
                    control={control}
                  />
                </div>
              </VanitySlugFieldContainer>
              <div
                css={css`
                  flex: 1;
                `}
              >
                <FieldLabel htmlFor="profileHeaderColor">
                  <LabelHeading>Profile color (hex code)</LabelHeading>
                </FieldLabel>
                <ControlledFieldHex
                  cssProp={ProfileHeaderColorFieldCss}
                  name="profileHeaderColor"
                  id="profileHeaderColor"
                  control={control}
                />
              </div>
            </VanitySlugAndColorContainer>
          )}
        </div>
        {hasFetchedSocialUrls && !isEPEnabled && (
          <div
            css={css`
              max-width: 690px;
              width: 100%;
            `}
          >
            <SectionHeading
              css={css`
                margin-bottom: 32px;
                @media (max-width: 600px) {
                  margin-bottom: 36px;
                }
              `}
            >
              Connections
            </SectionHeading>
            <div
              css={css`
                @media (max-width: 600px) {
                  padding: 0 24px;
                }
              `}
            >
              <SocialConnection
                provider="twitter"
                watch={watch}
                register={register}
              />
              <SocialConnection
                provider="instagram"
                watch={watch}
                register={register}
              />
              <SocialConnection
                provider="youtube"
                watch={watch}
                register={register}
              />
              <SocialConnection
                provider="facebook"
                watch={watch}
                register={register}
              />
            </div>
          </div>
        )}
      </section>
      <HorizontalRule />
      {!isEPEnabled && <DeleteAccount />}
      <MobileSaveContainer>
        {errorLength && (
          <MobileSaveErrorText>
            Something went wrong. Please try saving again.
          </MobileSaveErrorText>
        )}
        <Button
          css={MobileSaveButtonCss}
          color="purple"
          type="submit"
          height={40}
          isDisabled={isSubmitting}
          dataCy="settingsSaveButtonMobile"
        >
          {buttonCopy}
        </Button>
      </MobileSaveContainer>
    </Form>
  );
}

function getOptions(options: SubCategory[]) {
  return options.map(({ display, value }) => ({
    label: display,
    value,
  }));
}

export function mapPodcastCategories(
  podcastCategoryOptions: PodcastCategory[]
) {
  return podcastCategoryOptions.map(category => {
    const { value, display, subCategories } = category;
    if (subCategories === undefined) {
      return {
        label: display,
        value,
      };
    }
    const subOptions = getOptions(subCategories);
    return {
      label: display,
      value,
      subOptions,
    };
  });
}

async function getPodcastCategories() {
  try {
    const categories = await AnchorAPI.fetchPodcastCategories();
    const { podcastCategoryOptions } = categories;
    return mapPodcastCategories(podcastCategoryOptions);
  } catch (err) {
    throw new Error(err.message);
  }
}
