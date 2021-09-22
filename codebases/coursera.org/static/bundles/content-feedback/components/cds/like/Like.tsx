/** @jsx jsx */
import React from 'react';
import { css, jsx } from '@emotion/react';
import { useTheme, Button } from '@coursera/cds-core';

import LikeContent from 'bundles/content-feedback/components/like/LikeContent';
import type { ItemType } from 'bundles/content-feedback/constants/ItemTypes';

import _t from 'i18n!nls/content-feedback';

import { ThumbsUpIcon, ThumbsUpFilledIcon } from '@coursera/cds-icons';

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

const Like: React.FC<Props> = (props) => {
  const { selected } = props;
  const theme = useTheme();

  return (
    <div
      css={css`
        margin-right: ${theme.spacing(16)};
      `}
    >
      <LikeContent {...props} placeholder={_t('This item was helpful because...')}>
        <Button
          size="small"
          variant="ghost"
          aria-pressed={selected}
          icon={selected ? <ThumbsUpFilledIcon color="interactive" /> : <ThumbsUpIcon color="interactive" />}
          iconPosition="before"
        >
          Like
        </Button>
      </LikeContent>
    </div>
  );
};

export default Like;
