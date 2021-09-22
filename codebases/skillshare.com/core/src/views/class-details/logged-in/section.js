import Common from 'core/src/common';
import SSView from 'core/src/views/base/ss-view';

const ClassSectionView = SSView.extend({

  autoRender: false,

  // Whether this view should use the legacy way of rendering the page content.
  // Legacy views receive data that is in the following format: { content: HUGEHTMLDUMP }
  // and need to render the HTML dump rather than using mustache templates.
  // This render will be used temporarily as all of these pages should
  // eventually be ported over to mustache templates.
  legacyRender: false,

  id: 'content-region',
  className: 'content-wrapper icon-loading',

  initialize: function(options = {}) {
    const preRendered = options && !!options.el;

    if (preRendered) {
      if (_.isFunction(this.afterPreRender)) {
        this.afterPreRender();
      }
    }

    _.extend(this, _.pick(options, 'model', 'classModel', 'autoRender'));

    this.listenTo(this.model, 'change', this.render);
    this.listenTo(this.model, 'sync', this.removeLoadingClass);

    SSView.prototype.initialize.apply(this, arguments);
  },

  render: function() {
    if (this.legacyRender) {
      this.$el.html(this.model.get('content'));
      this.removeLoadingClass();
    }
    SSView.prototype.render.apply(this, arguments);
  },

  afterRender: function() {
    Common.runPageRoutine();

    SSView.prototype.afterRender.apply(this, arguments);
  },

  removeLoadingClass: function() {
    this.$el.removeClass('icon-loading');
  },

  _bubbleChanges: function(model) {
    this.listenTo(
      model,
      'change',
      _.bind(function() {
        this.trigger('change');
      }, this)
    );
  },
});

export default ClassSectionView;

