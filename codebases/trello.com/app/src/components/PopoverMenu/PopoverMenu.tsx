import { TestId } from '@trello/test-ids';
import classNames from 'classnames';
import { forwardRefComponent } from 'app/src/forwardRefComponent';
import RouterLink from 'app/src/components/RouterLink/RouterLink';
import React from 'react';
import styles from './PopoverMenu.less';
import { useFocusRing } from '@trello/a11y';

interface ContentProps {
  description?: React.ReactNode;
  rawDescription?: string;
  title?: React.ReactNode;
  icon?: JSX.Element;
}

interface BaseProps extends ContentProps {
  appendSeparator?: boolean;
}

interface PopoverMenuButtonProps extends BaseProps {
  onClick: React.EventHandler<React.MouseEvent<HTMLButtonElement>>;
  className?: string;
  disabled?: boolean;
  testId?: TestId;
}

interface PopoverMenuLinkProps extends BaseProps {
  href: string;
  target?: string;
  onClick?: React.EventHandler<React.MouseEvent<HTMLAnchorElement>>;
  testId?: TestId;
  className?: string;
  icon?: JSX.Element;
}

const PopoverMenuItemContents: React.FunctionComponent<ContentProps> = ({
  children,
  description,
  rawDescription,
  title,
  icon,
}) => (
  <>
    {icon && React.cloneElement(icon, { size: 'small' })}
    <span
      className={classNames(styles.title, description && styles.withoutMargins)}
    >
      {title ? title : children}
    </span>
    {(description || rawDescription) && (
      <p className={styles.description}>
        {description ? description : rawDescription}
      </p>
    )}
  </>
);

interface PopoverMenuItemProps extends Pick<BaseProps, 'appendSeparator'> {}

const PopoverMenuItem: React.FunctionComponent<PopoverMenuItemProps> = ({
  appendSeparator,
  children,
}) => (
  <li
    className={classNames(styles.item, appendSeparator && styles.withSeparator)}
  >
    {children}
  </li>
);

export const PopoverMenuLink: React.FunctionComponent<PopoverMenuLinkProps> = ({
  appendSeparator,
  testId,
  href,
  target,
  className,
  onClick,
  ...contentProps
}) => {
  const [hasFocusRing, mouseEvents] = useFocusRing();

  return (
    <PopoverMenuItem appendSeparator={appendSeparator}>
      <RouterLink
        className={classNames(
          styles.link,
          className,
          hasFocusRing && styles.linkFocusRing,
        )}
        href={href}
        testId={testId}
        onClick={onClick}
        target={target}
        {...mouseEvents}
      >
        <PopoverMenuItemContents {...contentProps} />
      </RouterLink>
    </PopoverMenuItem>
  );
};

export const PopoverMenuButton = forwardRefComponent<
  HTMLButtonElement,
  PopoverMenuButtonProps
>(
  'PopoverMenuButton',
  (
    {
      appendSeparator,
      onClick,
      className,
      disabled,
      testId,
      ...contentProps
    }: PopoverMenuButtonProps,
    ref: React.RefObject<HTMLButtonElement>,
  ) => {
    const [hasFocusRing, mouseEvents] = useFocusRing();

    return (
      <PopoverMenuItem appendSeparator={appendSeparator}>
        <button
          className={classNames(
            styles.link,
            hasFocusRing && styles.linkFocusRing,
            className,
          )}
          disabled={disabled}
          onClick={onClick}
          data-test-id={testId}
          ref={ref}
          {...mouseEvents}
        >
          <PopoverMenuItemContents {...contentProps} />
        </button>
      </PopoverMenuItem>
    );
  },
);

interface PopoverMenuProps {
  className?: string;
  testId?: TestId;
}

export const PopoverMenu: React.FunctionComponent<PopoverMenuProps> = ({
  className,
  children,
  testId,
}) => (
  <nav className={className}>
    <ul data-test-id={testId}>{children}</ul>
  </nav>
);
