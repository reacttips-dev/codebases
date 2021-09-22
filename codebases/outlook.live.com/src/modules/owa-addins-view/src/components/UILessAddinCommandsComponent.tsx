import * as React from 'react';
import UILessDialogWrapper from './UILessDialogWrapper';
import UILessFrame from './UILessFrame';
import {
    getExtensibilityState,
    isAutoRunAddinCommand,
    IExtendedAddinCommand,
} from 'owa-addins-store';
import type { ObservableMap } from 'mobx';
import { observer } from 'mobx-react-lite';

const UILessAddinCommandsComponent = observer(function UILessAddinCommandsComponent(props: {}) {
    const items: JSX.Element[] = [];

    getExtensibilityState().runningUILessExtendedAddinCommands.forEach(
        (uiLessAddins: ObservableMap<string, IExtendedAddinCommand>, hostItemIndex: string) => {
            uiLessAddins.forEach(
                (extendedAddinCommand: IExtendedAddinCommand, controlId: string) => {
                    extendedAddinCommand.addinCommandTelemetry.setExecutionInitTime();
                    const addinCommand = extendedAddinCommand.addinCommand;
                    const disableProgressBar = isAutoRunAddinCommand(addinCommand);
                    items.push(
                        <UILessDialogWrapper
                            hostItemIndex={hostItemIndex}
                            controlId={controlId}
                            addinCommand={addinCommand}
                            key={controlId}>
                            <UILessFrame
                                extendedAddinCommand={extendedAddinCommand}
                                controlId={controlId}
                                hostItemIndex={hostItemIndex}
                                disableProgressBar={disableProgressBar}
                            />
                        </UILessDialogWrapper>
                    );
                }
            );
        }
    );
    return <div>{items}</div>;
});
export default UILessAddinCommandsComponent;
