import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

const CarouselIndicators = (props) => {
  const { items, activeIndex, onClickHandler, className } = props;

  const listClasses = classNames(className, 'carousel-indicators');
  const indicators = items.map((item, idx) => {
    const indicatorClasses = classNames(
      { active: activeIndex === idx }
    );
    return (
      <li
        key={`${item.key || item.src}${item.caption}${item.altText}`}
        onClick={(e) => {
          e.preventDefault();
          onClickHandler(idx);
        }}
        className={indicatorClasses}
      />);
  });

  return (
    <ol className={listClasses}>
      {indicators}
    </ol>
  );
};

CarouselIndicators.propTypes = {
  items: PropTypes.array.isRequired,
  activeIndex: PropTypes.number.isRequired,
  onClickHandler: PropTypes.func.isRequired,
  className: PropTypes.string
};

export default CarouselIndicators;
