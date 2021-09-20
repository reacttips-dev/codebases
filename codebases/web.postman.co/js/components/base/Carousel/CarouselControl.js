import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import ForwardIcon from '../Icons/ForwardIcon';
import BackIcon from '../Icons/BackIcon';

const CarouselControl = (props) => {
  const { direction, onClickHandler, className } = props,
    anchorClasses = classNames(
      className,
      `carousel-control-${direction}`
    ),
    screenReaderClasses = classNames(
      'sr-only'
    ),
    getIcon = (dir) => { return dir === 'prev' ? <BackIcon /> : <ForwardIcon />; };

  return (
    <a
      className={anchorClasses}
      role='button'
      tabIndex='0'
      onClick={(e) => {
        e.preventDefault();
        onClickHandler();
      }}
    >
      <span className={screenReaderClasses}>
        {getIcon(direction)}
      </span>
    </a>
  );
};

CarouselControl.propTypes = {
  direction: PropTypes.oneOf(['prev', 'next']).isRequired,
  onClickHandler: PropTypes.func.isRequired,
  directionText: PropTypes.string,
  className: PropTypes.string
};

export default CarouselControl;
