import classNames from 'classnames';
import React from 'react';
import safeHtmlId from 'js/lib/safeHtmlId';
import StackedLearnerPhotos from 'pages/open-course/peerReview/components/StackedLearnerPhotos';
import 'css!./__styles__/OptionFeedbackRow';

class OptionFeedbackRow extends React.Component {
  static propTypes = {
    checked: React.PropTypes.bool.isRequired,
    children: React.PropTypes.node,
    groupId: React.PropTypes.string.isRequired,
    optionId: React.PropTypes.string.isRequired,
    reviewers: React.PropTypes.arrayOf(React.PropTypes.object).isRequired,
  };

  render() {
    const scopedGroupId = 'OptionFeedbackRow-' + safeHtmlId(this.props.groupId);
    const scopedOptionId =
      'OptionFeedbackRow-' + safeHtmlId(this.props.groupId) + '-' + safeHtmlId(this.props.optionId);

    const checkColorClass = this.props.checked ? 'body-2-text' : 'body-1-text';
    const textColumnClasses = classNames('option-text-column', checkColorClass);
    return (
      <tr className="rc-OptionFeedbackRow">
        <td className="option-bubble-column">
          <input
            type="radio"
            disabled={true}
            checked={this.props.checked}
            name={scopedGroupId}
            aria-labelledby={scopedOptionId}
          />
        </td>
        <td id={scopedOptionId} className={textColumnClasses}>
          {this.props.children}
        </td>
        <td className="option-reviewers-column">
          <StackedLearnerPhotos learners={this.props.reviewers} />
        </td>
      </tr>
    );
  }
}

export default OptionFeedbackRow;
