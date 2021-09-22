import {
  Get,
  LocalGet,
  LocalMultiGet,
  MultiGet,
  GetAll,
  Finder,
  Update,
  Create,
  Delete,
  Action,
  Patch,
} from 'bundles/naptimejs/client/index';

// import { Client } from 'naptime';
import NaptimeClient, { NaptimeClientQuery, NaptimeClientDataProcessor } from 'bundles/naptimejs/client/NaptimeClient';

class NaptimeResourceError extends Error {
  constructor(message: string) {
    super();
    this.name = 'NaptimeResourceError';
    this.message = message || '';
  }
}

function assertType(argValue: any, argName: string, type: string) {
  // allow undefined because naptimeUrl.parseSubComponents probe always passes empty props
  if (typeof argValue === 'undefined') return;

  const valid = typeof argValue === type || (type === 'array' && Array.isArray(argValue));
  if (!valid) {
    throw new NaptimeResourceError(`argument "${argName}" must be ${type}`);
  }
}

class NaptimeResource {
  // Unfortunately, TypeScript includes a typing that, for all values, types `value.constructor` as `Function`, which
  // means we need to do an unsafe cast to get the right type:
  //
  //     const constructor: typeof NaptimeResource = (this.constructor as unknown) as typeof NaptimeResource;
  //
  // This property definition allows us to avoid the cast. Subclasses can override this with their concrete type should
  // they have need to.
  //
  // See: https://github.com/microsoft/TypeScript/issues/3841#issuecomment-163350868
  ['constructor']: typeof NaptimeResource;

  static REQUIRED_FIELDS: { [value: string]: Array<string> };

  static RESOURCE_NAME: string;

  constructor(params: any) {
    // NaptimeResource classes sometimes have 'getter' properties that don't actually
    // have any backend data. We will refuse to `update` these fields since they
    // do not have setters.
    if (typeof params === 'object' && params !== null) {
      this.update(params);
    }
  }

  update(params: Object) {
    // Sometimes the passed in params are not necessarily settable, namely
    // the properties that are `getters` and don't have any equivalent
    // backend fields. Skip over these fields when updating the resource.
    Object.keys(params).forEach((key) => {
      try {
        // @ts-ignore Don't know how to type this
        this[key] = params[key];
      } catch (e) {}
    });
  }

  clone(params: any) {
    return new this.constructor(Object.assign({}, this, params));
  }

  static get<Resource extends NaptimeResourceType, Result = InstanceType<Resource>>(
    this: Resource,
    id: string | number,
    query?: NaptimeClientQuery,
    dataProcessor?: NaptimeClientDataProcessor<Result, Resource>
  ): NaptimeClient<Result> {
    // TODO tighten contract for 'id', which is sometimes passed in as Number, sometimes String
    // assertType(id, 'id', 'string');
    if (query) assertType(query, 'query', 'object');
    return new Get(this, id, query, dataProcessor);
  }

  static localGet<Resource extends NaptimeResourceType>(
    this: Resource,
    id: string | number,
    query?: NaptimeClientQuery
  ): NaptimeClient<InstanceType<Resource>> {
    // TODO tighten contract for 'id', which is sometimes passed in as Number, sometimes String
    // assertType(id, 'id', 'string');
    if (query) assertType(query, 'query', 'object');
    return new LocalGet(this, id, query);
  }

  static localMultiGet<Resource extends NaptimeResourceType, Result = InstanceType<Resource>[]>(
    this: Resource,
    ids: Array<string | number>,
    query?: NaptimeClientQuery,
    dataProcessor?: NaptimeClientDataProcessor<Result, Resource[]>
  ): NaptimeClient<Result> {
    assertType(ids, 'ids', 'array');
    if (query) assertType(query, 'query', 'object');
    return new LocalMultiGet(this, ids, query, dataProcessor);
  }

  static getAll<Resource extends NaptimeResourceType>(
    this: Resource,
    query?: NaptimeClientQuery
  ): NaptimeClient<InstanceType<Resource>[]> {
    if (query) assertType(query, 'query', 'object');
    return new GetAll(this, query);
  }

  // TODO: auto-generate `finderName` with possible parameters via codegen
  static finder<Resource extends NaptimeResourceType, Result = InstanceType<Resource>[]>(
    this: Resource,
    finderName: string,
    query?: NaptimeClientQuery,
    dataProcessor?: NaptimeClientDataProcessor<Result, Resource[]>
  ): NaptimeClient<Result> {
    assertType(finderName, 'finderName', 'string');
    if (query) assertType(query, 'query', 'object');
    return new Finder(this, finderName, query, dataProcessor);
  }

  static multiGet<Resource extends NaptimeResourceType, Result = InstanceType<Resource>[]>(
    this: Resource,
    ids: Array<string | number>,
    query?: NaptimeClientQuery,
    dataProcessor?: NaptimeClientDataProcessor<Result, Resource[]>
  ): NaptimeClient<Result> {
    assertType(ids, 'ids', 'array');
    if (query) assertType(query, 'query', 'object');
    return new MultiGet(this, ids, query, dataProcessor);
  }

  static delete(id: string | number, params: Object = {}) {
    return new Delete(this, id, params);
  }

  static update(id: string | number, body: any) {
    return new Update(this, id, { body });
  }

  static create(body: any, params: Object = {}) {
    return new Create(this, { body, params });
  }

  static action(actionName: string, body?: any, params: Object = {}) {
    return new Action(this, actionName, { body, params });
  }

  static patch(id: string | number, body: any) {
    return new Patch(this, id, { body });
  }
}

export type NaptimeResourceType = typeof NaptimeResource;

export default NaptimeResource;
