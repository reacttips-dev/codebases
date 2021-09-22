import classNames from 'classnames';
import React from 'react';
import { FormattedMessage } from 'js/lib/coursera.react-intl';
import _t from 'i18n!nls/ondemand';
import 'css!./__styles__/FeedbackPointsDisplay';

/**
 * Displays the points for an option when you are receiving a review.
 * @param actualPoints - if this is the "checked" option, pass the actual points that the learner received so that we
 *   can cross out `points` and show their actual points in case `actualPoints` differs from `points`.
 * @param points - the points on the option.
 */
class FeedbackPointsDisplay extends React.Component {
  static propTypes = {
    actualPoints: React.PropTypes.number,
    points: React.PropTypes.number.isRequired,
  };

  render() {
    const actualPointsDiffers = this.props.actualPoints != null && this.props.actualPoints !== this.props.points;
    const pointsDisplayClass = classNames({
      'crossed-out-points': actualPointsDiffers,
    });

    return (
      <span className="rc-FeedbackPointsDisplay">
        <span className={pointsDisplayClass}>
          <FormattedMessage
            message={_t('{points, plural, one{# point} other{# points}}')}
            points={this.props.points.toString()}
          />
        </span>
        {actualPointsDiffers && (
          <span>
            <FormattedMessage
              message={' ' + _t('+{points, plural, one{# pt} other{# pts}} because of a tie')}
              points={this.props.actualPoints.toString()}
            />
          </span>
        )}
      </span>
    );
  }
}

export default FeedbackPointsDisplay;
