import React from 'react';

import { Box } from '@coursera/coursera-ui';
import { isRightToLeft } from 'js/lib/language';
import { useTheme, Button } from '@coursera/cds-core';
import { css } from '@emotion/react';

import _t from 'i18n!nls/degree-home';

import CalendarSyncDropdown from './CalendarSyncDropdown';

type Props = {
  asBanner: boolean;
  closeCard: () => void;
};

export default ({ asBanner, closeCard }: Props) => {
  const theme = useTheme();

  const flexDirection = asBanner ? 'row' : 'column';
  const alignItems = asBanner ? 'center' : 'start';
  const isRtl = isRightToLeft(_t.getLocale());

  const style = css(
    { ...theme.typography.body2 },
    asBanner ? { margin: theme.spacing(0, 0, 0, 4) } : { margin: theme.spacing(4, 0, 0, 0) },
    isRtl && { marginRight: theme.spacing(12) }
  );

  return (
    <Box flexDirection={flexDirection} alignItems={alignItems} justifyContent="start">
      <CalendarSyncDropdown />
      <Button size="small" css={style} onClick={closeCard}>
        {_t('Set up later')}
      </Button>
    </Box>
  );
};
