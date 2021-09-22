import { IChosenItem } from "../../../../app/@types/chosenItems";
import { MarketingChannelsDistributionCompare } from "components/React/MarketingChannelsDistribution/MarketingChannelsDistributionCompare";
import { MarketingChannelsDistributionService } from "components/React/MarketingChannelsDistribution/MarketingChannelsDistributionService";
import { MarketingChannelsDistributionSingle } from "components/React/MarketingChannelsDistribution/MarketingChannelsDistributionSingle";
import { EMarketingChannelsType } from "components/React/MarketingChannelsDistribution/types";
import SWReactRootComponent from "decorators/SWReactRootComponent";
import { connect } from "react-redux";
import React from "react";
import { PixelPlaceholderLoader } from "@similarweb/ui-components/dist/placeholder-loaders/src/PlaceholderLoaders";
import { NoData } from "./NoData";

interface IMarketingChannelsDistributionProps {
    chosenItems: IChosenItem[];
    params: { [key: string]: string | boolean };
    marketingChannelsType: EMarketingChannelsType;
}

const validateHandler = (chosenItems, marketingChannelsDistributionData) => {
    if (!marketingChannelsDistributionData) return false;
    const sortedChosenItems = chosenItems.map(({ name }) => name).sort();
    const sortedMarketingChannelsDistributionData = Object.keys(
        marketingChannelsDistributionData,
    ).sort();
    const allItemsHaveData = Object.values(marketingChannelsDistributionData).reduce(
        (result, current) => result && Boolean(current),
        true,
    );
    return (
        sortedChosenItems.join() === sortedMarketingChannelsDistributionData.join() &&
        allItemsHaveData
    );
};

export const MarketingChannelsDistributionInner: React.FunctionComponent<IMarketingChannelsDistributionProps> = (
    props,
) => {
    const { chosenItems, params, marketingChannelsType } = props;
    const isCompare = chosenItems.length > 1;
    const [isLoading, setIsLoading] = React.useState(true);
    const [isError, setIsError] = React.useState(false);
    const [
        marketingChannelsDistributionData,
        setMarketingChannelsDistributionData,
    ] = React.useState(undefined);
    const bootstrap = async () => {
        !isLoading && setIsLoading(true);
        const marketingChannelsDistributionService = new MarketingChannelsDistributionService(
            params,
        );
        try {
            const data = await marketingChannelsDistributionService.getData();
            setMarketingChannelsDistributionData(data.Data);
            isError && setIsError(!isError);
        } catch (e) {
            setIsError(true);
        } finally {
            setIsLoading(false);
        }
    };
    React.useEffect(() => {
        bootstrap();
    }, chosenItems);
    const marketingChannelsDistributionCommonProps = {
        marketingChannelsDistributionData,
        marketingChannelsType,
        chosenItems,
    };
    if (!validateHandler(chosenItems, marketingChannelsDistributionData)) {
        !isError && setIsError(!isError);
    }
    if (isLoading) {
        return <PixelPlaceholderLoader width={"50%"} height={26} />;
    }
    if (isError) {
        return <NoData {...marketingChannelsDistributionCommonProps} />;
    }

    return (
        <>
            {isCompare ? (
                <MarketingChannelsDistributionCompare
                    {...marketingChannelsDistributionCommonProps}
                />
            ) : (
                <MarketingChannelsDistributionSingle
                    {...marketingChannelsDistributionCommonProps}
                />
            )}
        </>
    );
};

const mapStateToProps = (state) => {
    const { routing } = state;
    const { chosenItems, params } = routing;
    return {
        chosenItems,
        params,
    };
};

export const MarketingChannelsDistribution = connect(mapStateToProps)(
    MarketingChannelsDistributionInner,
);

SWReactRootComponent(MarketingChannelsDistribution, "MarketingChannelsDistribution");
