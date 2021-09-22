import { useRef } from "react";
import { useDidMountEffect } from "custom-hooks/useDidMountEffect";
import { i18nFilter } from "../../../filters/ngFilters";
import {
    BooleanSearchUtilityContainer,
    KeywordGeneratorToolPageTableHeaderStyled,
} from "pages/keyword-analysis/keyword-generator-tool/styledComponents";
import { FlexRow } from "styled components/StyledFlex/src/StyledFlex";
import { DownloadExcelContainer } from "pages/workspace/StyledComponent";
import { DownloadButtonMenu } from "components/React/DownloadButtonMenu/DownloadButtonMenu";
import { TrackWithGuidService } from "services/track/TrackWithGuidService";
import { swSettings } from "common/services/swSettings";
import { BooleanSearchUtilityWrapper } from "pages/website-analysis/traffic-sources/search/BooleanSearchUtilityWrapper";

interface IYoutubeKeywordGeneratorTableTopProps {
    onFilterChange: (items: { ExcludeTerms: string; IncludeTerms: string }) => void;
    excelDownloadUrl: string;
    booleanSearchTerms: string;
    columns: any;
    onClickToggleColumns: (col: number) => void;
    totalRecords: number;
}

export const YoutubeKeywordGeneratorTableTop: React.FC<IYoutubeKeywordGeneratorTableTopProps> = (
    props,
) => {
    const { excelDownloadUrl, totalRecords } = props;
    const excelAllowed = swSettings.current.resources.IsExcelAllowed;
    const downloadTooltipText =
        totalRecords > 10000
            ? i18nFilter()("youtube.keyword.generator.table.excel.download.text")
            : undefined;
    // comment copied from AmazonKeywordGeneratorTableTop.tsx
    // see SIM-35237:
    // Additional fetches were being sent from SWReactTableWrapper.getData(), unnecessarily, as a result
    // of props.onFilterChange being called, in this component, on mounting (with useEffect).
    // With this hook the effect will only run when the dependency actually changes and not on mounting.
    useDidMountEffect(() => {
        const split = props.booleanSearchTerms.split(",");
        const IncludeTerms = split
            .filter((item) => item[0] === "|")
            .map((item) => item.slice(1))
            .join(",");
        const ExcludeTerms = split
            .filter((item) => item[0] === "-")
            .map((item) => item.slice(1))
            .join(",");

        props.onFilterChange({ ExcludeTerms, IncludeTerms });
    }, [props.booleanSearchTerms]);

    const trackExcelDownload = () => {
        TrackWithGuidService.trackWithGuid(
            "youtube.keyword.generator.table.excel.download",
            "click",
        );
    };

    return (
        <>
            <KeywordGeneratorToolPageTableHeaderStyled>
                <BooleanSearchUtilityContainer>
                    <BooleanSearchUtilityWrapper shouldEncodeSearchString={false} />
                </BooleanSearchUtilityContainer>
                <FlexRow>
                    <DownloadExcelContainer href={excelDownloadUrl}>
                        <DownloadButtonMenu
                            Excel={true}
                            downloadUrl={excelDownloadUrl}
                            exportFunction={trackExcelDownload}
                            excelLocked={!excelAllowed}
                            downloadTooltipText={downloadTooltipText}
                        />
                    </DownloadExcelContainer>
                </FlexRow>
            </KeywordGeneratorToolPageTableHeaderStyled>
        </>
    );
};
YoutubeKeywordGeneratorTableTop.defaultProps = {
    booleanSearchTerms: "",
};
