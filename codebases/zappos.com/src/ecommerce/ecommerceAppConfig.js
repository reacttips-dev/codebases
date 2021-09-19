// Better name for this file which represents 6pm/zappos??
import makeRoutes from 'routes';
import rootSaga from 'store/rootSaga';

const storeOptions = {
  reducers: {},
  rootSaga
};

export {
  makeRoutes,
  storeOptions
};
