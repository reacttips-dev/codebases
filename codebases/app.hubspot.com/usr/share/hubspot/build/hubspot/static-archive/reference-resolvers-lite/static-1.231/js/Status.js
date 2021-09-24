'use es6';

export var STATUS_ERROR = 'error';
export var STATUS_IDLE = 'idle';
export var STATUS_LOADING = 'loading';
export var STATUS_SUCCESS = 'success';
export var isError = function isError(status) {
  return status === STATUS_ERROR;
};
export var isIdle = function isIdle(status) {
  return status === STATUS_IDLE;
};
export var isLoading = function isLoading(status) {
  return status === STATUS_LOADING;
};
export var isSuccess = function isSuccess(status) {
  return status === STATUS_SUCCESS;
};