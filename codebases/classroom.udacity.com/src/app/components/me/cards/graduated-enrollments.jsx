import Card from './card';
import CardButton from './card-button';
import CardFooter from './card-footer';
import NanodegreeHelper from 'helpers/nanodegree-helper';

export default class GraduatedEnrollments extends React.Component {
  static displayName = 'me/cards/graduated-enrollments';

  _renderButton = (handleClick, enrollment, isFooterbutton) => {
    const { isLatest, isGraduated } = enrollment;
    return (
      <CardButton
        handleClick={handleClick}
        isLatest={isLatest}
        nanodegreeKey={enrollment.nanodegreeKey}
        courseKey={enrollment.courseKey}
        partKey={enrollment.partKey}
        isGraduationLegacy={enrollment.is_graduation_legacy}
        isGraduated={isGraduated}
        isFooterbutton={isFooterbutton}
      />
    );
  };

  _renderFooter = (enrollment) => {
    const { isGraduated } = enrollment;
    const { handleClick } = this.props;
    return (
      <CardFooter
        isGraduated={isGraduated}
        button={() =>
          isGraduated
            ? this._renderButton(handleClick, enrollment, true)
            : _.noop
        }
      />
    );
  };

  render() {
    const { enrollments } = this.props;

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
          } = enrollment;

          return (
            <Card
              key={key + version}
              title={title}
              summary={summary}
              nanodegreeKey={semantic_type === 'Degree' ? key : null}
              courseKey={semantic_type === 'Course' ? key : null}
              partKey={semantic_type === 'Part' ? key : null}
              type={semantic_type}
              isGraduated={true}
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
