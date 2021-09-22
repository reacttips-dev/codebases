import React from 'react';
import classNames from 'classnames';
import _t from 'i18n!nls/ondemand';
import 'css!./__styles__/CoursePercentageGrade';

type Props = {
  grade: number;
  label: string;
  isPassing: boolean;
  smallVersion: boolean;
  showLeftBorder?: boolean;
};

class CoursePercentageGrade extends React.Component<Props> {
  static defaultProps = {
    label: 'Final Course Grade',
    isPassing: true,
    smallVersion: false,
  };

  render() {
    const { grade, label, isPassing, smallVersion, showLeftBorder } = this.props;

    if (grade === null || grade === undefined) {
      return null;
    }

    const containerClasses = classNames(
      'rc-CoursePercentageGrade vertical-box align-items-absolute-center',
      showLeftBorder ? 'rc-CoursePercentageGradeLeftBorder' : '',
      {
        'small-version': smallVersion,
      }
    );
    const gradeClasses = classNames('percent-grade headline-6-text', {
      'color-success': isPassing,
      'color-danger': !isPassing,
    });

    return (
      <div className={containerClasses}>
        <div className={gradeClasses}>{grade}%</div>
        <div className="grade-label headline-1-text">{_t(label)}</div>
      </div>
    );
  }
}

export default CoursePercentageGrade;
