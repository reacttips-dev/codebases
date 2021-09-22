import { forEach } from 'property-expr';

var trim = function trim(part) {
  return part.substr(0, part.length - 1).substr(1);
};

export function getIn(schema, path, value, context) {
  if (context === void 0) {
    context = value;
  }

  var parent, lastPart, lastPartDebug; // root path: ''

  if (!path) return {
    parent: parent,
    parentPath: path,
    schema: schema
  };
  forEach(path, function (_part, isBracket, isArray) {
    var part = isBracket ? trim(_part) : _part;
    schema = schema.resolve({
      context: context,
      parent: parent,
      value: value
    });

    if (schema.innerType) {
      var idx = isArray ? parseInt(part, 10) : 0;

      if (value && idx >= value.length) {
        throw new Error("Yup.reach cannot resolve an array item at index: " + _part + ", in the path: " + path + ". " + "because there is no value at that index. ");
      }

      parent = value;
      value = value && value[idx];
      schema = schema.innerType;
    } // sometimes the array index part of a path doesn't exist: "nested.arr.child"
    // in these cases the current part is the next schema and should be processed
    // in this iteration. For cases where the index signature is included this
    // check will fail and we'll handle the `child` part on the next iteration like normal


    if (!isArray) {
      if (!schema.fields || !schema.fields[part]) throw new Error("The schema does not contain the path: " + path + ". " + ("(failed at: " + lastPartDebug + " which is a type: \"" + schema._type + "\")"));
      parent = value;
      value = value && value[part];
      schema = schema.fields[part];
    }

    lastPart = part;
    lastPartDebug = isBracket ? '[' + _part + ']' : '.' + _part;
  });
  return {
    schema: schema,
    parent: parent,
    parentPath: lastPart
  };
}

var reach = function reach(obj, path, value, context) {
  return getIn(obj, path, value, context).schema;
};

export default reach;