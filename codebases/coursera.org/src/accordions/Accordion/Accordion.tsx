/** @jsx jsx */
import React from 'react';

import { Collapse } from '@material-ui/core';

import { jsx } from '@emotion/react';

import type {
  AccordionHeaderElement,
  AccordionHeaderProps,
} from '@core/accordions/AccordionHeader';
import type { AccordionPanelElement } from '@core/accordions/AccordionPanel';
import { AccordionContextProvider } from '@core/accordions/context';
import type { BaseComponentProps } from '@core/types';
import { useId } from '@core/utils';

import AccordionRoot, { AccordionVariant } from './AccordionRoot';
import { useExpandedState } from './useExpandedState';

export type AccordionElement = React.ReactElement<Props, typeof Accordion>;

type BaseProps = Omit<
  BaseComponentProps<'div'>,
  'children' | 'onChange' | 'onKeyDown'
>;

export type Props = BaseProps & {
  /**
   * Automatically generated if not provided to create an accessible accordion.
   */
  id?: string;

  /**
   * If set, expands the accordion by default. Use when the accordion is uncontrolled.
   * @default false
   */
  defaultExpanded?: boolean;

  /**
   * If set, expands the accordion. Use when the accordion is controlled.
   * @default false
   */
  expanded?: boolean;

  /**
   * Callback fired when the expand/collapse state changes.
   *
   * @param {boolean} expanded The expanded state of the accordion.
   */
  onChange?: (event: React.ChangeEvent<unknown>, expanded: boolean) => void;

  /**
   * The variant to use.
   * @default standard
   */
  variant?: AccordionVariant;

  /**
   * The Accordion expects to receive exactly two children: the first
   * should be an `<AccordionHeader />` component and the second an `<AccordionPanel />`.
   *
   * @see AccordionHeader
   * @see AccordionPanel
   */
  children: [AccordionHeaderElement, AccordionPanelElement];

  /**
   * Forwarded as a ref to the `<AccordionHeader />` button element.
   *
   * Use in tandem with the `onKeyDown` property to manage focus states between
   * a set of related accordions in a group.
   *
   * @see onKeyDown
   * @see AccordionGroup
   */
  headerRef?: React.Ref<HTMLButtonElement>;

  /**
   * Forwarded as a handler to the `<AccordionHeader />` button element.
   *
   * Use in tandem with the `headerRef` property to manage focus states between
   * a set of related accordions in a group.
   *
   * @see headerRef
   * @see AccordionHeader
   * @see AccordionGroup
   */
  onKeyDown?: React.KeyboardEventHandler<HTMLElement>;
};

const regionTitle = ({ labelProps, label }: AccordionHeaderProps): string => {
  const ariaLabel = labelProps && labelProps['aria-label'];
  return ariaLabel || `${label}`;
};

/**
 * An accordion is a singular header that can be selected to reveal or hide
 * content associated with it.
 *
 * See
 * [Engineering notes](__storybookUrl__/surface-accordion--default#eng-notes)
 * and
 * [Props](__storybookUrl__/surface-accordion--default#props) for details.
 *
 * @see AccordionHeader
 * @see AccordionPanel
 */
const Accordion = React.forwardRef(function Accordion(
  props: Props,
  ref: React.Ref<HTMLDivElement>
) {
  const {
    children,
    variant,
    id: baseId,
    expanded,
    defaultExpanded = false,
    onChange,
    headerRef,
    onKeyDown,
    ...rest
  } = props;

  const id = useId(baseId);

  const [isFocused, setFocused] = React.useState(false);
  const [isHovering, setHovering] = React.useState(false);

  const [isExpanded, toggleExpanded] = useExpandedState({
    onChange,
    expanded,
    defaultExpanded,
  });

  const [header, panelContent] = React.Children.toArray(children) as [
    AccordionHeaderElement,
    AccordionPanelElement
  ];

  const headerProps = {
    id: header.props.id || `${id}-accordion-header`,
    'aria-controls': header.props['aria-controls'] || `${id}-accordion-panel`,
  };

  return (
    <AccordionRoot
      ref={ref}
      focused={isFocused}
      hovering={isHovering}
      id={id}
      variant={variant}
      {...rest}
    >
      <AccordionContextProvider
        expanded={isExpanded}
        headerRef={headerRef}
        onFocusChange={(_, focused) => setFocused(focused)}
        onHoverChange={(_, hovering) => setHovering(hovering)}
        onKeyDown={onKeyDown}
        onToggleExpanded={toggleExpanded}
      >
        {React.cloneElement(header, headerProps)}
      </AccordionContextProvider>

      <Collapse in={isExpanded} timeout="auto">
        <div
          aria-labelledby={headerProps.id}
          id={headerProps['aria-controls']}
          role="region"
          title={regionTitle(header.props)}
        >
          {panelContent}
        </div>
      </Collapse>
    </AccordionRoot>
  );
});

export default Accordion;
