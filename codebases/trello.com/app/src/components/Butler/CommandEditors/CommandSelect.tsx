import React from 'react';
import { Select, SelectProps } from '@trello/nachos/select';
import { forNamespace } from '@trello/i18n';
import styles from './CommandSelect.less';

const format = forNamespace(['butler', 'command editor']);

interface Props
  extends Omit<SelectProps, 'appearance' | 'containerStyle' | 'spacing'> {
  width: string;
}

export const CommandSelect: React.FunctionComponent<Props> = ({
  width,
  ...rest
}) => (
  <Select
    appearance="subtle"
    containerClassName={styles.select}
    containerStyle={{ width }}
    spacing="compact"
    // eslint-disable-next-line react/jsx-no-bind
    noOptionsMessage={() => format('no options')}
    {...rest}
  />
);

// Generic Select option type. Not binding, just a utility — if more complex
// option types need to be introduced, feel free to deviate.
export interface SelectOption {
  label: string;
  value: string;
}
