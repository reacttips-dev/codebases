import { swSettings } from "common/services/swSettings";
import _ from "lodash";
import dayjs from "dayjs";
import React from "react";
import { connect } from "react-redux";
import { ISegmentsData } from "services/conversion/ConversionSegmentsService";
import DurationService from "services/DurationService";
import CountryService from "../../services/CountryService";
import { allTrackers } from "services/track/track";
import { ConversionHomepageFro } from "../../../.pro-features/pages/conversion/Homepage/src/ConversionHomepageFro";
import { Injector } from "../../../scripts/common/ioc/Injector";
import SWReactRootComponent from "../../decorators/SWReactRootComponent";
import { i18nFilter } from "../../filters/ngFilters";
import ConversionApiService from "../../services/conversion/conversionApiService";
import { ConversionSegmentsUtils } from "./ConversionSegmentsUtils";
import { ConversionHomepage } from "./home/ConversionHomepage";
import { ConversionLeaderboardContainer } from "./home/ConversionLeaderboardContainer";
import { IGroup } from "./home/CustomGroupTiles";
import { AccessDeniedModal } from "components/React/UnlockModalProvider/AccessDeniedModal";

const DEFAULT_DURATION_VALUE = "6m";

interface IConversionHomepageContainerState {
    isLoading: boolean;
    customGroups: Array<any>;
    isUnlockModalOpen: boolean;
}

class ConversionHomepageContainer extends React.PureComponent<
    any,
    IConversionHomepageContainerState
> {
    private swNavigator;
    private conversionApi;
    private swSettings = swSettings;

    constructor(props) {
        super(props);
        this.state = {
            isLoading: true,
            customGroups: [],
            isUnlockModalOpen: false,
        };
        this.conversionApi = new ConversionApiService();
        this.swNavigator = Injector.get("swNavigator") as any;
    }

    public componentDidMount() {
        this.fetchCustomGroupsData(this.props.segments);
    }

    public render() {
        const { isUnlockModalOpen, isLoading, customGroups } = this.state;

        // In case the user has no access to group analysis, we want to render the conversion homepage fro.
        // this includes both the conversionFroHompage, and an optional unlock modal, in case a fro user
        // tries to interact with any of the page tiles
        if (
            _.get(
                this.swSettings.components.ConversionOverview,
                "resources.AvaliabilityMode",
            ).toUpperCase() !== "OPEN"
        ) {
            return (
                <>
                    <AccessDeniedModal
                        closeModal={() => this.toggleUnlockModal(false)}
                        isOpen={isUnlockModalOpen}
                        unlockHook={{
                            location: "Hook PRO/Funnel Analysis/Group Analysis/",
                            modal: "ConversionCategoryOverview",
                            slide: "ConversionCategoryOverview",
                        }}
                    />
                    <ConversionHomepageFro
                        isLoading={isLoading}
                        tilesProps={this.getTilesData()}
                        translate={i18nFilter()}
                        track={allTrackers.trackEvent.bind(allTrackers)}
                    />
                </>
            );
        }
        return (
            <ConversionHomepage
                isLoading={isLoading}
                components={{ ConversionLeaderboardContainer }}
                customGroups={customGroups}
                segments={this.props.segments}
                onCreate={this.onCreate}
                translate={i18nFilter()}
                track={allTrackers.trackEvent.bind(allTrackers)}
            />
        );
    }

    private toggleUnlockModal = (isModalOpen: boolean) => {
        this.setState({ isUnlockModalOpen: isModalOpen });
    };

    private getTilesData = () => {
        const swSegmentsGroups = _.filter(
            this.props.segments.segmentGroups,
            (segmentGroup) => segmentGroup.creationType === "SW",
        );
        const swSegmentsGroupsExt = swSegmentsGroups.map((group) => {
            return {
                ...group,
                segments: group.segments.map((sid) => this.props.segments.segments[sid]),
            };
        });

        const handleSegmentTileClick = () => {
            // Block the user from entering the requested page
            // and open the upsale banner.
            this.toggleUnlockModal(true);
        };

        return swSegmentsGroupsExt.map((segmentGroupExt) => {
            const segmentDomains = segmentGroupExt.segments.map((segment) => {
                return {
                    iconName: segment.domain,
                    iconSrc: this.props.segments.segmentDomains[segment.domain].favicon,
                };
            });
            return {
                title: segmentGroupExt.name,
                iconName: "sheker-gadol",
                sites: segmentDomains,
                onClick: handleSegmentTileClick,
            };
        });
    };

    private fetchCustomGroupsData = async (segmentsData: ISegmentsData) => {
        this.setState({ isLoading: true });
        const to = dayjs(_.get(this.swSettings.current, "resources.SupportedDate"));
        const from = to.clone().subtract(2, "months");
        const duration = DurationService.getDurationApiFor(from, to);

        let response;

        try {
            response = await this.conversionApi.getCustomGroupsData(duration);
        } catch (e) {
            this.setState({ isLoading: false });
        }

        const customGroups = [];
        const customGroupsData = response as IGroup[];
        const mygroups = ConversionSegmentsUtils.getCustomSegmentGroups(segmentsData);

        _.forEach(mygroups, (group) => {
            const myGroup = customGroupsData.find((groupData) => groupData.GroupId === group.id);
            if (myGroup) {
                const countryId = _.get(myGroup, "Country");
                const topSegments = _.get(myGroup, "TopSegments").map((data) => {
                    return {
                        ...data,
                        domainHref: this.swNavigator.href("conversion-customsegement", {
                            sid: data.SegmentId,
                            gid: group.id,
                            country: countryId,
                            duration: "3m",
                            comparedDuration: "12m",
                        }),
                    };
                });

                customGroups.push({
                    ...myGroup,
                    country: {
                        id: countryId,
                        text: CountryService.countriesById[countryId].text,
                    },
                    TopSegments: topSegments,
                    onGroupClick: () => {
                        this.swNavigator.go("conversion-customgroup", {
                            gid: group.id,
                            country: countryId,
                            duration: DEFAULT_DURATION_VALUE,
                        });
                    },
                });
            }
        });
        this.setState({
            isLoading: false,
            customGroups,
        });
    };

    private onCreate = () => {
        this.swNavigator.go("conversion-wizard");
    };
}

const mapStateToProps = ({ conversionModule: { segments } }) => {
    return {
        segments,
    };
};

export default SWReactRootComponent(
    connect(mapStateToProps, null)(ConversionHomepageContainer),
    "ConversionHomepageContainer",
);
