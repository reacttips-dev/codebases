/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * 
 * @format
 */
// flowlint ambiguous-object-type:error
'use strict';

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var RelayFeatureFlags = require('../util/RelayFeatureFlags');

var RelayModernRecord = require('./RelayModernRecord');

var invariant = require('invariant');

var _require = require('../util/RelayConcreteNode'),
    CLIENT_EXTENSION = _require.CLIENT_EXTENSION,
    CONDITION = _require.CONDITION,
    DEFER = _require.DEFER,
    FLIGHT_FIELD = _require.FLIGHT_FIELD,
    FRAGMENT_SPREAD = _require.FRAGMENT_SPREAD,
    INLINE_DATA_FRAGMENT_SPREAD = _require.INLINE_DATA_FRAGMENT_SPREAD,
    INLINE_FRAGMENT = _require.INLINE_FRAGMENT,
    LINKED_FIELD = _require.LINKED_FIELD,
    MODULE_IMPORT = _require.MODULE_IMPORT,
    REQUIRED_FIELD = _require.REQUIRED_FIELD,
    RELAY_RESOLVER = _require.RELAY_RESOLVER,
    SCALAR_FIELD = _require.SCALAR_FIELD,
    STREAM = _require.STREAM;

var _require2 = require('./RelayStoreReactFlightUtils'),
    getReactFlightClientResponse = _require2.getReactFlightClientResponse;

var _require3 = require('./RelayStoreUtils'),
    FRAGMENTS_KEY = _require3.FRAGMENTS_KEY,
    FRAGMENT_OWNER_KEY = _require3.FRAGMENT_OWNER_KEY,
    FRAGMENT_PROP_NAME_KEY = _require3.FRAGMENT_PROP_NAME_KEY,
    ID_KEY = _require3.ID_KEY,
    IS_WITHIN_UNMATCHED_TYPE_REFINEMENT = _require3.IS_WITHIN_UNMATCHED_TYPE_REFINEMENT,
    MODULE_COMPONENT_KEY = _require3.MODULE_COMPONENT_KEY,
    ROOT_ID = _require3.ROOT_ID,
    getArgumentValues = _require3.getArgumentValues,
    getStorageKey = _require3.getStorageKey,
    getModuleComponentKey = _require3.getModuleComponentKey;

var _require4 = require('./ResolverFragments'),
    withResolverContext = _require4.withResolverContext;

var _require5 = require('./TypeID'),
    generateTypeID = _require5.generateTypeID;

function read(recordSource, selector) {
  var reader = new RelayReader(recordSource, selector);
  return reader.read();
}
/**
 * @private
 */


var RelayReader = /*#__PURE__*/function () {
  function RelayReader(recordSource, selector) {
    this._isMissingData = false;
    this._isWithinUnmatchedTypeRefinement = false;
    this._missingRequiredFields = null;
    this._owner = selector.owner;
    this._recordSource = recordSource;
    this._seenRecords = new Set();
    this._selector = selector;
    this._variables = selector.variables;
  }

  var _proto = RelayReader.prototype;

  _proto.read = function read() {
    var _this$_selector = this._selector,
        node = _this$_selector.node,
        dataID = _this$_selector.dataID,
        isWithinUnmatchedTypeRefinement = _this$_selector.isWithinUnmatchedTypeRefinement;
    var abstractKey = node.abstractKey;

    var record = this._recordSource.get(dataID); // Relay historically allowed child fragments to be read even if the root object
    // did not match the type of the fragment: either the root object has a different
    // concrete type than the fragment (for concrete fragments) or the root object does
    // not conform to the interface/union for abstract fragments.
    // For suspense purposes, however, we want to accurately compute whether any data
    // is missing: but if the fragment type doesn't match (or a parent type didn't
    // match), then no data is expected to be present.
    // By default data is expected to be present unless this selector was read out
    // from within a non-matching type refinement in a parent fragment:


    var isDataExpectedToBePresent = !isWithinUnmatchedTypeRefinement; // If this is a concrete fragment and the concrete type of the record does not
    // match, then no data is expected to be present.

    if (isDataExpectedToBePresent && abstractKey == null && record != null) {
      var recordType = RelayModernRecord.getType(record);

      if (recordType !== node.type && dataID !== ROOT_ID) {
        isDataExpectedToBePresent = false;
      }
    } // If this is an abstract fragment (and the precise refinement GK is enabled)
    // then data is only expected to be present if the record type is known to
    // implement the interface. If we aren't sure whether the record implements
    // the interface, that itself constitutes "expected" data being missing.


    if (isDataExpectedToBePresent && abstractKey != null && record != null && RelayFeatureFlags.ENABLE_PRECISE_TYPE_REFINEMENT) {
      var _recordType = RelayModernRecord.getType(record);

      var typeID = generateTypeID(_recordType);

      var typeRecord = this._recordSource.get(typeID);

      var implementsInterface = typeRecord != null ? RelayModernRecord.getValue(typeRecord, abstractKey) : null;

      if (implementsInterface === false) {
        // Type known to not implement the interface
        isDataExpectedToBePresent = false;
      } else if (implementsInterface == null) {
        // Don't know if the type implements the interface or not
        this._isMissingData = true;
      }
    }

    this._isWithinUnmatchedTypeRefinement = !isDataExpectedToBePresent;

    var data = this._traverse(node, dataID, null);

    return {
      data: data,
      isMissingData: this._isMissingData && isDataExpectedToBePresent,
      seenRecords: this._seenRecords,
      selector: this._selector,
      missingRequiredFields: this._missingRequiredFields
    };
  };

  _proto._traverse = function _traverse(node, dataID, prevData) {
    var record = this._recordSource.get(dataID);

    this._seenRecords.add(dataID);

    if (record == null) {
      if (record === undefined) {
        this._isMissingData = true;
      }

      return record;
    }

    var data = prevData || {};

    var hadRequiredData = this._traverseSelections(node.selections, record, data);

    return hadRequiredData ? data : null;
  };

  _proto._getVariableValue = function _getVariableValue(name) {
    !this._variables.hasOwnProperty(name) ? process.env.NODE_ENV !== "production" ? invariant(false, 'RelayReader(): Undefined variable `%s`.', name) : invariant(false) : void 0; // $FlowFixMe[cannot-write]

    return this._variables[name];
  };

  _proto._maybeReportUnexpectedNull = function _maybeReportUnexpectedNull(fieldPath, action, record) {
    var _this$_missingRequire;

    if (((_this$_missingRequire = this._missingRequiredFields) === null || _this$_missingRequire === void 0 ? void 0 : _this$_missingRequire.action) === 'THROW') {
      // Chained @required directives may cause a parent `@required(action:
      // THROW)` field to become null, so the first missing field we
      // encounter is likely to be the root cause of the error.
      return;
    }

    var owner = this._selector.node.name;

    switch (action) {
      case 'THROW':
        this._missingRequiredFields = {
          action: action,
          field: {
            path: fieldPath,
            owner: owner
          }
        };
        return;

      case 'LOG':
        if (this._missingRequiredFields == null) {
          this._missingRequiredFields = {
            action: action,
            fields: []
          };
        }

        this._missingRequiredFields.fields.push({
          path: fieldPath,
          owner: owner
        });

        return;

      default:
        action;
    }
  };

  _proto._traverseSelections = function _traverseSelections(selections, record, data)
  /* had all expected data */
  {
    for (var i = 0; i < selections.length; i++) {
      var selection = selections[i];

      switch (selection.kind) {
        case REQUIRED_FIELD:
          !RelayFeatureFlags.ENABLE_REQUIRED_DIRECTIVES ? process.env.NODE_ENV !== "production" ? invariant(false, 'RelayReader(): Encountered a `@required` directive at path "%s" in `%s` without the `ENABLE_REQUIRED_DIRECTIVES` feature flag enabled.', selection.path, this._selector.node.name) : invariant(false) : void 0;

          var fieldValue = this._readRequiredField(selection, record, data);

          if (fieldValue == null) {
            var action = selection.action;

            if (action !== 'NONE') {
              this._maybeReportUnexpectedNull(selection.path, action, record);
            } // We are going to throw, or our parent is going to get nulled out.
            // Either way, sibling values are going to be ignored, so we can
            // bail early here as an optimization.


            return false;
          }

          break;

        case SCALAR_FIELD:
          this._readScalar(selection, record, data);

          break;

        case LINKED_FIELD:
          if (selection.plural) {
            this._readPluralLink(selection, record, data);
          } else {
            this._readLink(selection, record, data);
          }

          break;

        case CONDITION:
          var conditionValue = this._getVariableValue(selection.condition);

          if (conditionValue === selection.passingValue) {
            var hasExpectedData = this._traverseSelections(selection.selections, record, data);

            if (!hasExpectedData) {
              return false;
            }
          }

          break;

        case INLINE_FRAGMENT:
          {
            var abstractKey = selection.abstractKey;

            if (abstractKey == null) {
              // concrete type refinement: only read data if the type exactly matches
              var typeName = RelayModernRecord.getType(record);

              if (typeName != null && typeName === selection.type) {
                var _hasExpectedData = this._traverseSelections(selection.selections, record, data);

                if (!_hasExpectedData) {
                  return false;
                }
              }
            } else if (RelayFeatureFlags.ENABLE_PRECISE_TYPE_REFINEMENT) {
              // Similar to the logic in read(): data is only expected to be present
              // if the record is known to conform to the interface. If we don't know
              // whether the type conforms or not, that constitutes missing data.
              // store flags to reset after reading
              var parentIsMissingData = this._isMissingData;
              var parentIsWithinUnmatchedTypeRefinement = this._isWithinUnmatchedTypeRefinement;

              var _typeName = RelayModernRecord.getType(record);

              var typeID = generateTypeID(_typeName);

              var typeRecord = this._recordSource.get(typeID);

              var implementsInterface = typeRecord != null ? RelayModernRecord.getValue(typeRecord, abstractKey) : null;
              this._isWithinUnmatchedTypeRefinement = parentIsWithinUnmatchedTypeRefinement || implementsInterface === false;

              this._traverseSelections(selection.selections, record, data);

              this._isWithinUnmatchedTypeRefinement = parentIsWithinUnmatchedTypeRefinement;

              if (implementsInterface === false) {
                // Type known to not implement the interface, no data expected
                this._isMissingData = parentIsMissingData;
              } else if (implementsInterface == null) {
                // Don't know if the type implements the interface or not
                this._isMissingData = true;
              }
            } else {
              // legacy behavior for abstract refinements: always read even
              // if the type doesn't conform and don't reset isMissingData
              this._traverseSelections(selection.selections, record, data);
            }

            break;
          }

        case RELAY_RESOLVER:
          {
            if (!RelayFeatureFlags.ENABLE_RELAY_RESOLVERS) {
              throw new Error('Relay Resolver fields are not yet supported.');
            }

            this._readResolverField(selection, record, data);

            break;
          }

        case FRAGMENT_SPREAD:
          this._createFragmentPointer(selection, record, data);

          break;

        case MODULE_IMPORT:
          this._readModuleImport(selection, record, data);

          break;

        case INLINE_DATA_FRAGMENT_SPREAD:
          this._createInlineDataOrResolverFragmentPointer(selection, record, data);

          break;

        case DEFER:
        case CLIENT_EXTENSION:
          {
            var isMissingData = this._isMissingData;

            var _hasExpectedData2 = this._traverseSelections(selection.selections, record, data);

            this._isMissingData = isMissingData;

            if (!_hasExpectedData2) {
              return false;
            }

            break;
          }

        case STREAM:
          {
            var _hasExpectedData3 = this._traverseSelections(selection.selections, record, data);

            if (!_hasExpectedData3) {
              return false;
            }

            break;
          }

        case FLIGHT_FIELD:
          if (RelayFeatureFlags.ENABLE_REACT_FLIGHT_COMPONENT_FIELD) {
            this._readFlightField(selection, record, data);
          } else {
            throw new Error('Flight fields are not yet supported.');
          }

          break;

        default:
          selection;
          !false ? process.env.NODE_ENV !== "production" ? invariant(false, 'RelayReader(): Unexpected ast kind `%s`.', selection.kind) : invariant(false) : void 0;
      }
    }

    return true;
  };

  _proto._readRequiredField = function _readRequiredField(selection, record, data) {
    switch (selection.field.kind) {
      case SCALAR_FIELD:
        return this._readScalar(selection.field, record, data);

      case LINKED_FIELD:
        if (selection.field.plural) {
          return this._readPluralLink(selection.field, record, data);
        } else {
          return this._readLink(selection.field, record, data);
        }

      default:
        selection.field.kind;
        !false ? process.env.NODE_ENV !== "production" ? invariant(false, 'RelayReader(): Unexpected ast kind `%s`.', selection.kind) : invariant(false) : void 0;
    }
  };

  _proto._readResolverField = function _readResolverField(selection, record, data) {
    var _this = this;

    var name = selection.name,
        alias = selection.alias,
        resolverModule = selection.resolverModule,
        fragment = selection.fragment;
    var key = {
      __id: RelayModernRecord.getDataID(record),
      __fragmentOwner: this._owner,
      __fragments: (0, _defineProperty2["default"])({}, fragment.name, {})
    };
    var resolverContext = {
      getDataForResolverFragment: function getDataForResolverFragment(singularReaderSelector) {
        var _resolverFragmentData;

        var resolverFragmentData = {};

        _this._createInlineDataOrResolverFragmentPointer(singularReaderSelector.node, record, resolverFragmentData);

        var answer = (_resolverFragmentData = resolverFragmentData[FRAGMENTS_KEY]) === null || _resolverFragmentData === void 0 ? void 0 : _resolverFragmentData[fragment.name];
        !(typeof answer === 'object' && answer !== null) ? process.env.NODE_ENV !== "production" ? invariant(false, "Expected reader data to contain a __fragments property with a property for the fragment named ".concat(fragment.name, ", but it is missing.")) : invariant(false) : void 0;
        return answer;
      }
    };
    var resolverResult = withResolverContext(resolverContext, function () {
      return (// $FlowFixMe[prop-missing] - resolver module's type signature is a lie
        resolverModule(key)
      );
    });
    data[alias !== null && alias !== void 0 ? alias : name] = resolverResult;
    return resolverResult;
  };

  _proto._readFlightField = function _readFlightField(field, record, data) {
    var _field$alias;

    var applicationName = (_field$alias = field.alias) !== null && _field$alias !== void 0 ? _field$alias : field.name;
    var storageKey = getStorageKey(field, this._variables);
    var reactFlightClientResponseRecordID = RelayModernRecord.getLinkedRecordID(record, storageKey);

    if (reactFlightClientResponseRecordID == null) {
      data[applicationName] = reactFlightClientResponseRecordID;

      if (reactFlightClientResponseRecordID === undefined) {
        this._isMissingData = true;
      }

      return reactFlightClientResponseRecordID;
    }

    var reactFlightClientResponseRecord = this._recordSource.get(reactFlightClientResponseRecordID);

    this._seenRecords.add(reactFlightClientResponseRecordID);

    if (reactFlightClientResponseRecord == null) {
      data[applicationName] = reactFlightClientResponseRecord;

      if (reactFlightClientResponseRecord === undefined) {
        this._isMissingData = true;
      }

      return reactFlightClientResponseRecord;
    }

    var clientResponse = getReactFlightClientResponse(reactFlightClientResponseRecord);
    data[applicationName] = clientResponse;
    return clientResponse;
  };

  _proto._readScalar = function _readScalar(field, record, data) {
    var _field$alias2;

    var applicationName = (_field$alias2 = field.alias) !== null && _field$alias2 !== void 0 ? _field$alias2 : field.name;
    var storageKey = getStorageKey(field, this._variables);
    var value = RelayModernRecord.getValue(record, storageKey);

    if (value === undefined) {
      this._isMissingData = true;
    }

    data[applicationName] = value;
    return value;
  };

  _proto._readLink = function _readLink(field, record, data) {
    var _field$alias3;

    var applicationName = (_field$alias3 = field.alias) !== null && _field$alias3 !== void 0 ? _field$alias3 : field.name;
    var storageKey = getStorageKey(field, this._variables);
    var linkedID = RelayModernRecord.getLinkedRecordID(record, storageKey);

    if (linkedID == null) {
      data[applicationName] = linkedID;

      if (linkedID === undefined) {
        this._isMissingData = true;
      }

      return linkedID;
    }

    var prevData = data[applicationName];
    !(prevData == null || typeof prevData === 'object') ? process.env.NODE_ENV !== "production" ? invariant(false, 'RelayReader(): Expected data for field `%s` on record `%s` ' + 'to be an object, got `%s`.', applicationName, RelayModernRecord.getDataID(record), prevData) : invariant(false) : void 0; // $FlowFixMe[incompatible-variance]

    var value = this._traverse(field, linkedID, prevData);

    data[applicationName] = value;
    return value;
  };

  _proto._readPluralLink = function _readPluralLink(field, record, data) {
    var _this2 = this;

    var _field$alias4;

    var applicationName = (_field$alias4 = field.alias) !== null && _field$alias4 !== void 0 ? _field$alias4 : field.name;
    var storageKey = getStorageKey(field, this._variables);
    var linkedIDs = RelayModernRecord.getLinkedRecordIDs(record, storageKey);

    if (linkedIDs == null) {
      data[applicationName] = linkedIDs;

      if (linkedIDs === undefined) {
        this._isMissingData = true;
      }

      return linkedIDs;
    }

    var prevData = data[applicationName];
    !(prevData == null || Array.isArray(prevData)) ? process.env.NODE_ENV !== "production" ? invariant(false, 'RelayReader(): Expected data for field `%s` on record `%s` ' + 'to be an array, got `%s`.', applicationName, RelayModernRecord.getDataID(record), prevData) : invariant(false) : void 0;
    var linkedArray = prevData || [];
    linkedIDs.forEach(function (linkedID, nextIndex) {
      if (linkedID == null) {
        if (linkedID === undefined) {
          _this2._isMissingData = true;
        } // $FlowFixMe[cannot-write]


        linkedArray[nextIndex] = linkedID;
        return;
      }

      var prevItem = linkedArray[nextIndex];
      !(prevItem == null || typeof prevItem === 'object') ? process.env.NODE_ENV !== "production" ? invariant(false, 'RelayReader(): Expected data for field `%s` on record `%s` ' + 'to be an object, got `%s`.', applicationName, RelayModernRecord.getDataID(record), prevItem) : invariant(false) : void 0; // $FlowFixMe[cannot-write]
      // $FlowFixMe[incompatible-variance]

      linkedArray[nextIndex] = _this2._traverse(field, linkedID, prevItem);
    });
    data[applicationName] = linkedArray;
    return linkedArray;
  }
  /**
   * Reads a ReaderModuleImport, which was generated from using the @module
   * directive.
   */
  ;

  _proto._readModuleImport = function _readModuleImport(moduleImport, record, data) {
    // Determine the component module from the store: if the field is missing
    // it means we don't know what component to render the match with.
    var componentKey = getModuleComponentKey(moduleImport.documentName);
    var component = RelayModernRecord.getValue(record, componentKey);

    if (component == null) {
      if (component === undefined) {
        this._isMissingData = true;
      }

      return;
    } // Otherwise, read the fragment and module associated to the concrete
    // type, and put that data with the result:
    // - For the matched fragment, create the relevant fragment pointer and add
    //   the expected fragmentPropName
    // - For the matched module, create a reference to the module


    this._createFragmentPointer({
      kind: 'FragmentSpread',
      name: moduleImport.fragmentName,
      args: null
    }, record, data);

    data[FRAGMENT_PROP_NAME_KEY] = moduleImport.fragmentPropName;
    data[MODULE_COMPONENT_KEY] = component;
  };

  _proto._createFragmentPointer = function _createFragmentPointer(fragmentSpread, record, data) {
    var fragmentPointers = data[FRAGMENTS_KEY];

    if (fragmentPointers == null) {
      fragmentPointers = data[FRAGMENTS_KEY] = {};
    }

    !(typeof fragmentPointers === 'object' && fragmentPointers != null) ? process.env.NODE_ENV !== "production" ? invariant(false, 'RelayReader: Expected fragment spread data to be an object, got `%s`.', fragmentPointers) : invariant(false) : void 0;

    if (data[ID_KEY] == null) {
      data[ID_KEY] = RelayModernRecord.getDataID(record);
    } // $FlowFixMe[cannot-write] - writing into read-only field


    fragmentPointers[fragmentSpread.name] = fragmentSpread.args ? getArgumentValues(fragmentSpread.args, this._variables) : {};
    data[FRAGMENT_OWNER_KEY] = this._owner;

    if (RelayFeatureFlags.ENABLE_PRECISE_TYPE_REFINEMENT) {
      data[IS_WITHIN_UNMATCHED_TYPE_REFINEMENT] = this._isWithinUnmatchedTypeRefinement;
    }
  };

  _proto._createInlineDataOrResolverFragmentPointer = function _createInlineDataOrResolverFragmentPointer(fragmentSpreadOrFragment, record, data) {
    var fragmentPointers = data[FRAGMENTS_KEY];

    if (fragmentPointers == null) {
      fragmentPointers = data[FRAGMENTS_KEY] = {};
    }

    !(typeof fragmentPointers === 'object' && fragmentPointers != null) ? process.env.NODE_ENV !== "production" ? invariant(false, 'RelayReader: Expected fragment spread data to be an object, got `%s`.', fragmentPointers) : invariant(false) : void 0;

    if (data[ID_KEY] == null) {
      data[ID_KEY] = RelayModernRecord.getDataID(record);
    }

    var inlineData = {};

    this._traverseSelections(fragmentSpreadOrFragment.selections, record, inlineData); // $FlowFixMe[cannot-write] - writing into read-only field


    fragmentPointers[fragmentSpreadOrFragment.name] = inlineData;
  };

  return RelayReader;
}();

module.exports = {
  read: read
};