import Uri from 'jsuri';
import { getRequiredFields } from 'bundles/naptimejs/util/requireFieldsDecorator';
import buildUri from 'bundles/naptimejs/util/buildUri';

import { NaptimeResourceType } from 'bundles/naptimejs/resources/NaptimeResource';

// TODO: write correct type for finders queries (fields, includes, params etc)
export type NaptimeClientQuery = Record<string, $TSFixMe>;

export type NaptimeClientDataProcessor<Result, Resource extends NaptimeResourceType | NaptimeResourceType[]> = (
  data: Resource extends NaptimeResourceType
    ? InstanceType<Resource> | undefined
    : Resource extends NaptimeResourceType[]
    ? Array<InstanceType<Resource[number]> | undefined>
    : undefined
) => Result;

class NaptimeClient<Result, Resource extends NaptimeResourceType = NaptimeResourceType> {
  resourceName: string;

  resource: Resource;

  dataProcessor: NaptimeClientDataProcessor<Result, Resource>;

  data: NaptimeClientQuery;

  method?: string;

  constructor(
    resource: Resource,
    data?: NaptimeClientQuery,
    dataProcessor: NaptimeClientDataProcessor<Result, Resource | Resource[]> = (d) => d as Result
  ) {
    this.resource = resource;
    this.resourceName = resource.RESOURCE_NAME;
    this.data = data || {};
    this.dataProcessor = dataProcessor;
  }

  getBaseUri() {
    return new Uri(`/api/${this.resourceName}`);
  }

  getUri() {
    return buildUri(this.getBaseUri(), this.data.params);
  }

  getParams() {
    return this.data.params;
  }

  getFields() {
    const fields = this.data.fields || [];
    return getRequiredFields(this.resource, ...fields);
  }

  isRequiredForRender() {
    // the default is for the data to be always required.
    return this.data.required === undefined || !!this.data.required;
  }

  getIncludes() {
    return this.data.includes || [];
  }

  getSubcomponents() {
    return this.data.subcomponents || [];
  }

  isValid() {
    return true;
  }

  processData(data: $TSFixMe /* TODO: finish with dataProcessor type */) {
    return this.dataProcessor(data);
  }

  /**
   * NOTE: Clients are expected to implement this!!! View the other NaptimeClients as
   * reference. This takes the format of ClientType:metadata|resourceName|f:fields|i:includes,
   * which is a format that can be parsed and used in other places without having to pass
   * a full client around.
   *
   * Like "toString" but returns an identifier for this client that can be recreated
   * given the same client and same fields. Will be used for comparisons within NaptimeJS
   * internally.
   *
   * NOTE: This could possibly be optimized for space efficiency in the future, but for
   * it's initial use case it does not matter.
   */
  getClientIdentifier() {
    const fields = this.getFields();
    const includes = this.getIncludes();

    const idParts = [this.resourceName];

    if (fields.length > 0) {
      idParts.push(`f:${this.getFields().sort().join(',')}`);
    }
    if (includes.length > 0) {
      idParts.push(`i:${this.getIncludes().sort().join(',')}`);
    }

    return idParts.join('|');
  }
}

export default NaptimeClient;
