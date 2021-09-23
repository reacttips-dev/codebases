import React, { MouseEvent, useState } from 'react';
import styled from '@emotion/styled';
import { copyTextToClipboard } from '../../utils';
import { Button } from '../../shared/Button/NewButton';

export const CopyTextInput = ({
  text,
  onClick,
  ariaLabel,
}: {
  text: string;
  onClick?: () => void;
  ariaLabel?: string;
}) => {
  const [isCopied, setIsCopied] = useState<boolean>(false);
  const onCopyClick = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    copyTextToClipboard(text);
    setIsCopied(true);
    setTimeout(() => {
      setIsCopied(false);
    }, 1000);
    onClick?.();
  };
  return (
    <Container className="form-group">
      <Input
        type="text"
        className="form-control"
        value={text || 'Loading ...'}
        onChange={() => null}
        aria-label={ariaLabel}
      />
      <CopyButton onClick={onCopyClick} color="purple">
        {isCopied ? 'Copied!' : 'Copy'}
      </CopyButton>
    </Container>
  );
};

const CopyButton = styled(Button)`
  height: 46px;
  min-width: 97px;
  padding-left: 16px;
  padding-right: 16px;

  &,
  &:focus:before {
    border-radius: 0 6px 6px 0;
  }
`;

const Container = styled.div`
  display: flex;
  justify-content: space-between;
  border-top-right-radius: 3px;
  border-bottom-right-radius: 3px;
  margin-bottom: 0;
`;

const Input = styled.input`
  color: black;
  background: white;
  border-radius: 6px 0 0 6px;
  font-size: 1.6rem;
  height: 46px;
`;
