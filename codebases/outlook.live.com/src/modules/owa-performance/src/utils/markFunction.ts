import { wrapFunction } from './wrapFunction';
import { addBootTiming } from './trackBootTimings';
import { hasQueryStringParameter } from 'owa-querystring';

const shouldTrackBootQueryStringParam = 'bpm';

export function markFunction<TFunc extends (...args: any[]) => any>(
    func: TFunc,
    name: string
): (...args: Parameters<TFunc>) => ReturnType<TFunc> {
    return wrapFunction(
        func,
        () => markStart(name),
        () => markEnd(name)
    );
}

export function markStart(name: string) {
    mark(`${name}_s`);
}

export function markEnd(name: string) {
    let endName = `${name}_e`;
    mark(endName);
    if (hasQueryStringParameter(shouldTrackBootQueryStringParam)) {
        window.performance.measure(name, `${name}_s`, endName);
    }
}

function mark(name: string) {
    if (hasQueryStringParameter(shouldTrackBootQueryStringParam)) {
        window.performance.mark(name);
    }
    addBootTiming(name);
}
