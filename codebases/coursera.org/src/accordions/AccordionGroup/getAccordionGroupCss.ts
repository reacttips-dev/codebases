import { css, SerializedStyles } from '@emotion/react';

import type { Theme } from '@core/theme';
import type { SpacingValue } from '@core/types';
import generateEmotionClassNames from '@core/utils/generateEmotionClassNames';

export type AccordionGroupSpacing = Extract<
  SpacingValue,
  8 | 12 | 16 | 24 | 32
>;

export const {
  classes,
  classNames,
} = generateEmotionClassNames('AccordionGroup', ['itemSpacing']);

export const getAccordionGroupCss = (spacing: AccordionGroupSpacing) => (
  theme: Theme
): SerializedStyles => {
  return css`
    display: flex;
    flex-direction: column;
    justify-content: flex-start;

    ${classNames.itemSpacing} {
      margin-top: ${theme.spacing(spacing)};
    }
  `;
};
