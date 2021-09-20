import { useEffect } from 'react';
import {
  registerShortcut,
  registerShortcutHandler,
  unregisterShortcut,
  unregisterShortcutHandler,
} from './shortcuts';
import {
  RegisterShortcutHandlerOptions,
  RegisterShortcutOptions,
  Scope,
  ShortcutHandler,
} from './types';

/**
 * React hook wrapping `registerShortcutHandler` setup
 * to do all the necessary registration and cleanup
 */
export const useShortcutHandler = (
  callback: ShortcutHandler,
  options?: RegisterShortcutHandlerOptions,
) => {
  const { scope = Scope.Default } = options || {};

  useEffect(() => {
    registerShortcutHandler(callback, { scope });
    return () => {
      unregisterShortcutHandler(callback);
    };
  }, [callback, scope]);
};

/**
 * React hook wrapping `registerShortcut` setup
 * to do all the necessary registration and cleanup
 */
export const useShortcut = (
  callback: ShortcutHandler,
  options: RegisterShortcutOptions,
) => {
  const { scope = Scope.Default, key, enabled = true } = options;

  useEffect(() => {
    if (enabled) {
      registerShortcut(callback, { scope, key });
      return () => {
        unregisterShortcut(callback);
      };
    }
  }, [enabled, callback, scope, key]);
};
