import React, { useCallback, useState } from 'react';

import styles from './TemplatePickerCollapsibleSection.less';
import classNames from 'classnames';
import { RemoveIcon } from '@trello/nachos/icons/remove';
import { AddIcon } from '@trello/nachos/icons/add';
import { forNamespace } from '@trello/i18n';

const format = forNamespace('');

interface TemplatePickerCollapsibleSectionProps {
  title: string;
  onToggle: () => void;
  trackToggle: (closing: boolean) => void;
  tabIndex?: number;
}

export const TemplatePickerCollapsibleSection: React.FunctionComponent<TemplatePickerCollapsibleSectionProps> = ({
  title,
  onToggle,
  trackToggle,
  tabIndex,
  children,
}) => {
  const [open, setOpen] = useState(true);

  const toggleCollapsibleSection = useCallback(() => {
    trackToggle(open);
    setOpen(!open);
    onToggle();
  }, [onToggle, open, trackToggle]);

  return (
    <div className={styles.collapsible}>
      <div className={classNames(styles.header, styles.sectionHeader)}>
        <span className={classNames(styles.title, styles.sectionHeaderTitle)}>
          <span className={styles.titleWrapper}>
            <span
              className={classNames(styles.title, styles.sectionHeaderTitle)}
            >
              {title}
            </span>
          </span>
        </span>
        <button
          onClick={toggleCollapsibleSection}
          className={classNames(
            {
              [styles.toggleOpen]: open,
            },
            [styles.toggle, styles.sectionToggle],
          )}
          tabIndex={tabIndex}
          aria-label={format('collapse')}
        >
          <RemoveIcon
            size="small"
            color="quiet"
            dangerous_className={styles.toggleIcon}
          />
          <AddIcon
            size="small"
            color="quiet"
            dangerous_className={styles.toggleIcon}
          />
        </button>
      </div>
      <div
        className={classNames({
          [styles.open]: open,
          [styles.closed]: !open,
        })}
      >
        {children}
      </div>
    </div>
  );
};
