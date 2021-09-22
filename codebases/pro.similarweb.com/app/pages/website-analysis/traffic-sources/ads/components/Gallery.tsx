import React from "react";
import PropTypes from "prop-types";
import TilesContainer from "./Tiles/TilesContainer";
import SimpleFrame, {
    defaultProps as simpleFrameDefaultProps,
} from "components/React/widgetFrames/simpleFrame";
import { CircularLoader } from "../../../../../components/React/CircularLoader/CircularLoader";
import Filters from "./filters/Filters";
import GalleryFetcher from "./GalleryFetcher";
import autobind from "autobind-decorator";
import { allTrackers } from "services/track/track";
import { ChannelType } from "../channels";
import CreativeCounter from "./CreativeCounter";
import { IUnlockConfig } from "../../../../../../.pro-features/components/Modals/src/UnlockModal/unlockModalConfig";

type Site = {
    icon: string;
    name: string;
    displayName: string;
};

export type Filters = {
    selectedSortField: string;
    selectedSortDirection: string;
    selectedCampaign: string;
    selectedSite: string;
    availableChannels: number[];
    selectedChannel: typeof ChannelType;
    source: string;
};

type GalleryProps = {
    isCompare: boolean;
    sites: Site[];
    initialFilters: Filters;
    defaultFilters: Filters;
    onChannelLocked: any;
    onTileUpgrade?: any;
    tileUnlockConfig?: IUnlockConfig;
    lockedChannels: [number];
    params: {
        webSource: string;
        country: number;
        from: string;
        to: string;
        isWindow: boolean;
        isWWW: string;
        key: string;
    };
};

const filtersPropType = PropTypes.shape({
    availableChannels: PropTypes.arrayOf(PropTypes.number),
    lockedChannels: PropTypes.arrayOf(PropTypes.number),
    selectedCampaign: PropTypes.string,
    selectedChannel: PropTypes.number.isRequired,
    selectedSortField: PropTypes.string.isRequired,
    selectedSortDirection: PropTypes.string.isRequired,
    selectedSite: PropTypes.string.isRequired,
});

const NoData = simpleFrameDefaultProps.onNoData;

const GalleryLoader = (
    <div style={{ display: "flex", height: 400, justifyContent: "center", alignItems: "center" }}>
        <CircularLoader
            options={{
                svg: {
                    stroke: "#dedede",
                    strokeWidth: "4",
                    r: 33,
                    cx: "50%",
                    cy: "50%",
                },
                style: {
                    width: 100,
                    height: 100,
                },
            }}
        />
    </div>
);

class Gallery extends React.Component<GalleryProps, Filters> {
    constructor(props) {
        super(props);
        this.state = {
            ...props.initialFilters,
        };
    }

    @autobind
    onSort({ value: selectedSortField }) {
        if (selectedSortField !== this.state.selectedSortField) {
            allTrackers.trackEvent("Drop Down", "click", `Sort/${selectedSortField}`);
            this.setState({
                selectedSortField,
            });
        }
    }

    @autobind
    onSortDirection(selectedSortDirection) {
        if (selectedSortDirection !== this.state.selectedSortDirection) {
            allTrackers.trackEvent("Drop Down", "click", `OrderBy/${selectedSortDirection}`);
            this.setState({
                selectedSortDirection,
            });
        }
    }

    @autobind
    onSiteChanged({ id: selectedSite }) {
        if (selectedSite !== this.state.selectedSite) {
            allTrackers.trackEvent("Drop Down", "click", `site/${selectedSite}`);
            this.setState((prevState) => ({
                ...this.props.initialFilters,
                selectedSite,
            }));
        }
    }

    @autobind
    onCampaignChanged(selectedCampaign) {
        if (selectedCampaign !== this.state.selectedCampaign) {
            allTrackers.trackEvent("Drop Down", "click", `campaign/${selectedCampaign}`);
            this.setState({
                selectedCampaign,
            });
        }
    }

    @autobind
    onChannelChanged(selectedChannel) {
        if (selectedChannel !== this.state.selectedChannel) {
            allTrackers.trackEvent("Drop Down", "click", `channel/${selectedChannel}`);
            this.setState({
                selectedChannel,
                selectedCampaign: this.props.initialFilters.selectedCampaign,
            });
        }
    }

    @autobind
    onChannelLocked(event) {
        this.props.onChannelLocked();
    }

    @autobind
    onReset() {
        allTrackers.trackEvent("Button", "click", `gallery/clear all`);
        this.setState(() => ({
            ...this.props.defaultFilters,
        }));
    }

    onSortDropDownToggle(isOpen) {
        if (isOpen) {
            allTrackers.trackEvent("Drop Down", "open", `Sort`);
        }
    }

    render() {
        const {
            isCompare,
            params,
            sites,
            lockedChannels,
            onTileUpgrade,
            tileUnlockConfig,
        } = this.props;
        const { availableChannels } = this.state;
        const {
            onCampaignChanged,
            onSiteChanged,
            onChannelChanged,
            onSort,
            onSortDirection,
            onSortDropDownToggle,
            onReset,
            onChannelLocked,
        } = this;
        const { selectedChannel } = this.state;
        return (
            <div className="gallery">
                <GalleryFetcher selectedChannel={selectedChannel} {...this.state} {...params}>
                    {({ status, data, campaigns, sources, formats, totalCount }) => (
                        <div>
                            <CreativeCounter channel={selectedChannel} count={totalCount} />
                            <Filters
                                {...this.state}
                                {...{
                                    campaigns,
                                    sources,
                                    formats,
                                    sites,
                                    isCompare,
                                    availableChannels,
                                    lockedChannels,
                                    onCampaignChanged,
                                    onSiteChanged,
                                    onSort,
                                    onSortDirection,
                                    onSortDropDownToggle,
                                    onReset,
                                    onChannelChanged,
                                    onChannelLocked,
                                }}
                            />
                            <SimpleFrame
                                state={status}
                                onLoaded={
                                    <TilesContainer
                                        channel={selectedChannel}
                                        list={data}
                                        totalCount={totalCount}
                                        onTileUpgradeClick={onTileUpgrade}
                                        tileUnlockConfig={tileUnlockConfig}
                                    />
                                }
                                onNoData={<NoData style={{ height: 400 }} />}
                                onLoading={GalleryLoader}
                            />
                        </div>
                    )}
                </GalleryFetcher>
            </div>
        );
    }

    static propTypes = {
        isCompare: PropTypes.bool.isRequired,
        items: PropTypes.arrayOf(
            PropTypes.shape({
                name: PropTypes.string,
                icon: PropTypes.string,
                displayName: PropTypes.string,
            }),
        ),
        params: PropTypes.shape({
            duration: PropTypes.string.isRequired,
            country: PropTypes.string.isRequired,
            webSource: PropTypes.string.isRequired,
            isWWW: PropTypes.string.isRequired,
            from: PropTypes.string.isRequired,
            to: PropTypes.string.isRequired,
            isWindow: PropTypes.bool.isRequired,
            key: PropTypes.string.isRequired,
        }),
        initialFilters: filtersPropType,
        defaultFilters: filtersPropType,
    };
}

export default Gallery;
