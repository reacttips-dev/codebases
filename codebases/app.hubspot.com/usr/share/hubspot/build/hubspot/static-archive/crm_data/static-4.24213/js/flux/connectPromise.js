'use es6';

import partial from '../utils/partial';
import defaultDispatcher from 'dispatcher/dispatcher';
import { connectCallback } from 'general-store';
import invariant from 'react-utils/invariant';
import { isLoading as defaultIsLoading } from './LoadingStatus';
import defer from 'hs-promise-utils/defer';

function _enforceIsLoading(isLoading) {
  invariant(typeof isLoading === 'function', 'connectPromise: Expected param `isLoading` to be type function but got `%s`', typeof isLoading);
}

function someFieldsLoading(isLoading, state) {
  return Object.keys(state).some(function (field) {
    return isLoading(state[field]);
  });
}

function makePromise(connector, isLoading, props) {
  var deferred = defer();
  connector(function (error, state, prevState, remove) {
    if (error) {
      deferred.reject(error);
      return;
    }

    if (someFieldsLoading(isLoading, state)) {
      return;
    }

    remove();
    deferred.resolve(state);
  }, props);
  return deferred.promise;
}
/**
 * Similar to `GeneralStore.connect`, accepts an object of Stores and/or
 * dependency objects and returns a function which (instead of wrapping a react
 * component) returns a promise to the data described in the dependency.
 *
 *
 * @example
 * import UserStore from 'crm_data/user/UserStore';
 * const fetchUser = connectPromise({userData: UserDataStore});
 *
 *
 * By default, the promise resolves once deref() !== LOADING. The optional
 * `isLoading` param allows you to specify a custom resolution test.
 *
 *
 * @example
 * import CustomLoadingStore from 'CustomLoadingStore';
 * const fetchCustomData = connectPromise(
 *   {custom: CustomLoadingStore},
 *   (data) => data.loading
 * );
 *
 *
 * You can also parameterize the fetcher by passing "props" to the fetcher.
 *
 * @example
 * import { connectPromise } from 'crm_data/flux/connectPromise';
 * import PropertiesStore from 'crm_data/properties/PropertiesStore';
 *
 * const fetchProperties({
 *   properties: {
 *     stores: [PropertiesStore],
 *     deref({objectType}) {
 *       return PropertiesStore.get(objectType);
 *     },
 *   },
 * });
 *
 * // then to fetch Contact properties...
 * fetchProperties({objectType: 'CONTACT'}).then(({properties}) => ...);
 *
 *
 * It's intended to be 100% compatible with the shared "dependency" definitions,
 * like `SubjectDependency`, that we use in component land.
 *
 *
 * @example
 * import SubjectDependency
 *   from 'crm_ui/flux/dependencies/SubjectDependency';
 *
 * const fetchSubject = connectPromise({subject: SubjectDependency});
 *
 * fetchSubject({
 *   objectType: 'CONTACT',
 *   subjectId: '123456'
 * }).then(
 *   ({subject}) => ...
 * );
 *
 *
 * @param  {object} dependecy object or a Store
 * @param  {?function} isLoading test that returns true until the data is loaded
 * @return {function}
 */


export function connectPromise(dependencies) {
  var isLoading = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : defaultIsLoading;
  var dispatcher = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : defaultDispatcher;

  _enforceIsLoading(isLoading);

  return partial(makePromise, connectCallback(dependencies, dispatcher), isLoading);
}