'use es6';

export default {
  began: function began(action) {
    return action + "_BEGAN";
  },
  success: function success(action) {
    return action + "_SUCCESS";
  },
  error: function error(action) {
    return action + "_ERROR";
  }
};