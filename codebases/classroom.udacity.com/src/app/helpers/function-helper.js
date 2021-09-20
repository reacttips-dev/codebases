import invariant from 'invariant';

const FunctionHelper = {
    requireAllArgs(fn) {
        return function() {
            invariant(
                arguments.length === fn.length,
                `Expected ${fn.length} parameters, got ${arguments.length}`
            );

            return fn.apply(this, arguments);
        };
    },
};

export default FunctionHelper;