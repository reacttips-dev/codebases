import React, { forwardRef, ReactElement, ReactNode, useMemo } from 'react';

import { parseHtmlToReact } from 'helpers/HtmlHelpers';
import { withErrorBoundary } from 'components/common/MartyErrorBoundary';

interface Props {
  children: ReactNode;
  noContainer?: boolean;
  containerEl?: string;
  [key: string]: any;
}

// Sanitizes raw HTML strings and turns it into React nodes.
// It can also accept JSX as children if you need a fallback.
export const HtmlToReact = forwardRef<HTMLDivElement, Props>(({ children, noContainer = false, containerEl = 'div', ...otherProps }, ref) => {
  const contents: ReactElement = useMemo(() => {
    const childrenType = typeof children;
    if (childrenType === 'object') { // Object for when JSX
      return children;
    } else if (childrenType === 'string') { // String for when raw HTML that we need to parse
      return parseHtmlToReact(children);
    } else {
      return null;
    }
  }, [children]);

  if (!contents) {
    return null;
  } else if (noContainer) {
    return contents;
  } else {
    const Container = containerEl as any;
    return <Container ref={ref} {...otherProps}>{contents}</Container>;
  }
});

const HtmlToReactWithErrorBoundary = withErrorBoundary('HtmlToReact', HtmlToReact);

export default HtmlToReactWithErrorBoundary;
