import React from 'react';
import _t from 'i18n!nls/ondemand';
import ProfileImageCA from 'bundles/compound-assessments/components/shared/ProfileImageCA';

import 'css!./__styles__/StackedLearnerPhotos';

/**
 * Stacks photos of `learners` slightly overlapping left-to-right with photos towards the left above photos towards
 * the right.
 */
class StackedLearnerPhotos extends React.Component {
  static propTypes = {
    learners: React.PropTypes.arrayOf(React.PropTypes.object).isRequired,
  };

  render() {
    return (
      <div className="rc-StackedLearnerPhotos">
        {this.props.learners.map((learner, index) => (
          <span key={index} style={{ zIndex: this.props.learners.length - index }}>
            <ProfileImageCA
              profile={{
                fullName: learner.get('fullName'),
                photoUrl: learner.get('isDefaultPhoto') ? undefined : learner.get('photoUrl'),
                isAnonymous: learner.get('isAnonymous'),
              }}
              alt={_t('Photo of learner #{learnerName}', { learnerName: learner.get('fullName') })}
            />
          </span>
        ))}
      </div>
    );
  }
}

export default StackedLearnerPhotos;
