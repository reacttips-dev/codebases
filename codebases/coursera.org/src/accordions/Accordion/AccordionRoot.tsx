/** @jsx jsx */
import React from 'react';

import { jsx } from '@emotion/react';

import type { BaseComponentProps } from '@core/types';

import AccordionContainer from './AccordionContainer';
import type { Props as AccordionContainerProps } from './AccordionContainer';
import { getAccordionCss, classes } from './getAccordionCss';
import type { AccordionVariant } from './getAccordionCss';

export { AccordionVariant } from './getAccordionCss';

const FocusContainer = 'div' as const;

export type Props = { variant?: AccordionVariant } & AccordionContainerProps &
  BaseComponentProps<'div'>;

const AccordionRoot = React.forwardRef(function AccordionRoot(
  props: Props,
  ref: React.Ref<HTMLDivElement>
) {
  const {
    focused,
    hovering,
    id,
    children,
    variant = 'standard',
    ...rest
  } = props;

  return (
    <div ref={ref} css={getAccordionCss(variant)} {...rest}>
      <FocusContainer className={classes.focusContainer}>
        <AccordionContainer focused={focused} hovering={hovering} id={id}>
          {children}
        </AccordionContainer>
      </FocusContainer>
    </div>
  );
});

export default AccordionRoot;
