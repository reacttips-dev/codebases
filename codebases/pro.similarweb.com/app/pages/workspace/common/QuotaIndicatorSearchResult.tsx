import { SWReactIcons } from "@similarweb/icons";
import { colorsPalettes } from "@similarweb/styles";
import { PlainTooltip } from "components/React/Tooltip/PlainTooltip/PlainTooltip";
import { i18nFilter } from "filters/ngFilters";
import { useEffect, useState } from "react";
import * as React from "react";
import { DefaultFetchService } from "services/fetchService";
import styled from "styled-components";

export const QuotaContainer = styled.div`
    background-color: ${colorsPalettes.bluegrey[200]};
    border-radius: 6px;
    height: 40px;
    max-width: 270px;
    display: flex;
`;

const TextContainer = styled.div`
    font-size: 14px;
    line-height: 24px;
    color: ${colorsPalettes.carbon[500]};
    margin: 8px 8px 13px 8px;
`;

const InfoIcon = styled(SWReactIcons)`
    width: 16px;
    height: 16px;
`;

const IconContainer = styled.div`
    line-height: 20px;
    margin: 12px 8px 13px 0;
    display: flex;
    align-items: center;
`;

export const QuotaIndicatorSearchResult = ({ workspaceId, workspaceType }) => {
    const i18n = i18nFilter();
    const fetchService = DefaultFetchService.getInstance();
    const key =
        workspaceType === "investors"
            ? "workspace.investors.quota.text"
            : "workspace.sales.quota.text";

    const [quota, setQuota] = useState<any>();

    useEffect(() => {
        async function fetchData() {
            const response = await fetchService.get(
                `api/userdata/workspaces/${workspaceType}/${workspaceId}/quota`,
            );
            setQuota(response);
        }
        fetchData();
    }, [workspaceId, workspaceType]);

    return (
        <QuotaContainer>
            {!quota ? (
                <TextContainer>no data</TextContainer>
            ) : (
                <TextContainer>
                    {i18n(key, { used: `${quota.used}`, total: `${quota.total}` })}
                </TextContainer>
            )}
            <IconContainer>
                <PlainTooltip
                    placement={"bottom"}
                    text={i18nFilter()("workspace.quota.text.tooltip")}
                >
                    <span>
                        <InfoIcon iconName="info" />
                    </span>
                </PlainTooltip>
            </IconContainer>
        </QuotaContainer>
    );
};
