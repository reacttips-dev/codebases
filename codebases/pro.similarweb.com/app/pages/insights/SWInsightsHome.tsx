import * as React from "react";

import { GroupedTiles } from "@similarweb/ui-components/dist/grouped-tiles";
import { InjectableComponentClass } from "components/React/InjectableComponent/InjectableComponent";

import { InsightsHomeService } from "./insightsHomeService";
import { IReportGroup } from "pages/insights/types";
import { AssetsService } from "services/AssetsService";

export class SWInsightsHome extends InjectableComponentClass<any, any> {
    private insightsHomeService: InsightsHomeService;

    constructor() {
        super();
        this.insightsHomeService = new InsightsHomeService();
        const groups: IReportGroup[] = this.insightsHomeService.getGroups();
        this.initData(groups);
        this.state = {
            groupedTiles: groups,
            isLoading: false,
        };
    }

    private initData = (groups): void => {
        groups.forEach((gr) => {
            gr.Tiles.forEach((t) => {
                t.ImageUrl = AssetsService.assetUrl(t.ImageUrl);
            });
        });
    };

    render(): JSX.Element {
        return (
            <section className="deep-insights-home">
                {this.state.isLoading ? (
                    <div className="big-loader" />
                ) : (
                    <GroupedTiles groupedTiles={this.state.groupedTiles} />
                )}
            </section>
        );
    }
}
