import isNewestOnBottom from 'owa-mail-store/lib/utils/isNewestOnBottom';
import * as React from 'react';

export function renderConversationReadingPane(
    readingPane: JSX.Element[],
    inlineCompose: JSX.Element,
    seeMoreMessages: JSX.Element
) {
    const newestOnTopItemPart = (
        <>
            {inlineCompose}
            {readingPane}
            {seeMoreMessages}
        </>
    );
    const newestOnBottomItemPart = (
        <>
            {seeMoreMessages}
            {readingPane}
            {inlineCompose}
        </>
    );

    return renderChooser(newestOnTopItemPart, newestOnBottomItemPart);
}

export function renderComponentsBySortOrder(components: JSX.Element[]): JSX.Element {
    return isNewestOnBottom() ? <>{components}</> : <>{components.reverse()}</>;
}

export function renderExpandedItemPart(
    expandedItemPart: JSX.Element,
    fossilizedText: JSX.Element,
    rollUp: JSX.Element
): JSX.Element {
    const newestOnTopExpandedItemPart = (
        <>
            {rollUp}
            {expandedItemPart}
            {fossilizedText}
        </>
    );
    const newestOnBottomExpandedItemPart = (
        <>
            {fossilizedText}
            {expandedItemPart}
            {rollUp}
        </>
    );

    return renderChooser(newestOnTopExpandedItemPart, newestOnBottomExpandedItemPart);
}

export function renderCollapsedItemPart(
    collapsedItemPart: JSX.Element,
    fossilizedText: JSX.Element,
    rollUp: JSX.Element
): JSX.Element {
    const newestOnTopCollapsedItemPart = (
        <>
            {rollUp}
            {collapsedItemPart}
        </>
    );
    const newestOnBottomCollapsedItemPart = (
        <>
            {fossilizedText}
            {collapsedItemPart}
            {rollUp}
        </>
    );

    return renderChooser(newestOnTopCollapsedItemPart, newestOnBottomCollapsedItemPart);
}

export function renderFossilizedText(
    newestOnTopFossilizedText: JSX.Element,
    newestOnBottomFossilizedText: JSX.Element
): JSX.Element {
    return renderChooser(newestOnTopFossilizedText, newestOnBottomFossilizedText);
}

function renderChooser(
    newestOnTopElement: JSX.Element,
    newestOnBottomElement: JSX.Element
): JSX.Element {
    return isNewestOnBottom() ? newestOnBottomElement : newestOnTopElement;
}
