import PropTypes from 'prop-types';

export const DefaultPosition = {position: {x: 0, y: 0}};

const PositionType = {
  position: PropTypes.shape({
    x: PropTypes.number,
    y: PropTypes.number
  })
};

export default PositionType;
