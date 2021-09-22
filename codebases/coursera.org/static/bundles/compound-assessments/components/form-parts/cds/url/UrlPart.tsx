import React from 'react';

import initBem from 'js/lib/bem';

import _t from 'i18n!nls/compound-assessments';

import { INVALID_URL_ERROR, typeNames } from 'bundles/compound-assessments/constants';

import { Textarea } from '@coursera/coursera-ui';

// @ts-ignore TS7016 Untyped import http://go.dkandu.me/strict-ts-migration#TS7016
import { isURL } from 'validator';

import UrlView from 'bundles/compound-assessments/components/form-parts/cds/url/UrlView';

import ValidationError from 'bundles/compound-assessments/components/form-parts/cds/ValidationError';
import type { FormPartsValidationStatus } from 'bundles/compound-assessments/components/form-parts/lib/checkResponsesInvalid';

import { FormPartsValidationStatuses } from 'bundles/compound-assessments/components/form-parts/lib/constants';

import type { UrlPrompt, UrlResponse } from 'bundles/compound-assessments/types/FormParts';

import 'css!./__styles__/UrlPart';

const bem = initBem('UrlPart');

type Props = {
  prompt: UrlPrompt; // eslint-disable-line react/no-unused-prop-types
  response: UrlResponse;
  onChangeResponse: (response: UrlResponse) => void;
  isDisabled: boolean;
  isReadOnly: boolean;
  showValidation: boolean;
};

export const checkInvalid = (response: UrlResponse): FormPartsValidationStatus | null => {
  const { url } = response?.definition?.submissionPartResponse?.definition || {};
  return !url || url.trim().match(/^https?:\/\/$/) || !isURL(url) ? FormPartsValidationStatuses.warning : null;
};

class UrlPart extends React.Component<Props> {
  onChange = (key: 'url' | 'title' | 'caption') => (event: React.ChangeEvent<HTMLInputElement>) => {
    const { response, onChangeResponse } = this.props;
    const { url, title, caption } = response?.definition?.submissionPartResponse?.definition;
    onChangeResponse({
      typeName: typeNames.SUBMISSION_RESPONSE,
      definition: {
        submissionPartResponse: {
          typeName: 'urlResponse',
          definition: {
            url,
            title,
            caption,
            [key]: event.target.value,
          },
        },
      },
    });
  };

  onChangeUrl = this.onChange('url');

  onChangeTitle = this.onChange('title');

  onChangeCaption = this.onChange('caption');

  render() {
    const { response, isDisabled, isReadOnly, showValidation, prompt } = this.props;
    const { url, title, caption } = response?.definition?.submissionPartResponse?.definition;

    const isInvalid = !!(showValidation && checkInvalid(response));
    const isInvalidUrl = !!url && !isURL(url);

    return (
      <div className={bem()}>
        {isReadOnly ? (
          <div className={bem('readOnly')}>
            {/* TODO: UrlView renders YouTube, Vimeo, Image, Soundcloud embeds.
                It uses Backbone to render. Rewrite it to React. */}
            <UrlView submissionPart={{ url, title, caption }} />
          </div>
        ) : (
          <div>
            <div className={bem('input', { isInvalid })} data-test="url-part-url">
              <Textarea
                value={url}
                disabled={isDisabled}
                label={_t('URL')}
                onChange={this.onChangeUrl}
                componentId={`text-input-url-${prompt.id}`}
                placeholder="https://example.com"
                rows={1}
                nativeHtmlAttributes={{
                  'aria-describedby': isInvalid ? `validation-error-${prompt.id}` : undefined,
                }}
              />
            </div>
            <div className={bem('input')} data-test="url-part-title">
              <Textarea
                value={title}
                disabled={isDisabled}
                label={_t('Title')}
                onChange={this.onChangeTitle}
                componentId={`text-input-title-${prompt.id}`}
                rows={1}
              />
            </div>
            <div className={bem('input')} data-test="url-part-caption">
              <Textarea
                value={caption}
                disabled={isDisabled}
                label={_t('Caption')}
                onChange={this.onChangeCaption}
                componentId={`text-input-caption-${prompt.id}`}
              />
            </div>
            {isInvalid && <ValidationError id={prompt.id} message={isInvalidUrl ? INVALID_URL_ERROR : null} />}
          </div>
        )}
      </div>
    );
  }
}

export default UrlPart;
