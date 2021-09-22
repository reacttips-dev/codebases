import { css } from '@emotion/react';
import type { SerializedStyles } from '@emotion/react';

import type { Theme } from '@core/theme';
import generateEmotionClassNames from '@core/utils/generateEmotionClassNames';

export const {
  classes,
  classNames,
} = generateEmotionClassNames('AccordionHeader', [
  'button',
  'chevron',
  'expanded',
  'content',
  'labelGroup',
  'freeContent',
]);

export const getAccordionHeaderCss = (theme: Theme): SerializedStyles => {
  return css`
    margin: 0;
    padding: 0;
    display: flex;
    flex-direction: row;
    z-index: 0;

    ${classNames.chevron} {
      flex-shrink: 0;
      color: inherit;
      padding: 0;
      margin: 2px 12px 0 0;
      transition-property: transform;
      transition-duration: 150ms;
      transition-timing-function: ease-in-out;
      transform: ${theme.direction === 'rtl'
        ? 'rotate(180deg)'
        : 'rotate(0deg)'};

      &${classNames.expanded} {
        transform: rotate(90deg);
      }
    }

    ${classNames.button} {
      text-align: inherit;
      border-radius: 4px;
      padding: ${theme.spacing(16)};
      display: flex;
      flex-direction: row;
      align-content: flex-start;
      align-items: flex-start;
      flex-grow: 1;
      z-index: 1;

      &:hover {
        background-color: ${theme.palette.blue[50]};
      }
    }

    ${classNames.content} {
      display: flex;
      flex-direction: row;
      flex-grow: 1;

      ${theme.breakpoints.down('xs')} {
        flex-direction: column;
      }
    }

    ${classNames.labelGroup} {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      flex-shrink: 1;
    }

    ${classNames.freeContent} {
      padding-left: ${theme.spacing(48)};
      display: flex;
      flex-direction: row;
      align-items: baseline;
      justify-content: flex-end;
      flex-grow: 1;

      ${theme.breakpoints.down('xs')} {
        justify-content: flex-start;
        padding-top: ${theme.spacing(16)};
        padding-left: 0;
      }
    }
  `;
};
