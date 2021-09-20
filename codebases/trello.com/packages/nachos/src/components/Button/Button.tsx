import React from 'react';
import classNames from 'classnames';
import { useFocusRing } from '@react-aria/focus';
import Spinner from '@atlaskit/spinner';
import { TestId } from '@trello/test-ids';
import { makeComponentClasses } from '../makeComponentClasses';
import styles from './Button.less';

const toCamelCase = (str: string) =>
  str.toLowerCase().replace(/[^a-zA-Z0-9]+(.)/g, (m, chr) => chr.toUpperCase());

type ButtonAppearances =
  | 'default'
  | 'primary'
  | 'danger'
  | 'transparent'
  | 'transparent-dark'
  | 'link'
  | 'subtle'
  | 'subtle-link'
  // !deprecate
  | 'icon';

export interface ButtonProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'disabled'> {
  /** The visible appearance of a button.
   *
   * @default 'default'
   */
  appearance?: ButtonAppearances;
  /** A string of classnames to be applied
   *
   */
  className?: string;
  /**
   * The content of the button.
   * @default null
   */
  children?: React.ReactNode;
  /** A function to fire when the element is clicked
   *
   */
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  /** An icon to render after the button content
   *
   */
  iconAfter?: JSX.Element;
  /** An icon to render before the button content.
   * If this prop is provided with no other children, the
   * icon will be styled as if it is a square "Icon Button"
   *
   */
  iconBefore?: JSX.Element;
  /**
   * If `true`, the loading state is activated. This renders a Spinner component inside the button.
   * Click events to the button are disabled at this time, but the button does
   * not appear disabled. Since the button's width may change when the spinner is
   * rendered, it is recommended to add a `min-width` property to
   * prevent drastic changes in appearance.
   * @default false
   */
  isLoading?: boolean;
  /**
   * If `true`, the button will be disabled.
   * @default false
   */
  isDisabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
  /**
   * If `true`, the button will take up the full width of its container.
   * @default false
   */
  shouldFitContainer?: boolean;
  /**
   * The size of the button.
   * @default '"default"'
   */
  size?: 'default' | 'wide' | 'fullwidth';
  /**
   * A string to help identify the component during integration tests.
   */
  testId?: TestId;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      onClick,
      onKeyUp,
      className,
      appearance = 'default',
      size = 'default',
      testId,
      iconAfter,
      iconBefore,
      isLoading,
      isDisabled,
      shouldFitContainer,
      // https://developer.mozilla.org/en-US/docs/Web/HTML/Element/button
      // the default behavior is actually "submit", but we are retaining this
      // behavior from the previous component. This is something to revisit if
      // we want this component to be analogous to the native html <button>
      // AtlasKit Button also has similar behavior
      type = 'button',
      ...buttonAttrs
    },
    ref,
  ) => {
    const { isFocusVisible, focusProps } = useFocusRing();
    if (shouldFitContainer) {
      size = 'fullwidth';
    }

    let buttonContent = children;

    if (iconAfter || iconBefore) {
      buttonContent = (
        <>
          {iconBefore &&
            React.cloneElement(iconBefore, {
              color: iconBefore.props.color || 'dark',
              dangerous_className: classNames(
                {
                  [styles.iconOnly]: !children,
                  [styles.iconBefore]: children,
                },
                iconBefore.props.dangerous_className,
              ),
            })}
          {children}
          {iconAfter &&
            React.cloneElement(iconAfter, {
              color: iconAfter.props.color || 'dark',
              dangerous_className: classNames(
                styles.iconAfter,
                iconAfter.props.dangerous_className,
              ),
            })}
        </>
      );
    }

    const { componentCx: buttonCx } = makeComponentClasses(Button.displayName!);

    return (
      <button
        ref={ref}
        disabled={isDisabled}
        className={classNames(
          className,
          styles[buttonCx()],
          styles[buttonCx('', toCamelCase(appearance))],
          styles[buttonCx('', size)],
          {
            [styles[buttonCx('', 'loading')]]: isLoading,
            [styles[buttonCx('', 'disabled')]]: isDisabled,
            [styles[buttonCx('iconButton')]]: iconBefore && !children,
            [styles.focusVisible]: isFocusVisible,
          },
        )}
        onClick={onClick}
        data-test-id={testId}
        type={type}
        {...focusProps}
        {...buttonAttrs}
      >
        {isLoading ? <Spinner /> : buttonContent}
      </button>
    );
  },
);
Button.displayName = 'Button';

interface LinkProps {
  children: React.ReactNode;
  link: string;
  isPrimary?: boolean;
  onClick?: React.EventHandler<React.MouseEvent<HTMLElement>>;
  openInNewTab?: boolean;
  className?: string;
  download?: string;
}

export const ButtonLink = ({
  children,
  link,
  isPrimary,
  onClick,
  openInNewTab,
  className,
  download,
}: LinkProps) => {
  const buttonStyle: string = isPrimary
    ? styles.primaryButtonLink
    : styles.defaultButtonLink;
  let linkTarget: string | undefined = undefined;
  let rel: string | undefined = undefined;

  if (openInNewTab) {
    linkTarget = '_blank';
    rel = 'noreferrer';
  }
  if (download) {
    linkTarget = '_blank';
  }

  return (
    <a
      href={link}
      className={classNames(buttonStyle, className)}
      onClick={onClick}
      target={linkTarget}
      rel={rel}
      download={download}
    >
      <span>{children}</span>
    </a>
  );
};
