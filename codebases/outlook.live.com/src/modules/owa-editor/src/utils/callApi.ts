import type EditorViewState from '../store/schema/EditorViewState';
import operateContentInternal from './ContentOperator';
import * as RoosterApi from 'roosterjs-editor-api';
import type { IEditor } from 'roosterjs-editor-types';
import { logUsage } from 'owa-analytics';

const LOG_ENTRY = 'EditorRibbonUsage';

/**
 * These type definitions are just to make the function callFormatApi and callEditorApi type-safe
 */

// 1. All possible API roots
type ApiRoots = IEditor | typeof RoosterApi;

// 2. Define function types
type EditorApiType<P extends any[] = any[], R = any> = (...args: P) => R;
type FormatApiType<P extends any[] = any[], R = any> = (editor: IEditor, ...args: P) => R;

// 3. Define function type selector, it can choose a write function type according the given root type
type ApiFunc<ApiRoot extends ApiRoots, P extends any[] = any[], R = any> = ApiRoot extends IEditor
    ? EditorApiType<P, R>
    : FormatApiType<P, R>;

// 4. Select the valid APIs of the root
type KeyOfApi<
    ApiRoot extends ApiRoots,
    Key extends keyof ApiRoot
> = ApiRoot[Key] extends ApiFunc<ApiRoot> ? Key : never;
type TypeOfApi<
    ApiRoot extends ApiRoots,
    Key extends keyof ApiRoot
> = ApiRoot[Key] extends ApiFunc<ApiRoot> ? ApiRoot[Key] : never;
type CallableApiKeys<ApiRoot extends ApiRoots, Key extends keyof ApiRoot> = {
    [P in Key]: KeyOfApi<ApiRoot, P>;
}[Key];
type CallableApi<ApiRoot extends ApiRoots, Key extends keyof ApiRoot> = {
    [P in CallableApiKeys<ApiRoot, Key>]: TypeOfApi<ApiRoot, P>;
};

// 5. All valid APIs
export type Api<ApiRoot extends ApiRoots> = CallableApi<ApiRoot, keyof ApiRoot>;

// 6. Get argument and return types of an API
export type ArgsOfApi<
    ApiRoot extends ApiRoots,
    Key extends keyof Api<ApiRoot>
> = ApiRoot[Key] extends ApiFunc<ApiRoot, infer U, any> ? U : never;
export type ReturnOfApi<
    ApiRoot extends ApiRoots,
    Key extends keyof Api<ApiRoot>
> = ApiRoot[Key] extends ApiFunc<ApiRoot, any[], infer U> ? U : never;

/**
 * Call an editor API with parameter.
 * An editor API must be a method of Editor class
 * If there is no mounted editor correlated to the given viewState, it does nothing and returns undefined.
 * @param viewState Editor ViewState
 * @param apiName Name of the format API to call
 * @param args Arguments of the API
 */
export function callEditorApi<T extends keyof Api<IEditor>>(
    viewState: EditorViewState,
    apiName: T,
    ...args: ArgsOfApi<IEditor, T>
): ReturnOfApi<IEditor, T> {
    let result: ReturnOfApi<IEditor, T>;

    operateContentInternal(
        viewState,
        editor => {
            result = editor[apiName].call(editor, ...args);
        },
        null
    );

    return result;
}

export type KeyOfNoParamFormatApi<
    Key extends keyof Api<typeof RoosterApi>
> = typeof RoosterApi[Key] extends (editor: IEditor) => any ? Key : never;

/**
 * Call a format API without parameter.
 * A format API is a function exported from roosterjs-editor-api package and take editor as the first parameter.
 * If there is no mounted editor correlated to the given viewState, it does nothing and returns undefined.
 * @param viewState Editor ViewState
 * @param apiName Name of the format API.
 */
export function callFormatApi<T extends keyof Api<typeof RoosterApi>>(
    viewState: EditorViewState,
    apiName: KeyOfNoParamFormatApi<T>
): ReturnOfApi<typeof RoosterApi, T>;

/**
 * Call a format API with parameter.
 * A format API is a function exported from roosterjs-editor-api package and take editor as the first parameter.
 * If there is no mounted editor correlated to the given viewState, it does nothing and returns undefined.
 * @param viewState Editor ViewState
 * @param apiName Name of the format API.
 * @param args Args of the format API
 * @param logData Data to log. By default, it will be the same with args. With this is empty, no data will be logged.
 */
export function callFormatApi<T extends keyof Api<typeof RoosterApi>>(
    viewState: EditorViewState,
    apiName: T,
    args: ArgsOfApi<typeof RoosterApi, T>,
    logData?: any[]
): ReturnOfApi<typeof RoosterApi, T>;

export function callFormatApi<T extends keyof Api<typeof RoosterApi>>(
    viewState: EditorViewState,
    apiName: T,
    args: any[] = [],
    logData: any[] = args
): ReturnOfApi<typeof RoosterApi, T> {
    let result: ReturnOfApi<typeof RoosterApi, T>;

    // Still can't find a way to make this step type-safe. Without the "<any>" cast,
    // compiler complains 'this is not callable'.
    // But at least the function callFormatApi itself is type-safe, so it should be good here.
    const api = RoosterApi[apiName] as any;

    operateContentInternal(
        viewState,
        editor => {
            result = api(editor, ...args);
            if (logData?.length > 0) {
                logUsage(LOG_ENTRY + apiName, [
                    ...logData.map(data => JSON.stringify(data)),
                    editor.isDarkMode(),
                ]);
            }
        },
        null
    );

    return result;
}
