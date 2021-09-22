import * as React from "react";
import { BoxContainer, ContentContainer, TitleContainer } from "./styledComponents";
import * as propTypes from "prop-types";
import styled from "styled-components";
import { PixelPlaceholderLoader } from "@similarweb/ui-components/dist/placeholder-loaders";
import { Loader } from "./components";
import { NoData } from "../../../../../../components/NoData/src/NoData";

const LineSeparator = styled.div`
    display: flex;
    height: 3px;
    border-bottom: 1px solid rgba(0, 0, 0, 0.12);
`;

LineSeparator.displayName = "LineSeparator";

const LoaderSeparator = styled.div`
    display: flex;
    transform: translateY(2px);
`;

LoaderSeparator.displayName = "LoaderSeparator";

function Separator({ isLoading }) {
    if (isLoading) {
        return (
            <LoaderSeparator>
                <PixelPlaceholderLoader width={"100%"} height={3} className="px-lod lod-100" />
            </LoaderSeparator>
        );
    } else return <LineSeparator />;
}

function CardContent({ Content, isLoading, data }) {
    if (isLoading) {
        return null;
    } else if (!(data && data.length)) {
        return (
            <NoData
                title={"app.performance.storeintel.overallrank.nodata.title"}
                subtitle={"app.performance.storeintel.overallrank.nodata.subtitle"}
            />
        );
    } else {
        return <Content />;
    }
}

export const StoreIntellegenceCard: any = ({ title, Content, Title, isLoading, data }) => (
    <BoxContainer data-automation-rank={title}>
        <Title />
        <ContentContainer>
            <CardContent Content={Content} isLoading={isLoading} data={data} />
        </ContentContainer>
    </BoxContainer>
);

StoreIntellegenceCard.propTypes = {
    Content: propTypes.func.isRequired,
    Title: propTypes.func.isRequired,
    isLoading: propTypes.bool.isRequired,
    data: propTypes.array,
};

export default StoreIntellegenceCard;
