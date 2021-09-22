import * as React from "react";
import { CSSProperties, PureComponent } from "react";
import "@similarweb/styles/src/loaders.scss";
import { AutocompleteWithItems } from "@similarweb/ui-components/dist/autocomplete";
import { WebsiteChipItem } from "@similarweb/ui-components/dist/chip";
import { ScrollArea } from "@similarweb/ui-components/dist/react-scrollbar";
import * as classNames from "classnames";
import SmallSiteNotificationPopup from "components/SmallSiteNotification/src/SmallSiteNotificatonPopup";
import * as _ from "lodash";
import * as PropTypes from "prop-types";
import { TrackWithGuidService } from "services/track/TrackWithGuidService";
import { IDomain } from "../../../types/feed.types";
import { WebsiteListItem } from "../../website-list-item/src/WebsiteListItem";
import "../styles/MultipleSelection.scss";

export interface ISuggestedDomain extends IDomain {
    isSelected: boolean;
}

interface IMultipleSelectionProps {
    suggestions: IDomain[];
    suggestionsTitle: string;
    selectedItems: IDomain[];
    onItemAdded: (domain: IDomain, source?: string) => void;
    onItemDeleted: (ddomain: IDomain) => void;
    getAutoCompleteItems: (query) => any;
    placeholder: string;
    isAutocopmleteLoading: boolean;
    scrollHeight: number;
    onAutocompleteFocus: () => void;
    onAutocompleteBlur: () => void;
    autoCompleteIsFocused: boolean;
    maxItems?: number;
    enableSmallSiteNotification?: boolean;
    inputIsEmpty?: boolean;
    deactivateItemPopup?: (index) => void;
    isSmallSiteNotificationOpen?: (value) => void;
}

const scrollbarStyles = {
    borderRadius: 10,
    width: 4,
};

const scrolltContainerStyle: CSSProperties = {
    margin: "5px 0",
    backgroundColor: "transparent",
    boxSizing: "border-box",
};

export class MultipleSelection extends PureComponent<IMultipleSelectionProps> {
    public static propTypes = {
        suggestions: PropTypes.arrayOf(
            PropTypes.shape({
                name: PropTypes.string.isRequired,
                icon: PropTypes.string,
            }),
        ),
        suggestionsTitle: PropTypes.string.isRequired,
        selectedItems: PropTypes.arrayOf(
            PropTypes.shape({
                name: PropTypes.string.isRequired,
                icon: PropTypes.string,
                isBlackList: PropTypes.number,
                ignoreSmallSite: PropTypes.bool,
            }),
        ),
        onItemAdded: PropTypes.func.isRequired,
        onItemDeleted: PropTypes.func.isRequired,
        getAutoCompleteItems: PropTypes.func.isRequired,
        placeholder: PropTypes.string,
        isAutocopmleteLoading: PropTypes.bool,
        scrollHeight: PropTypes.number,
        maxItems: PropTypes.number,
        enableSmallSiteNotification: PropTypes.bool,
        isSmallSiteNotificationOpen: PropTypes.func,
    };

    public renderSelectedItems = (items, onItemDeleted, enableSmallSiteNotification) => {
        return items.map((item, i) => {
            return (
                <SmallSiteNotificationPopup
                    key={i}
                    isOpen={this.isSmallSiteNotificationOpen(item)}
                    site={item.name}
                    onContinueClick={() => this.onSmallSiteNotificationContinueClick(i)}
                    onEnterClick={() => this.onSmallSiteNotificationEditClick(onItemDeleted, item)}
                    trackPopup={() => this.trackPopup(item.name)}
                >
                    <div>
                        <WebsiteChipItem
                            image={item.icon}
                            key={i}
                            text={item.name}
                            isBlackList={enableSmallSiteNotification && !!item.isBlackList}
                            onCloseItem={onItemDeleted.bind(null, item)}
                        />
                    </div>
                </SmallSiteNotificationPopup>
            );
        });
    };

    private trackPopup = (selectedItemName) => {
        TrackWithGuidService.trackWithGuid(
            "new_arena.main_website.small_site_notification_popup",
            "open",
            {
                location: "/add Competitors",
                selectedCompetitorSite: selectedItemName,
            },
        );
    };

    private onSmallSiteNotificationContinueClick = (i) => {
        TrackWithGuidService.trackWithGuid(
            "workspace.marketing.create_arena.add_competitors.small_site_notification.continue_click",
            "click",
        );
        this.props.deactivateItemPopup(i);
    };

    private onSmallSiteNotificationEditClick = (onItemDeleted, item) => {
        TrackWithGuidService.trackWithGuid(
            "workspace.marketing.create_arena.add_competitors.small_site_notification.remove_click",
            "click",
        );
        onItemDeleted(item);
    };

    private isSmallSiteNotificationOpen = (item) => {
        const isOpen =
            item &&
            item.isBlackList &&
            !item.ignoreSmallSite &&
            this.props.enableSmallSiteNotification;
        this.props.isSmallSiteNotificationOpen(isOpen);
        return isOpen;
    };

    private getSuggestedItems = (suggestions, selectedItems, onItemAdded) => {
        const selectedItemsNames = selectedItems.map((d) => d.name);
        const items = suggestions.map((s) => ({
            ...s,
            isSelected: _.includes(selectedItemsNames, s.name),
        }));
        // filter out selected items
        return items
            .filter((item) => {
                return !item.isSelected;
            })
            .map((domain, index) => {
                return (
                    <WebsiteListItem
                        key={index}
                        icon={domain.icon}
                        text={domain.name}
                        onClick={onItemAdded.bind(this, domain, "suggested", index + 1)}
                    />
                );
            });
    };

    public render() {
        const autoCompleteClassNames = classNames("MultipleSelection-autocomplete", {
            "MultipleSelection-autocomplete--empty": this.props.selectedItems.length === 0,
        });
        const {
            getAutoCompleteItems,
            selectedItems,
            onItemDeleted,
            enableSmallSiteNotification,
            inputIsEmpty,
            onAutocompleteFocus,
            onAutocompleteBlur,
            maxItems,
            placeholder,
            suggestions,
            suggestionsTitle,
            scrollHeight,
            onItemAdded,
        } = this.props;

        return (
            <div className="MultipleSelection u-flex-column u-flex-center">
                <div className={autoCompleteClassNames}>
                    <AutocompleteWithItems
                        getListItems={getAutoCompleteItems}
                        selectedItems={this.renderSelectedItems(
                            selectedItems,
                            onItemDeleted,
                            enableSmallSiteNotification,
                        )}
                        isFocused={selectedItems.length === 0}
                        isError={inputIsEmpty}
                        onFocus={onAutocompleteFocus}
                        onBlur={onAutocompleteBlur}
                        disabled={
                            selectedItems.length >= maxItems ||
                            !!this.isSmallSiteNotificationOpen(
                                selectedItems[selectedItems.length - 1],
                            )
                        }
                        maxItems={maxItems}
                        placeholder={placeholder}
                        errorIndicator={inputIsEmpty}
                    />
                </div>
                {selectedItems.length <= 3 && suggestions && suggestions.length ? (
                    <div className="MultipleSelection-suggestions">
                        <div className="MultipleSelection-suggestions-title">
                            {suggestionsTitle}
                        </div>
                        <div className="MultipleSelection-suggestions-list">
                            <ScrollArea
                                className="MultipleSelection-suggestions-list-scroll"
                                style={{ height: scrollHeight }}
                                smoothScrolling={true}
                                minScrollSize={40}
                                verticalScrollbarStyle={scrollbarStyles}
                                verticalContainerStyle={scrolltContainerStyle}
                                contentClassName="MultipleSelection-suggestions-list-content"
                            >
                                {this.getSuggestedItems(suggestions, selectedItems, onItemAdded)}
                            </ScrollArea>
                        </div>
                    </div>
                ) : null}
            </div>
        );
    }
}
