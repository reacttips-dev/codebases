'use es6';

import _defineProperty from "@babel/runtime/helpers/esm/defineProperty";
import partial from '../utils/partial';
import { connectPromise } from './connectPromise';
var FIELD_KEY = '__data__';

function extractData(data) {
  return data[FIELD_KEY];
}

function extractingConnect(baseConnect) {
  for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    args[_key - 1] = arguments[_key];
  }

  return baseConnect.apply(void 0, args).then(extractData);
}
/**
 * Similar to `connectPromise`, but accepts _one_ Store or dependency object
 * instead of many.
 *
 *
 * @example
 * import UserStore from 'crm_data/user/UserStore';
 * const fetchUser = connectPromiseSingle(UserDataStore);
 *
 *
 * By default, the promise resolves once deref() !== LOADING. The optional
 * `isLoading` param allows you to specify a custom resolution test.
 *
 *
 * @example
 * import CustomLoadingStore from 'CustomLoadingStore';
 * const fetchCustomData = connectPromiseSingle(
 *   CustomLoadingStore,
 *   (data) => data.loading
 * );
 *
 *
 * You can also parameterize the fetcher by passing "props" to the fetcher.
 *
 * @example
 * import { connectPromiseSingle } from 'crm_data/flux/connectPromiseSingle';
 * import PropertiesStore from 'crm_data/properties/PropertiesStore';
 *
 * const fetchProperties = connectPromiseSingle({
 *   stores: [PropertiesStore],
 *   deref({objectType}) {
 *     return PropertiesStore.get(objectType);
 *   },
 * });
 *
 * // then to fetch Contact properties...
 * fetchProperties({objectType: 'CONTACT'}).then((properties) => ...);
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
 * const fetchSubject = connectPromiseSingle(SubjectDependency);
 *
 * fetchSubject({
 *   objectType: 'CONTACT',
 *   subjectId: '123456'
 * }).then(
 *   (contact) => ...
 * );
 *
 *
 * @param  {object} dependecy object or a Store
 * @param  {?function} isLoading test that returns true until the data is loaded
 * @return {function}
 */


export function connectPromiseSingle(dependency, isLoading) {
  return partial(extractingConnect, connectPromise(_defineProperty({}, FIELD_KEY, dependency), isLoading));
}