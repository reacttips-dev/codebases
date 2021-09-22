/** @jsx jsx */
import React from 'react';

import { jsx } from '@emotion/react';

import type { AccordionElement } from '@core/accordions/Accordion';
import AccordionItem from '@core/accordions/AccordionGroup/AccordionItem';
import type { BaseComponentProps } from '@core/types';

import { getAccordionGroupCss } from './getAccordionGroupCss';
import type { AccordionGroupSpacing } from './getAccordionGroupCss';
import useControlledAccordions from './useControlledAccordions';
import useFocusedAccordions from './useFocusedAccordions';
import useOnChangeHandler from './useOnChangeHandler';

type BaseProps = Omit<BaseComponentProps<'div'>, 'children' | 'onChange'>;

export type Props = BaseProps & {
  /**
   * Defines the space between each accordion in the group.
   *
   * @default 24
   */
  spacing?: AccordionGroupSpacing;

  /**
   * Callback function executed when the set of expanded children changes.
   *
   * @param expandedIndices currently expanded children
   */
  onChange?: (expandedIndices: number[]) => void;

  /**
   * If set, allows multiple accordions in the group to be expanded simultaneously.
   * By default, only one accordion can be expanded at the time, and expanding
   * one will cause a previously opened accordion to collapse.
   *
   * @default false
   */
  multiExpand?: boolean;

  /**
   * The indices of the children that will initially render as expanded.
   *
   * @default []
   */
  defaultExpanded?: number[];

  /**
   * The Accordions to render as part of this group. The total number of
   * children should not change after first render.
   *
   * @see AccordionProps
   */
  children: AccordionElement | AccordionElement[];
};

/**
 * An AccordionGroup is a vertically stacked collection of of contextually
 * related accordions.
 * <ol>
 *   <li>
 *     Each accordion's expanded state is controlled by the AccordionGroup to
 *     support single or multi expand modes for the group.
 *   </li>
 *   <li>
 *     Keyboard navigation is defined to allow moving between accordions in the
 *     group using the arrow, home and end keys.
 *   </li>
 * </ol>
 *
 * Limits: the component state will not reset if props change after initial render,
 * and will become invalid if number of children changes.
 *
 * Note that it will override some props on the provided accordions, replacing
 * any previously defined values.
 *
 * See
 * [Engineering notes](__storybookUrl__/surface-accordion--default#eng-notes)
 * and
 * [Props](__storybookUrl__/surface-accordion--default#props) for details.
 */
const AccordionGroup = React.forwardRef(function AccordionGroup(
  props: Props,
  ref: React.Ref<HTMLDivElement>
) {
  const {
    children,
    spacing = 24,
    onChange,
    multiExpand = false,
    defaultExpanded = [],
    ...rest
  } = props;

  const accordionFocusProps = useFocusedAccordions(children);

  const controlledAccordionProps = useControlledAccordions({
    children,
    defaultExpanded,
    multiExpand,
  });

  useOnChangeHandler(controlledAccordionProps, onChange);

  return (
    <div ref={ref} css={getAccordionGroupCss(spacing)} {...rest}>
      {React.Children.map(children, (child, index) => {
        const { headerRef, onKeyDown } = accordionFocusProps[index];
        const { onChange, expanded } = controlledAccordionProps[index];

        return (
          <AccordionItem
            key={index}
            addSpacing={index !== 0}
            expanded={expanded}
            headerRef={headerRef}
            onChange={onChange}
            onKeyDown={onKeyDown}
          >
            {child}
          </AccordionItem>
        );
      })}
    </div>
  );
});

export default AccordionGroup;
