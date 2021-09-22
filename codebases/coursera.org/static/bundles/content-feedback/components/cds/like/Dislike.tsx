/** @jsx jsx */
import React from 'react';
import { css, jsx } from '@emotion/react';
import { useTheme, Button } from '@coursera/cds-core';

import LikeContent from 'bundles/content-feedback/components/like/LikeContent';
import type { ItemType } from 'bundles/content-feedback/constants/ItemTypes';

import _t from 'i18n!nls/content-feedback';

import { ThumbsDownIcon, ThumbsDownFilledIcon } from '@coursera/cds-icons';

import type { CmlContent } from 'bundles/cml/types/Content';

type Props = {
  selected: boolean;
  tooltipPlacement: string;
  withFeedback: boolean;

  onDeselect: () => void;
  onSelect: (cml: CmlContent) => void;
  onComment: (cml: CmlContent) => void;

  comment: any;
  itemFeedbackType: ItemType;
};

const Dislike: React.FC<Props> = (props) => {
  const { selected } = props;
  const theme = useTheme();

  return (
    <div
      css={css`
        margin-right: ${theme.spacing(16)};
      `}
    >
      <LikeContent {...props} placeholder={_t('Help us improve this content')}>
        <Button
          variant="ghost"
          size="small"
          aria-pressed={selected}
          icon={selected ? <ThumbsDownFilledIcon color="interactive" /> : <ThumbsDownIcon color="interactive" />}
          iconPosition="before"
        >
          Dislike
        </Button>
      </LikeContent>
    </div>
  );
};

export default Dislike;
