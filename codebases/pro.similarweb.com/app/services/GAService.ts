import { Injector } from "common/ioc/Injector";
import $swNgRedux from "./SwNgRedux";

function getStore() {
    return Injector.get<$swNgRedux>("$swNgRedux");
}

export function isGAOn() {
    const store = getStore();
    return store.getStatePath("common.showGAApprovedData");
}

export function subscribe(cb) {
    const store = getStore();
    return store.notifyOnChange("common.showGAApprovedData", (path, isOn) => cb(isOn));
}
