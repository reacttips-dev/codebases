import _ from 'lodash';
import memoize from 'js/lib/memoize';
import NaptimeResource from 'bundles/naptimejs/resources/NaptimeResource';

export const requireFields = function (...fields: string[]) {
  return function (target: NaptimeResource, name: string, descriptor: PropertyDescriptor) {
    if (!descriptor.get) return;
    const { constructor } = target;
    if (!constructor.REQUIRED_FIELDS) constructor.REQUIRED_FIELDS = {};
    const requiredFields = constructor.REQUIRED_FIELDS[name] || [];
    constructor.REQUIRED_FIELDS[name] = _.union(requiredFields, fields);
  };
};

const expandRequiredFields = function (
  fields: string[],
  dependencyMap: Record<string, string[]> = {},
  toExpand: string[] = []
): string[] {
  if (!toExpand.length) return fields;
  const dependentFields: string[] = _.uniq(_.flattenDeep(_.map(toExpand, (field) => dependencyMap[field] || [])));
  const requiredFields = _.union(fields, dependentFields);
  const toBeExpanded = _.difference(dependentFields, fields);
  return expandRequiredFields(requiredFields, dependencyMap, toBeExpanded);
};

/* memoized because this can get very slow for components with many subcomponents */
export const getRequiredFields = memoize(
  (decoratedClass: typeof NaptimeResource, ...fields: string[]) => {
    const { REQUIRED_FIELDS = {} } = decoratedClass;
    const computedFields = _.keys(REQUIRED_FIELDS);
    return _.difference(expandRequiredFields(fields, REQUIRED_FIELDS, fields), computedFields);
  },
  (decoratedClass: typeof NaptimeResource, ...fields: string[]) => {
    const { RESOURCE_NAME, REQUIRED_FIELDS = {} } = decoratedClass;
    const computedFields = _.keys(REQUIRED_FIELDS);
    return computedFields.concat(fields).concat([RESOURCE_NAME]);
  }
);
