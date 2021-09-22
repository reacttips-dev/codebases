import { SerializedStyles, css } from '@emotion/react';

import { classNames as inputClassNames } from '@core/forms/Input/getInputCss';
import { classNames as selectClassNames } from '@core/forms/Select/getSelectCss';
import { Theme } from '@core/theme';
import generateEmotionClassNames from '@core/utils/generateEmotionClassNames';

export const { classes, classNames } = generateEmotionClassNames(
  'silentSelect',
  ['label', 'stackedLabel', 'container', 'input', 'filled']
);

export default (theme: Theme): SerializedStyles => css`
  max-width: 400px;
  display: inline-flex;
  flex-direction: column;

  ${classNames.filled} {
    color: ${theme.palette.black[500]};
  }

  ${classNames.stackedLabel} {
    margin-bottom: ${theme.spacing(16)};
  }

  ${classNames.input} {
    ${selectClassNames.select} {
      padding-left: ${theme.spacing(8)};
      padding-right: 36px;
    }

    ${selectClassNames.icon} {
      left: auto;
      right: ${theme.spacing(8)};
    }

    ${inputClassNames.notchedOutline} {
      border-width: 0;
      border-bottom-left-radius: 0;
      border-bottom-right-radius: 0;
    }

    &:hover {
      ${inputClassNames.notchedOutline} {
        border-bottom-width: 2px;
      }
    }

    &${selectClassNames.opened} {
      ${inputClassNames.notchedOutline} {
        border-bottom-width: 2px;
        border-color: ${theme.palette.blue[700]};
      }
    }

    &${inputClassNames.focused} {
      &${selectClassNames.focusVisible} {
        ${inputClassNames.notchedOutline} {
          border-width: 0;
        }
      }
    }
  }
`;
