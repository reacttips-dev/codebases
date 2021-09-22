import { LoaderListBulletsWrapper } from "components/Loaders/src/LoaderListItems";
import { GhostLoader } from "components/React/Table/SWReactTableWrapper";
import { i18nFilter } from "filters/ngFilters";
import React from "react";

const i18n = i18nFilter();

const constants = {
    secondLoaderTitle: "common.loaders.long.loader.title",
    secondLoaderSubTitle: "common.loaders.long.loader.subtitle",
    timeBetweenFirstAndSecondLoaders: 5000,
};

export const LongLoaderAfterFewSeconds = (props) => {
    const { timeBetweenFirstAndSecondLoaders, FirstLoader, SecondLoader } = props;
    const [isFirstLoader, setIsFirstLoader] = React.useState(true);
    const setTimeoutRef = setTimeout(
        () => setIsFirstLoader(false),
        timeBetweenFirstAndSecondLoaders,
    );
    React.useEffect(() => () => clearTimeout(setTimeoutRef), []);
    return isFirstLoader ? <FirstLoader /> : <SecondLoader {...props} />;
};

LongLoaderAfterFewSeconds.defaultProps = {
    timeBetweenFirstAndSecondLoaders: constants.timeBetweenFirstAndSecondLoaders,
    FirstLoader: () => <GhostLoader />,
    title: i18n(constants.secondLoaderTitle),
    subtitle: i18n(constants.secondLoaderSubTitle),
    SecondLoader: () => (
        <LoaderListBulletsWrapper
            title={LongLoaderAfterFewSeconds.defaultProps.title}
            subtitle={LongLoaderAfterFewSeconds.defaultProps.subtitle}
        />
    ),
};
