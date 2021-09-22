import { Bubble } from "@similarweb/ui-components/dist/bubble";
import * as React from "react";
import { i18nFilter } from "../../../../app/filters/ngFilters";

export const WorkspaceDismissBubble = (props) => {
    return (
        <Bubble
            isOpen={props.isOpen}
            onClose={props.onClose}
            placement={"left"}
            title={i18nFilter()("optIn.workspace.dismiss.title")}
            text={i18nFilter()("optIn.workspace.dismiss.text")}
            appendTo={"#dismiss-dot"}
            cssClass={"Bubble-element dismiss-bubble"}
        >
            <div />
        </Bubble>
    );
};

export const WorkspaceTryBubble = (props) => {
    return (
        <Bubble
            isOpen={props.isOpen}
            onClose={props.onClose}
            placement={"left"}
            title={i18nFilter()("optIn.workspace.try.title")}
            text={i18nFilter()("optIn.workspace.try.text")}
            appendTo={"#dismiss-dot"}
            cssClass={"Bubble-element try-bubble"}
        >
            <div />
        </Bubble>
    );
};
