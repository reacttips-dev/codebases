import { Insight } from "components/React/commonInsights/components/Insight";
import React from "react";
import { connect } from "react-redux";
import DurationService from "services/DurationService";
import { DefaultFetchService } from "services/fetchService";
import { isIncludeSubDomains } from "UtilitiesAndConstants/UtilityFunctions/common";
import { mapStateToProps } from "components/React/commonInsights/utilities/functions";
import { Loader } from "./Loader";

type IParams = Record<string, number | boolean | string>;

interface IInsightWrapperProps {
    innerLinkKey: string;
    innerLinkPage: string;
    endpoint: string;
    mainTextComponent: (props: { rawData: any }) => JSX.Element;
    customNavigationParams?: IParams | ((rawData: any) => IParams);
    shouldRender?: (rawData: any) => boolean;
    apiParams?: IParams;
    renderComponent?: (props) => JSX.Element;
    onCtaClick: () => void;
}

enum EInsightWrapperState {
    LOADING,
    ERROR,
    SUCCESS,
}

const InsightWrapperInner = ({
    params,
    endpoint,
    apiParams,
    onCtaClick,
    innerLinkKey,
    innerLinkPage,
    customNavigationParams,
    mainTextComponent: MainTextComponent,
    renderComponent: RenderComponent = Insight,
    shouldRender,
}) => {
    const { LOADING, ERROR, SUCCESS } = EInsightWrapperState;
    const [state, setState] = React.useState<EInsightWrapperState>(LOADING);
    const [rawData, setRawData] = React.useState<any>();
    const getData = async () => {
        state !== LOADING && setState(LOADING);
        const { duration, country, webSource, isWWW, key: keys } = params;
        const { from, to, isWindow } = DurationService.getDurationData(duration).forAPI;
        const includeSubDomains = isIncludeSubDomains(isWWW);
        const queryParams = {
            country,
            webSource,
            from,
            to,
            isWindow,
            includeSubDomains,
            keys,
            ...apiParams,
        };
        const dataPromise = DefaultFetchService.getInstance().get(endpoint, queryParams);
        try {
            const results = await dataPromise;
            setRawData(results);
            setState(SUCCESS);
        } catch {
            setState(ERROR);
        }
    };
    React.useEffect(() => {
        getData();
    }, []);

    if (state === ERROR) return <span></span>;
    if (state === LOADING) return <Loader />;

    const render = shouldRender ? shouldRender(rawData) : true;
    return (
        render && (
            <RenderComponent
                innerLinkKey={innerLinkKey}
                mainText={<MainTextComponent rawData={rawData} />}
                rawData={rawData}
                onCtaClick={onCtaClick}
                innerLinkPage={innerLinkPage}
                navigationParams={{
                    ...params,
                    ...(typeof customNavigationParams === "function"
                        ? customNavigationParams(rawData)
                        : customNavigationParams),
                }}
            />
        )
    );
};

export const InsightWrapper: React.FunctionComponent<IInsightWrapperProps> = connect(
    mapStateToProps,
)(InsightWrapperInner);
