import swLog from "@similarweb/sw-log";
import { InfoCardSegments } from "@similarweb/ui-components/dist/info-card";
import { Button } from "@similarweb/ui-components/dist/button";
import { i18nFilter } from "filters/ngFilters";
import dayjs from "dayjs";
import PropTypes from "prop-types";
import { FC, useEffect, useState } from "react";
import React from "react";
import { AssetsService } from "services/AssetsService";
import { DefaultFetchService } from "services/fetchService";
import { SegmentsUtils } from "services/segments/SegmentsUtils";

interface ISegmentTooltipContentProps {
    domain?: string;
    segmentName?: string;
    segmentId?: any;
    onClick?: () => void;
    isOrgSegment?: boolean;
    dateModified?: string;
}

const INFO_CARD_WIDTH = 394;

const fetchService = DefaultFetchService.getInstance();

export const SegmentTooltipContent: FC<ISegmentTooltipContentProps> = (props) => {
    const { segmentName, domain, dateModified, isOrgSegment, onClick, segmentId } = props;
    const [data, setData] = useState(null);
    useEffect(() => {
        const abortController = new AbortController();
        const fetchData = async () => {
            try {
                const response = await fetchService.get(
                    `/api/WebsiteOverview/getheader?key=${domain}`,
                    null,
                    {
                        preventAutoCancellation: false,
                        cancellation: abortController.signal,
                    },
                );
                setData(response[domain]);
            } catch (e) {
                if (e.name === "AbortError") {
                    swLog.info("Fetch aborted on cleanup");
                } else {
                    swLog.warn("SegmentInfoCard fetch data:" + e);
                }
            }
        };
        fetchData();

        return function cleanup() {
            abortController.abort();
        };
    }, [domain]);
    const [rules, setRules] = useState();
    useEffect(() => {
        const abortController = new AbortController();
        const fetchDataRules = async () => {
            try {
                const response: any = await fetchService.get(
                    `/api/userdata/segments/customsegments/${segmentId}`,
                    null,
                    { cancellation: abortController.signal },
                );
                setRules(response.rules);
            } catch (e) {
                if (e.name === "AbortError") {
                    swLog.info("Fetch aborted on cleanup");
                } else {
                    swLog.warn("SegmentInfoCard fetch rules:" + e);
                }
            }
        };
        fetchDataRules();

        return function cleanup() {
            abortController.abort();
        };
    }, [segmentId]);
    const editButton = React.useCallback(
        (isOrgSegment, onClick) => {
            return (
                onClick && (
                    <Button type={"primary"} onClick={onClick}>
                        {isOrgSegment
                            ? i18nFilter()("infotip.segment.button.duplicate")
                            : i18nFilter()("infotip.segment.button.edit")}
                    </Button>
                )
            );
        },
        [onClick],
    );

    if (data) {
        return (
            <InfoCardSegments
                isLoadingData={false}
                imgSrc={data.image || AssetsService.assetUrl("/images/new-no-image.png")}
                icon={data.icon || AssetsService.assetUrl("/images/autocomplete-default.png")}
                segmentName={segmentName}
                websiteName={domain}
                title={i18nFilter()("infotip.segment.title")}
                rulesPrefix={i18nFilter()("infotip.segment.prefix.rules")}
                dateModifiedLabel={i18nFilter()("infotip.segment.date.modified.label")}
                dateModified={dateModified ? dayjs(dateModified).format("MMMM DD YYYY") : "-"}
                rules={SegmentsUtils.getRulesString(rules)}
                Button={editButton(isOrgSegment, onClick)}
                width={INFO_CARD_WIDTH}
            />
        );
    }
    return <InfoCardSegments isLoadingData={true} />;
};

SegmentTooltipContent.propTypes = {
    domain: PropTypes.string,
    segmentName: PropTypes.string,
    segmentId: PropTypes.string,
    onClick: PropTypes.func,
    isOrgSegment: PropTypes.bool,
    dateModified: PropTypes.string,
};
SegmentTooltipContent.displayName = "AppTooltipContent";
