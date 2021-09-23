'use es6'; // TODO remove polyfills when appropriate
// polyfills from MDN

import _assertThisInitialized from "@babel/runtime/helpers/esm/assertThisInitialized";
import _slicedToArray from "@babel/runtime/helpers/esm/slicedToArray";
import _defineProperty from "@babel/runtime/helpers/esm/defineProperty";
import _toConsumableArray from "@babel/runtime/helpers/esm/toConsumableArray";
import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import _possibleConstructorReturn from "@babel/runtime/helpers/esm/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/esm/getPrototypeOf";
import _inherits from "@babel/runtime/helpers/esm/inherits";
import _objectWithoutProperties from "@babel/runtime/helpers/esm/objectWithoutProperties";

if (!Object.entries) {
  Object.entries = function (obj) {
    var ownProps = Object.keys(obj),
        i = ownProps.length,
        resArray = new Array(i); // preallocate the Array

    while (i--) {
      resArray[i] = [ownProps[i], obj[ownProps[i]]];
    }

    return resArray;
  };
}

Number.isNaN = Number.isNaN || function (value) {
  return value !== value;
};

import React, { Component } from 'react';
import classnames from 'classnames';
import { isElement, isValidElementType } from 'react-is';
import PropTypes from 'prop-types';

function _extends() {
  _extends = Object.assign || function (target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];

      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }

    return target;
  };

  return _extends.apply(this, arguments);
}

var _ = {
  get: get,
  set: set,
  takeRight: takeRight,
  last: last,
  orderBy: orderBy,
  range: range,
  remove: remove,
  clone: clone,
  getFirstDefined: getFirstDefined,
  sum: sum,
  makeTemplateComponent: makeTemplateComponent,
  groupBy: groupBy,
  isArray: isArray,
  splitProps: splitProps,
  compactObject: compactObject,
  isSortingDesc: isSortingDesc,
  normalizeComponent: normalizeComponent,
  asPx: asPx
};

function get(obj, path, def) {
  if (!path) {
    return obj;
  }

  var pathObj = makePathArray(path);
  var val;

  try {
    val = pathObj.reduce(function (current, pathPart) {
      return current[pathPart];
    }, obj);
  } catch (e) {// continue regardless of error
  }

  return typeof val !== 'undefined' ? val : def;
}

function set() {
  var obj = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var path = arguments.length > 1 ? arguments[1] : undefined;
  var value = arguments.length > 2 ? arguments[2] : undefined;
  var keys = makePathArray(path);
  var keyPart;
  var cursor = obj;

  while ((keyPart = keys.shift()) && keys.length) {
    if (!cursor[keyPart]) {
      cursor[keyPart] = {};
    }

    cursor = cursor[keyPart];
  }

  cursor[keyPart] = value;
  return obj;
}

function takeRight(arr, n) {
  var start = n > arr.length ? 0 : arr.length - n;
  return arr.slice(start);
}

function last(arr) {
  return arr[arr.length - 1];
}

function range(n) {
  var arr = [];

  for (var i = 0; i < n; i += 1) {
    arr.push(n);
  }

  return arr;
}

function orderBy(arr, funcs, dirs, indexKey) {
  return arr.sort(function (rowA, rowB) {
    for (var i = 0; i < funcs.length; i += 1) {
      var comp = funcs[i];
      var desc = dirs[i] === false || dirs[i] === 'desc';
      var sortInt = comp(rowA, rowB);

      if (sortInt) {
        return desc ? -sortInt : sortInt;
      }
    } // Use the row index for tie breakers


    return dirs[0] ? rowA[indexKey] - rowB[indexKey] : rowB[indexKey] - rowA[indexKey];
  });
}

function remove(a, b) {
  return a.filter(function (o, i) {
    var r = b(o);

    if (r) {
      a.splice(i, 1);
      return true;
    }

    return false;
  });
}

function clone(a) {
  try {
    return JSON.parse(JSON.stringify(a, function (key, value) {
      if (typeof value === 'function') {
        return value.toString();
      }

      return value;
    }));
  } catch (e) {
    return a;
  }
}

function getFirstDefined() {
  for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
    args[_key] = arguments[_key];
  }

  for (var i = 0; i < args.length; i += 1) {
    if (typeof args[i] !== 'undefined') {
      return args[i];
    }
  }
}

function sum(arr) {
  return arr.reduce(function (a, b) {
    return a + b;
  }, 0);
}

function makeTemplateComponent(compClass, displayName) {
  if (!displayName) {
    throw new Error('No displayName found for template component:', compClass);
  }

  var cmp = function cmp(_ref) {
    var children = _ref.children,
        className = _ref.className,
        rest = _objectWithoutProperties(_ref, ["children", "className"]);

    return /*#__PURE__*/React.createElement("div", _extends({
      className: classnames(compClass, className)
    }, rest), children);
  };

  cmp.displayName = displayName;
  return cmp;
}

function groupBy(xs, key) {
  return xs.reduce(function (rv, x, i) {
    var resKey = typeof key === 'function' ? key(x, i) : x[key];
    rv[resKey] = isArray(rv[resKey]) ? rv[resKey] : [];
    rv[resKey].push(x);
    return rv;
  }, {});
}

function asPx(value) {
  value = Number(value);
  return Number.isNaN(value) ? null : value + "px";
}

function isArray(a) {
  return Array.isArray(a);
} // ########################################################################
// Non-exported Helpers
// ########################################################################


function makePathArray(obj) {
  return flattenDeep(obj).join('.').replace(/\[/g, '.').replace(/\]/g, '').split('.');
}

function flattenDeep(arr) {
  var newArr = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];

  if (!isArray(arr)) {
    newArr.push(arr);
  } else {
    for (var i = 0; i < arr.length; i += 1) {
      flattenDeep(arr[i], newArr);
    }
  }

  return newArr;
}

function splitProps(_ref2) {
  var className = _ref2.className,
      style = _ref2.style,
      rest = _objectWithoutProperties(_ref2, ["className", "style"]);

  return {
    className: className,
    style: style,
    rest: rest || {}
  };
}

function compactObject(obj) {
  var newObj = {};

  if (obj) {
    Object.keys(obj).map(function (key) {
      if (Object.prototype.hasOwnProperty.call(obj, key) && obj[key] !== undefined && typeof obj[key] !== 'undefined') {
        newObj[key] = obj[key];
      }

      return true;
    });
  }

  return newObj;
}

function isSortingDesc(d) {
  return !!(d.sort === 'desc' || d.desc === true || d.asc === false);
}

function normalizeComponent(Comp) {
  var params = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var fallback = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : Comp;
  return isElement(Comp) || typeof Comp === "string" ? Comp : isValidElementType(Comp) ? /*#__PURE__*/React.createElement(Comp, params) : fallback;
}

var Lifecycle = function Lifecycle(Base) {
  return /*#__PURE__*/function (_Base) {
    _inherits(_class, _Base);

    function _class() {
      _classCallCheck(this, _class);

      return _possibleConstructorReturn(this, _getPrototypeOf(_class).apply(this, arguments));
    }

    _createClass(_class, [{
      key: "UNSAFE_componentWillMount",
      value: function UNSAFE_componentWillMount() {
        this.setStateWithData(this.getDataModel(this.getResolvedState(), true));
      }
    }, {
      key: "componentDidMount",
      value: function componentDidMount() {
        this.fireFetchData();
      }
    }, {
      key: "UNSAFE_componentWillReceiveProps",
      value: function UNSAFE_componentWillReceiveProps(nextProps, nextState) {
        var oldState = this.getResolvedState();
        var newState = this.getResolvedState(nextProps, nextState); // Do a deep compare of new and old `defaultOption` and
        // if they are different reset `option = defaultOption`

        var defaultableOptions = ['sorted', 'filtered', 'resized', 'expanded'];
        defaultableOptions.forEach(function (x) {
          var defaultName = "default" + (x.charAt(0).toUpperCase() + x.slice(1));

          if (JSON.stringify(oldState[defaultName]) !== JSON.stringify(newState[defaultName])) {
            newState[x] = newState[defaultName];
          }
        }); // If they change these table options, we need to reset defaults
        // or else we could get into a state where the user has changed the UI
        // and then disabled the ability to change it back.
        // e.g. If `filterable` has changed, set `filtered = defaultFiltered`

        var resettableOptions = ['sortable', 'filterable', 'resizable'];
        resettableOptions.forEach(function (x) {
          if (oldState[x] !== newState[x]) {
            var baseName = x.replace('able', '');
            var optionName = baseName + "ed";
            var defaultName = "default" + (optionName.charAt(0).toUpperCase() + optionName.slice(1));
            newState[optionName] = newState[defaultName];
          }
        }); // Props that trigger a data update

        if (oldState.data !== newState.data || oldState.columns !== newState.columns || oldState.pivotBy !== newState.pivotBy || oldState.sorted !== newState.sorted || oldState.filtered !== newState.filtered) {
          this.setStateWithData(this.getDataModel(newState, oldState.data !== newState.data));
        }
      }
    }, {
      key: "setStateWithData",
      value: function setStateWithData(newState, cb) {
        var _this = this;

        var oldState = this.getResolvedState();
        var newResolvedState = this.getResolvedState({}, newState);
        var freezeWhenExpanded = newResolvedState.freezeWhenExpanded; // Default to unfrozen state

        newResolvedState.frozen = false; // If freezeWhenExpanded is set, check for frozen conditions

        if (freezeWhenExpanded) {
          // if any rows are expanded, freeze the existing data and sorting
          var keys = Object.keys(newResolvedState.expanded);

          for (var i = 0; i < keys.length; i += 1) {
            if (newResolvedState.expanded[keys[i]]) {
              newResolvedState.frozen = true;
              break;
            }
          }
        } // If the data isn't frozen and either the data or
        // sorting model has changed, update the data


        if (oldState.frozen && !newResolvedState.frozen || oldState.sorted !== newResolvedState.sorted || oldState.filtered !== newResolvedState.filtered || oldState.showFilters !== newResolvedState.showFilters || !newResolvedState.frozen && oldState.resolvedData !== newResolvedState.resolvedData) {
          // Handle collapseOnsortedChange & collapseOnDataChange
          if (oldState.sorted !== newResolvedState.sorted && this.props.collapseOnSortingChange || oldState.filtered !== newResolvedState.filtered || oldState.showFilters !== newResolvedState.showFilters || oldState.sortedData && !newResolvedState.frozen && oldState.resolvedData !== newResolvedState.resolvedData && this.props.collapseOnDataChange) {
            newResolvedState.expanded = {};
          }

          Object.assign(newResolvedState, this.getSortedData(newResolvedState));
        } // Set page to 0 if filters change


        if (oldState.filtered !== newResolvedState.filtered) {
          newResolvedState.page = 0;
        } // Calculate pageSize all the time


        if (newResolvedState.sortedData) {
          newResolvedState.pages = newResolvedState.manual ? newResolvedState.pages : Math.ceil(newResolvedState.sortedData.length / newResolvedState.pageSize);
          newResolvedState.page = newResolvedState.manual ? newResolvedState.page : Math.max(newResolvedState.page >= newResolvedState.pages ? newResolvedState.pages - 1 : newResolvedState.page, 0);
        }

        return this.setState(newResolvedState, function () {
          if (cb) {
            cb();
          }

          if (oldState.page !== newResolvedState.page || oldState.pageSize !== newResolvedState.pageSize || oldState.sorted !== newResolvedState.sorted || oldState.filtered !== newResolvedState.filtered) {
            _this.fireFetchData();
          }
        });
      }
    }]);

    return _class;
  }(Base);
};

var Methods = function Methods(Base) {
  return /*#__PURE__*/function (_Base2) {
    _inherits(_class2, _Base2);

    function _class2() {
      _classCallCheck(this, _class2);

      return _possibleConstructorReturn(this, _getPrototypeOf(_class2).apply(this, arguments));
    }

    _createClass(_class2, [{
      key: "getResolvedState",
      value: function getResolvedState(props, state) {
        var resolvedState = Object.assign({}, _.compactObject(this.state), {}, _.compactObject(this.props), {}, _.compactObject(state), {}, _.compactObject(props));
        return resolvedState;
      }
    }, {
      key: "getDataModel",
      value: function getDataModel(newState, dataChanged) {
        var _this2 = this;

        var columns = newState.columns,
            _newState$pivotBy = newState.pivotBy,
            pivotBy = _newState$pivotBy === void 0 ? [] : _newState$pivotBy,
            data = newState.data,
            resolveData = newState.resolveData,
            pivotIDKey = newState.pivotIDKey,
            pivotValKey = newState.pivotValKey,
            subRowsKey = newState.subRowsKey,
            aggregatedKey = newState.aggregatedKey,
            nestingLevelKey = newState.nestingLevelKey,
            originalKey = newState.originalKey,
            indexKey = newState.indexKey,
            groupedByPivotKey = newState.groupedByPivotKey,
            SubComponent = newState.SubComponent; // Determine Header Groups

        var hasHeaderGroups = false;
        columns.forEach(function (column) {
          if (column.columns) {
            hasHeaderGroups = true;
          }
        });

        var columnsWithExpander = _toConsumableArray(columns);

        var expanderColumn = columns.find(function (col) {
          return col.expander || col.columns && col.columns.some(function (col2) {
            return col2.expander;
          });
        }); // The actual expander might be in the columns field of a group column

        if (expanderColumn && !expanderColumn.expander) {
          expanderColumn = expanderColumn.columns.find(function (col) {
            return col.expander;
          });
        } // If we have SubComponent's we need to make sure we have an expander column


        if (SubComponent && !expanderColumn) {
          expanderColumn = {
            expander: true
          };
          columnsWithExpander = [expanderColumn].concat(_toConsumableArray(columnsWithExpander));
        }

        var makeDecoratedColumn = function makeDecoratedColumn(column, parentColumn) {
          var dcol;

          if (column.expander) {
            dcol = Object.assign({}, _this2.props.column, {}, _this2.props.expanderDefaults, {}, column);
          } else {
            dcol = Object.assign({}, _this2.props.column, {}, column);
          } // Ensure minWidth is not greater than maxWidth if set


          if (dcol.maxWidth < dcol.minWidth) {
            dcol.minWidth = dcol.maxWidth;
          }

          if (parentColumn) {
            dcol.parentColumn = parentColumn;
          } // First check for string accessor


          if (typeof dcol.accessor === 'string') {
            dcol.id = dcol.id || dcol.accessor;
            var accessorString = dcol.accessor;

            dcol.accessor = function (row) {
              return _.get(row, accessorString);
            };

            return dcol;
          } // Fall back to functional accessor (but require an ID)


          if (dcol.accessor && !dcol.id) {
            console.warn(dcol);
            throw new Error('A column id is required if using a non-string accessor for column above.');
          } // Fall back to an undefined accessor


          if (!dcol.accessor) {
            dcol.accessor = function () {
              return undefined;
            };
          }

          return dcol;
        };

        var allDecoratedColumns = []; // Decorate the columns

        var decorateAndAddToAll = function decorateAndAddToAll(column, parentColumn) {
          var decoratedColumn = makeDecoratedColumn(column, parentColumn);
          allDecoratedColumns.push(decoratedColumn);
          return decoratedColumn;
        };

        var decoratedColumns = columnsWithExpander.map(function (column) {
          if (column.columns) {
            return Object.assign({}, column, {
              columns: column.columns.map(function (d) {
                return decorateAndAddToAll(d, column);
              })
            });
          }

          return decorateAndAddToAll(column);
        }); // Build the visible columns, headers and flat column list

        var visibleColumns = decoratedColumns.slice();
        var allVisibleColumns = [];
        visibleColumns = visibleColumns.map(function (column) {
          if (column.columns) {
            var visibleSubColumns = column.columns.filter(function (d) {
              return pivotBy.indexOf(d.id) > -1 ? false : _.getFirstDefined(d.show, true);
            });
            return Object.assign({}, column, {
              columns: visibleSubColumns
            });
          }

          return column;
        });
        visibleColumns = visibleColumns.filter(function (column) {
          return column.columns ? column.columns.length : pivotBy.indexOf(column.id) > -1 ? false : _.getFirstDefined(column.show, true);
        }); // Find any custom pivot location

        var pivotIndex = visibleColumns.findIndex(function (col) {
          return col.pivot;
        }); // Handle Pivot Columns

        if (pivotBy.length) {
          // Retrieve the pivot columns in the correct pivot order
          var pivotColumns = [];
          pivotBy.forEach(function (pivotID) {
            var found = allDecoratedColumns.find(function (d) {
              return d.id === pivotID;
            });

            if (found) {
              pivotColumns.push(found);
            }
          });
          var PivotParentColumn = pivotColumns.reduce(function (prev, current) {
            return prev && prev === current.parentColumn && current.parentColumn;
          }, pivotColumns[0].parentColumn);
          var PivotGroupHeader = hasHeaderGroups && PivotParentColumn.Header;

          PivotGroupHeader = PivotGroupHeader || function () {
            return /*#__PURE__*/React.createElement("strong", null, "Pivoted");
          };

          var pivotColumnGroup = {
            Header: PivotGroupHeader,
            columns: pivotColumns.map(function (col) {
              return Object.assign({}, _this2.props.pivotDefaults, {}, col, {
                pivoted: true
              });
            }) // Place the pivotColumns back into the visibleColumns

          };

          if (pivotIndex >= 0) {
            pivotColumnGroup = Object.assign({}, visibleColumns[pivotIndex], {}, pivotColumnGroup);
            visibleColumns.splice(pivotIndex, 1, pivotColumnGroup);
          } else {
            visibleColumns.unshift(pivotColumnGroup);
          }
        } // Build Header Groups


        var headerGroups = [];
        var currentSpan = []; // A convenience function to add a header and reset the currentSpan

        var addHeader = function addHeader(columns, column) {
          headerGroups.push(Object.assign({}, _this2.props.column, {}, column, {
            columns: columns
          }));
          currentSpan = [];
        }; // Build flast list of allVisibleColumns and HeaderGroups


        visibleColumns.forEach(function (column) {
          if (column.columns) {
            allVisibleColumns = allVisibleColumns.concat(column.columns);

            if (currentSpan.length > 0) {
              addHeader(currentSpan);
            }

            addHeader(column.columns, column);
            return;
          }

          allVisibleColumns.push(column);
          currentSpan.push(column);
        });

        if (hasHeaderGroups && currentSpan.length > 0) {
          addHeader(currentSpan);
        } // Access the data


        var accessRow = function accessRow(d, i) {
          var _row;

          var level = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
          var row = (_row = {}, _defineProperty(_row, originalKey, d), _defineProperty(_row, indexKey, i), _defineProperty(_row, subRowsKey, d[subRowsKey]), _defineProperty(_row, nestingLevelKey, level), _row);
          allDecoratedColumns.forEach(function (column) {
            if (column.expander) return;
            row[column.id] = column.accessor(d);
          });

          if (row[subRowsKey]) {
            row[subRowsKey] = row[subRowsKey].map(function (d, i) {
              return accessRow(d, i, level + 1);
            });
          }

          return row;
        }; // // If the data hasn't changed, just use the cached data


        var resolvedData = this.resolvedData; // If the data has changed, run the data resolver and cache the result

        if (!this.resolvedData || dataChanged) {
          resolvedData = resolveData(data);
          this.resolvedData = resolvedData;
        } // Use the resolved data


        resolvedData = resolvedData.map(function (d, i) {
          return accessRow(d, i);
        }); // TODO: Make it possible to fabricate nested rows without pivoting

        var aggregatingColumns = allVisibleColumns.filter(function (d) {
          return !d.expander && d.aggregate;
        }); // If pivoting, recursively group the data

        var aggregate = function aggregate(rows) {
          var aggregationValues = {};
          aggregatingColumns.forEach(function (column) {
            var values = rows.map(function (d) {
              return d[column.id];
            });
            aggregationValues[column.id] = column.aggregate(values, rows);
          });
          return aggregationValues;
        };

        if (pivotBy.length) {
          var groupRecursively = function groupRecursively(rows, keys) {
            var i = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;

            // This is the last level, just return the rows
            if (i === keys.length) {
              return rows;
            } // Group the rows together for this level


            var groupedRows = Object.entries(_.groupBy(rows, keys[i])).map(function (_ref3) {
              var _ref5;

              var _ref4 = _slicedToArray(_ref3, 2),
                  key = _ref4[0],
                  value = _ref4[1];

              return _ref5 = {}, _defineProperty(_ref5, pivotIDKey, keys[i]), _defineProperty(_ref5, pivotValKey, key), _defineProperty(_ref5, keys[i], key), _defineProperty(_ref5, subRowsKey, value), _defineProperty(_ref5, nestingLevelKey, i), _defineProperty(_ref5, groupedByPivotKey, true), _ref5;
            }); // Recurse into the subRows

            groupedRows = groupedRows.map(function (rowGroup) {
              var _Object$assign;

              var subRows = groupRecursively(rowGroup[subRowsKey], keys, i + 1);
              return Object.assign({}, rowGroup, (_Object$assign = {}, _defineProperty(_Object$assign, subRowsKey, subRows), _defineProperty(_Object$assign, aggregatedKey, true), _Object$assign), aggregate(subRows));
            });
            return groupedRows;
          };

          resolvedData = groupRecursively(resolvedData, pivotBy);
        }

        return Object.assign({}, newState, {
          resolvedData: resolvedData,
          allVisibleColumns: allVisibleColumns,
          headerGroups: headerGroups,
          allDecoratedColumns: allDecoratedColumns,
          hasHeaderGroups: hasHeaderGroups
        });
      }
    }, {
      key: "getSortedData",
      value: function getSortedData(resolvedState) {
        var manual = resolvedState.manual,
            sorted = resolvedState.sorted,
            filtered = resolvedState.filtered,
            defaultFilterMethod = resolvedState.defaultFilterMethod,
            resolvedData = resolvedState.resolvedData,
            allDecoratedColumns = resolvedState.allDecoratedColumns;
        var sortMethodsByColumnID = {};
        allDecoratedColumns.filter(function (col) {
          return col.sortMethod;
        }).forEach(function (col) {
          sortMethodsByColumnID[col.id] = col.sortMethod;
        }); // Resolve the data from either manual data or sorted data

        return {
          sortedData: manual ? resolvedData : this.sortData(this.filterData(resolvedData, filtered, defaultFilterMethod, allDecoratedColumns), sorted, sortMethodsByColumnID)
        };
      }
    }, {
      key: "fireFetchData",
      value: function fireFetchData() {
        // determine the current state, preferring certain state values over props
        var currentState = Object.assign({}, this.getResolvedState(), {
          page: this.getStateOrProp('page'),
          pageSize: this.getStateOrProp('pageSize'),
          filter: this.getStateOrProp('filter')
        });
        this.props.onFetchData(currentState, this);
      }
    }, {
      key: "getPropOrState",
      value: function getPropOrState(key) {
        return _.getFirstDefined(this.props[key], this.state[key]);
      }
    }, {
      key: "getStateOrProp",
      value: function getStateOrProp(key) {
        return _.getFirstDefined(this.state[key], this.props[key]);
      }
    }, {
      key: "filterData",
      value: function filterData(data, filtered, defaultFilterMethod, allVisibleColumns) {
        var _this3 = this;

        var filteredData = data;

        if (filtered.length) {
          filteredData = filtered.reduce(function (filteredSoFar, nextFilter) {
            var column = allVisibleColumns.find(function (x) {
              return x.id === nextFilter.id;
            }); // Don't filter hidden columns or columns that have had their filters disabled

            if (!column || column.filterable === false) {
              return filteredSoFar;
            }

            var filterMethod = column.filterMethod || defaultFilterMethod; // If 'filterAll' is set to true, pass the entire dataset to the filter method

            if (column.filterAll) {
              return filterMethod(nextFilter, filteredSoFar, column);
            }

            return filteredSoFar.filter(function (row) {
              return filterMethod(nextFilter, row, column);
            });
          }, filteredData); // Apply the filter to the subrows if we are pivoting, and then
          // filter any rows without subcolumns because it would be strange to show

          filteredData = filteredData.map(function (row) {
            if (!row[_this3.props.subRowsKey]) {
              return row;
            }

            return Object.assign({}, row, _defineProperty({}, _this3.props.subRowsKey, _this3.filterData(row[_this3.props.subRowsKey], filtered, defaultFilterMethod, allVisibleColumns)));
          }).filter(function (row) {
            if (!row[_this3.props.subRowsKey]) {
              return true;
            }

            return row[_this3.props.subRowsKey].length > 0;
          });
        }

        return filteredData;
      }
    }, {
      key: "sortData",
      value: function sortData(data, sorted) {
        var _this4 = this;

        var sortMethodsByColumnID = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

        if (!sorted.length) {
          return data;
        }

        var sortedData = (this.props.orderByMethod || _.orderBy)(data, sorted.map(function (sort) {
          // Support custom sorting methods for each column
          if (sortMethodsByColumnID[sort.id]) {
            return function (a, b) {
              return sortMethodsByColumnID[sort.id](a[sort.id], b[sort.id], sort.desc);
            };
          }

          return function (a, b) {
            return _this4.props.defaultSortMethod(a[sort.id], b[sort.id], sort.desc);
          };
        }), sorted.map(function (d) {
          return !d.desc;
        }), this.props.indexKey);

        sortedData.forEach(function (row) {
          if (!row[_this4.props.subRowsKey]) {
            return;
          }

          row[_this4.props.subRowsKey] = _this4.sortData(row[_this4.props.subRowsKey], sorted, sortMethodsByColumnID);
        });
        return sortedData;
      }
    }, {
      key: "getMinRows",
      value: function getMinRows() {
        return _.getFirstDefined(this.props.minRows, this.getStateOrProp('pageSize'));
      } // User actions

    }, {
      key: "onPageChange",
      value: function onPageChange(page) {
        var _this$props = this.props,
            onPageChange = _this$props.onPageChange,
            collapseOnPageChange = _this$props.collapseOnPageChange;
        var newState = {
          page: page
        };

        if (collapseOnPageChange) {
          newState.expanded = {};
        }

        this.setStateWithData(newState, function () {
          return onPageChange && onPageChange(page);
        });
      }
    }, {
      key: "onPageSizeChange",
      value: function onPageSizeChange(newPageSize) {
        var onPageSizeChange = this.props.onPageSizeChange;

        var _this$getResolvedStat = this.getResolvedState(),
            pageSize = _this$getResolvedStat.pageSize,
            page = _this$getResolvedStat.page; // Normalize the page to display


        var currentRow = pageSize * page;
        var newPage = Math.floor(currentRow / newPageSize);
        this.setStateWithData({
          pageSize: newPageSize,
          page: newPage
        }, function () {
          return onPageSizeChange && onPageSizeChange(newPageSize, newPage);
        });
      }
    }, {
      key: "sortColumn",
      value: function sortColumn(column, additive) {
        var _this$getResolvedStat2 = this.getResolvedState(),
            sorted = _this$getResolvedStat2.sorted,
            skipNextSort = _this$getResolvedStat2.skipNextSort,
            defaultSortDesc = _this$getResolvedStat2.defaultSortDesc;

        var firstSortDirection = Object.prototype.hasOwnProperty.call(column, 'defaultSortDesc') ? column.defaultSortDesc : defaultSortDesc;
        var secondSortDirection = !firstSortDirection; // we can't stop event propagation from the column resize move handlers
        // attached to the document because of react's synthetic events
        // so we have to prevent the sort function from actually sorting
        // if we click on the column resize element within a header.

        if (skipNextSort) {
          this.setStateWithData({
            skipNextSort: false
          });
          return;
        }

        var onSortedChange = this.props.onSortedChange;

        var newSorted = _.clone(sorted || []).map(function (d) {
          d.desc = _.isSortingDesc(d);
          return d;
        });

        if (!_.isArray(column)) {
          // Single-Sort
          var existingIndex = newSorted.findIndex(function (d) {
            return d.id === column.id;
          });

          if (existingIndex > -1) {
            var existing = newSorted[existingIndex];

            if (existing.desc === secondSortDirection) {
              if (additive) {
                newSorted.splice(existingIndex, 1);
              } else {
                existing.desc = firstSortDirection;
                newSorted = [existing];
              }
            } else {
              existing.desc = secondSortDirection;

              if (!additive) {
                newSorted = [existing];
              }
            }
          } else if (additive) {
            newSorted.push({
              id: column.id,
              desc: firstSortDirection
            });
          } else {
            newSorted = [{
              id: column.id,
              desc: firstSortDirection
            }];
          }
        } else {
          // Multi-Sort
          var _existingIndex = newSorted.findIndex(function (d) {
            return d.id === column[0].id;
          }); // Existing Sorted Column


          if (_existingIndex > -1) {
            var _existing = newSorted[_existingIndex];

            if (_existing.desc === secondSortDirection) {
              if (additive) {
                newSorted.splice(_existingIndex, column.length);
              } else {
                column.forEach(function (d, i) {
                  newSorted[_existingIndex + i].desc = firstSortDirection;
                });
              }
            } else {
              column.forEach(function (d, i) {
                newSorted[_existingIndex + i].desc = secondSortDirection;
              });
            }

            if (!additive) {
              newSorted = newSorted.slice(_existingIndex, column.length);
            } // New Sort Column

          } else if (additive) {
            newSorted = newSorted.concat(column.map(function (d) {
              return {
                id: d.id,
                desc: firstSortDirection
              };
            }));
          } else {
            newSorted = column.map(function (d) {
              return {
                id: d.id,
                desc: firstSortDirection
              };
            });
          }
        }

        this.setStateWithData({
          page: !sorted.length && newSorted.length || !additive ? 0 : this.state.page,
          sorted: newSorted
        }, function () {
          return onSortedChange && onSortedChange(newSorted, column, additive);
        });
      }
    }, {
      key: "filterColumn",
      value: function filterColumn(column, value) {
        var _this$getResolvedStat3 = this.getResolvedState(),
            filtered = _this$getResolvedStat3.filtered;

        var onFilteredChange = this.props.onFilteredChange; // Remove old filter first if it exists

        var newFiltering = (filtered || []).filter(function (x) {
          return x.id !== column.id;
        });

        if (value !== '') {
          newFiltering.push({
            id: column.id,
            value: value
          });
        }

        this.setStateWithData({
          filtered: newFiltering
        }, function () {
          return onFilteredChange && onFilteredChange(newFiltering, column, value);
        });
      }
    }, {
      key: "resizeColumnStart",
      value: function resizeColumnStart(event, column, isTouch) {
        var _this5 = this;

        event.stopPropagation();
        var parentWidth = event.target.parentElement.getBoundingClientRect().width;
        var pageX;

        if (isTouch) {
          pageX = event.changedTouches[0].pageX;
        } else {
          pageX = event.pageX;
        }

        this.trapEvents = true;
        this.setStateWithData({
          currentlyResizing: {
            id: column.id,
            startX: pageX,
            parentWidth: parentWidth
          }
        }, function () {
          if (isTouch) {
            document.addEventListener('touchmove', _this5.resizeColumnMoving);
            document.addEventListener('touchcancel', _this5.resizeColumnEnd);
            document.addEventListener('touchend', _this5.resizeColumnEnd);
          } else {
            document.addEventListener('mousemove', _this5.resizeColumnMoving);
            document.addEventListener('mouseup', _this5.resizeColumnEnd);
            document.addEventListener('mouseleave', _this5.resizeColumnEnd);
          }
        });
      }
    }, {
      key: "resizeColumnMoving",
      value: function resizeColumnMoving(event) {
        event.stopPropagation();
        var _this$props2 = this.props,
            onResizedChange = _this$props2.onResizedChange,
            column = _this$props2.column;

        var _this$getResolvedStat4 = this.getResolvedState(),
            resized = _this$getResolvedStat4.resized,
            currentlyResizing = _this$getResolvedStat4.currentlyResizing,
            columns = _this$getResolvedStat4.columns;

        var currentColumn = columns.find(function (c) {
          return c.accessor === currentlyResizing.id || c.id === currentlyResizing.id;
        });
        var minResizeWidth = currentColumn && currentColumn.minResizeWidth != null ? currentColumn.minResizeWidth : column.minResizeWidth; // Delete old value

        var newResized = resized.filter(function (x) {
          return x.id !== currentlyResizing.id;
        });
        var pageX;

        if (event.type === 'touchmove') {
          pageX = event.changedTouches[0].pageX;
        } else if (event.type === 'mousemove') {
          pageX = event.pageX;
        }

        var newWidth = Math.max(currentlyResizing.parentWidth + pageX - currentlyResizing.startX, minResizeWidth);
        newResized.push({
          id: currentlyResizing.id,
          value: newWidth
        });
        this.setStateWithData({
          resized: newResized
        }, function () {
          return onResizedChange && onResizedChange(newResized, event);
        });
      }
    }, {
      key: "resizeColumnEnd",
      value: function resizeColumnEnd(event) {
        event.stopPropagation();
        var isTouch = event.type === 'touchend' || event.type === 'touchcancel';

        if (isTouch) {
          document.removeEventListener('touchmove', this.resizeColumnMoving);
          document.removeEventListener('touchcancel', this.resizeColumnEnd);
          document.removeEventListener('touchend', this.resizeColumnEnd);
        } // If its a touch event clear the mouse one's as well because sometimes
        // the mouseDown event gets called as well, but the mouseUp event doesn't


        document.removeEventListener('mousemove', this.resizeColumnMoving);
        document.removeEventListener('mouseup', this.resizeColumnEnd);
        document.removeEventListener('mouseleave', this.resizeColumnEnd); // The touch events don't propagate up to the sorting's onMouseDown event so
        // no need to prevent it from happening or else the first click after a touch
        // event resize will not sort the column.

        if (!isTouch) {
          this.setStateWithData({
            skipNextSort: true,
            currentlyResizing: false
          });
        }
      }
    }]);

    return _class2;
  }(Base);
};

var defaultButton = function defaultButton(props) {
  return /*#__PURE__*/React.createElement("button", _extends({
    type: "button"
  }, props, {
    className: "-btn"
  }), props.children);
};

var ReactTablePagination = /*#__PURE__*/function (_Component) {
  _inherits(ReactTablePagination, _Component);

  function ReactTablePagination(props) {
    var _this6;

    _classCallCheck(this, ReactTablePagination);

    _this6 = _possibleConstructorReturn(this, _getPrototypeOf(ReactTablePagination).call(this, props));
    _this6.getSafePage = _this6.getSafePage.bind(_assertThisInitialized(_this6));
    _this6.changePage = _this6.changePage.bind(_assertThisInitialized(_this6));
    _this6.applyPage = _this6.applyPage.bind(_assertThisInitialized(_this6));
    _this6.state = {
      page: props.page
    };
    return _this6;
  }

  _createClass(ReactTablePagination, [{
    key: "UNSAFE_componentWillReceiveProps",
    value: function UNSAFE_componentWillReceiveProps(nextProps) {
      if (this.props.page !== nextProps.page) {
        this.setState({
          page: nextProps.page
        });
      }
    }
  }, {
    key: "getSafePage",
    value: function getSafePage(page) {
      if (Number.isNaN(page)) {
        page = this.props.page;
      }

      return Math.min(Math.max(page, 0), this.props.pages - 1);
    }
  }, {
    key: "changePage",
    value: function changePage(page) {
      page = this.getSafePage(page);
      this.setState({
        page: page
      });

      if (this.props.page !== page) {
        this.props.onPageChange(page);
      }
    }
  }, {
    key: "applyPage",
    value: function applyPage(e) {
      if (e) {
        e.preventDefault();
      }

      var page = this.state.page;
      this.changePage(page === '' ? this.props.page : page);
    }
  }, {
    key: "getPageJumpProperties",
    value: function getPageJumpProperties() {
      var _this7 = this;

      return {
        onKeyPress: function onKeyPress(e) {
          if (e.which === 13 || e.keyCode === 13) {
            _this7.applyPage();
          }
        },
        onBlur: this.applyPage,
        value: this.state.page === '' ? '' : this.state.page + 1,
        onChange: function onChange(e) {
          var val = e.target.value;
          var page = val - 1;

          if (val === '') {
            return _this7.setState({
              page: val
            });
          }

          _this7.setState({
            page: _this7.getSafePage(page)
          });
        },
        inputType: this.state.page === '' ? 'text' : 'number',
        pageJumpText: this.props.pageJumpText
      };
    }
  }, {
    key: "render",
    value: function render() {
      var _this8 = this;

      var _this$props3 = this.props,
          pages = _this$props3.pages,
          page = _this$props3.page,
          showPageSizeOptions = _this$props3.showPageSizeOptions,
          pageSizeOptions = _this$props3.pageSizeOptions,
          pageSize = _this$props3.pageSize,
          showPageJump = _this$props3.showPageJump,
          canPrevious = _this$props3.canPrevious,
          canNext = _this$props3.canNext,
          onPageSizeChange = _this$props3.onPageSizeChange,
          className = _this$props3.className,
          PreviousComponent = _this$props3.PreviousComponent,
          NextComponent = _this$props3.NextComponent,
          renderPageJump = _this$props3.renderPageJump,
          renderCurrentPage = _this$props3.renderCurrentPage,
          renderTotalPagesCount = _this$props3.renderTotalPagesCount,
          renderPageSizeOptions = _this$props3.renderPageSizeOptions;
      return /*#__PURE__*/React.createElement("div", {
        className: classnames(className, '-pagination'),
        style: this.props.style
      }, /*#__PURE__*/React.createElement("div", {
        className: "-previous"
      }, /*#__PURE__*/React.createElement(PreviousComponent, {
        onClick: function onClick() {
          if (!canPrevious) return;

          _this8.changePage(page - 1);
        },
        disabled: !canPrevious
      }, this.props.previousText)), /*#__PURE__*/React.createElement("div", {
        className: "-center"
      }, /*#__PURE__*/React.createElement("span", {
        className: "-pageInfo"
      }, this.props.pageText, ' ', showPageJump ? renderPageJump(this.getPageJumpProperties()) : renderCurrentPage(page), ' ', this.props.ofText, " ", renderTotalPagesCount(pages)), showPageSizeOptions && renderPageSizeOptions({
        pageSize: pageSize,
        rowsSelectorText: this.props.rowsSelectorText,
        pageSizeOptions: pageSizeOptions,
        onPageSizeChange: onPageSizeChange,
        rowsText: this.props.rowsText
      })), /*#__PURE__*/React.createElement("div", {
        className: "-next"
      }, /*#__PURE__*/React.createElement(NextComponent, {
        onClick: function onClick() {
          if (!canNext) return;

          _this8.changePage(page + 1);
        },
        disabled: !canNext
      }, this.props.nextText)));
    }
  }]);

  return ReactTablePagination;
}(Component);

ReactTablePagination.defaultProps = {
  PreviousComponent: defaultButton,
  NextComponent: defaultButton,
  renderPageJump: function renderPageJump(_ref6) {
    var onChange = _ref6.onChange,
        value = _ref6.value,
        onBlur = _ref6.onBlur,
        onKeyPress = _ref6.onKeyPress,
        inputType = _ref6.inputType,
        pageJumpText = _ref6.pageJumpText;
    return /*#__PURE__*/React.createElement("div", {
      className: "-pageJump"
    }, /*#__PURE__*/React.createElement("input", {
      "aria-label": pageJumpText,
      type: inputType,
      onChange: onChange,
      value: value,
      onBlur: onBlur,
      onKeyPress: onKeyPress
    }));
  },
  renderCurrentPage: function renderCurrentPage(page) {
    return /*#__PURE__*/React.createElement("span", {
      className: "-currentPage"
    }, page + 1);
  },
  renderTotalPagesCount: function renderTotalPagesCount(pages) {
    return /*#__PURE__*/React.createElement("span", {
      className: "-totalPages"
    }, pages || 1);
  },
  renderPageSizeOptions: function renderPageSizeOptions(_ref7) {
    var pageSize = _ref7.pageSize,
        pageSizeOptions = _ref7.pageSizeOptions,
        rowsSelectorText = _ref7.rowsSelectorText,
        onPageSizeChange = _ref7.onPageSizeChange,
        rowsText = _ref7.rowsText;
    return /*#__PURE__*/React.createElement("span", {
      className: "select-wrap -pageSizeOptions"
    }, /*#__PURE__*/React.createElement("select", {
      "aria-label": rowsSelectorText,
      onChange: function onChange(e) {
        return onPageSizeChange(Number(e.target.value));
      },
      value: pageSize
    }, pageSizeOptions.map(function (option, i) {
      return (
        /*#__PURE__*/
        // eslint-disable-next-line react/no-array-index-key
        React.createElement("option", {
          key: i,
          value: option
        }, option + " " + rowsText)
      );
    })));
  }
};

var emptyObj = function emptyObj() {
  return {};
};

var defaultProps = {
  // General
  data: [],
  resolveData: function resolveData(data) {
    return data;
  },
  loading: false,
  showPagination: true,
  showPaginationTop: false,
  showPaginationBottom: true,
  showPageSizeOptions: true,
  pageSizeOptions: [5, 10, 20, 25, 50, 100],
  defaultPage: 0,
  defaultPageSize: 20,
  showPageJump: true,
  collapseOnSortingChange: true,
  collapseOnPageChange: true,
  collapseOnDataChange: true,
  freezeWhenExpanded: false,
  sortable: true,
  multiSort: true,
  resizable: true,
  filterable: false,
  defaultSortDesc: false,
  defaultSorted: [],
  defaultFiltered: [],
  defaultResized: [],
  defaultExpanded: {},
  // eslint-disable-next-line no-unused-vars
  defaultFilterMethod: function defaultFilterMethod(filter, row, column) {
    var id = filter.pivotId || filter.id;
    return row[id] !== undefined ? String(row[id]).startsWith(filter.value) : true;
  },
  // eslint-disable-next-line no-unused-vars
  defaultSortMethod: function defaultSortMethod(a, b, desc) {
    // force null and undefined to the bottom
    a = a === null || a === undefined ? '' : a;
    b = b === null || b === undefined ? '' : b; // force any string values to lowercase

    a = typeof a === 'string' ? a.toLowerCase() : a;
    b = typeof b === 'string' ? b.toLowerCase() : b; // Return either 1 or -1 to indicate a sort priority

    if (a > b) {
      return 1;
    }

    if (a < b) {
      return -1;
    } // returning 0, undefined or any falsey value will use subsequent sorts or
    // the index as a tiebreaker


    return 0;
  },
  // Controlled State Props
  // page: undefined,
  // pageSize: undefined,
  // sorted: [],
  // filtered: [],
  // resized: [],
  // expanded: {},
  // Controlled State Callbacks
  onPageChange: undefined,
  onPageSizeChange: undefined,
  onSortedChange: undefined,
  onFilteredChange: undefined,
  onResizedChange: undefined,
  onExpandedChange: undefined,
  // Pivoting
  pivotBy: undefined,
  // Key Constants
  pivotValKey: '_pivotVal',
  pivotIDKey: '_pivotID',
  subRowsKey: '_subRows',
  aggregatedKey: '_aggregated',
  nestingLevelKey: '_nestingLevel',
  originalKey: '_original',
  indexKey: '_index',
  groupedByPivotKey: '_groupedByPivot',
  // Server-side Callbacks
  onFetchData: function onFetchData() {
    return null;
  },
  // Classes
  className: '',
  style: {},
  // Component decorators
  getProps: emptyObj,
  getTableProps: emptyObj,
  getTheadGroupProps: emptyObj,
  getTheadGroupTrProps: emptyObj,
  getTheadGroupThProps: emptyObj,
  getTheadProps: emptyObj,
  getTheadTrProps: emptyObj,
  getTheadThProps: emptyObj,
  getTheadFilterProps: emptyObj,
  getTheadFilterTrProps: emptyObj,
  getTheadFilterThProps: emptyObj,
  getTbodyProps: emptyObj,
  getTrGroupProps: emptyObj,
  getTrProps: emptyObj,
  getTdProps: emptyObj,
  getTfootProps: emptyObj,
  getTfootTrProps: emptyObj,
  getTfootTdProps: emptyObj,
  getPaginationProps: emptyObj,
  getLoadingProps: emptyObj,
  getNoDataProps: emptyObj,
  getResizerProps: emptyObj,
  // Global Column Defaults
  column: {
    // Renderers
    Cell: undefined,
    Header: undefined,
    Footer: undefined,
    Aggregated: undefined,
    Pivot: undefined,
    PivotValue: undefined,
    Expander: undefined,
    Filter: undefined,
    Placeholder: undefined,
    // All Columns
    sortable: undefined,
    // use table default
    resizable: undefined,
    // use table default
    filterable: undefined,
    // use table default
    show: true,
    minWidth: 100,
    minResizeWidth: 11,
    // Cells only
    className: '',
    style: {},
    getProps: emptyObj,
    // Pivot only
    aggregate: undefined,
    // Headers only
    headerClassName: '',
    headerStyle: {},
    getHeaderProps: emptyObj,
    // Footers only
    footerClassName: '',
    footerStyle: {},
    getFooterProps: emptyObj,
    filterMethod: undefined,
    filterAll: false,
    sortMethod: undefined
  },
  // Global Expander Column Defaults
  expanderDefaults: {
    sortable: false,
    resizable: false,
    filterable: false,
    width: 35
  },
  pivotDefaults: {// extend the defaults for pivoted columns here
  },
  // Text
  previousText: 'Previous',
  nextText: 'Next',
  loadingText: 'Loading...',
  noDataText: 'No rows found',
  pageText: 'Page',
  ofText: 'of',
  rowsText: 'rows',
  pageJumpText: 'jump to page',
  rowsSelectorText: 'rows per page',
  // Components
  TableComponent: function TableComponent(_ref8) {
    var children = _ref8.children,
        className = _ref8.className,
        rest = _objectWithoutProperties(_ref8, ["children", "className"]);

    return /*#__PURE__*/React.createElement("div", _extends({
      className: classnames('rt-table', className),
      role: "grid" // tabIndex='0'

    }, rest), children);
  },
  TheadComponent: _.makeTemplateComponent('rt-thead', 'Thead'),
  TbodyComponent: _.makeTemplateComponent('rt-tbody', 'Tbody'),
  TrGroupComponent: function TrGroupComponent(_ref9) {
    var children = _ref9.children,
        className = _ref9.className,
        rest = _objectWithoutProperties(_ref9, ["children", "className"]);

    return /*#__PURE__*/React.createElement("div", _extends({
      className: classnames('rt-tr-group', className),
      role: "rowgroup"
    }, rest), children);
  },
  TrComponent: function TrComponent(_ref10) {
    var children = _ref10.children,
        className = _ref10.className,
        rest = _objectWithoutProperties(_ref10, ["children", "className"]);

    return /*#__PURE__*/React.createElement("div", _extends({
      className: classnames('rt-tr', className),
      role: "row"
    }, rest), children);
  },
  ThComponent: function ThComponent(_ref11) {
    var toggleSort = _ref11.toggleSort,
        className = _ref11.className,
        children = _ref11.children,
        rest = _objectWithoutProperties(_ref11, ["toggleSort", "className", "children"]);

    return (
      /*#__PURE__*/
      // eslint-disable-next-line jsx-a11y/click-events-have-key-events
      React.createElement("div", _extends({
        className: classnames('rt-th', className),
        onClick: function onClick(e) {
          return toggleSort && toggleSort(e);
        },
        role: "columnheader",
        tabIndex: "-1" // Resolves eslint issues without implementing keyboard navigation incorrectly

      }, rest), children)
    );
  },
  TdComponent: function TdComponent(_ref12) {
    var toggleSort = _ref12.toggleSort,
        className = _ref12.className,
        children = _ref12.children,
        rest = _objectWithoutProperties(_ref12, ["toggleSort", "className", "children"]);

    return /*#__PURE__*/React.createElement("div", _extends({
      className: classnames('rt-td', className),
      role: "gridcell"
    }, rest), children);
  },
  TfootComponent: _.makeTemplateComponent('rt-tfoot', 'Tfoot'),
  FilterComponent: function FilterComponent(_ref13) {
    var filter = _ref13.filter,
        _onChange = _ref13.onChange,
        column = _ref13.column;
    return /*#__PURE__*/React.createElement("input", {
      type: "text",
      style: {
        width: '100%'
      },
      placeholder: column.Placeholder,
      value: filter ? filter.value : '',
      onChange: function onChange(event) {
        return _onChange(event.target.value);
      }
    });
  },
  ExpanderComponent: function ExpanderComponent(_ref14) {
    var isExpanded = _ref14.isExpanded;
    return /*#__PURE__*/React.createElement("div", {
      className: 'rt-expander' + (isExpanded ? " -open" : "")
    }, "\u2022");
  },
  PivotValueComponent: function PivotValueComponent(_ref15) {
    var subRows = _ref15.subRows,
        value = _ref15.value;
    return /*#__PURE__*/React.createElement("span", null, value, " ", subRows && "(" + subRows.length + ")");
  },
  AggregatedComponent: function AggregatedComponent(_ref16) {
    var subRows = _ref16.subRows,
        column = _ref16.column;
    var previewValues = subRows.filter(function (d) {
      return typeof d[column.id] !== 'undefined';
    }).map(function (row, i) {
      return (
        /*#__PURE__*/
        // eslint-disable-next-line react/no-array-index-key
        React.createElement("span", {
          key: i
        }, row[column.id], i < subRows.length - 1 ? ', ' : '')
      );
    });
    return /*#__PURE__*/React.createElement("span", null, previewValues);
  },
  PivotComponent: undefined,
  // this is a computed default generated using
  // the ExpanderComponent and PivotValueComponent at run-time in methods.js
  PaginationComponent: ReactTablePagination,
  PreviousComponent: undefined,
  NextComponent: undefined,
  LoadingComponent: function LoadingComponent(_ref17) {
    var className = _ref17.className,
        loading = _ref17.loading,
        loadingText = _ref17.loadingText,
        rest = _objectWithoutProperties(_ref17, ["className", "loading", "loadingText"]);

    return /*#__PURE__*/React.createElement("div", _extends({
      className: classnames('-loading', className, loading && '-active')
    }, rest), /*#__PURE__*/React.createElement("div", {
      className: "-loading-inner"
    }, loadingText));
  },
  NoDataComponent: _.makeTemplateComponent('rt-noData', 'NoData'),
  ResizerComponent: _.makeTemplateComponent('rt-resizer', 'Resizer'),
  PadRowComponent: function PadRowComponent() {
    return /*#__PURE__*/React.createElement("span", null, "\xA0");
  }
};
var propTypes = process.env.NODE_ENV !== "production" ? {
  // General
  data: PropTypes.any,
  loading: PropTypes.bool,
  showPagination: PropTypes.bool,
  showPaginationTop: PropTypes.bool,
  showPaginationBottom: PropTypes.bool,
  showPageSizeOptions: PropTypes.bool,
  pageSizeOptions: PropTypes.array,
  defaultPageSize: PropTypes.number,
  showPageJump: PropTypes.bool,
  collapseOnSortingChange: PropTypes.bool,
  collapseOnPageChange: PropTypes.bool,
  collapseOnDataChange: PropTypes.bool,
  freezeWhenExpanded: PropTypes.bool,
  sortable: PropTypes.bool,
  resizable: PropTypes.bool,
  filterable: PropTypes.bool,
  defaultSortDesc: PropTypes.bool,
  defaultSorted: PropTypes.array,
  defaultFiltered: PropTypes.array,
  defaultResized: PropTypes.array,
  defaultExpanded: PropTypes.object,
  defaultFilterMethod: PropTypes.func,
  defaultSortMethod: PropTypes.func,
  // Controlled State Callbacks
  onPageChange: PropTypes.func,
  onPageSizeChange: PropTypes.func,
  onSortedChange: PropTypes.func,
  onFilteredChange: PropTypes.func,
  onResizedChange: PropTypes.func,
  onExpandedChange: PropTypes.func,
  // Pivoting
  pivotBy: PropTypes.array,
  // Key Constants
  pivotValKey: PropTypes.string,
  pivotIDKey: PropTypes.string,
  subRowsKey: PropTypes.string,
  aggregatedKey: PropTypes.string,
  nestingLevelKey: PropTypes.string,
  originalKey: PropTypes.string,
  indexKey: PropTypes.string,
  groupedByPivotKey: PropTypes.string,
  // Server-side Callbacks
  onFetchData: PropTypes.func,
  // Classes
  className: PropTypes.string,
  style: PropTypes.object,
  // Component decorators
  getProps: PropTypes.func,
  getTableProps: PropTypes.func,
  getTheadGroupProps: PropTypes.func,
  getTheadGroupTrProps: PropTypes.func,
  getTheadGroupThProps: PropTypes.func,
  getTheadProps: PropTypes.func,
  getTheadTrProps: PropTypes.func,
  getTheadThProps: PropTypes.func,
  getTheadFilterProps: PropTypes.func,
  getTheadFilterTrProps: PropTypes.func,
  getTheadFilterThProps: PropTypes.func,
  getTbodyProps: PropTypes.func,
  getTrGroupProps: PropTypes.func,
  getTrProps: PropTypes.func,
  getTdProps: PropTypes.func,
  getTfootProps: PropTypes.func,
  getTfootTrProps: PropTypes.func,
  getTfootTdProps: PropTypes.func,
  getPaginationProps: PropTypes.func,
  getLoadingProps: PropTypes.func,
  getNoDataProps: PropTypes.func,
  getResizerProps: PropTypes.func,
  // Global Column Defaults
  columns: PropTypes.arrayOf(PropTypes.shape({
    // Renderers
    Cell: PropTypes.oneOfType([PropTypes.element, PropTypes.string, PropTypes.elementType]),
    Header: PropTypes.oneOfType([PropTypes.element, PropTypes.string, PropTypes.elementType]),
    Footer: PropTypes.oneOfType([PropTypes.element, PropTypes.string, PropTypes.elementType]),
    Aggregated: PropTypes.oneOfType([PropTypes.element, PropTypes.string, PropTypes.elementType]),
    Pivot: PropTypes.oneOfType([PropTypes.element, PropTypes.string, PropTypes.elementType]),
    PivotValue: PropTypes.oneOfType([PropTypes.element, PropTypes.string, PropTypes.elementType]),
    Expander: PropTypes.oneOfType([PropTypes.element, PropTypes.string, PropTypes.elementType]),
    Filter: PropTypes.oneOfType([PropTypes.element, PropTypes.elementType]),
    // All Columns
    sortable: PropTypes.bool,
    // use table default
    resizable: PropTypes.bool,
    // use table default
    filterable: PropTypes.bool,
    // use table default
    show: PropTypes.bool,
    minWidth: PropTypes.number,
    minResizeWidth: PropTypes.number,
    // Cells only
    className: PropTypes.string,
    style: PropTypes.object,
    getProps: PropTypes.func,
    // Pivot only
    aggregate: PropTypes.func,
    // Headers only
    headerClassName: PropTypes.string,
    headerStyle: PropTypes.object,
    getHeaderProps: PropTypes.func,
    // Footers only
    footerClassName: PropTypes.string,
    footerStyle: PropTypes.object,
    getFooterProps: PropTypes.func,
    filterMethod: PropTypes.func,
    filterAll: PropTypes.bool,
    sortMethod: PropTypes.func
  })),
  // Global Expander Column Defaults
  expanderDefaults: PropTypes.shape({
    sortable: PropTypes.bool,
    resizable: PropTypes.bool,
    filterable: PropTypes.bool,
    width: PropTypes.number
  }),
  pivotDefaults: PropTypes.object,
  // Text
  previousText: PropTypes.node,
  nextText: PropTypes.node,
  loadingText: PropTypes.node,
  noDataText: PropTypes.node,
  pageText: PropTypes.node,
  ofText: PropTypes.node,
  rowsText: PropTypes.node,
  pageJumpText: PropTypes.node,
  rowsSelectorText: PropTypes.node,
  // Components
  TableComponent: PropTypes.elementType,
  TheadComponent: PropTypes.elementType,
  TbodyComponent: PropTypes.elementType,
  TrGroupComponent: PropTypes.elementType,
  TrComponent: PropTypes.elementType,
  ThComponent: PropTypes.elementType,
  TdComponent: PropTypes.elementType,
  TfootComponent: PropTypes.elementType,
  FilterComponent: PropTypes.elementType,
  ExpanderComponent: PropTypes.elementType,
  PivotValueComponent: PropTypes.elementType,
  AggregatedComponent: PropTypes.elementType,
  // this is a computed default generated using
  PivotComponent: PropTypes.elementType,
  // the ExpanderComponent and PivotValueComponent at run-time in methods.js
  PaginationComponent: PropTypes.elementType,
  PreviousComponent: PropTypes.elementType,
  NextComponent: PropTypes.elementType,
  LoadingComponent: PropTypes.elementType,
  NoDataComponent: PropTypes.elementType,
  ResizerComponent: PropTypes.elementType,
  PadRowComponent: PropTypes.elementType
} : {};
var ReactTableDefaults = defaultProps;

var ReactTable = /*#__PURE__*/function (_Methods) {
  _inherits(ReactTable, _Methods);

  function ReactTable(props) {
    var _this9;

    _classCallCheck(this, ReactTable);

    _this9 = _possibleConstructorReturn(this, _getPrototypeOf(ReactTable).call(this));
    _this9.getResolvedState = _this9.getResolvedState.bind(_assertThisInitialized(_this9));
    _this9.getDataModel = _this9.getDataModel.bind(_assertThisInitialized(_this9));
    _this9.getSortedData = _this9.getSortedData.bind(_assertThisInitialized(_this9));
    _this9.fireFetchData = _this9.fireFetchData.bind(_assertThisInitialized(_this9));
    _this9.getPropOrState = _this9.getPropOrState.bind(_assertThisInitialized(_this9));
    _this9.getStateOrProp = _this9.getStateOrProp.bind(_assertThisInitialized(_this9));
    _this9.filterData = _this9.filterData.bind(_assertThisInitialized(_this9));
    _this9.sortData = _this9.sortData.bind(_assertThisInitialized(_this9));
    _this9.getMinRows = _this9.getMinRows.bind(_assertThisInitialized(_this9));
    _this9.onPageChange = _this9.onPageChange.bind(_assertThisInitialized(_this9));
    _this9.onPageSizeChange = _this9.onPageSizeChange.bind(_assertThisInitialized(_this9));
    _this9.sortColumn = _this9.sortColumn.bind(_assertThisInitialized(_this9));
    _this9.filterColumn = _this9.filterColumn.bind(_assertThisInitialized(_this9));
    _this9.resizeColumnStart = _this9.resizeColumnStart.bind(_assertThisInitialized(_this9));
    _this9.resizeColumnEnd = _this9.resizeColumnEnd.bind(_assertThisInitialized(_this9));
    _this9.resizeColumnMoving = _this9.resizeColumnMoving.bind(_assertThisInitialized(_this9));
    _this9.state = {
      page: props.defaultPage,
      pageSize: props.defaultPageSize,
      sorted: props.defaultSorted,
      expanded: props.defaultExpanded,
      filtered: props.defaultFiltered,
      resized: props.defaultResized,
      currentlyResizing: false,
      skipNextSort: false
    };
    return _this9;
  }

  _createClass(ReactTable, [{
    key: "render",
    value: function render() {
      var _this10 = this;

      var resolvedState = this.getResolvedState();
      var children = resolvedState.children,
          className = resolvedState.className,
          style = resolvedState.style,
          getProps = resolvedState.getProps,
          getTableProps = resolvedState.getTableProps,
          getTheadGroupProps = resolvedState.getTheadGroupProps,
          getTheadGroupTrProps = resolvedState.getTheadGroupTrProps,
          getTheadGroupThProps = resolvedState.getTheadGroupThProps,
          getTheadProps = resolvedState.getTheadProps,
          getTheadTrProps = resolvedState.getTheadTrProps,
          getTheadThProps = resolvedState.getTheadThProps,
          getTheadFilterProps = resolvedState.getTheadFilterProps,
          getTheadFilterTrProps = resolvedState.getTheadFilterTrProps,
          getTheadFilterThProps = resolvedState.getTheadFilterThProps,
          getTbodyProps = resolvedState.getTbodyProps,
          getTrGroupProps = resolvedState.getTrGroupProps,
          getTrProps = resolvedState.getTrProps,
          getTdProps = resolvedState.getTdProps,
          getTfootProps = resolvedState.getTfootProps,
          getTfootTrProps = resolvedState.getTfootTrProps,
          getTfootTdProps = resolvedState.getTfootTdProps,
          getPaginationProps = resolvedState.getPaginationProps,
          getLoadingProps = resolvedState.getLoadingProps,
          getNoDataProps = resolvedState.getNoDataProps,
          getResizerProps = resolvedState.getResizerProps,
          showPagination = resolvedState.showPagination,
          showPaginationTop = resolvedState.showPaginationTop,
          showPaginationBottom = resolvedState.showPaginationBottom,
          manual = resolvedState.manual,
          loadingText = resolvedState.loadingText,
          noDataText = resolvedState.noDataText,
          sortable = resolvedState.sortable,
          multiSort = resolvedState.multiSort,
          resizable = resolvedState.resizable,
          filterable = resolvedState.filterable,
          pivotIDKey = resolvedState.pivotIDKey,
          pivotValKey = resolvedState.pivotValKey,
          pivotBy = resolvedState.pivotBy,
          subRowsKey = resolvedState.subRowsKey,
          aggregatedKey = resolvedState.aggregatedKey,
          originalKey = resolvedState.originalKey,
          indexKey = resolvedState.indexKey,
          groupedByPivotKey = resolvedState.groupedByPivotKey,
          loading = resolvedState.loading,
          pageSize = resolvedState.pageSize,
          page = resolvedState.page,
          sorted = resolvedState.sorted,
          filtered = resolvedState.filtered,
          resized = resolvedState.resized,
          expanded = resolvedState.expanded,
          pages = resolvedState.pages,
          onExpandedChange = resolvedState.onExpandedChange,
          TableComponent = resolvedState.TableComponent,
          TheadComponent = resolvedState.TheadComponent,
          TbodyComponent = resolvedState.TbodyComponent,
          TrGroupComponent = resolvedState.TrGroupComponent,
          TrComponent = resolvedState.TrComponent,
          ThComponent = resolvedState.ThComponent,
          TdComponent = resolvedState.TdComponent,
          TfootComponent = resolvedState.TfootComponent,
          PaginationComponent = resolvedState.PaginationComponent,
          LoadingComponent = resolvedState.LoadingComponent,
          SubComponent = resolvedState.SubComponent,
          NoDataComponent = resolvedState.NoDataComponent,
          ResizerComponent = resolvedState.ResizerComponent,
          ExpanderComponent = resolvedState.ExpanderComponent,
          PivotValueComponent = resolvedState.PivotValueComponent,
          PivotComponent = resolvedState.PivotComponent,
          AggregatedComponent = resolvedState.AggregatedComponent,
          FilterComponent = resolvedState.FilterComponent,
          PadRowComponent = resolvedState.PadRowComponent,
          resolvedData = resolvedState.resolvedData,
          allVisibleColumns = resolvedState.allVisibleColumns,
          headerGroups = resolvedState.headerGroups,
          hasHeaderGroups = resolvedState.hasHeaderGroups,
          sortedData = resolvedState.sortedData,
          currentlyResizing = resolvedState.currentlyResizing; // Pagination

      var startRow = pageSize * page;
      var endRow = startRow + pageSize;
      var pageRows = manual ? resolvedData : sortedData.slice(startRow, endRow);
      var minRows = this.getMinRows();

      var padRows = _.range(Math.max(minRows - pageRows.length, 0));

      var hasColumnFooter = allVisibleColumns.some(function (d) {
        return d.Footer;
      });
      var hasFilters = filterable || allVisibleColumns.some(function (d) {
        return d.filterable;
      });

      var recurseRowsViewIndex = function recurseRowsViewIndex(rows) {
        var path = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
        var index = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : -1;
        return [rows.map(function (row, i) {
          index += 1;
          var rowWithViewIndex = Object.assign({}, row, {
            _viewIndex: index
          });
          var newPath = path.concat([i]);

          if (rowWithViewIndex[subRowsKey] && _.get(expanded, newPath)) {
            var _recurseRowsViewIndex = recurseRowsViewIndex(rowWithViewIndex[subRowsKey], newPath, index);

            var _recurseRowsViewIndex2 = _slicedToArray(_recurseRowsViewIndex, 2);

            rowWithViewIndex[subRowsKey] = _recurseRowsViewIndex2[0];
            index = _recurseRowsViewIndex2[1];
          }

          return rowWithViewIndex;
        }), index];
      };

      var _recurseRowsViewIndex3 = recurseRowsViewIndex(pageRows);

      var _recurseRowsViewIndex4 = _slicedToArray(_recurseRowsViewIndex3, 1);

      pageRows = _recurseRowsViewIndex4[0];
      var canPrevious = page > 0;
      var canNext = page + 1 < pages;

      var rowMinWidth = _.sum(allVisibleColumns.map(function (d) {
        var resizedColumn = resized.find(function (x) {
          return x.id === d.id;
        }) || {};
        return _.getFirstDefined(resizedColumn.value, d.width, d.minWidth);
      }));

      var rowIndex = -1;
      var finalState = Object.assign({}, resolvedState, {
        startRow: startRow,
        endRow: endRow,
        pageRows: pageRows,
        minRows: minRows,
        padRows: padRows,
        hasColumnFooter: hasColumnFooter,
        canPrevious: canPrevious,
        canNext: canNext,
        rowMinWidth: rowMinWidth
      });

      var rootProps = _.splitProps(getProps(finalState, undefined, undefined, this));

      var tableProps = _.splitProps(getTableProps(finalState, undefined, undefined, this));

      var tBodyProps = _.splitProps(getTbodyProps(finalState, undefined, undefined, this));

      var loadingProps = getLoadingProps(finalState, undefined, undefined, this);
      var noDataProps = getNoDataProps(finalState, undefined, undefined, this); // Visual Components

      var makeHeaderGroup = function makeHeaderGroup(column, i) {
        var resizedValue = function resizedValue(col) {
          return (resized.find(function (x) {
            return x.id === col.id;
          }) || {}).value;
        };

        var flex = _.sum(column.columns.map(function (col) {
          return col.width || resizedValue(col) ? 0 : col.minWidth;
        }));

        var width = _.sum(column.columns.map(function (col) {
          return _.getFirstDefined(resizedValue(col), col.width, col.minWidth);
        }));

        var maxWidth = _.sum(column.columns.map(function (col) {
          return _.getFirstDefined(resizedValue(col), col.width, col.maxWidth);
        }));

        var theadGroupThProps = _.splitProps(getTheadGroupThProps(finalState, undefined, column, _this10));

        var columnHeaderProps = _.splitProps(column.getHeaderProps(finalState, undefined, column, _this10));

        var classes = [column.headerClassName, theadGroupThProps.className, columnHeaderProps.className];
        var styles = Object.assign({}, column.headerStyle, {}, theadGroupThProps.style, {}, columnHeaderProps.style);
        var rest = Object.assign({}, theadGroupThProps.rest, {}, columnHeaderProps.rest);
        var flexStyles = {
          flex: flex + " 0 auto",
          width: _.asPx(width),
          maxWidth: _.asPx(maxWidth)
        };
        return /*#__PURE__*/React.createElement(ThComponent, _extends({
          key: i + "-" + column.id,
          className: classnames(classes),
          style: Object.assign({}, styles, {}, flexStyles)
        }, rest), _.normalizeComponent(column.Header, {
          data: sortedData,
          column: column
        }));
      };

      var makeHeaderGroups = function makeHeaderGroups() {
        var theadGroupProps = _.splitProps(getTheadGroupProps(finalState, undefined, undefined, _this10));

        var theadGroupTrProps = _.splitProps(getTheadGroupTrProps(finalState, undefined, undefined, _this10));

        return /*#__PURE__*/React.createElement(TheadComponent, _extends({
          className: classnames('-headerGroups', theadGroupProps.className),
          style: Object.assign({}, theadGroupProps.style, {
            minWidth: rowMinWidth + "px"
          })
        }, theadGroupProps.rest), /*#__PURE__*/React.createElement(TrComponent, _extends({
          className: theadGroupTrProps.className,
          style: theadGroupTrProps.style
        }, theadGroupTrProps.rest), headerGroups.map(makeHeaderGroup)));
      };

      var makeHeader = function makeHeader(column, i) {
        var resizedCol = resized.find(function (x) {
          return x.id === column.id;
        }) || {};
        var sort = sorted.find(function (d) {
          return d.id === column.id;
        });
        var show = typeof column.show === 'function' ? column.show() : column.show;

        var width = _.getFirstDefined(resizedCol.value, column.width, column.minWidth);

        var maxWidth = _.getFirstDefined(resizedCol.value, column.width, column.maxWidth);

        var theadThProps = _.splitProps(getTheadThProps(finalState, undefined, column, _this10));

        var columnHeaderProps = _.splitProps(column.getHeaderProps(finalState, undefined, column, _this10));

        var classes = [column.headerClassName, theadThProps.className, columnHeaderProps.className];
        var styles = Object.assign({}, column.headerStyle, {}, theadThProps.style, {}, columnHeaderProps.style);
        var rest = Object.assign({}, theadThProps.rest, {}, columnHeaderProps.rest);

        var isResizable = _.getFirstDefined(column.resizable, resizable, false);

        var resizer = isResizable ? /*#__PURE__*/React.createElement(ResizerComponent, _extends({
          onMouseDown: function onMouseDown(e) {
            return _this10.resizeColumnStart(e, column, false);
          },
          onTouchStart: function onTouchStart(e) {
            return _this10.resizeColumnStart(e, column, true);
          }
        }, getResizerProps('finalState', undefined, column, _this10))) : null;

        var isSortable = _.getFirstDefined(column.sortable, sortable, false);

        return /*#__PURE__*/React.createElement(ThComponent, _extends({
          key: i + "-" + column.id,
          className: classnames(classes, isResizable && 'rt-resizable-header', sort && (sort.desc ? '-sort-desc' : '-sort-asc'), isSortable && '-cursor-pointer', !show && '-hidden', pivotBy && pivotBy.slice(0, -1).includes(column.id) && 'rt-header-pivot'),
          style: Object.assign({}, styles, {
            flex: width + " 0 auto",
            width: _.asPx(width),
            maxWidth: _.asPx(maxWidth)
          }),
          toggleSort: function toggleSort(e) {
            if (isSortable) _this10.sortColumn(column, multiSort ? e.shiftKey : false);
          }
        }, rest), /*#__PURE__*/React.createElement("div", {
          className: isResizable ? 'rt-resizable-header-content' : ""
        }, _.normalizeComponent(column.Header, {
          data: sortedData,
          column: column
        })), resizer);
      };

      var makeHeaders = function makeHeaders() {
        var theadProps = _.splitProps(getTheadProps(finalState, undefined, undefined, _this10));

        var theadTrProps = _.splitProps(getTheadTrProps(finalState, undefined, undefined, _this10));

        return /*#__PURE__*/React.createElement(TheadComponent, _extends({
          className: classnames('-header', theadProps.className),
          style: Object.assign({}, theadProps.style, {
            minWidth: rowMinWidth + "px"
          })
        }, theadProps.rest), /*#__PURE__*/React.createElement(TrComponent, _extends({
          className: theadTrProps.className,
          style: theadTrProps.style
        }, theadTrProps.rest), allVisibleColumns.map(makeHeader)));
      };

      var makeFilter = function makeFilter(column, i) {
        var resizedCol = resized.find(function (x) {
          return x.id === column.id;
        }) || {};

        var width = _.getFirstDefined(resizedCol.value, column.width, column.minWidth);

        var maxWidth = _.getFirstDefined(resizedCol.value, column.width, column.maxWidth);

        var theadFilterThProps = _.splitProps(getTheadFilterThProps(finalState, undefined, column, _this10));

        var columnHeaderProps = _.splitProps(column.getHeaderProps(finalState, undefined, column, _this10));

        var classes = [column.headerClassName, theadFilterThProps.className, columnHeaderProps.className];
        var styles = Object.assign({}, column.headerStyle, {}, theadFilterThProps.style, {}, columnHeaderProps.style);
        var rest = Object.assign({}, theadFilterThProps.rest, {}, columnHeaderProps.rest);
        var filter = filtered.find(function (filter) {
          return filter.id === column.id;
        });
        var ResolvedFilterComponent = column.Filter || FilterComponent;

        var isFilterable = _.getFirstDefined(column.filterable, filterable, false);

        return /*#__PURE__*/React.createElement(ThComponent, _extends({
          key: i + "-" + column.id,
          className: classnames(classes),
          style: Object.assign({}, styles, {
            flex: width + " 0 auto",
            width: _.asPx(width),
            maxWidth: _.asPx(maxWidth)
          })
        }, rest), isFilterable ? _.normalizeComponent(ResolvedFilterComponent, {
          column: column,
          filter: filter,
          onChange: function onChange(value) {
            return _this10.filterColumn(column, value);
          }
        }, defaultProps.column.Filter) : null);
      };

      var makeFilters = function makeFilters() {
        var theadFilterProps = _.splitProps(getTheadFilterProps(finalState, undefined, undefined, _this10));

        var theadFilterTrProps = _.splitProps(getTheadFilterTrProps(finalState, undefined, undefined, _this10));

        return /*#__PURE__*/React.createElement(TheadComponent, _extends({
          className: classnames('-filters', theadFilterProps.className),
          style: Object.assign({}, theadFilterProps.style, {
            minWidth: rowMinWidth + "px"
          })
        }, theadFilterProps.rest), /*#__PURE__*/React.createElement(TrComponent, _extends({
          className: theadFilterTrProps.className,
          style: theadFilterTrProps.style
        }, theadFilterTrProps.rest), allVisibleColumns.map(makeFilter)));
      };

      var makePageRow = function makePageRow(row, i) {
        var path = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [];
        var rowInfo = {
          original: row[originalKey],
          row: row,
          index: row[indexKey],
          viewIndex: rowIndex += 1,
          pageSize: pageSize,
          page: page,
          level: path.length,
          nestingPath: path.concat([i]),
          aggregated: row[aggregatedKey],
          groupedByPivot: row[groupedByPivotKey],
          subRows: row[subRowsKey]
        };

        var isExpanded = _.get(expanded, rowInfo.nestingPath);

        var trGroupProps = getTrGroupProps(finalState, rowInfo, undefined, _this10);

        var trProps = _.splitProps(getTrProps(finalState, rowInfo, undefined, _this10));

        return /*#__PURE__*/React.createElement(TrGroupComponent, _extends({
          key: rowInfo.nestingPath.join('_')
        }, trGroupProps), /*#__PURE__*/React.createElement(TrComponent, _extends({
          className: classnames(trProps.className, row._viewIndex % 2 ? '-even' : '-odd'),
          style: trProps.style
        }, trProps.rest), allVisibleColumns.map(function (column, i2) {
          var resizedCol = resized.find(function (x) {
            return x.id === column.id;
          }) || {};
          var show = typeof column.show === 'function' ? column.show() : column.show;

          var width = _.getFirstDefined(resizedCol.value, column.width, column.minWidth);

          var maxWidth = _.getFirstDefined(resizedCol.value, column.width, column.maxWidth);

          var tdProps = _.splitProps(getTdProps(finalState, rowInfo, column, _this10));

          var columnProps = _.splitProps(column.getProps(finalState, rowInfo, column, _this10));

          var classes = [tdProps.className, column.className, columnProps.className];
          var styles = Object.assign({}, tdProps.style, {}, column.style, {}, columnProps.style);
          var cellInfo = Object.assign({}, rowInfo, {
            isExpanded: isExpanded,
            column: Object.assign({}, column),
            value: rowInfo.row[column.id],
            pivoted: column.pivoted,
            expander: column.expander,
            resized: resized,
            show: show,
            width: width,
            maxWidth: maxWidth,
            tdProps: tdProps,
            columnProps: columnProps,
            classes: classes,
            styles: styles
          });
          var value = cellInfo.value;
          var useOnExpanderClick;
          var isBranch;
          var isPreview;

          var onExpanderClick = function onExpanderClick(e) {
            var newExpanded = _.clone(expanded);

            if (isExpanded) {
              newExpanded = _.set(newExpanded, cellInfo.nestingPath, false);
            } else {
              newExpanded = _.set(newExpanded, cellInfo.nestingPath, {});
            }

            return _this10.setStateWithData({
              expanded: newExpanded
            }, function () {
              return onExpandedChange && onExpandedChange(newExpanded, cellInfo.nestingPath, e, cellInfo);
            });
          }; // Default to a standard cell


          var resolvedCell = _.normalizeComponent(column.Cell, cellInfo, value); // Resolve Renderers


          var ResolvedAggregatedComponent = column.Aggregated || (!column.aggregate ? AggregatedComponent : column.Cell);
          var ResolvedExpanderComponent = column.Expander || ExpanderComponent;
          var ResolvedPivotValueComponent = column.PivotValue || PivotValueComponent;

          var DefaultResolvedPivotComponent = PivotComponent || function (props) {
            return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(ResolvedExpanderComponent, props), /*#__PURE__*/React.createElement(ResolvedPivotValueComponent, props));
          };

          var ResolvedPivotComponent = column.Pivot || DefaultResolvedPivotComponent; // Is this cell expandable?

          if (cellInfo.pivoted || cellInfo.expander) {
            // Make it expandable by defualt
            cellInfo.expandable = true;
            useOnExpanderClick = true; // If pivoted, has no subRows, and does not have a subComponent,
            // do not make expandable

            if (cellInfo.pivoted && !cellInfo.subRows && !SubComponent) {
              cellInfo.expandable = false;
            }
          }

          if (cellInfo.pivoted) {
            // Is this column a branch?
            isBranch = rowInfo.row[pivotIDKey] === column.id && cellInfo.subRows; // Should this column be blank?

            isPreview = pivotBy.indexOf(column.id) > pivotBy.indexOf(rowInfo.row[pivotIDKey]) && cellInfo.subRows; // Pivot Cell Render Override

            if (isBranch) {
              // isPivot
              resolvedCell = _.normalizeComponent(ResolvedPivotComponent, Object.assign({}, cellInfo, {
                value: row[pivotValKey]
              }), row[pivotValKey]);
            } else if (isPreview) {
              // Show the pivot preview
              resolvedCell = _.normalizeComponent(ResolvedAggregatedComponent, cellInfo, value);
            } else {
              resolvedCell = null;
            }
          } else if (cellInfo.aggregated) {
            resolvedCell = _.normalizeComponent(ResolvedAggregatedComponent, cellInfo, value);
          }

          if (cellInfo.expander) {
            resolvedCell = _.normalizeComponent(ResolvedExpanderComponent, cellInfo, row[pivotValKey]);

            if (pivotBy) {
              if (cellInfo.groupedByPivot) {
                resolvedCell = null;
              }

              if (!cellInfo.subRows && !SubComponent) {
                resolvedCell = null;
              }
            }
          }

          var resolvedOnExpanderClick = useOnExpanderClick ? onExpanderClick : function () {}; // If there are multiple onClick events, make sure they don't
          // override eachother. This should maybe be expanded to handle all
          // function attributes

          var interactionProps = {
            onClick: resolvedOnExpanderClick
          };

          if (tdProps.rest.onClick) {
            interactionProps.onClick = function (e) {
              tdProps.rest.onClick(e, function () {
                return resolvedOnExpanderClick(e);
              });
            };
          }

          if (columnProps.rest.onClick) {
            interactionProps.onClick = function (e) {
              columnProps.rest.onClick(e, function () {
                return resolvedOnExpanderClick(e);
              });
            };
          } // Return the cell


          return /*#__PURE__*/React.createElement(TdComponent // eslint-disable-next-line react/no-array-index-key
          , _extends({
            key: i2 + "-" + column.id,
            className: classnames(classes, (isBranch || isPreview) && 'rt-pivot', cellInfo.expandable ? 'rt-expandable' : !show && 'hidden'),
            style: Object.assign({}, styles, {
              flex: width + " 0 auto",
              width: _.asPx(width),
              maxWidth: _.asPx(maxWidth)
            })
          }, tdProps.rest, columnProps.rest, interactionProps), resolvedCell);
        })), rowInfo.subRows && isExpanded && rowInfo.subRows.map(function (d, i) {
          return makePageRow(d, i, rowInfo.nestingPath);
        }), SubComponent && !rowInfo.subRows && isExpanded && SubComponent(rowInfo, function () {
          var newExpanded = _.clone(expanded);

          _.set(newExpanded, rowInfo.nestingPath, false);
        }));
      };

      var makePadColumn = function makePadColumn(column, i) {
        var resizedCol = resized.find(function (x) {
          return x.id === column.id;
        }) || {};
        var show = typeof column.show === 'function' ? column.show() : column.show;

        var width = _.getFirstDefined(resizedCol.value, column.width, column.minWidth);

        var flex = width;

        var maxWidth = _.getFirstDefined(resizedCol.value, column.width, column.maxWidth);

        var tdProps = _.splitProps(getTdProps(finalState, undefined, column, _this10));

        var columnProps = _.splitProps(column.getProps(finalState, undefined, column, _this10));

        var classes = [tdProps.className, column.className, columnProps.className];
        var styles = Object.assign({}, tdProps.style, {}, column.style, {}, columnProps.style);
        return /*#__PURE__*/React.createElement(TdComponent, _extends({
          key: i + "-" + column.id,
          className: classnames(classes, !show && 'hidden'),
          style: Object.assign({}, styles, {
            flex: flex + " 0 auto",
            width: _.asPx(width),
            maxWidth: _.asPx(maxWidth)
          })
        }, tdProps.rest), _.normalizeComponent(PadRowComponent));
      };

      var makePadRow = function makePadRow(row, i) {
        var trGroupProps = getTrGroupProps(finalState, undefined, undefined, _this10);

        var trProps = _.splitProps(getTrProps(finalState, undefined, undefined, _this10));

        return /*#__PURE__*/React.createElement(TrGroupComponent, _extends({
          key: "pad-" + i
        }, trGroupProps), /*#__PURE__*/React.createElement(TrComponent, {
          className: classnames('-padRow', (pageRows.length + i) % 2 ? '-even' : '-odd', trProps.className),
          style: trProps.style || {}
        }, allVisibleColumns.map(makePadColumn)));
      };

      var makeColumnFooter = function makeColumnFooter(column, i) {
        var resizedCol = resized.find(function (x) {
          return x.id === column.id;
        }) || {};
        var show = typeof column.show === 'function' ? column.show() : column.show;

        var width = _.getFirstDefined(resizedCol.value, column.width, column.minWidth);

        var maxWidth = _.getFirstDefined(resizedCol.value, column.width, column.maxWidth);

        var tFootTdProps = _.splitProps(getTfootTdProps(finalState, undefined, undefined, _this10));

        var columnProps = _.splitProps(column.getProps(finalState, undefined, column, _this10));

        var columnFooterProps = _.splitProps(column.getFooterProps(finalState, undefined, column, _this10));

        var classes = [tFootTdProps.className, column.className, columnProps.className, columnFooterProps.className];
        var styles = Object.assign({}, tFootTdProps.style, {}, column.style, {}, columnProps.style, {}, columnFooterProps.style);
        return /*#__PURE__*/React.createElement(TdComponent, _extends({
          key: i + "-" + column.id,
          className: classnames(classes, !show && 'hidden'),
          style: Object.assign({}, styles, {
            flex: width + " 0 auto",
            width: _.asPx(width),
            maxWidth: _.asPx(maxWidth)
          })
        }, columnProps.rest, tFootTdProps.rest, columnFooterProps.rest), _.normalizeComponent(column.Footer, {
          data: sortedData,
          column: column
        }));
      };

      var makeColumnFooters = function makeColumnFooters() {
        var tFootProps = _.splitProps(getTfootProps(finalState, undefined, undefined, _this10));

        var tFootTrProps = _.splitProps(getTfootTrProps(finalState, undefined, undefined, _this10));

        return /*#__PURE__*/React.createElement(TfootComponent, _extends({
          className: tFootProps.className,
          style: Object.assign({}, tFootProps.style, {
            minWidth: rowMinWidth + "px"
          })
        }, tFootProps.rest), /*#__PURE__*/React.createElement(TrComponent, _extends({
          className: classnames(tFootTrProps.className),
          style: tFootTrProps.style
        }, tFootTrProps.rest), allVisibleColumns.map(makeColumnFooter)));
      };

      var makePagination = function makePagination(isTop) {
        var paginationProps = _.splitProps(getPaginationProps(finalState, undefined, undefined, _this10));

        return /*#__PURE__*/React.createElement(PaginationComponent, _extends({}, resolvedState, {
          pages: pages,
          canPrevious: canPrevious,
          canNext: canNext,
          onPageChange: _this10.onPageChange,
          onPageSizeChange: _this10.onPageSizeChange,
          className: paginationProps.className,
          style: paginationProps.style,
          isTop: isTop
        }, paginationProps.rest));
      };

      var makeTable = function makeTable() {
        return /*#__PURE__*/React.createElement("div", _extends({
          className: classnames('ReactTable', className, rootProps.className),
          style: Object.assign({}, style, {}, rootProps.style)
        }, rootProps.rest), showPagination && showPaginationTop ? /*#__PURE__*/React.createElement("div", {
          className: "pagination-top"
        }, makePagination(true)) : null, /*#__PURE__*/React.createElement(TableComponent, _extends({
          className: classnames(tableProps.className, currentlyResizing && 'rt-resizing'),
          style: tableProps.style
        }, tableProps.rest), hasHeaderGroups ? makeHeaderGroups() : null, makeHeaders(), hasFilters ? makeFilters() : null, /*#__PURE__*/React.createElement(TbodyComponent, _extends({
          className: classnames(tBodyProps.className),
          style: Object.assign({}, tBodyProps.style, {
            minWidth: rowMinWidth + "px"
          })
        }, tBodyProps.rest), pageRows.map(function (d, i) {
          return makePageRow(d, i);
        }), padRows.map(makePadRow)), hasColumnFooter ? makeColumnFooters() : null), showPagination && showPaginationBottom ? /*#__PURE__*/React.createElement("div", {
          className: "pagination-bottom"
        }, makePagination(false)) : null, !pageRows.length && /*#__PURE__*/React.createElement(NoDataComponent, noDataProps, _.normalizeComponent(noDataText)), /*#__PURE__*/React.createElement(LoadingComponent, _extends({
          loading: loading,
          loadingText: loadingText
        }, loadingProps)));
      }; // childProps are optionally passed to a function-as-a-child


      return children ? children(finalState, makeTable, this) : makeTable();
    }
  }]);

  return ReactTable;
}(Methods(Lifecycle(Component)));

ReactTable.propTypes = propTypes;
ReactTable.defaultProps = defaultProps;
export default ReactTable;
export { ReactTableDefaults };