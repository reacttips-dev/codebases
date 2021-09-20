import { IconStarEmpty, IconStarFull } from '@udacity/veritas-icons';
import { THEMES, ThemeType } from 'constants/theme';
import PropTypes from 'prop-types';
import React from 'react';
import { __ } from 'services/localization-service';
import styles from './star-rating.scss';

export const RATING_SCALE = 5;

@cssModule(styles)
export default class StarRating extends React.Component {
  static displayName = 'common/star-rating';

  static propTypes = {
    onClick: PropTypes.func,
    rating: PropTypes.oneOf([1, 2, 3, 4, 5]),
    theme: ThemeType,
    fixed: PropTypes.bool,
  };

  static defaultProps = {
    rating: null,
    theme: THEMES.LIGHT,
    fixed: false,
  };

  state = {
    hoverRating: null,
  };

  renderStarGlyph(star) {
    return this._getRating() >= star.number ? (
      <IconStarFull text={star.title} size="sm" />
    ) : (
      <IconStarEmpty text={star.title} size="sm" />
    );
  }

  _getRating() {
    const { rating } = this.props;
    const { hoverRating } = this.state;

    return _.isNil(hoverRating) ? rating : hoverRating;
  }

  handleMouseOver = (evt, star) => {
    const { fixed } = this.props;
    const hoverRating = star.number;
    !fixed &&
      this.setState({
        hoverRating,
      });
  };

  handleMouseOut = () => {
    this.setState({ hoverRating: null });
  };

  handleClick = (evt, star) => {
    const { onClick } = this.props;
    const activeStar = star.number;

    evt.preventDefault();

    this.setState({ activeStar });
    onClick(activeStar);
  };

  render() {
    const { theme } = this.props;
    const stars = _.times(RATING_SCALE, (index) => ({
      number: index + 1,
      title: __('<%= star %> Star', { star: index + 1 }),
    }));

    return (
      <ol
        styleName={`star-rating-${theme}`}
        onMouseLeave={(evt) => this.handleMouseOut(evt)}
      >
        {stars.map((star) => (
          <li styleName="star" key={star.number}>
            <a
              href="#"
              onFocus={(evt) => this.handleMouseOver(evt, star)}
              onMouseOver={(evt) => this.handleMouseOver(evt, star)}
              onClick={(evt) => this.handleClick(evt, star)}
              title={star.title}
            >
              {this.renderStarGlyph(star)}
            </a>
          </li>
        ))}
      </ol>
    );
  }
}
