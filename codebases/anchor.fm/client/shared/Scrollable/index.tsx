import classNames from 'classnames';
import React, { useEffect, useRef } from 'react';
import {
  Container,
  ScrollableSection,
  FadeElementTop,
  FadeElementBottom,
} from './styles';

interface ScrollableProps {
  isShowingBottomFade?: boolean;
  isShowingTopFade?: boolean;
  className?: string;
  renderScrollableContent: () => React.ReactNode;
  maxHeight?: number | string;
  minHeight?: number | string;
  onScroll?: () => void;
  onScrollToBottom?: () => void;
  scrollBarColor?: string;
}

export function Scrollable({
  renderScrollableContent,
  className,
  isShowingTopFade = false,
  isShowingBottomFade = false,
  maxHeight,
  minHeight,
  onScroll,
  onScrollToBottom,
  scrollBarColor = '#5000b9',
}: ScrollableProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const hasScrollHandlers = Boolean(onScroll || onScrollToBottom);
  useEffect(() => {
    const scrollableElement = scrollRef.current;
    function handleScroll() {
      if (scrollRef && scrollRef.current) {
        const {
          current: { scrollHeight, scrollTop, clientHeight },
        } = scrollRef;
        if (onScrollToBottom && scrollTop + clientHeight >= scrollHeight) {
          onScrollToBottom();
        }
        if (onScroll) onScroll();
      }
    }

    if (hasScrollHandlers && scrollRef.current) {
      scrollRef.current.addEventListener('scroll', handleScroll);
    }

    return () => {
      if (hasScrollHandlers && scrollableElement) {
        scrollableElement.removeEventListener('scroll', handleScroll);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scrollRef]);

  return (
    <Container style={{ maxHeight, minHeight }}>
      <ScrollableSection
        scrollBarColor={scrollBarColor}
        className={classNames(className)}
        ref={scrollRef}
      >
        {renderScrollableContent()}
      </ScrollableSection>
      {isShowingTopFade && <FadeElementTop />}
      {isShowingBottomFade && <FadeElementBottom />}
    </Container>
  );
}
