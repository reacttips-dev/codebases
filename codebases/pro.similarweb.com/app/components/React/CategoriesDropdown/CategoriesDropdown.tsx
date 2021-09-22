/**
 * Created by Sahar.Rehani on 7/29/2016.
 */

import autobind from "autobind-decorator";
import * as classNames from "classnames";
import SWReactComponent from "decorators/SWReactRootComponent";
import * as _ from "lodash";
import * as PropTypes from "prop-types";
import * as React from "react";
import { i18nFilter } from "../../../filters/ngFilters";
import { InjectableComponent } from "../InjectableComponent/InjectableComponent";
import { SearchInput } from "../SearchInput/SearchInput";
import "./CategoriesDropdown.scss";
import { CategoriesDropdownTitle } from "./ChildComponents/CategoriesDropdownTitle";
import { CategoriesItems } from "./ChildComponents/CategoriesItems";
import categoryService from "common/services/categoryService";
import { SwTrack } from "services/SwTrack";

@SWReactComponent
export class CategoriesDropdown extends InjectableComponent {
    public static propTypes = {
        categories: PropTypes.array.isRequired,
        customCategories: PropTypes.array,
        categoriesTitle: PropTypes.string,
        customCategoriesTitle: PropTypes.string,
        selectedCat: PropTypes.string,
        maxWidth: PropTypes.string,
        minWidth: PropTypes.string,
        marginLeft: PropTypes.string,
        textAlign: PropTypes.string,
        trackName: PropTypes.string,
        trackContext: PropTypes.string,
        showSharedGroups: PropTypes.bool,
        placeholderItem: PropTypes.shape({
            text: PropTypes.string.isRequired,
            icon: PropTypes.string.isRequired,
        }),
        removeItemTooltip: PropTypes.shape({
            title: PropTypes.string.isRequired,
            buttonOk: PropTypes.string.isRequired,
            buttonCancel: PropTypes.string.isRequired,
        }),
        className: PropTypes.string,
    };

    public static defaultProps = {
        textAlign: "left",
        marginLeft: "0",
        trackName: "",
        showSharedGroups: false,
        customCategories: [],
        trackContext: "Category",
        removeItemTooltip: {
            title: "customcategories.dropdown.delete.popup",
            buttonOk: "customcategories.dropdown.delete.popup.delete",
            buttonCancel: "customcategories.dropdown.delete.popup.cancel",
        },
        className: "",
    };

    public static findItemStatic(id, categories, customCategories) {
        let child = null;
        const customItem = _.find(customCategories, (item) => {
            if (item["id"] === id) {
                return true;
            }
        });
        const item = _.find(categories, (item) => {
            if (item["id"] === id) {
                return true;
            }
            if (item["children"]) {
                child = _.find(item["children"], (subItem) => {
                    if (subItem["id"] === id) {
                        return true;
                    }
                });
                if (!_.isEmpty(child)) {
                    return child;
                }
            }
        });

        return customItem || child || item;
    }

    public static getDerivedStateFromProps(props, state) {
        const newItem = CategoriesDropdown.findItemStatic(
            props.selectedCat,
            props.categories,
            props.customCategories.flat(1),
        );
        if (state.selectedItem !== newItem) {
            return {
                selectedItem: newItem,
            };
        }

        return null;
    }

    private scrollAreaElement: any;

    public constructor(props) {
        super(props);
        this.state = {
            selectedItem: "",
            searchString: "",
        };
    }

    public onSearch = (e) => {
        this.setState({ searchString: e.target.value });
        setTimeout(() => {
            this.scrollAreaElement.scrollYTo(0);
        }, 20);
    };

    public toggleDropdown = (e) => {
        const categoriesResults = $(".categories-results");
        if (categoriesResults.is(":visible") && !this.state.itemToDelete) {
            categoriesResults.hide();
        } else {
            categoriesResults.show().find(".search-input").focus();
            SwTrack.all.trackEvent("Drop down", "open", this.props.trackName);
        }
    };

    public selectItem = (cat, e) => {
        const target = e.target;
        if (
            cat.inactive ||
            cat.disabled ||
            cat.id === -2 ||
            target.classList.contains("js-dropdownPopup-popup-ignore-click")
        ) {
            return;
        } else {
            const catText = cat.text === "forms.category.all" ? "All Categories" : cat.text;
            SwTrack.all.trackEvent("Drop down", "click", this.props.trackName + "/" + catText);
            this.setState({ selectedItem: cat });
            this.toggleDropdown(e);
            this.props.onSelect(cat.id);
        }
    };

    public findItem(id) {
        return CategoriesDropdown.findItemStatic(
            id,
            this.props.categories,
            this.props.customCategories,
        );
    }

    public editItem = (itemToEdit, e) => {
        this.props.onEdit(itemToEdit);
        SwTrack.all.trackEvent("Drop Down", "edit", this.props.trackName + "/" + itemToEdit.text);
    };

    public shareItem = (itemToShare, e) => {
        if (typeof this.props.onShare === "function") {
            this.props.onShare(itemToShare, e);
        }
    };

    public deleteItem = (item) => {
        SwTrack.all.trackEvent("Pop Up", "click", `Delete ${this.props.trackContext}/Yes`);

        this.props.onDelete(item).then(() => {
            if (this.state.selectedItem && this.state.selectedItem.id === item.id) {
                // if the user delete the selected item
                this.setState({ selectedItem: this.findItem("All") });
            }
        });
    };

    public cancelDeletion = (e) => {
        SwTrack.all.trackEvent("Pop Up", "click", `Delete ${this.props.trackContext}/No`);
    };

    public showDeleteConfirmation = (itemToDelete, e) => {
        SwTrack.all.trackEvent(
            "Drop down",
            "delete",
            this.props.trackName + "/" + itemToDelete.text,
        );
    };

    public componentDidMount() {
        $(document.body).on("click", this.outsideClickEvent);
    }

    public componentWillUnmount() {
        $(document.body).off("click", this.outsideClickEvent);
    }

    public outsideClickEvent = (e) => {
        if (
            !$(e.target).closest(".categories-dropdown").length &&
            $(e.target).closest(".js-dropdownPopup-popup-ignore-click").length === 0
        ) {
            $(".categories-results").hide();
        }
    };

    public render() {
        const polaceholder = i18nFilter()("utils.search");
        const classnames = classNames(
            "CategoriesDropdown dropdownPopup sw-big categories-dropdown",
            this.props.className,
        );
        const showCustomCategories = categoryService.hasCustomCategoriesPermission();

        return (
            <div
                className={classnames}
                style={{
                    maxWidth: this.props.maxWidth,
                    minWidth: this.props.minWidth,
                    textAlign: this.props.textAlign,
                    marginLeft: this.props.marginLeft,
                }}
            >
                <CategoriesDropdownTitle
                    selectedItem={this.state.selectedItem || this.props.placeholderItem}
                    onSelect={this.toggleDropdown}
                    trackName={this.props.trackName}
                />
                <div
                    className="CategoriesDropdown-results categories-results dropdownPopup-popup dropdownPopup-popup-left dropdown-menu-right"
                    style={{ minWidth: this.props.minWidth }}
                >
                    <SearchInput
                        searchString={this.state.searchString}
                        onSearch={this.onSearch}
                        placeholder={polaceholder}
                    />
                    <CategoriesItems
                        searchString={this.state.searchString}
                        customItems={showCustomCategories ? this.props.customCategories : []}
                        showSharedGroups={this.props.showSharedGroups}
                        items={this.props.categories}
                        itemsTitle={this.props.categoriesTitle}
                        customItemsTitle={this.props.customCategoriesTitle}
                        selectedItem={this.state.selectedItem || {}}
                        onSelect={this.selectItem}
                        onShowDeleteConfirmation={this.showDeleteConfirmation}
                        onEdit={this.editItem}
                        onShare={this.shareItem}
                        onDelete={this.deleteItem}
                        onCancel={this.cancelDeletion}
                        removeItemTooltip={this.props.removeItemTooltip}
                        scrollAreaRef={this.setScrollAreaRef}
                        users={this.props.users}
                    />
                </div>
            </div>
        );
    }

    @autobind
    private setScrollAreaRef(ref) {
        this.scrollAreaElement = ref;
    }
}
