import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

const CarouselCaption = (props) => {
  const { captionHeader, captionText, className } = props;
  const classes = classNames(
    className,
    'carousel-caption',
    'd-none',
    'd-md-block'
  );

  return (
    <div className={classes}>
      {captionHeader && <h3>{captionHeader}</h3>}
      {captionText && <p>{captionText}</p>}
    </div>
  );
};

CarouselCaption.propTypes = {
  captionHeader: PropTypes.string,
  captionText: PropTypes.string.isRequired,
  className: PropTypes.string
};

export default CarouselCaption;
