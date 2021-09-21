/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import styled from '@emotion/styled';
import { css as cssClassName } from 'emotion';
import React, { useState } from 'react';
import Checkbox from 'react-bootstrap/lib/Checkbox';

import { FormErrorAlert } from 'components/FormErrorAlert';
import events from 'components/SignupPageContainer/events';
import { trackEvent } from 'modules/analytics';
import { AnchorAPI } from 'modules/AnchorAPI';
import { Button } from 'shared/Button/NewButton';
import { LinkText } from 'shared/Link';
import { Spinner } from 'shared/Spinner';
import Text from 'shared/Text';
import { Step } from './types';

type Props = {
  stationId: string;
  userId: number;
  feedUrl: string;
  previousStep: Step;
  history: {
    push: (url: string) => void;
  };
  logOutAndRedirect?: (redirectPath: string) => void;
  resetPersistedState: () => void;
};

enum ImportStatus {
  LOADING,
  ERROR,
}

export const ImportAgreement = ({
  stationId,
  userId,
  feedUrl,
  previousStep,
  history,
  logOutAndRedirect,
  resetPersistedState,
}: Props) => {
  const isFromSignup = previousStep === Step.CREATE_ACCOUNT;
  const [hasAgreed, setHasAgreed] = useState<boolean[]>(
    isFromSignup ? [false] : [false, false]
  );
  const [importStatus, setImportStatus] = useState<ImportStatus>();

  const handleImportClick = async () => {
    try {
      trackEvent(
        'import_podcast_button_clicked',
        {},
        // @ts-ignore
        { providers: [mParticle] }
      );
      setImportStatus(ImportStatus.LOADING);
      await AnchorAPI.importRssFeed({ stationId, userId, feedUrl });

      history.push(`/dashboard${isFromSignup ? '?navigatedFrom=signup' : ''}`);
      resetPersistedState();
    } catch {
      setImportStatus(ImportStatus.ERROR);
    }
  };

  return (
    <div
      css={css`
        max-width: 342px;
      `}
    >
      <ImportCheckboxWrapper>
        {!isFromSignup && (
          <ImportCheckbox
            onChange={() => {
              setHasAgreed(([agreedToOverride, agreedToOwnership]) => [
                !agreedToOverride,
                agreedToOwnership,
              ]);
            }}
          >
            <div
              css={css`
                margin: 0 0 16px 12px;
              `}
            >
              <Text size="md" isBold={true} color="#292f36">
                I understand that importing my podcast will override any
                existing settings in my Anchor account. Your existing Anchor
                episodes will not be deleted.
              </Text>
            </div>
          </ImportCheckbox>
        )}
        <ImportCheckbox
          onChange={() => {
            if (isFromSignup) {
              setHasAgreed(([agreedToOwnership]) => [!agreedToOwnership]);
            } else {
              setHasAgreed(([agreedToOverride, agreedToOwnership]) => [
                agreedToOverride,
                !agreedToOwnership,
              ]);
            }
          }}
        >
          <div
            css={css`
              margin-left: 12px;
            `}
          >
            <Text size="md" isBold={true} color="#292f36">
              I own, or have licensed, all rights necessary to import this
              podcast to Anchor, and to grant the license under the{' '}
              <LinkText target="_blank" isInline={true} to="/tos">
                Terms of Service
              </LinkText>
              .
            </Text>
          </div>
        </ImportCheckbox>
      </ImportCheckboxWrapper>
      {importStatus === ImportStatus.ERROR && (
        <FormErrorAlert
          title="Something went wrong"
          renderMessage={
            <React.Fragment>
              Try again or visit{' '}
              <a href="https://help.anchor.fm">help.anchor.fm</a> for more
              assistance.
            </React.Fragment>
          }
        />
      )}
      <div
        css={css`
          margin-top: 32px;
        `}
      >
        <Button
          color="purple"
          onClick={handleImportClick}
          isDisabled={
            !hasAgreed.every(i => i) || importStatus === ImportStatus.LOADING
          }
          className={cssClassName`color: ${
            hasAgreed ? '#fff' : '#e2cffe'
          }; width: 100%;`}
        >
          Import podcast
          <SpinnerWrapper isShowing={importStatus === ImportStatus.LOADING}>
            <Spinner size={16} color="#e2cffe" />
          </SpinnerWrapper>
        </Button>
      </div>
      {previousStep === Step.ALREADY_LOGGED_IN && (
        <div
          css={css`
            margin-top: 16px;
            text-align: center;
          `}
        >
          <Text size="md" color="#292f36" align="center">
            Want to import to a different account?
          </Text>
          <ImportToADifferentAccountButton
            onClick={() => logOutAndRedirect!('/switch/signup')}
          >
            Sign up
          </ImportToADifferentAccountButton>
          or
          <ImportToADifferentAccountButton
            onClick={() => logOutAndRedirect!('/switch/login')}
          >
            Log in
          </ImportToADifferentAccountButton>
        </div>
      )}
      <div
        css={css`
          margin-top: 32px;
        `}
      >
        <Text size="sm" color="#7f8287" align="center">
          By clicking “Import podcast”, you agree to our{' '}
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
        </Text>
      </div>
    </div>
  );
};

const ImportCheckboxWrapper = styled.div`
  background: #ebeced;
  border: 1px solid #c9cbcd;
  border-radius: 4px;
  padding: 10px 20px;
  margin-bottom: 32px;
`;

const ImportCheckbox = styled(Checkbox)`
  position: relative;
  input {
    width: 16px;
    height: 16px;
    background-color: #fff;
    border: 1px solid #cccdcf;
    border-radius: 4px;
    -webkit-appearance: none;
    margin-top: 0;

    &::before {
      visibility: hidden;
      content: '';
      position: absolute;
      left: 4px;
      top: 1px;
      width: 6px;
      height: 10px;
      border: solid #5000b9;
      border-width: 0 3px 3px 0;
      -webkit-transform: rotate(45deg);
      -ms-transform: rotate(45deg);
      transform: rotate(45deg);
    }

    &:checked::before {
      visibility: visible;
    }
  }
`;

const SpinnerWrapper = styled.div<{ isShowing: boolean }>`
  display: ${props => (props.isShowing ? 'block' : 'none')};
  margin-left: 10px;
`;

const ImportToADifferentAccountButton = styled.button`
  color: #5000b9;
  font-weight: 700;

  &:hover {
    color: #6732b9;
    text-decoration: underline;
    cursor: pointer;
  }
`;
