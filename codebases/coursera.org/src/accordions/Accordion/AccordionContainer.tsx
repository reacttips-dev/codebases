/** @jsx jsx */
import React from 'react';

import { jsx } from '@emotion/react';

import clsx from 'clsx';

import { classes } from './getAccordionCss';

export type Props = {
  id?: string;
  focused: boolean;
  hovering: boolean;
};

const AccordionContainer: React.FC<Props> = ({
  focused,
  hovering,
  id,
  children,
}) => {
  return (
    <div
      className={clsx(classes.container, {
        [classes.focus]: focused,
        [classes.hover]: hovering,
      })}
      id={id}
    >
      {children}
    </div>
  );
};

export default AccordionContainer;
