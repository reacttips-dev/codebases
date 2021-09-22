import { SerializedStyles, css } from '@emotion/react';

import { Theme } from '@core/theme';
import generateEmotionClassNames from '@core/utils/generateEmotionClassNames';

export const {
  classes,
  classNames,
} = generateEmotionClassNames('inputAdornment', [
  'root',
  'top',
  'center',
  'hiddenLabel',
  'filled',
  'standard',
  'valid',
  'invalid',
]);

export default (theme: Theme): SerializedStyles => css`
  margin: 0;
  height: unset;
  max-height: unset;
  align-self: stretch;
  padding: ${theme.spacing(0, 16)};
  color: ${theme.palette.black[500]};
  border-radius: 4px;

  ${theme.typography.h4bold}

  &${classNames.filled}:not(${classNames.hiddenLabel}) {
    margin: 0;
  }

  &${classNames.top} {
    top: 0;
    position: absolute;
    right: ${theme.spacing(0)};
    align-items: flex-start;
    padding-top: ${theme.spacing(12)};
  }

  &${classNames.center} {
    align-items: center;
  }

  &${classNames.filled} {
    background: ${theme.palette.gray[100]};
  }

  &${classNames.standard} {
    background: unset;
  }

  &${classNames.valid} {
    color: ${theme.palette.green[700]};
    padding-left: ${theme.spacing(12)};
    padding-right: ${theme.spacing(12)};
  }

  &${classNames.invalid} {
    color: ${theme.palette.red[700]};
    padding-left: ${theme.spacing(12)};
    padding-right: ${theme.spacing(12)};
  }
`;
