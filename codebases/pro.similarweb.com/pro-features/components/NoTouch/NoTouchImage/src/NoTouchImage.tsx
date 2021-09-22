import * as React from "react";
import ABService from "services/ABService";
import { AssetsService } from "services/AssetsService";
import { StyledNoTouchImage } from "./StyledComponents";

const NoTouchImage = ({ className }: any) => {
    const vwoNewGeneralHookPopup = ABService.getFlag("vwoNewGeneralHookPopup");

    return (
        <StyledNoTouchImage
            className={className}
            src={
                vwoNewGeneralHookPopup
                    ? AssetsService.assetUrl("/images/unlock-modal/default-2.svg")
                    : AssetsService.assetUrl("/images/unlock-modal/default.svg")
            }
            alt=""
        />
    );
};

export default NoTouchImage;
