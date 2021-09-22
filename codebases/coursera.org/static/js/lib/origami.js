define(function (require, exports, module) {
  /* This file extends the functionality provided by Backbone Router and Views, by:
   *  - creating a way for regions to be defined and used to create swappable layout
   *  - triggering events like 'view:appended', 'view:merged', and 'view:closed'
   *  - detecting when a view has an unsaved model and throwing up a warning upon leaving the view
   *  - making sure to handle internal links through the router, to avoid page refresh
   *  - making sure to still handle CTRL+clicking on links correctly
   *
   * events:
   *   on regions:
   *     view:closing  - before the region is closed
   *     view:closed   - after the region is closed
   *     view:appended - after the region is appended to another region
   *     view:merging  - before the region is merged into an existing region
   *     view:merged   - after the region is merged into an existing region
   *     view:resize   - called on each region after the window is resized
   *
   *   on origami:
   *     region:appended {name: region.name} - after a region is appended
   *     region:rendered {name: region.name} - after a region is rendered
   *     region:fetching {name: region.name, uid: region.uid} - before making an http request for the region
   *     region:fetched  {name: region.name, uid: region.uid} - after making an http request for the region
   */

  var Backbone = require('backbone');
  var $ = require('jquery');
  var Q = require('q');
  var _ = require('underscore');

  var confirmNavigationTemplate = require('bundles/confirmNavigation/confirmNavigation.html');

  var Modal = require('js/lib/modals');

  function _trigger(view) {
    var args = Array.prototype.slice.call(arguments, 1);
    if (view.trigger) {
      view.trigger.apply(view, args);
    }
  }

  // provide a simpler super method in case we want to extend a backbone view function
  Backbone.View.prototype._super = function (funcName) {
    return this.constructor.__super__[funcName].apply(this, _.rest(arguments));
  };

  var _singleton = null;

  var _private = {
    current: null,
    body: '#origami',
    views: {},
    beforeUnloadMessage: 'There are unsaved changes that will be lost if ' + 'you reload or leave this page.',
    regionHasUnsavedModel: function (region) {
      // Return whether the given region's view or any of its sub-regions'
      // views have unsaved models.
      //
      // This is determined by calling hasUnsavedModel() on each of the views.
      // It is okay for views to not implement this method, in which case the
      // view is assumed to not have an unsaved model.
      if (!region) return false;
      var viewHasUnsavedModel = region.view.hasUnsavedModel ? region.view.hasUnsavedModel() : false;

      if (viewHasUnsavedModel) {
        return true;
      } else {
        for (var name in region.regions) {
          var subRegion = region.regions[name];
          if (_private.regionHasUnsavedModel(subRegion)) {
            return true;
          }
        }
        return false;
      }
    },
  };

  // prevent google's mobile search results from causing problems
  // read more here: https://coursera.atlassian.net/browse/INFRA-1504
  if (window.location.hash.match(/^#!/)) {
    window.location.hash = window.location.hash.replace(/^#!/, '#');
  }

  var router = Backbone.Router.extend({
    // turn are .internal links to routes
    initialize: function () {
      var self = this;
      self.routePrefix = '';
      self.linkClass = 'internal';

      // handle any internal links through the router, to avoid page refreshes
      $('body').on('click', 'a.internal', function (e) {
        if (!e.ctrlKey && !e.metaKey) {
          e.preventDefault();
          self.navigate($(e.currentTarget).attr('href'), true);
        }
      });

      // This element will be used by the modal used to confirm navigation,
      // when relevant.
      this.$confirmNavigation = $(confirmNavigationTemplate({}));
      $('body').append(this.$confirmNavigation);

      $(window).on('beforeunload.origami', function () {
        if (_private.regionHasUnsavedModel(_private.current)) {
          return _private.beforeUnloadMessage;
        }
      });
    },

    setupLinks: function (routePrefix, linkClass) {
      var self = this;

      this.routePrefix = routePrefix;
      this.linkClass = linkClass;
      $('body').on('click', 'a.' + this.linkClass, function (e) {
        if (!e.ctrlKey && !e.metaKey) {
          e.preventDefault();
          self.navigateTo($(e.currentTarget).attr('href'), true);
        }
      });
    },

    navigateTo: function (href, silent) {
      this.navigate(href.replace(this.routePrefix, ''), silent);
    },

    // Override navigate(..) to allow cancelling of navigation when a view has
    // an unsaved model.
    //
    // Views may implement a method, hasUnsavedModel().  This method will be
    // called on any navigation, including both browser navigation and
    // application navigation.  If this method returns true, a dialog will be
    // presented to the user warning them that unsaved changes will be lost if
    // they continue with navigation.  For browser navigation, this will be a
    // browser dialog.  For application navigation, this will be a Modal
    // dialog.  The user may cancel or continue with the navigation.
    //
    // If the view does not implement hasUnsavedModel(), navigation will be
    // allowed.
    //
    // There may be multiple active views, by way of regions and subregions.
    // If any view's hasUnsavedModel() method returns true, the confirmation
    // dialog will be shown.
    navigate: function (fragment, options) {
      if (_private.current && _private.regionHasUnsavedModel(_private.current)) {
        var $message = $('.confirm-navigation-message');
        $message.text(_private.beforeUnloadMessage);

        var $leave = $('.confirm-navigation-leave');
        $leave.one('click', function () {
          Backbone.Router.prototype.navigate.call(this, fragment, options);
        });

        var modalOptions = {
          'overlay.class': 'coursera-overlay',
        };
        Modal('.confirm-navigation', modalOptions).open();
      } else {
        Backbone.Router.prototype.navigate.call(this, fragment, options);
      }
    },

    // convenience function to add routes outside of this context
    addRoutes: function (routes) {
      var self = this;

      for (var route in routes) {
        self.route(route, route, routes[route]);

        // TODO
        // move this more internally into backbone such that
        // we are not generating

        // let's handle versions of all routes that end in a trailing slash
        // such that it redirects to the non-slash version
        // don't push it in the history buffer, or it will kill back button
        self.route(route + '/', route + '/', function () {
          var url = Backbone.history.getFragment();
          var rewrite = url.replace(/\/(?:\?.*)*$/, '');

          self.navigate(rewrite, {
            trigger: true,
            replace: true,
          });
        });
      }
    },
  });

  // provide a way to animate one region that is replacing another
  var animateManager = {
    resize: function (outgoing, incoming, callback) {
      $('body').append(
        incoming.$el.css({
          visibility: 'hidden',
        })
      );

      var height = {
        from: outgoing.$el.outerHeight(),
        to: incoming.$el.outerHeight(),
      };

      outgoing.$el.animate(
        {
          height: height.to,
        },
        300,
        function () {
          outgoing.$el.replaceWith(
            incoming.$el.css({
              visibility: 'visible',
            })
          );

          incoming.$el.find('img').on('load', function () {
            incoming.$el.animate({
              height: incoming.$el.outerHeight(),
            });
          });

          if (callback) callback();
        }
      );
    },

    slideLeft: function (outgoing, incoming, callback) {
      var going = outgoing.$el;
      var coming = incoming.$el;
      var position = going.position();
      var width = going.outerWidth();
      var height = going.outerHeight();
      var parent = $('<div>').css({
        position: 'relative',
        width: width,
        height: height,
      });
      var restoreIn = {
        position: coming.css('absolute') || 'static',
        width: coming.get(0).style.width,
        left: coming.get(0).style.left,
      };
      var restoreOut = {
        position: going.css('absolute') || 'static',
        width: going.get(0).style.width,
        left: going.get(0).style.left,
      };

      going.wrap(parent);
      going.css({
        width: width,
        left: position.left,
        position: 'absolute',
      });
      coming.css({
        width: width,
        left: position.left + width,
        position: 'absolute',
      });
      going.parent().append(coming);
      going.animate(
        {
          left: -width,
        },
        {
          duration: 500,
          step: function (moved) {
            coming.css({
              left: position.left + width + moved,
            });
          },
          complete: function () {
            coming.css(restoreIn);
            going.css(restoreOut).hide();
            going.unwrap();

            // restore coming
            if (callback) callback();
          },
        }
      );
    },

    slideRight: function (outgoing, incoming, callback) {
      var going = outgoing.$el;
      var coming = incoming.$el;
      var position = going.position();
      var width = going.outerWidth();
      var height = going.outerHeight();
      var parent = $('<div>').css({
        position: 'relative',
        width: width,
        height: height,
      });
      var restoreIn = {
        position: coming.css('absolute') || 'static',
        width: coming.get(0).style.width,
        left: coming.get(0).style.left,
      };
      var restoreOut = {
        position: going.css('absolute') || 'static',
        width: going.get(0).style.width,
        left: going.get(0).style.left,
      };

      going.wrap(parent);
      going.css({
        width: width,
        left: position.left,
        position: 'absolute',
      });
      coming.css({
        width: width,
        left: -(position.left + width),
        position: 'absolute',
      });
      going.parent().append(coming);
      going.animate(
        {
          left: width,
        },
        {
          duration: 500,
          step: function (moved) {
            coming.css({
              left: -(position.left + width) + moved,
            });
          },
          complete: function () {
            coming.css(restoreIn);
            going.css(restoreOut).hide();
            going.unwrap();

            // restore coming
            if (callback) callback();
          },
        }
      );
    },

    replace: function (outgoing, incoming, callback) {
      outgoing.$el.replaceWith(incoming.el);

      if (callback) callback();
    },
  };

  // regions are basically syntactic sugar for backbone views
  // they provide methods to better handle views that contain other views
  // which comes in handy when you want a view to replace another view
  var region = function (type, _options) {
    var self = this;
    var options = _options || {};

    self.type = type;
    self.animate = options.animate || {};
    self.regions = options.regions || {};
    self.initialize = options.initialize || {};
    self.options = {};

    self.id = options.id || type.prototype.name;
    self.name = type.prototype.name;

    self.view = null;
    self.regions = $.extend(true, {}, type.prototype.subregions, options.regions || {});
  };

  // close a region and remove its events. if keep == true, don't remove the DOM
  region.prototype.close = function (keep) {
    var self = this;

    _.each(self.regions, function (_region, key) {
      delete self.regions[key];
      _region.close(keep);
    });

    if (!keep) self.view.remove();

    self.view.undelegateEvents();
    _trigger(self.view, 'view:closed');
    self.view.off('view');
  };

  // close a region and remove its events and if remove == true, remove it from the dom
  region.prototype.closing = function () {
    _trigger(this.view, 'view:closing');
    delete _private.views[this.view.cid];
  };

  // render the region
  region.prototype.render = function (origami) {
    var self = this;

    _.each(self.regions, function (view, key) {
      if (!view) {
        // Skip if the region has been nullified
        return;
      }
      view.render();
      view.parent = self;
    });

    self.view = new self.type(self.initialize);

    // hacky =[
    self.view.region = self;
    // ensure there is always a context per React spec
    self.view.context = self.view.context || {};
    self.view.render && self.view.render(self.render);

    // hacky*2
    if (origami) {
      self.view.on('view:appended', function () {
        origami.trigger('region:appended', { name: self.name });
      });
    }

    return self;
  };

  // allows regions to know when they are alive
  region.prototype.appended = function () {
    var that = this;

    if (that.view && that.view.trigger) {
      setTimeout(function () {
        _trigger(that.view, 'view:appended');
      }, 0);
    }
  };

  region.prototype.append = function (view, options) {
    var that = this;

    var appended = Q.defer();

    if (!this.regions) {
      this.regions = {};
    }

    var render_and_append = function (_region) {
      var key = view;
      var count = 0;
      var $el;

      // rename the key if already exists
      while (that.regions[key]) {
        key = key + ++count;
      }

      that.regions[key] = _region;

      _region.render(_singleton);

      if (options.to) {
        $el = _.isElement(options.to) ? that.view.$(options.to) : options.to;
      } else {
        $el = that.view.$el;
      }

      // If options.position exists, insert this view such that it is the
      // options.position-th child of $el.
      if (_(options).has('position')) {
        var wasInPosition = $el.children().eq(options.position);
        if (wasInPosition.length > 0) {
          $(wasInPosition[0]).before(_region.view.el);
        } else {
          $el.append(_region.view.el);
        }
      } else {
        $el.append(_region.view.el);
      }
      _region.appended();

      _singleton.trigger('region:rendered', {
        name: _region,
      });

      appended.resolve(_region);
    };

    if (typeof view == 'string') {
      _singleton.region.fetch(view, options, render_and_append);
    } else {
      render_and_append(new region(view, options));
    }

    return appended.promise;
  };

  // useful to compare if two regions are the same
  region.prototype.is = function (_region) {
    return _region.type == this.type && _region.id == this.id;
  };

  // merge this region with another (eventually replacing itself)
  region.prototype.replace = function (incoming, callback) {
    var outgoing = this;
    var how = 'replace';

    var animate = {
      incoming: incoming.view.animate,
      outgoing: outgoing.view.animate,
    };

    if (_.isString(animate.incoming)) how = animate.incoming;
    else if (_.isFunction(animate.incoming)) how = animate.incoming();
    else if (_.isString(animate.outgoing)) how = animate.outgoing;
    else if (_.isFunction(animate.outgoing)) how = animate.outgoing();

    if (!animateManager[how]) how = 'replace';

    animateManager[how](outgoing.view, incoming.view, callback);
  };

  // take two outer regions and merge only the regions that are different
  region.prototype.merge = function (incoming, origami) {
    var self = this;

    // if regions are the same
    if (self.is(incoming)) {
      _.each(incoming.regions, function (_region, view) {
        _trigger(self.regions[view].view, 'view:merging', _region.initialize);
        self.regions[view].merge(_region, origami);
        _trigger(self.regions[view].view, 'view:merged', _region.initialize);
      });
    } else if (self.name == incoming.name) {
      self.closing();
      incoming.render(origami);

      self.replace(incoming, function () {
        if (self.parent) {
          self.parent.regions[incoming.name] = incoming;
          incoming.parent = self.parent;
          self.parent.appended();
        }

        self.close();
        incoming.appended();
      });
    }
  };

  // actual region manager that makes regions and replaces them
  //var regionManager = function(Base)
  var Origami = function (body, current) {
    if (_singleton) {
      return _singleton;
    }
    _singleton = this;
    var that = this;

    _private.body = body;
    _private.current = current;

    $(window).on('resize', function () {
      for (var cid in _private.views) {
        _trigger(_private.views[cid], 'view:resize');
      }
    });

    // open up an outer region, closing any existing regions in its place
    this.region = {
      make: function (type, options) {
        return new region(type, options);
      },

      fetch: function (_region, conf, callback) {
        var uid = _.uniqueId();
        that.trigger('region:fetching', {
          name: _region,
          uid: uid,
        });

        // show message here
        require([_region], function (view) {
          that.trigger('region:fetched', {
            name: _region,
            uid: uid,
          });

          // hide message here
          callback(new region(view, conf));
        });
      },

      // append the region
      // if only given only a region name it must be fetched, callback is used
      // if given a Backbone.View directly, then it will return immediately
      append: function (parent, view, options, callback) {
        if (!parent) {
          parent = { regions: {} };
        }

        var render_and_append = function (_region) {
          var key = view;
          var count = 0;

          // rename the key if already exists
          while (parent.regions[key]) {
            key = key + ++count;
          }

          parent.regions[key] = _region;
          _region.render(that);
          // addToDom
          //
          if (callback) {
            callback(_region);
          }

          _region.appended();

          that.trigger('region:rendered', {
            name: _region,
          });

          return _region;
        };

        if (typeof view == 'string') {
          that.region.fetch(view, options, render_and_append);
        } else {
          return render_and_append(new region(view, options));
        }
      },

      open: function (name, callback) {
        var view = name;
        var conf = {};

        if (_.isObject(name)) {
          view = _.keys(name)[0];
          conf = name[view];
        }

        that.region.fetch(
          view,
          conf,
          callback ||
            function (parent) {
              // Allow the disabling of specific subregions by accepting null.
              // For example, we may want everything page.js has to offer, but not the footer
              var validRegions = _(parent.regions).filter(function (region) {
                return region;
              });

              // only call this after all regions have been rendered!
              var render = _.after(_.keys(validRegions || {}).length + 1, function () {
                if (_private.current) {
                  if (_private.current.is(parent)) {
                    _private.current.merge(parent, that);
                    return;
                  } else if (_private.current.name == parent.name) {
                    parent.render(that);

                    _private.current.replace(parent, function () {
                      _private.current.close();
                      _private.current = parent;
                      _private.current.appended();
                    });
                    return;
                  }

                  _private.current.close(true);
                }

                _private.current = parent;
                $(_private.body).html(_private.current.render(that).view.el);
                _private.current.appended();

                _.each(_private.current.regions, function (_region) {
                  if (_region) {
                    _region.appended();
                  }
                });
              });

              // kick it off once, in case there are no regions at all
              render(that);

              // now fetch/render all sub regions
              _.each(parent.regions, function (subregion, name) {
                if (!subregion) {
                  // Skip if the region has been nullified
                  return;
                }
                that.region.open(subregion, function (_region) {
                  parent.regions[name] = _region;
                  render(that);
                });
              });
            }
        );
      },
    };

    this.animate = animateManager; // object to hold region animators
    this.router = new router(); // global router
    this.store = {}; // allow the app to share global objects between views
    this.tracker = []; // push events that you want to track onto this object
  };

  _.extend(Origami.prototype, Backbone.Events);

  return Origami;
});
