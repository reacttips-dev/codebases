/** @jsx jsx */
import React from 'react';

import { jsx } from '@emotion/react';

import clsx from 'clsx';

import type {
  AccordionElement,
  AccordionProps,
} from '@core/accordions/Accordion';
import { classes } from '@core/accordions/AccordionGroup/getAccordionGroupCss';

type ManagedAccordionProps = { children: AccordionElement } & Pick<
  AccordionProps,
  'headerRef' | 'onKeyDown' | 'expanded' | 'onChange'
>;

export type Props = {
  addSpacing?: boolean;
} & ManagedAccordionProps;

const useAccordionClone = (accordionProps: ManagedAccordionProps) => {
  const { children, expanded, headerRef, onChange, onKeyDown } = accordionProps;

  return React.useMemo(
    () =>
      React.cloneElement(children, {
        expanded,
        headerRef,
        onChange,
        onKeyDown,
      }),
    [children, expanded, headerRef, onChange, onKeyDown]
  );
};

const AccordionItem = (props: Props): React.ReactElement => {
  const { addSpacing, ...accordionProps } = props;
  const accordion = useAccordionClone(accordionProps);

  return (
    <div className={clsx({ [classes.itemSpacing]: addSpacing })}>
      {accordion}
    </div>
  );
};

export default AccordionItem;
