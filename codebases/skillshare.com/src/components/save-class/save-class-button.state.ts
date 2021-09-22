var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
import { useState } from 'react';
import { useSaveClassState } from './save-class.state';
export var useSaveClassButtonState = function (props) {
    var saveClass = useSaveClassState(props.sku).saveClass;
    var _a = __read(useState(props.saved || false), 2), isSaved = _a[0], setIsSaved = _a[1];
    var _b = __read(useState(false), 2), renderPopoverContent = _b[0], setRenderPopoverContent = _b[1];
    var updateSaveState = function () {
        if (props.renderSignupView) {
            props.renderSignupView();
            return;
        }
        if (!isSaved) {
            saveClass();
        }
        setRenderPopoverContent(true);
        setIsSaved(true);
    };
    return {
        updateSaveState: updateSaveState,
        isSaved: isSaved,
        renderPopoverContent: renderPopoverContent,
        setIsSaved: setIsSaved,
    };
};
//# sourceMappingURL=save-class-button.state.js.map