import type ColorScheme from 'owa-color-utils/lib/ColorScheme';
import type { AriaProperties } from 'owa-accessibility';

export enum InfoBarMessageSource {
    Compose = 0,
    Extensibility = 1,
    ReadingPane = 2,
    Fileshub = 3,
    Txp = 4,
    Peek = 5,
    CalendarCard = 6,
}

export enum InfoBarMessageRank {
    SmimeSignature = 0,
    Safety = 1,
    Error = 2,
    Info = 3,
    Encryption = 4,
    Translation = 5,
    Sensitivity = 6,
    InsightMessage = 7,
    External = 8,
    Spotlight = 9,
}

export enum InfoBarMessageColor {
    Grey = 0,
    Red = 1,
    Green = 2,
    Yellow = 3,
    Orange = 4,
    Green20 = 5,
}

export interface InfoBarShowDetailsAction {
    showDetailsText: string;
    hideDetailsText: string;
    detailsElement: JSX.Element;
}

export interface InfoBarCustomAction {
    text: string;
    floatRight?: boolean;
    action: () => void | Promise<any>;
}

export interface InfoBarCalloutAction {
    text: string;
    calloutContent: JSX.Element;
    maxWidth?: number;
}

export interface InfoBarOption {
    displayName: string;
    value: any;
}

export interface InfoBarInfoIcon {
    toolTipMessage: string;
}

/**
 * Used to present a list of options for the user to select
 * Example: The sender has requested a vote. To respond, click here
 * The action text would be: "click here"
 * The preAction text would be: "The sender has requested a vote. To respond,"
 * hasSelectionConfirmationDialog set to true will display a confirmation dialog confirming the option selection
 * selectionConfirmDialogFormatString will be the label displayed in the dialog - You have chose option {0}
 */
export interface InfoBarOptionsAction {
    actionLinkText: string;
    options: InfoBarOption[];
    onSelect: (option: InfoBarOption) => void;
    preActionText?: string;
    hasSelectionConfirmationDialog?: boolean;
    selectionConfirmDialogFormatString?: string;
}

export type MessagePart =
    | string
    | InfoBarCustomAction
    | InfoBarShowDetailsAction
    | InfoBarCalloutAction
    | InfoBarOptionsAction
    | InfoBarInfoIcon;

export interface InfoBarMessageViewState {
    key: string;
    source: InfoBarMessageSource;
    rank: InfoBarMessageRank;
    /**
     *   Used for the aria announcement of the infobar.
     *
     * Explicitly typed as string | null to make opting out
     * an active decision on the consumer's part.
     **/
    message: string | null;
    /**
     * Localized string used to template message parts together.
     *
     * If no messageTemplate is provided, the messageParts are displayed in order.
     */
    localizedMessageTemplateString?: string;
    /**
     * Parts of a message. See `messageTemplate`
     */
    messageParts?: MessagePart[];
    /**
     * A custom react element to render instead of message parts.
     *
     * Overrides the `messageParts` + `messageTemplate` fields
     */
    messageElement?: JSX.Element;
    color?: InfoBarMessageColor;
    colorScheme?: ColorScheme;
    textContainerClassName?: string;
    textColor?: InfoBarMessageColor;
    ariaProps?: AriaProperties;
    isMessageSemibold?: boolean;
    icon?: string;
}

export interface InfoBarHostViewState {
    infoBarIds: string[];
    infoBarHostKey: string;
}
