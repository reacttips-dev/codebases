import React, { useContext, useEffect, useRef, useState } from 'react';
import { Link as ReactRouterDOMLink } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { css } from 'emotion';
import styled from '@emotion/styled';
import { css as cssProp } from '@emotion/core';
import moment from 'moment';
import { OptimizelyContext } from '@optimizely/react-sdk';

import { AnchorAPI } from 'modules/AnchorAPI';
import { ContactabilityStatus } from 'modules/AnchorAPI/contactability/fetchContactabilityLocationRule';
import { dayOptions, monthOptions, yearOptions } from 'modules/Date/constants';
import { debounce } from 'modules/debounce';
import { Button } from 'shared/Button/NewButton';
import { LinkText } from 'shared/Link';
import { Text } from 'shared/Text';
import Box from 'shared/Box';
import { ControlledCaptcha } from 'components/Captcha';
import { FieldCheckbox, FieldInput } from 'components/Field';
import { FieldSelect } from 'components/FieldSelect';
import { FormErrorAlert } from 'components/FormErrorAlert';
import events from 'components/SignupPageContainer/events';
import Spinner from 'components/Spinner';
import { fetchIsVanitySlugAvailable } from 'client/onboarding';
import { useOptimizelyFeature } from 'hooks/useOptimizelyFeature';
import {
  BIRTHDATE_ERROR_MESSAGE,
  EXISTING_ACCOUNT_ERROR_MESSAGE,
  EXISTING_EMAIL_ERROR_MESSAGE,
  isValidEmail,
  isValidPassword,
  PASSWORD_ERROR_MESSAGE,
} from 'client/user';

const FieldsContainer = styled.div`
  max-width: 410px;
  width: 100%;
  margin: auto;
  overflow: hidden;
`;

const FieldWrapper = styled.div`
  margin-bottom: 10px;
`;

const DobWrapper = styled.div`
  margin: 15px 0 10px;

  > label {
    margin-bottom: 8px;
  }
`;

const FlexFields = styled.div`
  display: flex;

  > * {
    flex: 1;
    &:first-of-type {
      flex: 1.5;
    }
    &:not(:first-of-type) {
      margin-left: 10px;
    }
  }
`;

const DateSelect = styled(FieldSelect)`
  font-size: 1.6rem;
`;

const CatpchaWrapper = styled.div`
  margin-top: 24px;
`;

const ButtonWrapper = styled.div`
  margin: 32px auto 14px;
  max-width: 300px;
  width: 100%;
`;

const Terms = styled.div`
  margin-bottom: 21px;
  font-size: 11px;
  font-weight: normal;
  font-style: normal;
  font-stretch: normal;
  line-height: normal;
  letter-spacing: normal;
  text-align: center;
  color: #7f8287;
`;

type Data = {
  name: string;
  email: string;
  birthdate?: string;
  password: string;
  hasOptedIntoContactability: boolean;
  captcharesponse: string;
  vanitySlug?: string;
};

export type SignupFormProps = {
  feedUrl?: string;
  onSubmit: (data: Data) => Promise<void>;
  invalid: boolean;
  onClickRequestResetPassword: () => void;
  isLoading?: boolean;
  isV3Captcha?: boolean;
  loginUrl?: string;
  isImporting: boolean;
  isWordPressReferral: boolean;
  vanitySlug?: string;
  formStep: number;
  setFormStep: React.Dispatch<React.SetStateAction<number>>;
};

export type AgeGatingVars = {
  oneScreen?: boolean;
  multiScreen?: boolean;
};

export const SignupForm = ({
  feedUrl = '',
  onSubmit,
  onClickRequestResetPassword,
  isLoading = false,
  isV3Captcha = false,
  loginUrl,
  isImporting,
  isWordPressReferral,
  vanitySlug,
  formStep,
  setFormStep,
}: SignupFormProps) => {
  const { optimizely } = useContext(OptimizelyContext);
  const [isAgeGatingEnabled, ageGatingVars] = useOptimizelyFeature(
    'age_gating'
  );
  const { oneScreen, multiScreen } = ageGatingVars as AgeGatingVars;
  const isAgeGatingOneScreen = isAgeGatingEnabled && oneScreen;
  const isAgeGatingMultiScreen = isAgeGatingEnabled && multiScreen;
  const isAgeGatingStep1 = isAgeGatingMultiScreen && formStep === 1;
  const isAgeGatingStep2 = isAgeGatingMultiScreen && formStep === 2;
  const shouldSubmitDob = isAgeGatingOneScreen || isAgeGatingMultiScreen;
  const {
    handleSubmit,
    formState: { errors, isSubmitting, dirtyFields },
    register,
    control,
    getValues,
    setError,
    setFocus,
    setValue,
    trigger,
  } = useForm({
    mode: 'onBlur',
    defaultValues: {
      vanitySlug,
      name: '',
      email: '',
      password: '',
      dobMonth: '',
      dobDay: '',
      dobYear: '',
      captcharesponse: '',
      hasOptedIntoContactability: false,
    },
    shouldFocusError: true,
  });

  const [showContactCheckbox, setShowContactCheckbox] = useState(false);
  const [errorMessage, setErrorMessage] = useState<null | string>(null);
  const { current: debouncedOnVanityChange } = useRef(
    debounce(async () => {
      await trigger('vanitySlug');
    }, 500)
  );

  // If we receive new vanity slug prop, use it. This is for when ImportCreateAccount
  // fetches vanitySlug for the first time and asynchronously passes the prop here.
  useEffect(() => {
    setValue('vanitySlug', vanitySlug);
  }, [setValue, vanitySlug]);

  const [isVanityLoading, setVanityLoading] = useState(false);

  /**
   * Sets the `hasOptedIntoContactability` checkbox value
   * Hides/renders the checkbox based on user location contactability rules
   */
  useEffect(() => {
    AnchorAPI.fetchContactabilityLocationRule()
      .then(({ countryRule }) => {
        const defaultCheckboxValue =
          countryRule === ContactabilityStatus.OPTED_IN ||
          countryRule === ContactabilityStatus.OPTED_IN_SECONDARY_RESPONSE ||
          countryRule === ContactabilityStatus.NEEDS_RESPONSE_OPT_IN;
        setValue('hasOptedIntoContactability', defaultCheckboxValue);
        if (countryRule && countryRule !== ContactabilityStatus.OPTED_IN) {
          setShowContactCheckbox(true);
        }
      })
      .catch(err => {
        throw new Error(err.message);
      });
  }, [setValue]);

  const handleClickNext = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const isFormValid = await trigger();
    if (isFormValid) {
      setErrorMessage(null);
      setFormStep(2);
      setFocus('dobMonth');
    }
  };

  const trackClickSignUp = () => {
    events.signUpRegisterButtonClicked();
    optimizely?.track('sign_up_register_button_clicked_optimizely');
  };

  const dobError = errors.dobDay || errors.dobMonth || errors.dobYear;
  const isSubmitDisabled = isLoading || isSubmitting;

  const finalLoginUrl =
    loginUrl ||
    `/login${feedUrl ? `?feedUrl=${encodeURIComponent(feedUrl)}` : ''}`;

  const vanityRegistration = vanitySlug
    ? register('vanitySlug', {
        validate: {
          checkUnique: async data => {
            setVanityLoading(true);
            const result = await fetchIsVanitySlugAvailable(data);
            setVanityLoading(false);
            return result;
          },
        },
      })
    : undefined;

  const renderDobInputs = () => (
    <>
      <FlexFields>
        <DateSelect
          {...register('dobMonth', {
            required: true,
          })}
          id="dobMonth"
          options={monthOptions}
          error={errors.dobMonth}
          placeholder="Month"
          aria-label="Birthday month"
          required
        />
        <DateSelect
          {...register('dobDay', {
            required: true,
            validate: day => {
              const month = getValues('dobMonth');
              const year = getValues('dobYear');
              if (!month || !year) return true;
              // Ensure date is valid (e.g. not Feb 31)
              return (
                moment(`${year}-${month}-${day}`).isValid() ||
                'Date is not possible'
              );
            },
          })}
          id="dobDay"
          options={dayOptions}
          error={errors.dobDay}
          placeholder="Day"
          aria-label="Birthday date"
          required
        />
        <DateSelect
          {...register('dobYear', {
            required: true,
          })}
          id="dobYear"
          options={yearOptions}
          error={errors.dobYear}
          placeholder="Year"
          aria-label="Birthday year"
          required
        />
      </FlexFields>
      {dobError && (
        <div
          className={css`
            color: #d0021b;
            font-size: 1.4rem;
            line-height: 1.8rem;
            margin-top: 4px;
          `}
          id="dob-error"
        >
          {errors.dobDay?.message || 'Date of birth is required'}
        </div>
      )}
    </>
  );

  return (
    <form
      onSubmit={
        !isSubmitDisabled
          ? handleSubmit(({ dobDay, dobMonth, dobYear, ...rest }) => {
              const data = shouldSubmitDob
                ? {
                    birthdate: `${dobYear}-${dobMonth}-${dobDay}`,
                    ...rest,
                  }
                : rest;
              // Clear any exisiting error message
              setErrorMessage(null);
              // Make sure to resolve promise so isSubmitting is accurate
              return onSubmit(data).catch(({ message }) => {
                // If existing email or account error, go back to step 1
                if (
                  isAgeGatingMultiScreen &&
                  [
                    EXISTING_EMAIL_ERROR_MESSAGE,
                    EXISTING_ACCOUNT_ERROR_MESSAGE,
                  ].includes(message)
                ) {
                  setFormStep(1);
                  setValue('captcharesponse', '');
                  setError('email', { type: 'focus' }, { shouldFocus: true });
                }
                return setErrorMessage(message);
              });
            })
          : () => {}
      }
      id="SignupForm"
      method="POST"
      noValidate={true}
    >
      {isAgeGatingStep2 ? (
        <FieldsContainer>{renderDobInputs()}</FieldsContainer>
      ) : (
        <FieldsContainer>
          {vanityRegistration && (
            <>
              <div
                className={css`
                  display: flex;
                  align-items: center;
                `}
              >
                <p>
                  <strong>anchor.fm/</strong>
                </p>
                <FieldInput
                  {...vanityRegistration}
                  name="vanitySlug"
                  type="text"
                  onChange={e => {
                    vanityRegistration.onChange(e);
                    setVanityLoading(true);
                    // Trigger the async validation
                    debouncedOnVanityChange();
                  }}
                  cssProp={cssProp`
                    flex-grow: 1;
                  `}
                />
              </div>
              <div
                className={css`
                  display: flex;
                  align-items: center;
                  width: 100%;
                  justify-content: center;
                  margin: 4px 0 6px 0;
                `}
              >
                {isVanityLoading ? (
                  <Spinner color="gray" size={19} />
                ) : !dirtyFields.vanitySlug ? (
                  <p
                    className={css`
                      color: #5f6369;
                      opacity: 0.5;
                      text-align: right;
                      width: 100%;
                    `}
                  >
                    Tip: you can customize this URL.
                  </p>
                ) : !errors.vanitySlug ? (
                  <p
                    className={css`
                      color: #27de56;
                    `}
                  >
                    Looks good!
                  </p>
                ) : (
                  <p
                    className={css`
                      color: #ff6663;
                    `}
                  >
                    Sorry, that URL is unavailable.
                  </p>
                )}
              </div>
            </>
          )}
          <FieldWrapper>
            <FieldInput
              {...register('name', {
                required: 'Name is required',
              })}
              error={errors.name}
              placeholder="Full Name"
              type="text"
              autoComplete="name"
              aria-label="name"
              autoFocus={true}
            />
          </FieldWrapper>
          <FieldWrapper>
            <FieldInput
              {...register('email', {
                required: 'Email is required',
                validate: email => isValidEmail(email) || 'Email is invalid',
              })}
              error={errors.email}
              placeholder="Email"
              type="email"
              autoComplete="email"
              aria-label="email"
            />
          </FieldWrapper>
          <FieldWrapper>
            <FieldInput
              {...register('password', {
                required: 'Password is required',
                validate: {
                  minLength: pw =>
                    pw.length >= 7 || 'Passwords must be 7 characters or more',
                  valid: pw => isValidPassword(pw) || PASSWORD_ERROR_MESSAGE,
                },
              })}
              error={errors.password}
              placeholder="Password"
              type="password"
              autoComplete="new-password"
              aria-label="password"
            />
          </FieldWrapper>
          {isAgeGatingOneScreen && (
            <DobWrapper>
              {/** Ignoring eslint because it is not picking up the htmlFor and control id */}
              {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
              <label htmlFor="dobMonth">What’s your date of birth?</label>
              {renderDobInputs()}
            </DobWrapper>
          )}
          <CatpchaWrapper>
            <ControlledCaptcha
              control={control}
              name="captcharesponse"
              isV3={isV3Captcha}
              rules={{
                required: 'Please complete the reCAPTCHA',
              }}
            />
          </CatpchaWrapper>
        </FieldsContainer>
      )}
      {errorMessage && (
        <Box display="flex" justifyContent="center">
          <Box maxWidth={404} width="100%">
            {(() => {
              switch (errorMessage) {
                case EXISTING_ACCOUNT_ERROR_MESSAGE:
                  return (
                    <FormErrorAlert
                      title="Existing account found"
                      renderMessage={
                        <>
                          We found an existing account that uses these
                          credentials. You can{' '}
                          <ReactRouterDOMLink
                            to={finalLoginUrl}
                            onClick={() => events.signUpSignInButtonClicked()}
                          >
                            log in
                          </ReactRouterDOMLink>{' '}
                          ‌or try again with a different email address.
                        </>
                      }
                    />
                  );
                case EXISTING_EMAIL_ERROR_MESSAGE:
                  return (
                    <FormErrorAlert
                      title="This email address is already being used"
                      renderMessage={
                        <>
                          We found an existing account with this email address,
                          but this password doesn’t match. You can try again or{' '}
                          <ReactRouterDOMLink
                            to={finalLoginUrl}
                            onClick={onClickRequestResetPassword}
                          >
                            reset your password
                          </ReactRouterDOMLink>
                          .
                        </>
                      }
                    />
                  );
                case BIRTHDATE_ERROR_MESSAGE:
                  return <FormErrorAlert title={BIRTHDATE_ERROR_MESSAGE} />;
                default:
                  return (
                    <FormErrorAlert
                      title="Unable to create account"
                      renderMessage={
                        <>
                          Sorry, but we were unable to create your account.
                          Please refresh the page and try again, or visit{' '}
                          <LinkText
                            to="https://help.anchor.fm/hc/en-us"
                            isInline={true}
                          >
                            help.anchor.fm
                          </LinkText>{' '}
                          so we can help you troubleshoot.
                        </>
                      }
                    />
                  );
              }
            })()}
          </Box>
        </Box>
      )}
      <ButtonWrapper>
        {isAgeGatingStep1 ? (
          <Button
            className={css`
              width: 100%;
            `}
            onClick={handleClickNext}
            type="button"
            color="purple"
          >
            Next
          </Button>
        ) : (
          <Button
            className={css`
              width: 100%;
            `}
            onClick={trackClickSignUp}
            type="submit"
            color="purple"
            isDisabled={isSubmitDisabled}
          >
            Sign up
          </Button>
        )}
      </ButtonWrapper>
      {!isAgeGatingStep2 && (
        <Terms>
          {showContactCheckbox && (
            <FieldCheckbox
              {...register('hasOptedIntoContactability')}
              type="checkbox"
              label="Please send me news and offers from Anchor"
              cssProp={cssProp`
                margin-bottom: 14px;
                margin-top: 17px;
              `}
            />
          )}
          {!isWordPressReferral && (
            <LoginImportLink
              isImporting={isImporting}
              finalLoginUrl={finalLoginUrl}
            />
          )}
          <div
            className={css`
              color: #292f36;
              margin-top: 32px;
            `}
          >
            By continuing, you agree to our{' '}
            <LinkText
              target="_blank"
              onClick={() => events.signUpLegalLinkClicked({ link: 'tos' })}
              isInline={true}
              to="/tos"
              color="gray"
            >
              Terms of Service
            </LinkText>{' '}
            and{' '}
            <LinkText
              target="_blank"
              onClick={() => events.signUpLegalLinkClicked({ link: 'privacy' })}
              isInline={true}
              color="gray"
              to="/privacy"
            >
              Privacy Policy
            </LinkText>
            .
          </div>
        </Terms>
      )}
    </form>
  );
};

function LoginImportLink({
  isImporting,
  finalLoginUrl,
}: Pick<SignupFormProps, 'isImporting'> & { finalLoginUrl: string }) {
  return isImporting ? (
    <div
      className={css`
        margin-bottom: 32px;
      `}
    >
      <Text size="md" align="center">
        Already have an account?{' '}
        <Text size="md" isBold={true} isInline={true}>
          <ReactRouterDOMLink to={finalLoginUrl}>Log in</ReactRouterDOMLink>{' '}
        </Text>
        instead.
      </Text>
    </div>
  ) : (
    <p
      className={css`
        text-align: center;
        font-size: 1.4rem;
      `}
    >
      You can also{' '}
      <ReactRouterDOMLink
        data-cy="importLink"
        to="/switch/form"
        onClick={events.signUpImportButtonClicked}
      >
        import
      </ReactRouterDOMLink>{' '}
      an existing podcast.
    </p>
  );
}
