import * as propTypes from "prop-types";
import * as React from "react";
import { NoData } from "../../../../../../components/NoData/src/NoData";
import { BoxContainer, ContentContainer, TitleContainer } from "./styledComponents";

const hasSomeData = (data) =>
    data && data.length && data.some(({ value }) => value !== null && value !== 0);

function CardContent({ Content, data }) {
    if (!hasSomeData(data)) {
        return <NoData subtitle={false} />;
    } else {
        return <Content />;
    }
}

const UsageCard: any = ({ title, Content, TitleComponent, data }) => (
    <BoxContainer data-automation-usage-metric={title}>
        <TitleContainer>
            <TitleComponent />
        </TitleContainer>
        <ContentContainer>
            <CardContent Content={Content} data={data} />
        </ContentContainer>
    </BoxContainer>
);

UsageCard.propTypes = {
    Content: propTypes.func.isRequired,
    TitleComponent: propTypes.func.isRequired,
    data: propTypes.array,
    title: propTypes.string,
};
export default UsageCard;
