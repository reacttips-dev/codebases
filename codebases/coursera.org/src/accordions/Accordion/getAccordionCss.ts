import { css } from '@emotion/react';
import type { SerializedStyles } from '@emotion/react';

import type { Theme } from '@core/theme';
import generateEmotionClassNames from '@core/utils/generateEmotionClassNames';

export type AccordionVariant = 'standard' | 'silent';

export const { classes, classNames } = generateEmotionClassNames('Accordion', [
  'container',
  'expanded',
  'focusContainer',
  'focus',
  'hover',
  'panelContent',
]);

const variants: Record<AccordionVariant, (theme: Theme) => SerializedStyles> = {
  standard: (theme: Theme) => css`
    ${classNames.container} {
      border: 1px solid ${theme.palette.gray[500]};
    }
  `,

  silent: () => css`
    ${classNames.container} {
      border: 1px solid transparent;
    }
  `,
};

export const getAccordionCss = (variant: AccordionVariant) => (
  theme: Theme
): SerializedStyles => {
  return css`
    margin: 0;
    padding: 0;

    ${variants[variant](theme)} ${classNames.container} {
      border-radius: 4px;
    }

    ${classNames.hover} {
      border: 1px solid ${theme.palette.blue[700]};
    }

    ${classNames.focusContainer} {
      position: relative;
      z-index: 1;
      margin: 0;
      padding: 2px;
    }

    ${classNames.focus} {
      &::after {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        border-radius: 4px;
        box-shadow: 0 0 0 1px ${theme.palette.purple[600]},
          0 0 0 2px ${theme.palette.blue[50]};
      }
    }
  `;
};
