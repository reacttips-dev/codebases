import { all } from 'redux-saga/effects';

export function createRootSaga(sagas) {
  return function* () {
    yield all(loadSagas(sagas));
  };
}

function loadSagas(sagas) {
  return sagas.map(sagaFn => sagaFn());
}

