import React from 'react';

import styles from './styles.sass';

const noop = () => null;
interface IOutsideClickContainerProps {
  children: React.ReactNode;
  onClickOutside: () => void;
  className?: string;
}

const defaultProps = {
  onClickOutside: noop,
};

interface OutsideClickContainerState {}

class OutsideClickContainer extends React.Component<
  IOutsideClickContainerProps,
  OutsideClickContainerState
> {
  public static defaultProps = defaultProps;
  private outsideWrapper?: HTMLDivElement;
  constructor(props: IOutsideClickContainerProps) {
    super(props);
  }

  public componentDidMount = () => {
    document.addEventListener('mousedown', this.handleClickOutside);
    document.addEventListener('touchstart', this.handleClickOutside);
  };

  public componentWillUnmount = () => {
    document.removeEventListener('mousedown', this.handleClickOutside);
    document.removeEventListener('touchstart', this.handleClickOutside);
  };

  public setWrapperRef = (node: HTMLDivElement): void => {
    this.outsideWrapper = node as any; // TODO: Do not use any here
  };

  public handleClickOutside: EventListener = e => {
    const { onClickOutside } = this.props;
    if (
      this.outsideWrapper &&
      e.target &&
      !this.outsideWrapper.contains(e.target as HTMLDivElement)
    ) {
      onClickOutside();
    }
  };

  public render() {
    const { children, className } = this.props;
    return (
      <div
        ref={this.setWrapperRef}
        className={`${styles.wrapper} ${className}`}
      >
        {children}
      </div>
    );
  }
}

export { OutsideClickContainer };
