/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import styled from '@emotion/styled';

export function SupportedFormatsTooltip() {
  return (
    <div
      css={css`
        z-index: 1;
      `}
    >
      <UploadCopyText
        css={css`
          margin-bottom: 14px;
        `}
      >
        <strong>Supported audio formats:</strong> all audio formats (up to 250MB
        per file)
      </UploadCopyText>
      <UploadCopyText
        css={css`
          margin-bottom: 14px;
        `}
      >
        <strong>Supported video formats:</strong> mov and mp4 (less than 3 hours
        in play length)
      </UploadCopyText>
      <UploadCopyText>
        Only upload files that you have the rights to import to Anchor and
        distribute to other platforms.
      </UploadCopyText>
    </div>
  );
}

type UploadCopyTextProps = {
  isBold?: boolean;
};

const UploadCopyText = styled.p<UploadCopyTextProps>`
  color: #fff;
  font-size: 1.4rem;
  line-height: 1.6rem;
  font-weight: ${({ isBold }) => (isBold ? 'bold' : 'normal')};
  white-space: normal;
  text-align: left;
`;
