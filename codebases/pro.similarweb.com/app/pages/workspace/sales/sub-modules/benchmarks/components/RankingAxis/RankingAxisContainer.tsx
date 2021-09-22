import React from "react";
import BenchmarkItemContext from "../../contexts/BenchmarkItemContext";
import useWebsitesAxisService from "../../hooks/useWebsitesAxisService";
import RankingAxis from "./RankingAxis";
import RankingAxisLoader from "../RankingAxisLoader/RankingAxisLoader";

type RankingAxisContainerProps = {
    isActive: boolean;
};

const RankingAxisContainer = (props: RankingAxisContainerProps) => {
    const { isActive } = props;
    const { isLoading } = React.useContext(BenchmarkItemContext);
    const websitesAxisService = useWebsitesAxisService();

    if (isLoading) {
        return <RankingAxisLoader />;
    }

    return <RankingAxis config={websitesAxisService.getConfig()} isActive={isActive} />;
};

export default RankingAxisContainer;
