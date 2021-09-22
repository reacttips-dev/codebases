import { Checkbox } from "@similarweb/ui-components/dist/checkbox";
import {
    CheckboxDropdownItem,
    Dropdown,
    DropdownButton,
    SimpleDropdownItem,
} from "@similarweb/ui-components/dist/dropdown";
import autobind from "autobind-decorator";
import I18n from "components/React/Filters/I18n";
import * as _ from "lodash";
import * as React from "react";
import { ISegmentsData } from "services/conversion/ConversionSegmentsService";
import BoxSubtitle from "../../../../components/BoxSubtitle/src/BoxSubtitle";
import BoxTitle from "../../../../components/BoxTitle/src/BoxTitle";
import { GraphLoader } from "../../../../components/Loaders/src/ExpandedTableRowLoader/ExpandedTableRowLoader";
import { NoData } from "../../../../components/NoData/src/NoData";
import StyledBoxSubtitle from "../../../../styled components/StyledBoxSubtitle/src/StyledBoxSubtitle";
import { IScatterData } from "../../CategoryOverview";
import { conversionVerticals } from "../benchmarkOvertime/benchmarkOvertime";
import {
    DropdownContainer,
    NoDataContainer,
    SitesChartLoaderContainer,
    StyledHeaderTitle,
} from "../benchmarkOvertime/StyledComponents";
import WithAllContexts from "../WithAllContexts";
import {
    BoxContainer,
    CheckboxContainer,
    Disclaimer,
    DropContainers,
    ScatterGraphContainer,
    ScatterZoom,
    Seperator,
    TitleContainer,
    Vs,
} from "./StyledComponents";

export interface IConversionScatterContainerProps {
    title: string;
    titleTooltip: string;
    filters: any;
    data: IScatterData;
    segmentsData: ISegmentsData;
    isLoading?: boolean;
    excludeVertical?: string[];
    ScatterComponent: any;
    benchmarkTitle: string;
    confidenceDisclaimer: string;
    getAssetsUrl: (a) => string;
    supportMultiChannel: boolean;
}

export interface IConversionScatterContainerState {
    scatterXVertical: string;
    scatterYVertical: string;
    benchmarkEnabled: boolean;
    selectedChannels: {};
}

export const conversionTrafficChannels = [
    "Direct",
    "Organic Search",
    "Paid Search",
    "Referrals",
    "Display Ads",
    "Mail",
    "Social",
];

export class ConversionScatterContainer extends React.Component<
    IConversionScatterContainerProps,
    IConversionScatterContainerState
> {
    private track: any;
    private translate: any;
    private linkFn: any;

    constructor(props) {
        super(props);
        this.state = {
            benchmarkEnabled: false,
            scatterXVertical: conversionVerticals.ConvertionRate.name,
            scatterYVertical: conversionVerticals.ConvertedVisits.name,
            selectedChannels: this.initSelectedChannels(),
        };
    }

    public shouldComponentUpdate(nextProps, nextState) {
        return nextState !== this.state || nextProps.data !== this.props.data;
    }

    public onSelectedXVerticalClick = (value) => {
        this.track("Drop Down", "click", `${this.translate(this.props.title)}/xAxis/${value.id}`);
        this.setState({
            scatterXVertical: value.id,
        });
    };
    public onSelectedYVerticalClick = (value) => {
        this.track("Drop Down", "click", `${this.translate(this.props.title)}/yAxis/${value.id}`);
        this.setState({
            scatterYVertical: value.id,
        });
    };
    public onToggle = (isOpen, isXaxis) => {
        const event = isOpen ? "open" : "close";
        this.track(
            "Drop Down",
            event,
            `${this.translate(this.props.title)}/${isXaxis ? "xAxis" : "yAxis"}`,
        );
    };
    public onToggleXAxis = (isOpen) => {
        this.onToggle(isOpen, true);
    };
    public onToggleYAxis = (isOpen) => {
        this.onToggle(isOpen, false);
    };
    public getVerticalItems = (isX: boolean) => {
        const { excludeVertical } = this.props;
        const { scatterXVertical, scatterYVertical } = this.state;
        const dropdownItems = _.map(
            _.remove(
                Object.keys(conversionVerticals),
                (vertical) => !(excludeVertical && _.includes(excludeVertical, vertical)),
            ),
            (vertical: string) => {
                const verticalObj = conversionVerticals[vertical];
                return (
                    <SimpleDropdownItem
                        disabled={this.isVerticalItemDisabled(isX, vertical)}
                        key={vertical}
                        id={verticalObj.name}
                    >
                        {this.translate(conversionVerticals[vertical].title)}
                    </SimpleDropdownItem>
                );
            },
        );
        return [
            <DropdownButton key={"vertical-button"} width={180}>
                {this.translate(
                    conversionVerticals[isX ? scatterXVertical : scatterYVertical].title,
                )}
            </DropdownButton>,
            ...dropdownItems,
        ];
    };

    public initSelectedChannels = () => {
        const selectedChannels = {};
        _.map(conversionTrafficChannels, (channel) => (selectedChannels[channel] = true));
        return selectedChannels;
    };

    public onSelectedChannelClick = (value) => {
        const selectedChannels = _.filter(
            Object.entries(this.state.selectedChannels),
            (entry) => this.state.selectedChannels[entry[0]],
        );
        if (selectedChannels.length === 1 && selectedChannels[0][0] === value.id) {
            // Avoid disabling all channels
            return;
        }
        this.setState(
            {
                selectedChannels: {
                    ...this.state.selectedChannels,
                    [value.id]: !this.state.selectedChannels[value.id],
                },
            },
            this.track(
                "Drop Down",
                "click",
                `${this.translate(this.props.title)}/Channel/${value.id} ${
                    !this.state.selectedChannels[value.id] ? "Check" : "Hide"
                }`,
            ),
        );
    };

    public onChannelsToggle = (isOpen) => {
        const event = isOpen ? "open" : "close";
        this.track("Drop Down", event, `${this.translate(this.props.title)}/Channel`);
    };

    public getChannelItems = () => {
        const { data, supportMultiChannel } = this.props;
        if (!supportMultiChannel) {
            return;
        }
        const availableChannels = this.getAvailableChannels(data);
        const selectedChannels = _.filter(this.state.selectedChannels, (c) => c);
        return [
            <DropdownButton key={"channel-button"} width={180}>
                {Object.keys(selectedChannels).length > 1
                    ? Object.keys(selectedChannels).length === 7
                        ? `Total Traffic`
                        : `${Object.keys(selectedChannels).length} Channels`
                    : _.filter(
                          Object.entries(this.state.selectedChannels),
                          (entry) => this.state.selectedChannels[entry[0]],
                      )[0]}
            </DropdownButton>,
            ..._.map(availableChannels, (channel: string) => {
                return (
                    <CheckboxDropdownItem key={channel} id={channel}>
                        {channel}
                    </CheckboxDropdownItem>
                );
            }),
        ];
    };

    public hasHighConfidenceEntry = (entryData: any): boolean => {
        const { ConversionRateConfidenceLevel } = entryData;
        return ConversionRateConfidenceLevel > 0 && ConversionRateConfidenceLevel < 0.3;
    };

    @autobind
    public isVerticalItemDisabled(isX, val) {
        const opposite = isX ? this.state.scatterYVertical : this.state.scatterXVertical;
        return val === opposite;
    }

    @autobind
    public filterDomainChannelsData(data) {
        if (!data) {
            return { data };
        }

        const highConfidenceData = data.Data && data.Data.filter(this.hasHighConfidenceEntry);
        return {
            data: {
                ...data,
                Data: highConfidenceData,
            },
            isConfidenceFiltered:
                !!highConfidenceData && highConfidenceData.length !== data.Data.length,
        };
    }

    @autobind
    public aggregateDomainsSelectedChannelsData(data, selectedChannels) {
        const getKey = (domainData: any) => {
            return `${domainData.Domain}_${domainData.MainSegmentName || ""}_${
                domainData.SubSegmentName || ""
            }`;
        };

        if (!data || !_.filter(selectedChannels, (c) => c).length) {
            return { data };
        }
        const aggChannelsData = {};
        const selectedHighConfidenceEntries = {};
        const selectedChannelsData = Object.keys(data.Data)
            .filter((key) => selectedChannels[key])
            .reduce((obj, key) => {
                obj[key] = data.Data[key];
                return obj;
            }, {});
        _.forEach(selectedChannelsData, (channelData) => {
            _.forEach(channelData, (domainData: any) => {
                const domainKey = getKey(domainData);
                selectedHighConfidenceEntries[domainKey] =
                    selectedHighConfidenceEntries[domainKey] ||
                    this.hasHighConfidenceEntry(domainData);
                if (aggChannelsData[domainKey]) {
                    aggChannelsData[domainKey] = {
                        ...domainData,
                        ConvertedVisits:
                            aggChannelsData[domainKey].ConvertedVisits + domainData.ConvertedVisits,
                        Visits: aggChannelsData[domainKey].Visits + domainData.Visits,
                    };
                } else {
                    aggChannelsData[domainKey] = domainData;
                }
            });
        });

        return {
            data: {
                ...data,
                Data: _.map(
                    _.filter(aggChannelsData, (_, key) => selectedHighConfidenceEntries[key]),
                    (domainData: any) => {
                        return {
                            ...domainData,
                            ConversionRate: domainData.ConvertedVisits / domainData.Visits,
                        };
                    },
                ),
            },
            isConfidenceFiltered: Object.values(selectedHighConfidenceEntries).some((x) => !x),
        };
    }

    public render() {
        const {
            title,
            titleTooltip,
            filters,
            data,
            ScatterComponent,
            isLoading,
            benchmarkTitle,
            getAssetsUrl,
            supportMultiChannel,
            segmentsData,
            confidenceDisclaimer,
        } = this.props;
        const { selectedChannels } = this.state;
        const subtitleFilters = [
            {
                filter: "date",
                value: {
                    from: filters.from,
                    to: filters.to,
                },
            },
            {
                filter: "webSource",
                value: "Desktop",
            },
        ];
        const { isConfidenceFiltered, data: displayData } = supportMultiChannel
            ? this.aggregateDomainsSelectedChannelsData(data, selectedChannels)
            : this.filterDomainChannelsData(data);
        const scatterProps = {
            data: displayData,
            segmentsData,
            filters,
            scatterXVertical: this.state.scatterXVertical,
            scatterYVertical: this.state.scatterYVertical,
            benchmarkEnabled: this.state.benchmarkEnabled,
        };
        return (
            <WithAllContexts>
                {({ track, linkFn, translate }) => {
                    this.track = track;
                    this.translate = translate;
                    this.linkFn = linkFn;
                    return (
                        <BoxContainer data-automation-sites-vs-category={true}>
                            <TitleContainer withBorderBottom={!isConfidenceFiltered}>
                                <StyledHeaderTitle>
                                    <BoxTitle tooltip={translate(titleTooltip)}>
                                        {translate(title)}
                                    </BoxTitle>
                                </StyledHeaderTitle>
                                <StyledBoxSubtitle>
                                    <BoxSubtitle filters={subtitleFilters} />
                                </StyledBoxSubtitle>
                            </TitleContainer>
                            <ScatterGraphContainer>
                                {isLoading ? (
                                    <SitesChartLoaderContainer>
                                        <GraphLoader width={"100%"} />
                                    </SitesChartLoaderContainer>
                                ) : (
                                    <>
                                        {data && data.Data ? (
                                            <>
                                                {isConfidenceFiltered && (
                                                    <Disclaimer>
                                                        <I18n>{confidenceDisclaimer}</I18n>
                                                    </Disclaimer>
                                                )}
                                                <DropContainers>
                                                    <CheckboxContainer>
                                                        <Checkbox
                                                            selected={this.state.benchmarkEnabled}
                                                            label={this.translate(benchmarkTitle)}
                                                            onClick={this.onBenchmarkCheckboxClick}
                                                        />
                                                    </CheckboxContainer>
                                                    <Seperator />
                                                    <DropdownContainer style={{ width: "180px" }}>
                                                        <Dropdown
                                                            dropdownPopupPlacement={"bottom-left"}
                                                            selectedIds={{
                                                                [this.state.scatterYVertical]: true,
                                                            }}
                                                            shouldScrollToSelected={true}
                                                            onToggle={this.onToggleYAxis}
                                                            onClick={this.onSelectedYVerticalClick}
                                                        >
                                                            {this.getVerticalItems(false)}
                                                        </Dropdown>
                                                    </DropdownContainer>
                                                    <Vs>vs.</Vs>
                                                    <DropdownContainer style={{ width: "180px" }}>
                                                        <Dropdown
                                                            dropdownPopupPlacement={"bottom-left"}
                                                            selectedIds={{
                                                                [this.state.scatterXVertical]: true,
                                                            }}
                                                            shouldScrollToSelected={true}
                                                            onToggle={this.onToggleXAxis}
                                                            onClick={this.onSelectedXVerticalClick}
                                                        >
                                                            {this.getVerticalItems(true)}
                                                        </Dropdown>
                                                    </DropdownContainer>
                                                    {supportMultiChannel && (
                                                        <>
                                                            <Seperator />
                                                            <DropdownContainer
                                                                style={{ width: "180px" }}
                                                            >
                                                                <Dropdown
                                                                    dropdownPopupPlacement={
                                                                        "bottom-left"
                                                                    }
                                                                    selectedIds={selectedChannels}
                                                                    shouldScrollToSelected={true}
                                                                    onToggle={this.onChannelsToggle}
                                                                    closeOnItemClick={false}
                                                                    onClick={
                                                                        this.onSelectedChannelClick
                                                                    }
                                                                >
                                                                    {this.getChannelItems()}
                                                                </Dropdown>
                                                            </DropdownContainer>
                                                        </>
                                                    )}
                                                </DropContainers>
                                                <ScatterZoom getAssetsUrl={getAssetsUrl}>
                                                    <ScatterComponent {...scatterProps} />
                                                </ScatterZoom>
                                            </>
                                        ) : (
                                            <NoDataContainer>
                                                {" "}
                                                <NoData />{" "}
                                            </NoDataContainer>
                                        )}
                                    </>
                                )}
                            </ScatterGraphContainer>
                        </BoxContainer>
                    );
                }}
            </WithAllContexts>
        );
    }

    private getAvailableChannels(data: any): string[] {
        if (data && data.Data) {
            return Object.keys(data.Data);
        }
        return undefined;
    }

    @autobind
    private onBenchmarkCheckboxClick() {
        this.setState({ benchmarkEnabled: !this.state.benchmarkEnabled });
        this.track(
            "Industry Average Checkbox",
            "click",
            `${this.translate(this.props.title)}/Benchmark Group/${
                this.state.benchmarkEnabled ? "Hide" : "Check"
            }`,
        );
    }
}
