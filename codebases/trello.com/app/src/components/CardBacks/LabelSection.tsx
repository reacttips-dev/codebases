import React, { useMemo } from 'react';
import classNames from 'classnames';
import { forTemplate } from '@trello/i18n';
import { sortLabels } from 'app/src/components/Label';

import styles from './LabelSection.less';
import { Gutter } from './Gutter';

const format = forTemplate('card_detail');

interface Label {
  id: string;
  name: string;
  color?: string | null;
}

interface LabelSectionProps {
  colorblind: boolean;
  labels: Label[];
}

const Label = ({
  name,
  color,
  colorblind,
}: Label & { colorblind: boolean }) => (
  <div
    className={classNames(
      styles.label,
      color ? styles[color] : styles.noColor,
      colorblind && styles.colorblind,
    )}
    title={name}
  >
    <span className={styles.labelName}>{name}</span>
  </div>
);

export const LabelSection = ({ labels, colorblind }: LabelSectionProps) => {
  const sortedLabels = useMemo(() => sortLabels(labels), [labels]);

  return (
    <Gutter>
      <div
        className={classNames(
          styles.labelSection,
          colorblind && styles.colorblindd,
        )}
      >
        <h3 className={styles.heading}>{format('labels')}</h3>
        {sortedLabels.map((label) => (
          <Label key={label.id} {...label} colorblind={colorblind} />
        ))}
      </div>
      <div className={styles.clearfix} />
    </Gutter>
  );
};
