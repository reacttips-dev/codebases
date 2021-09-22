import URLHelpers from 'core/src/helpers/url-helpers';

const ClassesRouter = Backbone.Router.extend({

  routes: {
    // Main routes
    'classes/:slug/:sku': 'classes/home',
    'classes/:slug/:sku/lessons': 'classes/lessons',
    'classes/:slug/:sku/project-guide': 'classes/projectGuide',
    'classes/:slug/:sku/reviews': 'classes/reviews',
    'classes/:slug/:sku/projects': 'classes/projects',
    'classes/:slug/:sku/classroom/discussions': 'classes/discussions',
    'classes/:slug/:sku/classroom/announcements': 'classes/discussions',
    'classes/:slug/:sku/classroom/discussions/:discussion': 'classes/discussionView',
    'classes/:slug/:sku/classroom/announcements/:discussion': 'classes/discussionView',
    'classes/:slug/:sku/transcripts': 'classes/transcripts',
    // Short-hand routes (used on draft classes)
    ':slug/:sku': 'classes/home',
    ':slug/:sku/lessons': 'classes/lessons',
    ':slug/:sku/project-guide': 'classes/projectGuide',
    ':slug/:sku/projects': 'classes/projects',
    ':slug/:sku/classroom/discussions': 'classes/discussions',
    ':slug/:sku/classroom/announcements': 'classes/discussions',
    ':slug/:sku/classroom/discussions/:discussion': 'classes/discussionView',
    ':slug/:sku/classroom/announcements/:discussion': 'classes/discussionView',
    'discussions/comment/:comment': 'classes/discussionView',
    ':slug/:sku/transcripts': 'classes/transcripts',
  },

  initialize: function(options = {}) {
    _.extend(this, _.pick(options, 'classes'));

    // Listen for all events, that way we can proxy to the classes controller
    // when the router finds a match
    this.on('all', this.routeToControllerAction, this);
  },

  routeToControllerAction: function(event) {
    const lastArgument = _.last(arguments);
    const paramsString = _.isArray(lastArgument) ? _.last(lastArgument) : lastArgument;
    const params = (paramsString)? URLHelpers.getParamsFromString(paramsString) : null;

    let controllerName;
    let actionName;

    event.replace(/^route:(\w+)\/(\w+)/, function(_match, controller, action) {
      controllerName = controller;
      actionName = action;
    });

    const controller = this[controllerName] || this.classes;
    if (_.isFunction(controller.callAction)) {
      controller.callAction(controllerName, actionName, params);
    }
  },
});

export default ClassesRouter;
