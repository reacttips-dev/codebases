import { KeyCodes } from '@fluentui/utilities';
import * as React from 'react';

export function useEscapeKeyHandler(onEscapeKey: () => void) {
    return React.useCallback(
        (evt: React.KeyboardEvent<HTMLElement>) => {
            switch (evt.keyCode) {
                case KeyCodes.escape:
                    evt.stopPropagation();
                    evt.preventDefault();
                    onEscapeKey();
                    break;
            }
        },
        [onEscapeKey]
    );
}
