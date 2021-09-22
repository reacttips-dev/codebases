import { __assign } from "tslib";
import { useContext, useEffect, useReducer, useRef } from 'react';
import { QueryData } from "../../data/index.js";
import { useDeepMemo } from "./useDeepMemo.js";
import { getApolloContext } from "../../context/index.js";
export function useBaseQuery(query, options, lazy) {
    if (lazy === void 0) { lazy = false; }
    var context = useContext(getApolloContext());
    var _a = useReducer(function (x) { return x + 1; }, 0), tick = _a[0], forceUpdate = _a[1];
    var updatedOptions = options ? __assign(__assign({}, options), { query: query }) : { query: query };
    var queryDataRef = useRef();
    var queryData = queryDataRef.current || (queryDataRef.current = new QueryData({
        options: updatedOptions,
        context: context,
        onNewData: function () {
            if (!queryData.ssrInitiated()) {
                Promise.resolve().then(function () { return queryDataRef.current && forceUpdate(); });
            }
            else {
                forceUpdate();
            }
        }
    }));
    queryData.setOptions(updatedOptions);
    queryData.context = context;
    var memo = {
        options: __assign(__assign({}, updatedOptions), { onError: undefined, onCompleted: undefined }),
        context: context,
        tick: tick
    };
    var result = useDeepMemo(function () { return (lazy ? queryData.executeLazy() : queryData.execute()); }, memo);
    var queryResult = lazy
        ? result[1]
        : result;
    useEffect(function () {
        return function () { return queryData.cleanup(); };
    }, []);
    useEffect(function () { return queryData.afterExecute({ lazy: lazy }); }, [
        queryResult.loading,
        queryResult.networkStatus,
        queryResult.error,
        queryResult.data,
    ]);
    return result;
}
//# sourceMappingURL=useBaseQuery.js.map