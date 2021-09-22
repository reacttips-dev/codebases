import Region from 'core/src/utils/region';
import Mustache from 'mustache';

const SSView = Backbone.View.extend({

  // In most cases, we want the view to render itself
  // But in any case where we want an owner to handle render at another time,
  // override this property (e.g. as part of collectionView)
  autoRender: true,
  // We can set this to true when we want the view to render on the next runloop
  // This is useful when we want to add a listener to a view before render is called
  // E.g. view.on('didRender', function() { $el.append(view.$el) })
  deferRender: false,
  // Sometimes we might want to use the view's template root node as the $el. E.g. buttons
  setElementToTemplate: false,
  // Override to define the template for any subclassed view
  template: null,
  // Define the data used in this view's template
  // This can be overridden as a func and the data returned
  templateData: {},
  // Define the partials used in this view's template
  // This can be overridden as a func and the partials returned
  templatePartials: {},
  // Pass a container to have this view be auto-rendered within it
  container: null,

  // The constructor to create a region.
  // Regions are small wrapper around subviews.
  Region: Region,

  initialize: function(options) {
    _.bindAll(this, 'render', 'afterRender');
    // Override default view properties with any that might be passed in through options
    if (options) {
      _.extend(this, _.pick(options, [
        'autoRender', 'template', 'templateData', 'templatePartials', 'container', 'regions',
      ]));
    }

    // Add the regions
    // This is done _after_ calling Backbone.View's constructor,
    // so that this.$el will be defined when we bind selectors.
    this._regions = {};
    this.addRegions(_.result(this, 'regions'));

    // Kick off render
    if (this.autoRender) {
      if (this.deferRender) {
        _.defer(_.bind(this.render, this));
      } else {
        this.render();
      }
    }
  },

  getTemplate: function() {
    if (_.isFunction(this.template) || !_.isEmpty(this.template)) {
      return _.result(this, 'template');
    }
    return this.template;
  },

  render: function() {
    if (!this.disposed) {
      // See if we have a template to render for this view
      const template = this.getTemplate();
      if (template) {
        // By default, we see if we have a model for this view,
        // in which case we'll use its attributes as template data
        let data = _.result(this.model, 'attributes');
        // But we might want to override
        if (_.isFunction(this.templateData) || !_.isEmpty(this.templateData)) {
          data = _.result(this, 'templateData');
        }
        // Prep partials
        const partials = _.result(this, 'templatePartials');

        // Detach current regions, so they don't need to be re-rendered
        _.invoke(this._regions, 'detach');

        // Render the template
        const html = Mustache.render(template, data, partials);
        if (this.setElementToTemplate) {
          this.setElement(html);
        } else {
          this.$el.html(html);
        }

        // Reattach current regions, so they are in the view again
        _.invoke(this._regions, 'reattach');

        // See if we need to auto render this view in a container
        if (this.container) {
          if (!(this.container instanceof $)) {
            this.container = $(this.container);
          }
          this.container.empty().append(this.$el);
        }
      }

      // Trigger an event to let any listeners know that rendering has finished
      // E.g. we may want to add this newly created el to the DOM, perhaps
      this.trigger('didRender');
      // We also want to defer a call to after render
      _.defer(_.bind(this.afterRender, this));
    }
  },

  // This will fire after the render runloop has finished and the view is visible.
  // This is useful if we want to handle any additional rendering which requires the
  // view to be visible first.
  afterRender: function() {
    // Default no-op
    this.trigger('afterRender');
  },

  // Regions
  // --------

  // Adds the region "name" to this as this[name].
  // Also attaches it to this._regions[name], for
  // internal management.
  addRegion: function(name, view) {
    // Remove the old region, if it exists already
    _.result(this._regions[name], 'remove');

    const options = { cid: name };
    // If this is a Backbone.View, pass that as the
    // view to the region.
    if (!view || view.$el) {
      options.view = view;
    } else {
      // If view is a selector, find the DOM element
      // that matches it.
      options.selector = (typeof view === 'object') ? view.selector : view;
      options.el = this.$(view);
    }

    const region = new this.Region(options);

    region._parent = this;
    this[region.cid] = this._regions[region.cid] = region;

    return region;
  },

  // Adds multiple regions to the view. Takes
  // an object with {regioneName: view} syntax
  addRegions: function(regions) {
    _.each(regions, function(view, name) {
      this.addRegion(name, view);
    }, this);
    return this;
  },

  _removeRegion: function(region) {
    delete this[region.cid];
    delete this._regions[region.cid];
  },

  // Wrap remove, so that we also remove our regions.
  remove: function() {
    _.invoke(this._regions, 'remove');
    return Backbone.View.prototype.remove.apply(this, arguments);
  },

  // Disposal
  // --------

  disposed: false,

  // Deprecated
  dispose: function() {
    if (this.disposed) {return;}

    // dispose subviews
    _.each(this.subviews, function(subview) {
      subview.dispose();
    });

    // Unbind all referenced handlers
    this.stopListening();

    // Remove all event handlers on this module
    this.off();

    // Remove the topmost element from DOM. This also removes all event
    // handlers from the element and all its children.
    this.$el.remove();

    // Remove element references, options,
    // model/collection references and subview lists
    const properties = [
      'el', '$el',
      'options', 'model', 'collection',
      'subviews', 'subviewsByName',
      '_callbacks',
    ];

    _.each(properties, function(prop) {
      // Deletion of a va can fail in IE.
      // Handle against it and set undefined in that case.
      try {
        delete this[prop];
      } catch (e) {
        this[prop] = undefined;
      }
    }, this);

    // finished
    this.disposed = true;

    // You’re frozen when your heart’s not open
    if (_.isFunction(Object.freeze)) {Object.freeze(this);}
  },

});

export default SSView;

