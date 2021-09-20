import Card from './card';
import CardButton from './card-button';
import CardFooter from './card-footer';
import NanodegreeHelper from 'helpers/nanodegree-helper';
import SemanticTypes from 'constants/semantic-types';

export default class CurrentEnrollments extends React.Component {
  static displayName = 'me/cards/current-enrollments';

  _renderButton = (handleClick, enrollment) => {
    const { isReadyForGraduation } = enrollment;

    return (
      <CardButton
        handleClick={handleClick}
        isReadyForGraduation={isReadyForGraduation}
      />
    );
  };

  _renderFooter = (enrollment) => {
    const { isGraduated, isReadyForGraduation, inProgress } = enrollment;

    return (
      <CardFooter
        isGraduated={isGraduated}
        isReadyForGraduation={isReadyForGraduation}
        inProgress={inProgress}
      />
    );
  };

  render() {
    const { enrollments } = this.props;

    // Note: The enrollments are expected to be ordered by last_viewed_at
    // SXP-124: sort paid enrollments correctly.
    return (
      <ol>
        {_.map(enrollments, (enrollment) => {
          const {
            title,
            summary,
            semantic_type,
            key,
            version,
            color_scheme,
            is_graduation_legacy,
          } = enrollment;

          return (
            <Card
              key={key + version}
              title={title}
              summary={summary}
              isGraduationLegacy={is_graduation_legacy}
              nanodegreeKey={
                semantic_type === SemanticTypes.NANODEGREE ? key : null
              }
              courseKey={semantic_type === SemanticTypes.COURSE ? key : null}
              partKey={semantic_type === SemanticTypes.PART ? key : null}
              type={semantic_type}
              isGraduated={false}
              showColorScheme={true}
              colorScheme={color_scheme}
              isExecutiveProgram={NanodegreeHelper.isExecutiveProgram(
                enrollment
              )}
              isPaidSingleCourse={NanodegreeHelper.isPaidSingleCourse(
                enrollment
              )}
              renderButton={this._renderButton}
              renderFooter={this._renderFooter}
            />
          );
        })}
      </ol>
    );
  }
}
