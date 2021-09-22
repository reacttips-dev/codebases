

const PopupStack = {
  stack: [],

  init: function() {
    return this;
  },

  push: function(popup, options = {}) {
    _.each(this.stack, (p) => {
      p.popup.hide();
    });

    this.stack.push({
      'popup': popup,
      'emptyOnPop': options.emptyOnPop !== false,
    });
  },

  pop: function() {
    if (this.stack.length) {
      const topPopup = this.stack.pop();
      topPopup.popup.hide();
      if (topPopup.emptyOnPop) {topPopup.popup.html('');}

      if (this.stack.length) {
        _.last(this.stack).popup.show();
      }
    }
  },

  empty: function() {
    while (this.stack.length !== 0) {
      this.pop();
    }
  },

  getStack: function() {
    return this.stack;
  },
};

export default PopupStack.init();

