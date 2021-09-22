/** @jsx jsx */
import React from 'react';
import { css, jsx } from '@emotion/react';
import { useTheme, Button } from '@coursera/cds-core';

import FlagContent from 'bundles/content-feedback/components/cds/flag/FlagContent';
import type { ItemType } from 'bundles/content-feedback/constants/ItemTypes';

import _t from 'i18n!nls/content-feedback';

import type { Item } from 'bundles/learner-progress/types/Item';

import { FlagSquareIcon, FlagSquareFilledIcon } from '@coursera/cds-icons';

type Props = {
  computedItem: Item;
  selected: boolean;
  onSelect: () => void;

  // TODO tighten up these types
  itemFeedbackType: ItemType;
  tooltipPlacement: string;
  comments: any;
  onSubmit: (comments: any) => void;
  onRemove: (comments: any) => void;
};

const Flag: React.FC<Props> = ({
  selected,
  computedItem,
  itemFeedbackType,
  comments,
  onSelect,
  onSubmit,
  onRemove,
}) => {
  const theme = useTheme();
  return (
    <div
      css={css`
        margin-right: ${theme.spacing(16)};
      `}
    >
      <FlagContent
        computedItem={computedItem}
        itemFeedbackType={itemFeedbackType}
        comments={comments}
        onSelect={onSelect}
        onSubmit={onSubmit}
        onRemove={onRemove}
      >
        <Button
          variant="ghost"
          size="small"
          aria-pressed={selected}
          icon={selected ? <FlagSquareFilledIcon color="interactive" /> : <FlagSquareIcon color="interactive" />}
          iconPosition="before"
        >
          {_t('Report an issue')}
        </Button>
      </FlagContent>
    </div>
  );
};

export default Flag;
