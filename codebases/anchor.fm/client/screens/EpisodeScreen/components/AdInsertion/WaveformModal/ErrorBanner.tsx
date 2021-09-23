import React from 'react';
import styled from '@emotion/styled';
import { css } from 'emotion';
import { ValidationError } from '../../CuePoints/types';
import CloseIcon from '../../../../../shared/Icon/components/XIcon';
import { UploadErrorIcon } from '../../../../../shared/Icon/components/UploadErrorIcon';
import { IconWrapper, RemoveButton } from '../../CuePoints/styles';
import { DURATION_ERROR_MESSAGE } from '../../CuePoints/constants';
import { AccessibleErrorContainer } from '../../../../../components/AccessibleErrorContainer';

function ErrorBanner({
  error,
  clearErrors,
}: {
  error: ValidationError;
  clearErrors: (error?: ValidationError) => void;
}) {
  return (
    <AccessibleErrorContainer>
      <Banner>
        <span>
          <UploadErrorIcon
            fillColor="#ffffff"
            className={css`
              width: 20px;
              height: 20px;
              margin-right: 20px;
            `}
          />
          {error.message}
        </span>
        {error.message !== DURATION_ERROR_MESSAGE && (
          <StyledRemoveButton
            type="button"
            aria-label={`Error banner - ${error.message}`}
            onClick={() => {
              clearErrors(error);
            }}
          >
            <IconWrapper>
              <CloseIcon
                fillColor="white"
                className={css`
                  width: 100%;
                `}
              />
            </IconWrapper>
          </StyledRemoveButton>
        )}
      </Banner>
    </AccessibleErrorContainer>
  );
}

export { ErrorBanner };

const Banner = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: 12px 40px;
  background-color: #e54751;
  color: white;
  font-size: 1.4rem;
  font-weight: bold;
  border-bottom: 1px solid rgba(0, 0, 0, 0.25);

  span {
    display: flex;
    align-items: center;
  }

  &:focus {
    border: 1px dashed #ffffff;
    outline: none;
  }
`;

const StyledRemoveButton = styled(RemoveButton)`
  &:focus {
    border: 1px dashed #ffffff;
  }
`;
