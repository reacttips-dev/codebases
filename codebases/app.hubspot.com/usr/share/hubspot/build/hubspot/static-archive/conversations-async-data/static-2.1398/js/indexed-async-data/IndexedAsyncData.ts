import { Record, Map as ImmutableMap, Set as ImmutableSet } from 'immutable';
import { idToString } from './operators/idToString';
import { numberIdInvariant } from './invariants/numberIdInvariant';

/**
 * IndexedAsyncData is a collection of asynchronous data indexed by an `id`. The data is
 * fetched individually or in bulk.
 *
 * IndexedAsyncData will type the internal AsyncDatas based on `entries` if `entries`
 * is provided, otherwise it can be typed via its type param. (eg: new IndexedAsyncData<Foo, Bar>())
 *
 * Use Cases:
 * - Collection that is fetched individually (eg: thread histories, contacts, responders)
 * - Collection that is fetched in bulk (eg: tickets, deals)
 *
 * @param {Object|Map} props
 * @param {Map} [props.entries=Map()] entries in the collection
 * @param {Function} [props.evict=Set()] a function to evict entries by id. Called by operators.
 * @param {Function} [props.idInvariant=numberIdInvariant] id invariant
 * @param {Function} [props.idTransform=idToString] transform an id into a key
 * @param {String} [props.name=null] a string used to identify the IndexedAsyncData instance (often for debugging)
 * @param {Any} [props.notSetValue=null] use this value when operating on an entry that does not exist
 *
 * @example <caption>Collection of indexed data that is fetched individually</caption>
 * const initialState = new IndexedAsyncData({ notSetValue: AsyncData() });
 *
 * handleActions(
 *   {
 *     [GET_A_SINGLE_THING_STARTED](state, action) {
 *       return updateEntry(action.id, requestStarted, state);
 *     },
 *     [GET_A_SINGLE_THING_SUCCEEDED](state, action) {
 *       return updateEntry(
 *         action.id,
 *         requestSucceededWithOperator(() => action.payload.data)
 *         state
 *       );
 *     },
 *     [GET_A_SINGLE_THING_FAILED](state) {
 *       return updateEntry(
 *         action.id,
 *         requestFailed
 *         state
 *       );
 *     },
 *   },
 *   initialState
 * );
 *
 * @example <caption>Collection of indexed data that are fetched in bulk</caption>
 * const initialState = new IndexedAsyncData({
 *   idTransform: (id) => List([id.objectType, id.subjectId]),
 *   notSetValue: AsyncData({ data: ContactRecord }),
 *   name: 'bulkThingsReducer'
 * });
 *
 * handleActions(
 *   {
 *     [GET_BULK_THINGS_STARTED](state, action) {
 *       return updateEntries(action.ids, requestStarted, state);
 *     },
 *     [GET_BULK_THINGS_SUCCEEDED](state, action) {
 *       const { newItems } = action.payload; // Map of id : data
 *
 *       return updateEntries(
 *         newItems.keySeq(),
 *         (id, asyncData) => requestSucceededWithOperator(() => newItems.get(id), asyncData)
 *         state
 *       );
 *     },
 *     [GET_BULK_THINGS_FAILED](state) {
 *       return updateEntries(
 *         action.ids,
 *         requestFailed
 *         state
 *       );
 *     },
 *   },
 *   initialState
 * );
 *
 * @example <caption>IndexedAsyncData with a simple key</caption>
 * IndexedAsyncData {
 *   idInvariant: numberIdInvariant, // this is the default
 *   idTransform: idToString, // this is the default
 *   entries: Map {
 *     '123125' : AsyncData { data: ThreadHistory, status: 'SUCCEEDED' },
 *     '433422' : AsyncData { data: null, status: 'FAILED' },
 *   },
 *   notSetValue: AsyncData { data: new ThreadHistory(), status: UNINITIALIZED }
 * }
 *
 * @example <caption>IndexedAsyncData with a complex key</caption>
 * IndexedAsyncData {
 *   idInvariant: (id) => invariant(
 *      id && id.objectType && id.subjectId,
 *      'Expected id to contain an objectType and subjectId'
 *   ),
 *   idTransform: (id) => List([id.objectType, id.subjectId]),
 *   entries: Map {
 *     List [ CONTACT, 123 ] : AsyncData { data: ContactRecord, status: 'SUCCEEDED' },
 *     List [ CONTACT, 456 ] : AsyncData { data: null, status: 'STARTED' },
 *   },
 *   notSetValue: AsyncData { data: ContactRecord(), status: UNINITIALIZED }
 * }
 */
var IndexedAsyncData = Record({
  entries: ImmutableMap(),
  evict: function evict() {
    return ImmutableSet();
  },
  idInvariant: numberIdInvariant,
  idTransform: idToString,
  name: null,
  notSetValue: null
}, 'IndexedAsyncData');
export default IndexedAsyncData;