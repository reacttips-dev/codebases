import PropTypes from 'prop-types';

export default PropTypes.shape({
    question: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    answers: PropTypes.arrayOf(PropTypes.string),
    range: PropTypes.number,
    hasInput: PropTypes.bool,
});