import React, { FunctionComponent } from "react";
import { CombinedSourceSubtitleItemContainer } from "./StyledComponents";
import { Legend } from "../../../../.pro-features/components/Legends/src/LegendBase/Legend";
import { DESKTOP_COLOR, MOBILE_COLOR } from "./tableUtils";
import { LegendCheckbox } from "@similarweb/ui-components/dist/checkbox";
import styled from "styled-components";

interface ICombinedSourceSubtitleItem {
    onMobileToggle: VoidFunction;
    onDesktopToggle: VoidFunction;
    isMobileVisible: boolean;
    isDesktopVisible: boolean;
    toggle: boolean;
}

const StyledLegendCheckbox = styled(LegendCheckbox)`
    margin-right: 6px;
`;

export const CombinedSourceSubtitleItem: FunctionComponent<ICombinedSourceSubtitleItem> = ({
    onDesktopToggle,
    onMobileToggle,
    isMobileVisible,
    isDesktopVisible,
    toggle,
}) => {
    return (
        <CombinedSourceSubtitleItemContainer>
            {toggle ? (
                <>
                    <StyledLegendCheckbox
                        color={DESKTOP_COLOR}
                        label="Desktop"
                        selected={isDesktopVisible}
                        onClick={onDesktopToggle}
                    />
                    <StyledLegendCheckbox
                        color={MOBILE_COLOR}
                        label="Mobile"
                        selected={isMobileVisible}
                        onClick={onMobileToggle}
                    />
                </>
            ) : (
                <>
                    <Legend color={DESKTOP_COLOR} name="Desktop" isMain={false} />
                    <Legend color={MOBILE_COLOR} name="Mobile" isMain={false} />
                </>
            )}
        </CombinedSourceSubtitleItemContainer>
    );
};
