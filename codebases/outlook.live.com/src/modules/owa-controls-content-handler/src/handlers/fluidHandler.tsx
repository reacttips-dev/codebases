import type { ContentHandler } from 'owa-controls-content-handler-base';
import { PerformanceDatapoint } from 'owa-analytics';
import { assertNever } from 'owa-assert';
import { timestamp } from 'owa-datetime';
import {
    lazyGetScenarioStartTime,
    reportPerfCheckmark,
    OWAFluidCheckmarksEnum,
} from 'owa-fluid-perf-datapoints';
import { FluidOwaSource, FluidOwaScenario, isDownLevelFluidLink } from 'owa-fluid-validations';
import { lazyMountFluidComponent, lazyTryGetFluidDriverForUrl } from 'owa-fluid-integrations';
import * as trace from 'owa-trace';
import { onFluidFileLoadFailure } from 'owa-fluid-link';
import type { LoadedInfo } from '@ms/office-web-host';
import type { CommandProps } from '@fluidx/office-fluid-types';
import * as ReactDOM from 'react-dom';

export const FLUID_HANDLER_NAME = 'fluidHandler';
const FLUID_SELECTOR = 'a';
const ORIGINALSRC_ATTTIBUTE_NAME = 'originalsrc';

export class FluidHandler implements ContentHandler {
    public readonly cssSelector = FLUID_SELECTOR;
    public readonly keywords = null;
    private storeElements: HTMLElement[] = [];
    readonly owaSource: FluidOwaSource;
    private onComponentLoadedInIframe = null;
    readonly viewStateId: string;
    private controlNode: React.ReactElement<{}>;
    private getCustomMenuItems: () => CommandProps[];
    private addRecipientFunc: (address: string) => void | undefined;
    private autoFocus: boolean;

    constructor(
        owaSource: FluidOwaSource,
        onComponentLoadedInIframe?: (loadedInfo: LoadedInfo) => void,
        controlNode?: React.ReactElement<{}>,
        getCustomMenuItems?: () => CommandProps[],
        viewStateId?: string,
        addRecipientFunc?: (address: string) => void | undefined,
        autoFocus?: boolean
    ) {
        this.storeElements = [];
        this.owaSource = owaSource;
        this.onComponentLoadedInIframe = onComponentLoadedInIframe;
        this.controlNode = controlNode;
        this.getCustomMenuItems = getCustomMenuItems;
        this.viewStateId = viewStateId;
        this.addRecipientFunc = addRecipientFunc;
        this.autoFocus = autoFocus;
    }

    public readonly handler = (element: HTMLElement) => {
        const href = element.hasAttribute(ORIGINALSRC_ATTTIBUTE_NAME)
            ? element.getAttribute(ORIGINALSRC_ATTTIBUTE_NAME)
            : (element as HTMLAnchorElement).href;

        // Links which are part of the html blob for collab space support in down level clients
        // need to be prevented from hydrating.
        if (isDownLevelFluidLink(element, href)) {
            return;
        }

        //Links without text in them (i.e. image links) should not be hydrated
        //If we've already hydrated a specific link before, don't hydrate it again.
        const trimmedContent = element.textContent.trim();
        if (trimmedContent) {
            // Used to measure E2E perf from time of opening email to time the component is rendered
            this.getStartTime(this.owaSource).then(scenarioStartTime => {
                // add it here, if it fails remove it.
                lazyTryGetFluidDriverForUrl.import().then(tryGetFluidDriverForUrl => {
                    reportPerfCheckmark(OWAFluidCheckmarksEnum.ch8, this.owaSource);
                    const driverInfo = tryGetFluidDriverForUrl(href);
                    if (driverInfo) {
                        // We typecast as any since the true type is not exported.
                        driverInfo.headers = { isSharingLinkToRedeem: true } as any;

                        lazyMountFluidComponent.import().then(mountFluidComponent => {
                            reportPerfCheckmark(OWAFluidCheckmarksEnum.ch10, this.owaSource);
                            if (mountFluidComponent && element?.ownerDocument) {
                                const placeholderDiv = element.ownerDocument.createElement('div');
                                placeholderDiv.dataset.fluidContainer = 'true';
                                element.insertAdjacentElement('afterend', placeholderDiv);
                                const scenarioString: FluidOwaScenario = this.getScenarioFromSource(
                                    this.owaSource
                                );
                                const perfDatapoint = new PerformanceDatapoint(
                                    'FluidReadComponent'
                                );
                                const customMenuItems = this.getCustomMenuItems?.();
                                this.storeElements.push(placeholderDiv);
                                reportPerfCheckmark(OWAFluidCheckmarksEnum.ch11, this.owaSource);
                                mountFluidComponent(
                                    placeholderDiv,
                                    driverInfo,
                                    scenarioString,
                                    scenarioStartTime,
                                    perfDatapoint,
                                    this.owaSource,
                                    element,
                                    href,
                                    this.controlNode,
                                    customMenuItems,
                                    this.addRecipientFunc,
                                    this.autoFocus
                                )
                                    .then(loadedInfo => {
                                        this.onComponentLoadedInIframe?.(loadedInfo);
                                        reportPerfCheckmark(
                                            OWAFluidCheckmarksEnum.ch12,
                                            this.owaSource
                                        );
                                    })
                                    .catch(error => {
                                        this.cleanupAfterFailure(element, placeholderDiv, error);
                                    });
                            }
                        });
                    }
                });
            });
        }
    };

    private async getStartTime(source: FluidOwaSource) {
        const owaFluidScenartioStartTime = await lazyGetScenarioStartTime.importAndExecute();
        return (source === FluidOwaSource.MailCalendarCard ||
            source === FluidOwaSource.CalendarCompose ||
            source === FluidOwaSource.CalendarReadingPane) &&
            owaFluidScenartioStartTime
            ? owaFluidScenartioStartTime
            : timestamp();
    }

    private getScenarioFromSource(source: FluidOwaSource): FluidOwaScenario {
        switch (source) {
            case FluidOwaSource.MailReadingPane:
            case FluidOwaSource.MailCalendarCard:
                return FluidOwaScenario.MAIL_READINGPANE_SCENARIO;
            case FluidOwaSource.AgendaEditor:
            case FluidOwaSource.CalendarReadingPane:
            case FluidOwaSource.CalendarCompose:
                return FluidOwaScenario.CALENDAR_READ_SCENARIO;
            case FluidOwaSource.MailCompose:
            case FluidOwaSource.Timestream:
            case FluidOwaSource.None:
                trace.errorThatWillCauseAlert(
                    `Incompatible fluid source for fluid handler. Source is ${source}`
                );
                return FluidOwaScenario.UNKNOWN_READ_SCENARIO;
            default:
                return assertNever(source);
        }
    }

    private cleanupAfterFailure = (
        element: HTMLElement,
        placeholderDiv: HTMLElement,
        error: any
    ) => {
        // This check is required to make sure we don't fire any action for a fluid component
        // which has already been unmounted as it was trying to hydrate.
        if (document.body.contains(element)) {
            onFluidFileLoadFailure(this.owaSource, error, this.viewStateId);
        }
        // We must re-insert the original element to extract it from the header before deleting the component.
        placeholderDiv.insertAdjacentElement('beforebegin', element);
        placeholderDiv.parentNode?.removeChild(placeholderDiv);
    };

    public readonly undoHandler = (elements: HTMLElement[]) => {
        this.storeElements.forEach((placeholderDiv, index) => {
            if (elements[index] && placeholderDiv) {
                placeholderDiv.insertAdjacentElement('beforebegin', elements[index]);
            }
            placeholderDiv.parentNode?.removeChild(placeholderDiv);
            ReactDOM.unmountComponentAtNode(placeholderDiv);
        });
        this.storeElements = [];
    };
}

/**
 * @param addRecipientFunc adds a recipient to the recipients list when at mentioned in compose scenarios
 * should be undefined for read scenarios.
 */
export default function createFluidHandler(
    owaSource: FluidOwaSource,
    onComponentLoadedInIframe?: (loadedInfo: LoadedInfo) => void,
    controlNode?: React.ReactElement<{}>,
    getCustomMenuItems?: () => CommandProps[],
    viewStateId?: string,
    addRecipientFunc?: (address: string) => void | undefined,
    autoFocus?: boolean
): FluidHandler {
    reportPerfCheckmark(OWAFluidCheckmarksEnum.ch13, owaSource);

    return new FluidHandler(
        owaSource,
        onComponentLoadedInIframe,
        controlNode,
        getCustomMenuItems,
        viewStateId,
        addRecipientFunc,
        autoFocus
    );
}
