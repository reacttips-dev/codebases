import _ from 'underscore';
import React, { useState, useCallback } from 'react';
import cx from 'classnames';
import { useShortcut, Scope, Key } from '@trello/keybindings';
import { CheckIcon } from '@trello/nachos/icons/check';

import styles from './PopoverList.less';

interface PopoverListItemProps<ValueType> {
  name: string;
  value: ValueType;
  checked?: boolean | ((value: ValueType) => boolean);
  icon?: React.ReactNode;
  className?: string;
  onClick?: (value: ValueType) => void;
}

export const PopoverListItem = <ValueType,>({
  name,
  value,
  checked,
  icon,
  className,
  onClick,
}: PopoverListItemProps<ValueType>) => {
  const onClickHandler = useCallback(() => onClick && onClick(value), [
    onClick,
    value,
  ]);
  const isChecked = _.isFunction(checked) ? checked(value) : checked;

  return (
    <a role="button" onClick={onClickHandler}>
      <li
        className={cx(styles.popoverListItem, className, {
          [styles.hasIcon]: !!icon,
        })}
      >
        {icon}
        <div className={styles.itemNameWrapper}>
          <span className={styles.itemName}>{name}</span>
        </div>
        {isChecked && (
          <CheckIcon size="small" dangerous_className={styles.iconCheck} />
        )}
      </li>
    </a>
  );
};

interface PopoverListGroupProps<ValueType> {
  name: string;
  items: PopoverListItemProps<ValueType>[];
}

export const PopoverListGroup = <ValueType,>({
  name,
  items,
}: PopoverListGroupProps<ValueType>) => {
  return (
    <div className={styles.popoverSection}>
      <h4>{name}</h4>
      {items.map((itemProps, index) => (
        <PopoverListItem key={`${name}-${index}`} {...itemProps} />
      ))}
    </div>
  );
};

interface PopoverListProps<ValueType> {
  items: (PopoverListItemProps<ValueType> | PopoverListGroupProps<ValueType>)[];
  searchable?: boolean;
  searchPlaceholder?: string;
  className?: string;
}

export const PopoverList = <ValueType,>({
  items,
  searchable,
  searchPlaceholder,
  className,
}: PopoverListProps<ValueType>) => {
  const [searchQuery, setSearchQuery] = useState('');

  const onSearch = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value),
    [setSearchQuery],
  );

  useShortcut(
    () => {
      setSearchQuery('');
    },
    {
      scope: Scope.Popover,
      key: Key.Escape,
      enabled: searchQuery.length > 0,
    },
  );

  let itemsToShow: (
    | PopoverListItemProps<ValueType>
    | PopoverListGroupProps<ValueType>
  )[] = items;

  if (searchQuery?.length && items.length) {
    itemsToShow = items
      .map((itemProps) => {
        if ((itemProps as PopoverListGroupProps<ValueType>).items) {
          const filteredGroup = {
            ...itemProps,
            items: (itemProps as PopoverListGroupProps<ValueType>).items.filter(
              (item) =>
                item.name
                  .toLocaleLowerCase()
                  .includes(searchQuery.toLocaleLowerCase()),
            ),
          };

          if (filteredGroup.items.length) {
            return filteredGroup;
          } else {
            return null;
          }
        } else if (
          itemProps.name
            .toLocaleLowerCase()
            .includes(searchQuery.toLocaleLowerCase())
        ) {
          return itemProps;
        }

        return null;
      })
      .filter(
        (
          itemProps:
            | PopoverListItemProps<ValueType>
            | PopoverListGroupProps<ValueType>
            | null,
        ): itemProps is
          | PopoverListItemProps<ValueType>
          | PopoverListGroupProps<ValueType> => !!itemProps,
      );
  }

  return (
    <>
      {searchable && (
        <input
          type="text"
          className={styles.searchInput}
          placeholder={searchPlaceholder}
          value={searchQuery}
          onChange={onSearch}
        />
      )}
      <ul className={cx(styles.popoverList, className)}>
        {itemsToShow.map((itemProps, index) => {
          if ((itemProps as PopoverListGroupProps<ValueType>).items) {
            return (
              <PopoverListGroup
                key={index}
                {...(itemProps as PopoverListGroupProps<ValueType>)}
              />
            );
          }

          return (
            <PopoverListItem
              key={index}
              {...(itemProps as PopoverListItemProps<ValueType>)}
            />
          );
        })}
      </ul>
    </>
  );
};
