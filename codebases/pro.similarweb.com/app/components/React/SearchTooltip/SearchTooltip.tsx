import { SWReactIcons } from "@similarweb/icons";
import { swSettings } from "common/services/swSettings";
import * as React from "react";
import SWReactRootComponent from "../../../decorators/SWReactRootComponent";
import { i18nFilter } from "../../../filters/ngFilters";
import { allTrackers } from "../../../services/track/track";
import {
    SearchTooltipClose,
    SearchTooltipContent,
    SearchTooltipOverlay,
    SearchTooltipText,
    SearchTooltipTitle,
} from "./StyledComponents";
import { PreferencesService } from "services/preferences/preferencesService";

declare const window;

const USER_SAW_SEARCH_TOOLTIP = "userSawSearchTooltip";
const START_USER_ID = 5069787;

interface ISearchTooltip {
    isOpen: boolean;
}

class SearchTooltip extends React.PureComponent<any, ISearchTooltip> {
    private readonly overlayRef: any;
    private readonly contentRef: any;
    private search: HTMLInputElement;

    constructor(props) {
        super(props);

        const isVwoShow = window.vwoShowSearchTooltip;
        const isFroUser = swSettings.user.isFro;
        const isNewUser = swSettings.user.id >= START_USER_ID;

        this.state = {
            isOpen:
                isVwoShow &&
                isFroUser &&
                isNewUser &&
                !PreferencesService.get(USER_SAW_SEARCH_TOOLTIP),
        };
        this.overlayRef = React.createRef();
        this.contentRef = React.createRef();
    }

    public componentDidMount() {
        if (this.state.isOpen) {
            this.search = document.querySelector(".universalInput-input");

            if (this.search) {
                this.search.classList.add("active");
            }
            window.addEventListener("mousedown", this.onWindowClick, { capture: true });
            allTrackers.trackEvent("Pop up", "Open", "Overlay on Fro");
        }
    }

    public componentWillUnmount() {
        window.removeEventListener("mousedown", this.onWindowClick, { capture: true });
    }

    public render() {
        return !this.state.isOpen ? null : (
            <>
                <SearchTooltipOverlay ref={this.overlayRef} />
                <SearchTooltipContent ref={this.contentRef}>
                    <SearchTooltipTitle>{i18nFilter()("search_tooltip.title")}</SearchTooltipTitle>
                    <SearchTooltipText>{i18nFilter()("search_tooltip.text")}</SearchTooltipText>
                    <SearchTooltipClose onClick={this.onCloseClick}>
                        <SWReactIcons iconName="clear" size="xs" />
                    </SearchTooltipClose>
                </SearchTooltipContent>
            </>
        );
    }

    private close = () => {
        this.setState(
            {
                isOpen: false,
            },
            () => {
                window.removeEventListener("mousedown", this.onWindowClick);
                PreferencesService.add({ [`${USER_SAW_SEARCH_TOOLTIP}`]: true });
                allTrackers.trackEvent("Pop up", "Close", "Overlay on Fro");
            },
        );
    };

    private onCloseClick = () => {
        if (this.search) {
            this.search.classList.remove("active");
        }
        this.close();
    };

    private onWindowClick = (event) => {
        if (
            event.target !== this.overlayRef.current &&
            !this.contentRef.current.contains(event.target)
        ) {
            this.close();
        }
    };
}

SWReactRootComponent(SearchTooltip, "SearchTooltip");

export default SearchTooltip;
