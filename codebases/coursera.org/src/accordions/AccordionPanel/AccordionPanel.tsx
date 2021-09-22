/** @jsx jsx */
import React from 'react';

import { jsx } from '@emotion/react';

import type { BaseComponentProps } from '@core/types';

import { getAccordionPanelCss } from './getAccordionPanelCss';

export type AccordionPanelElement = React.ReactElement<
  Props,
  typeof AccordionPanel
>;

export type Props = BaseComponentProps<'div'>;

/**
 * The content panel of an Accordion, which can be collapsed by an
 * AccordionHeader.
 *
 * See
 * [Engineering notes](__storybookUrl__/surface-accordion--default#eng-notes)
 * and
 * [Props](__storybookUrl__/surface-accordion--default#props) for details.
 *
 * @see Accordion
 * @see AccordionHeader
 */
const AccordionPanel = React.forwardRef(function AccordionPanel(
  props: Props,
  ref: React.Ref<HTMLDivElement>
): JSX.Element {
  const { children, ...rest } = props;

  return (
    <div ref={ref} css={getAccordionPanelCss} {...rest}>
      {children}
    </div>
  );
});

export default AccordionPanel;
