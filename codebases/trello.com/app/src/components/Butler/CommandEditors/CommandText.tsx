import React from 'react';
import { Textfield, TextfieldProps } from '@trello/nachos/textfield';
import styles from './CommandText.less';

interface Props extends Omit<TextfieldProps, 'appearance' | 'style'> {
  width?: string | number;
}

export const CommandText: React.FunctionComponent<Props> = (props) => (
  <Textfield
    className={styles.commandText}
    appearance="borderless"
    spacing="compact"
    {...props}
  />
);
