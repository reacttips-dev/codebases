import { useBaseQuery } from "./utils/useBaseQuery.js";
export function useLazyQuery(query, options) {
    return useBaseQuery(query, options, true);
}
//# sourceMappingURL=useLazyQuery.js.map