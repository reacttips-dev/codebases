import React, { useCallback, useRef } from "react";
import { SWReactIcons } from "@similarweb/icons";
import { BooleanSearchInputWrap, Input } from "@similarweb/ui-components/dist/boolean-search";
import { DownloadButtonMenu } from "components/React/DownloadButtonMenu/DownloadButtonMenu";
import { ButtonsContainer } from "components/React/TrafficAndEngagementGrowth/styledComponents";
import { useTranslation } from "components/WithTranslation/src/I18n";
import { SearchContainer } from "../styles";
import { TrackWithGuidService } from "services/track/TrackWithGuidService";
import { KEYS, CLICK } from "../constants";
import { SearchTechnologyProps } from "../types";

export function SearchTechnology({ value, onSearch, excelUrl }: SearchTechnologyProps) {
    const ref = useRef<HTMLInputElement>(null);
    const translate = useTranslation();

    const trackExcel = () => TrackWithGuidService.trackWithGuid(KEYS.techExcelDownload, CLICK);

    return (
        <SearchContainer onClick={() => ref.current.focus()}>
            <SWReactIcons size="sm" iconName={"search"} />
            <BooleanSearchInputWrap>
                <Input
                    ref={ref}
                    value={value}
                    onChange={onSearch}
                    placeholder={translate(KEYS.searchPlaceholder)}
                />
            </BooleanSearchInputWrap>
            <ButtonsContainer>
                <a href={excelUrl}>
                    <DownloadButtonMenu Excel downloadUrl={excelUrl} exportFunction={trackExcel} />
                </a>
            </ButtonsContainer>
        </SearchContainer>
    );
}
