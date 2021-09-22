export function wrapFunction<TFunc extends (...args: any[]) => any>(
    func: TFunc,
    before: () => void,
    after: () => void
): (...args: Parameters<TFunc>) => ReturnType<TFunc> {
    return function markedFunction(...args) {
        before();
        let result = func(...args);
        if (result?.then) {
            result = result.then(promiseResult => {
                after();
                return promiseResult;
            });
        } else {
            after();
        }
        return result;
    };
}
