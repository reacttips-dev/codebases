import ClassSectionView from 'core/src/views/class-details/logged-in/section';
import ProjectsCollectionView from 'core/src/views/collection-views/projects-collection-view';
import InfiniteScrollerView from 'core/src/views/modules/infinite-scroller';
import ProjectsSectionTemplate from 'text!core/src/templates/class-details/shared/_projects-section.mustache';
import sortMethodTabsTemplate from 'text!core/src/templates/shared/_underline-tabs.mustache';
import sortMethodTabTemplate from 'text!core/src/templates/shared/_tab.mustache';
import smallListViewGridItemTemplate from 'text!core/src/templates/shared/_small-list-view-grid-item.mustache';
import extractQueryParams from 'core/src/utils/extract-query-params';
import deepRetrieve from 'core/src/utils/deep-retrieve';

import UserProjectTemplate from 'text!core/src/templates/class-details/shared/_user-project.mustache';
import EmptyProjectTemplate from 'text!core/src/templates/partials/workshops/_empty-project-grid-item.mustache';
import UserInformationTemplate from 'text!core/src/templates/partials/_user-information-small.mustache';

import ProjectCard from 'core/src/views/item-views/workshops/project-column-item-view.js';
import { initializeGamificationToast, GAMIFICATION_ACTION_STEPS } from 'core/src/helpers/gamification-helper';

const ProjectsSectionView = ClassSectionView.extend({

  CONTAINER_PROJECT_CARD_SELECTOR: '.js-project-card',
  COLLAPSED_CLASS_PD: 'project-description-collapsed',
  PROJECT_GUIDE_CONTAINER_SELECTOR: '.js-project-guide-container',
  DESCRIPTION_CONTENT_WRAPPER_SELECTOR: '.js-description-content-wrapper',

  initialize: function(opts) {
    this.sortViews = {};
    _.bindAll(this, 'onSortedViewAttached', 'onSortedViewUnattach');

    ClassSectionView.prototype.initialize.apply(this, arguments);

    const preRendered = opts && !!opts.el;
    if (preRendered) {
      this.switchSortView(this.model, this.model.get('sortMethod'));
    }

    // Hey ClassSectionView, I don't want to rerender on all changes. =P
    this.stopListening(this.model, 'change');
    this.listenTo(this.model, 'change:collection_cid', this.render);
    this.listenTo(this.model, 'change:sortMethod', this.switchSortView);
  },

  autoRender: false,

  templatePartials: {
    'shared/_underline-tabs': sortMethodTabsTemplate,
    'shared/_tab': sortMethodTabTemplate,
    'shared/_small-list-view-grid-item': smallListViewGridItemTemplate,
    'class-details/shared/_user-project': UserProjectTemplate,
    'partials/workshops/_empty-project-grid-item': EmptyProjectTemplate,
    'partials/_user-information-small': UserInformationTemplate,
  },

  regions: {
    'list': '.projects-list',
  },

  events: {
    'click .sort-order a': 'updateSortMethod',
    'click .sort-order .tab': 'updateActiveSortTab',
    'click .js-see-more-button': 'loadFullProjectDescription',
  },

  template: ProjectsSectionTemplate,

  templateData: function() {
    const data = _.clone(this.model.attributes);
    data.collection = !!(deepRetrieve(this, 'model', 'collection', 'length'));
    return data;
  },

  afterPreRender: function () {
    this.afterRender();
  },

  afterRender: function() {
    this.renderProjectCard();
    this.maybeHideLoadMoreButton();
    initializeGamificationToast(GAMIFICATION_ACTION_STEPS.UPLOAD_PROJECT);
    ClassSectionView.prototype.afterRender.apply(this, arguments);
  },

  renderProjectCard: function() {
    const {projectCardData} = this.model.get('projectGuide');
    if (projectCardData) {
      const container = this.$(this.CONTAINER_PROJECT_CARD_SELECTOR);
      new ProjectCard({
        model: new Backbone.Model(projectCardData),
        container,
      });
    }
  },

  descriptionFitsContainer: function() {
    const description = this.$(this.DESCRIPTION_CONTENT_WRAPPER_SELECTOR);
    const maxCssHeight = parseInt(description.css('max-height'), 10);
    const scrollHeight = description.prop('scrollHeight');
    return (maxCssHeight && scrollHeight) ? maxCssHeight  > scrollHeight: false;
  },

  maybeHideLoadMoreButton: function() {
    if (this.descriptionFitsContainer()) {
      this.$('.js-see-more-button').hide();
      this.$(this.PROJECT_GUIDE_CONTAINER_SELECTOR).removeClass(this.COLLAPSED_CLASS_PD);
    }
  },

  onSortedViewAttached: function(event) {
    if (event.view.collection.loadMore) {
      event.view.infiniteScroller.enable();
    }
    event.view.fallbackEl = this.$('.empty-section-state');
    event.view.initFallback();
    this.$('.projects-list-container').removeClass('loading-overlay');
  },

  onSortedViewUnattach: function(event) {
    event.view.infiniteScroller.disable();
  },

  // Event handlers
  updateSortMethod: function(event) {
    event.preventDefault();
    const anchor = event.target;
    const href = anchor.href.replace(window.location.protocol + '//' + window.location.hostname, '');

    // I dislike this. This should be a model/collection.
    // Never trust the DOM.
    const sortMethod = extractQueryParams(href).sort;

    if (this.model.get('sortMethod') !== sortMethod) {
      this.$('.projects-list-container').addClass('loading-overlay');
    }

    this.model.set('sortMethod', sortMethod);

    Backbone.history.navigate(href);
  },

  updateActiveSortTab: function(event) {
    event.preventDefault();

    this.$('.sort-order .tab').removeClass('active');
    this.$(event.currentTarget).addClass('active');
  },

  switchSortView: function(model, sortMethod) {
    const viewOpts = {};

    if (_.isEmpty(this.sortViews) && deepRetrieve(this, 'model', 'collection', 'length') !== undefined) {
      // First load
      const collection = viewOpts.collection = this.model.collection;

      // jQuery Promises suck.
      const deferred = $.Deferred();
      deferred.resolve();
      collection.initialLoad = deferred.promise();
    }

    const view = this.sortViews[sortMethod] || this.initSortedView(viewOpts);
    const _this = this;

    view.collection.initialLoad.then(function() {
      if (model.get('sortMethod') === sortMethod) {
        _this.list.attach(view, true);
      }
    });
  },

  initSortedCollection: function() {
    const collection = this.model._newCollection();

    collection.page = -1;
    collection.initialLoad = collection.fetchMore();

    return collection;
  },

  initSortedView: function(opts = {}) {
    const sortMethod = this.model.get('sortMethod');

    const viewOpts = _.extend({
      deferRender: true,
      tagName: 'ul',
      className: 'projects-list row',
      columnSize: 3,
    }, opts);

    if (!viewOpts.collection) {
      viewOpts.collection = this.initSortedCollection();
    }

    const view = new ProjectsCollectionView(viewOpts);
    view.collection.each(this._bubbleChanges, this);
    // setting lastViewTime here is kind of a hack
    // but changing the way the collection is initialized would be even worse
    view.collection.lastViewTime = this.model.get('lastViewTime');
    view.infiniteScroller = new InfiniteScrollerView({
      collection: viewOpts.collection,
      container: view.$el,
      buffer: 250,
    });

    view.on('attached', this.onSortedViewAttached);
    view.on('unattach', this.onSortedViewUnattach);

    this.sortViews[sortMethod] = view;

    return view;
  },

  loadFullProjectDescription: function() {
    this.$(this.PROJECT_GUIDE_CONTAINER_SELECTOR).toggleClass(this.COLLAPSED_CLASS_PD);
  },
});

export default ProjectsSectionView;
