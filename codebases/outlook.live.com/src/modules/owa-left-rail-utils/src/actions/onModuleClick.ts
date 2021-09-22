import { action } from 'satcheljs';
import { Module } from 'owa-workloads';
import type * as React from 'react';

export default action(
    'onModuleClick',
    (
        module: Module,
        currentlySelectedModule: Module,
        activeModuleAction?: (
            ev?: React.MouseEvent<unknown> | React.KeyboardEvent<HTMLElement>
        ) => void
    ) => ({
        module,
        currentlySelectedModule,
        activeModuleAction,
    })
);
