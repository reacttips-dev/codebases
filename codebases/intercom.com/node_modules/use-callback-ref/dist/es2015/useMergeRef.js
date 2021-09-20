import { useCallbackRef } from './useRef';
import { assignRef } from './assignRef';
export function useMergeRefs(refs, defaultValue) {
    return useCallbackRef(defaultValue, function (newValue) {
        return refs.forEach(function (ref) { return assignRef(ref, newValue); });
    });
}
