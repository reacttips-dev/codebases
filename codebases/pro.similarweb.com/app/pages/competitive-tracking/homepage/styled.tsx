import styled from "styled-components";
import { setFont } from "@similarweb/styles/src/mixins";
import { colorsPalettes } from "@similarweb/styles";
import { SWReactIcons } from "@similarweb/icons";
import { Spinner } from "components/Loaders/src/Spinner";

export const CompetitiveTrackersOverviewContainer = styled.div`
    height: 100%;
`;

export const HeaderContainer = styled.div`
    display: flex;
    justify-content: space-between;
`;

export const VerticalAlignContainer = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
`;

export const Text = styled.span<{
    fontWeight?: number;
    color?: string;
    size?: number;
    margin?: string;
}>`
    ${({ fontWeight = 400, color = colorsPalettes.carbon[500], size = 16 }) =>
        setFont({ $size: size, $color: color, $weight: fontWeight })};
    ${({ margin = "0px" }) => `margin:${margin};`};
`;

export const TextContainer = styled.div`
    display: grid;
    grid-template-columns: repeat(2, auto);
    grid-column-gap: 8px;
`;

export const TrackersContainer = styled.div`
    display: grid;
    grid-template-rows: repeat(3, auto);
    grid-row-gap: 15px;
    margin-top: 21px;
`;

export const CustomIcon = styled(SWReactIcons)`
    height: 22px;
    width: 22px;
    border: 1px solid ${colorsPalettes.carbon[50]};
    padding: 3px;
    border-radius: 6px;
    align-self: center;
    margin: 0px 10px 0px 0px;
`;

export const EditContainer = styled(VerticalAlignContainer)<{ opacity?: number }>`
    ${({ opacity = 0 }) => `opacity:${opacity};`};
`;

export const TrackerContainer = styled.div`
    cursor: pointer;
    background-color: white;
    height: 32px;
    padding: 14px 16px;
    box-shadow: 0px 3px 6px rgba(14, 30, 62, 0.08);
    border-radius: 6px;
    display: flex;
    &:hover {
        padding: 13px 15px;
        border: 1px solid #cbd1d7;
        box-shadow: 0px 3px 6px rgba(14, 30, 62, 0.08);
        border-radius: 6px;
        ${EditContainer} {
            opacity: 1;
            transition: opacity 1000ms;
        }
    }
`;

export const TrackerContentContainer = styled.div`
    display: flex;
    width: 95%;
    justify-content: space-between;
`;

export const PageHeaderContainer = styled.div`
    padding: 24px;
`;

export const Loader = styled(Spinner)`
    width: 24px;
    height: 24px;
`;

export const HomePageImage = styled.div<{ imageUrl: string }>`
    background: url(${({ imageUrl }) => imageUrl}) top no-repeat;
    background-size: 170px 170px;
    width: 170px;
    height: 170px;
`;

export const HomePageImageContainer = styled.div`
    display: flex;
    justify-content: center;
`;

export const TrackersWrapperContainer = styled.div`
    padding-top: 20px;
`;
