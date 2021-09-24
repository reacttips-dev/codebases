'use es6';

import { DEFAULT, HIDDEN } from 'customer-data-objects/view/ViewTypes';
import { Map as ImmutableMap } from 'immutable';
import { useMemo } from 'react';
import filter from 'transmute/filter';
import pipe from 'transmute/pipe';
import sortBy from 'transmute/sortBy';
import I18n from 'I18n';
import { useConditionalViews } from './useConditionalViews';
import { useConditionalUserId } from '../../auth/hooks/useConditionalUserId';

var mapViewsToOptions = function mapViewsToOptions(views) {
  return views.map(function (view) {
    var viewId = "" + view.id;
    return {
      text: view.name,
      value: viewId
    };
  });
};

var getViewOptions = function getViewOptions(defaultViews, myViews, sharedViews) {
  var defaultViewsOptions = mapViewsToOptions(defaultViews);
  var myViewsOptions = mapViewsToOptions(myViews);
  var sharedViewsOptions = mapViewsToOptions(sharedViews);
  return [{
    text: I18n.text('indexPage.viewSelectorPage.defaultViewsHeader'),
    value: 'defaultViews',
    options: defaultViewsOptions
  }, {
    text: I18n.text('indexPage.viewSelectorPage.myViewsHeader'),
    value: 'myViews',
    options: myViewsOptions
  }, {
    text: I18n.text('indexPage.viewSelectorPage.sharedViewsHeader'),
    value: 'sharedViews',
    options: sharedViewsOptions
  }];
};

export var mapViewsByType = function mapViewsByType(views, userId, searchText) {
  var myViews = [];
  var sharedViews = [];
  var defaultViews = [];

  if (!views) {
    return {
      allViews: ImmutableMap(),
      defaultViews: defaultViews,
      myViews: myViews,
      sharedViews: sharedViews
    };
  }

  views.filter(function (view) {
    return view.type !== HIDDEN;
  }).forEach(function (view) {
    var isOwner = view.ownerId === userId;
    var isDefault = view.type === DEFAULT || view.ownerId === -1;

    if (isOwner) {
      myViews.push(view);
    } else if (isDefault) {
      defaultViews.push(view);
    } else {
      sharedViews.push(view);
    }
  });
  var getResultsOperations = [];

  if (searchText) {
    var searchTextLowerCase = searchText.toLowerCase();
    getResultsOperations.push(filter(function (item) {
      var viewName = item.name || "" + item.id;
      return viewName.toLowerCase().includes(searchTextLowerCase);
    }));
  }

  getResultsOperations.push(sortBy(function (_ref) {
    var name = _ref.name;
    return name ? name.toLowerCase() : '';
  }));
  var getResults = pipe.apply(void 0, getResultsOperations);
  return {
    allViews: views,
    defaultViews: getResults(defaultViews),
    myViews: getResults(myViews),
    sharedViews: getResults(sharedViews)
  };
};
export var useViewsByType = function useViewsByType(objectType, searchText) {
  var views = useConditionalViews({
    objectType: objectType
  }); // HACK: This code requires the userId to be a number or else it will not successfully sort views into the "Created by me" category

  var userId = Number(useConditionalUserId());
  return useMemo(function () {
    return mapViewsByType(views, userId, searchText);
  }, [searchText, userId, views]);
};
export var useViewsAsOptions = function useViewsAsOptions(objectType) {
  var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var searchText = options.searchText;
  var views = useConditionalViews({
    objectType: objectType
  }); // HACK: This code requires the userId to be a number or else it will not successfully sort views into the "Created by me" category

  var userId = Number(useConditionalUserId());

  var _useMemo = useMemo(function () {
    return mapViewsByType(views, userId, searchText);
  }, [searchText, userId, views]),
      defaultViews = _useMemo.defaultViews,
      myViews = _useMemo.myViews,
      sharedViews = _useMemo.sharedViews;

  return useMemo(function () {
    return getViewOptions(defaultViews, myViews, sharedViews);
  }, [defaultViews, myViews, sharedViews]);
};