import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import styled from '@emotion/styled';
import { css } from 'emotion';
import { Button } from 'shared/Button/NewButton';
import {
  ControlledFieldInput,
  ControlledFieldTextArea,
  ControlledFieldSelect,
} from 'components/Field';
import Spinner from 'components/Spinner';
import serverRenderingUtils from 'helpers/serverRenderingUtils';
import { ERROR_MESSAGES } from 'screens/SettingsScreen/components/SettingsForm/constants';
import {
  Form,
  Container,
  FormItem,
  FormErrorAlert,
  buttonStyles,
} from './styles';

const LANGUAGE_MAP: { [language: string]: string } = {};
serverRenderingUtils.getLanguagesSortedByLabel(true).forEach((lang: Option) => {
  LANGUAGE_MAP[lang.value] = lang.label;
});

const Capitalized = styled.label`
  font-weight: normal;
  &:first-letter {
    text-transform: uppercase;
  }
`;

const REQUIRED = { required: "This can't be left empty" };

export type FormData = {
  podcastName?: string;
  podcastDescription?: string;
  itunesCategory?: string;
  language?: string;
};

type Option = { label: string; value: string };
type MetadataFormProps = {
  podcastCategoryOptions: Option[];
  stationType: string;
  onSubmit: (data: FormData) => Promise<void>;
  defaultValues: FormData;
};

const MetadataForm = ({
  onSubmit,
  podcastCategoryOptions,
  stationType,
  defaultValues,
}: MetadataFormProps) => {
  const {
    handleSubmit,
    control,
    formState: { isSubmitting, errors },
    setError,
  } = useForm({ defaultValues });
  const [globalError, setGlobalError] = useState<boolean>(false);
  return (
    <Container>
      <Form
        onSubmit={handleSubmit((data, e) => {
          if (e) {
            // this will prevent any other forms on the page from unintentionally submitted
            e.stopPropagation();
            e.preventDefault();
          }
          setGlobalError(false);
          return onSubmit(data).catch(({ message }) => {
            switch (message) {
              case ERROR_MESSAGES.PODCAST_NAME_NOT_ALLOWED:
                setError('podcastName', {
                  message: ERROR_MESSAGES.PODCAST_NAME_NOT_ALLOWED,
                });
                break;
              default:
                setGlobalError(true);
                break;
            }
          });
        })}
      >
        {globalError && (
          <FormErrorAlert
            title="Something went wrong"
            renderMessage={
              <>
                Try again or visit{' '}
                <a href="https://help.anchor.fm">help.anchor.fm</a> for more
                assistance.
              </>
            }
          />
        )}
        <FormItem>
          <Capitalized htmlFor="podcastName">{stationType} name</Capitalized>
          <ControlledFieldInput
            control={control}
            name="podcastName"
            maxCharacterLength={100}
            type="text"
            showCharacterCount={true}
            error={
              errors.podcastName?.message ===
              ERROR_MESSAGES.PODCAST_NAME_NOT_ALLOWED
                ? {
                    message: (
                      <>
                        You&apos;re a VIP! Please reach out to our{' '}
                        <a
                          href="https://help.anchor.fm/hc/en-us/requests/new"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          support team
                        </a>{' '}
                        to finish your setup.
                      </>
                    ),
                  }
                : errors.podcastName
            }
            rules={REQUIRED}
          />
        </FormItem>
        <FormItem>
          <Capitalized htmlFor="podcastDescription">
            {stationType} description
          </Capitalized>
          <ControlledFieldTextArea
            control={control}
            className={css`
              margin-bottom: 0px;
            `}
            name="podcastDescription"
            maxLength={600}
            error={errors.podcastDescription}
            rules={REQUIRED}
          />
        </FormItem>
        <FormItem>
          <Capitalized htmlFor="category-dropdown">
            {stationType} category
          </Capitalized>
          <ControlledFieldSelect
            control={control}
            name="itunesCategory"
            id="category-dropdown"
            placeholder="Choose one..."
            options={podcastCategoryOptions}
            rules={REQUIRED}
          />
        </FormItem>
        <FormItem>
          <Capitalized htmlFor="language-dropdown">
            {stationType} language
          </Capitalized>
          <ControlledFieldSelect
            control={control}
            name="language"
            id="language-dropdown"
            placeholder="Choose one..."
            options={serverRenderingUtils.LANGUAGES}
            rules={REQUIRED}
          />
        </FormItem>
        <Button
          className={buttonStyles}
          color="purple"
          type="submit"
          isDisabled={isSubmitting || !!Object.keys(errors).length}
        >
          {isSubmitting ? <Spinner size={24} /> : 'Continue'}
        </Button>
      </Form>
    </Container>
  );
};

export default MetadataForm;
