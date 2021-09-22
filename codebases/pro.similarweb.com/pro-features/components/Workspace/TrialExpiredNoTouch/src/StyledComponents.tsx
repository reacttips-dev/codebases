import styled from "styled-components";
import NoTouchImage from "../../../NoTouch/NoTouchImage";

export const StyledTrialExpiredNoTouch = styled.div`
    padding: 7vh 20px 14vh;
    color: #2a3e52;
`;
StyledTrialExpiredNoTouch.displayName = "StyledTrialExpiredNoTouch";

export const StyledTrialExpiredNoTouchContainer = styled.div`
    max-width: 1112px;
    width: 100%;
    margin: 0 auto;
`;
StyledTrialExpiredNoTouchContainer.displayName = "StyledTrialExpiredNoTouchContainer";

export const StyledTrialExpiredNoTouchTitle = styled.h1`
    margin: 0 0 16px;
    font-size: 30px;
    font-weight: 700;
    line-height: 1;
    text-align: center;
`;
StyledTrialExpiredNoTouchTitle.displayName = "StyledTrialExpiredNoTouchTitle";

export const StyledTrialExpiredNoTouchSubtitle = styled.p`
    max-width: 600px;
    width: 100%;
    margin: 0 auto 32px;
    font-size: 14px;
    line-height: 1.57;
    text-align: center;
`;
StyledTrialExpiredNoTouchSubtitle.displayName = "StyledTrialExpiredNoTouchSubtitle";

export const StyledTrialExpiredNoTouchButtonWrap = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    .Button {
        max-width: 100%;
        min-width: 200px;
    }
`;
StyledTrialExpiredNoTouchButtonWrap.displayName = "StyledTrialExpiredNoTouchButtonWrap";

export const StyledTrialExpiredNoTouchButtonCaption = styled.p`
    margin: 8px 0 0;
    font-size: 12px;
    font-weight: 500;
    color: #e95f5f;
    line-height: normal;
    text-align: center;
`;
StyledTrialExpiredNoTouchButtonCaption.displayName = "StyledTrialExpiredNoTouchButtonCaption";

export const StyledTrialExpiredNoTouchImage = styled(NoTouchImage)`
    margin: 14px 0 0 30px;
`;
StyledTrialExpiredNoTouchImage.displayName = "StyledTrialExpiredNoTouchImage";

export const StyledTrialExpiredNoTouchLink = styled.button.attrs({
    type: "button",
})`
    display: inline-block;
    margin: 8px 0 0 27px;
    padding: 0;
    background-color: transparent;
    border: 0;
    border-radius: 0;
    color: #7975f2;
    font-size: 14px;
    &:focus {
        outline: none;
    }
`;
StyledTrialExpiredNoTouchLink.displayName = "StyledTrialExpiredNoTouchLink";
