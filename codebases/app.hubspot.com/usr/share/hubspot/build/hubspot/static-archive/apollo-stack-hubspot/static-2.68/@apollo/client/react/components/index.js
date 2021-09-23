"use strict";
'use es6';

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Mutation = Mutation;
exports.Query = Query;

var _objectWithoutProperties2 = _interopRequireDefault(require("@babel/runtime/helpers/objectWithoutProperties"));

var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));

var _client = require("@apollo/client");

function Mutation(props) {
  var _useMutation = (0, _client.useMutation)(props.mutation, props),
      _useMutation2 = (0, _slicedToArray2.default)(_useMutation, 2),
      runMutation = _useMutation2[0],
      result = _useMutation2[1];

  return props.children ? props.children(runMutation, result) : null;
}

function Query(props) {
  var children = props.children,
      query = props.query,
      options = (0, _objectWithoutProperties2.default)(props, ["children", "query"]);
  var result = (0, _client.useQuery)(query, options);
  return children && result ? children(result) : null;
}