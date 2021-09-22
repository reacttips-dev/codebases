import BaseView from 'core/src/views/base/base-view';
import emptySlotsTemplate from 'text!core/src/templates/partials/_empty-slots.mustache';
import emptySlotTemplate from 'text!core/src/templates/partials/_empty-slot.mustache';
import Mustache from 'mustache';


// General class for rendering Collections.
// Derive this class and declare at least `itemView` or override
// `getView`. `getView` gets an item model and should instantiate
// and return a corresponding item view.
const CollectionView = BaseView.extend({


  // Config options
  // --------------

  // These options may be overwritten in derived classes

  // A class of item in collection
  // This property has to be overridden by a derived class

  itemView: null,
  // If a collection view can contain more that 1 type of item view
  // override this property and set key value item views
  itemViews: {},

  // Automatic rendering

  // Per default, render the view itself and all items on creation
  autoRender: true,
  renderItems: true,

  // Selectors and Elements

  // The element to show when the collection has no items
  fallbackEl: null,

  // View lists

  // Track a list of the visible views
  visibleItems: null,

  animateOnRemove: false,
  tintOnAdd: false,
  hasRenderedAllItems: false,
  // We need this flag because we're extending baseview, which auto-empties the view on render.
  // This can be removed when (if) this view is ported to extend ssview
  // Until then, we may need to set to false on instantiate in the case of dealing with table containers
  // In this instance, we need to keep the table header intact!
  emptyViewOnRender: true,


  constructor: function(options) {
    _.bindAll(
      this, 'renderAllItems', 'showHideFallback', 'itemsReset', 'itemRemoved',
      'itemAdded'
    );

    // apply some options as instance properties
    if (options) {
      _(this).extend(_.pick(options, ['renderItems', 'itemView', 'itemViews', 'fallbackEl',
        'animateOnRemove', 'tintOnAdd', 'firstItemView', 'lastItemView', 'emptyViewOnRender',
        'trackingParams',
      ]));
    }

    BaseView.prototype.constructor.apply(this, arguments);
  },

  initialize: function() {
    BaseView.prototype.initialize.apply(this, arguments);

    this.visibleItems = [];

    // start listening to the Collection
    this.listenTo(this.collection, 'add', this.itemAdded);
    this.listenTo(this.collection, 'remove', this.itemRemoved);
    this.listenTo(this.collection, 'reset', this.itemsReset);
  },


  // Rendering
  // ---------

  // Override BaseView#getTemplateDSata, don't serialize collection items here
  templateData: function() {
    return { length: this.collection.length };
  },

  // In contrast to normal views, a template is not mandatory
  // for CollectionViews. Provide an empty `getTemplateFunction`.
  templateFunc: function() {},

  emptySlotsTemplate: emptySlotsTemplate,

  emptySlotsTemplatePartials: {
    'partials/_empty-slot': emptySlotTemplate,
  },

  // Main render method (should be called only once)
  render: function() {
    BaseView.prototype.render.apply(this, arguments);
    this.initFallback();
    if (this.renderItems) {this.renderAllItems();}
  },

  afterRender: function() {
    BaseView.prototype.afterRender.apply(this, arguments);
    this.insertEmptySlots();
  },

  // Adding / Removing
  // -----------------

  // When an item is added, create a new view and insert it
  itemAdded: function(item, collection) {
    this.renderAndInsertItem(item, collection.indexOf(item));
  },

  // When an item is removed, remove the corresponding view from DOM and caches
  itemRemoved: function(item) {
    this.removeViewForItem(item);
  },

  // When all items are reset, render all anew
  itemsReset: function(collection, options) {
    _.each(options.previousModels, function(model) {
      this.removeViewForItem(model);
    }, this);
    this.subviews = [];
    this.renderAllItems();
  },


  // Fallback message when the collection is empty
  // ---------------------------------------------

  initFallback: function() {
    if (!this.fallbackEl || !this.fallbackEl.length) {return;}

    // set the fallbackEl property
    this.fallbackEl = $(this.fallbackEl);

    // listen for visible item changes
    this.on('visibilityChange', this.showHideFallback);

    // Listen for sync events on the collection
    this.listenTo(this.collection, 'sync', this.showHideFallback);

    // set visibility initially
    this.showHideFallback();
  },

  // Show fallback if no item is visible
  showHideFallback: function() {
    this.fallbackEl.toggle(this.visibleItems.length === 0);
    this.trigger('showHideFallback');
  },


  // Filtering
  // ---------

  // Filters only child item views from all current subviews.
  getItemViews: function() {
    const itemViews = {};

    for (const name in this.subviewsByName) {
      const view = this.subviewsByName[name];
      if (name.slice(0, 9) === 'itemView:') {
        itemViews[name.slice(9)] = view;
      }
    }
    return itemViews;
  },


  // Item view rendering
  // -------------------

  // Render and insert all items
  renderAllItems: function() {
    const items = this.collection.models;

    // Reset visible items
    this.visibleItems = [];

    // Collect remaining views
    const remainingViewsByCid = {};
    _.each(items, function(item) {
      const view = this.subview('itemView:' + item.cid);
      if (view) {
        // view remains
        remainingViewsByCid[item.cid] = view;
      }
    }, this);

    // Remove old views of items no longer in the list
    const views = this.getItemViews();
    _.each(views, function(view) {
      if (!(view.cid in remainingViewsByCid)) {
        // Remove the view
        this.removeSubview('itemView:' + view.cid);
      }
    }, this);

    // Handle if our collection view supports bookend views (first view)
    if (!_.isUndefined(this.firstItemView)) {
      this.insertView(null, this.firstItemView, 0);
      this.subview('itemView:' + this.firstItemView.cid, this.firstItemView);
    }

    let renderCounter = 0;
    // Re-insert remaining items; render and insert new items
    _.each(items, function(item, idx) {
      const view = this.subview('itemView:' + item.cid);
      const index = (!_.isUndefined(this.firstItemView)) ? (idx + 1) : idx;

      if (view) {
        this.insertView(item, view, index);
      } else {
        this.renderAndInsertItem(item, index);
      }

      if (renderCounter === (items.length - 1)) {
        if (_.isUndefined(this.lastItemView) || _.isNull(this.lastItemView)) {
          this.hasRenderedAllItems = true;
          this.trigger('hasRenderedAllItems');
        }
      } else {
        renderCounter++;
      }
    }, this);

    // Handle if our collection view supports bookend views (last view)
    if (!_.isUndefined(this.lastItemView) && !_.isNull(this.lastItemView)) {
      this.insertView(null, this.lastItemView, this.subviews.length);
      this.subview('itemView:' + this.lastItemView.cid, this.lastItemView);
      //
      this.hasRenderedAllItems = true;
      this.trigger('hasRenderedAllItems');
    }

    // If no view was created, trigger `visibilityChange` event manually
    if (!items.length) {
      this.trigger('visibilityChange', this.visibleItems);
      this.trigger('hasRenderedAllItems');
    }
  },

  // Render the view for an item
  renderAndInsertItem: function(item, index) {
    const view = this.renderItem(item);
    this.insertView(item, view, index);
  },

  // Instantiate and render an item using the `viewsByCid` hash as a cache
  renderItem: function(item) {
    // Get the existing view
    let view = this.subview('itemView:' + item.cid);

    // Instantiate a new view if necessary
    if (!view) {
      view = this.getView(item);
      // save the view in the subviews
      this.subview('itemView:' + item.cid, view);
    }

    // Render in any case
    view.render();

    return view;
  },

  // Returns an instance of the view class. Override this
  // method to use several item view constructors depending
  // on the model type or data.
  getView: function(model) {
    const trackingParams = !_.isUndefined(this.trackingParams) ? this.trackingParams : {};
    // When instantiating a new itemView, we need to ensure we pass autoRender: false
    // This is because we manually handle the view's render in this.renderItem
    // Would be good to refactor to avoid this in future (after we port all views to extend ssView)
    if (!_.isEmpty(this.itemViews)) {
      // By setting item views, we're asusming we're going to be evaluating against this model's type property
      const itemType = model.get('type');
      const ItemView = this.itemViews[itemType];
      return new ItemView({
        model: model, collectionView: this, index: this.subviews.length, autoRender: false, trackingParams: trackingParams,
      });
    } else if (!_.isNull(this.itemView)) {
      const ItemView = this.itemView;
      return new ItemView({
        model: model, collectionView: this, index: this.subviews.length, autoRender: false, trackingParams: trackingParams,
      });
    } else {
      throw new Error('The CollectionView#itemView property must be defined or the getView() must be overridden.');
    }
  },

  // Inserts a view into the list at the proper position
  insertView: function(item, view, index) {
    // Get the insertion offset
    let position;
    if (!_.isUndefined(this.firstItemView)) {
      position = index;
    } else if (item.get('rank')) {
      position = parseInt(item.get('rank'), 10);
    } else {
      position = _.isNumber(index) ? index : this.collection.indexOf(item);
    }


    // See if we're inserting into a table with a header row
    const elIsTable = (this.$el.is('table') && this.$el.find('.header').length > 0);

    // We also need to know what views are already in the list
    // ...under the case that we're sorting etc
    const children = elIsTable ? this.$el.find('tr').not('.header') : this.$el.children();

    // Get the view's el to insert into the list
    const viewEl = view.el;

    // Check if it needs to be inserted
    if (children.get(position) !== viewEl) {
      const { length } = children;
      if (length === 0 || position >= length) {
        // Insert at the end
        this.$el.append(viewEl);
      } else {
        // Insert at the right position
        if (position === 0) {
          const $next = children.eq(position);
          $next.before(viewEl);
        } else {
          const $previous = children.eq(position - 1);
          $previous.after(viewEl);
        }
      }
    }

    // Tell the view that it was added to its parent
    view.trigger('addedToParent');

    if (this.hasRenderedAllItems && this.tintOnAdd) {
      view.$el.css({ 'background-color': '#dbf3d7' });
      view.$el.animate({ backgroundColor: '#ffffff' }, 1500);
    }

    if (!_.isNull(item)) {
      // Update the list of visible items, trigger a `visibilityChange` event
      this.updateVisibleItems(item);
    }

    this.trigger('didInsertView');
  },

  // Remove the view for an item
  removeViewForItem: function(item) {
    const subview = this.subview('itemView:' + item.cid);
    if (_.isUndefined(subview)) {
      return;
    }
    if (this.animateOnRemove) {
      const _this = this;
      subview.$el.slideUp(function() {
        _this.removeSubview('itemView:' + item.cid);
        _this.updateVisibleItems(item);
      });
    } else {
      this.removeSubview('itemView:' + item.cid);
      this.updateVisibleItems(item);
    }
    this.trigger('didRemoveView');
  },


  // List of visible items
  // ---------------------

  // Update visibleItems list and trigger a `visibilityChanged` event
  updateVisibleItems: function(item) {
    const visibleItemsIndex = _(this.visibleItems).indexOf(item);
    const includedInVisibleItems = visibleItemsIndex > -1;

    if (includedInVisibleItems) {
      // Remove item from the visible items list
      this.visibleItems.splice(visibleItemsIndex, 1);
    } else {
      // Add item to the visible items list
      this.visibleItems.push(item);
    }

    // Add populated class to ul based on if we have items within
    // This allows us to additionally style the ul depending on if it has items
    // E.g. in creator item-list
    this.$el.toggleClass('populated', this.visibleItems.length !== 0);

    this.trigger('visibilityChange', this.visibleItems);
  },


  // Disposal
  // --------

  dispose: function() {
    if (this.disposed) {return;}

    _.each(['$fallback', 'visibleItems'], function(property) {
      delete this[property];
    }, this);

    BaseView.prototype.dispose.apply(this, arguments);
  },


  /*
     * If we want to filter the view in real-time
     * str: String to filter
     * fieldName: model field name to search against
     */
  searchWithString: function(str, fieldName) {
    const foundModels = this.collection.filter(function(model) {
      return model.get(fieldName).toLowerCase()
        .indexOf(str) !== -1;
    });
    this.showItemViews(foundModels);
  },

  /*
     * Used to basically filter the collection view
     * models: an array of the models to show
     */
  showItemViews: function(models) {
    // First hide all
    _.each(this.subviews, function(subview) {
      subview.$el.hide();
    });
    // With every model to show
    _.each(models, function(model) {
      // Identif the subview to show by model cid (as this is how we're storing reference to subviews)
      const view = this.subview('itemView:' + model.cid);
      view.$el.show();
    }, this);
  },

  insertEmptySlots: function() {
    if (!this.collection.emptySlotsData) {
      return;
    }

    const emptySlotsHtml = Mustache.render(
      this.emptySlotsTemplate,
      this.collection.emptySlotsData,
      this.emptySlotsTemplatePartials
    );

    this.$el.append(emptySlotsHtml);
  },

});

export default CollectionView;


