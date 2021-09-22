import * as React from "react";
import { useEffect, useMemo, useRef, useState } from "react";
import { SwNavigator } from "common/services/swNavigator";
import { Injector } from "common/ioc/Injector";
import SubdomainsApiService, {
    IWebAnalysisSubdomainsExcelRequestParams,
} from "pages/website-analysis/subdomains/WebAnalysisSubdomainsApiService";
import { useLoading } from "custom-hooks/loadingHook";
import { TableNoData } from "components/React/Table/FlexTable/Big/FlexTableStatelessComponents";
import { i18nFilter } from "filters/ngFilters";
import {
    BoxContainer,
    WebsiteAnalysisSubdomainsContainer,
    GreyNotificationContainer,
    PredDropDownLabel,
    FlexRowAlignCenter,
} from "pages/website-analysis/subdomains/StyledComponents";
import { SubdomainsTable } from "pages/website-analysis/subdomains/SubdomainsTable";
import SWReactRootComponent from "decorators/SWReactRootComponent";
import { SWReactIcons } from "@similarweb/icons";
import { ListItemWebsite } from "@similarweb/ui-components/dist/list-item";
import { DomainsChipDownContainer } from "@similarweb/ui-components/dist/dropdown";

export interface IWebAnalysisSubdomainsContainer {
    params: any;
}
export interface IWebAnalysisSubdomainsData {
    Data: IDomainSubdomainsData[];
}
export interface IDomainSubdomainsData {
    Domain: number;
    Share: number;
}

export const GreyNotificationMessage = ({ messageKey = "" }) => (
    <GreyNotificationContainer>
        <SWReactIcons iconName="info" size="xs" />
        <span>{i18nFilter()(messageKey)}</span>
    </GreyNotificationContainer>
);

const WebAnalysisSubdomainsContainer = () => {
    const services = React.useMemo(
        () => ({
            swNavigator: Injector.get<SwNavigator>("swNavigator"),
            i18n: i18nFilter(),
        }),
        [],
    );

    const params = services.swNavigator.getParams() as any;
    const apiParams = services.swNavigator.getApiParams(params);
    const { subdomainsApiService } = React.useMemo(
        () => ({
            subdomainsApiService: new SubdomainsApiService(),
        }),
        [],
    );
    const [siteList, setSiteList] = useState([]);
    const [selectedDomain, setSelectedDomain] = useState<{
        name: string;
        icon: string;
    }>(() => {
        const domainArr = params?.key?.split(",");
        return { name: domainArr[0], icon: "" };
    });
    const [tableData, tableDataOps] = useLoading();
    const isLoading = [useLoading.STATES.INIT, useLoading.STATES.LOADING].includes(tableData.state);
    const renderNoData = () => {
        return (
            <TableNoData icon="no-data" messageTitle={services.i18n("global.nodata.notavilable")} />
        );
    };

    const isCompare = React.useMemo(() => {
        return params?.key?.split(",").length > 1;
    }, [params.key]);

    React.useEffect(() => {
        tableDataOps.load(() => {
            const {
                from,
                to,
                timeGranularity = "Monthly",
                webSource = "Desktop",
                includeSubDomains = params.isWWW === "*",
                isWindow,
                orderBy,
                country,
                key,
            } = apiParams;
            return subdomainsApiService.getDomainsSubdomainsTableData({
                from,
                to,
                timeGranularity,
                webSource,
                includeSubDomains,
                isWindow,
                orderBy,
                country,
                key: selectedDomain.name ? selectedDomain.name : key,
            } as any);
        });
    }, [selectedDomain.name]);

    React.useEffect(() => {
        const domainArr = params?.key?.split(",");
        Promise.all<{ name: string; icon: string }>(
            domainArr.map((siteDomain) =>
                subdomainsApiService
                    .GetWebsiteImage(siteDomain)
                    .then((favicon) => ({ name: siteDomain, icon: favicon.image })),
            ),
        ).then((siteListWithIcons) => {
            setSiteList(siteListWithIcons);
            setSelectedDomain(({ name }) =>
                siteListWithIcons.find((siteDomain) => siteDomain.name === name),
            );
        });
    }, [params?.key]);

    const tableExcelLink = useMemo(() => {
        const {
            from,
            to,
            timeGranularity = "Monthly",
            webSource = "Desktop",
            includeSubDomains = params.isWWW === "*",
            isWindow,
            orderBy,
            country,
            key,
        } = apiParams;
        return subdomainsApiService.getDomainsSubdomainsTableExcelUrl({
            from,
            to,
            timeGranularity,
            webSource,
            includeSubDomains,
            orderBy,
            country,
            keys: key,
            fileName: `Website Analysis Subdomains-(${key})-(from: ${from})-(to: ${to})`,
            isWindow,
        } as IWebAnalysisSubdomainsExcelRequestParams);
    }, [apiParams]);

    useEffect(() => {
        return () => {
            A2DRef.current?.dismiss();
        };
    }, []);
    const A2DRef = useRef(null);

    const getDomainsOptions = () => {
        return siteList.map(({ name, icon }, index) => {
            return <ListItemWebsite key={index} text={name} img={icon} />;
        });
    };

    const onClick = React.useCallback((selectedDomain) => {
        const newSelectedDomain = {
            icon: selectedDomain.img,
            name: selectedDomain.text,
        };
        setSelectedDomain(newSelectedDomain);
    }, []);

    // this function was added because DomainsChipDownContainer component require it, it is not being used/called and can be removed in the future
    const onClose = React.useCallback((selectedDomain) => {
        const newSelectedDomain = {
            icon: selectedDomain.img,
            name: selectedDomain.text,
        };
        setSelectedDomain(newSelectedDomain);
    }, []);

    return (
        <WebsiteAnalysisSubdomainsContainer>
            <BoxContainer data-automation-website-analysis-subdomains={true}>
                {!isLoading && !tableData && renderNoData()}
                {isCompare && (
                    <FlexRowAlignCenter>
                        <PredDropDownLabel>
                            {services.i18n("website.analysis.subdomains.group.pre.dropdown.label")}
                        </PredDropDownLabel>
                        <DomainsChipDownContainer
                            width={200}
                            onClick={onClick}
                            selectedDomainText={selectedDomain.name}
                            selectedDomainIcon={selectedDomain.icon}
                            onCloseItem={onClose}
                            buttonText=""
                        >
                            {getDomainsOptions()}
                        </DomainsChipDownContainer>
                    </FlexRowAlignCenter>
                )}
                <SubdomainsTable
                    isCompare={isCompare}
                    tableData={tableData.data}
                    isLoading={isLoading}
                    tableExcelUrl={tableData ? tableExcelLink : null}
                />
            </BoxContainer>
        </WebsiteAnalysisSubdomainsContainer>
    );
};

export default SWReactRootComponent(
    WebAnalysisSubdomainsContainer,
    "WebAnalysisSubdomainsContainer",
);
