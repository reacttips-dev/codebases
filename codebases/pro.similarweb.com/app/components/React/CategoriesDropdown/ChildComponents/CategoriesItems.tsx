/**
 * Created by Sahar.Rehani on 7/29/2016.
 */

import angular from "angular";
import * as React from "react";
import * as PropTypes from "prop-types";
import * as classNames from "classnames";
import styled from "styled-components";
import { CategoryCustomItem } from "./CategoryCustomItem";
import { CategoryItem } from "./CategoryItem";
import { InjectableComponent } from "../../InjectableComponent/InjectableComponent";
import { ScrollArea } from "@similarweb/ui-components/dist/react-scrollbar";
import { CSSProperties } from "react";

const ListText = styled.div`
    padding-left: 12px;
`;

export class CategoriesItems extends InjectableComponent {
    static propTypes = {
        searchString: PropTypes.string,
        customItems: PropTypes.array,
        items: PropTypes.array.isRequired,
        customItemsTitle: PropTypes.string,
        itemsTitle: PropTypes.string,
        selectedItem: PropTypes.object,
        onSelect: PropTypes.func.isRequired,
        onShowDeleteConfirmation: PropTypes.func.isRequired,
        onEdit: PropTypes.func.isRequired,
        onShare: PropTypes.func,
        onDelete: PropTypes.func.isRequired,
        onCancel: PropTypes.func.isRequired,
        confirmationTooltipStyle: PropTypes.object,
        showSharedGroups: PropTypes.bool,
        removeItemTooltip: PropTypes.shape({
            title: PropTypes.string.isRequired,
            buttonOk: PropTypes.string.isRequired,
            buttonCancel: PropTypes.string.isRequired,
        }).isRequired,
    };

    static defaultProps = {
        searchString: "",
        confirmationTooltipStyle: {
            marginTop: "-58px",
            left: "258px",
        },
    };

    getCatClass = (cat, isChild, isDisabled) => {
        const selectedItem = this.props.selectedItem;
        var prefix =
                "CategoryItem dropdownPopup-popup-item " +
                cat.cssClass +
                (selectedItem.id == cat.id ? " is-selected" : ""),
            suffix1 =
                (isDisabled || cat.hooked ? " is-disabled" : "") +
                (isDisabled ? " is-unclickable" : ""),
            suffix2 = isDisabled || cat.hooked || cat.inactive ? "is-disabled" : "";
        return isChild ? prefix + suffix2 : prefix + suffix1;
    };

    customItemsToHTML = (customItems) => {
        const searchString = this.props.searchString.toLowerCase();
        return customItems
            ?.filter((item) => {
                return item.text.toLowerCase().includes(searchString);
            })
            .map((item, index) => {
                return (
                    <CategoryCustomItem
                        key={index}
                        item={item}
                        onSelect={this.props.onSelect}
                        getClass={this.getCatClass}
                        onEdit={this.props.onEdit}
                        onShowDeleteConfirmation={this.props.onShowDeleteConfirmation}
                        onDelete={this.props.onDelete}
                        onCancel={this.props.onCancel}
                        removeItemTooltip={this.props.removeItemTooltip}
                        tooltipStyle={this.props.confirmationTooltipStyle}
                        onShare={this.props.onShare}
                        users={this.props.users}
                    />
                );
            });
    };

    render() {
        const scrollbarStyles = {
            borderRadius: 10,
            width: 4,
        };
        const scrollBarStyle: CSSProperties = {
            maxHeight: 400,
            minHeight: 400,
        };
        if (this.props.showSharedGroups) {
            var filteredCustomItemsMyList = this.customItemsToHTML(this.props.customItems[0]);
            var filteredCustomItemsShared = this.customItemsToHTML(this.props.customItems[1]),
                filteredItems = this.itemsToHTML();
        } else {
            var filteredCustomItems = this.customItemsToHTML(this.props.customItems),
                filteredItems = this.itemsToHTML();
        }
        const customItemsClassnames = classNames("dropdown-results-custom", {
            "dropdown-results-custom--only": filteredItems.length == 0,
        });
        return (
            <ScrollArea
                style={scrollBarStyle}
                verticalScrollbarStyle={scrollbarStyles}
                smoothScrolling={true}
                minScrollSize={60}
                ref={this.props.scrollAreaRef}
            >
                <ul className="dropdown-results">
                    {filteredCustomItemsMyList?.length ? (
                        <li className={customItemsClassnames}>
                            {this.props.customItemsTitle ? (
                                <div className="dropdown-results-section-title">
                                    {this.props.customItemsTitle}
                                </div>
                            ) : null}
                            <ul className="dropdown-results-section">
                                <ListText>My Lists</ListText>
                                {filteredCustomItemsMyList}
                            </ul>
                        </li>
                    ) : null}
                    {filteredCustomItemsShared?.length ? (
                        <li className={customItemsClassnames}>
                            {this.props.customItemsTitle ? (
                                <div className="dropdown-results-section-title">
                                    {this.props.customItemsTitle}
                                </div>
                            ) : null}
                            <ul className="dropdown-results-section">
                                <ListText>Shared Lists</ListText>
                                {filteredCustomItemsShared}
                            </ul>
                        </li>
                    ) : null}
                    {filteredCustomItems?.length ? (
                        <li className={customItemsClassnames}>
                            {this.props.customItemsTitle ? (
                                <div className="dropdown-results-section-title">
                                    {this.props.customItemsTitle}
                                </div>
                            ) : null}
                            <ul className="dropdown-results-section">{filteredCustomItems}</ul>
                        </li>
                    ) : null}
                    {filteredItems?.length ? (
                        <li>
                            <div className="dropdown-results-section-title">
                                {this.props.itemsTitle}
                            </div>
                            <ul className="dropdown-results-section">{filteredItems}</ul>
                        </li>
                    ) : null}
                    {filteredCustomItems?.length === 0 && filteredItems?.length === 0 ? (
                        <li>
                            <a className="dropdownPopup-popup-item is-disabled">
                                {this.i18n("dropdown.noresults")}
                            </a>
                        </li>
                    ) : null}
                </ul>
            </ScrollArea>
        );
    }

    itemsToHTML = () => {
        const searchString = this.props.searchString.toLowerCase();

        return this.props.items
            .filter((item) => {
                var isParentMatched = item.text.toLowerCase().includes(searchString);
                var matchingChilds = item.children.filter((subItem) => {
                    return subItem.text.toLowerCase().includes(searchString);
                });
                return !isParentMatched && !matchingChilds.length ? false : true;
            })
            .map((item, index) => {
                var isParentMatched = item.text.toLowerCase().includes(searchString);
                var subItems = isParentMatched
                    ? item.children
                    : item.children.filter((subItem) => {
                          return subItem.text.toLowerCase().includes(searchString);
                      });
                subItems = subItems.map((subItem, subIndex) => {
                    return (
                        <CategoryItem
                            key={subIndex}
                            item={subItem}
                            isChild={true}
                            isDisabled={false}
                            onSelect={this.props.onSelect}
                            getClass={this.getCatClass}
                        />
                    );
                });
                var subItemsHTML = subItems.length ? <ul>{subItems}</ul> : null;

                return (
                    <CategoryItem
                        key={index}
                        item={item}
                        isChild={false}
                        isDisabled={!isParentMatched}
                        onSelect={this.props.onSelect}
                        getClass={this.getCatClass}
                    >
                        {subItemsHTML}
                    </CategoryItem>
                );
            });
    };
}
