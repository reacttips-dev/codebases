/* Progress contains progress information for an item
 *
 * Progress's attributes are exactly the attributes returned by the item
 * progress API.
 * */

import Backbone from 'backbone-associations';

import _ from 'underscore';
import constants from 'pages/open-course/common/constants';

const stateToPercent = function (state) {
  switch (state) {
    case constants.progressCompleted:
      return 100;
    case constants.progressStarted:
      // NOTE(yang) default to 50 percent, this should correspond to video
      // progress or something similar in the future
      return 50;
    case constants.progressNotStarted:
      return 0;
    default:
      throw new Error('Unknown progressState: ' + state);
  }
};

const percentToState = function (percent) {
  if (percent === 100) {
    return constants.progressCompleted;
  } else if (percent > 0 && percent < 100) {
    return constants.progressStarted;
  } else {
    return constants.progressNotStarted;
  }
};

const Progress = Backbone.AssociatedModel.extend({
  initialize(attributes) {
    if (_.isObject(attributes)) {
      if (_.has(attributes, 'progressState')) {
        this.setState(attributes.progressState);
      } else if (_.has(attributes, 'completionPercent')) {
        this.setPercent(attributes.completionPercent);
      }
    }
  },
  getState() {
    return this.get('progressState');
  },
  setState(state, opts) {
    const options = opts || {};
    this.set(
      {
        progressState: state,
        completionPercent: stateToPercent(state),
      },
      options
    );
    return this;
  },
  getPercent() {
    return this.get('completionPercent');
  },
  setPercent(percent) {
    this.set({
      progressState: percentToState(percent),
      completionPercent: percent,
    });
    return this;
  },
  getContent() {
    return this.get('content');
  },
  getDefinition(key) {
    const content = this.getContent();
    const definition = content && content.definition;
    return definition && definition[key];
  },
  getPercentString() {
    return this.getPercent() + '%';
  },
  getPercentDegrees() {
    return (this.getPercent() / 100) * 360;
  },
  isComplete() {
    return this.getState() === constants.progressCompleted;
  },
  isAtLeastStarted() {
    return this.hasStarted() || this.isComplete();
  },
  hasStarted() {
    return this.getState() === constants.progressStarted;
  },
  hasNotStarted() {
    return !(this.isComplete() || this.hasStarted());
  },
  getTimestamp() {
    return this.get('timestamp');
  },
});

export default Progress;
