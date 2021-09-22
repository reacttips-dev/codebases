import {
    ICategoryShareServices,
    WebSourceType,
} from "pages/industry-analysis/category-share/CategoryShareTypes";
import styled from "styled-components";
import { colorsPalettes } from "@similarweb/styles";
import { setFont } from "@similarweb/styles/src/mixins";

const Container = styled.div`
    padding: 21px 0px;
    margin-bottom: 12px;
    border-bottom: 1px solid ${colorsPalettes.navigation["ICON_BAR_BACKGROUND"]};
    ${setFont({ $color: colorsPalettes.carbon[400] })};
    display: none;
    @media print {
        display: block;
    }
`;

const Title = styled.span`
    font-size: 35px;
    font-weight: bold;
`;

const SubTitle = styled.span`
    font-size: 18px;
    padding-left: 24px;
    font-weight: bold;
`;

const websourceToTextMapping: Record<WebSourceType, string> = {
    ["Total"]: "All Traffic",
    ["Desktop"]: "Desktop Only",
    ["MobileWeb"]: "Mobile Web Only",
};

export const CategoryShareGraphPngHeader = (props: {
    params: any;
    services: ICategoryShareServices;
}) => {
    const { params, services } = props;
    const countryName = services.countryService.getCountryById(params.country).text;
    const durationText = services.durationService.getDurationData(params.duration).forWidget;
    const websourceText = websourceToTextMapping[params.webSource];

    return (
        <Container>
            <Title>{services.translate("categoryShare.graph.title")}</Title>
            <SubTitle>
                {durationText} | {countryName} | {websourceText}
            </SubTitle>
        </Container>
    );
};
