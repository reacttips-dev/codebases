import { useRef } from 'react';
import { equal } from '@wry/equality';
export function useDeepMemo(memoFn, key) {
    var ref = useRef();
    if (!ref.current || !equal(key, ref.current.key)) {
        ref.current = { key: key, value: memoFn() };
    }
    return ref.current.value;
}
//# sourceMappingURL=useDeepMemo.js.map