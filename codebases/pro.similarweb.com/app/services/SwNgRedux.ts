import angular from "angular";
import * as _ from "lodash";

interface Reducer extends Function {
    (state: any, action: any): any;
}

export interface ISwNgReduxService {
    notifyOnChange: (statePath: string, callback) => any;
    subscribe(listener: Function): Function;
    connect(
        mapStateToTarget: (state: any) => Object,
        mapDispatchToTarget?: Object | ((dispatch: Function) => Object),
    ): (target: Function | Object) => () => void;
    replaceReducer(nextReducer: Reducer): void;
    dispatch(action: any): any;
    getState(): any;
    getStatePath(path: string): any;
}

export default class $swNgRedux implements ISwNgReduxService {
    private _$ngRedux;
    constructor(public $ngRedux: any) {
        this._$ngRedux = $ngRedux;
    }

    connect(
        mapStateToTarget: (state: any) => Object,
        mapDispatchToTarget?: Object | ((dispatch: Function) => Object),
    ): (target: Function | Object) => () => void {
        return this._$ngRedux.connect(mapStateToTarget, mapDispatchToTarget);
    }

    replaceReducer(nextReducer: Reducer): void {
        return this._$ngRedux.replaceReducer(nextReducer);
    }

    dispatch(action: any): any {
        return this._$ngRedux.dispatch(action);
    }

    getState(): any {
        return this._$ngRedux.getState();
    }

    getStatePath(path: string) {
        return _.get(this._$ngRedux.getState(), path);
    }

    subscribe(listener: Function): Function {
        return this._$ngRedux.subscribe(listener);
    }

    notifyOnChange(path: string, callback) {
        let oldState = _.get(this._$ngRedux.getState(), path);
        const unSubscribe = this._$ngRedux.subscribe(() => {
            const state = this._$ngRedux.getState();
            let newState = this.getStatePath(path);
            if (oldState !== newState) {
                oldState = newState;
                callback(path, newState);
            }
        });
        return unSubscribe;
    }
}

angular.module("sw.common").factory("$swNgRedux", function ($ngRedux) {
    return new $swNgRedux($ngRedux);
});
