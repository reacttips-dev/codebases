import Card from './card';
import CardButton from './card-button';
import NanodegreeHelper from 'helpers/nanodegree-helper';
import NodeHelper from 'helpers/node-helper';
import SemanticTypes from 'constants/semantic-types';

export default class LatestActivity extends React.Component {
  static displayName = 'me/cards/latest-activity';

  _getLatest = () => {
    const { lastViewedNanodegree, lastViewedCourse } = this.props;

    return (
      _.chain([lastViewedCourse, lastViewedNanodegree])
        .compact()
        .sortBy(
          (node) =>
            Date.now() -
            (NodeHelper.getLastViewedAt(node)
              ? NodeHelper.getLastViewedAt(node).getTime()
              : 0)
        )
        .first()
        .value() || {}
    );
  };

  _renderButton = (handleClick, cardProps) => {
    const { isReadyForGraduation } = cardProps;

    return (
      <CardButton
        isLatest
        handleClick={handleClick}
        isReadyForGraduation={isReadyForGraduation}
      />
    );
  };

  render() {
    const lastViewed = this._getLatest();
    if (_.isEmpty(lastViewed)) {
      return null;
    }

    const isReadyForGraduation =
      _.get(lastViewed, 'is_ready_for_graduation', false) ||
      _.get(lastViewed, 'enrollment.is_ready_for_graduation', false);

    const {
      key,
      version,
      title,
      summary,
      semantic_type,
      is_graduated,
      is_graduation_legacy,
    } = lastViewed;

    return (
      <Card
        key={key + version}
        title={title}
        summary={summary}
        nanodegreeKey={semantic_type === SemanticTypes.NANODEGREE ? key : null}
        courseKey={semantic_type === SemanticTypes.COURSE ? key : null}
        partKey={semantic_type === SemanticTypes.PART ? key : null}
        type={semantic_type}
        isGraduated={is_graduated}
        isGraduationLegacy={is_graduation_legacy}
        isReadyForGraduation={isReadyForGraduation}
        isLatest
        isExecutiveProgram={NanodegreeHelper.isExecutiveProgram(lastViewed)}
        isPaidSingleCourse={NanodegreeHelper.isPaidSingleCourse(lastViewed)}
        renderButton={this._renderButton}
      />
    );
  }
}
