import * as React from "react";
import { InjectableComponent } from "components/React/InjectableComponent/InjectableComponent";
import { Injector } from "common/ioc/Injector";
import styled, { css } from "styled-components";
import { SimpleLegend } from "@similarweb/ui-components/dist/simple-legend";

import {
    ListItemWebsite,
    ListItemApp,
    ListItemIndustry,
    ListItemKeyword,
    ListItemKeywordGroup,
} from "@similarweb/ui-components/dist/list-item";

import { SimpleLegendItemClosable } from "@similarweb/ui-components/dist/simple-legend";

import { AutocompleteWithItems } from "@similarweb/ui-components/dist/autocomplete";

import {
    WebsiteChipItem,
    CategoryChipItem,
    KeywordChipItem,
} from "@similarweb/ui-components/dist/chip";
import { IAutoCompleteKeywordItem } from "autocomplete";
import * as _ from "lodash";
import SWReactRootComponent from "decorators/SWReactRootComponent";
import { isMetricMetaDataNeeded } from "../utils/dashboardWizardUtils";
import { allTrackers } from "services/track/track";
import { i18nFilter } from "filters/ngFilters";
import { DefaultFetchService } from "services/fetchService";
import { DotsLoader } from "@similarweb/ui-components/dist/search-input";
import { keywordsGroupsService } from "pages/keyword-analysis/KeywordGroupsService";

const DashboardWizardSimpleLegend = styled(SimpleLegend)<any>`
    flex-wrap: wrap;
    width: 100%;
    ${SimpleLegendItemClosable} {
        margin-top: 10px;
        width: 33.33%;
    }
`;
DashboardWizardSimpleLegend.displayName = "DashboardWizardSimpleLegend";

class DashboardWizardAutocomplete extends InjectableComponent {
    private fetchService;

    constructor(props) {
        super(props);
        this.state = {
            maxKeys: this.getMaxKeys(),
            keyCountClass: "widgetWizard-keyCount",
            autocompleteSuggestions: [],
            autocompleteRemovedSuggestions: {},
            autocompletePlaceholder: this.getAutocompletePlaceholder(),
            isAutocompleteDisabled: this.shouldFreezeAutocomplete(props.customDashboard),
        };
        this.fetchService = DefaultFetchService.getInstance();
        this.getData = this.getData.bind(this);
        this.onItemSelect = this.onItemSelect.bind(this);
        this.autocompleteBlur = this.autocompleteBlur.bind(this);
        if (["Website", "Mobile"].indexOf(props.customDashboard.widget.family) > -1) {
            if (props.customDashboard.widget.key.length > 0) {
                this.getSimilarItems(
                    props.customDashboard.widget.key[0],
                    props.customDashboard.widget.key,
                );
            }
        }
    }

    public componentDidUpdate(prevProps) {
        if (prevProps.customDashboard.widget !== this.props.customDashboard.widget) {
            const newWidget = this.props.customDashboard.widget;

            const keyCountClass =
                newWidget.key.length === 0
                    ? "widgetWizard-keyCount widgetWizard-keyCount--error"
                    : "widgetWizard-keyCount";

            // Because of the metric drop down - we need to disable the autocomplete when props are being changed and not only in the constructor.
            this.setState({
                isAutocompleteDisabled: this.shouldFreezeAutocomplete(this.props.customDashboard),
                autocompletePlaceholder: this.getAutocompletePlaceholder(
                    newWidget.key.length,
                    this.props.customDashboard,
                ),
                keyCountClass,
            });
        }
    }

    getMaxKeys(customDashboard?) {
        const _customDashboard =
            customDashboard === undefined ? this.props.customDashboard : customDashboard;
        if (!_customDashboard.isCompare) return 1;
        return ["Industry", "Keyword"].indexOf(_customDashboard.widget.family) > -1 ? 1 : 5;
    }

    getItemIdByFamily(item, family) {
        switch (family) {
            case "Industry":
                if (item.categoryId) {
                    return item.categoryId;
                } else {
                    return `$${item.category}`;
                }
            case "Keyword":
                if (item.groupId) {
                    return item.groupId;
                }
            default:
                return item.id;
        }
    }

    onItemSelect(item) {
        //TODO: I18N;
        //Map selected item into a standard key object.
        let _newKey: any = {
            id: this.getItemIdByFamily(item, this.props.customDashboard.widget.family),
            name: item.name,
            image: item.image,
            icon: item.icon,
            type: this.props.customDashboard.widget.family,
            isSuggestion: item.isSuggestion,
        };
        const _isCompare = this.props.customDashboard.widget.key.length > 0;
        if (!_isCompare) {
            allTrackers.trackEvent(
                "Drop Down",
                "click",
                `Open ${_newKey.type}/${_newKey.isSuggestion ? "Suggested" : "Manual"}/${
                    _newKey.name
                }`,
            );
        } else {
            allTrackers.trackEvent(
                "Drop Down",
                "click",
                `Add ${_newKey.type}/${_newKey.isSuggestion ? "Suggested" : "Manual"}/${
                    _newKey.name
                }`,
            );
        }

        //For industry items - add category prop.
        if (this.props.customDashboard.widget.family === "Industry") {
            _newKey.category = _newKey.id;
        }

        //For mobile apps - add store ["google" or "apple"]
        if (item.store) {
            _newKey.store = item.store;
        }

        //Dispatch keyAppend action to update Redux Store.
        this.props.keyAppend(_newKey, this.props.customDashboard);
        const _newKeys = [...this.props.customDashboard.widget.key, _newKey];
        if (
            isMetricMetaDataNeeded(
                this.props.customDashboard.widget.metric,
                this.props.customDashboard.widget.family,
            )
        ) {
            this.props.fetchMetricMetaData(_newKeys, this.props.customDashboard);
        }
        if (this.props.customDashboard.widget.family === "Website") {
            setTimeout(() => {
                this.props.updateGAVerifiedDataFilter(_newKeys, this.props.customDashboard);
            });
        }

        //If the selected item is the first - get similar-sites\apps for it.
        if (this.props.customDashboard.widget.key.length === 0) {
            if (this.shouldFreezeAutocomplete(this.props.customDashboard)) {
                this.setState({
                    autocompletePlaceholder: this.getAutocompletePlaceholder(_newKeys.length),
                    isAutocompleteDisabled: true,
                });
                return;
            }
            if (!(["Industry", "Keyword"].indexOf(this.props.customDashboard.widget.family) > -1)) {
                this.getSimilarItems(item);
            }
        }
        //Otherwise - remove the selected item from suggestions list (to avoid selecting the same suggestion twice)/
        else {
            this.removeItemFromSuggestions(item);
        }

        //Compare is not allowed for industry and keyword modules.
        if (["Industry", "Keyword"].indexOf(this.props.customDashboard.widget.family) > -1) {
            this.setState({
                autocompletePlaceholder: this.getAutocompletePlaceholder(_newKeys.length),
                isAutocompleteDisabled: true,
            });
            return;
        }
        //Max compared items is 5 (primary site + 4).
        if (this.props.customDashboard.widget.key.length >= 4) {
            this.setState({
                autocompletePlaceholder: this.getAutocompletePlaceholder(),
                isAutocompleteDisabled: true,
            });
            return;
        }

        //After selection - clear search input's value - and suggest adding competitors from similarSites.
        this.setState({
            autocompletePlaceholder: this.getAutocompletePlaceholder(),
        });
    }

    listItemByFamily(family, item) {
        switch (family) {
            case "Website":
                return (
                    <ListItemWebsite
                        img={item.image}
                        key={item.name}
                        onClick={() => this.onItemSelect(item)}
                        text={item.name}
                    />
                );
            case "Industry":
                return (
                    <ListItemIndustry
                        iconClassName={item.icon}
                        iconName="category"
                        key={item.name}
                        onClick={() => this.onItemSelect(item)}
                        text={item.name}
                    />
                );
            case "Keyword":
                // keyword group
                if (item.groupId) {
                    return (
                        <ListItemKeywordGroup
                            key={item.name}
                            onClick={() => this.onItemSelect(item)}
                            text={item.name}
                        />
                    );
                } else {
                    return (
                        <ListItemKeyword
                            key={item.name}
                            onClick={() => this.onItemSelect(item)}
                            text={item.name}
                        />
                    );
                }
            case "Mobile":
                return (
                    <ListItemApp
                        img={item.image}
                        store={item.store}
                        key={item.name}
                        onClick={() => this.onItemSelect(item)}
                        text={item.name}
                        subtitle={item.publisher}
                    />
                );
        }
    }

    //todo consider extracting to external service or adding to autocomplete service
    getData(query) {
        const _family = this.props.customDashboard.widget.family;
        const _getDataToken = Math.random();
        const _isCompare = this.props.customDashboard.widget.key.length > 0;
        let _url = "";
        let _userKeywordsGroups: IAutoCompleteKeywordItem[] = [];
        let _store = null;
        switch (_family) {
            case "Website":
                _url = "websites";
                break;
            case "Mobile":
                _url = "apps";
                if (this.props.customDashboard.widget.key.length) {
                    _store = this.props.customDashboard.widget.key[0].store;
                } else {
                    _store = this.props.customDashboard.androidOnly ? "google" : undefined;
                }
                break;
            case "Keyword":
                _url = "keywords";
                break;
        }
        if (typeof query === "string" && query != "") {
            if (_family === "Industry") {
                const _autoCompleteService: any = Injector.get("autoCompleteService");
                return new Promise((resolve) => {
                    const _results = _autoCompleteService.getCategoriesSection(query);
                    let _listItems = [];
                    _results.map((item) => {
                        _listItems.push(this.listItemByFamily(_family, item));
                    });
                    resolve(_listItems);
                });
            }
            if (_family === "Keyword") {
                keywordsGroupsService.userGroups.forEach((group) => {
                    if (group.Name.toLowerCase().indexOf(query) > -1) {
                        _userKeywordsGroups.push({
                            type: "keyword",
                            name: group.Name,
                            id: "*" + group.Name,
                            groupId: group.Id,
                            isVirtual: false,
                            icon: "icon sw-icon-folder",
                            url: group.url,
                        });
                    }
                });
                let _listItems = [];
                _userKeywordsGroups.map((item) => {
                    //Enable site\app selection only if not already exists in the widget's key object.
                    _listItems.push(this.listItemByFamily(_family, item));
                });
                if (this.props.customDashboard.widget.metric.indexOf("KeywordAnalysisGroup") > -1) {
                    return _listItems;
                }
            }

            this.setState({
                getDataToken: _getDataToken,
            });
            return this.fetchService
                .get(
                    `/autocomplete/${_url}?size=9&term=${query}${_store ? `&store=${_store}` : ``}`,
                )
                .then(
                    (_results) => {
                        if (!_isCompare) {
                            allTrackers.trackEvent("Drop Down", "open", `Open ${_family}`);
                        } else {
                            allTrackers.trackEvent("Drop Down", "open", `Add ${_family}`);
                        }
                        //Apply fetch data only if it is the last one triggered.
                        //We insure that by comparing the private _getDataToken to the state.getDataToken.
                        if (_getDataToken === this.state.getDataToken) {
                            if (_userKeywordsGroups.length) {
                                _results.unshift(..._userKeywordsGroups);
                            }
                            let _listItems = [];
                            _results.map((item) => {
                                //Enable site\app selection only if not already exists in the widget's key object.
                                if (
                                    !_.find(this.props.customDashboard.widget.key, {
                                        name: item.name,
                                    })
                                ) {
                                    _listItems.push(this.listItemByFamily(_family, item));
                                }
                            });
                            return _listItems;
                        }
                    },
                    (e) => {},
                );
        } else {
            if (this.props.customDashboard.widget.key.length > 0) {
                allTrackers.trackEvent("Drop Down", "open", `Add ${_family}`);
                return this.state.autocompleteSuggestions;
            } else {
                return [];
            }
        }
    }

    getSimilarItems(key, excludeList?) {
        let _url = "";
        switch (this.props.customDashboard.widget.family) {
            case "Website":
                _url = `/api/WebsiteOverview/getsimilarsites?key=${key.name}&limit=20`;
                break;
            case "Mobile":
                _url = `/api/MobileApps/GetSimilarApps?appId=${key.id}&store=${key.store}&limit=20`;
                break;
        }
        return this.fetchService.get(_url).then(
            (_results) => {
                let _listItems = [];
                _results.map((item) => {
                    const _newKey: any = {
                        id: item.Domain || item.ID,
                        name: item.Domain || item.Title,
                        image: item.Favicon || item.Icon,
                        isSuggestion: true,
                        publisher: item.Author,
                        type: this.props.customDashboard.widget.family,
                    };
                    if (item.Store !== undefined) {
                        const _store = item.Store === 0 ? "google" : "Apple";
                        _newKey.store = _store;
                    }
                    if (!excludeList || !_.find(excludeList, { name: _newKey.name })) {
                        _listItems.push(
                            this.listItemByFamily(
                                this.props.customDashboard.widget.family,
                                _newKey,
                            ),
                        );
                    }
                });
                this.setState({ autocompleteSuggestions: _listItems });
            },
            (e) => {
                return e;
            },
        );
    }

    removeKeyItem = (key) => () => {
        allTrackers.trackEvent("Drop Down", "click", `Remove ${key.type}/${key.name}`);
        this.props.keyRemove(key, this.props.customDashboard);
        const _newKeys = this.props.customDashboard.widget.key.filter((keyItem) => {
            return keyItem.name !== key.name;
        });
        if (
            isMetricMetaDataNeeded(
                this.props.customDashboard.widget.metric,
                this.props.customDashboard.widget.family,
            )
        ) {
            this.props.fetchMetricMetaData(_newKeys, this.props.customDashboard);
        }
        if (this.props.customDashboard.widget.family === "Website") {
            setTimeout(() => {
                this.props.updateGAVerifiedDataFilter(_newKeys, this.props.customDashboard);
            });
        }

        // We remove sites from the suggestions list after we add them to comparison mode.
        // This code adds the site back to the suggestion list
        // After we remove the site from the comparison.
        this.setState((prevState) => {
            if (prevState.autocompleteRemovedSuggestions[key.name]) {
                let _removed = prevState.autocompleteRemovedSuggestions;
                let _suggestions = prevState.autocompleteSuggestions;
                _suggestions.unshift(_removed[key.name]);
                delete _removed[key.name];
                return {
                    autocompleteSuggestions: _suggestions,
                    autocompleteRemovedSuggestions: _removed,
                    autocompletePlaceholder: this.getAutocompletePlaceholder(_newKeys.length),
                    isAutocompleteDisabled: false,
                };
            } else {
                return {
                    autocompletePlaceholder: this.getAutocompletePlaceholder(_newKeys.length),
                    isAutocompleteDisabled: false,
                };
            }
        });
        this.autocompleteBlur(this.props.customDashboard.widget.key.length - 1);
    };

    renderKeyTags() {
        const _family = this.props.customDashboard.widget.family;
        if (["Industry", "Keyword"].indexOf(_family) > -1) {
            let _tags = [];
            this.props.customDashboard.widget.key.forEach((item, i) => {
                if (item) {
                    const Component = _family === "Keyword" ? KeywordChipItem : CategoryChipItem;
                    _tags.push(
                        <Component
                            text={item.name}
                            icon={item.icon}
                            onCloseItem={this.removeKeyItem(item)}
                        />,
                    );
                }
            });
            return _tags;
        } else {
            return this.props.customDashboard.widget.key.map((key, index) => {
                return (
                    <WebsiteChipItem
                        key={`key-${index}`}
                        text={key.name}
                        onCloseItem={this.removeKeyItem(key)}
                        image={key.image}
                    />
                );
            });
        }
    }

    autocompleteBlur(keyLength?) {
        setTimeout(() => {
            if (keyLength !== undefined) {
                this.setState({
                    autocompletePlaceholder: this.getAutocompletePlaceholder(keyLength),
                });
            } else {
                this.setState({
                    autocompletePlaceholder: this.getAutocompletePlaceholder(keyLength),
                });
            }
        }, 300);
    }

    removeItemFromSuggestions(item) {
        this.setState((prevState) => {
            let _removed = prevState.autocompleteRemovedSuggestions;
            let _suggestions = prevState.autocompleteSuggestions.filter((listItem) => {
                const _toRemove = item.name == listItem.key;
                if (_toRemove) {
                    _removed[listItem.key] = listItem;
                }
                return !_toRemove;
            });
            return {
                autocompleteSuggestions: _suggestions,
                autocompleteRemovedSuggestions: _removed,
            };
        });
    }

    shouldFreezeAutocomplete(customDashboard) {
        const isCompare = customDashboard.isCompare;
        const keyLength = customDashboard.widget.key.length;
        const isNoCompareFamily =
            ["Industry", "Keyword"].indexOf(customDashboard.widget.family) > -1;

        // If new metric not allows compare and a website is selected - freeze the autocomplete.
        if (keyLength > 0) {
            if (!isCompare || isNoCompareFamily || keyLength >= this.getMaxKeys(customDashboard)) {
                return true;
            }
        }
        return false;
    }

    getAutocompletePlaceholder(keyLength?, customDashboard?) {
        const _customDashboard =
            customDashboard === undefined ? this.props.customDashboard : customDashboard;
        const _keyLength = keyLength === undefined ? _customDashboard.widget.key.length : keyLength;
        const _family = _customDashboard.widget.family;

        if (["Industry", "Keyword"].indexOf(_family) > -1) {
            return `${i18nFilter()(
                `home.dashboards.wizard.compare.not.allowed.for`,
            )} ${i18nFilter()(`home.dashboards.modules.${_family}`)}`;
        }
        if (_keyLength === 0) {
            return `${i18nFilter()(`home.dashboards.wizard.search`)} ${i18nFilter()(
                `home.dashboards.modules.${_family}`,
            )}`;
        }
        if (_keyLength === 1 && !_customDashboard.isCompare) {
            return i18nFilter()(`home.dashboards.wizard.compare.not.allowes`);
        }
        if (_keyLength >= this.getMaxKeys(_customDashboard)) {
            return i18nFilter()(`home.dashboards.wizard.max.items.error`);
        }
        if (_keyLength >= 1 && _keyLength < this.getMaxKeys(_customDashboard)) {
            return i18nFilter()(`home.dashboards.wizard.add.competitors`);
        }
    }

    render() {
        return (
            <div className="widgetWizard-autoComplete">
                <h4>
                    {i18nFilter()(
                        `home.dashboards.modules.${this.props.customDashboard.widget.family}`,
                    )}
                </h4>
                <span className={this.state.keyCountClass}>
                    {this.props.customDashboard.widget.key.length}/{this.state.maxKeys}
                </span>
                <div
                    className={`${this.props.customDashboard.widget.family} widgetWizard-autoCompleteContainer`}
                >
                    <AutocompleteWithItems
                        loadingComponent={<DotsLoader />}
                        maxResults={10}
                        debounce={400}
                        isFocused={true}
                        disabled={this.state.isAutocompleteDisabled}
                        placeholder={this.state.autocompletePlaceholder}
                        onBlur={this.autocompleteBlur}
                        getListItems={this.getData}
                        selectedItems={this.renderKeyTags() as JSX.Element[]}
                        floating={true}
                        zIndex={9}
                    />
                </div>
            </div>
        );
    }
}

SWReactRootComponent(DashboardWizardAutocomplete, "DashboardWizardAutocomplete");

export default DashboardWizardAutocomplete;
