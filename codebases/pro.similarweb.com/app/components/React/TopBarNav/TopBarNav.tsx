import { PopupHoverContainer } from "@similarweb/ui-components/dist/popup-hover-container";
import { WebsiteGroupRecommendationSuccess } from "components/RecommededWebsiteGroupEngine/websiteGroupRecommendationSuccess";
import SWReactRootComponent from "decorators/SWReactRootComponent";
import * as _ from "lodash";
import * as React from "react";
import { Component } from "react";
import { connect } from "react-redux";
import { allTrackers } from "services/track/track";
import { processMenuItem } from "../../../../scripts/common/services/moduleService";
import ABService from "../../../services/ABService";
import { TopBarItem } from "./TopBarItem";
import TopNavSubPopupContent from "./TopNavSubPopupContent";
import { menuItemsLinks } from "./TopNavSubPopupContentItems";

class TopBarNav extends Component<any, any> {
    public static getDerivedStateFromProps(props, state) {
        if (props.selected !== state.selected) {
            return {
                selected: _.findIndex(props.sections, (item: any) => item.id === props.selected),
            };
        }

        return null;
    }

    private cig: any;

    constructor(props, context) {
        super(props, context);
        this.state = {
            selected: _.findIndex(props.sections, (item: any) => item.id === props.selected),
        };
    }

    public onItemClicked = (item) => {
        const _item = this.props.sections[item];
        allTrackers.trackEvent("Topbar", "click", `${_item.trackId}`);
        if (_item.link) {
            if (_item.disabled) {
                return;
            }
            this.setState({
                selected: item,
            });

            // ABTest for directing user clicking on Track to Track Homepage or Dashboard.
            if (_item.trackId === "Track") {
                const abLink = ABService.getFlag("trackLink");
                if (abLink) {
                    _item.link = `/#/${abLink}`;
                }
            }

            setTimeout(() => {
                (window as Window).location.href = _item.link;
            }, 500);
        }
    };

    public render() {
        const sections = [];
        this.props.sections.map((item, i) => {
            const sectionItems = menuItemsLinks(item.trackId, this.props.cig.cigLink)
                .map(processMenuItem)
                .map((item) => {
                    return {
                        ...item,
                        selected: _.includes(item.modules, this.props.currentModule),
                    };
                });
            let _className = "";
            if (i === this.state.selected) {
                _className = "selected";
            }
            // create props object to pass to TopBarItem
            const props = {
                onClick: this.onItemClicked,
                index: i,
                key: i,
                className: _className,
                bgColor: item.color,
                hoverText: null,
            };
            if (sectionItems.length === 0) {
                props.hoverText = item.hoverText;
            }
            const itemComponent = <TopBarItem {...props}>{item.text}</TopBarItem>;

            if (item.trackId === "Workspaces" && this.props.websiteGroupRecommendationSuccess) {
                sections.push(
                    <WebsiteGroupRecommendationSuccess>
                        <div>{itemComponent}</div>
                    </WebsiteGroupRecommendationSuccess>,
                );
            } else {
                if (sectionItems.length > 0) {
                    sections.push(
                        <PopupHoverContainer
                            key={i}
                            content={() => <TopNavSubPopupContent items={sectionItems} />}
                            injectClosePopupIntoContent={true}
                            closePopupOnClick={true}
                            config={{
                                enabled: true,
                                placement: "bottom-left",
                                allowHover: true,
                                closeDelay: 250,
                                width: item.width || 670,
                                cssClassContainer: "TopNavSubPopup",
                            }}
                        >
                            <div>{itemComponent}</div>
                        </PopupHoverContainer>,
                    );
                } else {
                    sections.push(itemComponent);
                }
            }
        });
        return <div className={"Switcher TopBarSwitcher"}>{sections}</div>;
    }
}

function mapStateToProps({
    routing: { currentModule },
    cig,
    marketingWorkspace: { websiteGroupRecommendationSuccess },
}) {
    return {
        currentModule,
        cig,
        websiteGroupRecommendationSuccess,
    };
}

export default SWReactRootComponent(connect(mapStateToProps)(TopBarNav), "TopBarNav");
