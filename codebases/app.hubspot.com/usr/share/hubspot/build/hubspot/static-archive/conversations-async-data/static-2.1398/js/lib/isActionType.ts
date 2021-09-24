var isActionType = function isActionType(maybeValidActionType) {
  return Boolean(typeof maybeValidActionType === 'string' && maybeValidActionType.length);
};

export default isActionType;