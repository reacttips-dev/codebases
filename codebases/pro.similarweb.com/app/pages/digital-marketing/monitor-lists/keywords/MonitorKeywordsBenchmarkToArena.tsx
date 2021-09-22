import { Injector } from "common/ioc/Injector";
import { BenchmarkToArena } from "components/Workspace/BenchmarkToArena/src/BenchmarkToArena";
import { BenchmarkToArenaItem } from "components/Workspace/BenchmarkToArena/src/BenchmarkToArenaItem";
import SWReactRootComponent from "decorators/SWReactRootComponent";
import * as _ from "lodash";
import { connect } from "react-redux";
import { useEffect, useState } from "react";
import * as React from "react";
import CountryService from "services/CountryService";
import DurationService from "services/DurationService";
import { DefaultFetchService, NoCacheHeaders } from "services/fetchService";
import { IArena, marketingWorkspaceApiService } from "services/marketingWorkspaceApiService";
import swLog from "@similarweb/sw-log";
import { TrackWithGuidService } from "services/track/TrackWithGuidService";
import styled from "styled-components";

const BenchmarkToArenaStyled = styled.div`
    margin-left: 16px;
`;

const MonitorKeywordsBenchmarkToArena = (props) => {
    const { country, keywordGroupId, keywordsType, webSource, duration, sites } = props.params;
    const swNavigator = Injector.get<any>("swNavigator");
    const fetchService = DefaultFetchService.getInstance();

    const [loadingArenas, setLoadingArenas] = useState(true);
    const [arenas, setArenas] = useState([]);
    const [validArenas, setValidArenas] = useState([]);

    useEffect(() => {
        async function getArenasForBenchmark() {
            setLoadingArenas(true);
            let workspaces;
            try {
                workspaces = await marketingWorkspaceApiService.getMarketingWorkspaces();
            } catch (e) {
                swLog.error(`Error fetching arenas - MonitorKeywordsBenchmarkToArena -- ${e}`);
                return null;
            }
            if (!workspaces?.length) {
                setArenas([]);
            } else {
                const allArenas = [];
                workspaces.map((workspace) => {
                    workspace.arenas.map((arena) => {
                        allArenas.push(arena);
                    });
                });
                setArenas(allArenas);
                getAvailableArenas(allArenas);
                setLoadingArenas(false);
            }
        }
        if (!sites) {
            getArenasForBenchmark();
        }
    }, [country, keywordGroupId, keywordsType, webSource, duration, sites]);

    const getArenas = () => {
        let arenasToDisplay;
        if (validArenas.length > 0) {
            arenasToDisplay = validArenas.map(({ id: arenaId }, index) => {
                const arena = _.find<IArena>(arenas, (arena) => arena.id === arenaId);
                const countryObj = CountryService.getCountryById(arena.country);
                return (
                    <BenchmarkToArenaItem
                        key={`arena-${index}`}
                        country={countryObj}
                        title={arena.friendlyName}
                        competitorsIcons={arena.competitors.map((competitor) => competitor.favicon)}
                        mainDomain={arena.allies[0]}
                        onClick={onArenaClick(arena)}
                    />
                );
            });
        }
        if (!arenasToDisplay || arenasToDisplay.length === 0) {
            return null;
        }
        return arenasToDisplay;
    };

    const getDurationForApi = () => {
        const { from, to, isWindow } = DurationService.getDurationData(
            duration,
            "",
            "KeywordAnalysis",
        ).forAPI;
        return { from, to, isWindow };
    };

    const getAvailableArenas = async (allArenas) => {
        const { from, to, isWindow } = getDurationForApi();
        const params = {
            from,
            to,
            isWindow,
            webSource,
            KeywordSource: keywordsType,
            KeywordsGroup: keywordGroupId,
            includeSubDomains: true,
        };
        const endpoint = `widgetApi/MonitorKeywordGroup/KeywordGroupBenchmarkOverview/Table`;

        // remove null or undefined values from the params object
        Object.entries(params).forEach(([paramKey, ParamValue]) => {
            if (ParamValue === null || ParamValue === undefined) {
                delete params[paramKey];
            }
        });

        let counter = 0;
        const finelArenas = [];
        // loop over arenas, calling the endpoint and add the arena as *valid* arena to the component's state
        allArenas.forEach(async (arena: IArena, index) => {
            const competitors = arena.competitors.map((competitor) => competitor.domain);
            const main = arena.allies.map((allie) => allie.domain);
            const finalParams = {
                ...params,
                country: arena.country,
                Keys: [...main, ...competitors].join(","),
            };
            try {
                const {
                    header: { visits },
                } = await fetchService.get<{ header: { visits: number; change: number } }>(
                    endpoint,
                    finalParams,
                    {
                        headers: NoCacheHeaders,
                    },
                );
                counter++;
                if (counter >= allArenas.length) {
                    if (visits) {
                        const arenaObj = { id: arena.id, visits };
                        finelArenas.push(arenaObj);
                    }
                    setValidArenas(finelArenas);
                    return;
                }
                // treat 0 visits as no data
                if (!visits) {
                    throw new Error("no data");
                }
                const arenaObj = { id: arena.id, visits };
                finelArenas.push(arenaObj);
            } catch (e) {
                swLog.log(`arena ${arena.id} doesn't have data: `, e);
            }
        });
    };

    const onArenaClick = (arena) => () => {
        TrackWithGuidService.trackWithGuid("monitor.keyword.list.page.arena.selected", "close", {
            arenaName: arena.friendlyName,
        });
        const sites = [
            arena.allies[0].domain,
            ...arena.competitors.map((competitor) => competitor.domain),
        ].join(",");
        swNavigator.updateParams({ sites, country: arena.country, IsWWW: "*" });
    };

    return !sites ? (
        <BenchmarkToArenaStyled>
            <BenchmarkToArena loading={loadingArenas} arenas={getArenas()} />
        </BenchmarkToArenaStyled>
    ) : null;
};

const mapStateToProps = ({ routing }) => {
    return {
        params: routing.params,
    };
};

const connected = connect(mapStateToProps, null)(MonitorKeywordsBenchmarkToArena);

export default SWReactRootComponent(connected, "MonitorKeywordsBenchmarkToArena");
