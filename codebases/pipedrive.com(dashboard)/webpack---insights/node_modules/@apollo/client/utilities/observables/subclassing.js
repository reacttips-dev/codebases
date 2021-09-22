import { Observable } from "./Observable.js";
export function fixObservableSubclass(subclass) {
    function set(key) {
        Object.defineProperty(subclass, key, { value: Observable });
    }
    if (typeof Symbol === "function" && Symbol.species) {
        set(Symbol.species);
    }
    set("@@species");
    return subclass;
}
//# sourceMappingURL=subclassing.js.map