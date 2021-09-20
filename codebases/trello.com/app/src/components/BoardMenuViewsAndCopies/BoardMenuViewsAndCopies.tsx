import React from 'react';
import { CopyIcon } from '@trello/nachos/icons/copy';
import { SubscribeIcon } from '@trello/nachos/icons/subscribe';
import { forTemplate } from '@trello/i18n';
import { useBoardStatsQuery } from './BoardStatsQuery.generated';
import { asCompactNumber, asNumber } from '@trello/i18n/formatters';
import styles from './BoardMenuViewsAndCopies.less';

const format = forTemplate('board_menu_about_this_board');

export const ViewsAndCopies: React.FunctionComponent<{
  isTemplate: boolean;
  showLabels: boolean;
  useSmallTextStyle: boolean;
  copyCount: number;
  viewCount: number;
}> = ({ isTemplate, showLabels, useSmallTextStyle, copyCount, viewCount }) => {
  const shouldShowViewCopy = isTemplate && copyCount >= 0 && viewCount > 0;

  const copyText = copyCount === 1 ? format('copy') : format('copies');
  const viewText = viewCount === 1 ? format('view') : format('views');

  const textStyle = useSmallTextStyle
    ? styles.viewCopyTextSmall
    : styles.viewCopyText;

  return (
    <div>
      {shouldShowViewCopy && (
        <div>
          <span
            className={textStyle}
            title={`${asNumber(copyCount)} ${copyText}`}
          >
            <CopyIcon
              size="small"
              color="quiet"
              dangerous_className={styles.iconViewCopy}
            />
            {copyCount && asCompactNumber(copyCount)}
            &nbsp;
            {showLabels && copyText}
          </span>
          &nbsp;
          <span
            className={textStyle}
            title={`${asNumber(viewCount)} ${viewText}`}
          >
            <SubscribeIcon
              size="small"
              color="quiet"
              dangerous_className={styles.iconViewCopy}
            />
            {viewCount && asCompactNumber(viewCount)}
            &nbsp;
            {showLabels && viewText}
          </span>
        </div>
      )}
    </div>
  );
};

export const BoardMenuViewsAndCopies: React.FunctionComponent<{
  idBoard: string;
  isTemplate: boolean;
  showLabels: boolean;
}> = ({ idBoard, isTemplate, showLabels }) => {
  const { data, error, loading } = useBoardStatsQuery({
    variables: { boardId: idBoard },
  });

  const copyCount = data?.board?.stats?.copyCount ?? 0;
  const viewCount = data?.board?.stats?.viewCount ?? 0;

  const shouldShowViewCopy = isTemplate && copyCount >= 0 && viewCount > 0;

  if (error || loading) {
    return null;
  }

  return (
    <div>
      {shouldShowViewCopy && (
        <div className={styles.viewCopyComponent}>
          <hr />
          <ViewsAndCopies
            isTemplate={isTemplate}
            showLabels={showLabels}
            useSmallTextStyle={false}
            copyCount={copyCount}
            viewCount={viewCount}
          />
          <hr />
        </div>
      )}
    </div>
  );
};
