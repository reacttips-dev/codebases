import Backbone from 'backbone';

const MultiLineInputSchema = Backbone.Model.extend({
  defaults() {
    return {
      prompt: '',
    };
  },

  isScored(): boolean {
    return this.get('points') != null;
  },

  getMaxScore(): number {
    if (this.get('points') > 0) {
      return this.get('points');
    }
    return 0;
  },

  getOption(points: number) {},
});

export default MultiLineInputSchema;
