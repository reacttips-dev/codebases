import React from 'react';
import { N40, N30 } from '@trello/colors';

import styles from './CardNotFound.less';

import cx from 'classnames';

import {
  CanonicalCard,
  CanonicalBoard,
} from '@atlassian/trello-canonical-components';

const { Board } = CanonicalBoard;

const { Card, CardTitle, CardCover } = CanonicalCard;

import { EditCardButton } from './EditCardButton';

import { forTemplate } from '@trello/i18n';
const format = forTemplate('mirror_card');

interface CardNotFoundProps {
  openEditor: () => void;
  isEditable: boolean;
  shouldShowEditCardButton: boolean;
}

export const CardNotFound = ({
  openEditor,
  isEditable,
  shouldShowEditCardButton,
}: CardNotFoundProps) => (
  <Board className={cx('board-background', styles.cardNotFound)} bgColor={N40}>
    <Card className={styles.cardNotFoundInner}>
      <EditCardButton
        onClick={openEditor}
        shouldShow={isEditable && shouldShowEditCardButton}
      />
      <CardCover
        height={40}
        img={require('resources/images/canonical-card/confused-taco.svg')}
        bgSize="contain"
        bgColor={N30}
      ></CardCover>
      <CardTitle>{format('unable-to-load-mirror-card')}</CardTitle>
    </Card>
  </Board>
);
