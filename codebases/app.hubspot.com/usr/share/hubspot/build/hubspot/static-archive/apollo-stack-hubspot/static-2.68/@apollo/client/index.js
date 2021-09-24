"use strict";
'use es6';

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.fromError = fromError;
exports.fromPromise = fromPromise;
exports.resetApolloContext = exports.getApolloContext = getApolloContext;
exports.isApolloError = isApolloError;
exports.isReference = isReference;
exports.makeReference = makeReference;
exports.makeVar = makeVar;
exports.operationName = operationName;
exports.toPromise = toPromise;
exports.useApolloClient = useApolloClient;
exports.useLazyQuery = useLazyQuery;
exports.useMutation = useMutation;
exports.useQuery = useQuery;
exports.useReactiveVar = useReactiveVar;
exports.throwServerError = exports.split = exports.gql = exports.from = exports.execute = exports.empty = exports.defaultDataIdFromObject = exports.concat = exports.ObservableQuery = exports.Observable = exports.NetworkStatus = exports.MissingFieldError = exports.InMemoryCache = exports.DocumentType = exports.Cache = exports.ApolloProvider = exports.ApolloLink = exports.ApolloError = exports.ApolloConsumer = exports.ApolloClient = exports.ApolloCache = void 0;

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _visitor = require("graphql/language/visitor");

var _fastJsonStableStringify = _interopRequireDefault(require("fast-json-stable-stringify"));

var _react = _interopRequireWildcard(require("react"));

/*! *****************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */

/* global Reflect, Promise */
var _extendStatics = function extendStatics(d, b) {
  _extendStatics = Object.setPrototypeOf || {
    __proto__: []
  } instanceof Array && function (d, b) {
    d.__proto__ = b;
  } || function (d, b) {
    for (var p in b) {
      if (b.hasOwnProperty(p)) d[p] = b[p];
    }
  };

  return _extendStatics(d, b);
};

function __extends(d, b) {
  _extendStatics(d, b);

  function __() {
    this.constructor = d;
  }

  d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
}

var _assign = function __assign() {
  _assign = Object.assign || function __assign(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
      s = arguments[i];

      for (var p in s) {
        if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
      }
    }

    return t;
  };

  return _assign.apply(this, arguments);
};

function __rest(s, e) {
  var t = {};

  for (var p in s) {
    if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0) t[p] = s[p];
  }

  if (s != null && typeof Object.getOwnPropertySymbols === "function") for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
    if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i])) t[p[i]] = s[p[i]];
  }
  return t;
}

function __awaiter(thisArg, _arguments, P, generator) {
  function adopt(value) {
    return value instanceof P ? value : new P(function (resolve) {
      resolve(value);
    });
  }

  return new (P || (P = Promise))(function (resolve, reject) {
    function fulfilled(value) {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    }

    function rejected(value) {
      try {
        step(generator["throw"](value));
      } catch (e) {
        reject(e);
      }
    }

    function step(result) {
      result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
    }

    step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
}

function __generator(thisArg, body) {
  var _ = {
    label: 0,
    sent: function sent() {
      if (t[0] & 1) throw t[1];
      return t[1];
    },
    trys: [],
    ops: []
  },
      f,
      y,
      t,
      g;
  return g = {
    next: verb(0),
    "throw": verb(1),
    "return": verb(2)
  }, typeof Symbol === "function" && (g[Symbol.iterator] = function () {
    return this;
  }), g;

  function verb(n) {
    return function (v) {
      return step([n, v]);
    };
  }

  function step(op) {
    if (f) throw new TypeError("Generator is already executing.");

    while (_) {
      try {
        if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
        if (y = 0, t) op = [op[0] & 2, t.value];

        switch (op[0]) {
          case 0:
          case 1:
            t = op;
            break;

          case 4:
            _.label++;
            return {
              value: op[1],
              done: false
            };

          case 5:
            _.label++;
            y = op[1];
            op = [0];
            continue;

          case 7:
            op = _.ops.pop();

            _.trys.pop();

            continue;

          default:
            if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) {
              _ = 0;
              continue;
            }

            if (op[0] === 3 && (!t || op[1] > t[0] && op[1] < t[3])) {
              _.label = op[1];
              break;
            }

            if (op[0] === 6 && _.label < t[1]) {
              _.label = t[1];
              t = op;
              break;
            }

            if (t && _.label < t[2]) {
              _.label = t[2];

              _.ops.push(op);

              break;
            }

            if (t[2]) _.ops.pop();

            _.trys.pop();

            continue;
        }

        op = body.call(thisArg, _);
      } catch (e) {
        op = [6, e];
        y = 0;
      } finally {
        f = t = 0;
      }
    }

    if (op[0] & 5) throw op[1];
    return {
      value: op[0] ? op[1] : void 0,
      done: true
    };
  }
}

function __spreadArrays() {
  for (var s = 0, i = 0, il = arguments.length; i < il; i++) {
    s += arguments[i].length;
  }

  for (var r = Array(s), k = 0, i = 0; i < il; i++) {
    for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++) {
      r[k] = a[j];
    }
  }

  return r;
}

(function (Object) {
  typeof globalThis !== 'object' && (this ? get() : (Object.defineProperty(Object.prototype, '_T_', {
    configurable: true,
    get: get
  }), _T_));

  function get() {
    var global = this || self;
    global.globalThis = global;
    delete Object.prototype._T_;
  }
})(Object);

var globalThis$1 = globalThis;
var genericMessage = "Invariant Violation";
var _a = Object.setPrototypeOf,
    setPrototypeOf = _a === void 0 ? function (obj, proto) {
  obj.__proto__ = proto;
  return obj;
} : _a;

var InvariantError =
/** @class */
function (_super) {
  __extends(InvariantError, _super);

  function InvariantError(message) {
    if (message === void 0) {
      message = genericMessage;
    }

    var _this = _super.call(this, typeof message === "number" ? genericMessage + ": " + message + " (see https://github.com/apollographql/invariant-packages)" : message) || this;

    _this.framesToPop = 1;
    _this.name = genericMessage;
    setPrototypeOf(_this, InvariantError.prototype);
    return _this;
  }

  return InvariantError;
}(Error);

function invariant(condition, message) {
  if (!condition) {
    throw new InvariantError(message);
  }
}

var verbosityLevels = ["log", "warn", "error", "silent"];
var verbosityLevel = verbosityLevels.indexOf("log");

function wrapConsoleMethod(method) {
  return function () {
    if (verbosityLevels.indexOf(method) >= verbosityLevel) {
      return console[method].apply(console, arguments);
    }
  };
}

(function (invariant) {
  invariant.log = wrapConsoleMethod("log");
  invariant.warn = wrapConsoleMethod("warn");
  invariant.error = wrapConsoleMethod("error");
})(invariant || (invariant = {}));

var processStub = globalThis$1.process || {
  env: {}
};
if (!globalThis$1.process) try {
  Object.defineProperty(globalThis$1, "process", {
    value: processStub
  });
} catch (_b) {// If this fails, it isn't the end of the world.
}

function shouldInclude(_a, variables) {
  var directives = _a.directives;

  if (!directives || !directives.length) {
    return true;
  }

  return getInclusionDirectives(directives).every(function (_a) {
    var directive = _a.directive,
        ifArgument = _a.ifArgument;
    var evaledValue = false;

    if (ifArgument.value.kind === 'Variable') {
      evaledValue = variables && variables[ifArgument.value.name.value];
      process.env.NODE_ENV === "production" ? invariant(evaledValue !== void 0, 38) : invariant(evaledValue !== void 0, "Invalid variable referenced in @" + directive.name.value + " directive.");
    } else {
      evaledValue = ifArgument.value.value;
    }

    return directive.name.value === 'skip' ? !evaledValue : evaledValue;
  });
}

function getDirectiveNames(root) {
  var names = [];
  (0, _visitor.visit)(root, {
    Directive: function Directive(node) {
      names.push(node.name.value);
    }
  });
  return names;
}

function hasDirectives(names, root) {
  return getDirectiveNames(root).some(function (name) {
    return names.indexOf(name) > -1;
  });
}

function hasClientExports(document) {
  return document && hasDirectives(['client'], document) && hasDirectives(['export'], document);
}

function isInclusionDirective(_a) {
  var value = _a.name.value;
  return value === 'skip' || value === 'include';
}

function getInclusionDirectives(directives) {
  var result = [];

  if (directives && directives.length) {
    directives.forEach(function (directive) {
      if (!isInclusionDirective(directive)) return;
      var directiveArguments = directive.arguments;
      var directiveName = directive.name.value;
      process.env.NODE_ENV === "production" ? invariant(directiveArguments && directiveArguments.length === 1, 39) : invariant(directiveArguments && directiveArguments.length === 1, "Incorrect number of arguments for the @" + directiveName + " directive.");
      var ifArgument = directiveArguments[0];
      process.env.NODE_ENV === "production" ? invariant(ifArgument.name && ifArgument.name.value === 'if', 40) : invariant(ifArgument.name && ifArgument.name.value === 'if', "Invalid argument for the @" + directiveName + " directive.");
      var ifValue = ifArgument.value;
      process.env.NODE_ENV === "production" ? invariant(ifValue && (ifValue.kind === 'Variable' || ifValue.kind === 'BooleanValue'), 41) : invariant(ifValue && (ifValue.kind === 'Variable' || ifValue.kind === 'BooleanValue'), "Argument for the @" + directiveName + " directive must be a variable or a boolean value.");
      result.push({
        directive: directive,
        ifArgument: ifArgument
      });
    });
  }

  return result;
}

function getFragmentQueryDocument(document, fragmentName) {
  var actualFragmentName = fragmentName;
  var fragments = [];
  document.definitions.forEach(function (definition) {
    if (definition.kind === 'OperationDefinition') {
      throw process.env.NODE_ENV === "production" ? new InvariantError(42) : new InvariantError("Found a " + definition.operation + " operation" + (definition.name ? " named '" + definition.name.value + "'" : '') + ". " + 'No operations are allowed when using a fragment as a query. Only fragments are allowed.');
    }

    if (definition.kind === 'FragmentDefinition') {
      fragments.push(definition);
    }
  });

  if (typeof actualFragmentName === 'undefined') {
    process.env.NODE_ENV === "production" ? invariant(fragments.length === 1, 43) : invariant(fragments.length === 1, "Found " + fragments.length + " fragments. `fragmentName` must be provided when there is not exactly 1 fragment.");
    actualFragmentName = fragments[0].name.value;
  }

  var query = _assign(_assign({}, document), {
    definitions: __spreadArrays([{
      kind: 'OperationDefinition',
      operation: 'query',
      selectionSet: {
        kind: 'SelectionSet',
        selections: [{
          kind: 'FragmentSpread',
          name: {
            kind: 'Name',
            value: actualFragmentName
          }
        }]
      }
    }], document.definitions)
  });

  return query;
}

function createFragmentMap(fragments) {
  if (fragments === void 0) {
    fragments = [];
  }

  var symTable = {};
  fragments.forEach(function (fragment) {
    symTable[fragment.name.value] = fragment;
  });
  return symTable;
}

function getFragmentFromSelection(selection, fragmentMap) {
  switch (selection.kind) {
    case 'InlineFragment':
      return selection;

    case 'FragmentSpread':
      {
        var fragment = fragmentMap && fragmentMap[selection.name.value];
        process.env.NODE_ENV === "production" ? invariant(fragment, 44) : invariant(fragment, "No fragment named " + selection.name.value + ".");
        return fragment;
      }

    default:
      return null;
  }
}

function makeReference(id) {
  return {
    __ref: String(id)
  };
}

function isReference(obj) {
  return Boolean(obj && typeof obj === 'object' && typeof obj.__ref === 'string');
}

function isStringValue(value) {
  return value.kind === 'StringValue';
}

function isBooleanValue(value) {
  return value.kind === 'BooleanValue';
}

function isIntValue(value) {
  return value.kind === 'IntValue';
}

function isFloatValue(value) {
  return value.kind === 'FloatValue';
}

function isVariable(value) {
  return value.kind === 'Variable';
}

function isObjectValue(value) {
  return value.kind === 'ObjectValue';
}

function isListValue(value) {
  return value.kind === 'ListValue';
}

function isEnumValue(value) {
  return value.kind === 'EnumValue';
}

function isNullValue(value) {
  return value.kind === 'NullValue';
}

function valueToObjectRepresentation(argObj, name, value, variables) {
  if (isIntValue(value) || isFloatValue(value)) {
    argObj[name.value] = Number(value.value);
  } else if (isBooleanValue(value) || isStringValue(value)) {
    argObj[name.value] = value.value;
  } else if (isObjectValue(value)) {
    var nestedArgObj_1 = {};
    value.fields.map(function (obj) {
      return valueToObjectRepresentation(nestedArgObj_1, obj.name, obj.value, variables);
    });
    argObj[name.value] = nestedArgObj_1;
  } else if (isVariable(value)) {
    var variableValue = (variables || {})[value.name.value];
    argObj[name.value] = variableValue;
  } else if (isListValue(value)) {
    argObj[name.value] = value.values.map(function (listValue) {
      var nestedArgArrayObj = {};
      valueToObjectRepresentation(nestedArgArrayObj, name, listValue, variables);
      return nestedArgArrayObj[name.value];
    });
  } else if (isEnumValue(value)) {
    argObj[name.value] = value.value;
  } else if (isNullValue(value)) {
    argObj[name.value] = null;
  } else {
    throw process.env.NODE_ENV === "production" ? new InvariantError(53) : new InvariantError("The inline argument \"" + name.value + "\" of kind \"" + value.kind + "\"" + 'is not supported. Use variables instead of inline arguments to ' + 'overcome this limitation.');
  }
}

function storeKeyNameFromField(field, variables) {
  var directivesObj = null;

  if (field.directives) {
    directivesObj = {};
    field.directives.forEach(function (directive) {
      directivesObj[directive.name.value] = {};

      if (directive.arguments) {
        directive.arguments.forEach(function (_a) {
          var name = _a.name,
              value = _a.value;
          return valueToObjectRepresentation(directivesObj[directive.name.value], name, value, variables);
        });
      }
    });
  }

  var argObj = null;

  if (field.arguments && field.arguments.length) {
    argObj = {};
    field.arguments.forEach(function (_a) {
      var name = _a.name,
          value = _a.value;
      return valueToObjectRepresentation(argObj, name, value, variables);
    });
  }

  return getStoreKeyName(field.name.value, argObj, directivesObj);
}

var KNOWN_DIRECTIVES = ['connection', 'include', 'skip', 'client', 'rest', 'export'];

function getStoreKeyName(fieldName, args, directives) {
  if (args && directives && directives['connection'] && directives['connection']['key']) {
    if (directives['connection']['filter'] && directives['connection']['filter'].length > 0) {
      var filterKeys = directives['connection']['filter'] ? directives['connection']['filter'] : [];
      filterKeys.sort();
      var filteredArgs_1 = {};
      filterKeys.forEach(function (key) {
        filteredArgs_1[key] = args[key];
      });
      return directives['connection']['key'] + "(" + JSON.stringify(filteredArgs_1) + ")";
    } else {
      return directives['connection']['key'];
    }
  }

  var completeFieldName = fieldName;

  if (args) {
    var stringifiedArgs = (0, _fastJsonStableStringify.default)(args);
    completeFieldName += "(" + stringifiedArgs + ")";
  }

  if (directives) {
    Object.keys(directives).forEach(function (key) {
      if (KNOWN_DIRECTIVES.indexOf(key) !== -1) return;

      if (directives[key] && Object.keys(directives[key]).length) {
        completeFieldName += "@" + key + "(" + JSON.stringify(directives[key]) + ")";
      } else {
        completeFieldName += "@" + key;
      }
    });
  }

  return completeFieldName;
}

function argumentsObjectFromField(field, variables) {
  if (field.arguments && field.arguments.length) {
    var argObj_1 = {};
    field.arguments.forEach(function (_a) {
      var name = _a.name,
          value = _a.value;
      return valueToObjectRepresentation(argObj_1, name, value, variables);
    });
    return argObj_1;
  }

  return null;
}

function resultKeyNameFromField(field) {
  return field.alias ? field.alias.value : field.name.value;
}

function getTypenameFromResult(result, selectionSet, fragmentMap) {
  if (typeof result.__typename === 'string') {
    return result.__typename;
  }

  for (var _i = 0, _a = selectionSet.selections; _i < _a.length; _i++) {
    var selection = _a[_i];

    if (isField(selection)) {
      if (selection.name.value === '__typename') {
        return result[resultKeyNameFromField(selection)];
      }
    } else {
      var typename = getTypenameFromResult(result, getFragmentFromSelection(selection, fragmentMap).selectionSet, fragmentMap);

      if (typeof typename === 'string') {
        return typename;
      }
    }
  }
}

function isField(selection) {
  return selection.kind === 'Field';
}

function isInlineFragment(selection) {
  return selection.kind === 'InlineFragment';
}

function checkDocument(doc) {
  process.env.NODE_ENV === "production" ? invariant(doc && doc.kind === 'Document', 45) : invariant(doc && doc.kind === 'Document', "Expecting a parsed GraphQL document. Perhaps you need to wrap the query string in a \"gql\" tag? http://docs.apollostack.com/apollo-client/core.html#gql");
  var operations = doc.definitions.filter(function (d) {
    return d.kind !== 'FragmentDefinition';
  }).map(function (definition) {
    if (definition.kind !== 'OperationDefinition') {
      throw process.env.NODE_ENV === "production" ? new InvariantError(46) : new InvariantError("Schema type definitions not allowed in queries. Found: \"" + definition.kind + "\"");
    }

    return definition;
  });
  process.env.NODE_ENV === "production" ? invariant(operations.length <= 1, 47) : invariant(operations.length <= 1, "Ambiguous GraphQL document: contains " + operations.length + " operations");
  return doc;
}

function getOperationDefinition(doc) {
  checkDocument(doc);
  return doc.definitions.filter(function (definition) {
    return definition.kind === 'OperationDefinition';
  })[0];
}

function getOperationName(doc) {
  return doc.definitions.filter(function (definition) {
    return definition.kind === 'OperationDefinition' && definition.name;
  }).map(function (x) {
    return x.name.value;
  })[0] || null;
}

function getFragmentDefinitions(doc) {
  return doc.definitions.filter(function (definition) {
    return definition.kind === 'FragmentDefinition';
  });
}

function getQueryDefinition(doc) {
  var queryDef = getOperationDefinition(doc);
  process.env.NODE_ENV === "production" ? invariant(queryDef && queryDef.operation === 'query', 48) : invariant(queryDef && queryDef.operation === 'query', 'Must contain a query definition.');
  return queryDef;
}

function getFragmentDefinition(doc) {
  process.env.NODE_ENV === "production" ? invariant(doc.kind === 'Document', 49) : invariant(doc.kind === 'Document', "Expecting a parsed GraphQL document. Perhaps you need to wrap the query string in a \"gql\" tag? http://docs.apollostack.com/apollo-client/core.html#gql");
  process.env.NODE_ENV === "production" ? invariant(doc.definitions.length <= 1, 50) : invariant(doc.definitions.length <= 1, 'Fragment must have exactly one definition.');
  var fragmentDef = doc.definitions[0];
  process.env.NODE_ENV === "production" ? invariant(fragmentDef.kind === 'FragmentDefinition', 51) : invariant(fragmentDef.kind === 'FragmentDefinition', 'Must be a fragment definition.');
  return fragmentDef;
}

function getMainDefinition(queryDoc) {
  checkDocument(queryDoc);
  var fragmentDefinition;

  for (var _i = 0, _a = queryDoc.definitions; _i < _a.length; _i++) {
    var definition = _a[_i];

    if (definition.kind === 'OperationDefinition') {
      var operation = definition.operation;

      if (operation === 'query' || operation === 'mutation' || operation === 'subscription') {
        return definition;
      }
    }

    if (definition.kind === 'FragmentDefinition' && !fragmentDefinition) {
      fragmentDefinition = definition;
    }
  }

  if (fragmentDefinition) {
    return fragmentDefinition;
  }

  throw process.env.NODE_ENV === "production" ? new InvariantError(52) : new InvariantError('Expected a parsed GraphQL query with a query, mutation, subscription, or a fragment.');
}

function getDefaultValues(definition) {
  var defaultValues = Object.create(null);
  var defs = definition && definition.variableDefinitions;

  if (defs && defs.length) {
    defs.forEach(function (def) {
      if (def.defaultValue) {
        valueToObjectRepresentation(defaultValues, def.variable.name, def.defaultValue);
      }
    });
  }

  return defaultValues;
}

function filterInPlace(array, test, context) {
  var target = 0;
  array.forEach(function (elem, i) {
    if (test.call(this, elem, i, array)) {
      array[target++] = elem;
    }
  }, context);
  array.length = target;
  return array;
}

var TYPENAME_FIELD = {
  kind: 'Field',
  name: {
    kind: 'Name',
    value: '__typename'
  }
};

function isEmpty(op, fragments) {
  return op.selectionSet.selections.every(function (selection) {
    return selection.kind === 'FragmentSpread' && isEmpty(fragments[selection.name.value], fragments);
  });
}

function nullIfDocIsEmpty(doc) {
  return isEmpty(getOperationDefinition(doc) || getFragmentDefinition(doc), createFragmentMap(getFragmentDefinitions(doc))) ? null : doc;
}

function getDirectiveMatcher(directives) {
  return function directiveMatcher(directive) {
    return directives.some(function (dir) {
      return dir.name && dir.name === directive.name.value || dir.test && dir.test(directive);
    });
  };
}

function removeDirectivesFromDocument(directives, doc) {
  var variablesInUse = Object.create(null);
  var variablesToRemove = [];
  var fragmentSpreadsInUse = Object.create(null);
  var fragmentSpreadsToRemove = [];
  var modifiedDoc = nullIfDocIsEmpty((0, _visitor.visit)(doc, {
    Variable: {
      enter: function enter(node, _key, parent) {
        if (parent.kind !== 'VariableDefinition') {
          variablesInUse[node.name.value] = true;
        }
      }
    },
    Field: {
      enter: function enter(node) {
        if (directives && node.directives) {
          var shouldRemoveField = directives.some(function (directive) {
            return directive.remove;
          });

          if (shouldRemoveField && node.directives && node.directives.some(getDirectiveMatcher(directives))) {
            if (node.arguments) {
              node.arguments.forEach(function (arg) {
                if (arg.value.kind === 'Variable') {
                  variablesToRemove.push({
                    name: arg.value.name.value
                  });
                }
              });
            }

            if (node.selectionSet) {
              getAllFragmentSpreadsFromSelectionSet(node.selectionSet).forEach(function (frag) {
                fragmentSpreadsToRemove.push({
                  name: frag.name.value
                });
              });
            }

            return null;
          }
        }
      }
    },
    FragmentSpread: {
      enter: function enter(node) {
        fragmentSpreadsInUse[node.name.value] = true;
      }
    },
    Directive: {
      enter: function enter(node) {
        if (getDirectiveMatcher(directives)(node)) {
          return null;
        }
      }
    }
  }));

  if (modifiedDoc && filterInPlace(variablesToRemove, function (v) {
    return !!v.name && !variablesInUse[v.name];
  }).length) {
    modifiedDoc = removeArgumentsFromDocument(variablesToRemove, modifiedDoc);
  }

  if (modifiedDoc && filterInPlace(fragmentSpreadsToRemove, function (fs) {
    return !!fs.name && !fragmentSpreadsInUse[fs.name];
  }).length) {
    modifiedDoc = removeFragmentSpreadFromDocument(fragmentSpreadsToRemove, modifiedDoc);
  }

  return modifiedDoc;
}

function addTypenameToDocument(doc) {
  return (0, _visitor.visit)(checkDocument(doc), {
    SelectionSet: {
      enter: function enter(node, _key, parent) {
        if (parent && parent.kind === 'OperationDefinition') {
          return;
        }

        var selections = node.selections;

        if (!selections) {
          return;
        }

        var skip = selections.some(function (selection) {
          return isField(selection) && (selection.name.value === '__typename' || selection.name.value.lastIndexOf('__', 0) === 0);
        });

        if (skip) {
          return;
        }

        var field = parent;

        if (isField(field) && field.directives && field.directives.some(function (d) {
          return d.name.value === 'export';
        })) {
          return;
        }

        return _assign(_assign({}, node), {
          selections: __spreadArrays(selections, [TYPENAME_FIELD])
        });
      }
    }
  });
}

addTypenameToDocument.added = function (field) {
  return field === TYPENAME_FIELD;
};

var connectionRemoveConfig = {
  test: function test(directive) {
    var willRemove = directive.name.value === 'connection';

    if (willRemove) {
      if (!directive.arguments || !directive.arguments.some(function (arg) {
        return arg.name.value === 'key';
      })) {
        process.env.NODE_ENV === "production" || invariant.warn('Removing an @connection directive even though it does not have a key. ' + 'You may want to use the key parameter to specify a store key.');
      }
    }

    return willRemove;
  }
};

function removeConnectionDirectiveFromDocument(doc) {
  return removeDirectivesFromDocument([connectionRemoveConfig], checkDocument(doc));
}

function getArgumentMatcher(config) {
  return function argumentMatcher(argument) {
    return config.some(function (aConfig) {
      return argument.value && argument.value.kind === 'Variable' && argument.value.name && (aConfig.name === argument.value.name.value || aConfig.test && aConfig.test(argument));
    });
  };
}

function removeArgumentsFromDocument(config, doc) {
  var argMatcher = getArgumentMatcher(config);
  return nullIfDocIsEmpty((0, _visitor.visit)(doc, {
    OperationDefinition: {
      enter: function enter(node) {
        return _assign(_assign({}, node), {
          variableDefinitions: node.variableDefinitions ? node.variableDefinitions.filter(function (varDef) {
            return !config.some(function (arg) {
              return arg.name === varDef.variable.name.value;
            });
          }) : []
        });
      }
    },
    Field: {
      enter: function enter(node) {
        var shouldRemoveField = config.some(function (argConfig) {
          return argConfig.remove;
        });

        if (shouldRemoveField) {
          var argMatchCount_1 = 0;

          if (node.arguments) {
            node.arguments.forEach(function (arg) {
              if (argMatcher(arg)) {
                argMatchCount_1 += 1;
              }
            });
          }

          if (argMatchCount_1 === 1) {
            return null;
          }
        }
      }
    },
    Argument: {
      enter: function enter(node) {
        if (argMatcher(node)) {
          return null;
        }
      }
    }
  }));
}

function removeFragmentSpreadFromDocument(config, doc) {
  function enter(node) {
    if (config.some(function (def) {
      return def.name === node.name.value;
    })) {
      return null;
    }
  }

  return nullIfDocIsEmpty((0, _visitor.visit)(doc, {
    FragmentSpread: {
      enter: enter
    },
    FragmentDefinition: {
      enter: enter
    }
  }));
}

function getAllFragmentSpreadsFromSelectionSet(selectionSet) {
  var allFragments = [];
  selectionSet.selections.forEach(function (selection) {
    if ((isField(selection) || isInlineFragment(selection)) && selection.selectionSet) {
      getAllFragmentSpreadsFromSelectionSet(selection.selectionSet).forEach(function (frag) {
        return allFragments.push(frag);
      });
    } else if (selection.kind === 'FragmentSpread') {
      allFragments.push(selection);
    }
  });
  return allFragments;
}

function buildQueryFromSelectionSet(document) {
  var definition = getMainDefinition(document);
  var definitionOperation = definition.operation;

  if (definitionOperation === 'query') {
    return document;
  }

  var modifiedDoc = (0, _visitor.visit)(document, {
    OperationDefinition: {
      enter: function enter(node) {
        return _assign(_assign({}, node), {
          operation: 'query'
        });
      }
    }
  });
  return modifiedDoc;
}

function removeClientSetsFromDocument(document) {
  checkDocument(document);
  var modifiedDoc = removeDirectivesFromDocument([{
    test: function test(directive) {
      return directive.name.value === 'client';
    },
    remove: true
  }], document);

  if (modifiedDoc) {
    modifiedDoc = (0, _visitor.visit)(modifiedDoc, {
      FragmentDefinition: {
        enter: function enter(node) {
          if (node.selectionSet) {
            var isTypenameOnly = node.selectionSet.selections.every(function (selection) {
              return isField(selection) && selection.name.value === '__typename';
            });

            if (isTypenameOnly) {
              return null;
            }
          }
        }
      }
    });
  }

  return modifiedDoc;
}

var hasOwnProperty = Object.prototype.hasOwnProperty;

function mergeDeep() {
  var sources = [];

  for (var _i = 0; _i < arguments.length; _i++) {
    sources[_i] = arguments[_i];
  }

  return mergeDeepArray(sources);
}

function mergeDeepArray(sources) {
  var target = sources[0] || {};
  var count = sources.length;

  if (count > 1) {
    var merger = new DeepMerger();

    for (var i = 1; i < count; ++i) {
      target = merger.merge(target, sources[i]);
    }
  }

  return target;
}

function isObject(obj) {
  return obj !== null && typeof obj === 'object';
}

var defaultReconciler = function defaultReconciler(target, source, property) {
  return this.merge(target[property], source[property]);
};

var DeepMerger = function () {
  function DeepMerger(reconciler) {
    if (reconciler === void 0) {
      reconciler = defaultReconciler;
    }

    this.reconciler = reconciler;
    this.isObject = isObject;
    this.pastCopies = new Set();
  }

  DeepMerger.prototype.merge = function (target, source) {
    var _this = this;

    var context = [];

    for (var _i = 2; _i < arguments.length; _i++) {
      context[_i - 2] = arguments[_i];
    }

    if (isObject(source) && isObject(target)) {
      Object.keys(source).forEach(function (sourceKey) {
        if (hasOwnProperty.call(target, sourceKey)) {
          var targetValue = target[sourceKey];

          if (source[sourceKey] !== targetValue) {
            var result = _this.reconciler.apply(_this, __spreadArrays([target, source, sourceKey], context));

            if (result !== targetValue) {
              target = _this.shallowCopyForMerge(target);
              target[sourceKey] = result;
            }
          }
        } else {
          target = _this.shallowCopyForMerge(target);
          target[sourceKey] = source[sourceKey];
        }
      });
      return target;
    }

    return source;
  };

  DeepMerger.prototype.shallowCopyForMerge = function (value) {
    if (isObject(value) && !this.pastCopies.has(value)) {
      if (Array.isArray(value)) {
        value = value.slice(0);
      } else {
        value = _assign({
          __proto__: Object.getPrototypeOf(value)
        }, value);
      }

      this.pastCopies.add(value);
    }

    return value;
  };

  return DeepMerger;
}(); // === Symbol Support ===


var hasSymbols = function hasSymbols() {
  return typeof Symbol === 'function';
};

var hasSymbol = function hasSymbol(name) {
  return hasSymbols() && Boolean(Symbol[name]);
};

var getSymbol = function getSymbol(name) {
  return hasSymbol(name) ? Symbol[name] : '@@' + name;
};

if (hasSymbols() && !hasSymbol('observable')) {
  Symbol.observable = Symbol('observable');
}

var SymbolIterator = getSymbol('iterator');
var SymbolObservable = getSymbol('observable');
var SymbolSpecies = getSymbol('species'); // === Abstract Operations ===

function getMethod(obj, key) {
  var value = obj[key];
  if (value == null) return undefined;
  if (typeof value !== 'function') throw new TypeError(value + ' is not a function');
  return value;
}

function getSpecies(obj) {
  var ctor = obj.constructor;

  if (ctor !== undefined) {
    ctor = ctor[SymbolSpecies];

    if (ctor === null) {
      ctor = undefined;
    }
  }

  return ctor !== undefined ? ctor : Observable;
}

function isObservable(x) {
  return x instanceof Observable; // SPEC: Brand check
}

function hostReportError(e) {
  if (hostReportError.log) {
    hostReportError.log(e);
  } else {
    setTimeout(function () {
      throw e;
    });
  }
}

function enqueue(fn) {
  Promise.resolve().then(function () {
    try {
      fn();
    } catch (e) {
      hostReportError(e);
    }
  });
}

function cleanupSubscription(subscription) {
  var cleanup = subscription._cleanup;
  if (cleanup === undefined) return;
  subscription._cleanup = undefined;

  if (!cleanup) {
    return;
  }

  try {
    if (typeof cleanup === 'function') {
      cleanup();
    } else {
      var unsubscribe = getMethod(cleanup, 'unsubscribe');

      if (unsubscribe) {
        unsubscribe.call(cleanup);
      }
    }
  } catch (e) {
    hostReportError(e);
  }
}

function closeSubscription(subscription) {
  subscription._observer = undefined;
  subscription._queue = undefined;
  subscription._state = 'closed';
}

function flushSubscription(subscription) {
  var queue = subscription._queue;

  if (!queue) {
    return;
  }

  subscription._queue = undefined;
  subscription._state = 'ready';

  for (var i = 0; i < queue.length; ++i) {
    notifySubscription(subscription, queue[i].type, queue[i].value);
    if (subscription._state === 'closed') break;
  }
}

function notifySubscription(subscription, type, value) {
  subscription._state = 'running';
  var observer = subscription._observer;

  try {
    var m = getMethod(observer, type);

    switch (type) {
      case 'next':
        if (m) m.call(observer, value);
        break;

      case 'error':
        closeSubscription(subscription);
        if (m) m.call(observer, value);else throw value;
        break;

      case 'complete':
        closeSubscription(subscription);
        if (m) m.call(observer);
        break;
    }
  } catch (e) {
    hostReportError(e);
  }

  if (subscription._state === 'closed') cleanupSubscription(subscription);else if (subscription._state === 'running') subscription._state = 'ready';
}

function onNotify(subscription, type, value) {
  if (subscription._state === 'closed') return;

  if (subscription._state === 'buffering') {
    subscription._queue.push({
      type: type,
      value: value
    });

    return;
  }

  if (subscription._state !== 'ready') {
    subscription._state = 'buffering';
    subscription._queue = [{
      type: type,
      value: value
    }];
    enqueue(function () {
      return flushSubscription(subscription);
    });
    return;
  }

  notifySubscription(subscription, type, value);
}

var Subscription = /*#__PURE__*/function () {
  function Subscription(observer, subscriber) {
    (0, _classCallCheck2.default)(this, Subscription);
    // ASSERT: observer is an object
    // ASSERT: subscriber is callable
    this._cleanup = undefined;
    this._observer = observer;
    this._queue = undefined;
    this._state = 'initializing';
    var subscriptionObserver = new SubscriptionObserver(this);

    try {
      this._cleanup = subscriber.call(undefined, subscriptionObserver);
    } catch (e) {
      subscriptionObserver.error(e);
    }

    if (this._state === 'initializing') this._state = 'ready';
  }

  (0, _createClass2.default)(Subscription, [{
    key: "unsubscribe",
    value: function unsubscribe() {
      if (this._state !== 'closed') {
        closeSubscription(this);
        cleanupSubscription(this);
      }
    }
  }, {
    key: "closed",
    get: function get() {
      return this._state === 'closed';
    }
  }]);
  return Subscription;
}();

var SubscriptionObserver = /*#__PURE__*/function () {
  function SubscriptionObserver(subscription) {
    (0, _classCallCheck2.default)(this, SubscriptionObserver);
    this._subscription = subscription;
  }

  (0, _createClass2.default)(SubscriptionObserver, [{
    key: "next",
    value: function next(value) {
      onNotify(this._subscription, 'next', value);
    }
  }, {
    key: "error",
    value: function error(value) {
      onNotify(this._subscription, 'error', value);
    }
  }, {
    key: "complete",
    value: function complete() {
      onNotify(this._subscription, 'complete');
    }
  }, {
    key: "closed",
    get: function get() {
      return this._subscription._state === 'closed';
    }
  }]);
  return SubscriptionObserver;
}();

var Observable = /*#__PURE__*/function () {
  function Observable(subscriber) {
    (0, _classCallCheck2.default)(this, Observable);
    if (!(this instanceof Observable)) throw new TypeError('Observable cannot be called as a function');
    if (typeof subscriber !== 'function') throw new TypeError('Observable initializer must be a function');
    this._subscriber = subscriber;
  }

  (0, _createClass2.default)(Observable, [{
    key: "subscribe",
    value: function subscribe(observer) {
      if (typeof observer !== 'object' || observer === null) {
        observer = {
          next: observer,
          error: arguments[1],
          complete: arguments[2]
        };
      }

      return new Subscription(observer, this._subscriber);
    }
  }, {
    key: "forEach",
    value: function forEach(fn) {
      var _this2 = this;

      return new Promise(function (resolve, reject) {
        if (typeof fn !== 'function') {
          reject(new TypeError(fn + ' is not a function'));
          return;
        }

        function done() {
          subscription.unsubscribe();
          resolve();
        }

        var subscription = _this2.subscribe({
          next: function next(value) {
            try {
              fn(value, done);
            } catch (e) {
              reject(e);
              subscription.unsubscribe();
            }
          },
          error: reject,
          complete: resolve
        });
      });
    }
  }, {
    key: "map",
    value: function map(fn) {
      var _this3 = this;

      if (typeof fn !== 'function') throw new TypeError(fn + ' is not a function');
      var C = getSpecies(this);
      return new C(function (observer) {
        return _this3.subscribe({
          next: function next(value) {
            try {
              value = fn(value);
            } catch (e) {
              return observer.error(e);
            }

            observer.next(value);
          },
          error: function error(e) {
            observer.error(e);
          },
          complete: function complete() {
            observer.complete();
          }
        });
      });
    }
  }, {
    key: "filter",
    value: function filter(fn) {
      var _this4 = this;

      if (typeof fn !== 'function') throw new TypeError(fn + ' is not a function');
      var C = getSpecies(this);
      return new C(function (observer) {
        return _this4.subscribe({
          next: function next(value) {
            try {
              if (!fn(value)) return;
            } catch (e) {
              return observer.error(e);
            }

            observer.next(value);
          },
          error: function error(e) {
            observer.error(e);
          },
          complete: function complete() {
            observer.complete();
          }
        });
      });
    }
  }, {
    key: "reduce",
    value: function reduce(fn) {
      var _this5 = this;

      if (typeof fn !== 'function') throw new TypeError(fn + ' is not a function');
      var C = getSpecies(this);
      var hasSeed = arguments.length > 1;
      var hasValue = false;
      var seed = arguments[1];
      var acc = seed;
      return new C(function (observer) {
        return _this5.subscribe({
          next: function next(value) {
            var first = !hasValue;
            hasValue = true;

            if (!first || hasSeed) {
              try {
                acc = fn(acc, value);
              } catch (e) {
                return observer.error(e);
              }
            } else {
              acc = value;
            }
          },
          error: function error(e) {
            observer.error(e);
          },
          complete: function complete() {
            if (!hasValue && !hasSeed) return observer.error(new TypeError('Cannot reduce an empty sequence'));
            observer.next(acc);
            observer.complete();
          }
        });
      });
    }
  }, {
    key: "concat",
    value: function concat() {
      var _this6 = this;

      for (var _len = arguments.length, sources = new Array(_len), _key2 = 0; _key2 < _len; _key2++) {
        sources[_key2] = arguments[_key2];
      }

      var C = getSpecies(this);
      return new C(function (observer) {
        var subscription;
        var index = 0;

        function startNext(next) {
          subscription = next.subscribe({
            next: function next(v) {
              observer.next(v);
            },
            error: function error(e) {
              observer.error(e);
            },
            complete: function complete() {
              if (index === sources.length) {
                subscription = undefined;
                observer.complete();
              } else {
                startNext(C.from(sources[index++]));
              }
            }
          });
        }

        startNext(_this6);
        return function () {
          if (subscription) {
            subscription.unsubscribe();
            subscription = undefined;
          }
        };
      });
    }
  }, {
    key: "flatMap",
    value: function flatMap(fn) {
      var _this7 = this;

      if (typeof fn !== 'function') throw new TypeError(fn + ' is not a function');
      var C = getSpecies(this);
      return new C(function (observer) {
        var subscriptions = [];

        var outer = _this7.subscribe({
          next: function next(value) {
            if (fn) {
              try {
                value = fn(value);
              } catch (e) {
                return observer.error(e);
              }
            }

            var inner = C.from(value).subscribe({
              next: function next(value) {
                observer.next(value);
              },
              error: function error(e) {
                observer.error(e);
              },
              complete: function complete() {
                var i = subscriptions.indexOf(inner);
                if (i >= 0) subscriptions.splice(i, 1);
                completeIfDone();
              }
            });
            subscriptions.push(inner);
          },
          error: function error(e) {
            observer.error(e);
          },
          complete: function complete() {
            completeIfDone();
          }
        });

        function completeIfDone() {
          if (outer.closed && subscriptions.length === 0) observer.complete();
        }

        return function () {
          subscriptions.forEach(function (s) {
            return s.unsubscribe();
          });
          outer.unsubscribe();
        };
      });
    }
  }, {
    key: SymbolObservable,
    value: function value() {
      return this;
    }
  }], [{
    key: "from",
    value: function from(x) {
      var C = typeof this === 'function' ? this : Observable;
      if (x == null) throw new TypeError(x + ' is not an object');
      var method = getMethod(x, SymbolObservable);

      if (method) {
        var observable = method.call(x);
        if (Object(observable) !== observable) throw new TypeError(observable + ' is not an object');
        if (isObservable(observable) && observable.constructor === C) return observable;
        return new C(function (observer) {
          return observable.subscribe(observer);
        });
      }

      if (hasSymbol('iterator')) {
        method = getMethod(x, SymbolIterator);

        if (method) {
          return new C(function (observer) {
            enqueue(function () {
              if (observer.closed) return;
              var _iteratorNormalCompletion = true;
              var _didIteratorError = false;
              var _iteratorError = undefined;

              try {
                for (var _iterator = method.call(x)[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                  var item = _step.value;
                  observer.next(item);
                  if (observer.closed) return;
                }
              } catch (err) {
                _didIteratorError = true;
                _iteratorError = err;
              } finally {
                try {
                  if (!_iteratorNormalCompletion && _iterator.return != null) {
                    _iterator.return();
                  }
                } finally {
                  if (_didIteratorError) {
                    throw _iteratorError;
                  }
                }
              }

              observer.complete();
            });
          });
        }
      }

      if (Array.isArray(x)) {
        return new C(function (observer) {
          enqueue(function () {
            if (observer.closed) return;

            for (var i = 0; i < x.length; ++i) {
              observer.next(x[i]);
              if (observer.closed) return;
            }

            observer.complete();
          });
        });
      }

      throw new TypeError(x + ' is not observable');
    }
  }, {
    key: "of",
    value: function of() {
      for (var _len2 = arguments.length, items = new Array(_len2), _key3 = 0; _key3 < _len2; _key3++) {
        items[_key3] = arguments[_key3];
      }

      var C = typeof this === 'function' ? this : Observable;
      return new C(function (observer) {
        enqueue(function () {
          if (observer.closed) return;

          for (var i = 0; i < items.length; ++i) {
            observer.next(items[i]);
            if (observer.closed) return;
          }

          observer.complete();
        });
      });
    }
  }, {
    key: SymbolSpecies,
    get: function get() {
      return this;
    }
  }]);
  return Observable;
}();

exports.Observable = Observable;

if (hasSymbols()) {
  Object.defineProperty(Observable, Symbol('extensions'), {
    value: {
      symbol: SymbolObservable,
      hostReportError: hostReportError
    },
    configurable: true
  });
}

function symbolObservablePonyfill(root) {
  var result;
  var Symbol = root.Symbol;

  if (typeof Symbol === 'function') {
    if (Symbol.observable) {
      result = Symbol.observable;
    } else {
      // This just needs to be something that won't trample other user's Symbol.for use
      // It also will guide people to the source of their issues, if this is problematic.
      // META: It's a resource locator!
      result = Symbol.for('https://github.com/benlesh/symbol-observable');

      try {
        Symbol.observable = result;
      } catch (err) {// Do nothing. In some environments, users have frozen `Symbol` for security reasons,
        // if it is frozen assigning to it will throw. In this case, we don't care, because
        // they will need to use the returned value from the ponyfill.
      }
    }
  } else {
    result = '@@observable';
  }

  return result;
}
/* global window */


var root;

if (typeof self !== 'undefined') {
  root = self;
} else if (typeof window !== 'undefined') {
  root = window;
} else if (typeof global !== 'undefined') {
  root = global;
} else if (typeof module !== 'undefined') {
  root = module;
} else {
  root = Function('return this')();
}

var result = symbolObservablePonyfill(root);

Observable.prototype['@@observable'] = function () {
  return this;
};

var toString = Object.prototype.toString;

function cloneDeep(value) {
  return cloneDeepHelper(value);
}

function cloneDeepHelper(val, seen) {
  switch (toString.call(val)) {
    case "[object Array]":
      {
        seen = seen || new Map();
        if (seen.has(val)) return seen.get(val);
        var copy_1 = val.slice(0);
        seen.set(val, copy_1);
        copy_1.forEach(function (child, i) {
          copy_1[i] = cloneDeepHelper(child, seen);
        });
        return copy_1;
      }

    case "[object Object]":
      {
        seen = seen || new Map();
        if (seen.has(val)) return seen.get(val);
        var copy_2 = Object.create(Object.getPrototypeOf(val));
        seen.set(val, copy_2);
        Object.keys(val).forEach(function (key) {
          copy_2[key] = cloneDeepHelper(val[key], seen);
        });
        return copy_2;
      }

    default:
      return val;
  }
}

function getEnv() {
  if (typeof process !== 'undefined' && process.env.NODE_ENV) {
    return process.env.NODE_ENV;
  }

  return 'development';
}

function isEnv(env) {
  return getEnv() === env;
}

function isDevelopment() {
  return isEnv('development') === true;
}

function isTest() {
  return isEnv('test') === true;
}

function isObject$1(value) {
  return value !== null && typeof value === "object";
}

function deepFreeze(value) {
  var workSet = new Set([value]);
  workSet.forEach(function (obj) {
    if (isObject$1(obj)) {
      if (!Object.isFrozen(obj)) Object.freeze(obj);
      Object.getOwnPropertyNames(obj).forEach(function (name) {
        if (isObject$1(obj[name])) workSet.add(obj[name]);
      });
    }
  });
  return value;
}

function maybeDeepFreeze(obj) {
  if (process.env.NODE_ENV !== "production" && (isDevelopment() || isTest())) {
    deepFreeze(obj);
  }

  return obj;
}

function iterateObserversSafely(observers, method, argument) {
  var observersWithMethod = [];
  observers.forEach(function (obs) {
    return obs[method] && observersWithMethod.push(obs);
  });
  observersWithMethod.forEach(function (obs) {
    return obs[method](argument);
  });
}

function asyncMap(observable, mapFn, catchFn) {
  return new Observable(function (observer) {
    var next = observer.next,
        error = observer.error,
        _complete = observer.complete;
    var activeCallbackCount = 0;
    var completed = false;

    function makeCallback(examiner, delegate) {
      if (examiner) {
        return function (arg) {
          ++activeCallbackCount;
          new Promise(function (resolve) {
            return resolve(examiner(arg));
          }).then(function (result) {
            --activeCallbackCount;
            next && next.call(observer, result);

            if (completed) {
              handler.complete();
            }
          }, function (e) {
            --activeCallbackCount;
            error && error.call(observer, e);
          });
        };
      } else {
        return function (arg) {
          return delegate && delegate.call(observer, arg);
        };
      }
    }

    var handler = {
      next: makeCallback(mapFn, next),
      error: makeCallback(catchFn, error),
      complete: function complete() {
        completed = true;

        if (!activeCallbackCount) {
          _complete && _complete.call(observer);
        }
      }
    };
    var sub = observable.subscribe(handler);
    return function () {
      return sub.unsubscribe();
    };
  });
}

function fixObservableSubclass(subclass) {
  function set(key) {
    Object.defineProperty(subclass, key, {
      value: Observable
    });
  }

  if (typeof Symbol === "function" && Symbol.species) {
    set(Symbol.species);
  }

  set("@@species");
  return subclass;
}

function isPromiseLike(value) {
  return value && typeof value.then === "function";
}

var Concast = function (_super) {
  __extends(Concast, _super);

  function Concast(sources) {
    var _this = _super.call(this, function (observer) {
      _this.addObserver(observer);

      return function () {
        return _this.removeObserver(observer);
      };
    }) || this;

    _this.observers = new Set();
    _this.addCount = 0;
    _this.promise = new Promise(function (resolve, reject) {
      _this.resolve = resolve;
      _this.reject = reject;
    });
    _this.handlers = {
      next: function next(result) {
        if (_this.sub !== null) {
          _this.latest = ["next", result];
          iterateObserversSafely(_this.observers, "next", result);
        }
      },
      error: function error(_error) {
        var sub = _this.sub;

        if (sub !== null) {
          if (sub) Promise.resolve().then(function () {
            return sub.unsubscribe();
          });
          _this.sub = null;
          _this.latest = ["error", _error];

          _this.reject(_error);

          iterateObserversSafely(_this.observers, "error", _error);
        }
      },
      complete: function complete() {
        if (_this.sub !== null) {
          var value = _this.sources.shift();

          if (!value) {
            _this.sub = null;

            if (_this.latest && _this.latest[0] === "next") {
              _this.resolve(_this.latest[1]);
            } else {
              _this.resolve();
            }

            iterateObserversSafely(_this.observers, "complete");
          } else if (isPromiseLike(value)) {
            value.then(function (obs) {
              return _this.sub = obs.subscribe(_this.handlers);
            });
          } else {
            _this.sub = value.subscribe(_this.handlers);
          }
        }
      }
    };

    _this.cancel = function (reason) {
      _this.reject(reason);

      _this.sources = [];

      _this.handlers.complete();
    };

    _this.promise.catch(function (_) {});

    if (typeof sources === "function") {
      sources = [new Observable(sources)];
    }

    if (isPromiseLike(sources)) {
      sources.then(function (iterable) {
        return _this.start(iterable);
      }, _this.handlers.error);
    } else {
      _this.start(sources);
    }

    return _this;
  }

  Concast.prototype.start = function (sources) {
    if (this.sub !== void 0) return;
    this.sources = Array.from(sources);
    this.handlers.complete();
  };

  Concast.prototype.deliverLastMessage = function (observer) {
    if (this.latest) {
      var nextOrError = this.latest[0];
      var method = observer[nextOrError];

      if (method) {
        method.call(observer, this.latest[1]);
      }

      if (this.sub === null && nextOrError === "next" && observer.complete) {
        observer.complete();
      }
    }
  };

  Concast.prototype.addObserver = function (observer) {
    if (!this.observers.has(observer)) {
      this.deliverLastMessage(observer);
      this.observers.add(observer);
      ++this.addCount;
    }
  };

  Concast.prototype.removeObserver = function (observer, quietly) {
    if (this.observers.delete(observer) && --this.addCount < 1 && !quietly) {
      this.handlers.error(new Error("Observable cancelled prematurely"));
    }
  };

  Concast.prototype.cleanup = function (callback) {
    var _this = this;

    var called = false;

    var once = function once() {
      if (!called) {
        called = true;

        _this.observers.delete(observer);

        callback();
      }
    };

    var observer = {
      next: once,
      error: once,
      complete: once
    };
    var count = this.addCount;
    this.addObserver(observer);
    this.addCount = count;
  };

  return Concast;
}(Observable);

fixObservableSubclass(Concast);

function isNonEmptyArray(value) {
  return Array.isArray(value) && value.length > 0;
}

function graphQLResultHasError(result) {
  return result.errors && result.errors.length > 0 || false;
}

var canUseWeakMap = typeof WeakMap === 'function' && !(typeof navigator === 'object' && navigator.product === 'ReactNative');

function compact() {
  var objects = [];

  for (var _i = 0; _i < arguments.length; _i++) {
    objects[_i] = arguments[_i];
  }

  var result = Object.create(null);
  objects.forEach(function (obj) {
    if (!obj) return;
    Object.keys(obj).forEach(function (key) {
      var value = obj[key];

      if (value !== void 0) {
        result[key] = value;
      }
    });
  });
  return result;
}

function fromError(errorValue) {
  return new Observable(function (observer) {
    observer.error(errorValue);
  });
}

function toPromise(observable) {
  var completed = false;
  return new Promise(function (resolve, reject) {
    observable.subscribe({
      next: function next(data) {
        if (completed) {
          process.env.NODE_ENV === "production" || invariant.warn("Promise Wrapper does not support multiple results from Observable");
        } else {
          completed = true;
          resolve(data);
        }
      },
      error: reject
    });
  });
}

function fromPromise(promise) {
  return new Observable(function (observer) {
    promise.then(function (value) {
      observer.next(value);
      observer.complete();
    }).catch(observer.error.bind(observer));
  });
}

var throwServerError = function throwServerError(response, result, message) {
  var error = new Error(message);
  error.name = 'ServerError';
  error.response = response;
  error.statusCode = response.status;
  error.result = result;
  throw error;
};

exports.throwServerError = throwServerError;

function validateOperation(operation) {
  var OPERATION_FIELDS = ['query', 'operationName', 'variables', 'extensions', 'context'];

  for (var _i = 0, _a = Object.keys(operation); _i < _a.length; _i++) {
    var key = _a[_i];

    if (OPERATION_FIELDS.indexOf(key) < 0) {
      throw process.env.NODE_ENV === "production" ? new InvariantError(26) : new InvariantError("illegal argument: " + key);
    }
  }

  return operation;
}

function createOperation(starting, operation) {
  var context = _assign({}, starting);

  var setContext = function setContext(next) {
    if (typeof next === 'function') {
      context = _assign(_assign({}, context), next(context));
    } else {
      context = _assign(_assign({}, context), next);
    }
  };

  var getContext = function getContext() {
    return _assign({}, context);
  };

  Object.defineProperty(operation, 'setContext', {
    enumerable: false,
    value: setContext
  });
  Object.defineProperty(operation, 'getContext', {
    enumerable: false,
    value: getContext
  });
  return operation;
}

function transformOperation(operation) {
  var transformedOperation = {
    variables: operation.variables || {},
    extensions: operation.extensions || {},
    operationName: operation.operationName,
    query: operation.query
  };

  if (!transformedOperation.operationName) {
    transformedOperation.operationName = typeof transformedOperation.query !== 'string' ? getOperationName(transformedOperation.query) || undefined : '';
  }

  return transformedOperation;
}

function passthrough(op, forward) {
  return forward ? forward(op) : Observable.of();
}

function toLink(handler) {
  return typeof handler === 'function' ? new ApolloLink(handler) : handler;
}

function isTerminating(link) {
  return link.request.length <= 1;
}

var LinkError = function (_super) {
  __extends(LinkError, _super);

  function LinkError(message, link) {
    var _this = _super.call(this, message) || this;

    _this.link = link;
    return _this;
  }

  return LinkError;
}(Error);

var ApolloLink = function () {
  function ApolloLink(request) {
    if (request) this.request = request;
  }

  ApolloLink.empty = function () {
    return new ApolloLink(function () {
      return Observable.of();
    });
  };

  ApolloLink.from = function (links) {
    if (links.length === 0) return ApolloLink.empty();
    return links.map(toLink).reduce(function (x, y) {
      return x.concat(y);
    });
  };

  ApolloLink.split = function (test, left, right) {
    var leftLink = toLink(left);
    var rightLink = toLink(right || new ApolloLink(passthrough));

    if (isTerminating(leftLink) && isTerminating(rightLink)) {
      return new ApolloLink(function (operation) {
        return test(operation) ? leftLink.request(operation) || Observable.of() : rightLink.request(operation) || Observable.of();
      });
    } else {
      return new ApolloLink(function (operation, forward) {
        return test(operation) ? leftLink.request(operation, forward) || Observable.of() : rightLink.request(operation, forward) || Observable.of();
      });
    }
  };

  ApolloLink.execute = function (link, operation) {
    return link.request(createOperation(operation.context, transformOperation(validateOperation(operation)))) || Observable.of();
  };

  ApolloLink.concat = function (first, second) {
    var firstLink = toLink(first);

    if (isTerminating(firstLink)) {
      process.env.NODE_ENV === "production" || invariant.warn(new LinkError("You are calling concat on a terminating link, which will have no effect", firstLink));
      return firstLink;
    }

    var nextLink = toLink(second);

    if (isTerminating(nextLink)) {
      return new ApolloLink(function (operation) {
        return firstLink.request(operation, function (op) {
          return nextLink.request(op) || Observable.of();
        }) || Observable.of();
      });
    } else {
      return new ApolloLink(function (operation, forward) {
        return firstLink.request(operation, function (op) {
          return nextLink.request(op, forward) || Observable.of();
        }) || Observable.of();
      });
    }
  };

  ApolloLink.prototype.split = function (test, left, right) {
    return this.concat(ApolloLink.split(test, left, right || new ApolloLink(passthrough)));
  };

  ApolloLink.prototype.concat = function (next) {
    return ApolloLink.concat(this, next);
  };

  ApolloLink.prototype.request = function (operation, forward) {
    throw process.env.NODE_ENV === "production" ? new InvariantError(21) : new InvariantError('request is not implemented');
  };

  ApolloLink.prototype.onError = function (error, observer) {
    if (observer && observer.error) {
      observer.error(error);
      return false;
    }

    throw error;
  };

  ApolloLink.prototype.setOnError = function (fn) {
    this.onError = fn;
    return this;
  };

  return ApolloLink;
}();

exports.ApolloLink = ApolloLink;
var empty = ApolloLink.empty;
exports.empty = empty;
var from = ApolloLink.from;
exports.from = from;
var split = ApolloLink.split;
exports.split = split;
var concat = ApolloLink.concat;
exports.concat = concat;
var execute = ApolloLink.execute;
exports.execute = execute;
var version = '3.3.11';

function HttpLink() {
  if (process.env.NODE_ENV !== 'production') {
    throw new Error('Please use apollo-link-hub-http');
  }
}

var _a$1 = Object.prototype,
    toString$1 = _a$1.toString,
    hasOwnProperty$1 = _a$1.hasOwnProperty;
var fnToStr = Function.prototype.toString;
var previousComparisons = new Map();
/**
 * Performs a deep equality check on two JavaScript values, tolerating cycles.
 */

function equal(a, b) {
  try {
    return check(a, b);
  } finally {
    previousComparisons.clear();
  }
}

function check(a, b) {
  // If the two values are strictly equal, our job is easy.
  if (a === b) {
    return true;
  } // Object.prototype.toString returns a representation of the runtime type of
  // the given value that is considerably more precise than typeof.


  var aTag = toString$1.call(a);
  var bTag = toString$1.call(b); // If the runtime types of a and b are different, they could maybe be equal
  // under some interpretation of equality, but for simplicity and performance
  // we just return false instead.

  if (aTag !== bTag) {
    return false;
  }

  switch (aTag) {
    case '[object Array]':
      // Arrays are a lot like other objects, but we can cheaply compare their
      // lengths as a short-cut before comparing their elements.
      if (a.length !== b.length) return false;
    // Fall through to object case...

    case '[object Object]':
      {
        if (previouslyCompared(a, b)) return true;
        var aKeys = definedKeys(a);
        var bKeys = definedKeys(b); // If `a` and `b` have a different number of enumerable keys, they
        // must be different.

        var keyCount = aKeys.length;
        if (keyCount !== bKeys.length) return false; // Now make sure they have the same keys.

        for (var k = 0; k < keyCount; ++k) {
          if (!hasOwnProperty$1.call(b, aKeys[k])) {
            return false;
          }
        } // Finally, check deep equality of all child properties.


        for (var k = 0; k < keyCount; ++k) {
          var key = aKeys[k];

          if (!check(a[key], b[key])) {
            return false;
          }
        }

        return true;
      }

    case '[object Error]':
      return a.name === b.name && a.message === b.message;

    case '[object Number]':
      // Handle NaN, which is !== itself.
      if (a !== a) return b !== b;
    // Fall through to shared +a === +b case...

    case '[object Boolean]':
    case '[object Date]':
      return +a === +b;

    case '[object RegExp]':
    case '[object String]':
      return a == "" + b;

    case '[object Map]':
    case '[object Set]':
      {
        if (a.size !== b.size) return false;
        if (previouslyCompared(a, b)) return true;
        var aIterator = a.entries();
        var isMap = aTag === '[object Map]';

        while (true) {
          var info = aIterator.next();
          if (info.done) break; // If a instanceof Set, aValue === aKey.

          var _a = info.value,
              aKey = _a[0],
              aValue = _a[1]; // So this works the same way for both Set and Map.

          if (!b.has(aKey)) {
            return false;
          } // However, we care about deep equality of values only when dealing
          // with Map structures.


          if (isMap && !check(aValue, b.get(aKey))) {
            return false;
          }
        }

        return true;
      }

    case '[object Function]':
      {
        var aCode = fnToStr.call(a);

        if (aCode !== fnToStr.call(b)) {
          return false;
        } // We consider non-native functions equal if they have the same code
        // (native functions require === because their code is censored).
        // Note that this behavior is not entirely sound, since !== function
        // objects with the same code can behave differently depending on
        // their closure scope. However, any function can behave differently
        // depending on the values of its input arguments (including this)
        // and its calling context (including its closure scope), even
        // though the function object is === to itself; and it is entirely
        // possible for functions that are not === to behave exactly the
        // same under all conceivable circumstances. Because none of these
        // factors are statically decidable in JavaScript, JS function
        // equality is not well-defined. This ambiguity allows us to
        // consider the best possible heuristic among various imperfect
        // options, and equating non-native functions that have the same
        // code has enormous practical benefits, such as when comparing
        // functions that are repeatedly passed as fresh function
        // expressions within objects that are otherwise deeply equal. Since
        // any function created from the same syntactic expression (in the
        // same code location) will always stringify to the same code
        // according to fnToStr.call, we can reasonably expect these
        // repeatedly passed function expressions to have the same code, and
        // thus behave "the same" (with all the caveats mentioned above),
        // even though the runtime function objects are !== to one another.


        return !endsWith(aCode, nativeCodeSuffix);
      }
  } // Otherwise the values are not equal.


  return false;
}

function definedKeys(obj) {
  // Remember that the second argument to Array.prototype.filter will be
  // used as `this` within the callback function.
  return Object.keys(obj).filter(isDefinedKey, obj);
}

function isDefinedKey(key) {
  return this[key] !== void 0;
}

var nativeCodeSuffix = "{ [native code] }";

function endsWith(full, suffix) {
  var fromIndex = full.length - suffix.length;
  return fromIndex >= 0 && full.indexOf(suffix, fromIndex) === fromIndex;
}

function previouslyCompared(a, b) {
  // Though cyclic references can make an object graph appear infinite from the
  // perspective of a depth-first traversal, the graph still contains a finite
  // number of distinct object references. We use the previousComparisons cache
  // to avoid comparing the same pair of object references more than once, which
  // guarantees termination (even if we end up comparing every object in one
  // graph to every object in the other graph, which is extremely unlikely),
  // while still allowing weird isomorphic structures (like rings with different
  // lengths) a chance to pass the equality test.
  var bSet = previousComparisons.get(a);

  if (bSet) {
    // Return true here because we can be sure false will be returned somewhere
    // else if the objects are not equivalent.
    if (bSet.has(b)) return true;
  } else {
    previousComparisons.set(a, bSet = new Set());
  }

  bSet.add(b);
  return false;
}

function isApolloError(err) {
  return err.hasOwnProperty('graphQLErrors');
}

var generateErrorMessage = function generateErrorMessage(err) {
  var message = '';

  if (isNonEmptyArray(err.graphQLErrors)) {
    err.graphQLErrors.forEach(function (graphQLError) {
      var errorMessage = graphQLError ? graphQLError.message : 'Error message not found.';
      message += errorMessage + "\n";
    });
  }

  if (err.networkError) {
    message += err.networkError.message + "\n";
  }

  message = message.replace(/\n$/, '');
  return message;
};

var ApolloError = function (_super) {
  __extends(ApolloError, _super);

  function ApolloError(_a) {
    var graphQLErrors = _a.graphQLErrors,
        networkError = _a.networkError,
        errorMessage = _a.errorMessage,
        extraInfo = _a.extraInfo;

    var _this = _super.call(this, errorMessage) || this;

    _this.graphQLErrors = graphQLErrors || [];
    _this.networkError = networkError || null;
    _this.message = errorMessage || generateErrorMessage(_this);
    _this.extraInfo = extraInfo;
    _this.__proto__ = ApolloError.prototype;
    return _this;
  }

  return ApolloError;
}(Error);

exports.ApolloError = ApolloError;
var NetworkStatus;
exports.NetworkStatus = NetworkStatus;

(function (NetworkStatus) {
  NetworkStatus[NetworkStatus["loading"] = 1] = "loading";
  NetworkStatus[NetworkStatus["setVariables"] = 2] = "setVariables";
  NetworkStatus[NetworkStatus["fetchMore"] = 3] = "fetchMore";
  NetworkStatus[NetworkStatus["refetch"] = 4] = "refetch";
  NetworkStatus[NetworkStatus["poll"] = 6] = "poll";
  NetworkStatus[NetworkStatus["ready"] = 7] = "ready";
  NetworkStatus[NetworkStatus["error"] = 8] = "error";
})(NetworkStatus || (exports.NetworkStatus = NetworkStatus = {}));

function isNetworkRequestInFlight(networkStatus) {
  return networkStatus ? networkStatus < 7 : false;
}

var Reobserver = function () {
  function Reobserver(observer, options, fetch, shouldFetch) {
    this.observer = observer;
    this.options = options;
    this.fetch = fetch;
    this.shouldFetch = shouldFetch;
  }

  Reobserver.prototype.reobserve = function (newOptions, newNetworkStatus) {
    if (newOptions) {
      this.updateOptions(newOptions);
    } else {
      this.updatePolling();
    }

    var concast = this.fetch(this.options, newNetworkStatus);

    if (this.concast) {
      this.concast.removeObserver(this.observer, true);
    }

    concast.addObserver(this.observer);
    return (this.concast = concast).promise;
  };

  Reobserver.prototype.updateOptions = function (newOptions) {
    Object.assign(this.options, compact(newOptions));
    this.updatePolling();
    return this;
  };

  Reobserver.prototype.stop = function () {
    if (this.concast) {
      this.concast.removeObserver(this.observer);
      delete this.concast;
    }

    if (this.pollingInfo) {
      clearTimeout(this.pollingInfo.timeout);
      this.options.pollInterval = 0;
      this.updatePolling();
    }
  };

  Reobserver.prototype.updatePolling = function () {
    var _this = this;

    var _a = this,
        pollingInfo = _a.pollingInfo,
        pollInterval = _a.options.pollInterval;

    if (!pollInterval) {
      if (pollingInfo) {
        clearTimeout(pollingInfo.timeout);
        delete this.pollingInfo;
      }

      return;
    }

    if (pollingInfo && pollingInfo.interval === pollInterval) {
      return;
    }

    process.env.NODE_ENV === "production" ? invariant(pollInterval, 20) : invariant(pollInterval, 'Attempted to start a polling query without a polling interval.');

    if (this.shouldFetch === false) {
      return;
    }

    var info = pollingInfo || (this.pollingInfo = {});
    info.interval = pollInterval;

    var maybeFetch = function maybeFetch() {
      if (_this.pollingInfo) {
        if (_this.shouldFetch && _this.shouldFetch()) {
          _this.reobserve({
            fetchPolicy: "network-only",
            nextFetchPolicy: _this.options.fetchPolicy || "cache-first"
          }, NetworkStatus.poll).then(poll, poll);
        } else {
          poll();
        }
      }
    };

    var poll = function poll() {
      var info = _this.pollingInfo;

      if (info) {
        clearTimeout(info.timeout);
        info.timeout = setTimeout(maybeFetch, info.interval);
      }
    };

    poll();
  };

  return Reobserver;
}();

var warnedAboutUpdateQuery = false;

var ObservableQuery = function (_super) {
  __extends(ObservableQuery, _super);

  function ObservableQuery(_a) {
    var queryManager = _a.queryManager,
        queryInfo = _a.queryInfo,
        options = _a.options;

    var _this = _super.call(this, function (observer) {
      return _this.onSubscribe(observer);
    }) || this;

    _this.observers = new Set();
    _this.subscriptions = new Set();
    _this.observer = {
      next: function next(result) {
        if (_this.lastError || _this.isDifferentFromLastResult(result)) {
          _this.updateLastResult(result);

          iterateObserversSafely(_this.observers, 'next', result);
        }
      },
      error: function error(_error2) {
        _this.updateLastResult(_assign(_assign({}, _this.lastResult), {
          error: _error2,
          errors: _error2.graphQLErrors,
          networkStatus: NetworkStatus.error,
          loading: false
        }));

        iterateObserversSafely(_this.observers, 'error', _this.lastError = _error2);
      }
    };
    _this.isTornDown = false;
    _this.options = options;
    _this.queryId = queryManager.generateQueryId();
    var opDef = getOperationDefinition(options.query);
    _this.queryName = opDef && opDef.name && opDef.name.value;
    _this.queryManager = queryManager;
    _this.queryInfo = queryInfo;
    return _this;
  }

  Object.defineProperty(ObservableQuery.prototype, "variables", {
    get: function get() {
      return this.options.variables;
    },
    enumerable: false,
    configurable: true
  });

  ObservableQuery.prototype.result = function () {
    var _this = this;

    return new Promise(function (resolve, reject) {
      var observer = {
        next: function next(result) {
          resolve(result);

          _this.observers.delete(observer);

          if (!_this.observers.size) {
            _this.queryManager.removeQuery(_this.queryId);
          }

          setTimeout(function () {
            subscription.unsubscribe();
          }, 0);
        },
        error: reject
      };

      var subscription = _this.subscribe(observer);
    });
  };

  ObservableQuery.prototype.getCurrentResult = function (saveAsLastResult) {
    if (saveAsLastResult === void 0) {
      saveAsLastResult = true;
    }

    var lastResult = this.lastResult;
    var networkStatus = this.queryInfo.networkStatus || lastResult && lastResult.networkStatus || NetworkStatus.ready;

    var result = _assign(_assign({}, lastResult), {
      loading: isNetworkRequestInFlight(networkStatus),
      networkStatus: networkStatus
    });

    if (this.isTornDown) {
      return result;
    }

    var _a = this.options.fetchPolicy,
        fetchPolicy = _a === void 0 ? 'cache-first' : _a;

    if (fetchPolicy === 'no-cache' || fetchPolicy === 'network-only') {
      delete result.partial;
    } else if (!result.data || !this.queryManager.transform(this.options.query).hasForcedResolvers) {
      var diff = this.queryInfo.getDiff();
      result.data = diff.complete || this.options.returnPartialData ? diff.result : void 0;

      if (diff.complete) {
        if (result.networkStatus === NetworkStatus.loading && (fetchPolicy === 'cache-first' || fetchPolicy === 'cache-only')) {
          result.networkStatus = NetworkStatus.ready;
          result.loading = false;
        }

        delete result.partial;
      } else {
        result.partial = true;
      }
    }

    if (saveAsLastResult) {
      this.updateLastResult(result);
    }

    return result;
  };

  ObservableQuery.prototype.isDifferentFromLastResult = function (newResult) {
    return !equal(this.lastResultSnapshot, newResult);
  };

  ObservableQuery.prototype.getLastResult = function () {
    return this.lastResult;
  };

  ObservableQuery.prototype.getLastError = function () {
    return this.lastError;
  };

  ObservableQuery.prototype.resetLastResults = function () {
    delete this.lastResult;
    delete this.lastResultSnapshot;
    delete this.lastError;
    this.isTornDown = false;
  };

  ObservableQuery.prototype.resetQueryStoreErrors = function () {
    this.queryManager.resetErrors(this.queryId);
  };

  ObservableQuery.prototype.refetch = function (variables) {
    var reobserveOptions = {
      pollInterval: 0
    };
    var fetchPolicy = this.options.fetchPolicy;

    if (fetchPolicy !== 'no-cache' && fetchPolicy !== 'cache-and-network') {
      reobserveOptions.fetchPolicy = 'network-only';
      reobserveOptions.nextFetchPolicy = fetchPolicy || "cache-first";
    }

    if (variables && !equal(this.options.variables, variables)) {
      reobserveOptions.variables = this.options.variables = _assign(_assign({}, this.options.variables), variables);
    }

    return this.newReobserver(false).reobserve(reobserveOptions, NetworkStatus.refetch);
  };

  ObservableQuery.prototype.fetchMore = function (fetchMoreOptions) {
    var _this = this;

    var combinedOptions = _assign(_assign({}, fetchMoreOptions.query ? fetchMoreOptions : _assign(_assign(_assign({}, this.options), fetchMoreOptions), {
      variables: _assign(_assign({}, this.options.variables), fetchMoreOptions.variables)
    })), {
      fetchPolicy: "no-cache"
    });

    var qid = this.queryManager.generateQueryId();

    if (combinedOptions.notifyOnNetworkStatusChange) {
      this.queryInfo.networkStatus = NetworkStatus.fetchMore;
      this.observe();
    }

    return this.queryManager.fetchQuery(qid, combinedOptions, NetworkStatus.fetchMore).then(function (fetchMoreResult) {
      var data = fetchMoreResult.data;
      var updateQuery = fetchMoreOptions.updateQuery;

      if (updateQuery) {
        if (process.env.NODE_ENV !== "production" && !warnedAboutUpdateQuery) {
          process.env.NODE_ENV === "production" || invariant.warn("The updateQuery callback for fetchMore is deprecated, and will be removed\nin the next major version of Apollo Client.\n\nPlease convert updateQuery functions to field policies with appropriate\nread and merge functions, or use/adapt a helper function (such as\nconcatPagination, offsetLimitPagination, or relayStylePagination) from\n@apollo/client/utilities.\n\nThe field policy system handles pagination more effectively than a\nhand-written updateQuery function, and you only need to define the policy\nonce, rather than every time you call fetchMore.");
          warnedAboutUpdateQuery = true;
        }

        _this.updateQuery(function (previous) {
          return updateQuery(previous, {
            fetchMoreResult: data,
            variables: combinedOptions.variables
          });
        });
      } else {
        _this.queryManager.cache.writeQuery({
          query: combinedOptions.query,
          variables: combinedOptions.variables,
          data: data
        });
      }

      return fetchMoreResult;
    }).finally(function () {
      _this.queryManager.stopQuery(qid);

      _this.reobserve();
    });
  };

  ObservableQuery.prototype.subscribeToMore = function (options) {
    var _this = this;

    var subscription = this.queryManager.startGraphQLSubscription({
      query: options.document,
      variables: options.variables,
      context: options.context
    }).subscribe({
      next: function next(subscriptionData) {
        var updateQuery = options.updateQuery;

        if (updateQuery) {
          _this.updateQuery(function (previous, _a) {
            var variables = _a.variables;
            return updateQuery(previous, {
              subscriptionData: subscriptionData,
              variables: variables
            });
          });
        }
      },
      error: function error(err) {
        if (options.onError) {
          options.onError(err);
          return;
        }

        process.env.NODE_ENV === "production" || invariant.error('Unhandled GraphQL subscription error', err);
      }
    });
    this.subscriptions.add(subscription);
    return function () {
      if (_this.subscriptions.delete(subscription)) {
        subscription.unsubscribe();
      }
    };
  };

  ObservableQuery.prototype.setOptions = function (newOptions) {
    return this.reobserve(newOptions);
  };

  ObservableQuery.prototype.setVariables = function (variables) {
    if (equal(this.variables, variables)) {
      return this.observers.size ? this.result() : Promise.resolve();
    }

    this.options.variables = variables;

    if (!this.observers.size) {
      return Promise.resolve();
    }

    var _a = this.options.fetchPolicy,
        fetchPolicy = _a === void 0 ? 'cache-first' : _a;
    var reobserveOptions = {
      fetchPolicy: fetchPolicy,
      variables: variables
    };

    if (fetchPolicy !== 'cache-first' && fetchPolicy !== 'no-cache' && fetchPolicy !== 'network-only') {
      reobserveOptions.fetchPolicy = 'cache-and-network';
      reobserveOptions.nextFetchPolicy = fetchPolicy;
    }

    return this.reobserve(reobserveOptions, NetworkStatus.setVariables);
  };

  ObservableQuery.prototype.updateQuery = function (mapFn) {
    var _a;

    var queryManager = this.queryManager;
    var result = queryManager.cache.diff({
      query: this.options.query,
      variables: this.variables,
      previousResult: (_a = this.lastResult) === null || _a === void 0 ? void 0 : _a.data,
      returnPartialData: true,
      optimistic: false
    }).result;
    var newResult = mapFn(result, {
      variables: this.variables
    });

    if (newResult) {
      queryManager.cache.writeQuery({
        query: this.options.query,
        data: newResult,
        variables: this.variables
      });
      queryManager.broadcastQueries();
    }
  };

  ObservableQuery.prototype.startPolling = function (pollInterval) {
    this.getReobserver().updateOptions({
      pollInterval: pollInterval
    });
  };

  ObservableQuery.prototype.stopPolling = function () {
    if (this.reobserver) {
      this.reobserver.updateOptions({
        pollInterval: 0
      });
    }
  };

  ObservableQuery.prototype.updateLastResult = function (newResult) {
    var previousResult = this.lastResult;
    this.lastResult = newResult;
    this.lastResultSnapshot = this.queryManager.assumeImmutableResults ? newResult : cloneDeep(newResult);

    if (!isNonEmptyArray(newResult.errors)) {
      delete this.lastError;
    }

    return previousResult;
  };

  ObservableQuery.prototype.onSubscribe = function (observer) {
    var _this = this;

    if (observer === this.observer) {
      return function () {};
    }

    try {
      var subObserver = observer._subscription._observer;

      if (subObserver && !subObserver.error) {
        subObserver.error = defaultSubscriptionObserverErrorCallback;
      }
    } catch (_a) {}

    var first = !this.observers.size;
    this.observers.add(observer);

    if (this.lastError) {
      observer.error && observer.error(this.lastError);
    } else if (this.lastResult) {
      observer.next && observer.next(this.lastResult);
    }

    if (first) {
      this.reobserve().catch(function (_) {});
    }

    return function () {
      if (_this.observers.delete(observer) && !_this.observers.size) {
        _this.tearDownQuery();
      }
    };
  };

  ObservableQuery.prototype.getReobserver = function () {
    return this.reobserver || (this.reobserver = this.newReobserver(true));
  };

  ObservableQuery.prototype.newReobserver = function (shareOptions) {
    var _this = this;

    var _a = this,
        queryManager = _a.queryManager,
        queryId = _a.queryId;

    queryManager.setObservableQuery(this);
    return new Reobserver(this.observer, shareOptions ? this.options : _assign({}, this.options), function (currentOptions, newNetworkStatus) {
      queryManager.setObservableQuery(_this);
      return queryManager.fetchQueryObservable(queryId, currentOptions, newNetworkStatus);
    }, !queryManager.ssrMode && function () {
      return !isNetworkRequestInFlight(_this.queryInfo.networkStatus);
    });
  };

  ObservableQuery.prototype.reobserve = function (newOptions, newNetworkStatus) {
    this.isTornDown = false;
    return this.getReobserver().reobserve(newOptions, newNetworkStatus);
  };

  ObservableQuery.prototype.observe = function () {
    this.observer.next(this.getCurrentResult(false));
  };

  ObservableQuery.prototype.hasObservers = function () {
    return this.observers.size > 0;
  };

  ObservableQuery.prototype.tearDownQuery = function () {
    if (this.isTornDown) return;

    if (this.reobserver) {
      this.reobserver.stop();
      delete this.reobserver;
    }

    this.subscriptions.forEach(function (sub) {
      return sub.unsubscribe();
    });
    this.subscriptions.clear();
    this.queryManager.stopQuery(this.queryId);
    this.observers.clear();
    this.isTornDown = true;
  };

  return ObservableQuery;
}(Observable);

exports.ObservableQuery = ObservableQuery;
fixObservableSubclass(ObservableQuery);

function defaultSubscriptionObserverErrorCallback(error) {
  process.env.NODE_ENV === "production" || invariant.error('Unhandled error', error.message, error.stack);
} // A [trie](https://en.wikipedia.org/wiki/Trie) data structure that holds
// object keys weakly, yet can also hold non-object keys, unlike the
// native `WeakMap`.
// If no makeData function is supplied, the looked-up data will be an empty,
// null-prototype Object.


var defaultMakeData = function defaultMakeData() {
  return Object.create(null);
}; // Useful for processing arguments objects as well as arrays.


var _a$2 = Array.prototype,
    forEach = _a$2.forEach,
    slice = _a$2.slice;

var Trie =
/** @class */
function () {
  function Trie(weakness, makeData) {
    if (weakness === void 0) {
      weakness = true;
    }

    if (makeData === void 0) {
      makeData = defaultMakeData;
    }

    this.weakness = weakness;
    this.makeData = makeData;
  }

  Trie.prototype.lookup = function () {
    var array = [];

    for (var _i = 0; _i < arguments.length; _i++) {
      array[_i] = arguments[_i];
    }

    return this.lookupArray(array);
  };

  Trie.prototype.lookupArray = function (array) {
    var node = this;
    forEach.call(array, function (key) {
      return node = node.getChildTrie(key);
    });
    return node.data || (node.data = this.makeData(slice.call(array)));
  };

  Trie.prototype.getChildTrie = function (key) {
    var map = this.weakness && isObjRef(key) ? this.weak || (this.weak = new WeakMap()) : this.strong || (this.strong = new Map());
    var child = map.get(key);
    if (!child) map.set(key, child = new Trie(this.weakness, this.makeData));
    return child;
  };

  return Trie;
}();

function isObjRef(value) {
  switch (typeof value) {
    case "object":
      if (value === null) break;
    // Fall through to return true...

    case "function":
      return true;
  }

  return false;
} // This currentContext variable will only be used if the makeSlotClass
// function is called, which happens only if this is the first copy of the
// @wry/context package to be imported.


var currentContext = null; // This unique internal object is used to denote the absence of a value
// for a given Slot, and is never exposed to outside code.

var MISSING_VALUE = {};
var idCounter = 1; // Although we can't do anything about the cost of duplicated code from
// accidentally bundling multiple copies of the @wry/context package, we can
// avoid creating the Slot class more than once using makeSlotClass.

var makeSlotClass = function makeSlotClass() {
  return (
    /** @class */
    function () {
      function Slot() {
        // If you have a Slot object, you can find out its slot.id, but you cannot
        // guess the slot.id of a Slot you don't have access to, thanks to the
        // randomized suffix.
        this.id = ["slot", idCounter++, Date.now(), Math.random().toString(36).slice(2)].join(":");
      }

      Slot.prototype.hasValue = function () {
        for (var context_1 = currentContext; context_1; context_1 = context_1.parent) {
          // We use the Slot object iself as a key to its value, which means the
          // value cannot be obtained without a reference to the Slot object.
          if (this.id in context_1.slots) {
            var value = context_1.slots[this.id];
            if (value === MISSING_VALUE) break;

            if (context_1 !== currentContext) {
              // Cache the value in currentContext.slots so the next lookup will
              // be faster. This caching is safe because the tree of contexts and
              // the values of the slots are logically immutable.
              currentContext.slots[this.id] = value;
            }

            return true;
          }
        }

        if (currentContext) {
          // If a value was not found for this Slot, it's never going to be found
          // no matter how many times we look it up, so we might as well cache
          // the absence of the value, too.
          currentContext.slots[this.id] = MISSING_VALUE;
        }

        return false;
      };

      Slot.prototype.getValue = function () {
        if (this.hasValue()) {
          return currentContext.slots[this.id];
        }
      };

      Slot.prototype.withValue = function (value, callback, // Given the prevalence of arrow functions, specifying arguments is likely
      // to be much more common than specifying `this`, hence this ordering:
      args, thisArg) {
        var _a;

        var slots = (_a = {
          __proto__: null
        }, _a[this.id] = value, _a);
        var parent = currentContext;
        currentContext = {
          parent: parent,
          slots: slots
        };

        try {
          // Function.prototype.apply allows the arguments array argument to be
          // omitted or undefined, so args! is fine here.
          return callback.apply(thisArg, args);
        } finally {
          currentContext = parent;
        }
      }; // Capture the current context and wrap a callback function so that it
      // reestablishes the captured context when called.


      Slot.bind = function (callback) {
        var context = currentContext;
        return function () {
          var saved = currentContext;

          try {
            currentContext = context;
            return callback.apply(this, arguments);
          } finally {
            currentContext = saved;
          }
        };
      }; // Immediately run a callback function without any captured context.


      Slot.noContext = function (callback, // Given the prevalence of arrow functions, specifying arguments is likely
      // to be much more common than specifying `this`, hence this ordering:
      args, thisArg) {
        if (currentContext) {
          var saved = currentContext;

          try {
            currentContext = null; // Function.prototype.apply allows the arguments array argument to be
            // omitted or undefined, so args! is fine here.

            return callback.apply(thisArg, args);
          } finally {
            currentContext = saved;
          }
        } else {
          return callback.apply(thisArg, args);
        }
      };

      return Slot;
    }()
  );
}; // We store a single global implementation of the Slot class as a permanent
// non-enumerable symbol property of the Array constructor. This obfuscation
// does nothing to prevent access to the Slot class, but at least it ensures
// the implementation (i.e. currentContext) cannot be tampered with, and all
// copies of the @wry/context package (hopefully just one) will share the
// same Slot implementation. Since the first copy of the @wry/context package
// to be imported wins, this technique imposes a very high cost for any
// future breaking changes to the Slot class.


var globalKey = "@wry/context:Slot";
var host = Array;

var Slot = host[globalKey] || function () {
  var Slot = makeSlotClass();

  try {
    Object.defineProperty(host, globalKey, {
      value: host[globalKey] = Slot,
      enumerable: false,
      writable: false,
      configurable: false
    });
  } finally {
    return Slot;
  }
}();

var bind = Slot.bind,
    noContext = Slot.noContext;

function defaultDispose() {}

var Cache =
/** @class */
function () {
  function Cache(max, dispose) {
    if (max === void 0) {
      max = Infinity;
    }

    if (dispose === void 0) {
      dispose = defaultDispose;
    }

    this.max = max;
    this.dispose = dispose;
    this.map = new Map();
    this.newest = null;
    this.oldest = null;
  }

  Cache.prototype.has = function (key) {
    return this.map.has(key);
  };

  Cache.prototype.get = function (key) {
    var entry = this.getEntry(key);
    return entry && entry.value;
  };

  Cache.prototype.getEntry = function (key) {
    var entry = this.map.get(key);

    if (entry && entry !== this.newest) {
      var older = entry.older,
          newer = entry.newer;

      if (newer) {
        newer.older = older;
      }

      if (older) {
        older.newer = newer;
      }

      entry.older = this.newest;
      entry.older.newer = entry;
      entry.newer = null;
      this.newest = entry;

      if (entry === this.oldest) {
        this.oldest = newer;
      }
    }

    return entry;
  };

  Cache.prototype.set = function (key, value) {
    var entry = this.getEntry(key);

    if (entry) {
      return entry.value = value;
    }

    entry = {
      key: key,
      value: value,
      newer: null,
      older: this.newest
    };

    if (this.newest) {
      this.newest.newer = entry;
    }

    this.newest = entry;
    this.oldest = this.oldest || entry;
    this.map.set(key, entry);
    return entry.value;
  };

  Cache.prototype.clean = function () {
    while (this.oldest && this.map.size > this.max) {
      this.delete(this.oldest.key);
    }
  };

  Cache.prototype.delete = function (key) {
    var entry = this.map.get(key);

    if (entry) {
      if (entry === this.newest) {
        this.newest = entry.older;
      }

      if (entry === this.oldest) {
        this.oldest = entry.newer;
      }

      if (entry.newer) {
        entry.newer.older = entry.older;
      }

      if (entry.older) {
        entry.older.newer = entry.newer;
      }

      this.map.delete(key);
      this.dispose(entry.value, key);
      return true;
    }

    return false;
  };

  return Cache;
}();

var parentEntrySlot = new Slot();

function maybeUnsubscribe(entryOrDep) {
  var unsubscribe = entryOrDep.unsubscribe;

  if (typeof unsubscribe === "function") {
    entryOrDep.unsubscribe = void 0;
    unsubscribe();
  }
}

var emptySetPool = [];
var POOL_TARGET_SIZE = 100; // Since this package might be used browsers, we should avoid using the
// Node built-in assert module.

function assert(condition, optionalMessage) {
  if (!condition) {
    throw new Error(optionalMessage || "assertion failure");
  }
}

function valueIs(a, b) {
  var len = a.length;
  return (// Unknown values are not equal to each other.
    len > 0 && // Both values must be ordinary (or both exceptional) to be equal.
    len === b.length && // The underlying value or exception must be the same.
    a[len - 1] === b[len - 1]
  );
}

function valueGet(value) {
  switch (value.length) {
    case 0:
      throw new Error("unknown value");

    case 1:
      return value[0];

    case 2:
      throw value[1];
  }
}

function valueCopy(value) {
  return value.slice(0);
}

var Entry =
/** @class */
function () {
  function Entry(fn) {
    this.fn = fn;
    this.parents = new Set();
    this.childValues = new Map(); // When this Entry has children that are dirty, this property becomes
    // a Set containing other Entry objects, borrowed from emptySetPool.
    // When the set becomes empty, it gets recycled back to emptySetPool.

    this.dirtyChildren = null;
    this.dirty = true;
    this.recomputing = false;
    this.value = [];
    this.deps = null;
    ++Entry.count;
  }

  Entry.prototype.peek = function () {
    if (this.value.length === 1 && !mightBeDirty(this)) {
      return this.value[0];
    }
  }; // This is the most important method of the Entry API, because it
  // determines whether the cached this.value can be returned immediately,
  // or must be recomputed. The overall performance of the caching system
  // depends on the truth of the following observations: (1) this.dirty is
  // usually false, (2) this.dirtyChildren is usually null/empty, and thus
  // (3) valueGet(this.value) is usually returned without recomputation.


  Entry.prototype.recompute = function (args) {
    assert(!this.recomputing, "already recomputing");
    rememberParent(this);
    return mightBeDirty(this) ? reallyRecompute(this, args) : valueGet(this.value);
  };

  Entry.prototype.setDirty = function () {
    if (this.dirty) return;
    this.dirty = true;
    this.value.length = 0;
    reportDirty(this);
    forgetChildren(this); // We can go ahead and unsubscribe here, since any further dirty
    // notifications we receive will be redundant, and unsubscribing may
    // free up some resources, e.g. file watchers.

    maybeUnsubscribe(this);
  };

  Entry.prototype.dispose = function () {
    var _this = this;

    forgetChildren(this);
    maybeUnsubscribe(this); // Because this entry has been kicked out of the cache (in index.js),
    // we've lost the ability to find out if/when this entry becomes dirty,
    // whether that happens through a subscription, because of a direct call
    // to entry.setDirty(), or because one of its children becomes dirty.
    // Because of this loss of future information, we have to assume the
    // worst (that this entry might have become dirty very soon), so we must
    // immediately mark this entry's parents as dirty. Normally we could
    // just call entry.setDirty() rather than calling parent.setDirty() for
    // each parent, but that would leave this entry in parent.childValues
    // and parent.dirtyChildren, which would prevent the child from being
    // truly forgotten.

    this.parents.forEach(function (parent) {
      parent.setDirty();
      forgetChild(parent, _this);
    });
  };

  Entry.prototype.dependOn = function (dep) {
    dep.add(this);

    if (!this.deps) {
      this.deps = emptySetPool.pop() || new Set();
    }

    this.deps.add(dep);
  };

  Entry.prototype.forgetDeps = function () {
    var _this = this;

    if (this.deps) {
      this.deps.forEach(function (dep) {
        return dep.delete(_this);
      });
      this.deps.clear();
      emptySetPool.push(this.deps);
      this.deps = null;
    }
  };

  Entry.count = 0;
  return Entry;
}();

function rememberParent(child) {
  var parent = parentEntrySlot.getValue();

  if (parent) {
    child.parents.add(parent);

    if (!parent.childValues.has(child)) {
      parent.childValues.set(child, []);
    }

    if (mightBeDirty(child)) {
      reportDirtyChild(parent, child);
    } else {
      reportCleanChild(parent, child);
    }

    return parent;
  }
}

function reallyRecompute(entry, args) {
  forgetChildren(entry); // Set entry as the parent entry while calling recomputeNewValue(entry).

  parentEntrySlot.withValue(entry, recomputeNewValue, [entry, args]);

  if (maybeSubscribe(entry, args)) {
    // If we successfully recomputed entry.value and did not fail to
    // (re)subscribe, then this Entry is no longer explicitly dirty.
    setClean(entry);
  }

  return valueGet(entry.value);
}

function recomputeNewValue(entry, args) {
  entry.recomputing = true; // Set entry.value as unknown.

  entry.value.length = 0;

  try {
    // If entry.fn succeeds, entry.value will become a normal Value.
    entry.value[0] = entry.fn.apply(null, args);
  } catch (e) {
    // If entry.fn throws, entry.value will become exceptional.
    entry.value[1] = e;
  } // Either way, this line is always reached.


  entry.recomputing = false;
}

function mightBeDirty(entry) {
  return entry.dirty || !!(entry.dirtyChildren && entry.dirtyChildren.size);
}

function setClean(entry) {
  entry.dirty = false;

  if (mightBeDirty(entry)) {
    // This Entry may still have dirty children, in which case we can't
    // let our parents know we're clean just yet.
    return;
  }

  reportClean(entry);
}

function reportDirty(child) {
  child.parents.forEach(function (parent) {
    return reportDirtyChild(parent, child);
  });
}

function reportClean(child) {
  child.parents.forEach(function (parent) {
    return reportCleanChild(parent, child);
  });
} // Let a parent Entry know that one of its children may be dirty.


function reportDirtyChild(parent, child) {
  // Must have called rememberParent(child) before calling
  // reportDirtyChild(parent, child).
  assert(parent.childValues.has(child));
  assert(mightBeDirty(child));

  if (!parent.dirtyChildren) {
    parent.dirtyChildren = emptySetPool.pop() || new Set();
  } else if (parent.dirtyChildren.has(child)) {
    // If we already know this child is dirty, then we must have already
    // informed our own parents that we are dirty, so we can terminate
    // the recursion early.
    return;
  }

  parent.dirtyChildren.add(child);
  reportDirty(parent);
} // Let a parent Entry know that one of its children is no longer dirty.


function reportCleanChild(parent, child) {
  // Must have called rememberChild(child) before calling
  // reportCleanChild(parent, child).
  assert(parent.childValues.has(child));
  assert(!mightBeDirty(child));
  var childValue = parent.childValues.get(child);

  if (childValue.length === 0) {
    parent.childValues.set(child, valueCopy(child.value));
  } else if (!valueIs(childValue, child.value)) {
    parent.setDirty();
  }

  removeDirtyChild(parent, child);

  if (mightBeDirty(parent)) {
    return;
  }

  reportClean(parent);
}

function removeDirtyChild(parent, child) {
  var dc = parent.dirtyChildren;

  if (dc) {
    dc.delete(child);

    if (dc.size === 0) {
      if (emptySetPool.length < POOL_TARGET_SIZE) {
        emptySetPool.push(dc);
      }

      parent.dirtyChildren = null;
    }
  }
} // Removes all children from this entry and returns an array of the
// removed children.


function forgetChildren(parent) {
  if (parent.childValues.size > 0) {
    parent.childValues.forEach(function (_value, child) {
      forgetChild(parent, child);
    });
  } // Remove this parent Entry from any sets to which it was added by the
  // addToSet method.


  parent.forgetDeps(); // After we forget all our children, this.dirtyChildren must be empty
  // and therefore must have been reset to null.

  assert(parent.dirtyChildren === null);
}

function forgetChild(parent, child) {
  child.parents.delete(parent);
  parent.childValues.delete(child);
  removeDirtyChild(parent, child);
}

function maybeSubscribe(entry, args) {
  if (typeof entry.subscribe === "function") {
    try {
      maybeUnsubscribe(entry); // Prevent double subscriptions.

      entry.unsubscribe = entry.subscribe.apply(null, args);
    } catch (e) {
      // If this Entry has a subscribe function and it threw an exception
      // (or an unsubscribe function it previously returned now throws),
      // return false to indicate that we were not able to subscribe (or
      // unsubscribe), and this Entry should remain dirty.
      entry.setDirty();
      return false;
    }
  } // Returning true indicates either that there was no entry.subscribe
  // function or that it succeeded.


  return true;
}

function dep(options) {
  var depsByKey = new Map();
  var subscribe = options && options.subscribe;

  function depend(key) {
    var parent = parentEntrySlot.getValue();

    if (parent) {
      var dep_1 = depsByKey.get(key);

      if (!dep_1) {
        depsByKey.set(key, dep_1 = new Set());
      }

      parent.dependOn(dep_1);

      if (typeof subscribe === "function") {
        maybeUnsubscribe(dep_1);
        dep_1.unsubscribe = subscribe(key);
      }
    }
  }

  depend.dirty = function dirty(key) {
    var dep = depsByKey.get(key);

    if (dep) {
      dep.forEach(function (entry) {
        return entry.setDirty();
      });
      depsByKey.delete(key);
      maybeUnsubscribe(dep);
    }
  };

  return depend;
} // The defaultMakeCacheKey function is remarkably powerful, because it gives
// a unique object for any shallow-identical list of arguments. If you need
// to implement a custom makeCacheKey function, you may find it helpful to
// delegate the final work to defaultMakeCacheKey, which is why we export it
// here. However, you may want to avoid defaultMakeCacheKey if your runtime
// does not support WeakMap, or you have the ability to return a string key.
// In those cases, just write your own custom makeCacheKey functions.


var keyTrie = new Trie(typeof WeakMap === "function");

function defaultMakeCacheKey() {
  var args = [];

  for (var _i = 0; _i < arguments.length; _i++) {
    args[_i] = arguments[_i];
  }

  return keyTrie.lookupArray(args);
}

var caches = new Set();

function wrap(originalFunction, options) {
  if (options === void 0) {
    options = Object.create(null);
  }

  var cache = new Cache(options.max || Math.pow(2, 16), function (entry) {
    return entry.dispose();
  });

  var keyArgs = options.keyArgs || function () {
    var args = [];

    for (var _i = 0; _i < arguments.length; _i++) {
      args[_i] = arguments[_i];
    }

    return args;
  };

  var makeCacheKey = options.makeCacheKey || defaultMakeCacheKey;

  function optimistic() {
    var key = makeCacheKey.apply(null, keyArgs.apply(null, arguments));

    if (key === void 0) {
      return originalFunction.apply(null, arguments);
    }

    var entry = cache.get(key);

    if (!entry) {
      cache.set(key, entry = new Entry(originalFunction));
      entry.subscribe = options.subscribe;
    }

    var value = entry.recompute(Array.prototype.slice.call(arguments)); // Move this entry to the front of the least-recently used queue,
    // since we just finished computing its value.

    cache.set(key, entry);
    caches.add(cache); // Clean up any excess entries in the cache, but only if there is no
    // active parent entry, meaning we're not in the middle of a larger
    // computation that might be flummoxed by the cleaning.

    if (!parentEntrySlot.hasValue()) {
      caches.forEach(function (cache) {
        return cache.clean();
      });
      caches.clear();
    }

    return value;
  }

  function lookup() {
    var key = makeCacheKey.apply(null, arguments);

    if (key !== void 0) {
      return cache.get(key);
    }
  }

  optimistic.dirty = function () {
    var entry = lookup.apply(null, arguments);

    if (entry) {
      entry.setDirty();
    }
  };

  optimistic.peek = function () {
    var entry = lookup.apply(null, arguments);

    if (entry) {
      return entry.peek();
    }
  };

  optimistic.forget = function () {
    var key = makeCacheKey.apply(null, arguments);
    return key !== void 0 && cache.delete(key);
  };

  return optimistic;
}

var ApolloCache = function () {
  function ApolloCache() {
    this.getFragmentDoc = wrap(getFragmentQueryDocument);
  }

  ApolloCache.prototype.recordOptimisticTransaction = function (transaction, optimisticId) {
    this.performTransaction(transaction, optimisticId);
  };

  ApolloCache.prototype.transformDocument = function (document) {
    return document;
  };

  ApolloCache.prototype.identify = function (object) {
    return;
  };

  ApolloCache.prototype.gc = function () {
    return [];
  };

  ApolloCache.prototype.modify = function (options) {
    return false;
  };

  ApolloCache.prototype.transformForLink = function (document) {
    return document;
  };

  ApolloCache.prototype.readQuery = function (options, optimistic) {
    if (optimistic === void 0) {
      optimistic = !!options.optimistic;
    }

    return this.read({
      rootId: options.id || 'ROOT_QUERY',
      query: options.query,
      variables: options.variables,
      returnPartialData: options.returnPartialData,
      optimistic: optimistic
    });
  };

  ApolloCache.prototype.readFragment = function (options, optimistic) {
    if (optimistic === void 0) {
      optimistic = !!options.optimistic;
    }

    return this.read({
      query: this.getFragmentDoc(options.fragment, options.fragmentName),
      variables: options.variables,
      rootId: options.id,
      returnPartialData: options.returnPartialData,
      optimistic: optimistic
    });
  };

  ApolloCache.prototype.writeQuery = function (options) {
    return this.write({
      dataId: options.id || 'ROOT_QUERY',
      result: options.data,
      query: options.query,
      variables: options.variables,
      broadcast: options.broadcast
    });
  };

  ApolloCache.prototype.writeFragment = function (options) {
    return this.write({
      dataId: options.id,
      result: options.data,
      variables: options.variables,
      query: this.getFragmentDoc(options.fragment, options.fragmentName),
      broadcast: options.broadcast
    });
  };

  return ApolloCache;
}();

exports.ApolloCache = ApolloCache;
var Cache$1;
exports.Cache = Cache$1;

(function (Cache) {})(Cache$1 || (exports.Cache = Cache$1 = {}));

var MissingFieldError = function () {
  function MissingFieldError(message, path, query, clientOnly, variables) {
    this.message = message;
    this.path = path;
    this.query = query;
    this.clientOnly = clientOnly;
    this.variables = variables;
  }

  return MissingFieldError;
}();

exports.MissingFieldError = MissingFieldError;
var hasOwn = Object.prototype.hasOwnProperty;

function getTypenameFromStoreObject(store, objectOrReference) {
  return isReference(objectOrReference) ? store.get(objectOrReference.__ref, "__typename") : objectOrReference && objectOrReference.__typename;
}

var TypeOrFieldNameRegExp = /^[_a-z][_0-9a-z]*/i;

function fieldNameFromStoreName(storeFieldName) {
  var match = storeFieldName.match(TypeOrFieldNameRegExp);
  return match ? match[0] : storeFieldName;
}

function selectionSetMatchesResult(selectionSet, result, variables) {
  if (result && typeof result === "object") {
    return Array.isArray(result) ? result.every(function (item) {
      return selectionSetMatchesResult(selectionSet, item, variables);
    }) : selectionSet.selections.every(function (field) {
      if (isField(field) && shouldInclude(field, variables)) {
        var key = resultKeyNameFromField(field);
        return hasOwn.call(result, key) && (!field.selectionSet || selectionSetMatchesResult(field.selectionSet, result[key], variables));
      }

      return true;
    });
  }

  return false;
}

function storeValueIsStoreObject(value) {
  return value !== null && typeof value === "object" && !isReference(value) && !Array.isArray(value);
}

function makeProcessedFieldsMerger() {
  return new DeepMerger();
}

var DELETE = Object.create(null);

var delModifier = function delModifier() {
  return DELETE;
};

var INVALIDATE = Object.create(null);

var EntityStore = function () {
  function EntityStore(policies, group) {
    var _this = this;

    this.policies = policies;
    this.group = group;
    this.data = Object.create(null);
    this.rootIds = Object.create(null);
    this.refs = Object.create(null);

    this.getFieldValue = function (objectOrReference, storeFieldName) {
      return maybeDeepFreeze(isReference(objectOrReference) ? _this.get(objectOrReference.__ref, storeFieldName) : objectOrReference && objectOrReference[storeFieldName]);
    };

    this.canRead = function (objOrRef) {
      return isReference(objOrRef) ? _this.has(objOrRef.__ref) : typeof objOrRef === "object";
    };

    this.toReference = function (objOrIdOrRef, mergeIntoStore) {
      if (typeof objOrIdOrRef === "string") {
        return makeReference(objOrIdOrRef);
      }

      if (isReference(objOrIdOrRef)) {
        return objOrIdOrRef;
      }

      var id = _this.policies.identify(objOrIdOrRef)[0];

      if (id) {
        var ref = makeReference(id);

        if (mergeIntoStore) {
          _this.merge(id, objOrIdOrRef);
        }

        return ref;
      }
    };
  }

  EntityStore.prototype.toObject = function () {
    return _assign({}, this.data);
  };

  EntityStore.prototype.has = function (dataId) {
    return this.lookup(dataId, true) !== void 0;
  };

  EntityStore.prototype.get = function (dataId, fieldName) {
    this.group.depend(dataId, fieldName);

    if (hasOwn.call(this.data, dataId)) {
      var storeObject = this.data[dataId];

      if (storeObject && hasOwn.call(storeObject, fieldName)) {
        return storeObject[fieldName];
      }
    }

    if (fieldName === "__typename" && hasOwn.call(this.policies.rootTypenamesById, dataId)) {
      return this.policies.rootTypenamesById[dataId];
    }

    if (this instanceof Layer) {
      return this.parent.get(dataId, fieldName);
    }
  };

  EntityStore.prototype.lookup = function (dataId, dependOnExistence) {
    if (dependOnExistence) this.group.depend(dataId, "__exists");

    if (hasOwn.call(this.data, dataId)) {
      return this.data[dataId];
    }

    if (this instanceof Layer) {
      return this.parent.lookup(dataId, dependOnExistence);
    }

    if (this.policies.rootTypenamesById[dataId]) {
      return Object.create(null);
    }
  };

  EntityStore.prototype.merge = function (dataId, incoming) {
    var _this = this;

    var existing = this.lookup(dataId);
    var merged = new DeepMerger(storeObjectReconciler).merge(existing, incoming);
    this.data[dataId] = merged;

    if (merged !== existing) {
      delete this.refs[dataId];

      if (this.group.caching) {
        var fieldsToDirty_1 = Object.create(null);
        if (!existing) fieldsToDirty_1.__exists = 1;
        Object.keys(incoming).forEach(function (storeFieldName) {
          if (!existing || existing[storeFieldName] !== merged[storeFieldName]) {
            fieldsToDirty_1[storeFieldName] = 1;
            var fieldName = fieldNameFromStoreName(storeFieldName);

            if (fieldName !== storeFieldName && !_this.policies.hasKeyArgs(merged.__typename, fieldName)) {
              fieldsToDirty_1[fieldName] = 1;
            }

            if (merged[storeFieldName] === void 0 && !(_this instanceof Layer)) {
              delete merged[storeFieldName];
            }
          }
        });
        Object.keys(fieldsToDirty_1).forEach(function (fieldName) {
          return _this.group.dirty(dataId, fieldName);
        });
      }
    }
  };

  EntityStore.prototype.modify = function (dataId, fields) {
    var _this = this;

    var storeObject = this.lookup(dataId);

    if (storeObject) {
      var changedFields_1 = Object.create(null);
      var needToMerge_1 = false;
      var allDeleted_1 = true;
      var sharedDetails_1 = {
        DELETE: DELETE,
        INVALIDATE: INVALIDATE,
        isReference: isReference,
        toReference: this.toReference,
        canRead: this.canRead,
        readField: function readField(fieldNameOrOptions, from) {
          return _this.policies.readField(typeof fieldNameOrOptions === "string" ? {
            fieldName: fieldNameOrOptions,
            from: from || makeReference(dataId)
          } : fieldNameOrOptions, {
            store: _this
          });
        }
      };
      Object.keys(storeObject).forEach(function (storeFieldName) {
        var fieldName = fieldNameFromStoreName(storeFieldName);
        var fieldValue = storeObject[storeFieldName];
        if (fieldValue === void 0) return;
        var modify = typeof fields === "function" ? fields : fields[storeFieldName] || fields[fieldName];

        if (modify) {
          var newValue = modify === delModifier ? DELETE : modify(maybeDeepFreeze(fieldValue), _assign(_assign({}, sharedDetails_1), {
            fieldName: fieldName,
            storeFieldName: storeFieldName,
            storage: _this.getStorage(dataId, storeFieldName)
          }));

          if (newValue === INVALIDATE) {
            _this.group.dirty(dataId, storeFieldName);
          } else {
            if (newValue === DELETE) newValue = void 0;

            if (newValue !== fieldValue) {
              changedFields_1[storeFieldName] = newValue;
              needToMerge_1 = true;
              fieldValue = newValue;
            }
          }
        }

        if (fieldValue !== void 0) {
          allDeleted_1 = false;
        }
      });

      if (needToMerge_1) {
        this.merge(dataId, changedFields_1);

        if (allDeleted_1) {
          if (this instanceof Layer) {
            this.data[dataId] = void 0;
          } else {
            delete this.data[dataId];
          }

          this.group.dirty(dataId, "__exists");
        }

        return true;
      }
    }

    return false;
  };

  EntityStore.prototype.delete = function (dataId, fieldName, args) {
    var _a;

    var storeObject = this.lookup(dataId);

    if (storeObject) {
      var typename = this.getFieldValue(storeObject, "__typename");
      var storeFieldName = fieldName && args ? this.policies.getStoreFieldName({
        typename: typename,
        fieldName: fieldName,
        args: args
      }) : fieldName;
      return this.modify(dataId, storeFieldName ? (_a = {}, _a[storeFieldName] = delModifier, _a) : delModifier);
    }

    return false;
  };

  EntityStore.prototype.evict = function (options) {
    var evicted = false;

    if (options.id) {
      if (hasOwn.call(this.data, options.id)) {
        evicted = this.delete(options.id, options.fieldName, options.args);
      }

      if (this instanceof Layer) {
        evicted = this.parent.evict(options) || evicted;
      }

      if (options.fieldName || evicted) {
        this.group.dirty(options.id, options.fieldName || "__exists");
      }
    }

    return evicted;
  };

  EntityStore.prototype.clear = function () {
    this.replace(null);
  };

  EntityStore.prototype.extract = function () {
    var _this = this;

    var obj = this.toObject();
    var extraRootIds = [];
    this.getRootIdSet().forEach(function (id) {
      if (!hasOwn.call(_this.policies.rootTypenamesById, id)) {
        extraRootIds.push(id);
      }
    });

    if (extraRootIds.length) {
      obj.__META = {
        extraRootIds: extraRootIds.sort()
      };
    }

    return obj;
  };

  EntityStore.prototype.replace = function (newData) {
    var _this = this;

    Object.keys(this.data).forEach(function (dataId) {
      if (!(newData && hasOwn.call(newData, dataId))) {
        _this.delete(dataId);
      }
    });

    if (newData) {
      var __META = newData.__META,
          rest_1 = __rest(newData, ["__META"]);

      Object.keys(rest_1).forEach(function (dataId) {
        _this.merge(dataId, rest_1[dataId]);
      });

      if (__META) {
        __META.extraRootIds.forEach(this.retain, this);
      }
    }
  };

  EntityStore.prototype.retain = function (rootId) {
    return this.rootIds[rootId] = (this.rootIds[rootId] || 0) + 1;
  };

  EntityStore.prototype.release = function (rootId) {
    if (this.rootIds[rootId] > 0) {
      var count = --this.rootIds[rootId];
      if (!count) delete this.rootIds[rootId];
      return count;
    }

    return 0;
  };

  EntityStore.prototype.getRootIdSet = function (ids) {
    if (ids === void 0) {
      ids = new Set();
    }

    Object.keys(this.rootIds).forEach(ids.add, ids);

    if (this instanceof Layer) {
      this.parent.getRootIdSet(ids);
    } else {
      Object.keys(this.policies.rootTypenamesById).forEach(ids.add, ids);
    }

    return ids;
  };

  EntityStore.prototype.gc = function () {
    var _this = this;

    var ids = this.getRootIdSet();
    var snapshot = this.toObject();
    ids.forEach(function (id) {
      if (hasOwn.call(snapshot, id)) {
        Object.keys(_this.findChildRefIds(id)).forEach(ids.add, ids);
        delete snapshot[id];
      }
    });
    var idsToRemove = Object.keys(snapshot);

    if (idsToRemove.length) {
      var root_1 = this;

      while (root_1 instanceof Layer) {
        root_1 = root_1.parent;
      }

      idsToRemove.forEach(function (id) {
        return root_1.delete(id);
      });
    }

    return idsToRemove;
  };

  EntityStore.prototype.findChildRefIds = function (dataId) {
    if (!hasOwn.call(this.refs, dataId)) {
      var found_1 = this.refs[dataId] = Object.create(null);
      var workSet_1 = new Set([this.data[dataId]]);

      var canTraverse_1 = function canTraverse_1(obj) {
        return obj !== null && typeof obj === 'object';
      };

      workSet_1.forEach(function (obj) {
        if (isReference(obj)) {
          found_1[obj.__ref] = true;
        } else if (canTraverse_1(obj)) {
          Object.values(obj).filter(canTraverse_1).forEach(workSet_1.add, workSet_1);
        }
      });
    }

    return this.refs[dataId];
  };

  EntityStore.prototype.makeCacheKey = function () {
    var args = [];

    for (var _i = 0; _i < arguments.length; _i++) {
      args[_i] = arguments[_i];
    }

    return this.group.keyMaker.lookupArray(args);
  };

  return EntityStore;
}();

var CacheGroup = function () {
  function CacheGroup(caching) {
    this.caching = caching;
    this.d = null;
    this.keyMaker = new Trie(canUseWeakMap);
    this.d = caching ? dep() : null;
  }

  CacheGroup.prototype.depend = function (dataId, storeFieldName) {
    if (this.d) {
      this.d(makeDepKey(dataId, storeFieldName));
      var fieldName = fieldNameFromStoreName(storeFieldName);

      if (fieldName !== storeFieldName) {
        this.d(makeDepKey(dataId, fieldName));
      }
    }
  };

  CacheGroup.prototype.dirty = function (dataId, storeFieldName) {
    if (this.d) {
      this.d.dirty(makeDepKey(dataId, storeFieldName));
    }
  };

  return CacheGroup;
}();

function makeDepKey(dataId, storeFieldName) {
  return storeFieldName + '#' + dataId;
}

(function (EntityStore) {
  var Root = function (_super) {
    __extends(Root, _super);

    function Root(_a) {
      var policies = _a.policies,
          _b = _a.resultCaching,
          resultCaching = _b === void 0 ? true : _b,
          seed = _a.seed;

      var _this = _super.call(this, policies, new CacheGroup(resultCaching)) || this;

      _this.storageTrie = new Trie(canUseWeakMap);
      _this.sharedLayerGroup = new CacheGroup(resultCaching);
      if (seed) _this.replace(seed);
      return _this;
    }

    Root.prototype.addLayer = function (layerId, replay) {
      return new Layer(layerId, this, replay, this.sharedLayerGroup);
    };

    Root.prototype.removeLayer = function () {
      return this;
    };

    Root.prototype.getStorage = function () {
      return this.storageTrie.lookupArray(arguments);
    };

    return Root;
  }(EntityStore);

  EntityStore.Root = Root;
})(EntityStore || (EntityStore = {}));

var Layer = function (_super) {
  __extends(Layer, _super);

  function Layer(id, parent, replay, group) {
    var _this = _super.call(this, parent.policies, group) || this;

    _this.id = id;
    _this.parent = parent;
    _this.replay = replay;
    _this.group = group;
    replay(_this);
    return _this;
  }

  Layer.prototype.addLayer = function (layerId, replay) {
    return new Layer(layerId, this, replay, this.group);
  };

  Layer.prototype.removeLayer = function (layerId) {
    var _this = this;

    var parent = this.parent.removeLayer(layerId);

    if (layerId === this.id) {
      if (this.group.caching) {
        Object.keys(this.data).forEach(function (dataId) {
          if (_this.data[dataId] !== parent.lookup(dataId)) {
            _this.delete(dataId);
          }
        });
      }

      return parent;
    }

    if (parent === this.parent) return this;
    return parent.addLayer(this.id, this.replay);
  };

  Layer.prototype.toObject = function () {
    return _assign(_assign({}, this.parent.toObject()), this.data);
  };

  Layer.prototype.findChildRefIds = function (dataId) {
    var fromParent = this.parent.findChildRefIds(dataId);
    return hasOwn.call(this.data, dataId) ? _assign(_assign({}, fromParent), _super.prototype.findChildRefIds.call(this, dataId)) : fromParent;
  };

  Layer.prototype.getStorage = function () {
    var p = this.parent;

    while (p.parent) {
      p = p.parent;
    }

    return p.getStorage.apply(p, arguments);
  };

  return Layer;
}(EntityStore);

function storeObjectReconciler(existingObject, incomingObject, property) {
  var existingValue = existingObject[property];
  var incomingValue = incomingObject[property];
  return equal(existingValue, incomingValue) ? existingValue : incomingValue;
}

function supportsResultCaching(store) {
  return !!(store instanceof EntityStore && store.group.caching);
}

function missingFromInvariant(err, context) {
  return new MissingFieldError(err.message, context.path.slice(), context.query, context.clientOnly, context.variables);
}

var StoreReader = function () {
  function StoreReader(config) {
    var _this = this;

    this.config = config;
    this.executeSelectionSet = wrap(function (options) {
      return _this.execSelectionSetImpl(options);
    }, {
      keyArgs: function keyArgs(options) {
        return [options.selectionSet, options.objectOrReference, options.context];
      },
      makeCacheKey: function makeCacheKey(selectionSet, parent, context) {
        if (supportsResultCaching(context.store)) {
          return context.store.makeCacheKey(selectionSet, isReference(parent) ? parent.__ref : parent, context.varString);
        }
      }
    });
    this.knownResults = new WeakMap();
    this.executeSubSelectedArray = wrap(function (options) {
      return _this.execSubSelectedArrayImpl(options);
    }, {
      makeCacheKey: function makeCacheKey(_a) {
        var field = _a.field,
            array = _a.array,
            context = _a.context;

        if (supportsResultCaching(context.store)) {
          return context.store.makeCacheKey(field, array, context.varString);
        }
      }
    });
    this.config = _assign({
      addTypename: true
    }, config);
  }

  StoreReader.prototype.diffQueryAgainstStore = function (_a) {
    var store = _a.store,
        query = _a.query,
        _b = _a.rootId,
        rootId = _b === void 0 ? 'ROOT_QUERY' : _b,
        variables = _a.variables,
        _c = _a.returnPartialData,
        returnPartialData = _c === void 0 ? true : _c;
    var policies = this.config.cache.policies;
    variables = _assign(_assign({}, getDefaultValues(getQueryDefinition(query))), variables);
    var execResult = this.executeSelectionSet({
      selectionSet: getMainDefinition(query).selectionSet,
      objectOrReference: makeReference(rootId),
      context: {
        store: store,
        query: query,
        policies: policies,
        variables: variables,
        varString: JSON.stringify(variables),
        fragmentMap: createFragmentMap(getFragmentDefinitions(query)),
        path: [],
        clientOnly: false
      }
    });
    var hasMissingFields = execResult.missing && execResult.missing.length > 0;

    if (hasMissingFields && !returnPartialData) {
      throw execResult.missing[0];
    }

    return {
      result: execResult.result,
      missing: execResult.missing,
      complete: !hasMissingFields
    };
  };

  StoreReader.prototype.isFresh = function (result, parent, selectionSet, context) {
    if (supportsResultCaching(context.store) && this.knownResults.get(result) === selectionSet) {
      var latest = this.executeSelectionSet.peek(selectionSet, parent, context);

      if (latest && result === latest.result) {
        return true;
      }
    }

    return false;
  };

  StoreReader.prototype.execSelectionSetImpl = function (_a) {
    var _this = this;

    var selectionSet = _a.selectionSet,
        objectOrReference = _a.objectOrReference,
        context = _a.context;

    if (isReference(objectOrReference) && !context.policies.rootTypenamesById[objectOrReference.__ref] && !context.store.has(objectOrReference.__ref)) {
      return {
        result: {},
        missing: [missingFromInvariant(process.env.NODE_ENV === "production" ? new InvariantError(4) : new InvariantError("Dangling reference to missing " + objectOrReference.__ref + " object"), context)]
      };
    }

    var variables = context.variables,
        policies = context.policies,
        store = context.store;
    var objectsToMerge = [];
    var finalResult = {
      result: null
    };
    var typename = store.getFieldValue(objectOrReference, "__typename");

    if (this.config.addTypename && typeof typename === "string" && !policies.rootIdsByTypename[typename]) {
      objectsToMerge.push({
        __typename: typename
      });
    }

    function getMissing() {
      return finalResult.missing || (finalResult.missing = []);
    }

    function handleMissing(result) {
      var _a;

      if (result.missing) (_a = getMissing()).push.apply(_a, result.missing);
      return result.result;
    }

    var workSet = new Set(selectionSet.selections);
    workSet.forEach(function (selection) {
      var _a;

      if (!shouldInclude(selection, variables)) return;

      if (isField(selection)) {
        var fieldValue = policies.readField({
          fieldName: selection.name.value,
          field: selection,
          variables: context.variables,
          from: objectOrReference
        }, context);
        var resultName = resultKeyNameFromField(selection);
        context.path.push(resultName);
        var wasClientOnly = context.clientOnly;
        context.clientOnly = wasClientOnly || !!(selection.directives && selection.directives.some(function (d) {
          return d.name.value === "client";
        }));

        if (fieldValue === void 0) {
          if (!addTypenameToDocument.added(selection)) {
            getMissing().push(missingFromInvariant(process.env.NODE_ENV === "production" ? new InvariantError(5) : new InvariantError("Can't find field '" + selection.name.value + "' on " + (isReference(objectOrReference) ? objectOrReference.__ref + " object" : "object " + JSON.stringify(objectOrReference, null, 2))), context));
          }
        } else if (Array.isArray(fieldValue)) {
          fieldValue = handleMissing(_this.executeSubSelectedArray({
            field: selection,
            array: fieldValue,
            context: context
          }));
        } else if (!selection.selectionSet) {
          if (process.env.NODE_ENV !== 'production') {
            assertSelectionSetForIdValue(context.store, selection, fieldValue);
            maybeDeepFreeze(fieldValue);
          }
        } else if (fieldValue != null) {
          fieldValue = handleMissing(_this.executeSelectionSet({
            selectionSet: selection.selectionSet,
            objectOrReference: fieldValue,
            context: context
          }));
        }

        if (fieldValue !== void 0) {
          objectsToMerge.push((_a = {}, _a[resultName] = fieldValue, _a));
        }

        context.clientOnly = wasClientOnly;
        invariant(context.path.pop() === resultName);
      } else {
        var fragment = getFragmentFromSelection(selection, context.fragmentMap);

        if (fragment && policies.fragmentMatches(fragment, typename)) {
          fragment.selectionSet.selections.forEach(workSet.add, workSet);
        }
      }
    });
    finalResult.result = mergeDeepArray(objectsToMerge);

    if (process.env.NODE_ENV !== 'production') {
      Object.freeze(finalResult.result);
    }

    this.knownResults.set(finalResult.result, selectionSet);
    return finalResult;
  };

  StoreReader.prototype.execSubSelectedArrayImpl = function (_a) {
    var _this = this;

    var field = _a.field,
        array = _a.array,
        context = _a.context;
    var missing;

    function handleMissing(childResult, i) {
      if (childResult.missing) {
        missing = missing || [];
        missing.push.apply(missing, childResult.missing);
      }

      invariant(context.path.pop() === i);
      return childResult.result;
    }

    if (field.selectionSet) {
      array = array.filter(context.store.canRead);
    }

    array = array.map(function (item, i) {
      if (item === null) {
        return null;
      }

      context.path.push(i);

      if (Array.isArray(item)) {
        return handleMissing(_this.executeSubSelectedArray({
          field: field,
          array: item,
          context: context
        }), i);
      }

      if (field.selectionSet) {
        return handleMissing(_this.executeSelectionSet({
          selectionSet: field.selectionSet,
          objectOrReference: item,
          context: context
        }), i);
      }

      if (process.env.NODE_ENV !== 'production') {
        assertSelectionSetForIdValue(context.store, field, item);
      }

      invariant(context.path.pop() === i);
      return item;
    });

    if (process.env.NODE_ENV !== 'production') {
      Object.freeze(array);
    }

    return {
      result: array,
      missing: missing
    };
  };

  return StoreReader;
}();

function assertSelectionSetForIdValue(store, field, fieldValue) {
  if (!field.selectionSet) {
    var workSet_1 = new Set([fieldValue]);
    workSet_1.forEach(function (value) {
      if (value && typeof value === "object") {
        process.env.NODE_ENV === "production" ? invariant(!isReference(value), 6) : invariant(!isReference(value), "Missing selection set for object of type " + getTypenameFromStoreObject(store, value) + " returned for query field " + field.name.value);
        Object.values(value).forEach(workSet_1.add, workSet_1);
      }
    });
  }
}

var StoreWriter = function () {
  function StoreWriter(cache, reader) {
    this.cache = cache;
    this.reader = reader;
  }

  StoreWriter.prototype.writeToStore = function (_a) {
    var query = _a.query,
        result = _a.result,
        dataId = _a.dataId,
        store = _a.store,
        variables = _a.variables;
    var operationDefinition = getOperationDefinition(query);
    var merger = makeProcessedFieldsMerger();
    variables = _assign(_assign({}, getDefaultValues(operationDefinition)), variables);
    var ref = this.processSelectionSet({
      result: result || Object.create(null),
      dataId: dataId,
      selectionSet: operationDefinition.selectionSet,
      mergeTree: {
        map: new Map()
      },
      context: {
        store: store,
        written: Object.create(null),
        merge: function merge(existing, incoming) {
          return merger.merge(existing, incoming);
        },
        variables: variables,
        varString: JSON.stringify(variables),
        fragmentMap: createFragmentMap(getFragmentDefinitions(query))
      }
    });

    if (!isReference(ref)) {
      throw process.env.NODE_ENV === "production" ? new InvariantError(7) : new InvariantError("Could not identify object " + JSON.stringify(result));
    }

    store.retain(ref.__ref);
    return ref;
  };

  StoreWriter.prototype.processSelectionSet = function (_a) {
    var _this = this;

    var dataId = _a.dataId,
        result = _a.result,
        selectionSet = _a.selectionSet,
        context = _a.context,
        mergeTree = _a.mergeTree;
    var policies = this.cache.policies;

    var _b = policies.identify(result, selectionSet, context.fragmentMap),
        id = _b[0],
        keyObject = _b[1];

    dataId = dataId || id;

    if ("string" === typeof dataId) {
      var sets = context.written[dataId] || (context.written[dataId] = []);
      var ref = makeReference(dataId);
      if (sets.indexOf(selectionSet) >= 0) return ref;
      sets.push(selectionSet);

      if (this.reader && this.reader.isFresh(result, ref, selectionSet, context)) {
        return ref;
      }
    }

    var incomingFields = Object.create(null);

    if (keyObject) {
      incomingFields = context.merge(incomingFields, keyObject);
    }

    var typename = dataId && policies.rootTypenamesById[dataId] || getTypenameFromResult(result, selectionSet, context.fragmentMap) || dataId && context.store.get(dataId, "__typename");

    if ("string" === typeof typename) {
      incomingFields.__typename = typename;
    }

    var workSet = new Set(selectionSet.selections);
    workSet.forEach(function (selection) {
      var _a;

      if (!shouldInclude(selection, context.variables)) return;

      if (isField(selection)) {
        var resultFieldKey = resultKeyNameFromField(selection);
        var value = result[resultFieldKey];

        if (typeof value !== 'undefined') {
          var storeFieldName = policies.getStoreFieldName({
            typename: typename,
            fieldName: selection.name.value,
            field: selection,
            variables: context.variables
          });
          var childTree = getChildMergeTree(mergeTree, storeFieldName);

          var incomingValue = _this.processFieldValue(value, selection, context, childTree);

          var childTypename = selection.selectionSet && context.store.getFieldValue(incomingValue, "__typename") || void 0;
          var merge = policies.getMergeFunction(typename, selection.name.value, childTypename);

          if (merge) {
            childTree.info = {
              field: selection,
              typename: typename,
              merge: merge
            };
          } else {
            maybeRecycleChildMergeTree(mergeTree, storeFieldName);
          }

          incomingFields = context.merge(incomingFields, (_a = {}, _a[storeFieldName] = incomingValue, _a));
        } else if (policies.usingPossibleTypes && !hasDirectives(["defer", "client"], selection)) {
          throw process.env.NODE_ENV === "production" ? new InvariantError(8) : new InvariantError("Missing field '" + resultFieldKey + "' in " + JSON.stringify(result, null, 2).substring(0, 100));
        }
      } else {
        var fragment = getFragmentFromSelection(selection, context.fragmentMap);

        if (fragment && policies.fragmentMatches(fragment, typename, result, context.variables)) {
          fragment.selectionSet.selections.forEach(workSet.add, workSet);
        }
      }
    });

    if ("string" === typeof dataId) {
      var entityRef_1 = makeReference(dataId);

      if (mergeTree.map.size) {
        incomingFields = this.applyMerges(mergeTree, entityRef_1, incomingFields, context);
      }

      if (process.env.NODE_ENV !== "production") {
        var hasSelectionSet_1 = function hasSelectionSet_1(storeFieldName) {
          return fieldsWithSelectionSets_1.has(fieldNameFromStoreName(storeFieldName));
        };

        var fieldsWithSelectionSets_1 = new Set();
        workSet.forEach(function (selection) {
          if (isField(selection) && selection.selectionSet) {
            fieldsWithSelectionSets_1.add(selection.name.value);
          }
        });

        var hasMergeFunction_1 = function hasMergeFunction_1(storeFieldName) {
          var childTree = mergeTree.map.get(storeFieldName);
          return Boolean(childTree && childTree.info && childTree.info.merge);
        };

        Object.keys(incomingFields).forEach(function (storeFieldName) {
          if (hasSelectionSet_1(storeFieldName) && !hasMergeFunction_1(storeFieldName)) {
            warnAboutDataLoss(entityRef_1, incomingFields, storeFieldName, context.store);
          }
        });
      }

      context.store.merge(dataId, incomingFields);
      return entityRef_1;
    }

    return incomingFields;
  };

  StoreWriter.prototype.processFieldValue = function (value, field, context, mergeTree) {
    var _this = this;

    if (!field.selectionSet || value === null) {
      return process.env.NODE_ENV === 'production' ? value : cloneDeep(value);
    }

    if (Array.isArray(value)) {
      return value.map(function (item, i) {
        var value = _this.processFieldValue(item, field, context, getChildMergeTree(mergeTree, i));

        maybeRecycleChildMergeTree(mergeTree, i);
        return value;
      });
    }

    return this.processSelectionSet({
      result: value,
      selectionSet: field.selectionSet,
      context: context,
      mergeTree: mergeTree
    });
  };

  StoreWriter.prototype.applyMerges = function (mergeTree, existing, incoming, context, getStorageArgs) {
    var _a;

    var _this = this;

    if (mergeTree.map.size && !isReference(incoming)) {
      var e_1 = !Array.isArray(incoming) && (isReference(existing) || storeValueIsStoreObject(existing)) ? existing : void 0;
      var i_1 = incoming;

      if (e_1 && !getStorageArgs) {
        getStorageArgs = [isReference(e_1) ? e_1.__ref : e_1];
      }

      var changedFields_1;

      var getValue_1 = function getValue_1(from, name) {
        return Array.isArray(from) ? typeof name === "number" ? from[name] : void 0 : context.store.getFieldValue(from, String(name));
      };

      mergeTree.map.forEach(function (childTree, storeFieldName) {
        if (getStorageArgs) {
          getStorageArgs.push(storeFieldName);
        }

        var eVal = getValue_1(e_1, storeFieldName);
        var iVal = getValue_1(i_1, storeFieldName);

        var aVal = _this.applyMerges(childTree, eVal, iVal, context, getStorageArgs);

        if (aVal !== iVal) {
          changedFields_1 = changedFields_1 || new Map();
          changedFields_1.set(storeFieldName, aVal);
        }

        if (getStorageArgs) {
          invariant(getStorageArgs.pop() === storeFieldName);
        }
      });

      if (changedFields_1) {
        incoming = Array.isArray(i_1) ? i_1.slice(0) : _assign({}, i_1);
        changedFields_1.forEach(function (value, name) {
          incoming[name] = value;
        });
      }
    }

    if (mergeTree.info) {
      return this.cache.policies.runMergeFunction(existing, incoming, mergeTree.info, context, getStorageArgs && (_a = context.store).getStorage.apply(_a, getStorageArgs));
    }

    return incoming;
  };

  return StoreWriter;
}();

var emptyMergeTreePool = [];

function getChildMergeTree(_a, name) {
  var map = _a.map;

  if (!map.has(name)) {
    map.set(name, emptyMergeTreePool.pop() || {
      map: new Map()
    });
  }

  return map.get(name);
}

function maybeRecycleChildMergeTree(_a, name) {
  var map = _a.map;
  var childTree = map.get(name);

  if (childTree && !childTree.info && !childTree.map.size) {
    emptyMergeTreePool.push(childTree);
    map.delete(name);
  }
}

var warnings = new Set();

function warnAboutDataLoss(existingRef, incomingObj, storeFieldName, store) {
  var getChild = function getChild(objOrRef) {
    var child = store.getFieldValue(objOrRef, storeFieldName);
    return typeof child === "object" && child;
  };

  var existing = getChild(existingRef);
  if (!existing) return;
  var incoming = getChild(incomingObj);
  if (!incoming) return;
  if (isReference(existing)) return;
  if (equal(existing, incoming)) return;

  if (Object.keys(existing).every(function (key) {
    return store.getFieldValue(incoming, key) !== void 0;
  })) {
    return;
  }

  var parentType = store.getFieldValue(existingRef, "__typename") || store.getFieldValue(incomingObj, "__typename");
  var fieldName = fieldNameFromStoreName(storeFieldName);
  var typeDotName = parentType + "." + fieldName;
  if (warnings.has(typeDotName)) return;
  warnings.add(typeDotName);
  var childTypenames = [];

  if (!Array.isArray(existing) && !Array.isArray(incoming)) {
    [existing, incoming].forEach(function (child) {
      var typename = store.getFieldValue(child, "__typename");

      if (typeof typename === "string" && !childTypenames.includes(typename)) {
        childTypenames.push(typename);
      }
    });
  }

  process.env.NODE_ENV === "production" || invariant.warn("Cache data may be lost when replacing the " + fieldName + " field of a " + parentType + " object.\n\nTo address this problem (which is not a bug in Apollo Client), " + (childTypenames.length ? "either ensure all objects of type " + childTypenames.join(" and ") + " have an ID or a custom merge function, or " : "") + "define a custom merge function for the " + typeDotName + " field, so InMemoryCache can safely merge these objects:\n\n  existing: " + JSON.stringify(existing).slice(0, 1000) + "\n  incoming: " + JSON.stringify(incoming).slice(0, 1000) + "\n\nFor more information about these options, please refer to the documentation:\n\n  * Ensuring entity objects have IDs: https://go.apollo.dev/c/generating-unique-identifiers\n  * Defining custom merge functions: https://go.apollo.dev/c/merging-non-normalized-objects\n");
}

var cacheSlot = new Slot();

function consumeAndIterate(set, callback) {
  if (set.size) {
    var items_1 = [];
    set.forEach(function (item) {
      return items_1.push(item);
    });
    set.clear();
    items_1.forEach(callback);
  }
}

var cacheInfoMap = new WeakMap();

function getCacheInfo(cache) {
  var info = cacheInfoMap.get(cache);

  if (!info) {
    cacheInfoMap.set(cache, info = {
      vars: new Set(),
      dep: dep()
    });
  }

  return info;
}

function forgetCache(cache) {
  getCacheInfo(cache).vars.forEach(function (rv) {
    return rv.forgetCache(cache);
  });
}

function recallCache(cache) {
  getCacheInfo(cache).vars.forEach(function (rv) {
    return rv.attachCache(cache);
  });
}

function makeVar(value) {
  var caches = new Set();
  var listeners = new Set();

  var rv = function rv(newValue) {
    if (arguments.length > 0) {
      if (value !== newValue) {
        value = newValue;
        caches.forEach(function (cache) {
          getCacheInfo(cache).dep.dirty(rv);
          broadcast(cache);
        });
        consumeAndIterate(listeners, function (listener) {
          return listener(value);
        });
      }
    } else {
      var cache = cacheSlot.getValue();

      if (cache) {
        attach(cache);
        getCacheInfo(cache).dep(rv);
      }
    }

    return value;
  };

  rv.onNextChange = function (listener) {
    listeners.add(listener);
    return function () {
      listeners.delete(listener);
    };
  };

  var attach = rv.attachCache = function (cache) {
    caches.add(cache);
    getCacheInfo(cache).vars.add(rv);
    return rv;
  };

  rv.forgetCache = function (cache) {
    return caches.delete(cache);
  };

  return rv;
}

function broadcast(cache) {
  if (cache.broadcastWatches) {
    cache.broadcastWatches();
  }
}

function argsFromFieldSpecifier(spec) {
  return spec.args !== void 0 ? spec.args : spec.field ? argumentsObjectFromField(spec.field, spec.variables) : null;
}

var defaultDataIdFromObject = function defaultDataIdFromObject(_a, context) {
  var __typename = _a.__typename,
      id = _a.id,
      _id = _a._id;

  if (typeof __typename === "string") {
    if (context) {
      context.keyObject = id !== void 0 ? {
        id: id
      } : _id !== void 0 ? {
        _id: _id
      } : void 0;
    }

    if (id === void 0) id = _id;

    if (id !== void 0) {
      return __typename + ":" + (typeof id === "number" || typeof id === "string" ? id : JSON.stringify(id));
    }
  }
};

exports.defaultDataIdFromObject = defaultDataIdFromObject;

var nullKeyFieldsFn = function nullKeyFieldsFn() {
  return void 0;
};

var simpleKeyArgsFn = function simpleKeyArgsFn(_args, context) {
  return context.fieldName;
};

var mergeTrueFn = function mergeTrueFn(existing, incoming, _a) {
  var mergeObjects = _a.mergeObjects;
  return mergeObjects(existing, incoming);
};

var mergeFalseFn = function mergeFalseFn(_, incoming) {
  return incoming;
};

var Policies = function () {
  function Policies(config) {
    this.config = config;
    this.typePolicies = Object.create(null);
    this.toBeAdded = Object.create(null);
    this.supertypeMap = new Map();
    this.fuzzySubtypes = new Map();
    this.rootIdsByTypename = Object.create(null);
    this.rootTypenamesById = Object.create(null);
    this.usingPossibleTypes = false;
    this.config = _assign({
      dataIdFromObject: defaultDataIdFromObject
    }, config);
    this.cache = this.config.cache;
    this.setRootTypename("Query");
    this.setRootTypename("Mutation");
    this.setRootTypename("Subscription");

    if (config.possibleTypes) {
      this.addPossibleTypes(config.possibleTypes);
    }

    if (config.typePolicies) {
      this.addTypePolicies(config.typePolicies);
    }
  }

  Policies.prototype.identify = function (object, selectionSet, fragmentMap) {
    var typename = selectionSet && fragmentMap ? getTypenameFromResult(object, selectionSet, fragmentMap) : object.__typename;

    if (typename === this.rootTypenamesById.ROOT_QUERY) {
      return ["ROOT_QUERY"];
    }

    var context = {
      typename: typename,
      selectionSet: selectionSet,
      fragmentMap: fragmentMap
    };
    var id;
    var policy = typename && this.getTypePolicy(typename);
    var keyFn = policy && policy.keyFn || this.config.dataIdFromObject;

    while (keyFn) {
      var specifierOrId = keyFn(object, context);

      if (Array.isArray(specifierOrId)) {
        keyFn = keyFieldsFnFromSpecifier(specifierOrId);
      } else {
        id = specifierOrId;
        break;
      }
    }

    id = id && String(id);
    return context.keyObject ? [id, context.keyObject] : [id];
  };

  Policies.prototype.addTypePolicies = function (typePolicies) {
    var _this = this;

    Object.keys(typePolicies).forEach(function (typename) {
      var _a = typePolicies[typename],
          queryType = _a.queryType,
          mutationType = _a.mutationType,
          subscriptionType = _a.subscriptionType,
          incoming = __rest(_a, ["queryType", "mutationType", "subscriptionType"]);

      if (queryType) _this.setRootTypename("Query", typename);
      if (mutationType) _this.setRootTypename("Mutation", typename);
      if (subscriptionType) _this.setRootTypename("Subscription", typename);

      if (hasOwn.call(_this.toBeAdded, typename)) {
        _this.toBeAdded[typename].push(incoming);
      } else {
        _this.toBeAdded[typename] = [incoming];
      }
    });
  };

  Policies.prototype.updateTypePolicy = function (typename, incoming) {
    var _this = this;

    var existing = this.getTypePolicy(typename);
    var keyFields = incoming.keyFields,
        fields = incoming.fields;

    function setMerge(existing, merge) {
      existing.merge = typeof merge === "function" ? merge : merge === true ? mergeTrueFn : merge === false ? mergeFalseFn : existing.merge;
    }

    setMerge(existing, incoming.merge);
    existing.keyFn = keyFields === false ? nullKeyFieldsFn : Array.isArray(keyFields) ? keyFieldsFnFromSpecifier(keyFields) : typeof keyFields === "function" ? keyFields : existing.keyFn;

    if (fields) {
      Object.keys(fields).forEach(function (fieldName) {
        var existing = _this.getFieldPolicy(typename, fieldName, true);

        var incoming = fields[fieldName];

        if (typeof incoming === "function") {
          existing.read = incoming;
        } else {
          var keyArgs = incoming.keyArgs,
              read = incoming.read,
              merge = incoming.merge;
          existing.keyFn = keyArgs === false ? simpleKeyArgsFn : Array.isArray(keyArgs) ? keyArgsFnFromSpecifier(keyArgs) : typeof keyArgs === "function" ? keyArgs : existing.keyFn;

          if (typeof read === "function") {
            existing.read = read;
          }

          setMerge(existing, merge);
        }

        if (existing.read && existing.merge) {
          existing.keyFn = existing.keyFn || simpleKeyArgsFn;
        }
      });
    }
  };

  Policies.prototype.setRootTypename = function (which, typename) {
    if (typename === void 0) {
      typename = which;
    }

    var rootId = "ROOT_" + which.toUpperCase();
    var old = this.rootTypenamesById[rootId];

    if (typename !== old) {
      process.env.NODE_ENV === "production" ? invariant(!old || old === which, 1) : invariant(!old || old === which, "Cannot change root " + which + " __typename more than once");
      if (old) delete this.rootIdsByTypename[old];
      this.rootIdsByTypename[typename] = rootId;
      this.rootTypenamesById[rootId] = typename;
    }
  };

  Policies.prototype.addPossibleTypes = function (possibleTypes) {
    var _this = this;

    this.usingPossibleTypes = true;
    Object.keys(possibleTypes).forEach(function (supertype) {
      _this.getSupertypeSet(supertype, true);

      possibleTypes[supertype].forEach(function (subtype) {
        _this.getSupertypeSet(subtype, true).add(supertype);

        var match = subtype.match(TypeOrFieldNameRegExp);

        if (!match || match[0] !== subtype) {
          _this.fuzzySubtypes.set(subtype, new RegExp(subtype));
        }
      });
    });
  };

  Policies.prototype.getTypePolicy = function (typename) {
    var _this = this;

    if (!hasOwn.call(this.typePolicies, typename)) {
      var policy_1 = this.typePolicies[typename] = Object.create(null);
      policy_1.fields = Object.create(null);
      var supertypes = this.supertypeMap.get(typename);

      if (supertypes && supertypes.size) {
        supertypes.forEach(function (supertype) {
          var _a = _this.getTypePolicy(supertype),
              fields = _a.fields,
              rest = __rest(_a, ["fields"]);

          Object.assign(policy_1, rest);
          Object.assign(policy_1.fields, fields);
        });
      }
    }

    var inbox = this.toBeAdded[typename];

    if (inbox && inbox.length) {
      this.updateTypePolicy(typename, compact.apply(void 0, inbox.splice(0)));
    }

    return this.typePolicies[typename];
  };

  Policies.prototype.getFieldPolicy = function (typename, fieldName, createIfMissing) {
    if (typename) {
      var fieldPolicies = this.getTypePolicy(typename).fields;
      return fieldPolicies[fieldName] || createIfMissing && (fieldPolicies[fieldName] = Object.create(null));
    }
  };

  Policies.prototype.getSupertypeSet = function (subtype, createIfMissing) {
    var supertypeSet = this.supertypeMap.get(subtype);

    if (!supertypeSet && createIfMissing) {
      this.supertypeMap.set(subtype, supertypeSet = new Set());
    }

    return supertypeSet;
  };

  Policies.prototype.fragmentMatches = function (fragment, typename, result, variables) {
    var _this = this;

    if (!fragment.typeCondition) return true;
    if (!typename) return false;
    var supertype = fragment.typeCondition.name.value;
    if (typename === supertype) return true;

    if (this.usingPossibleTypes && this.supertypeMap.has(supertype)) {
      var typenameSupertypeSet = this.getSupertypeSet(typename, true);
      var workQueue_1 = [typenameSupertypeSet];

      var maybeEnqueue_1 = function maybeEnqueue_1(subtype) {
        var supertypeSet = _this.getSupertypeSet(subtype, false);

        if (supertypeSet && supertypeSet.size && workQueue_1.indexOf(supertypeSet) < 0) {
          workQueue_1.push(supertypeSet);
        }
      };

      var needToCheckFuzzySubtypes = !!(result && this.fuzzySubtypes.size);
      var checkingFuzzySubtypes = false;

      for (var i = 0; i < workQueue_1.length; ++i) {
        var supertypeSet = workQueue_1[i];

        if (supertypeSet.has(supertype)) {
          if (!typenameSupertypeSet.has(supertype)) {
            if (checkingFuzzySubtypes) {
              process.env.NODE_ENV === "production" || invariant.warn("Inferring subtype " + typename + " of supertype " + supertype);
            }

            typenameSupertypeSet.add(supertype);
          }

          return true;
        }

        supertypeSet.forEach(maybeEnqueue_1);

        if (needToCheckFuzzySubtypes && i === workQueue_1.length - 1 && selectionSetMatchesResult(fragment.selectionSet, result, variables)) {
          needToCheckFuzzySubtypes = false;
          checkingFuzzySubtypes = true;
          this.fuzzySubtypes.forEach(function (regExp, fuzzyString) {
            var match = typename.match(regExp);

            if (match && match[0] === typename) {
              maybeEnqueue_1(fuzzyString);
            }
          });
        }
      }
    }

    return false;
  };

  Policies.prototype.hasKeyArgs = function (typename, fieldName) {
    var policy = this.getFieldPolicy(typename, fieldName, false);
    return !!(policy && policy.keyFn);
  };

  Policies.prototype.getStoreFieldName = function (fieldSpec) {
    var typename = fieldSpec.typename,
        fieldName = fieldSpec.fieldName;
    var policy = this.getFieldPolicy(typename, fieldName, false);
    var storeFieldName;
    var keyFn = policy && policy.keyFn;

    if (keyFn && typename) {
      var context = {
        typename: typename,
        fieldName: fieldName,
        field: fieldSpec.field || null,
        variables: fieldSpec.variables
      };
      var args = argsFromFieldSpecifier(fieldSpec);

      while (keyFn) {
        var specifierOrString = keyFn(args, context);

        if (Array.isArray(specifierOrString)) {
          keyFn = keyArgsFnFromSpecifier(specifierOrString);
        } else {
          storeFieldName = specifierOrString || fieldName;
          break;
        }
      }
    }

    if (storeFieldName === void 0) {
      storeFieldName = fieldSpec.field ? storeKeyNameFromField(fieldSpec.field, fieldSpec.variables) : getStoreKeyName(fieldName, argsFromFieldSpecifier(fieldSpec));
    }

    return fieldName === fieldNameFromStoreName(storeFieldName) ? storeFieldName : fieldName + ":" + storeFieldName;
  };

  Policies.prototype.readField = function (options, context) {
    var objectOrReference = options.from;
    if (!objectOrReference) return;
    var nameOrField = options.field || options.fieldName;
    if (!nameOrField) return;

    if (options.typename === void 0) {
      var typename = context.store.getFieldValue(objectOrReference, "__typename");
      if (typename) options.typename = typename;
    }

    var storeFieldName = this.getStoreFieldName(options);
    var fieldName = fieldNameFromStoreName(storeFieldName);
    var existing = context.store.getFieldValue(objectOrReference, storeFieldName);
    var policy = this.getFieldPolicy(options.typename, fieldName, false);
    var read = policy && policy.read;

    if (read) {
      var readOptions = makeFieldFunctionOptions(this, objectOrReference, options, context, context.store.getStorage(isReference(objectOrReference) ? objectOrReference.__ref : objectOrReference, storeFieldName));
      return cacheSlot.withValue(this.cache, read, [existing, readOptions]);
    }

    return existing;
  };

  Policies.prototype.getMergeFunction = function (parentTypename, fieldName, childTypename) {
    var policy = this.getFieldPolicy(parentTypename, fieldName, false);
    var merge = policy && policy.merge;

    if (!merge && childTypename) {
      policy = this.getTypePolicy(childTypename);
      merge = policy && policy.merge;
    }

    return merge;
  };

  Policies.prototype.runMergeFunction = function (existing, incoming, _a, context, storage) {
    var field = _a.field,
        typename = _a.typename,
        merge = _a.merge;

    if (merge === mergeTrueFn) {
      return makeMergeObjectsFunction(context.store.getFieldValue)(existing, incoming);
    }

    if (merge === mergeFalseFn) {
      return incoming;
    }

    return merge(existing, incoming, makeFieldFunctionOptions(this, void 0, {
      typename: typename,
      fieldName: field.name.value,
      field: field,
      variables: context.variables
    }, context, storage || Object.create(null)));
  };

  return Policies;
}();

function makeFieldFunctionOptions(policies, objectOrReference, fieldSpec, context, storage) {
  var storeFieldName = policies.getStoreFieldName(fieldSpec);
  var fieldName = fieldNameFromStoreName(storeFieldName);
  var variables = fieldSpec.variables || context.variables;
  var _a = context.store,
      getFieldValue = _a.getFieldValue,
      toReference = _a.toReference,
      canRead = _a.canRead;
  return {
    args: argsFromFieldSpecifier(fieldSpec),
    field: fieldSpec.field || null,
    fieldName: fieldName,
    storeFieldName: storeFieldName,
    variables: variables,
    isReference: isReference,
    toReference: toReference,
    storage: storage,
    cache: policies.cache,
    canRead: canRead,
    readField: function readField(fieldNameOrOptions, from) {
      var options = typeof fieldNameOrOptions === "string" ? {
        fieldName: fieldNameOrOptions,
        from: from
      } : _assign({}, fieldNameOrOptions);

      if (void 0 === options.from) {
        options.from = objectOrReference;
      }

      if (void 0 === options.variables) {
        options.variables = variables;
      }

      return policies.readField(options, context);
    },
    mergeObjects: makeMergeObjectsFunction(getFieldValue)
  };
}

function makeMergeObjectsFunction(getFieldValue) {
  return function mergeObjects(existing, incoming) {
    if (Array.isArray(existing) || Array.isArray(incoming)) {
      throw process.env.NODE_ENV === "production" ? new InvariantError(2) : new InvariantError("Cannot automatically merge arrays");
    }

    if (existing && typeof existing === "object" && incoming && typeof incoming === "object") {
      var eType = getFieldValue(existing, "__typename");
      var iType = getFieldValue(incoming, "__typename");
      var typesDiffer = eType && iType && eType !== iType;

      if (typesDiffer || !storeValueIsStoreObject(existing) || !storeValueIsStoreObject(incoming)) {
        return incoming;
      }

      return _assign(_assign({}, existing), incoming);
    }

    return incoming;
  };
}

function keyArgsFnFromSpecifier(specifier) {
  return function (args, context) {
    return args ? context.fieldName + ":" + JSON.stringify(computeKeyObject(args, specifier, false)) : context.fieldName;
  };
}

function keyFieldsFnFromSpecifier(specifier) {
  var trie = new Trie(canUseWeakMap);
  return function (object, context) {
    var aliasMap;

    if (context.selectionSet && context.fragmentMap) {
      var info = trie.lookupArray([context.selectionSet, context.fragmentMap]);
      aliasMap = info.aliasMap || (info.aliasMap = makeAliasMap(context.selectionSet, context.fragmentMap));
    }

    var keyObject = context.keyObject = computeKeyObject(object, specifier, true, aliasMap);
    return context.typename + ":" + JSON.stringify(keyObject);
  };
}

function makeAliasMap(selectionSet, fragmentMap) {
  var map = Object.create(null);
  var workQueue = new Set([selectionSet]);
  workQueue.forEach(function (selectionSet) {
    selectionSet.selections.forEach(function (selection) {
      if (isField(selection)) {
        if (selection.alias) {
          var responseKey = selection.alias.value;
          var storeKey = selection.name.value;

          if (storeKey !== responseKey) {
            var aliases = map.aliases || (map.aliases = Object.create(null));
            aliases[storeKey] = responseKey;
          }
        }

        if (selection.selectionSet) {
          var subsets = map.subsets || (map.subsets = Object.create(null));
          subsets[selection.name.value] = makeAliasMap(selection.selectionSet, fragmentMap);
        }
      } else {
        var fragment = getFragmentFromSelection(selection, fragmentMap);

        if (fragment) {
          workQueue.add(fragment.selectionSet);
        }
      }
    });
  });
  return map;
}

function computeKeyObject(response, specifier, strict, aliasMap) {
  var keyObj = Object.create(null);
  var prevKey;
  specifier.forEach(function (s) {
    if (Array.isArray(s)) {
      if (typeof prevKey === "string") {
        var subsets = aliasMap && aliasMap.subsets;
        var subset = subsets && subsets[prevKey];
        keyObj[prevKey] = computeKeyObject(response[prevKey], s, strict, subset);
      }
    } else {
      var aliases = aliasMap && aliasMap.aliases;
      var responseName = aliases && aliases[s] || s;

      if (hasOwn.call(response, responseName)) {
        keyObj[prevKey = s] = response[responseName];
      } else {
        process.env.NODE_ENV === "production" ? invariant(!strict, 3) : invariant(!strict, "Missing field '" + responseName + "' while computing key fields");
        prevKey = void 0;
      }
    }
  });
  return keyObj;
}

var defaultConfig = {
  dataIdFromObject: defaultDataIdFromObject,
  addTypename: true,
  resultCaching: true,
  typePolicies: {}
};

var InMemoryCache = function (_super) {
  __extends(InMemoryCache, _super);

  function InMemoryCache(config) {
    if (config === void 0) {
      config = {};
    }

    var _this = _super.call(this) || this;

    _this.watches = new Set();
    _this.typenameDocumentCache = new Map();
    _this.makeVar = makeVar;
    _this.txCount = 0;
    _this.maybeBroadcastWatch = wrap(function (c, fromOptimisticTransaction) {
      return _this.broadcastWatch.call(_this, c, !!fromOptimisticTransaction);
    }, {
      makeCacheKey: function makeCacheKey(c) {
        var store = c.optimistic ? _this.optimisticData : _this.data;

        if (supportsResultCaching(store)) {
          var optimistic = c.optimistic,
              rootId = c.rootId,
              variables = c.variables;
          return store.makeCacheKey(c.query, c.callback, JSON.stringify({
            optimistic: optimistic,
            rootId: rootId,
            variables: variables
          }));
        }
      }
    });
    _this.watchDep = dep();
    _this.config = _assign(_assign({}, defaultConfig), config);
    _this.addTypename = !!_this.config.addTypename;
    _this.policies = new Policies({
      cache: _this,
      dataIdFromObject: _this.config.dataIdFromObject,
      possibleTypes: _this.config.possibleTypes,
      typePolicies: _this.config.typePolicies
    });
    _this.data = new EntityStore.Root({
      policies: _this.policies,
      resultCaching: _this.config.resultCaching
    });
    _this.optimisticData = _this.data;
    _this.storeWriter = new StoreWriter(_this, _this.storeReader = new StoreReader({
      cache: _this,
      addTypename: _this.addTypename
    }));
    return _this;
  }

  InMemoryCache.prototype.restore = function (data) {
    if (data) this.data.replace(data);
    return this;
  };

  InMemoryCache.prototype.extract = function (optimistic) {
    if (optimistic === void 0) {
      optimistic = false;
    }

    return (optimistic ? this.optimisticData : this.data).extract();
  };

  InMemoryCache.prototype.read = function (options) {
    var _a = options.returnPartialData,
        returnPartialData = _a === void 0 ? false : _a;

    try {
      return this.storeReader.diffQueryAgainstStore({
        store: options.optimistic ? this.optimisticData : this.data,
        query: options.query,
        variables: options.variables,
        rootId: options.rootId,
        config: this.config,
        returnPartialData: returnPartialData
      }).result || null;
    } catch (e) {
      if (e instanceof MissingFieldError) {
        return null;
      }

      throw e;
    }
  };

  InMemoryCache.prototype.write = function (options) {
    try {
      ++this.txCount;
      return this.storeWriter.writeToStore({
        store: this.data,
        query: options.query,
        result: options.result,
        dataId: options.dataId,
        variables: options.variables
      });
    } finally {
      if (! --this.txCount && options.broadcast !== false) {
        this.broadcastWatches();
      }
    }
  };

  InMemoryCache.prototype.modify = function (options) {
    if (hasOwn.call(options, "id") && !options.id) {
      return false;
    }

    var store = options.optimistic ? this.optimisticData : this.data;

    try {
      ++this.txCount;
      return store.modify(options.id || "ROOT_QUERY", options.fields);
    } finally {
      if (! --this.txCount && options.broadcast !== false) {
        this.broadcastWatches();
      }
    }
  };

  InMemoryCache.prototype.diff = function (options) {
    return this.storeReader.diffQueryAgainstStore({
      store: options.optimistic ? this.optimisticData : this.data,
      rootId: options.id || "ROOT_QUERY",
      query: options.query,
      variables: options.variables,
      returnPartialData: options.returnPartialData,
      config: this.config
    });
  };

  InMemoryCache.prototype.watch = function (watch) {
    var _this = this;

    if (!this.watches.size) {
      recallCache(this);
    }

    this.watches.add(watch);

    if (watch.immediate) {
      this.maybeBroadcastWatch(watch);
    }

    return function () {
      if (_this.watches.delete(watch) && !_this.watches.size) {
        forgetCache(_this);
      }

      _this.watchDep.dirty(watch);

      _this.maybeBroadcastWatch.forget(watch);
    };
  };

  InMemoryCache.prototype.gc = function () {
    return this.optimisticData.gc();
  };

  InMemoryCache.prototype.retain = function (rootId, optimistic) {
    return (optimistic ? this.optimisticData : this.data).retain(rootId);
  };

  InMemoryCache.prototype.release = function (rootId, optimistic) {
    return (optimistic ? this.optimisticData : this.data).release(rootId);
  };

  InMemoryCache.prototype.identify = function (object) {
    return isReference(object) ? object.__ref : this.policies.identify(object)[0];
  };

  InMemoryCache.prototype.evict = function (options) {
    if (!options.id) {
      if (hasOwn.call(options, "id")) {
        return false;
      }

      options = _assign(_assign({}, options), {
        id: "ROOT_QUERY"
      });
    }

    try {
      ++this.txCount;
      return this.optimisticData.evict(options);
    } finally {
      if (! --this.txCount && options.broadcast !== false) {
        this.broadcastWatches();
      }
    }
  };

  InMemoryCache.prototype.reset = function () {
    this.data.clear();
    this.optimisticData = this.data;
    this.broadcastWatches();
    return Promise.resolve();
  };

  InMemoryCache.prototype.removeOptimistic = function (idToRemove) {
    var newOptimisticData = this.optimisticData.removeLayer(idToRemove);

    if (newOptimisticData !== this.optimisticData) {
      this.optimisticData = newOptimisticData;
      this.broadcastWatches();
    }
  };

  InMemoryCache.prototype.performTransaction = function (transaction, optimisticId) {
    var _this = this;

    var perform = function perform(layer) {
      var _a = _this,
          data = _a.data,
          optimisticData = _a.optimisticData;
      ++_this.txCount;

      if (layer) {
        _this.data = _this.optimisticData = layer;
      }

      try {
        transaction(_this);
      } finally {
        --_this.txCount;
        _this.data = data;
        _this.optimisticData = optimisticData;
      }
    };

    var fromOptimisticTransaction = false;

    if (typeof optimisticId === 'string') {
      this.optimisticData = this.optimisticData.addLayer(optimisticId, perform);
      fromOptimisticTransaction = true;
    } else if (optimisticId === null) {
      perform(this.data);
    } else {
      perform();
    }

    this.broadcastWatches(fromOptimisticTransaction);
  };

  InMemoryCache.prototype.transformDocument = function (document) {
    if (this.addTypename) {
      var result = this.typenameDocumentCache.get(document);

      if (!result) {
        result = addTypenameToDocument(document);
        this.typenameDocumentCache.set(document, result);
        this.typenameDocumentCache.set(result, result);
      }

      return result;
    }

    return document;
  };

  InMemoryCache.prototype.broadcastWatches = function (fromOptimisticTransaction) {
    var _this = this;

    if (!this.txCount) {
      this.watches.forEach(function (c) {
        return _this.maybeBroadcastWatch(c, fromOptimisticTransaction);
      });
    }
  };

  InMemoryCache.prototype.broadcastWatch = function (c, fromOptimisticTransaction) {
    this.watchDep.dirty(c);
    this.watchDep(c);
    var diff = this.diff({
      query: c.query,
      variables: c.variables,
      optimistic: c.optimistic
    });

    if (c.optimistic && fromOptimisticTransaction) {
      diff.fromOptimisticTransaction = true;
    }

    c.callback(diff);
  };

  return InMemoryCache;
}(ApolloCache);

exports.InMemoryCache = InMemoryCache;

var LocalState = function () {
  function LocalState(_a) {
    var cache = _a.cache,
        client = _a.client,
        resolvers = _a.resolvers,
        fragmentMatcher = _a.fragmentMatcher;
    this.cache = cache;

    if (client) {
      this.client = client;
    }

    if (resolvers) {
      this.addResolvers(resolvers);
    }

    if (fragmentMatcher) {
      this.setFragmentMatcher(fragmentMatcher);
    }
  }

  LocalState.prototype.addResolvers = function (resolvers) {
    var _this = this;

    this.resolvers = this.resolvers || {};

    if (Array.isArray(resolvers)) {
      resolvers.forEach(function (resolverGroup) {
        _this.resolvers = mergeDeep(_this.resolvers, resolverGroup);
      });
    } else {
      this.resolvers = mergeDeep(this.resolvers, resolvers);
    }
  };

  LocalState.prototype.setResolvers = function (resolvers) {
    this.resolvers = {};
    this.addResolvers(resolvers);
  };

  LocalState.prototype.getResolvers = function () {
    return this.resolvers || {};
  };

  LocalState.prototype.runResolvers = function (_a) {
    var document = _a.document,
        remoteResult = _a.remoteResult,
        context = _a.context,
        variables = _a.variables,
        _b = _a.onlyRunForcedResolvers,
        onlyRunForcedResolvers = _b === void 0 ? false : _b;
    return __awaiter(this, void 0, void 0, function () {
      return __generator(this, function (_c) {
        if (document) {
          return [2, this.resolveDocument(document, remoteResult.data, context, variables, this.fragmentMatcher, onlyRunForcedResolvers).then(function (localResult) {
            return _assign(_assign({}, remoteResult), {
              data: localResult.result
            });
          })];
        }

        return [2, remoteResult];
      });
    });
  };

  LocalState.prototype.setFragmentMatcher = function (fragmentMatcher) {
    this.fragmentMatcher = fragmentMatcher;
  };

  LocalState.prototype.getFragmentMatcher = function () {
    return this.fragmentMatcher;
  };

  LocalState.prototype.clientQuery = function (document) {
    if (hasDirectives(['client'], document)) {
      if (this.resolvers) {
        return document;
      }
    }

    return null;
  };

  LocalState.prototype.serverQuery = function (document) {
    return removeClientSetsFromDocument(document);
  };

  LocalState.prototype.prepareContext = function (context) {
    var cache = this.cache;
    return _assign(_assign({}, context), {
      cache: cache,
      getCacheKey: function getCacheKey(obj) {
        return cache.identify(obj);
      }
    });
  };

  LocalState.prototype.addExportedVariables = function (document, variables, context) {
    if (variables === void 0) {
      variables = {};
    }

    if (context === void 0) {
      context = {};
    }

    return __awaiter(this, void 0, void 0, function () {
      return __generator(this, function (_a) {
        if (document) {
          return [2, this.resolveDocument(document, this.buildRootValueFromCache(document, variables) || {}, this.prepareContext(context), variables).then(function (data) {
            return _assign(_assign({}, variables), data.exportedVariables);
          })];
        }

        return [2, _assign({}, variables)];
      });
    });
  };

  LocalState.prototype.shouldForceResolvers = function (document) {
    var forceResolvers = false;
    (0, _visitor.visit)(document, {
      Directive: {
        enter: function enter(node) {
          if (node.name.value === 'client' && node.arguments) {
            forceResolvers = node.arguments.some(function (arg) {
              return arg.name.value === 'always' && arg.value.kind === 'BooleanValue' && arg.value.value === true;
            });

            if (forceResolvers) {
              return _visitor.BREAK;
            }
          }
        }
      }
    });
    return forceResolvers;
  };

  LocalState.prototype.buildRootValueFromCache = function (document, variables) {
    return this.cache.diff({
      query: buildQueryFromSelectionSet(document),
      variables: variables,
      returnPartialData: true,
      optimistic: false
    }).result;
  };

  LocalState.prototype.resolveDocument = function (document, rootValue, context, variables, fragmentMatcher, onlyRunForcedResolvers) {
    if (context === void 0) {
      context = {};
    }

    if (variables === void 0) {
      variables = {};
    }

    if (fragmentMatcher === void 0) {
      fragmentMatcher = function fragmentMatcher() {
        return true;
      };
    }

    if (onlyRunForcedResolvers === void 0) {
      onlyRunForcedResolvers = false;
    }

    return __awaiter(this, void 0, void 0, function () {
      var mainDefinition, fragments, fragmentMap, definitionOperation, defaultOperationType, _a, cache, client, execContext;

      return __generator(this, function (_b) {
        mainDefinition = getMainDefinition(document);
        fragments = getFragmentDefinitions(document);
        fragmentMap = createFragmentMap(fragments);
        definitionOperation = mainDefinition.operation;
        defaultOperationType = definitionOperation ? definitionOperation.charAt(0).toUpperCase() + definitionOperation.slice(1) : 'Query';
        _a = this, cache = _a.cache, client = _a.client;
        execContext = {
          fragmentMap: fragmentMap,
          context: _assign(_assign({}, context), {
            cache: cache,
            client: client
          }),
          variables: variables,
          fragmentMatcher: fragmentMatcher,
          defaultOperationType: defaultOperationType,
          exportedVariables: {},
          onlyRunForcedResolvers: onlyRunForcedResolvers
        };
        return [2, this.resolveSelectionSet(mainDefinition.selectionSet, rootValue, execContext).then(function (result) {
          return {
            result: result,
            exportedVariables: execContext.exportedVariables
          };
        })];
      });
    });
  };

  LocalState.prototype.resolveSelectionSet = function (selectionSet, rootValue, execContext) {
    return __awaiter(this, void 0, void 0, function () {
      var fragmentMap, context, variables, resultsToMerge, execute;

      var _this = this;

      return __generator(this, function (_a) {
        fragmentMap = execContext.fragmentMap, context = execContext.context, variables = execContext.variables;
        resultsToMerge = [rootValue];

        execute = function execute(selection) {
          return __awaiter(_this, void 0, void 0, function () {
            var fragment, typeCondition;
            return __generator(this, function (_a) {
              if (!shouldInclude(selection, variables)) {
                return [2];
              }

              if (isField(selection)) {
                return [2, this.resolveField(selection, rootValue, execContext).then(function (fieldResult) {
                  var _a;

                  if (typeof fieldResult !== 'undefined') {
                    resultsToMerge.push((_a = {}, _a[resultKeyNameFromField(selection)] = fieldResult, _a));
                  }
                })];
              }

              if (isInlineFragment(selection)) {
                fragment = selection;
              } else {
                fragment = fragmentMap[selection.name.value];
                process.env.NODE_ENV === "production" ? invariant(fragment, 11) : invariant(fragment, "No fragment named " + selection.name.value);
              }

              if (fragment && fragment.typeCondition) {
                typeCondition = fragment.typeCondition.name.value;

                if (execContext.fragmentMatcher(rootValue, typeCondition, context)) {
                  return [2, this.resolveSelectionSet(fragment.selectionSet, rootValue, execContext).then(function (fragmentResult) {
                    resultsToMerge.push(fragmentResult);
                  })];
                }
              }

              return [2];
            });
          });
        };

        return [2, Promise.all(selectionSet.selections.map(execute)).then(function () {
          return mergeDeepArray(resultsToMerge);
        })];
      });
    });
  };

  LocalState.prototype.resolveField = function (field, rootValue, execContext) {
    return __awaiter(this, void 0, void 0, function () {
      var variables, fieldName, aliasedFieldName, aliasUsed, defaultResult, resultPromise, resolverType, resolverMap, resolve;

      var _this = this;

      return __generator(this, function (_a) {
        variables = execContext.variables;
        fieldName = field.name.value;
        aliasedFieldName = resultKeyNameFromField(field);
        aliasUsed = fieldName !== aliasedFieldName;
        defaultResult = rootValue[aliasedFieldName] || rootValue[fieldName];
        resultPromise = Promise.resolve(defaultResult);

        if (!execContext.onlyRunForcedResolvers || this.shouldForceResolvers(field)) {
          resolverType = rootValue.__typename || execContext.defaultOperationType;
          resolverMap = this.resolvers && this.resolvers[resolverType];

          if (resolverMap) {
            resolve = resolverMap[aliasUsed ? fieldName : aliasedFieldName];

            if (resolve) {
              resultPromise = Promise.resolve(cacheSlot.withValue(this.cache, resolve, [rootValue, argumentsObjectFromField(field, variables), execContext.context, {
                field: field,
                fragmentMap: execContext.fragmentMap
              }]));
            }
          }
        }

        return [2, resultPromise.then(function (result) {
          if (result === void 0) {
            result = defaultResult;
          }

          if (field.directives) {
            field.directives.forEach(function (directive) {
              if (directive.name.value === 'export' && directive.arguments) {
                directive.arguments.forEach(function (arg) {
                  if (arg.name.value === 'as' && arg.value.kind === 'StringValue') {
                    execContext.exportedVariables[arg.value.value] = result;
                  }
                });
              }
            });
          }

          if (!field.selectionSet) {
            return result;
          }

          if (result == null) {
            return result;
          }

          if (Array.isArray(result)) {
            return _this.resolveSubSelectedArray(field, result, execContext);
          }

          if (field.selectionSet) {
            return _this.resolveSelectionSet(field.selectionSet, result, execContext);
          }
        })];
      });
    });
  };

  LocalState.prototype.resolveSubSelectedArray = function (field, result, execContext) {
    var _this = this;

    return Promise.all(result.map(function (item) {
      if (item === null) {
        return null;
      }

      if (Array.isArray(item)) {
        return _this.resolveSubSelectedArray(field, item, execContext);
      }

      if (field.selectionSet) {
        return _this.resolveSelectionSet(field.selectionSet, item, execContext);
      }
    }));
  };

  return LocalState;
}();

var destructiveMethodCounts = new (canUseWeakMap ? WeakMap : Map)();

function wrapDestructiveCacheMethod(cache, methodName) {
  var original = cache[methodName];

  if (typeof original === "function") {
    cache[methodName] = function () {
      destructiveMethodCounts.set(cache, (destructiveMethodCounts.get(cache) + 1) % 1e15);
      return original.apply(this, arguments);
    };
  }
}

function cancelNotifyTimeout(info) {
  if (info["notifyTimeout"]) {
    clearTimeout(info["notifyTimeout"]);
    info["notifyTimeout"] = void 0;
  }
}

var QueryInfo = function () {
  function QueryInfo(cache) {
    this.cache = cache;
    this.listeners = new Set();
    this.document = null;
    this.lastRequestId = 1;
    this.subscriptions = new Set();
    this.stopped = false;
    this.dirty = false;
    this.diff = null;
    this.observableQuery = null;

    if (!destructiveMethodCounts.has(cache)) {
      destructiveMethodCounts.set(cache, 0);
      wrapDestructiveCacheMethod(cache, "evict");
      wrapDestructiveCacheMethod(cache, "modify");
      wrapDestructiveCacheMethod(cache, "reset");
    }
  }

  QueryInfo.prototype.init = function (query) {
    var networkStatus = query.networkStatus || NetworkStatus.loading;

    if (this.variables && this.networkStatus !== NetworkStatus.loading && !equal(this.variables, query.variables)) {
      networkStatus = NetworkStatus.setVariables;
    }

    if (!equal(query.variables, this.variables)) {
      this.diff = null;
    }

    Object.assign(this, {
      document: query.document,
      variables: query.variables,
      networkError: null,
      graphQLErrors: this.graphQLErrors || [],
      networkStatus: networkStatus
    });

    if (query.observableQuery) {
      this.setObservableQuery(query.observableQuery);
    }

    if (query.lastRequestId) {
      this.lastRequestId = query.lastRequestId;
    }

    return this;
  };

  QueryInfo.prototype.reset = function () {
    cancelNotifyTimeout(this);
    this.diff = null;
    this.dirty = false;
  };

  QueryInfo.prototype.getDiff = function (variables) {
    if (variables === void 0) {
      variables = this.variables;
    }

    if (this.diff && equal(variables, this.variables)) {
      return this.diff;
    }

    this.updateWatch(this.variables = variables);
    return this.diff = this.cache.diff({
      query: this.document,
      variables: variables,
      returnPartialData: true,
      optimistic: true
    });
  };

  QueryInfo.prototype.setDiff = function (diff) {
    var _this = this;

    var oldDiff = this.diff;
    this.diff = diff;

    if (!this.dirty && (diff && diff.result) !== (oldDiff && oldDiff.result)) {
      this.dirty = true;

      if (!this.notifyTimeout) {
        this.notifyTimeout = setTimeout(function () {
          return _this.notify();
        }, 0);
      }
    }
  };

  QueryInfo.prototype.setObservableQuery = function (oq) {
    var _this = this;

    if (oq === this.observableQuery) return;

    if (this.oqListener) {
      this.listeners.delete(this.oqListener);
    }

    this.observableQuery = oq;

    if (oq) {
      oq["queryInfo"] = this;
      this.listeners.add(this.oqListener = function () {
        if (_this.getDiff().fromOptimisticTransaction) {
          oq["observe"]();
        } else {
          oq.reobserve();
        }
      });
    } else {
      delete this.oqListener;
    }
  };

  QueryInfo.prototype.notify = function () {
    var _this = this;

    cancelNotifyTimeout(this);

    if (this.shouldNotify()) {
      this.listeners.forEach(function (listener) {
        return listener(_this);
      });
    }

    this.dirty = false;
  };

  QueryInfo.prototype.shouldNotify = function () {
    if (!this.dirty || !this.listeners.size) {
      return false;
    }

    if (isNetworkRequestInFlight(this.networkStatus) && this.observableQuery) {
      var fetchPolicy = this.observableQuery.options.fetchPolicy;

      if (fetchPolicy !== "cache-only" && fetchPolicy !== "cache-and-network") {
        return false;
      }
    }

    return true;
  };

  QueryInfo.prototype.stop = function () {
    if (!this.stopped) {
      this.stopped = true;
      this.cancel();
      delete this.cancel;
      this.subscriptions.forEach(function (sub) {
        return sub.unsubscribe();
      });
      var oq = this.observableQuery;
      if (oq) oq.stopPolling();
    }
  };

  QueryInfo.prototype.cancel = function () {};

  QueryInfo.prototype.updateWatch = function (variables) {
    var _this = this;

    if (variables === void 0) {
      variables = this.variables;
    }

    var oq = this.observableQuery;

    if (oq && oq.options.fetchPolicy === "no-cache") {
      return;
    }

    if (!this.lastWatch || this.lastWatch.query !== this.document || !equal(variables, this.lastWatch.variables)) {
      this.cancel();
      this.cancel = this.cache.watch(this.lastWatch = {
        query: this.document,
        variables: variables,
        optimistic: true,
        callback: function callback(diff) {
          return _this.setDiff(diff);
        }
      });
    }
  };

  QueryInfo.prototype.shouldWrite = function (result, variables) {
    var lastWrite = this.lastWrite;
    return !(lastWrite && lastWrite.dmCount === destructiveMethodCounts.get(this.cache) && equal(variables, lastWrite.variables) && equal(result.data, lastWrite.result.data));
  };

  QueryInfo.prototype.markResult = function (result, options, allowCacheWrite) {
    var _this = this;

    this.graphQLErrors = isNonEmptyArray(result.errors) ? result.errors : [];
    this.reset();

    if (options.fetchPolicy === 'no-cache') {
      this.diff = {
        result: result.data,
        complete: true
      };
    } else if (!this.stopped && allowCacheWrite) {
      if (shouldWriteResult(result, options.errorPolicy)) {
        this.cache.performTransaction(function (cache) {
          if (_this.shouldWrite(result, options.variables)) {
            cache.writeQuery({
              query: _this.document,
              data: result.data,
              variables: options.variables
            });
            _this.lastWrite = {
              result: result,
              variables: options.variables,
              dmCount: destructiveMethodCounts.get(_this.cache)
            };
          } else {
            if (_this.diff && _this.diff.complete) {
              result.data = _this.diff.result;
              return;
            }
          }

          var diff = cache.diff({
            query: _this.document,
            variables: options.variables,
            returnPartialData: true,
            optimistic: true
          });

          if (!_this.stopped) {
            _this.updateWatch(options.variables);
          }

          _this.diff = diff;

          if (diff.complete) {
            result.data = diff.result;
          }
        });
      } else {
        this.lastWrite = void 0;
      }
    }
  };

  QueryInfo.prototype.markReady = function () {
    this.networkError = null;
    return this.networkStatus = NetworkStatus.ready;
  };

  QueryInfo.prototype.markError = function (error) {
    this.networkStatus = NetworkStatus.error;
    this.lastWrite = void 0;
    this.reset();

    if (error.graphQLErrors) {
      this.graphQLErrors = error.graphQLErrors;
    }

    if (error.networkError) {
      this.networkError = error.networkError;
    }

    return error;
  };

  return QueryInfo;
}();

function shouldWriteResult(result, errorPolicy) {
  if (errorPolicy === void 0) {
    errorPolicy = "none";
  }

  var ignoreErrors = errorPolicy === "ignore" || errorPolicy === "all";
  var writeWithErrors = !graphQLResultHasError(result);

  if (!writeWithErrors && ignoreErrors && result.data) {
    writeWithErrors = true;
  }

  return writeWithErrors;
}

var hasOwnProperty$2 = Object.prototype.hasOwnProperty;

var QueryManager = function () {
  function QueryManager(_a) {
    var cache = _a.cache,
        link = _a.link,
        _b = _a.queryDeduplication,
        queryDeduplication = _b === void 0 ? false : _b,
        onBroadcast = _a.onBroadcast,
        _c = _a.ssrMode,
        ssrMode = _c === void 0 ? false : _c,
        _d = _a.clientAwareness,
        clientAwareness = _d === void 0 ? {} : _d,
        localState = _a.localState,
        assumeImmutableResults = _a.assumeImmutableResults;
    this.clientAwareness = {};
    this.queries = new Map();
    this.fetchCancelFns = new Map();
    this.transformCache = new (canUseWeakMap ? WeakMap : Map)();
    this.queryIdCounter = 1;
    this.requestIdCounter = 1;
    this.mutationIdCounter = 1;
    this.inFlightLinkObservables = new Map();
    this.cache = cache;
    this.link = link;
    this.queryDeduplication = queryDeduplication;
    this.clientAwareness = clientAwareness;
    this.localState = localState || new LocalState({
      cache: cache
    });
    this.ssrMode = ssrMode;
    this.assumeImmutableResults = !!assumeImmutableResults;

    if (this.onBroadcast = onBroadcast) {
      this.mutationStore = Object.create(null);
    }
  }

  QueryManager.prototype.stop = function () {
    var _this = this;

    this.queries.forEach(function (_info, queryId) {
      _this.stopQueryNoBroadcast(queryId);
    });
    this.cancelPendingFetches(process.env.NODE_ENV === "production" ? new InvariantError(12) : new InvariantError('QueryManager stopped while query was in flight'));
  };

  QueryManager.prototype.cancelPendingFetches = function (error) {
    this.fetchCancelFns.forEach(function (cancel) {
      return cancel(error);
    });
    this.fetchCancelFns.clear();
  };

  QueryManager.prototype.mutate = function (_a) {
    var mutation = _a.mutation,
        variables = _a.variables,
        optimisticResponse = _a.optimisticResponse,
        updateQueries = _a.updateQueries,
        _b = _a.refetchQueries,
        refetchQueries = _b === void 0 ? [] : _b,
        _c = _a.awaitRefetchQueries,
        awaitRefetchQueries = _c === void 0 ? false : _c,
        updateWithProxyFn = _a.update,
        _d = _a.errorPolicy,
        errorPolicy = _d === void 0 ? 'none' : _d,
        fetchPolicy = _a.fetchPolicy,
        _e = _a.context,
        context = _e === void 0 ? {} : _e;
    return __awaiter(this, void 0, void 0, function () {
      var mutationId, mutationStoreValue, self;
      return __generator(this, function (_f) {
        switch (_f.label) {
          case 0:
            process.env.NODE_ENV === "production" ? invariant(mutation, 13) : invariant(mutation, 'mutation option is required. You must specify your GraphQL document in the mutation option.');
            process.env.NODE_ENV === "production" ? invariant(!fetchPolicy || fetchPolicy === 'no-cache', 14) : invariant(!fetchPolicy || fetchPolicy === 'no-cache', "Mutations only support a 'no-cache' fetchPolicy. If you don't want to disable the cache, remove your fetchPolicy setting to proceed with the default mutation behavior.");
            mutationId = this.generateMutationId();
            mutation = this.transform(mutation).document;
            variables = this.getVariables(mutation, variables);
            if (!this.transform(mutation).hasClientExports) return [3, 2];
            return [4, this.localState.addExportedVariables(mutation, variables, context)];

          case 1:
            variables = _f.sent();
            _f.label = 2;

          case 2:
            mutationStoreValue = this.mutationStore && (this.mutationStore[mutationId] = {
              mutation: mutation,
              variables: variables,
              loading: true,
              error: null
            });

            if (optimisticResponse) {
              this.markMutationOptimistic(optimisticResponse, {
                mutationId: mutationId,
                document: mutation,
                variables: variables,
                errorPolicy: errorPolicy,
                updateQueries: updateQueries,
                update: updateWithProxyFn
              });
            }

            this.broadcastQueries();
            self = this;
            return [2, new Promise(function (resolve, reject) {
              var storeResult;
              var error;
              self.getObservableFromLink(mutation, _assign(_assign({}, context), {
                optimisticResponse: optimisticResponse
              }), variables, false).subscribe({
                next: function next(result) {
                  if (graphQLResultHasError(result) && errorPolicy === 'none') {
                    error = new ApolloError({
                      graphQLErrors: result.errors
                    });
                    return;
                  }

                  if (mutationStoreValue) {
                    mutationStoreValue.loading = false;
                    mutationStoreValue.error = null;
                  }

                  if (fetchPolicy !== 'no-cache') {
                    try {
                      self.markMutationResult({
                        mutationId: mutationId,
                        result: result,
                        document: mutation,
                        variables: variables,
                        errorPolicy: errorPolicy,
                        updateQueries: updateQueries,
                        update: updateWithProxyFn
                      });
                    } catch (e) {
                      error = new ApolloError({
                        networkError: e
                      });
                      return;
                    }
                  }

                  storeResult = result;
                },
                error: function error(err) {
                  if (mutationStoreValue) {
                    mutationStoreValue.loading = false;
                    mutationStoreValue.error = err;
                  }

                  if (optimisticResponse) {
                    self.cache.removeOptimistic(mutationId);
                  }

                  self.broadcastQueries();
                  reject(new ApolloError({
                    networkError: err
                  }));
                },
                complete: function complete() {
                  if (error && mutationStoreValue) {
                    mutationStoreValue.loading = false;
                    mutationStoreValue.error = error;
                  }

                  if (optimisticResponse) {
                    self.cache.removeOptimistic(mutationId);
                  }

                  self.broadcastQueries();

                  if (error) {
                    reject(error);
                    return;
                  }

                  if (typeof refetchQueries === 'function') {
                    refetchQueries = refetchQueries(storeResult);
                  }

                  var refetchQueryPromises = [];

                  if (isNonEmptyArray(refetchQueries)) {
                    refetchQueries.forEach(function (refetchQuery) {
                      if (typeof refetchQuery === 'string') {
                        self.queries.forEach(function (_a) {
                          var observableQuery = _a.observableQuery;

                          if (observableQuery && observableQuery.queryName === refetchQuery) {
                            refetchQueryPromises.push(observableQuery.refetch());
                          }
                        });
                      } else {
                        var queryOptions = {
                          query: refetchQuery.query,
                          variables: refetchQuery.variables,
                          fetchPolicy: 'network-only'
                        };

                        if (refetchQuery.context) {
                          queryOptions.context = refetchQuery.context;
                        }

                        refetchQueryPromises.push(self.query(queryOptions));
                      }
                    });
                  }

                  Promise.all(awaitRefetchQueries ? refetchQueryPromises : []).then(function () {
                    if (errorPolicy === 'ignore' && storeResult && graphQLResultHasError(storeResult)) {
                      delete storeResult.errors;
                    }

                    resolve(storeResult);
                  }, reject);
                }
              });
            })];
        }
      });
    });
  };

  QueryManager.prototype.markMutationResult = function (mutation, cache) {
    var _this = this;

    if (cache === void 0) {
      cache = this.cache;
    }

    if (shouldWriteResult(mutation.result, mutation.errorPolicy)) {
      var cacheWrites_1 = [{
        result: mutation.result.data,
        dataId: 'ROOT_MUTATION',
        query: mutation.document,
        variables: mutation.variables
      }];
      var updateQueries_1 = mutation.updateQueries;

      if (updateQueries_1) {
        this.queries.forEach(function (_a, queryId) {
          var observableQuery = _a.observableQuery;
          var queryName = observableQuery && observableQuery.queryName;

          if (!queryName || !hasOwnProperty$2.call(updateQueries_1, queryName)) {
            return;
          }

          var updater = updateQueries_1[queryName];

          var _b = _this.queries.get(queryId),
              document = _b.document,
              variables = _b.variables;

          var _c = cache.diff({
            query: document,
            variables: variables,
            returnPartialData: true,
            optimistic: false
          }),
              currentQueryResult = _c.result,
              complete = _c.complete;

          if (complete && currentQueryResult) {
            var nextQueryResult = updater(currentQueryResult, {
              mutationResult: mutation.result,
              queryName: document && getOperationName(document) || void 0,
              queryVariables: variables
            });

            if (nextQueryResult) {
              cacheWrites_1.push({
                result: nextQueryResult,
                dataId: 'ROOT_QUERY',
                query: document,
                variables: variables
              });
            }
          }
        });
      }

      cache.performTransaction(function (c) {
        cacheWrites_1.forEach(function (write) {
          return c.write(write);
        });
        var update = mutation.update;

        if (update) {
          update(c, mutation.result);
        }
      }, null);
    }
  };

  QueryManager.prototype.markMutationOptimistic = function (optimisticResponse, mutation) {
    var _this = this;

    var data = typeof optimisticResponse === "function" ? optimisticResponse(mutation.variables) : optimisticResponse;
    return this.cache.recordOptimisticTransaction(function (cache) {
      try {
        _this.markMutationResult(_assign(_assign({}, mutation), {
          result: {
            data: data
          }
        }), cache);
      } catch (error) {
        process.env.NODE_ENV === "production" || invariant.error(error);
      }
    }, mutation.mutationId);
  };

  QueryManager.prototype.fetchQuery = function (queryId, options, networkStatus) {
    return this.fetchQueryObservable(queryId, options, networkStatus).promise;
  };

  QueryManager.prototype.getQueryStore = function () {
    var store = Object.create(null);
    this.queries.forEach(function (info, queryId) {
      store[queryId] = {
        variables: info.variables,
        networkStatus: info.networkStatus,
        networkError: info.networkError,
        graphQLErrors: info.graphQLErrors
      };
    });
    return store;
  };

  QueryManager.prototype.resetErrors = function (queryId) {
    var queryInfo = this.queries.get(queryId);

    if (queryInfo) {
      queryInfo.networkError = undefined;
      queryInfo.graphQLErrors = [];
    }
  };

  QueryManager.prototype.transform = function (document) {
    var transformCache = this.transformCache;

    if (!transformCache.has(document)) {
      var transformed = this.cache.transformDocument(document);
      var forLink = removeConnectionDirectiveFromDocument(this.cache.transformForLink(transformed));
      var clientQuery = this.localState.clientQuery(transformed);
      var serverQuery = forLink && this.localState.serverQuery(forLink);
      var cacheEntry_1 = {
        document: transformed,
        hasClientExports: hasClientExports(transformed),
        hasForcedResolvers: this.localState.shouldForceResolvers(transformed),
        clientQuery: clientQuery,
        serverQuery: serverQuery,
        defaultVars: getDefaultValues(getOperationDefinition(transformed))
      };

      var add = function add(doc) {
        if (doc && !transformCache.has(doc)) {
          transformCache.set(doc, cacheEntry_1);
        }
      };

      add(document);
      add(transformed);
      add(clientQuery);
      add(serverQuery);
    }

    return transformCache.get(document);
  };

  QueryManager.prototype.getVariables = function (document, variables) {
    return _assign(_assign({}, this.transform(document).defaultVars), variables);
  };

  QueryManager.prototype.watchQuery = function (options) {
    options = _assign(_assign({}, options), {
      variables: this.getVariables(options.query, options.variables)
    });

    if (typeof options.notifyOnNetworkStatusChange === 'undefined') {
      options.notifyOnNetworkStatusChange = false;
    }

    var queryInfo = new QueryInfo(this.cache);
    var observable = new ObservableQuery({
      queryManager: this,
      queryInfo: queryInfo,
      options: options
    });
    this.queries.set(observable.queryId, queryInfo);
    queryInfo.init({
      document: options.query,
      observableQuery: observable,
      variables: options.variables
    });
    return observable;
  };

  QueryManager.prototype.query = function (options) {
    var _this = this;

    process.env.NODE_ENV === "production" ? invariant(options.query, 15) : invariant(options.query, 'query option is required. You must specify your GraphQL document ' + 'in the query option.');
    process.env.NODE_ENV === "production" ? invariant(options.query.kind === 'Document', 16) : invariant(options.query.kind === 'Document', 'You must wrap the query string in a "gql" tag.');
    process.env.NODE_ENV === "production" ? invariant(!options.returnPartialData, 17) : invariant(!options.returnPartialData, 'returnPartialData option only supported on watchQuery.');
    process.env.NODE_ENV === "production" ? invariant(!options.pollInterval, 18) : invariant(!options.pollInterval, 'pollInterval option only supported on watchQuery.');
    var queryId = this.generateQueryId();
    return this.fetchQuery(queryId, options).finally(function () {
      return _this.stopQuery(queryId);
    });
  };

  QueryManager.prototype.generateQueryId = function () {
    return String(this.queryIdCounter++);
  };

  QueryManager.prototype.generateRequestId = function () {
    return this.requestIdCounter++;
  };

  QueryManager.prototype.generateMutationId = function () {
    return String(this.mutationIdCounter++);
  };

  QueryManager.prototype.stopQueryInStore = function (queryId) {
    this.stopQueryInStoreNoBroadcast(queryId);
    this.broadcastQueries();
  };

  QueryManager.prototype.stopQueryInStoreNoBroadcast = function (queryId) {
    var queryInfo = this.queries.get(queryId);
    if (queryInfo) queryInfo.stop();
  };

  QueryManager.prototype.clearStore = function () {
    this.cancelPendingFetches(process.env.NODE_ENV === "production" ? new InvariantError(19) : new InvariantError('Store reset while query was in flight (not completed in link chain)'));
    this.queries.forEach(function (queryInfo) {
      if (queryInfo.observableQuery) {
        queryInfo.networkStatus = NetworkStatus.loading;
      } else {
        queryInfo.stop();
      }
    });

    if (this.mutationStore) {
      this.mutationStore = Object.create(null);
    }

    return this.cache.reset();
  };

  QueryManager.prototype.resetStore = function () {
    var _this = this;

    return this.clearStore().then(function () {
      return _this.reFetchObservableQueries();
    });
  };

  QueryManager.prototype.reFetchObservableQueries = function (includeStandby) {
    var _this = this;

    if (includeStandby === void 0) {
      includeStandby = false;
    }

    var observableQueryPromises = [];
    this.queries.forEach(function (_a, queryId) {
      var observableQuery = _a.observableQuery;

      if (observableQuery && observableQuery.hasObservers()) {
        var fetchPolicy = observableQuery.options.fetchPolicy;
        observableQuery.resetLastResults();

        if (fetchPolicy !== 'cache-only' && (includeStandby || fetchPolicy !== 'standby')) {
          observableQueryPromises.push(observableQuery.refetch());
        }

        _this.getQuery(queryId).setDiff(null);
      }
    });
    this.broadcastQueries();
    return Promise.all(observableQueryPromises);
  };

  QueryManager.prototype.setObservableQuery = function (observableQuery) {
    this.getQuery(observableQuery.queryId).setObservableQuery(observableQuery);
  };

  QueryManager.prototype.startGraphQLSubscription = function (_a) {
    var _this = this;

    var query = _a.query,
        fetchPolicy = _a.fetchPolicy,
        errorPolicy = _a.errorPolicy,
        variables = _a.variables,
        _b = _a.context,
        context = _b === void 0 ? {} : _b;
    query = this.transform(query).document;
    variables = this.getVariables(query, variables);

    var makeObservable = function makeObservable(variables) {
      return _this.getObservableFromLink(query, context, variables, false).map(function (result) {
        if (fetchPolicy !== 'no-cache') {
          if (shouldWriteResult(result, errorPolicy)) {
            _this.cache.write({
              query: query,
              result: result.data,
              dataId: 'ROOT_SUBSCRIPTION',
              variables: variables
            });
          }

          _this.broadcastQueries();
        }

        if (graphQLResultHasError(result)) {
          throw new ApolloError({
            graphQLErrors: result.errors
          });
        }

        return result;
      });
    };

    if (this.transform(query).hasClientExports) {
      var observablePromise_1 = this.localState.addExportedVariables(query, variables, context).then(makeObservable);
      return new Observable(function (observer) {
        var sub = null;
        observablePromise_1.then(function (observable) {
          return sub = observable.subscribe(observer);
        }, observer.error);
        return function () {
          return sub && sub.unsubscribe();
        };
      });
    }

    return makeObservable(variables);
  };

  QueryManager.prototype.stopQuery = function (queryId) {
    this.stopQueryNoBroadcast(queryId);
    this.broadcastQueries();
  };

  QueryManager.prototype.stopQueryNoBroadcast = function (queryId) {
    this.stopQueryInStoreNoBroadcast(queryId);
    this.removeQuery(queryId);
  };

  QueryManager.prototype.removeQuery = function (queryId) {
    this.fetchCancelFns.delete(queryId);
    this.getQuery(queryId).stop();
    this.queries.delete(queryId);
  };

  QueryManager.prototype.broadcastQueries = function () {
    if (this.onBroadcast) this.onBroadcast();
    this.queries.forEach(function (info) {
      return info.notify();
    });
  };

  QueryManager.prototype.getLocalState = function () {
    return this.localState;
  };

  QueryManager.prototype.getObservableFromLink = function (query, context, variables, deduplication) {
    var _this = this;

    var _a;

    if (deduplication === void 0) {
      deduplication = (_a = context === null || context === void 0 ? void 0 : context.queryDeduplication) !== null && _a !== void 0 ? _a : this.queryDeduplication;
    }

    var observable;
    var serverQuery = this.transform(query).serverQuery;

    if (serverQuery) {
      var _b = this,
          inFlightLinkObservables_1 = _b.inFlightLinkObservables,
          link = _b.link;

      var operation = {
        query: serverQuery,
        variables: variables,
        operationName: getOperationName(serverQuery) || void 0,
        context: this.prepareContext(_assign(_assign({}, context), {
          forceFetch: !deduplication
        }))
      };
      context = operation.context;

      if (deduplication) {
        var byVariables_1 = inFlightLinkObservables_1.get(serverQuery) || new Map();
        inFlightLinkObservables_1.set(serverQuery, byVariables_1);
        var varJson_1 = JSON.stringify(variables);
        observable = byVariables_1.get(varJson_1);

        if (!observable) {
          var concast = new Concast([execute(link, operation)]);
          byVariables_1.set(varJson_1, observable = concast);
          concast.cleanup(function () {
            if (byVariables_1.delete(varJson_1) && byVariables_1.size < 1) {
              inFlightLinkObservables_1.delete(serverQuery);
            }
          });
        }
      } else {
        observable = new Concast([execute(link, operation)]);
      }
    } else {
      observable = new Concast([Observable.of({
        data: {}
      })]);
      context = this.prepareContext(context);
    }

    var clientQuery = this.transform(query).clientQuery;

    if (clientQuery) {
      observable = asyncMap(observable, function (result) {
        return _this.localState.runResolvers({
          document: clientQuery,
          remoteResult: result,
          context: context,
          variables: variables
        });
      });
    }

    return observable;
  };

  QueryManager.prototype.getResultsFromLink = function (queryInfo, allowCacheWrite, options) {
    var lastRequestId = queryInfo.lastRequestId;
    return asyncMap(this.getObservableFromLink(queryInfo.document, options.context, options.variables), function (result) {
      var hasErrors = isNonEmptyArray(result.errors);

      if (lastRequestId >= queryInfo.lastRequestId) {
        if (hasErrors && options.errorPolicy === "none") {
          throw queryInfo.markError(new ApolloError({
            graphQLErrors: result.errors
          }));
        }

        queryInfo.markResult(result, options, allowCacheWrite);
        queryInfo.markReady();
      }

      var aqr = {
        data: result.data,
        loading: false,
        networkStatus: queryInfo.networkStatus || NetworkStatus.ready
      };

      if (hasErrors && options.errorPolicy !== "ignore") {
        aqr.errors = result.errors;
      }

      return aqr;
    }, function (networkError) {
      var error = isApolloError(networkError) ? networkError : new ApolloError({
        networkError: networkError
      });

      if (lastRequestId >= queryInfo.lastRequestId) {
        queryInfo.markError(error);
      }

      throw error;
    });
  };

  QueryManager.prototype.fetchQueryObservable = function (queryId, options, networkStatus) {
    var _this = this;

    if (networkStatus === void 0) {
      networkStatus = NetworkStatus.loading;
    }

    var query = this.transform(options.query).document;
    var variables = this.getVariables(query, options.variables);
    var queryInfo = this.getQuery(queryId);
    var oldNetworkStatus = queryInfo.networkStatus;
    var _a = options.fetchPolicy,
        fetchPolicy = _a === void 0 ? "cache-first" : _a,
        _b = options.errorPolicy,
        errorPolicy = _b === void 0 ? "none" : _b,
        _c = options.returnPartialData,
        returnPartialData = _c === void 0 ? false : _c,
        _d = options.notifyOnNetworkStatusChange,
        notifyOnNetworkStatusChange = _d === void 0 ? false : _d,
        _e = options.context,
        context = _e === void 0 ? {} : _e;
    var mightUseNetwork = fetchPolicy === "cache-first" || fetchPolicy === "cache-and-network" || fetchPolicy === "network-only" || fetchPolicy === "no-cache";

    if (mightUseNetwork && notifyOnNetworkStatusChange && typeof oldNetworkStatus === "number" && oldNetworkStatus !== networkStatus && isNetworkRequestInFlight(networkStatus)) {
      if (fetchPolicy !== "cache-first") {
        fetchPolicy = "cache-and-network";
      }

      returnPartialData = true;
    }

    var normalized = Object.assign({}, options, {
      query: query,
      variables: variables,
      fetchPolicy: fetchPolicy,
      errorPolicy: errorPolicy,
      returnPartialData: returnPartialData,
      notifyOnNetworkStatusChange: notifyOnNetworkStatusChange,
      context: context
    });

    var fromVariables = function fromVariables(variables) {
      normalized.variables = variables;
      return _this.fetchQueryByPolicy(queryInfo, normalized, networkStatus);
    };

    this.fetchCancelFns.set(queryId, function (reason) {
      Promise.resolve().then(function () {
        return concast.cancel(reason);
      });
    });
    var concast = new Concast(this.transform(normalized.query).hasClientExports ? this.localState.addExportedVariables(normalized.query, normalized.variables, normalized.context).then(fromVariables) : fromVariables(normalized.variables));
    concast.cleanup(function () {
      _this.fetchCancelFns.delete(queryId);

      var nextFetchPolicy = options.nextFetchPolicy;

      if (nextFetchPolicy) {
        options.nextFetchPolicy = void 0;
        options.fetchPolicy = typeof nextFetchPolicy === "function" ? nextFetchPolicy.call(options, options.fetchPolicy || "cache-first") : nextFetchPolicy;
      }
    });
    return concast;
  };

  QueryManager.prototype.fetchQueryByPolicy = function (queryInfo, options, networkStatus) {
    var _this = this;

    var query = options.query,
        variables = options.variables,
        fetchPolicy = options.fetchPolicy,
        errorPolicy = options.errorPolicy,
        returnPartialData = options.returnPartialData,
        context = options.context;
    queryInfo.init({
      document: query,
      variables: variables,
      lastRequestId: this.generateRequestId(),
      networkStatus: networkStatus
    });

    var readCache = function readCache() {
      return queryInfo.getDiff(variables);
    };

    var resultsFromCache = function resultsFromCache(diff, networkStatus) {
      if (networkStatus === void 0) {
        networkStatus = queryInfo.networkStatus || NetworkStatus.loading;
      }

      var data = diff.result;

      if (process.env.NODE_ENV !== 'production' && isNonEmptyArray(diff.missing) && !equal(data, {}) && !returnPartialData) {
        process.env.NODE_ENV === "production" || invariant.warn("Missing cache result fields: " + diff.missing.map(function (m) {
          return m.path.join('.');
        }).join(', '), diff.missing);
      }

      var fromData = function fromData(data) {
        return Observable.of(_assign({
          data: data,
          loading: isNetworkRequestInFlight(networkStatus),
          networkStatus: networkStatus
        }, diff.complete ? null : {
          partial: true
        }));
      };

      if (_this.transform(query).hasForcedResolvers) {
        return _this.localState.runResolvers({
          document: query,
          remoteResult: {
            data: data
          },
          context: context,
          variables: variables,
          onlyRunForcedResolvers: true
        }).then(function (resolved) {
          return fromData(resolved.data);
        });
      }

      return fromData(data);
    };

    var resultsFromLink = function resultsFromLink(allowCacheWrite) {
      return _this.getResultsFromLink(queryInfo, allowCacheWrite, {
        variables: variables,
        context: context,
        fetchPolicy: fetchPolicy,
        errorPolicy: errorPolicy
      });
    };

    switch (fetchPolicy) {
      default:
      case "cache-first":
        {
          var diff = readCache();

          if (diff.complete) {
            return [resultsFromCache(diff, queryInfo.markReady())];
          }

          if (returnPartialData) {
            return [resultsFromCache(diff), resultsFromLink(true)];
          }

          return [resultsFromLink(true)];
        }

      case "cache-and-network":
        {
          var diff = readCache();

          if (diff.complete || returnPartialData) {
            return [resultsFromCache(diff), resultsFromLink(true)];
          }

          return [resultsFromLink(true)];
        }

      case "cache-only":
        return [resultsFromCache(readCache(), queryInfo.markReady())];

      case "network-only":
        return [resultsFromLink(true)];

      case "no-cache":
        return [resultsFromLink(false)];

      case "standby":
        return [];
    }
  };

  QueryManager.prototype.getQuery = function (queryId) {
    if (queryId && !this.queries.has(queryId)) {
      this.queries.set(queryId, new QueryInfo(this.cache));
    }

    return this.queries.get(queryId);
  };

  QueryManager.prototype.prepareContext = function (context) {
    if (context === void 0) {
      context = {};
    }

    var newContext = this.localState.prepareContext(context);
    return _assign(_assign({}, newContext), {
      clientAwareness: this.clientAwareness
    });
  };

  return QueryManager;
}();

var hasSuggestedDevtools = false;

function mergeOptions(defaults, options) {
  return compact(defaults, options, options.variables && {
    variables: _assign(_assign({}, defaults.variables), options.variables)
  });
}

var ApolloClient = function () {
  function ApolloClient(options) {
    var _this = this;

    this.defaultOptions = {};
    this.resetStoreCallbacks = [];
    this.clearStoreCallbacks = [];
    var uri = options.uri,
        credentials = options.credentials,
        headers = options.headers,
        cache = options.cache,
        _a = options.ssrMode,
        ssrMode = _a === void 0 ? false : _a,
        _b = options.ssrForceFetchDelay,
        ssrForceFetchDelay = _b === void 0 ? 0 : _b,
        _c = options.connectToDevTools,
        connectToDevTools = _c === void 0 ? typeof window === 'object' && !window.__APOLLO_CLIENT__ && process.env.NODE_ENV !== 'production' : _c,
        _d = options.queryDeduplication,
        queryDeduplication = _d === void 0 ? true : _d,
        defaultOptions = options.defaultOptions,
        _e = options.assumeImmutableResults,
        assumeImmutableResults = _e === void 0 ? false : _e,
        resolvers = options.resolvers,
        typeDefs = options.typeDefs,
        fragmentMatcher = options.fragmentMatcher,
        clientAwarenessName = options.name,
        clientAwarenessVersion = options.version;
    var link = options.link;

    if (!link) {
      link = uri ? new HttpLink({
        uri: uri,
        credentials: credentials,
        headers: headers
      }) : ApolloLink.empty();
    }

    if (!cache) {
      throw process.env.NODE_ENV === "production" ? new InvariantError(9) : new InvariantError("To initialize Apollo Client, you must specify a 'cache' property " + "in the options object. \n" + "For more information, please visit: https://go.apollo.dev/c/docs");
    }

    this.link = link;
    this.cache = cache;
    this.disableNetworkFetches = ssrMode || ssrForceFetchDelay > 0;
    this.queryDeduplication = queryDeduplication;
    this.defaultOptions = defaultOptions || {};
    this.typeDefs = typeDefs;

    if (ssrForceFetchDelay) {
      setTimeout(function () {
        return _this.disableNetworkFetches = false;
      }, ssrForceFetchDelay);
    }

    this.watchQuery = this.watchQuery.bind(this);
    this.query = this.query.bind(this);
    this.mutate = this.mutate.bind(this);
    this.resetStore = this.resetStore.bind(this);
    this.reFetchObservableQueries = this.reFetchObservableQueries.bind(this);

    if (connectToDevTools && typeof window === 'object') {
      window.__APOLLO_CLIENT__ = this;
    }

    if (!hasSuggestedDevtools && process.env.NODE_ENV !== 'production') {
      hasSuggestedDevtools = true;

      if (typeof window !== 'undefined' && window.document && window.top === window.self && !window.__APOLLO_DEVTOOLS_GLOBAL_HOOK__) {
        var nav = window.navigator;
        var ua = nav && nav.userAgent;
        var url = void 0;

        if (typeof ua === "string") {
          if (ua.indexOf("Chrome/") > -1) {
            url = "https://chrome.google.com/webstore/detail/" + "apollo-client-developer-t/jdkknkkbebbapilgoeccciglkfbmbnfm";
          } else if (ua.indexOf("Firefox/") > -1) {
            url = "https://addons.mozilla.org/en-US/firefox/addon/apollo-developer-tools/";
          }
        }

        if (url) {
          invariant.log("Download the Apollo DevTools for a better development " + "experience: " + url);
        }
      }
    }

    this.version = version;
    this.localState = new LocalState({
      cache: cache,
      client: this,
      resolvers: resolvers,
      fragmentMatcher: fragmentMatcher
    });
    this.queryManager = new QueryManager({
      cache: this.cache,
      link: this.link,
      queryDeduplication: queryDeduplication,
      ssrMode: ssrMode,
      clientAwareness: {
        name: clientAwarenessName,
        version: clientAwarenessVersion
      },
      localState: this.localState,
      assumeImmutableResults: assumeImmutableResults,
      onBroadcast: connectToDevTools ? function () {
        if (_this.devToolsHookCb) {
          _this.devToolsHookCb({
            action: {},
            state: {
              queries: _this.queryManager.getQueryStore(),
              mutations: _this.queryManager.mutationStore || {}
            },
            dataWithOptimisticResults: _this.cache.extract(true)
          });
        }
      } : void 0
    });
  }

  ApolloClient.prototype.stop = function () {
    this.queryManager.stop();
  };

  ApolloClient.prototype.watchQuery = function (options) {
    if (this.defaultOptions.watchQuery) {
      options = mergeOptions(this.defaultOptions.watchQuery, options);
    }

    if (this.disableNetworkFetches && (options.fetchPolicy === 'network-only' || options.fetchPolicy === 'cache-and-network')) {
      options = _assign(_assign({}, options), {
        fetchPolicy: 'cache-first'
      });
    }

    return this.queryManager.watchQuery(options);
  };

  ApolloClient.prototype.query = function (options) {
    if (this.defaultOptions.query) {
      options = mergeOptions(this.defaultOptions.query, options);
    }

    process.env.NODE_ENV === "production" ? invariant(options.fetchPolicy !== 'cache-and-network', 10) : invariant(options.fetchPolicy !== 'cache-and-network', 'The cache-and-network fetchPolicy does not work with client.query, because ' + 'client.query can only return a single result. Please use client.watchQuery ' + 'to receive multiple results from the cache and the network, or consider ' + 'using a different fetchPolicy, such as cache-first or network-only.');

    if (this.disableNetworkFetches && options.fetchPolicy === 'network-only') {
      options = _assign(_assign({}, options), {
        fetchPolicy: 'cache-first'
      });
    }

    return this.queryManager.query(options);
  };

  ApolloClient.prototype.mutate = function (options) {
    if (this.defaultOptions.mutate) {
      options = mergeOptions(this.defaultOptions.mutate, options);
    }

    return this.queryManager.mutate(options);
  };

  ApolloClient.prototype.subscribe = function (options) {
    return this.queryManager.startGraphQLSubscription(options);
  };

  ApolloClient.prototype.readQuery = function (options, optimistic) {
    if (optimistic === void 0) {
      optimistic = false;
    }

    return this.cache.readQuery(options, optimistic);
  };

  ApolloClient.prototype.readFragment = function (options, optimistic) {
    if (optimistic === void 0) {
      optimistic = false;
    }

    return this.cache.readFragment(options, optimistic);
  };

  ApolloClient.prototype.writeQuery = function (options) {
    this.cache.writeQuery(options);
    this.queryManager.broadcastQueries();
  };

  ApolloClient.prototype.writeFragment = function (options) {
    this.cache.writeFragment(options);
    this.queryManager.broadcastQueries();
  };

  ApolloClient.prototype.__actionHookForDevTools = function (cb) {
    this.devToolsHookCb = cb;
  };

  ApolloClient.prototype.__requestRaw = function (payload) {
    return execute(this.link, payload);
  };

  ApolloClient.prototype.resetStore = function () {
    var _this = this;

    return Promise.resolve().then(function () {
      return _this.queryManager.clearStore();
    }).then(function () {
      return Promise.all(_this.resetStoreCallbacks.map(function (fn) {
        return fn();
      }));
    }).then(function () {
      return _this.reFetchObservableQueries();
    });
  };

  ApolloClient.prototype.clearStore = function () {
    var _this = this;

    return Promise.resolve().then(function () {
      return _this.queryManager.clearStore();
    }).then(function () {
      return Promise.all(_this.clearStoreCallbacks.map(function (fn) {
        return fn();
      }));
    });
  };

  ApolloClient.prototype.onResetStore = function (cb) {
    var _this = this;

    this.resetStoreCallbacks.push(cb);
    return function () {
      _this.resetStoreCallbacks = _this.resetStoreCallbacks.filter(function (c) {
        return c !== cb;
      });
    };
  };

  ApolloClient.prototype.onClearStore = function (cb) {
    var _this = this;

    this.clearStoreCallbacks.push(cb);
    return function () {
      _this.clearStoreCallbacks = _this.clearStoreCallbacks.filter(function (c) {
        return c !== cb;
      });
    };
  };

  ApolloClient.prototype.reFetchObservableQueries = function (includeStandby) {
    return this.queryManager.reFetchObservableQueries(includeStandby);
  };

  ApolloClient.prototype.extract = function (optimistic) {
    return this.cache.extract(optimistic);
  };

  ApolloClient.prototype.restore = function (serializedState) {
    return this.cache.restore(serializedState);
  };

  ApolloClient.prototype.addResolvers = function (resolvers) {
    this.localState.addResolvers(resolvers);
  };

  ApolloClient.prototype.setResolvers = function (resolvers) {
    this.localState.setResolvers(resolvers);
  };

  ApolloClient.prototype.getResolvers = function () {
    return this.localState.getResolvers();
  };

  ApolloClient.prototype.setLocalStateFragmentMatcher = function (fragmentMatcher) {
    this.localState.setFragmentMatcher(fragmentMatcher);
  };

  ApolloClient.prototype.setLink = function (newLink) {
    this.link = this.queryManager.link = newLink;
  };

  return ApolloClient;
}();

exports.ApolloClient = ApolloClient;
var cache = new (canUseWeakMap ? WeakMap : Map)();

function getApolloContext() {
  var context = cache.get(_react.default.createContext);

  if (!context) {
    context = /*#__PURE__*/_react.default.createContext({});
    context.displayName = 'ApolloContext';
    cache.set(_react.default.createContext, context);
  }

  return context;
}

var ApolloConsumer = function ApolloConsumer(props) {
  var ApolloContext = getApolloContext();
  return /*#__PURE__*/_react.default.createElement(ApolloContext.Consumer, null, function (context) {
    process.env.NODE_ENV === "production" ? invariant(context && context.client, 27) : invariant(context && context.client, 'Could not find "client" in the context of ApolloConsumer. ' + 'Wrap the root component in an <ApolloProvider>.');
    return props.children(context.client);
  });
};

exports.ApolloConsumer = ApolloConsumer;

var ApolloProvider = function ApolloProvider(_a) {
  var client = _a.client,
      children = _a.children;
  var ApolloContext = getApolloContext();
  return /*#__PURE__*/_react.default.createElement(ApolloContext.Consumer, null, function (context) {
    if (context === void 0) {
      context = {};
    }

    if (client && context.client !== client) {
      context = Object.assign({}, context, {
        client: client
      });
    }

    process.env.NODE_ENV === "production" ? invariant(context.client, 28) : invariant(context.client, 'ApolloProvider was not passed a client instance. Make ' + 'sure you pass in your client via the "client" prop.');
    return /*#__PURE__*/_react.default.createElement(ApolloContext.Provider, {
      value: context
    }, children);
  });
};

exports.ApolloProvider = ApolloProvider;

function useApolloClient() {
  var client = _react.default.useContext(getApolloContext()).client;

  process.env.NODE_ENV === "production" ? invariant(client, 33) : invariant(client, 'No Apollo Client instance can be found. Please ensure that you ' + 'have called `ApolloProvider` higher up in your tree.');
  return client;
}

var DocumentType;
exports.DocumentType = DocumentType;

(function (DocumentType) {
  DocumentType[DocumentType["Query"] = 0] = "Query";
  DocumentType[DocumentType["Mutation"] = 1] = "Mutation";
  DocumentType[DocumentType["Subscription"] = 2] = "Subscription";
})(DocumentType || (exports.DocumentType = DocumentType = {}));

var cache$1 = new Map();

function operationName(type) {
  var name;

  switch (type) {
    case DocumentType.Query:
      name = 'Query';
      break;

    case DocumentType.Mutation:
      name = 'Mutation';
      break;

    case DocumentType.Subscription:
      name = 'Subscription';
      break;
  }

  return name;
}

function parser(document) {
  var cached = cache$1.get(document);
  if (cached) return cached;
  var variables, type, name;
  process.env.NODE_ENV === "production" ? invariant(!!document && !!document.kind, 34) : invariant(!!document && !!document.kind, "Argument of " + document + " passed to parser was not a valid GraphQL " + "DocumentNode. You may need to use 'graphql-tag' or another method " + "to convert your operation into a document");
  var fragments = document.definitions.filter(function (x) {
    return x.kind === 'FragmentDefinition';
  });
  var queries = document.definitions.filter(function (x) {
    return x.kind === 'OperationDefinition' && x.operation === 'query';
  });
  var mutations = document.definitions.filter(function (x) {
    return x.kind === 'OperationDefinition' && x.operation === 'mutation';
  });
  var subscriptions = document.definitions.filter(function (x) {
    return x.kind === 'OperationDefinition' && x.operation === 'subscription';
  });
  process.env.NODE_ENV === "production" ? invariant(!fragments.length || queries.length || mutations.length || subscriptions.length, 35) : invariant(!fragments.length || queries.length || mutations.length || subscriptions.length, "Passing only a fragment to 'graphql' is not yet supported. " + "You must include a query, subscription or mutation as well");
  process.env.NODE_ENV === "production" ? invariant(queries.length + mutations.length + subscriptions.length <= 1, 36) : invariant(queries.length + mutations.length + subscriptions.length <= 1, "react-apollo only supports a query, subscription, or a mutation per HOC. " + (document + " had " + queries.length + " queries, " + subscriptions.length + " ") + ("subscriptions and " + mutations.length + " mutations. ") + "You can use 'compose' to join multiple operation types to a component");
  type = queries.length ? DocumentType.Query : DocumentType.Mutation;
  if (!queries.length && !mutations.length) type = DocumentType.Subscription;
  var definitions = queries.length ? queries : mutations.length ? mutations : subscriptions;
  process.env.NODE_ENV === "production" ? invariant(definitions.length === 1, 37) : invariant(definitions.length === 1, "react-apollo only supports one definition per HOC. " + document + " had " + (definitions.length + " definitions. ") + "You can use 'compose' to join multiple operation types to a component");
  var definition = definitions[0];
  variables = definition.variableDefinitions || [];

  if (definition.name && definition.name.kind === 'Name') {
    name = definition.name.value;
  } else {
    name = 'data';
  }

  var payload = {
    name: name,
    type: type,
    variables: variables
  };
  cache$1.set(document, payload);
  return payload;
}

var OperationData = function () {
  function OperationData(options, context) {
    this.isMounted = false;
    this.previousOptions = {};
    this.context = {};
    this.options = {};
    this.options = options || {};
    this.context = context || {};
  }

  OperationData.prototype.getOptions = function () {
    return this.options;
  };

  OperationData.prototype.setOptions = function (newOptions, storePrevious) {
    if (storePrevious === void 0) {
      storePrevious = false;
    }

    if (storePrevious && !equal(this.options, newOptions)) {
      this.previousOptions = this.options;
    }

    this.options = newOptions;
  };

  OperationData.prototype.unmount = function () {
    this.isMounted = false;
  };

  OperationData.prototype.refreshClient = function () {
    var client = this.options && this.options.client || this.context && this.context.client;
    process.env.NODE_ENV === "production" ? invariant(!!client, 29) : invariant(!!client, 'Could not find "client" in the context or passed in as an option. ' + 'Wrap the root component in an <ApolloProvider>, or pass an ' + 'ApolloClient instance in via options.');
    var isNew = false;

    if (client !== this.client) {
      isNew = true;
      this.client = client;
      this.cleanup();
    }

    return {
      client: this.client,
      isNew: isNew
    };
  };

  OperationData.prototype.verifyDocumentType = function (document, type) {
    var operation = parser(document);
    var requiredOperationName = operationName(type);
    var usedOperationName = operationName(operation.type);
    process.env.NODE_ENV === "production" ? invariant(operation.type === type, 30) : invariant(operation.type === type, "Running a " + requiredOperationName + " requires a graphql " + (requiredOperationName + ", but a " + usedOperationName + " was used instead."));
  };

  return OperationData;
}();

var MutationData = function (_super) {
  __extends(MutationData, _super);

  function MutationData(_a) {
    var options = _a.options,
        context = _a.context,
        result = _a.result,
        setResult = _a.setResult;

    var _this = _super.call(this, options, context) || this;

    _this.runMutation = function (mutationFunctionOptions) {
      if (mutationFunctionOptions === void 0) {
        mutationFunctionOptions = {};
      }

      _this.onMutationStart();

      var mutationId = _this.generateNewMutationId();

      return _this.mutate(mutationFunctionOptions).then(function (response) {
        _this.onMutationCompleted(response, mutationId);

        return response;
      }).catch(function (error) {
        _this.onMutationError(error, mutationId);

        if (!_this.getOptions().onError) throw error;
      });
    };

    _this.verifyDocumentType(options.mutation, DocumentType.Mutation);

    _this.result = result;
    _this.setResult = setResult;
    _this.mostRecentMutationId = 0;
    return _this;
  }

  MutationData.prototype.execute = function (result) {
    this.isMounted = true;
    this.verifyDocumentType(this.getOptions().mutation, DocumentType.Mutation);
    return [this.runMutation, _assign(_assign({}, result), {
      client: this.refreshClient().client
    })];
  };

  MutationData.prototype.afterExecute = function () {
    this.isMounted = true;
    return this.unmount.bind(this);
  };

  MutationData.prototype.cleanup = function () {};

  MutationData.prototype.mutate = function (options) {
    return this.refreshClient().client.mutate(mergeOptions(this.getOptions(), options));
  };

  MutationData.prototype.onMutationStart = function () {
    if (!this.result.loading && !this.getOptions().ignoreResults) {
      this.updateResult({
        loading: true,
        error: undefined,
        data: undefined,
        called: true
      });
    }
  };

  MutationData.prototype.onMutationCompleted = function (response, mutationId) {
    var _a = this.getOptions(),
        onCompleted = _a.onCompleted,
        ignoreResults = _a.ignoreResults;

    var data = response.data,
        errors = response.errors;
    var error = errors && errors.length > 0 ? new ApolloError({
      graphQLErrors: errors
    }) : undefined;

    var callOncomplete = function callOncomplete() {
      return onCompleted ? onCompleted(data) : null;
    };

    if (this.isMostRecentMutation(mutationId) && !ignoreResults) {
      this.updateResult({
        called: true,
        loading: false,
        data: data,
        error: error
      });
    }

    callOncomplete();
  };

  MutationData.prototype.onMutationError = function (error, mutationId) {
    var onError = this.getOptions().onError;

    if (this.isMostRecentMutation(mutationId)) {
      this.updateResult({
        loading: false,
        error: error,
        data: undefined,
        called: true
      });
    }

    if (onError) {
      onError(error);
    }
  };

  MutationData.prototype.generateNewMutationId = function () {
    return ++this.mostRecentMutationId;
  };

  MutationData.prototype.isMostRecentMutation = function (mutationId) {
    return this.mostRecentMutationId === mutationId;
  };

  MutationData.prototype.updateResult = function (result) {
    if (this.isMounted && (!this.previousResult || !equal(this.previousResult, result))) {
      this.setResult(result);
      this.previousResult = result;
    }
  };

  return MutationData;
}(OperationData);

var QueryData = function (_super) {
  __extends(QueryData, _super);

  function QueryData(_a) {
    var options = _a.options,
        context = _a.context,
        onNewData = _a.onNewData;

    var _this = _super.call(this, options, context) || this;

    _this.runLazy = false;
    _this.previous = Object.create(null);

    _this.runLazyQuery = function (options) {
      _this.cleanup();

      _this.runLazy = true;
      _this.lazyOptions = options;

      _this.onNewData();
    };

    _this.getQueryResult = function () {
      var result = _this.observableQueryFields();

      var options = _this.getOptions();

      if (options.skip) {
        result = _assign(_assign({}, result), {
          data: undefined,
          error: undefined,
          loading: false,
          networkStatus: NetworkStatus.ready,
          called: true
        });
      } else if (_this.currentObservable) {
        var currentResult = _this.currentObservable.getCurrentResult();

        var data = currentResult.data,
            loading = currentResult.loading,
            partial = currentResult.partial,
            networkStatus = currentResult.networkStatus,
            errors = currentResult.errors;
        var error = currentResult.error;

        if (errors && errors.length > 0) {
          error = new ApolloError({
            graphQLErrors: errors
          });
        }

        result = _assign(_assign({}, result), {
          data: data,
          loading: loading,
          networkStatus: networkStatus,
          error: error,
          called: true
        });
        if (loading) ;else if (error) {
          Object.assign(result, {
            data: (_this.currentObservable.getLastResult() || {}).data
          });
        } else {
          var fetchPolicy = _this.currentObservable.options.fetchPolicy;
          var partialRefetch = options.partialRefetch;

          if (partialRefetch && partial && (!data || Object.keys(data).length === 0) && fetchPolicy !== 'cache-only') {
            Object.assign(result, {
              loading: true,
              networkStatus: NetworkStatus.loading
            });
            result.refetch();
            return result;
          }
        }
      }

      result.client = _this.client;

      _this.setOptions(options, true);

      var previousResult = _this.previous.result;
      _this.previous.loading = previousResult && previousResult.loading || false;
      result.previousData = previousResult && (previousResult.data || previousResult.previousData);
      _this.previous.result = result;
      _this.currentObservable && _this.currentObservable.resetQueryStoreErrors();
      return result;
    };

    _this.obsRefetch = function (variables) {
      var _a;

      return (_a = _this.currentObservable) === null || _a === void 0 ? void 0 : _a.refetch(variables);
    };

    _this.obsFetchMore = function (fetchMoreOptions) {
      return _this.currentObservable.fetchMore(fetchMoreOptions);
    };

    _this.obsUpdateQuery = function (mapFn) {
      return _this.currentObservable.updateQuery(mapFn);
    };

    _this.obsStartPolling = function (pollInterval) {
      var _a;

      (_a = _this.currentObservable) === null || _a === void 0 ? void 0 : _a.startPolling(pollInterval);
    };

    _this.obsStopPolling = function () {
      var _a;

      (_a = _this.currentObservable) === null || _a === void 0 ? void 0 : _a.stopPolling();
    };

    _this.obsSubscribeToMore = function (options) {
      return _this.currentObservable.subscribeToMore(options);
    };

    _this.onNewData = onNewData;
    return _this;
  }

  QueryData.prototype.execute = function () {
    this.refreshClient();

    var _a = this.getOptions(),
        skip = _a.skip,
        query = _a.query;

    if (skip || query !== this.previous.query) {
      this.removeQuerySubscription();
      this.removeObservable(!skip);
      this.previous.query = query;
    }

    this.updateObservableQuery();
    if (this.isMounted) this.startQuerySubscription();
    return this.getExecuteSsrResult() || this.getExecuteResult();
  };

  QueryData.prototype.executeLazy = function () {
    return !this.runLazy ? [this.runLazyQuery, {
      loading: false,
      networkStatus: NetworkStatus.ready,
      called: false,
      data: undefined
    }] : [this.runLazyQuery, this.execute()];
  };

  QueryData.prototype.fetchData = function () {
    var _this = this;

    var options = this.getOptions();
    if (options.skip || options.ssr === false) return false;
    return new Promise(function (resolve) {
      return _this.startQuerySubscription(resolve);
    });
  };

  QueryData.prototype.afterExecute = function (_a) {
    var _b = (_a === void 0 ? {} : _a).lazy,
        lazy = _b === void 0 ? false : _b;
    this.isMounted = true;

    if (!lazy || this.runLazy) {
      this.handleErrorOrCompleted();
    }

    this.previousOptions = this.getOptions();
    return this.unmount.bind(this);
  };

  QueryData.prototype.cleanup = function () {
    this.removeQuerySubscription();
    this.removeObservable(true);
    delete this.previous.result;
  };

  QueryData.prototype.getOptions = function () {
    var options = _super.prototype.getOptions.call(this);

    if (this.lazyOptions) {
      options.variables = _assign(_assign({}, options.variables), this.lazyOptions.variables);
      options.context = _assign(_assign({}, options.context), this.lazyOptions.context);
    }

    if (this.runLazy) {
      delete options.skip;
    }

    return options;
  };

  QueryData.prototype.ssrInitiated = function () {
    return this.context && this.context.renderPromises;
  };

  QueryData.prototype.getExecuteResult = function () {
    var result = this.getQueryResult();
    this.startQuerySubscription();
    return result;
  };

  QueryData.prototype.getExecuteSsrResult = function () {
    var _a = this.getOptions(),
        ssr = _a.ssr,
        skip = _a.skip;

    var ssrDisabled = ssr === false;
    var fetchDisabled = this.refreshClient().client.disableNetworkFetches;

    var ssrLoading = _assign({
      loading: true,
      networkStatus: NetworkStatus.loading,
      called: true,
      data: undefined,
      stale: false,
      client: this.client
    }, this.observableQueryFields());

    if (ssrDisabled && (this.ssrInitiated() || fetchDisabled)) {
      this.previous.result = ssrLoading;
      return ssrLoading;
    }

    var result;

    if (this.ssrInitiated()) {
      if (skip) {
        result = this.getQueryResult();
      } else {
        result = this.context.renderPromises.addQueryPromise(this, this.getQueryResult) || ssrLoading;
      }
    }

    return result;
  };

  QueryData.prototype.prepareObservableQueryOptions = function () {
    var options = this.getOptions();
    this.verifyDocumentType(options.query, DocumentType.Query);
    var displayName = options.displayName || 'Query';

    if (this.ssrInitiated() && (options.fetchPolicy === 'network-only' || options.fetchPolicy === 'cache-and-network')) {
      options.fetchPolicy = 'cache-first';
    }

    return _assign(_assign({}, options), {
      displayName: displayName,
      context: options.context
    });
  };

  QueryData.prototype.initializeObservableQuery = function () {
    if (this.ssrInitiated()) {
      this.currentObservable = this.context.renderPromises.getSSRObservable(this.getOptions());
    }

    if (!this.currentObservable) {
      var observableQueryOptions = this.prepareObservableQueryOptions();
      this.previous.observableQueryOptions = _assign(_assign({}, observableQueryOptions), {
        children: null
      });
      this.currentObservable = this.refreshClient().client.watchQuery(_assign({}, observableQueryOptions));

      if (this.ssrInitiated()) {
        this.context.renderPromises.registerSSRObservable(this.currentObservable, observableQueryOptions);
      }
    }
  };

  QueryData.prototype.updateObservableQuery = function () {
    if (!this.currentObservable) {
      this.initializeObservableQuery();
      return;
    }

    if (this.getOptions().skip) return;

    var newObservableQueryOptions = _assign(_assign({}, this.prepareObservableQueryOptions()), {
      children: null
    });

    if (!equal(newObservableQueryOptions, this.previous.observableQueryOptions)) {
      this.previous.observableQueryOptions = newObservableQueryOptions;
      this.currentObservable.setOptions(newObservableQueryOptions).catch(function () {});
    }
  };

  QueryData.prototype.startQuerySubscription = function (onNewData) {
    var _this = this;

    if (onNewData === void 0) {
      onNewData = this.onNewData;
    }

    if (this.currentSubscription || this.getOptions().skip) return;
    this.currentSubscription = this.currentObservable.subscribe({
      next: function next(_a) {
        var loading = _a.loading,
            networkStatus = _a.networkStatus,
            data = _a.data;
        var previousResult = _this.previous.result;

        if (previousResult && previousResult.loading === loading && previousResult.networkStatus === networkStatus && equal(previousResult.data, data)) {
          return;
        }

        onNewData();
      },
      error: function error(_error3) {
        _this.resubscribeToQuery();

        if (!_error3.hasOwnProperty('graphQLErrors')) throw _error3;
        var previousResult = _this.previous.result;

        if (previousResult && previousResult.loading || !equal(_error3, _this.previous.error)) {
          _this.previous.error = _error3;
          onNewData();
        }
      }
    });
  };

  QueryData.prototype.resubscribeToQuery = function () {
    this.removeQuerySubscription();
    var currentObservable = this.currentObservable;

    if (currentObservable) {
      var lastError = currentObservable.getLastError();
      var lastResult = currentObservable.getLastResult();
      currentObservable.resetLastResults();
      this.startQuerySubscription();
      Object.assign(currentObservable, {
        lastError: lastError,
        lastResult: lastResult
      });
    }
  };

  QueryData.prototype.handleErrorOrCompleted = function () {
    if (!this.currentObservable || !this.previous.result) return;
    var _a = this.previous.result,
        data = _a.data,
        loading = _a.loading,
        error = _a.error;

    if (!loading) {
      var _b = this.getOptions(),
          query = _b.query,
          variables = _b.variables,
          onCompleted = _b.onCompleted,
          onError = _b.onError,
          skip = _b.skip;

      if (this.previousOptions && !this.previous.loading && equal(this.previousOptions.query, query) && equal(this.previousOptions.variables, variables)) {
        return;
      }

      if (onCompleted && !error && !skip) {
        onCompleted(data);
      } else if (onError && error) {
        onError(error);
      }
    }
  };

  QueryData.prototype.removeQuerySubscription = function () {
    if (this.currentSubscription) {
      this.currentSubscription.unsubscribe();
      delete this.currentSubscription;
    }
  };

  QueryData.prototype.removeObservable = function (andDelete) {
    if (this.currentObservable) {
      this.currentObservable["tearDownQuery"]();

      if (andDelete) {
        delete this.currentObservable;
      }
    }
  };

  QueryData.prototype.observableQueryFields = function () {
    var _a;

    return {
      variables: (_a = this.currentObservable) === null || _a === void 0 ? void 0 : _a.variables,
      refetch: this.obsRefetch,
      fetchMore: this.obsFetchMore,
      updateQuery: this.obsUpdateQuery,
      startPolling: this.obsStartPolling,
      stopPolling: this.obsStopPolling,
      subscribeToMore: this.obsSubscribeToMore
    };
  };

  return QueryData;
}(OperationData);

function useDeepMemo(memoFn, key) {
  var ref = (0, _react.useRef)();

  if (!ref.current || !equal(key, ref.current.key)) {
    ref.current = {
      key: key,
      value: memoFn()
    };
  }

  return ref.current.value;
}

function useBaseQuery(query, options, lazy) {
  if (lazy === void 0) {
    lazy = false;
  }

  var context = (0, _react.useContext)(getApolloContext());

  var _a = (0, _react.useReducer)(function (x) {
    return x + 1;
  }, 0),
      tick = _a[0],
      forceUpdate = _a[1];

  var updatedOptions = options ? _assign(_assign({}, options), {
    query: query
  }) : {
    query: query
  };
  var queryDataRef = (0, _react.useRef)();
  var queryData = queryDataRef.current || (queryDataRef.current = new QueryData({
    options: updatedOptions,
    context: context,
    onNewData: function onNewData() {
      if (!queryData.ssrInitiated()) {
        Promise.resolve().then(function () {
          return queryDataRef.current && forceUpdate();
        });
      } else {
        forceUpdate();
      }
    }
  }));
  queryData.setOptions(updatedOptions);
  queryData.context = context;
  var memo = {
    options: _assign(_assign({}, updatedOptions), {
      onError: undefined,
      onCompleted: undefined
    }),
    context: context,
    tick: tick
  };
  var result = useDeepMemo(function () {
    return lazy ? queryData.executeLazy() : queryData.execute();
  }, memo);
  var queryResult = lazy ? result[1] : result;
  (0, _react.useEffect)(function () {
    return function () {
      return queryData.cleanup();
    };
  }, []);
  (0, _react.useEffect)(function () {
    return queryData.afterExecute({
      lazy: lazy
    });
  }, [queryResult.loading, queryResult.networkStatus, queryResult.error, queryResult.data]);
  return result;
}

function useLazyQuery(query, options) {
  return useBaseQuery(query, options, true);
}

function useMutation(mutation, options) {
  var context = (0, _react.useContext)(getApolloContext());

  var _a = (0, _react.useState)({
    called: false,
    loading: false
  }),
      result = _a[0],
      setResult = _a[1];

  var updatedOptions = options ? _assign(_assign({}, options), {
    mutation: mutation
  }) : {
    mutation: mutation
  };
  var mutationDataRef = (0, _react.useRef)();

  function getMutationDataRef() {
    if (!mutationDataRef.current) {
      mutationDataRef.current = new MutationData({
        options: updatedOptions,
        context: context,
        result: result,
        setResult: setResult
      });
    }

    return mutationDataRef.current;
  }

  var mutationData = getMutationDataRef();
  mutationData.setOptions(updatedOptions);
  mutationData.context = context;
  (0, _react.useEffect)(function () {
    return mutationData.afterExecute();
  });
  return mutationData.execute(result);
}

function useQuery(query, options) {
  return useBaseQuery(query, options, false);
}

function useReactiveVar(rv) {
  var value = rv();

  var _a = (0, _react.useState)(value),
      setValue = _a[1];

  (0, _react.useEffect)(function () {
    return rv.onNextChange(setValue);
  }, [value]);
  (0, _react.useEffect)(function () {
    setValue(rv());
  }, []);
  return value;
}

var gql = function gql() {
  throw new Error('The `gql` export is unavailable. Please enable `graphqlParse: true` in the webpack config');
};

exports.gql = gql;