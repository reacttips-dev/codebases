import { Bubble } from "@similarweb/ui-components/dist/bubble";
import { i18nFilter } from "filters/ngFilters";
import * as React from "react";
import { Component } from "react";
import styled from "styled-components";
import { PreferencesService } from "services/preferences/preferencesService";

interface IAddWebsitesBubbleState {
    isOpen: boolean;
}

const Pin = styled.div`
    position: relative;
    top: 64px;
    border: 1px solid black;
    left: 0;
    opacity: 0;
`;

const USERDATA_PREFERENCES_KEY = "leadGeneratorReportResultBubble";

export class AddWebsitesBubble extends Component<{}, IAddWebsitesBubbleState> {
    constructor(props) {
        super(props);

        this.onUserAddPreferences();

        this.state = {
            isOpen: !PreferencesService.get(USERDATA_PREFERENCES_KEY),
        };
    }

    private onUserAddPreferences = async () => {
        await PreferencesService.add({ [`${USERDATA_PREFERENCES_KEY}`]: true });
    };

    public toogleBubble = async () => {
        this.setState({ isOpen: !this.state.isOpen });
    };

    public render() {
        return (
            <Bubble
                isOpen={this.state.isOpen}
                onClose={() => {
                    this.toogleBubble();
                }}
                placement="right"
                cssClass={"Bubble-element add-websites-bubble"}
                title={i18nFilter()("grow.lead_generator.wizard.step2.tooltip.title")}
                text={i18nFilter()("grow.lead_generator.wizard.step2.tooltip.text")}
            >
                <Pin />
            </Bubble>
        );
    }
}
