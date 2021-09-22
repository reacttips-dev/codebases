import type { ContentHandler } from 'owa-controls-content-handler-base';
import { observer } from 'mobx-react';
import type MouseUpHandler from 'owa-controls-mouseup-handler/lib/store/schema/MouseUpHandler';
import {
    Accuracy,
    markRanges,
    Range,
    default as markElements,
} from 'owa-mark/lib/utils/markElements';
import * as React from 'react';

export interface HtmlContentProps {
    readonly contentHandlerDictionary: { [key: string]: ContentHandler };
    html: string;
    contentHandlerKeys: string[];
    readonly mouseUpHandlerList?: MouseUpHandler[];
    isUndoModeDictionary?: { [key: string]: boolean };
}

interface ExecutedContentHandler {
    key: string;
    isUndoMode: boolean;
    matchedElements: HTMLElement[];
    undoHandler: (elements: HTMLElement[]) => void;
}

@observer
export default class HtmlContent extends React.Component<HtmlContentProps, {}> {
    private htmlContentRef: HTMLElement;
    private executedContentHandlers: ExecutedContentHandler[] = [];

    private execute() {
        this.updateRemovedHandlersIfNecessary();

        this.props.contentHandlerKeys.forEach(key => {
            let contentHandler = this.props.contentHandlerDictionary[key];
            if (!contentHandler) {
                // If handler doesn't exist in contentHandlerDictionary, simply return.
                return;
            }

            let isUndoMode = !!(
                this.props.isUndoModeDictionary && this.props.isUndoModeDictionary[key]
            );
            let contentHandlerIndex = this.getExecutedContentHandlerIndex(key);
            if (contentHandlerIndex < 0) {
                // This is the case for new handlers.
                let matchedElements: HTMLElement[] = null;
                if (!isUndoMode) {
                    // Do not call handleContent if handler is undo mode.
                    matchedElements = this.handleContent(contentHandler);
                    if (!contentHandler.undoHandler) {
                        // Only cache matched elements when undoHandler exists,
                        // since we only cache for undo operation.
                        matchedElements = null;
                    }
                }
                let newlyExecutedContentHandler: ExecutedContentHandler = {
                    key: key,
                    isUndoMode: isUndoMode,
                    matchedElements: matchedElements,
                    undoHandler: contentHandler.undoHandler,
                };
                this.executedContentHandlers.push(newlyExecutedContentHandler);
            } else {
                // This is the case for existing handlers.
                let executedContentHandler = this.executedContentHandlers[contentHandlerIndex];
                if (executedContentHandler.isUndoMode != isUndoMode) {
                    // This is the case where executed handlers now need to undo/redo
                    if (isUndoMode) {
                        // Handler needs to undo
                        this.undoHandleContent(executedContentHandler);

                        // Clear matched elements for this contentHandler
                        executedContentHandler.matchedElements = null;
                    } else {
                        // Handler has been undone before, now re-apply
                        let matchedElements = this.handleContent(contentHandler);

                        // Update matched elements for this contentHandler
                        executedContentHandler.matchedElements = matchedElements;
                    }

                    executedContentHandler.isUndoMode = isUndoMode;
                }
            }
        });
    }

    private getExecutedContentHandlerIndex(key: string): number {
        for (let index = 0; index < this.executedContentHandlers.length; index++) {
            if (this.executedContentHandlers[index].key == key) {
                return index;
            }
        }
        return -1;
    }

    private handleContent(contentHandler: ContentHandler): HTMLElement[] {
        let matchedElements: HTMLElement[] = [];
        if (contentHandler.cssSelector) {
            let matchedCssElements = this.htmlContentRef.querySelectorAll(
                contentHandler.cssSelector
            );
            for (let i = 0; i < matchedCssElements.length; i++) {
                let matchedElement = matchedCssElements.item(i) as HTMLElement;
                if (contentHandler.handler) {
                    if (contentHandler.needsAllElements) {
                        contentHandler.handler(matchedElement, '', undefined, matchedCssElements);
                    } else {
                        contentHandler.handler(matchedElement);
                    }
                }
                matchedElements.push(matchedElement);
            }
        }

        if (contentHandler.keywords) {
            const eachCallback = (keyword: string) => (
                matchedElement: HTMLElement,
                instance: number
            ) => {
                if (contentHandler.handler) {
                    contentHandler.handler(matchedElement, keyword, instance);
                }
                matchedElements.push(matchedElement);
            };

            markElements(
                this.htmlContentRef,
                contentHandler.keywords,
                eachCallback,
                contentHandler.useRegExp,
                (contentHandler.markAccuracy as Accuracy) || 'prefix'
            );
        }

        if (contentHandler.ranges) {
            const eachRangeCallback = (range: Range) => (
                matchedElement: HTMLElement,
                instance: number
            ) => {
                if (contentHandler.handler) {
                    contentHandler.handler(matchedElement, matchedElement.textContent, instance);
                }
                matchedElements.push(matchedElement);
            };

            markRanges(
                this.htmlContentRef,
                contentHandler.ranges,
                eachRangeCallback,
                (contentHandler.markAccuracy as Accuracy) || 'prefix'
            );
        }

        if (contentHandler.doneHandlingMatchedElements) {
            contentHandler.doneHandlingMatchedElements(matchedElements, this.htmlContentRef);
        }

        return matchedElements;
    }

    private undoHandleContent(executedContentHandler: ExecutedContentHandler) {
        if (
            !executedContentHandler.undoHandler ||
            !executedContentHandler.matchedElements ||
            executedContentHandler.matchedElements.length == 0
        ) {
            // If no undo handler exists or no matched elements from previous handleContent, return.
            return;
        }

        executedContentHandler.undoHandler(executedContentHandler.matchedElements);
    }

    private updateRemovedHandlersIfNecessary() {
        for (let i = this.executedContentHandlers.length - 1; i >= 0; i--) {
            let executedContentHandler = this.executedContentHandlers[i];
            if (this.props.contentHandlerKeys.indexOf(executedContentHandler.key) < 0) {
                // This is the case where an existing contentHandler has been removed
                // Remove it from executedContentHandlers as well
                this.undoHandleContent(executedContentHandler);
                this.executedContentHandlers.splice(i, 1);
            }
        }
    }

    private onMouseUp = (ev?: MouseEvent) => {
        if (this.props.mouseUpHandlerList) {
            for (let mouseEventHandler of this.props.mouseUpHandlerList) {
                mouseEventHandler.onMouseUp(ev, this.htmlContentRef);
            }
        }
    };

    //NOTE: contextmenu event not captured with keyboard shortcut(shift+F10) in Edge (VSO 51479)
    private onContextMenu = (ev?: MouseEvent) => {
        if (this.props.mouseUpHandlerList) {
            for (let mouseEventHandler of this.props.mouseUpHandlerList) {
                if (mouseEventHandler.onContextMenu) {
                    mouseEventHandler.onContextMenu(ev);
                }
            }
        }
    };

    componentDidMount() {
        this.execute();
        this.htmlContentRef.addEventListener('contextmenu', this.onContextMenu);
        this.htmlContentRef.addEventListener('mouseup', this.onMouseUp);
    }

    componentDidUpdate() {
        this.execute();
    }

    componentWillUnmount() {
        this.htmlContentRef.removeEventListener('contextmenu', this.onContextMenu);
        this.htmlContentRef.removeEventListener('mouseup', this.onMouseUp);

        this.executedContentHandlers.forEach(executedContentHandler => {
            this.undoHandleContent(executedContentHandler);
        });
    }

    //tslint:disable-next-line:react-strict-mode  Tracked by WI 78447
    UNSAFE_componentWillReceiveProps(nextProps: HtmlContentProps) {
        if (this.props.html != nextProps.html) {
            // Clear executedContentHandlers and re-execute from scratch if html changes.
            this.executedContentHandlers.forEach(executedContentHandler => {
                this.undoHandleContent(executedContentHandler);
            });
            this.executedContentHandlers = [];
        }
    }

    render() {
        /* tslint:disable:react-no-dangerous-html */
        /* eslint-disable react/no-danger */
        return (
            <div
                ref={ref => (this.htmlContentRef = ref)}
                dangerouslySetInnerHTML={{ __html: this.props.html }}
            />
        );
        /* eslint-enable react/no-danger */
        /* tslint:enable:react-no-dangerous-html */
    }
}
