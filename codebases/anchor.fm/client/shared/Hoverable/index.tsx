import { css } from 'emotion';
import React from 'react';
import { HoverableProps, HoverableState } from './Hoverable.d';

// TODO: change fullWidth and fullHeight to isFullWidth and isFullHeight

const noop = () => null;

/**
 * @deprecated Use plain CSS :hover instead
 */
class Hoverable extends React.Component<HoverableProps, HoverableState> {
  public static defaultProps = {
    onHoverStart: noop,
    onHoverEnd: noop,
    fullWidth: false,
    fullHeight: false,
    display: 'inline-block',
  };

  constructor(props: HoverableProps) {
    super(props);
    this.state = {
      isHovering: false,
    };
  }

  public handleMouseEnter = () => {
    const { onHoverStart } = this.props;
    this.setState(
      () => ({
        isHovering: true,
      }),
      () => {
        onHoverStart();
      }
    );
  };

  public handleMouseLeave = () => {
    const { onHoverEnd } = this.props;
    this.setState(
      () => ({
        isHovering: false,
      }),
      () => {
        onHoverEnd();
      }
    );
  };

  public render() {
    const { children, fullWidth, fullHeight } = this.props;
    const { isHovering } = this.state;

    const className = css({
      ':hover': {
        outline: 0,
      },
      outline: 0,
      display: this.props.display,
      height: fullHeight ? '100%' : 'auto',
      verticalAlign: 'top',
      width: fullWidth ? '100%' : 'auto',
    });

    return (
      <div
        className={className}
        onMouseEnter={this.handleMouseEnter}
        onMouseLeave={this.handleMouseLeave}
      >
        {children({ isHovering })}
      </div>
    );
  }
}
export { Hoverable as default, Hoverable };
