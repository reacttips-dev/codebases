var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
import * as React from 'react';
import * as PropTypes from 'prop-types';
var invariant = require('invariant');
var shallowEqual = require('fbjs/lib/shallowEqual');
import { parser, DocumentType } from './parser';
var initialState = {
    loading: false,
    called: false,
    error: undefined,
    data: undefined,
};
var Mutation = (function (_super) {
    __extends(Mutation, _super);
    function Mutation(props, context) {
        var _this = _super.call(this, props, context) || this;
        _this.hasMounted = false;
        _this.runMutation = function (options) {
            if (options === void 0) { options = {}; }
            _this.onMutationStart();
            var mutationId = _this.generateNewMutationId();
            return _this.mutate(options)
                .then(function (response) {
                _this.onMutationCompleted(response, mutationId);
                return response;
            })
                .catch(function (e) {
                _this.onMutationError(e, mutationId);
                if (!_this.props.onError)
                    throw e;
            });
        };
        _this.mutate = function (options) {
            var _a = _this.props, mutation = _a.mutation, variables = _a.variables, optimisticResponse = _a.optimisticResponse, update = _a.update, _b = _a.context, context = _b === void 0 ? {} : _b, _c = _a.awaitRefetchQueries, awaitRefetchQueries = _c === void 0 ? false : _c;
            var refetchQueries = options.refetchQueries || _this.props.refetchQueries;
            if (refetchQueries && refetchQueries.length && Array.isArray(refetchQueries)) {
                refetchQueries = refetchQueries.map(function (x) {
                    if (typeof x === 'string' && _this.context.operations)
                        return _this.context.operations.get(x) || x;
                    return x;
                });
                delete options.refetchQueries;
            }
            return _this.client.mutate(__assign({ mutation: mutation,
                variables: variables,
                optimisticResponse: optimisticResponse,
                refetchQueries: refetchQueries,
                awaitRefetchQueries: awaitRefetchQueries,
                update: update,
                context: context }, options));
        };
        _this.onMutationStart = function () {
            if (!_this.state.loading && !_this.props.ignoreResults) {
                _this.setState({
                    loading: true,
                    error: undefined,
                    data: undefined,
                    called: true,
                });
            }
        };
        _this.onMutationCompleted = function (response, mutationId) {
            if (_this.hasMounted === false) {
                return;
            }
            var _a = _this.props, onCompleted = _a.onCompleted, ignoreResults = _a.ignoreResults;
            var data = response.data;
            var callOncomplete = function () { return (onCompleted ? onCompleted(data) : null); };
            if (_this.isMostRecentMutation(mutationId) && !ignoreResults) {
                _this.setState({ loading: false, data: data }, callOncomplete);
            }
            else {
                callOncomplete();
            }
        };
        _this.onMutationError = function (error, mutationId) {
            if (_this.hasMounted === false) {
                return;
            }
            var onError = _this.props.onError;
            var callOnError = function () { return (onError ? onError(error) : null); };
            if (_this.isMostRecentMutation(mutationId)) {
                _this.setState({ loading: false, error: error }, callOnError);
            }
            else {
                callOnError();
            }
        };
        _this.generateNewMutationId = function () {
            _this.mostRecentMutationId = _this.mostRecentMutationId + 1;
            return _this.mostRecentMutationId;
        };
        _this.isMostRecentMutation = function (mutationId) {
            return _this.mostRecentMutationId === mutationId;
        };
        _this.verifyDocumentIsMutation = function (mutation) {
            var operation = parser(mutation);
            invariant(operation.type === DocumentType.Mutation, "The <Mutation /> component requires a graphql mutation, but got a " + (operation.type === DocumentType.Query ? 'query' : 'subscription') + ".");
        };
        _this.client = props.client || context.client;
        invariant(!!_this.client, 'Could not find "client" in the context or props of Mutation. Wrap ' +
            'the root component in an <ApolloProvider>, or pass an ApolloClient ' +
            'instance in via props.');
        _this.verifyDocumentIsMutation(props.mutation);
        _this.mostRecentMutationId = 0;
        _this.state = initialState;
        return _this;
    }
    Mutation.prototype.componentDidMount = function () {
        this.hasMounted = true;
    };
    Mutation.prototype.componentWillUnmount = function () {
        this.hasMounted = false;
    };
    Mutation.prototype.componentWillReceiveProps = function (nextProps, nextContext) {
        var client = nextProps.client;
        if (shallowEqual(this.props, nextProps) &&
            (this.client === client || this.client === nextContext.client)) {
            return;
        }
        if (this.props.mutation !== nextProps.mutation) {
            this.verifyDocumentIsMutation(nextProps.mutation);
        }
        if (this.client !== client && this.client !== nextContext.client) {
            this.client = client || nextContext.client;
            this.setState(initialState);
        }
    };
    Mutation.prototype.render = function () {
        var children = this.props.children;
        var _a = this.state, loading = _a.loading, data = _a.data, error = _a.error, called = _a.called;
        var result = {
            called: called,
            loading: loading,
            data: data,
            error: error,
            client: this.client,
        };
        return children(this.runMutation, result);
    };
    Mutation.contextTypes = {
        client: PropTypes.object.isRequired,
        operations: PropTypes.object,
    };
    Mutation.propTypes = {
        mutation: PropTypes.object.isRequired,
        variables: PropTypes.object,
        optimisticResponse: PropTypes.object,
        refetchQueries: PropTypes.oneOfType([
            PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.string, PropTypes.object])),
            PropTypes.func,
        ]),
        awaitRefetchQueries: PropTypes.bool,
        update: PropTypes.func,
        children: PropTypes.func.isRequired,
        onCompleted: PropTypes.func,
        onError: PropTypes.func,
    };
    return Mutation;
}(React.Component));
export default Mutation;
//# sourceMappingURL=Mutation.js.map