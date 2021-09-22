import * as React from 'react';
import ReactDOM from 'react-dom';
import { addBottleneck } from 'owa-performance';
import { unblockStyles } from 'owa-shared-start/lib/overrideLoadStyles';

export default function asyncRender(
    node: JSX.Element,
    container: HTMLElement | null
): Promise<void> {
    return new Promise<void>(function (resolve: () => void, reject: (reason: any) => void) {
        function onMount() {
            setTimeout(resolve, 0);
        }
        function Component() {
            React.useEffect(onMount, []);
            return node;
        }
        function asyncRenderInternal(bottleneck: string) {
            addBottleneck('DR', bottleneck);
            try {
                ReactDOM.render(
                    <React.StrictMode>
                        <Component />
                    </React.StrictMode>,
                    container
                );
                unblockStyles();
            } catch (error) {
                reject(error);
            }
        }
        if (window.document.readyState != 'loading') {
            asyncRenderInternal('R');
        } else if (window.document.addEventListener as any) {
            addDomLoadedEvent(asyncRenderInternal);
        } else {
            window.onload = () => asyncRenderInternal('OL');
        }
    });
}

const domLoadedEvent = 'DOMContentLoaded';
function addDomLoadedEvent(asyncRenderInternal: (bottleneck: string) => void) {
    function domLoaded() {
        window.document.removeEventListener(domLoadedEvent, domLoaded);
        asyncRenderInternal('EL');
    }
    window.document.addEventListener(domLoadedEvent, domLoaded, false);
}
