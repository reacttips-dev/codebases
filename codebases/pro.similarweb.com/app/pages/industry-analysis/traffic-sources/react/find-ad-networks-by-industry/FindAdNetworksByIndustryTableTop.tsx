import React, { FunctionComponent } from "react";
import { Container, SearchContainerWrapper, Right } from "./Components/StyledComponents";
import { DownloadExcelContainer } from "pages/workspace/StyledComponent";
import { DownloadButtonMenu } from "components/React/DownloadButtonMenu/DownloadButtonMenu";
import { FlexRow } from "styled components/StyledFlex/src/StyledFlex";
import { SearchInput } from "@similarweb/ui-components/dist/search-input";
import { i18nFilter } from "filters/ngFilters";
import { TrackWithGuidService } from "services/track/TrackWithGuidService";
interface IFindAdNetworksByIndustryTableTopProps {
    searchValue: string;
    excelLink: string;
    downloadExcelPermitted?: boolean;
    onChange: any;
}
export const FindAdNetworksByIndustryTableTop: FunctionComponent<IFindAdNetworksByIndustryTableTopProps> = (
    props,
) => {
    const { searchValue, onChange, downloadExcelPermitted, excelLink } = props;
    const excelDownloadUrl = downloadExcelPermitted ? excelLink : "";
    const excelLinkHref = excelDownloadUrl ? { href: excelDownloadUrl } : {};
    const i18n = i18nFilter();
    const trackExcelDownload = () => {
        TrackWithGuidService.trackWithGuid(
            "find.ad.networks.by.industry.table.excel.download",
            "click",
        );
    };
    return (
        <Container>
            <SearchContainerWrapper>
                <SearchInput
                    defaultValue={searchValue}
                    debounce={500}
                    onChange={onChange}
                    placeholder={i18n("forms.search.placeholder")}
                />
                <Right>
                    <FlexRow>
                        <DownloadExcelContainer {...excelLinkHref}>
                            <DownloadButtonMenu
                                Excel={true}
                                downloadUrl={excelDownloadUrl}
                                exportFunction={trackExcelDownload}
                                excelLocked={!downloadExcelPermitted}
                            />
                        </DownloadExcelContainer>
                    </FlexRow>
                </Right>
            </SearchContainerWrapper>
        </Container>
    );
};
