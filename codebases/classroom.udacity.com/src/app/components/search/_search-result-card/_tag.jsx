import PropTypes from 'prop-types';
import styles from './_tag.scss';

const Tag = cssModule(
  ({ text, icon }) => (
    <div styleName="tag-container">
      {icon}
      <span styleName="label">{text}</span>
    </div>
  ),
  styles
);

Tag.propTypes = {
  text: PropTypes.string.isRequired,
  glyph: PropTypes.string,
};

Tag.displayName = 'search/_result-card/_tag';

export default Tag;
