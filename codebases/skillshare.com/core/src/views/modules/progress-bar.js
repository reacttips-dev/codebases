

const ProgressBarView = Backbone.View.extend({

  steps: [],

  initialize: function() {
    _.bindAll(this, 'fill');
    this.autoFill = (!_.isUndefined(this.options.autoFill)) ? this.options.autoFill : false;
    this.animateFill = (!_.isUndefined(this.options.animateFill)) ? this.options.animateFill : false;
    if (!this.$el.hasClass('rendered')) {
      const numSteps = parseInt(this.$el.attr('data-ss-steps'), 10);
      const activeStep = parseInt(this.$el.attr('data-ss-active-step'), 10);
      for (let i = 0; i < numSteps; i++) {
        const liEl = $('<li />').css({ 'width': (100 / numSteps) + '%' });
        if (i === (activeStep - 1)) {liEl.addClass('active');}
        this.$el.append(liEl);
        this.steps.push(liEl);
      }
      this.$el.addClass('rendered');
    }
    if (this.autoFill) {window.setTimeout(this.fill, 500);}
  },

  fill: function() {
    // Get active index
    const activeIndex = this.$('li.active').index();
    const _this = this;
    if (this.animateFill === true) {
      let i = 0;
      const interval = window.setInterval(function() {
        if (i <= activeIndex) {
          _this.steps[i].addClass('filled');
          i++;
        } else {
          window.clearInterval(interval);
        }
      }, 250);
    } else {
      _.each(this.steps, function(step, index) {
        if (index <= activeIndex) {
          step.addClass('filled');
        }
      });
    }
  },

});

export default ProgressBarView;


