import { SearchInput } from "@similarweb/ui-components/dist/search-input";
import { LineSwitcherItem, Switcher } from "@similarweb/ui-components/dist/switcher";
import * as classNames from "classnames";
import { IInjector, Injector } from "common/ioc/Injector";
import I18n from "components/React/Filters/I18n";
import SWReactRootComponent from "decorators/SWReactRootComponent";
import { i18nFilter } from "filters/ngFilters";
import * as Fuse from "fuse.js";
import * as _ from "lodash";
import * as PropTypes from "prop-types";
import * as React from "react";
import { connect } from "react-redux";
import { AssetsService } from "services/AssetsService";
import { allTrackers } from "services/track/track";
import WidgetWizardCard from "./WidgetWizardCard";
import widgetSettings from "components/dashboard/WidgetSettings";
class StatefullLineSwitcher extends React.PureComponent<any, any> {
    public static getDerivedStateFromProps(props, state) {
        if (props.selected !== state.selected) {
            return {
                selected: props.selected,
            };
        }

        return null;
    }

    constructor(props) {
        super(props);
        this.state = {
            selected: this.props.selected || 0,
        };
    }

    public onItemClicked = (item) => {
        allTrackers.trackEvent(
            "Switch Item",
            "switch",
            `Dashboard Family/${this.props.items[item].id}`,
        );
        this.props.onItemClicked(this.props.items[item]);
    };

    public render() {
        return (
            <Switcher
                customClass="LineSwitcher"
                onItemClick={this.onItemClicked}
                selectedIndex={this.state.selected}
            >
                {this.props.items.map((item, index) => (
                    <LineSwitcherItem key={index}>{item.title}</LineSwitcherItem>
                ))}
            </Switcher>
        );
    }
}

// eslint:disable-next-line: max-classes-per-file
class WidgetWizardCardsContainer extends React.PureComponent<any, any> {
    private allWidgetMetrics;

    constructor(props) {
        super(props);
        const dashboardFamilies = [
            { id: "All", title: i18nFilter()(`dashboard.metricGallery.filters.all`) },
            { id: "Website", title: i18nFilter()(`dashboard.metricGallery.filters.website`) },
            { id: "Industry", title: i18nFilter()(`dashboard.metricGallery.filters.industry`) },
            { id: "Keyword", title: i18nFilter()(`dashboard.metricGallery.filters.keyword`) },
            { id: "Mobile", title: i18nFilter()(`dashboard.metricGallery.filters.apps`) },
        ];
        this.allWidgetMetrics = widgetSettings.getWidgetMetrics().map((metric) => {
            metric.translatedText = i18nFilter()(
                `dashboard.metricGallery.${metric.family}.${metric.id}.title`,
            );
            metric.translatedDescription = i18nFilter()(
                `dashboard.metricGallery.${metric.family}.${metric.id}.description`,
            );
            return metric;
        });
        this.allWidgetMetrics = _.sortBy(this.allWidgetMetrics, (metric: any) => {
            const prefix = metric.isDisabled ? "" : "_";
            return prefix + metric.translatedText.toLowerCase();
        });

        this.state = {
            metrics: this.allWidgetMetrics,
            selectedMetric: -1,
            searchPhrase: "",
            selectedFamilyItem: {
                id: props.dashboardWizard.widget.family || "Website",
                text: props.dashboardWizard.widget.family || "Website",
            },
            selectedFamilyIndex:
                _.findIndex(dashboardFamilies, {
                    id: props.dashboardWizard.widget.family || "All",
                }) || 1,
            dashboardFamilies,
        };
        setTimeout(() => {
            this.handleSearch({});
        });
    }

    public switchFamily = (item) => {
        this.setState({
            selectedFamilyItem: item,
            selectedFamilyIndex: _.findIndex(this.state.dashboardFamilies, { id: item.id }),
        });
        setTimeout(() => {
            this.handleSearch({});
        });
    };

    public selectNextFamilyItem = () => {
        const familyItemsCount = this.state.dashboardFamilies.length;
        let familyIndex = _.findIndex(this.state.dashboardFamilies, {
            id: this.state.selectedFamilyItem.id,
        });
        if (familyIndex === familyItemsCount - 1) {
            familyIndex = 0;
        } else {
            familyIndex++;
        }
        this.setState({
            selectedFamilyItem: this.state.dashboardFamilies[familyIndex],
            selectedFamilyIndex: familyIndex,
        });
        setTimeout(() => {
            this.handleSearch({});
        });
    };

    public render() {
        this.calculateScrollPositionByIndex(this.state.selectedMetric);
        return (
            <div className="react-wizard">
                <div className="react-wizard-filter">
                    {/*todo: i18n */}
                    <StatefullLineSwitcher
                        items={this.state.dashboardFamilies}
                        selected={this.state.selectedFamilyIndex}
                        onItemClicked={this.switchFamily}
                    />
                    <SearchInput
                        isFocused={true}
                        placeholder="Search"
                        className="react-wizard-filter-input"
                        onKeyUp={this.handleSearch}
                        onChange={this.emptySearch}
                        onKeyDown={this.handleGalleryNavigation}
                    />
                </div>
                {this.state.metrics.length > 0 ? (
                    <ul className="react-wizard-cards-container">
                        {this.state.metrics.map((widgetMetric, key) => {
                            let _cardClassNames = `react-wizard-cards-container-card`;
                            let _buttonText = `dashboard.metricGallery.metricButtonText`;
                            if (widgetMetric.isDisabled) {
                                _cardClassNames = `react-wizard-cards-container-card react-wizard-cards-container-card--disabled`;
                                _buttonText = `dashboard.metricGallery.metricButtonText.upgrade`;
                            }
                            return (
                                <WidgetWizardCard
                                    onClick={(e) => this.handleCardClick(widgetMetric, e)}
                                    onMouseOver={this.clearSelectedMetric}
                                    className={_cardClassNames}
                                    key={key}
                                    isSelected={key === this.state.selectedMetric}
                                    isDisabled={widgetMetric.isDisabled}
                                    title={widgetMetric.translatedText}
                                    description={widgetMetric.translatedDescription}
                                    buttonText={_buttonText}
                                    imageUrl={AssetsService.assetUrl(
                                        `/Images/dashboard/metrics/${widgetMetric.id}.png`,
                                    )}
                                />
                            );
                        })}
                    </ul>
                ) : (
                    <div className={"react-wizard-filter--empty"}>
                        <h4>
                            <I18n>dashboard.metricGallery.empty.title</I18n>
                        </h4>
                        <h5>
                            <I18n>dashboard.metricGallery.empty.subtitle</I18n>
                        </h5>
                    </div>
                )}
            </div>
        );
    }

    private clearSelectedMetric = () => {
        this.setState({ selectedMetric: -1 });
    };

    private handleSearch = (e) => {
        let searchPhrase: string;
        if (e.target) {
            searchPhrase = e.target.value;
            if (searchPhrase === this.state.searchPhrase) {
                return;
            }
            this.setState({ searchPhrase: e.target.value });
        } else {
            searchPhrase = this.state.searchPhrase;
        }

        switch (e.key) {
            default:
                this.setState({ selectedMetric: 0 });
                const value = searchPhrase;
                const searchOptions = {
                    shouldSort: true,
                    threshold: 0.5,
                    location: 0,
                    distance: 100,
                    maxPatternLength: 32,
                    minMatchCharLength: 0,
                    keys: ["translatedText", "translaytedDescription"],
                };
                const fuse = new Fuse(this.allWidgetMetrics, searchOptions);
                let filtered = value !== "" ? fuse.search(value) : this.allWidgetMetrics;
                if (this.state.selectedFamilyItem.id !== "All") {
                    filtered = filtered.filter(
                        (item) => item.family === this.state.selectedFamilyItem.id,
                    );
                }
                this.setState({ metrics: filtered });
        }
    };

    private emptySearch = (val) => {
        if (val === "") {
            this.setState({ searchPhrase: "" });
            setTimeout(() => {
                this.handleSearch({});
            });
        }
    };

    private handleGalleryNavigation = (e) => {
        switch (e.key) {
            case "Tab": {
                e.preventDefault();
                this.selectNextFamilyItem();
                break;
            }
            case "ArrowDown":
                this.setState((prevState) => {
                    if (this.state.selectedMetric >= this.state.metrics.length) {
                        return {
                            selectedMetric: 0,
                        };
                    }
                    if (this.state.selectedMetric === -1) {
                        return {
                            selectedMetric: 0,
                        };
                    }
                    return {
                        selectedMetric: prevState.selectedMetric + 2,
                    };
                });
                break;
            case "ArrowUp":
                this.setState((prevState) => {
                    if (this.state.selectedMetric <= 0) {
                        return {
                            selectedMetric: 0,
                        };
                    }
                    return {
                        selectedMetric: prevState.selectedMetric - 2,
                    };
                });
                break;
            case "ArrowLeft":
                this.setState((prevState) => {
                    if (this.state.selectedMetric <= 0) {
                        return {
                            selectedMetric: 0,
                        };
                    }
                    return {
                        selectedMetric: prevState.selectedMetric - 1,
                    };
                });
                break;
            case "ArrowRight":
                if (this.state.selectedMetric >= this.state.metrics.length) {
                    return {
                        selectedMetric: 0,
                    };
                }
                this.setState((prevState) => {
                    return {
                        selectedMetric: prevState.selectedMetric + 1,
                    };
                });
                break;
            case "Enter":
                this.handleCardClick(this.state.metrics[this.state.selectedMetric]);
                break;
        }
    };

    private handleCardClick = (widgetMetric, e?) => {
        const searchPhrase = this.state.searchPhrase ? `/${this.state.searchPhrase}` : "";
        this.props.onCardClick(widgetMetric);
        allTrackers.trackEvent("Search Bar", "click", `metric${searchPhrase}`);
    };

    private calculateScrollPositionByIndex(index) {
        let internalIndex = index;
        if (internalIndex < 2) {
            return $(".sw-layout-scrollable-element").scrollTop(0);
        }
        if (!this.isCardFullyViewable(index)) {
            if (internalIndex % 2 === 0) {
                internalIndex = internalIndex + 1;
            }
            $(".sw-layout-scrollable-element").scrollTop(internalIndex * 136 - 280);
        }
    }

    private isCardFullyViewable(index) {
        const pageTopToCardBottom =
            $($(".react-wizard-cards-container-card")[index]).offset().top +
            $(".react-wizard-cards-container-card")[index].scrollHeight;
        const scrolledPlusViewable =
            $(".sw-layout-scrollable-element").scrollTop() +
            $(".sw-layout-scrollable-element").height() -
            $(".sw-layout-scrollable-element").offset().top;

        if (
            $($(".react-wizard-cards-container-card")[index]).offset().top >
                $(".sw-layout-scrollable-element").scrollTop() &&
            pageTopToCardBottom < scrolledPlusViewable
        ) {
            return true;
        } else {
            return false;
        }
    }
}

function mapStateToProps({ customDashboard: { dashboardWizard } }) {
    return {
        dashboardWizard,
    };
}

const connectedComponent = connect(mapStateToProps)(WidgetWizardCardsContainer);

SWReactRootComponent(connectedComponent, "WidgetWizardCardsContainer");

export default connectedComponent;
