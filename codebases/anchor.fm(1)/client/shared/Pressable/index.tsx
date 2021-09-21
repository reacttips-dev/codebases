import { css } from 'emotion';
import React from 'react';
import { PressableProps, PressableState } from './Pressable.d';

// NOTE:
//   Here's a great link on designing buttons
//   https://medium.com/eightshapes-llc/buttons-in-design-systems-eac3acf7e23

const SPACE_CHAR_CODE: number = 32;
const ENTER_CHAR_CODE: number = 13;

const noop = () => null;
/**
 * @deprecated Use a plain `Button` instead
 */
class Pressable extends React.Component<PressableProps, PressableState> {
  // eslint-disable-next-line react/static-property-placement
  public static defaultProps = {
    fullHeight: false,
    fullWidth: false,
    isEventBubblingAllowed: false,
    isDefaultBehaviorAllowed: false,
    mouseCursor: 'pointer',
    onMouseEnter: noop,
    onMouseLeave: noop,
    onPress: noop,
    display: 'inline-block',
  };

  constructor(props: PressableProps) {
    super(props);
    this.state = {
      isPressed: false,
    };
  }

  public handleMouseDown = (evt: React.MouseEvent): void => {
    const { isEventBubblingAllowed, isDefaultBehaviorAllowed } = this.props;
    if (!isEventBubblingAllowed) {
      evt.stopPropagation();
    }
    if (!isDefaultBehaviorAllowed) {
      evt.preventDefault();
    }
    this.setState(() => ({
      isPressed: true,
    }));
  };

  public handleMouseUp = () => {
    this.setState(() => ({
      isPressed: false,
    }));
  };

  public handleTouchStart = (evt: React.TouchEvent): void => {
    const { isEventBubblingAllowed } = this.props;
    if (!isEventBubblingAllowed) {
      evt.stopPropagation();
    }
    this.setState(() => ({
      isPressed: true,
    }));
  };

  public handleTouchEnd = (evt: React.TouchEvent) => {
    const {
      isEventBubblingAllowed,
      isDefaultBehaviorAllowed,
      onPress,
    } = this.props;
    if (!isEventBubblingAllowed) {
      evt.stopPropagation();
    }
    if (!isDefaultBehaviorAllowed) {
      evt.preventDefault();
    }
    this.setState(() => ({
      isPressed: false,
    }));
    onPress(evt);
  };

  public handleTouchCancel = () => {};

  public handleMouseLeave = () => {
    this.setState(() => ({
      isPressed: false,
    }));
  };

  public handleClick = (evt: React.MouseEvent): void => {
    const {
      isEventBubblingAllowed,
      isDefaultBehaviorAllowed,
      onPress,
    } = this.props;
    if (!isEventBubblingAllowed) {
      evt.stopPropagation();
    }
    if (!isDefaultBehaviorAllowed) {
      evt.preventDefault();
    }
    onPress(evt);
  };

  public render() {
    const { children, onPress, fullWidth, fullHeight, display } = this.props;
    const { isPressed } = this.state;
    const handleKeyPress = (evt: React.KeyboardEvent): void => {
      if (
        evt.charCode === SPACE_CHAR_CODE ||
        evt.charCode === ENTER_CHAR_CODE
      ) {
        // Prevent the default action to stop scrolling when space is pressed
        // evt.preventDefault();
        onPress(evt);
      }
    };

    const className = css({
      ':hover': {
        outline: 0,
      },
      outline: 0,
      display,
      height: fullHeight ? '100%' : 'auto',
      verticalAlign: 'top',
      width: fullWidth ? '100%' : 'auto',
    });

    return (
      <div
        onClick={this.handleClick}
        onMouseDown={this.handleMouseDown}
        onMouseUp={this.handleMouseUp}
        onMouseLeave={this.handleMouseLeave}
        onTouchStart={this.handleTouchStart}
        onTouchEnd={this.handleTouchEnd}
        onTouchCancel={this.handleTouchCancel}
        role="button"
        tabIndex={0}
        onKeyPress={handleKeyPress}
        className={className}
      >
        {children({ isPressed })}
      </div>
    );
  }
}

export { Pressable as default, Pressable };
