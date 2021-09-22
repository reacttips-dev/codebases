

const PageSession = {
  liveItems: [],

  init: function() {
    return this;
  },

  remember: function(object, reference) {
    const ref = this.liveItems[reference];
    if (ref) {
      ref.push(object);
    } else {
      this.liveItems[reference] = new Array(object);
    }
  },

  notify: function(reference) {
    const ref = this.liveItems[reference];
    _.each(ref, function(element) {
      element.update();
    });
  },
};

export default PageSession.init();

