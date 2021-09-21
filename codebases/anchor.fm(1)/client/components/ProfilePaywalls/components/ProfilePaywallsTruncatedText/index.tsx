import styled from '@emotion/styled';
import React, { ReactElement, createRef, useEffect, useState } from 'react';
import { useBrowserSize } from '../../../../contexts/BrowserSize';

export const EXPAND_TEXT = 'See more';
export const COLLAPSE_TEXT = 'See less';

export const ProfilePaywallsTruncatedText = ({
  children,
  numMaxLines = 2,
}: {
  children: ReactElement | string;
  numMaxLines?: number;
}) => {
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [isTruncated, setIsTruncated] = useState<boolean>(false);
  const messageRef = createRef<HTMLDivElement>();
  const { width } = useBrowserSize();

  useEffect(() => {
    const { current } = messageRef;
    if (current) {
      setIsTruncated(current.scrollHeight > current.clientHeight);
    }
  }, [width, messageRef]);

  if (isExpanded) {
    return (
      <Container>
        {children}
        <Button onClick={() => setIsExpanded(false)}>{COLLAPSE_TEXT}</Button>
      </Container>
    );
  }

  return (
    <Container>
      <TruncatedMessage numMaxLines={numMaxLines} ref={messageRef}>
        {children}
      </TruncatedMessage>
      {isTruncated && (
        <Button onClick={() => setIsExpanded(true)}>{EXPAND_TEXT}</Button>
      )}
    </Container>
  );
};

// "pre-wrap" so \n appear as newlines
const Container = styled.div`
  box-sizing: border-box;
  white-space: pre-wrap;
`;

const TruncatedMessage = styled.div<{ numMaxLines: number }>`
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: ${({ numMaxLines }) => numMaxLines};
  overflow: hidden;
`;

const Button = styled.button`
  display: block;
  font-weight: bold;
  font-size: 1.4rem;
  margin: 8px 0 0;
  padding: 0;
  font-style: normal;
`;
