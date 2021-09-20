/* eslint-disable
    eqeqeq,
*/
// TODO: This file was created by bulk-decaffeinate.
// Fix any style issues and re-enable lint.
/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS102: Remove unnecessary code created because of implicit returns
 * DS205: Consider reworking code to avoid use of IIFEs
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const View = require('app/scripts/views/internal/view');
const _ = require('underscore');

module.exports = class CollectionView extends View {
  constructor(options) {
    super(options);
    this.sort = this.sort.bind(this);
  }

  initialize() {
    this.listenPropagators = {};

    this.makeDebouncedMethods('sort');

    this.listenTo(this.collection, {
      sort: this.sortDebounced,
      add: this.addModel,
      remove: this.removeModel,
      reset: this.reset,
    });

    return super.initialize(...arguments);
  }

  getModels() {
    return this.collection.models;
  }

  // Override the subview method to register a blanket listener that will
  // propagate all subview-triggered events to trigger on the CollectionView.
  subview() {
    const view = super.subview(...arguments);
    // @subview gets called a lot, so make sure we only register this once
    if (this.listenPropagators[view.cid] == null) {
      this.listenPropagators[view.cid] = this.listenTo(
        view,
        'all',
        (event, ...args) => {
          return this.trigger(event, view, ...Array.from(args));
        },
      );
    }
    return view;
  }

  addModel(model, options) {
    const view = this.subview(this.viewType, model);
    if (this.el) {
      this.insertSubview(view, _.indexOf(this.getModels(), model));
    }
  }

  removeModel(model, options) {
    return this.removeSubview(this.viewForModel(model));
  }

  reset(collection, { previousModels }) {
    let model;
    const keptModels = {};
    for (model of Array.from(collection.models)) {
      keptModels[model.cid] = true;
    }
    for (model of Array.from(previousModels)) {
      if (!keptModels[model.cid]) {
        this.removeModel(model);
      }
    }
    return this.sort();
  }

  sort() {
    const placeHolderIndices = Array.from(this.el.children)
      .map(function (el, index) {
        if (el.matches('.placeholder,.card-composer')) {
          return index;
        } else {
          return null;
        }
      })
      .filter((index) => index !== null);

    const iterable = this.getModels();
    for (let index = 0; index < iterable.length; index++) {
      const model = iterable[index];
      const effectiveIndex =
        index +
        placeHolderIndices.filter(
          (placeholderIndex) => placeholderIndex <= index,
        ).length;
      this.moveSubviewToPosition(
        this.subview(this.viewType, model),
        effectiveIndex,
      );
    }
  }

  render() {
    let model;
    this.appendSubviews(
      (() => {
        const result = [];
        for (model of Array.from(this.getModels())) {
          result.push(this.subview(this.viewType, model));
        }
        return result;
      })(),
    );
    return this;
  }

  viewForModel(model) {
    return this.existingSubview(this.viewType, model);
  }

  removeSubview(subview) {
    return this.deleteSubview(subview);
  }

  insertSubview(subview, target, $el) {
    if ($el == null) {
      ({ $el } = this);
    }
    // Turn target from an index or a view into an element
    if (typeof target === 'number') {
      if (target <= 0) {
        target = $el.children().eq(0);
      } else if (target < $el.children().length) {
        target = $el.children().eq(target);
      } else {
        target = undefined;
      }
    } else if (target instanceof View) {
      target = target.$el;
    }

    if (subview.$el.is(':empty')) {
      // If the subview's $el is empty, it hasn't been rendered, so render it
      subview.delegateEvents();
      subview.render();
    }

    if ((target != null ? target.length : undefined) > 0) {
      subview.$el.insertBefore(target);
    } else {
      $el.append(subview.$el);
    }
  }

  moveSubviewToPosition(subview, position) {
    if (subview.$el.is(':empty')) {
      // If the subview hasn't been rendered, it needs to also be inserted
      this.insertSubview(subview, position, this.$el);
      return;
    }

    const { children } = this.el;

    const currentPosition = subview.$el.index();
    if (currentPosition === position) {
      return;
    }

    if (position === 0) {
      this.$el.prepend(subview.$el);
    } else if (position >= children.length) {
      this.$el.append(subview.$el);
    } else {
      subview.$el.insertAfter(children[position - 1]);
    }
  }
};
