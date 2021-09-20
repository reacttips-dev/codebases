import PropTypes from 'prop-types';
import styles from './_card.scss';

const CardContents = cssModule(
  ({ icon, imageUrl, primary, renderCTA, summary, title }) => {
    return (
      <div styleName="contents">
        {imageUrl && <img src={imageUrl} styleName="card-image" alt={title} />}
        {icon && <div styleName="icon">{icon}</div>}
        <div styleName="text">
          {title && <h3>{title}</h3>}
          {summary && <p styleName="summary">{summary}</p>}
        </div>
        {renderCTA && <div styleName="cta">{renderCTA({ primary })}</div>}
      </div>
    );
  },
  styles
);

CardContents.displayName = 'nanodegree-dashboard/overview/card/_card';
CardContents.propTypes = {
  icon: PropTypes.element,
  imageUrl: PropTypes.string,
  primary: PropTypes.bool,
  renderCTA: PropTypes.func,
  summary: PropTypes.string,
  title: PropTypes.string,
};

const Card = ({ footer, header, ...cardContentsProps }) => {
  return (
    <li
      styleName={cardContentsProps.primary ? 'card-primary' : 'card-secondary'}
    >
      {header}
      <CardContents {...cardContentsProps} />
      {footer}
    </li>
  );
};

Card.displayName = 'nanodegree-dashboard/overview/card/_card';
Card.propTypes = {
  footer: PropTypes.node,
  header: PropTypes.node,
  ...CardContents.propTypes,
};

Card.defaultProps = {
  primary: false,
};

const StyledCard = cssModule(Card, styles);

const MinimalCard = ({ intent, ...cardContentsProps }) => {
  return (
    <li styleName={`card-minimal-${intent}`}>
      <CardContents {...cardContentsProps} />
    </li>
  );
};

MinimalCard.displayName = 'nanodegree-dashboard/overview/card/_card';
MinimalCard.propTypes = {
  intent: PropTypes.oneOf(['primary', 'info', 'warning']),
  ...CardContents.propTypes,
};

MinimalCard.defaultProps = {
  primary: false,
};

const StyledMinimalCard = cssModule(MinimalCard, styles);

export { StyledCard as Card, StyledMinimalCard as MinimalCard };
