//  NOTE: This CLASS is now deprecated. Use SSView instead.
//
// Base view class for all views on Skillshare.
//
// Borrows heavily from the Chaplin.js project:
// https://github.com/chaplinjs/chaplin


const BaseView = Backbone.View.extend({

  // Flag whether to render the view automatically on initialization.
  // As an alternative you might pass a `render` option to the constructor.
  autoRender: false,

  // View container element
  // Set this property in a derived class to specify the container element.
  // Normally this is a selector string but it might also be an element or
  // jQuery object.
  // The view is automatically inserted into the container when it’s rendered.
  // As an alternative you might pass a `container` option to the constructor.
  container: null,

  // Method which is used for adding the view to the DOM
  // Like jQuery’s `html`, `prepend`, `append`, `after`, `before` etc.
  containerMethod: 'append',

  // An array for storing subviews for easy iteration
  subviews: null,

  // A key-value pair object for retrieving subviews by name
  subviewsByName: null,

  // see base collection view for info
  emptyViewOnRender: true,

  // We can set this to true when we want the view to render on the next runloop
  // This is useful when we want to add a listener to a view before render is called
  // E.g. view.on('didRender', function() { $el.append(view.$el) })
  deferRender: false,


  // set a base fn for Backbone events prototype chain -- AK
  events: function() {
    return {};
  },


  // Method wrapping to enable `afterRender` and `afterInitialize`
  //
  // Wrap a method in order to call the corresponding
  // `after-` method automatically
  wrapMethod: function(name) {
    const instance = this;
    // Enclose the original function
    const func = instance[name];
    // Set a flag
    instance['' + name + 'IsWrapped'] = true;
    // Create the wrapper method
    instance[name] = function() {
      // Stop if the view was already disposed
      if (this.disposed) {
        return false;
      }
      // Call the original method
      func.apply(instance, arguments);
      // Call the corresponding `after-` method
      const upcase = name.charAt(0).toUpperCase() + name.substring(1);
      instance['after' + upcase].apply(instance, arguments);
      // Return the view
      return instance;
    };

    return instance[name];
  },

  constructor: function(options) {
    // Wrap `initialize` so `afterInitialize` is called afterwards
    // Only wrap if there is an overring method, otherwise we
    // can call the `after-` method directly
    if (this.initialize !== Backbone.View.prototype.initialize) {
      this.wrapMethod('initialize');
    }

    // Wrap `render` so `afterRender` is called afterwards
    if (this.render !== BaseView.prototype.render) {
      this.wrapMethod('render');
    } else {
      // Otherwise just bind the `render` method
      this.render = _(this.render).bind(this);
    }

    // Copy some options to instance properties
    if (options) {
      _(this).extend(_.pick(options, ['autoRender', 'deferRender', 'container', 'containerMethod']));
    }

    // Call Backbone’s constructor
    Backbone.View.apply(this, arguments);
  },

  initialize: function() {
    // No super call here, Backbone’s `initialize` is a no-op

    // My changes - AK
    _.bindAll(this, 'dispose');
    if (_.isFunction(this.templateFunc)) {
      _.bindAll(this, 'templateData', 'templateFunc');
    }

    // Initialize subviews
    this.subviews = [];
    this.subviewsByName = {};

    // Listen for disposal of the model
    // If the model is disposed, automatically dispose the associated view
    if (this.model) {
      this.listenTo(this.model, 'dispose', this.dispose);
    }
    if (this.collection) {
      this.listenTo(this.collection, 'dispose', this.dispose);
    }

    // Call `afterInitialize` if `initialize` was not wrapped
    if (!this.initializeIsWrapped) {
      return this.afterInitialize();
    }
  },

  // This method is called after a specific `initialize` of a derived class
  afterInitialize: function() {
    if (this.autoRender) {
      // Render automatically if set by options or instance property
      if (this.deferRender) {
        return _.defer(_.bind(this.render, this));
      } else {
        return this.render();
      }
    }
  },

  // Subviews
  // --------

  // Getting or adding a subview
  subview: function(name, view) {
    if (name && view) {
      // Add the subview, ensure it's unique
      this.removeSubview(name);
      this.subviews.push(view);
      this.subviewsByName[name] = view;
      return view;
    } else if (name) {
      // Get and return the subview by the given name
      return this.subviewsByName[name];
    }
  },

  // Removing a subview
  removeSubview: function(nameOrView) {
    if (!nameOrView) {return;}

    let name;
    let view;
    if (typeof nameOrView === 'string') {
      // Name given, search for a subview by name
      name = nameOrView;
      view = this.subviewsByName[name];
    } else {
      // View instance given, search for the corresponding name
      view = nameOrView;
      for (const otherName in this.subviewsByName) {
        if (view === this.subviewsByName[otherName]) {
          name = otherName;
          break;
        }
      }
    }

    // Break if no view and name were found
    if (!(name && view && view.dispose)) {
      return;
    }

    // Dispose the view
    view.dispose();

    // Remove the subview from the lists
    const index = _(this.subviews).indexOf(view);
    if (index > -1) {
      this.subviews.splice(index, 1);
    }
    return delete this.subviewsByName[name];
  },


  // Rendering
  // ---------

  // templateFunc: function() {
  //     //throw new Error('View#templateFunction must be overridden');
  //     console.error('View#templateFunction should be overridden');
  // },

  // templateData: function() {
  //     //throw new Error ('View#templateData must be overridden');
  //     console.error('View#templateData must be overridden');
  // },

  // Main render function
  // This method is bound to the instance in the constructor (see above)
  render: function() {
    // Don't render if the object was disposed
    // (render might be called as an event handler which wasn’t
    // removed correctly)
    if (this.disposed) {return false;}

    if (_.isFunction(this.templateFunc) && this.emptyViewOnRender) {
      // Call the template function passing the template data
      const html = this.templateFunc(this.templateData());

      // This is a workaround for an apparent issue with jQuery 1.7’s
      // innerShiv feature. Using @$el.html(html) caused issues with
      // HTML5-only tags in IE7 and IE8.
      this.$el.empty().append(html);
    }
    if (!this.renderIsWrapped) {
      this.afterRender();
    }
    return this;
  },

  // This method is called after a specific `render` of a derived class
  afterRender: function() {
    // Automatically append to DOM if the container element is set
    if (this.container) {
      // Append the view to the DOM
      $(this.container)[this.containerMethod](this.el);
      // Trigger an event
      this.trigger('addedToDOM');
    }
  },


  // Disposal
  // --------

  disposed: false,

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

export default BaseView;

