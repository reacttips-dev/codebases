import Backbone from 'backbone';

const ItemGradeModel = Backbone.Model.extend({
  /* Due to https://phabricator.dkandu.me/D51168, ItemGradeRecords now distinguishes
   * between missing grades and zero grades. Therefore, we cannot default to a grade
   * of 0 anymore, since the grade might actually be 0.
   */
  defaults() {
    return {
      overallOutcome: {
        grade: undefined,
        isPassed: false,
      },
    };
  },

  getRelativePassingState() {
    if (this.get('overallOutcome').isPassed) {
      return ItemGradeModel.relativePassingStates.passed;
    }
    return ItemGradeModel.relativePassingStates.notPassed;
  },

  isPassing() {
    return this.get('overallOutcome').isPassed;
  },

  hasLatePenalty() {
    return !!this.get('overallOutcome').latePenaltyRatio;
  },

  getLatePenaltyRatio() {
    return this.hasLatePenalty() && this.get('overallOutcome').latePenaltyRatio.definition.ratio;
  },
});

ItemGradeModel.relativePassingStates = {
  notPassed: 'notPassed',
  passed: 'passed',
};

export default ItemGradeModel;
