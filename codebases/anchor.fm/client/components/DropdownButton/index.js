import React, { Component } from 'react';
import styles from './styles.sass';

class DropdownButton extends Component {
  state = {
    isActive: false,
  };

  handleClick = e => {
    const { isActive } = this.state;
    const { onClick } = this.props;
    this.setState({ isActive: !isActive });
    if (onClick) onClick(e);
  };

  handleHover = () => {
    this.setState({ isActive: true });
  };

  handleBlur = () => {
    this.setState({ isActive: false });
  };

  render() {
    const {
      activeOnHover,
      direction = 'bottom',
      dropdownComponent,
      className,
      children,
      preventBlur,
      ariaLabel,
    } = this.props;
    const { isActive } = this.state;
    return (
      <div className={styles.dropdownButton}>
        <button
          aria-label={ariaLabel}
          type="button"
          {...(activeOnHover
            ? {
                onMouseOver: this.handleHover,
                onMouseOut: this.handleBlur,
              }
            : {
                onClick: this.handleClick,
              })}
          className={className}
          onBlur={!preventBlur ? this.handleBlur : null}
        >
          {children}
        </button>
        {isActive ? (
          <div className={`${styles.dropdown} ${styles[direction]} `}>
            {React.cloneElement(dropdownComponent, {
              onClose: this.handleBlur,
            })}
          </div>
        ) : null}
      </div>
    );
  }
}

export { DropdownButton };
