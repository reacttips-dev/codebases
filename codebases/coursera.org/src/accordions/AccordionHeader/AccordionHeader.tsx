/** @jsx jsx */
import React from 'react';

import { jsx } from '@emotion/react';

import type { BaseComponentProps } from '@core/types';

import { classes, getAccordionHeaderCss } from './getAccordionHeaderCss';
import HeaderButton from './HeaderButton';
import { HeaderLabel, HeaderSupportText } from './typography';
import type { HeaderLabelProps, HeaderSupportTextProps } from './typography';

export type AccordionHeaderElement = React.ReactElement<
  Props,
  typeof AccordionHeader
>;

export type Props = {
  /**
   * Automatically generated if not provided to create an accessible accordion.
   */
  id?: string;

  /**
   * The text to display as the header label
   */
  label: HeaderLabelProps['children'];

  /**
   * Properties to override the accessibility controls for the header label.
   */
  labelProps?: Omit<HeaderLabelProps, 'children'>;

  /**
   * The text to display as the header support text
   */
  supportText?: HeaderSupportTextProps['children'];

  /**
   * Properties to set the support text icon and to override the accessibility
   * controls for the header label.
   */
  supportTextProps?: Omit<HeaderSupportTextProps, 'children'>;

  /**
   * The heading level to use as the root component of the AccordionHeader.
   * Setting this property will only affect the semantic of the generated HTML and
   * not the styling.
   *
   * @default h3
   */
  component?: 'h2' | 'h3' | 'h4' | 'h5' | 'h6';

  /**
   * Custom content to show in the AccordionHeader. Only phrasing content is
   * semantically valid here, because the parent will be a `<button />`.
   *
   * @link https://developer.mozilla.org/en-US/docs/Web/HTML/Element/button
   * @link https://developer.mozilla.org/en-US/docs/Web/Guide/HTML/Content_categories#phrasing_content
   */
  children?: React.ReactNode | React.ReactNode[];
} & Omit<BaseComponentProps<'h3'>, 'children'>;

/**
 * The interactive header element of an Accordion, used to toggle the collapsed
 * state of the accordion.
 *
 * See
 * [Engineering notes](__storybookUrl__/surface-accordion--default#eng-notes)
 * and
 * [Props](__storybookUrl__/surface-accordion--default#props) for details.
 *
 * @see Accordion
 * @see AccordionPanel
 */
const AccordionHeader = React.forwardRef(function AccordionHeader(
  props: Props,
  ref: React.Ref<HTMLHeadingElement>
) {
  const {
    label,
    labelProps,
    supportText,
    supportTextProps,
    children,
    id,
    component: HeadingLevel = 'h3',
    ...headingProps
  } = props;

  return (
    <HeadingLevel ref={ref} css={getAccordionHeaderCss} {...headingProps}>
      <HeaderButton id={id}>
        <div className={classes.labelGroup}>
          <HeaderLabel {...labelProps}>{label}</HeaderLabel>

          {supportText && (
            <HeaderSupportText {...supportTextProps}>
              {supportText}
            </HeaderSupportText>
          )}
        </div>

        {children && <div className={classes.freeContent}>{children}</div>}
      </HeaderButton>
    </HeadingLevel>
  );
});

export default AccordionHeader;
