

const CharLimitView = Backbone.View.extend({
  inputEl: null,
  counterEl: null,
  charLimit: 0,
  charAppearLimit: 0,
  charWarningLimit: 0,
  totalCurrentChars: 0,
  totalRemaining: 0,
  isShowingCounter: false,

  events: {
    'keyup .limit-chars': 'onKeyUp',
  },

  initialize: function() {
    this.counterEl = this.$el.children('.char-limit');
    this.inputEl = this.$el.children('.limit-chars');
    this.charLimit = parseInt(this.inputEl.attr('maxlength'), 10);

    this.charAppearLimit = Math.round(this.charLimit / 2);
    this.charWarningLimit = Math.round(this.charLimit / 4);
    this.totalRemaining = this.charLimit;
  },

  onKeyUp: function() {
    this.totalCurrentChars = this.inputEl.val().length;

    // update count
    this.totalRemaining = this.charLimit - this.totalCurrentChars;
    this.counterEl.html(this.totalRemaining);

    const showWarning = this.totalRemaining <= this.charWarningLimit;
    const showCouter = this.totalRemaining <= this.charAppearLimit;
    if (showCouter) {
      if (!this.isShowingCounter) {
        this.counterEl.animate({ 'right': '7px', 'opacity': 1 }, 'fast');
        this.isShowingCounter = true;
      }
      this.counterEl.toggleClass('warning', showWarning);
    } else {
      if (this.isShowingCounter) {
        this.counterEl.animate({ 'right': '-20px', 'opacity': 0 }, 'fast');
        this.isShowingCounter = false;
      }
    }
  },
});

export default CharLimitView;

