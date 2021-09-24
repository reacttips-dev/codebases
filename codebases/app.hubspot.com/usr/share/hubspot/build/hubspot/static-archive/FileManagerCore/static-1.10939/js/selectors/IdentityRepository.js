'use es6';

export var getInferredUserRole = function getInferredUserRole(state) {
  return state.identityRepository.get('inferredUserRole');
};