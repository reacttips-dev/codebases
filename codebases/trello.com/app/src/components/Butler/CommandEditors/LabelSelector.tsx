import React, { FunctionComponent, useMemo, useEffect } from 'react';
import cx from 'classnames';
import { Label } from '@atlassian/butler-command-parser';
import { formatButlerCommand as format } from 'app/src/components/Butler/formatButlerCommand';
import { sortLabels } from 'app/src/components/Label';
import { CommandSelect } from './CommandSelect';
import { validateLabel } from './validateCommand';
import { useActionLabelQuery } from './ActionLabelQuery.generated';

// eslint-disable-next-line @trello/less-matches-component
import styles from './CommandSelect.less';

export interface LabelSelectorProps {
  idBoard: string;
  onChange: (label: Label) => void;
  value?: Label;
  width?: string;
}

type LabelColor = NonNullable<Label['COLOR']>;

export const LabelSelector: FunctionComponent<LabelSelectorProps> = ({
  idBoard,
  onChange,
  value,
  width,
}) => {
  const { data, loading } = useActionLabelQuery({
    variables: { idBoard },
  });

  const labels = useMemo(
    () =>
      sortLabels([...(data?.board?.labels ?? [])]).map((label) => ({
        label: (
          <span
            className={cx({
              [styles.colorLabel]: true,
              [styles[`colorLabel--${label.color}`]]: !!label.color,
            })}
          >
            {label.name}
          </span>
        ),
        value: {
          COLOR: (label.color as LabelColor) ?? null,
          $TITLE: label.name,
        },
      })) ?? [],
    [data],
  );

  const selectedOption = useMemo(() => {
    if (!validateLabel(value)) {
      return;
    }
    return labels.find(
      ({ value: { COLOR, $TITLE } }) =>
        COLOR === value.COLOR && $TITLE === value.$TITLE,
    );
  }, [labels, value]);

  // Prepopulate first label if none are selected.
  useEffect(() => {
    if (!validateLabel(value) && labels.length) {
      // Note: onChange must assign `value` in the containing component to avoid
      // an infinite loop!
      onChange(labels[0].value);
    }
  }, [value, labels, onChange]);

  const placeholder = loading ? format('loading') : format('label');

  return (
    <CommandSelect
      key="labelSelector"
      isLoading={loading}
      placeholder={placeholder}
      // eslint-disable-next-line react/jsx-no-bind
      onChange={({ value }: { value: Label }) => {
        onChange(value);
      }}
      options={labels}
      value={selectedOption}
      width={width || '250px'}
    />
  );
};
