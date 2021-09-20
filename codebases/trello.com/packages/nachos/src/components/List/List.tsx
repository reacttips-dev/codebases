import React from 'react';
import cx from 'classnames';

import {
  GLOBAL_NAMESPACE_PREFIX,
  ListClassnameLabel,
  ComponentAppearanceStatic,
  ComponentStateSelected,
  ListClassnameBase,
  ListClassnameCell,
  ListClassnameContent,
  ListClassnameImage,
  ListClassnameItem,
  ListClassnameMeta,
} from '../../../tokens';

import styles from './List.less';

interface ItemObject {
  value?: string;
  label: string;
  image?: string | React.ReactNode;
  meta?: string | React.ReactNode;
  isSelected?: boolean;
}
type ItemType = string | ItemObject;
type ItemsType = ItemType[];

export const ListClasses = {
  LIST: `${GLOBAL_NAMESPACE_PREFIX}${ListClassnameBase}`,
  ITEM: `${GLOBAL_NAMESPACE_PREFIX}${ListClassnameBase}__${ListClassnameItem}`,
  CELL: {
    BASE: `${GLOBAL_NAMESPACE_PREFIX}${ListClassnameBase}__${ListClassnameCell}`,
    IMAGE: `${GLOBAL_NAMESPACE_PREFIX}${ListClassnameBase}__${ListClassnameCell}-${ListClassnameImage}`,
    META: {
      BASE: `${GLOBAL_NAMESPACE_PREFIX}${ListClassnameBase}__${ListClassnameCell}-${ListClassnameMeta}`,
      SELECTED: `${GLOBAL_NAMESPACE_PREFIX}${ListClassnameBase}__${ListClassnameCell}-${ListClassnameMeta}--${ComponentStateSelected}`,
    },
    LABEL: `${GLOBAL_NAMESPACE_PREFIX}${ListClassnameBase}__${ListClassnameCell}-${ListClassnameLabel}`,
    CONTENT: `${GLOBAL_NAMESPACE_PREFIX}${ListClassnameBase}__${ListClassnameCell}-${ListClassnameContent}`,
  },
  // For usage with static selects
  // includes styles for indicator
  STATIC: `${GLOBAL_NAMESPACE_PREFIX}${ListClassnameBase}--${ComponentAppearanceStatic}`,
};

export interface ListProps {
  className?: string;
  style?: React.CSSProperties;
  /**
   * An array of strings or objects that will be rendered as list items
   **/
  items: ItemsType;
}

export const ListItem: React.FunctionComponent<object> = (props) => {
  return (
    <li className={styles[ListClasses.ITEM]} {...props}>
      {props.children}
    </li>
  );
};

export const ListCell: React.FunctionComponent<ItemObject> = (props) => {
  const { meta, image, label, isSelected } = props;
  let optionsImage = null;
  if (image) {
    if (typeof image === 'string') {
      optionsImage = (
        <img
          className={styles[ListClasses.CELL.IMAGE]}
          alt={label}
          src={image}
        />
      );
    }

    if (React.isValidElement(image)) {
      optionsImage = (
        <div className={styles[ListClasses.CELL.IMAGE]}>{image}</div>
      );
    }
  }

  const metaClassname = cx({
    [styles[ListClasses.CELL.META.BASE]]: true,
    [styles[ListClasses.CELL.META.SELECTED]]: isSelected,
  });

  return (
    <li className={styles[ListClasses.CELL.BASE]} {...props}>
      {optionsImage && optionsImage}
      <div className={styles[ListClasses.CELL.CONTENT]}>
        <div className={styles[ListClasses.CELL.LABEL]}>{label}</div>
        {meta && <div className={metaClassname}>{meta}</div>}
      </div>
    </li>
  );
};

export const List: React.FunctionComponent<ListProps> = (props) => {
  const { items, className, ...rest } = props;
  const listClassName = cx(
    {
      [styles[ListClasses.LIST]]: true,
    },
    className,
  );

  return (
    <>
      {items.length && (
        <ul className={listClassName} {...rest}>
          {items.map((item, idx) => {
            if (typeof item === 'string') {
              return <ListItem key={idx}>{item}</ListItem>;
            }

            if (Object.prototype.hasOwnProperty.call(item, 'label')) {
              return <ListCell key={idx} {...item} />;
            }
          })}
        </ul>
      )}
    </>
  );
};
