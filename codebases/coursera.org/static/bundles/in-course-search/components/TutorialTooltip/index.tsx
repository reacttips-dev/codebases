/** @jsx jsx */
/** @jsxFrag React.Fragment */
import React, { useState } from 'react';
import { css, jsx } from '@emotion/react';
import { Grid, Button, Typography, useTheme } from '@coursera/cds-core';
import { Tooltip } from 'react-bootstrap-33';
import localStorageEx from 'bundles/common/utils/localStorageEx';
import TrackedButton from 'bundles/page/components/TrackedButton';
import _t from 'i18n!nls/in-course-search';
import deferToClientSideRender from 'js/lib/deferToClientSideRender';

export const IN_COURSE_SEARCH_TOOLTIP_STORAGE_KEY = 'ics_tooltip_dont_show_again';
export const HUNDRED_YEARS = 3155760000000;
export const THREE_DAYS = 259200000;

export const TutorialTooltipComponent = () => {
  const theme = useTheme();
  const [dontShowAgainValue, setDontShowAgainValue] = useState<boolean>(
    Date.now() < localStorageEx.getItem(IN_COURSE_SEARCH_TOOLTIP_STORAGE_KEY, JSON.parse, 0)
  );

  const dontShowAgainSaveToLocalStorage = (delay: number) => {
    setDontShowAgainValue(true);
    const showNext = Date.now() + delay;
    localStorageEx.setItem(IN_COURSE_SEARCH_TOOLTIP_STORAGE_KEY, showNext, JSON.stringify);
  };

  if (dontShowAgainValue) {
    return <></>;
  }

  return (
    <Tooltip
      id="rc-TutorialTooltip"
      placement="bottom"
      css={css`
        opacity: 1;

        .bt3-tooltip-arrow {
          border-bottom-color: ${theme.palette.white} !important;
          box-shadow: none;
        }

        .bt3-tooltip-inner {
          background-color: ${theme.palette.white};
          box-shadow: 0px 2px 8px rgba(102, 102, 102, 0.5);
          max-width: 350px;
          padding: ${theme.spacing(16)};
          text-align: left;

          > :not(:last-child) {
            margin-bottom: ${theme.spacing(8)};
          }
        }
      `}
    >
      <Typography variant="h1semibold">{_t('NEW: Search within course')}</Typography>
      <Typography>
        {_t(
          'Now you can search for what you need within the course including: video transcripts, readings, and resources.'
        )}
      </Typography>
      <Grid container justify="space-between">
        <Button
          size="small"
          variant="ghost"
          data-test="dismiss-button"
          onClick={() => dontShowAgainSaveToLocalStorage(THREE_DAYS)}
          component={TrackedButton}
          trackingName="tutorial_dismiss_click"
          withVisibilityTracking={false}
          requireFullyVisible={false}
        >
          {_t('Remind me later')}
        </Button>
        <Button
          size="small"
          data-test="search-now-button"
          onClick={() => dontShowAgainSaveToLocalStorage(HUNDRED_YEARS)}
          component={TrackedButton}
          trackingName="tutorial_proceed_click"
          withVisibilityTracking={false}
          requireFullyVisible={false}
        >
          {_t('Try now')}
        </Button>
      </Grid>
    </Tooltip>
  );
};

export default deferToClientSideRender()(TutorialTooltipComponent);
