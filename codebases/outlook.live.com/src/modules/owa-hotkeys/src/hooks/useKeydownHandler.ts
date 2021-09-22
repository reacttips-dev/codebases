/* tslint:disable:forbid-import */
// Because this hook applies hotkeys outside of render, we need to
// manually hook into mobx to support hot-swapping of keysets.
import { autorun } from 'mobx';
/* tslint:enable:forbid-import */
import * as React from 'react';
import { lazyMousetrapImport } from '../utils/lazyMousetrapImport';
import getKeysForKeyboardShortcutsMode from '../utils/getKeysForKeyboardShortcutsMode';
import { createHandlerMethod } from '../utils/createHandlerMethod';
import type { HotkeyCommand, Hotkeys } from '../types/HotkeyCommand';
import type { KeydownConfig } from '../types/KeydownConfig';
import type UseKeydownHandlerOptions from '../types/UseKeydownHandlerOptions';

export function useGlobalHotkey(
    command: HotkeyCommand | Hotkeys,
    handler: (evt: KeyboardEvent) => void,
    options: UseKeydownHandlerOptions = {}
) {
    useUnifiedKeydownHandler(
        undefined,
        React.useMemo(() => [{ command, handler, options }], [
            command,
            handler,
            options.stopPropagation,
            options.preventDefault,
            options.allowHotkeyOnTextFields,
            options.isEnabled,
        ])
    );
}

export function useKeydownHandler<TElement extends HTMLElement>(
    ref: React.RefObject<TElement | null | undefined>,
    command: HotkeyCommand | Hotkeys,
    handler: (evt: KeyboardEvent) => void,
    options: UseKeydownHandlerOptions = {}
) {
    useUnifiedKeydownHandler(
        ref,
        React.useMemo(() => [{ command, handler, options }], [
            command,
            handler,
            options.stopPropagation,
            options.preventDefault,
            options.allowHotkeyOnTextFields,
            options.isEnabled,
        ])
    );
}

export function useLazyKeydownHandler<TElement extends HTMLElement, TAttachHandle = any>(
    ref: React.RefObject<TElement | null> | undefined,
    attach: (target: TAttachHandle) => Promise<KeydownConfig[]>,
    handle: TAttachHandle
) {
    useUnifiedKeydownHandler(
        ref,
        React.useMemo(() => attach(handle), [attach, handle])
    );
}

function useUnifiedKeydownHandler<TElement extends HTMLElement>(
    ref: React.MutableRefObject<TElement | null> | undefined,
    keydownConfigs: KeydownConfig[] | Promise<KeydownConfig[]>
) {
    React.useEffect((): (() => void) | void => {
        const cleanupPromise = (async () => {
            const Mousetrap = await lazyMousetrapImport.import();
            const element = ref ? ref.current : document.body;
            if (element) {
                const mousetrapElementBinding = new Mousetrap(element);
                const resolvedKeydownConfigs = Array.isArray(keydownConfigs)
                    ? keydownConfigs
                    : await keydownConfigs;

                const autorunDisposer = autorun(() => {
                    for (const {
                        command,
                        handler,
                        options: {
                            stopPropagation = true,
                            preventDefault = true,
                            allowHotkeyOnTextFields = false,
                            isEnabled = undefined,
                        } = {},
                    } of resolvedKeydownConfigs) {
                        const keys = getKeysForKeyboardShortcutsMode(command);
                        if (keys) {
                            mousetrapElementBinding.bind(
                                keys,
                                createHandlerMethod(
                                    allowHotkeyOnTextFields,
                                    isEnabled,
                                    stopPropagation,
                                    preventDefault,
                                    handler
                                )
                            );
                        }
                    }
                });

                return () => {
                    mousetrapElementBinding.reset();
                    autorunDisposer();
                };
            } else {
                return () => {};
            }
        })();

        return () => {
            cleanupPromise.then(cleanupFn => cleanupFn());
        };
    }, [ref, keydownConfigs]);
}
