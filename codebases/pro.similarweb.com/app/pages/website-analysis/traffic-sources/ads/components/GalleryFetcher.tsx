import frameStates from "components/React/widgetFrames/frameStates";
import * as _ from "lodash";
import PropTypes from "prop-types";
import React, { Component, ReactElement } from "react";
import { Widget } from "../../../../../components/widget/widget-types/Widget";
import { DefaultFetchService } from "../../../../../services/fetchService";
import { ALL_DISPLAY, ChannelType, DESKTOP_DISPLAY, MOBILE_DISPLAY } from "../channels";

interface IGalleryFetcherProps {
    webSource: string;
    country: number;
    from: string;
    to: string;
    isWindow: boolean;
    isWWW: string;
    selectedSite: string;
    selectedSortField: string;
    selectedSortDirection: string;
    selectedCampaign: string;
    selectedChannel: typeof ChannelType;
    children: (state: IGalleryFetcherState) => ReactElement<any>;
}

interface IGalleryFetcherState {
    status: frameStates;
    data: any[];
    campaigns: any[];
    sources: any[];
    formats: any[];
    selectedSite: string;
    totalCount: number;
    selectedChannel: typeof ChannelType;
}

const endPointPrefix = "/widgetApi/WebsiteAdsIntelDisplay/WebsiteAdsDisplay/Table";
const endPointVideoPrefix = "/widgetApi/WebsiteAdsIntelVideo/WebsiteAdsVideo/Table";

const getEndPointUrl = (keyVals) => {
    const pairs = Object.entries(keyVals).reduce(
        (pairs, [key, value]) =>
            value !== null
                ? [
                      ...pairs,
                      key === "includeSubDomains" ? `${key}=${value === "*"}` : `${key}=${value}`,
                  ]
                : pairs,
        [],
    );
    return keyVals.channel === ALL_DISPLAY ||
        keyVals.channel === DESKTOP_DISPLAY ||
        keyVals.channel === MOBILE_DISPLAY
        ? `${endPointPrefix}?${pairs.join("&")}`
        : `${endPointVideoPrefix}?${pairs.join("&")}`;
};

const getFilters = (filters) => {
    const noneDefaultFilters = _.pickBy(filters, ({ value }) => value !== null); // we want to remove null filters
    const filterString = Widget.filterStringify(noneDefaultFilters); // as it is our hint for default value
    return filterString || null;
};

const fetchNewData = async ({
    webSource,
    country,
    from,
    to,
    isWindow,
    isWWW,
    selectedSite,
    selectedSortField,
    selectedSortDirection,
    selectedCampaign,
    selectedChannel,
    source,
}) => {
    const endPointUrl = getEndPointUrl({
        webSource,
        country,
        from,
        to,
        includeSubDomains: isWWW,
        keys: selectedSite,
        isWindow,
        pageSize: 2147483647,
        timeGranularity: "Monthly",
        channel: selectedChannel,
        orderBy: `${selectedSortField} ${selectedSortDirection}`,
        filter: getFilters({
            CampaignTitle: {
                operator: "contains",
                value:
                    selectedCampaign &&
                    `"${
                        encodeURIComponent(selectedCampaign)
                            .replace(/^\%22+|\%22+$/g, "")
                            .split("%22")[0]
                    }"`,
            },
            Source: {
                operator: "contains",
                value: (source && `"${encodeURIComponent(source)}"`) || null,
            },
        }),
    });
    const fetchService = DefaultFetchService.getInstance();
    const response = await fetchService.get<any>(endPointUrl);
    const {
        Data: list,
        Filters: { Campagains: campaigns, Formats: formats, Sources: sources },
        TotalCount,
    } = await response;
    return {
        data: list.map((item) => ({
            ...item,
            Size: `${item.Width}×${item.Height}`,
        })),
        campaigns,
        sources,
        formats,
        totalCount: TotalCount,
        status: list.length > 0 ? frameStates.Loaded : frameStates.NoData,
    };
};

class GalleryFetcher extends Component<IGalleryFetcherProps, IGalleryFetcherState> {
    public static propTypes = {
        children: PropTypes.func.isRequired,
        webSource: PropTypes.string.isRequired,
        country: PropTypes.string.isRequired,
        from: PropTypes.string.isRequired,
        to: PropTypes.string.isRequired,
        isWindow: PropTypes.bool.isRequired,
        isWWW: PropTypes.string.isRequired,
        selectedSite: PropTypes.string.isRequired,
        selectedSortField: PropTypes.string.isRequired,
        selectedSortDirection: PropTypes.string.isRequired,
        selectedCampaign: PropTypes.string,
        selectedChannel: PropTypes.number.isRequired,
        source: PropTypes.string,
    };

    constructor(props) {
        super(props);
        this.state = {
            status: frameStates.Loading,
            data: [],
            campaigns: [],
            sources: [],
            formats: [],
            totalCount: 0,
            selectedSite: props.selectedSite,
            selectedChannel: props.selectedChannel,
        };
    }

    public async componentWillMount() {
        // on the first run we update both data and filters
        const response = await this.reload(this.props);
        if (response.status !== frameStates.Error) {
            this.setState(() => ({
                ...response,
            }));
        }
    }

    public async componentDidUpdate(prevProps) {
        if (this.props !== prevProps) {
            const response = await this.reload(this.props);
            if (response.status !== frameStates.Error) {
                const { data, status, totalCount } = response;
                if (
                    this.props.selectedSite === this.state.selectedSite &&
                    this.props.selectedChannel === this.state.selectedChannel
                ) {
                    // filter has changed on main site and channel - reload only the data
                    this.setState({
                        data,
                        totalCount,
                        status,
                    });
                } else {
                    // main site or channel has changed -> we need to reload everything
                    this.setState(() => ({
                        ...response,
                        selectedSite: this.props.selectedSite,
                        selectedChannel: this.props.selectedChannel,
                    }));
                }
            }
        }
    }

    public async reload(params): Promise<any> {
        try {
            this.setState(() => ({
                status: frameStates.Loading,
            }));
            return await fetchNewData(params);
        } catch (e) {
            const error = {
                status: frameStates.Error,
                errorDetails: e,
            };
            this.setState(() => ({
                status: error.status,
            }));
            return error;
        }
    }

    public render() {
        return this.props.children(this.state);
    }
}

export default GalleryFetcher;
