import * as PropTypes from 'prop-types';
var invariant = require('invariant');
var ApolloConsumer = function (props, context) {
    invariant(!!context.client, "Could not find \"client\" in the context of ApolloConsumer. Wrap the root component in an <ApolloProvider>");
    return props.children(context.client);
};
ApolloConsumer.contextTypes = {
    client: PropTypes.object.isRequired,
};
ApolloConsumer.propTypes = {
    children: PropTypes.func.isRequired,
};
export default ApolloConsumer;
//# sourceMappingURL=ApolloConsumer.js.map