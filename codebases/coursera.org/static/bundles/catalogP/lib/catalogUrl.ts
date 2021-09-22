import _ from 'underscore';
import Uri from 'jsuri';
import path from 'js/lib/path';

// TODO(bryan): consider pulling this out to a parameter for `build`
import resources from 'bundles/catalogP/lib/resources';

const exported = {
  /**
   *  Construct a URL that a naptime resource can consume.
   */
  build(baseResource: $TSFixMe, params: $TSFixMe) {
    const passThroughParams = _(params).omit('id', 'fields', 'includes');
    // @ts-ignore ts-migrate(7053) FIXME: Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
    const ModelClass = resources[baseResource].prototype.model.prototype;

    const data = this.parseIncludes(ModelClass, params.includes);

    this.addToList(data.fields, baseResource, params.fields);

    const urlParams = _({
      fields: this.stringifyMapping(data.fields, baseResource),
      includes: this.stringifyMapping(data.includes, baseResource),
    }).extend(passThroughParams);

    const baseUri = params.id !== undefined ? path.join(baseResource, params.id) : baseResource;

    const uri = _(urlParams).reduce(function (uri, paramValue, paramKey) {
      if (_(paramValue).isUndefined() || (_(paramValue).isArray() && _(paramValue).isEmpty()) || paramValue === '') {
        return uri;
      } else {
        if (_(paramValue).isArray()) {
          paramValue = _(paramValue).sortBy(_.identity);
        }

        // @ts-expect-error ts-migrate(2345) FIXME: Argument of type 'EnumerableKey' is not assignable... Remove this comment to see the full error message
        return uri.addQueryParam(paramKey, paramValue);
      }
    }, new Uri().setPath(baseUri));

    return uri.toString().replace(/%2C/g, ',');
  },

  parseIncludes(ModelClass: $TSFixMe, includes: $TSFixMe) {
    const resourceName = ModelClass.resourceName;
    const fieldsByResource = {};
    const includesByResource = {};

    _(includes || {}).each(
      function (includeData: $TSFixMe, include: $TSFixMe) {
        /*
         * Determine the property name of the related model on the backend, and add it
         * to the list of requested fields and requested includes
         */
        const includeAttribute = ModelClass.getIncludeAttribute(include);
        const includeResource = ModelClass.getIncludeResource(include);

        // Fail fast for invalid resources
        if (includeResource === undefined) {
          return {};
        }

        // @ts-ignore ts-migrate(7053) FIXME: Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
        const RelatedCollectionClass = resources[includeResource];
        const RelatedModelClass = RelatedCollectionClass && RelatedCollectionClass.prototype.model.prototype;

        // Fail fast for missing model definition
        if (RelatedModelClass === undefined) {
          return {};
        }

        // Add the related resource to the list of fields and includes to request
        // @ts-expect-error ts-migrate(2683) FIXME: 'this' implicitly has type 'any' because it does n... Remove this comment to see the full error message
        this.addToList(fieldsByResource, resourceName, includeAttribute);
        // @ts-expect-error ts-migrate(2683) FIXME: 'this' implicitly has type 'any' because it does n... Remove this comment to see the full error message
        this.addToList(includesByResource, resourceName, includeAttribute);

        // Add the related resource's fields to the list of fields to request
        // @ts-expect-error ts-migrate(2683) FIXME: 'this' implicitly has type 'any' because it does n... Remove this comment to see the full error message
        this.addToList(fieldsByResource, includeResource, includeData.fields);

        // If the include has nested includes, recursively call `parseIncludes` to find all of those too
        // @ts-expect-error ts-migrate(2683) FIXME: 'this' implicitly has type 'any' because it does n... Remove this comment to see the full error message
        const subIncludes = this.parseIncludes(RelatedModelClass, includeData.includes);

        // And combine the results of the recursive call into `fieldsByResource` and `includesByResource`
        _(subIncludes.fields).each(
          function (val: $TSFixMe, key: $TSFixMe) {
            // @ts-expect-error ts-migrate(2683) FIXME: 'this' implicitly has type 'any' because it does n... Remove this comment to see the full error message
            this.addToList(fieldsByResource, key, val);
            // @ts-expect-error ts-migrate(2683) FIXME: 'this' implicitly has type 'any' because it does n... Remove this comment to see the full error message
          }.bind(this)
        );

        _(subIncludes.includes).each(
          function (val: $TSFixMe, key: $TSFixMe) {
            // @ts-expect-error ts-migrate(2683) FIXME: 'this' implicitly has type 'any' because it does n... Remove this comment to see the full error message
            this.addToList(includesByResource, key, val);
            // @ts-expect-error ts-migrate(2683) FIXME: 'this' implicitly has type 'any' because it does n... Remove this comment to see the full error message
          }.bind(this)
        );
      }.bind(this)
    );

    return {
      fields: fieldsByResource,
      includes: includesByResource,
    };
  },

  /**
   *  Add a value (or values) to an array at obj[key], initializing the array if it doesn't exist
   */
  addToList(obj: $TSFixMe, key: $TSFixMe, val: $TSFixMe) {
    if (!_(val).isArray()) {
      val = [val];
    }

    obj[key] = _(obj[key] || []).union(val);
  },

  /**
   *  Convert a mapping of fields / subfields to a Naptime-compatible string
   *  For subresources, converts to the format `resource.v1(field1,field2)`
   *  For the base resource, converts to the format `field1,field2`
   */
  stringifyMapping(map: $TSFixMe, baseResource: $TSFixMe) {
    const strings = _(map).map(function (fields, resource) {
      fields = _(fields).compact();
      if (!_(fields).isEmpty()) {
        const fieldsString = _(fields).sortBy(_.identity).join(',');
        if (resource === baseResource) {
          return fieldsString;
        } else {
          return resource + '(' + fieldsString + ')';
        }
      }
    });

    return _(strings).compact().join(',');
  },
};

export default exported;

export const { build, parseIncludes, addToList, stringifyMapping } = exported;
