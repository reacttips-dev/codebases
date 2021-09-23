import { Record } from 'immutable';
import { UNINITIALIZED } from './constants/asyncStatuses';

/**
 * AsyncData is a record that stores a status along side state for asynchronous data (eg: network requests, pub sub).
 * AsyncData will infer `data`'s type if a non-null `data` value is provided, otherwise
 * the type can be manually set. (eg: new AsyncData<Foo>())
 *
 * Use Cases:
 * - Single data object (eg: portal settings, user settings)
 * - Collection of data that is returned in a single request that may or may not be paginated (eg: inbox views, threads)
 * - Indexed Collection that is fetched individually (eg: thread histories, contacts, responders)
 * - Indexed Collection that is fetched in bulk (eg: tickets, deals)
 *
 * @param {Object|Map} props
 * @param {Any} [props.data=null] data that is asynchronous
 * @param {Any} [props.error=null] an error state
 * @param {Number} [props.updatedAt=null] the last time the record was updated at
 * @param {Map} [status=UNINITIALIZED] the current state of the asynchronous operation
 *
 * @example <caption>Single data object or a collection of data that is returned in a single request</caption>
 * const initialState = new AsyncData();
 *
 * handleActions(
 *   {
 *     [GET_THING_STARTED](state) {
 *         return requestStarted(state);
 *     },
 *     [GET_THING_SUCCEEDED](state, action) {
 *         return requestSucceededWithOperator(() => action.payload.data, state);
 *     },
 *     [GET_THING_FAILED](state) {
 *         return requestFailed(state);
 *     },
 *  },
 *  initialState
 *  );
 *
 * @example <caption>Collection of paginated data</caption>
 * const initialState = new AsyncData({
 *   data: Map({
 *      items: Map(),
 *      offset: 0,
 *   })
 * });
 *
 * handleActions(
 *   {
 *     [GET_PAGINATED_THING_STARTED](state) {
 *         return requestStarted(state);
 *     },
 *     [GET_PAGINATED_THING_SUCCEEDED](state, action) {
 *         return requestSucceededWithOperator(existing => (
 *           existing
 *             .update('items', items => items.merge(action.payload.data))
 *             .set('offset', action.payload.offset)
 *         ), state);
 *     },
 *     [GET_PAGINATED_THING_FAILED](state) {
 *        return requestFailed(state);
 *     },
 *  },
 *  initialState
 *  );
 *
 * @example <caption>AsyncData State</caption>
 * AsyncData {
 *    data: InboxViews,
 *    status: 'SUCCEEDED'
 * }
 */
var AsyncData = Record({
  data: null,
  error: null,
  status: UNINITIALIZED,
  updatedAt: null
}, 'AsyncData');
export default AsyncData;