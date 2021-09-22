import { useEffect, useState } from 'react';
export function useReactiveVar(rv) {
    var value = rv();
    var setValue = useState(value)[1];
    useEffect(function () {
        var probablySameValue = rv();
        if (value !== probablySameValue) {
            setValue(probablySameValue);
        }
        else {
            return rv.onNextChange(setValue);
        }
    }, [value]);
    return value;
}
//# sourceMappingURL=useReactiveVar.js.map