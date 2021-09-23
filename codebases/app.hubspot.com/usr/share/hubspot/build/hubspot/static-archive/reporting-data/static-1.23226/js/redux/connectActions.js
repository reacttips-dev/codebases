'use es6';

export default (function (store, actionCreatorsList) {
  return actionCreatorsList.map(function (creator) {
    return function () {
      return store.dispatch(creator.apply(void 0, arguments));
    };
  });
});