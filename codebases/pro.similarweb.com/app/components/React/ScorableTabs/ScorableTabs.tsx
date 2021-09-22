import { ScorableTab, TabList, Tabs } from "@similarweb/ui-components/dist/tabs";
import SWReactRootComponent from "decorators/SWReactRootComponent";
import { i18nFilter } from "filters/ngFilters";
import * as React from "react";
import { InjectableComponent } from "../InjectableComponent/InjectableComponent";
import { colorsPalettes } from "@similarweb/styles";
import { dynamicFilterFilter } from "filters/dynamicFilter";

function getLabelText(tab) {
    if (tab.labelText) {
        return i18nFilter()(tab.labelText);
    }
    if (tab.beta) {
        return i18nFilter()("mobileweb.switcher.beta");
    }
}

function getLabelColor(tab) {
    if (tab.isLocked) {
        return colorsPalettes.orange["400"];
    } else if (tab.beta) {
        return colorsPalettes.mint["400"];
    }
}

@SWReactRootComponent
export class ScorableTabs extends InjectableComponent {
    public onTabSelected = (index: number, previous: number, event: Event) => {
        this.props.setSelected(this.props.tabs[index]);
        return true;
    };

    public render() {
        const dynamicFilter = dynamicFilterFilter();
        const selectedIndex = this.props.tabs.findIndex(
            (tab) => tab.metric === this.props.selectedTab.metric,
        );
        return (
            <Tabs selectedIndex={selectedIndex} onSelect={this.onTabSelected}>
                <TabList>
                    {this.props.tabs.map((tab, index) => {
                        const value = tab.value ?? null;
                        const {
                            id,
                            title,
                            iconName,
                            tooltip,
                            valueChange,
                            invertChangeColors,
                            changeTooltip,
                            format,
                            valueChangeFormat,
                            valueChangeString,
                        } = tab;
                        return (
                            <ScorableTab
                                key={id}
                                selected={index === selectedIndex}
                                metric={i18nFilter()(title)}
                                metricIcon={iconName}
                                value={dynamicFilter(value, format)}
                                isLocked={tab.isLocked}
                                valueTooltip={tooltip ? i18nFilter()(tooltip) : null}
                                labelColor={getLabelColor(tab)}
                                labelText={getLabelText(tab)}
                                hideBorder={true}
                                valueChange={valueChange}
                                invertChangeColors={invertChangeColors}
                                changeTooltip={changeTooltip}
                                valueChangeFormat={valueChangeFormat}
                                valueChangeString={valueChangeString}
                            />
                        );
                    })}
                </TabList>
                {this.props.children}
            </Tabs>
        );
    }
}
