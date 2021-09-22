import { colorsPalettes } from "@similarweb/styles";
import I18n from "components/React/Filters/I18n";
import * as React from "react";
import { FlexColumn } from "styled components/StyledFlex/src/StyledFlex";
import styled from "styled-components";
import { ExpandedTableRowLoader } from "../../../../../../.pro-features/components/Loaders/src/ExpandedTableRowLoader/ExpandedTableRowLoader";
import { LoaderLogo } from "../../../../../../.pro-features/components/Loaders/src/LoaderLogo";
import { ExpandedHeader } from "./Header";
import { StyledTab } from "./Tab";

export const LoaderWrapper: any = styled.div`
    display: flex;
    flex-direction: column;
    height: ${(props: any) => props.height + "px"};
    width: 100%;
`;
LoaderWrapper.displayName = "LoaderWrapper";

const LoaderBody: any = styled.div`
    display: flex;
    flex-direction: row;
    height: 100%;
    margin: 0 16px;
    align-items: center;
    justify-content: center;
    animation: fadeIn 0.5s ease-in-out; // override flip animation after loading phase
`;
LoaderBody.displayName = "LoaderBody";

const LoaderContainer = styled.div`
    flex-grow: 0;
    flex-shrink: 0;
    margin-right: 32px;
`;
LoaderContainer.displayName = "LoaderContainer";

const LoaderDesc = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    margin-top: -90px;
    width: 343px;
    text-align: center;
`;
LoaderDesc.displayName = "LoaderDesc";

const LoaderTitle = styled.div`
    font-size: 16px;
    color: ${colorsPalettes.carbon["500"]};
`;
LoaderTitle.displayName = "LoaderTitle";

const LoaderText = styled.div`
    font-size: 14px;
    color: ${colorsPalettes.midnight["200"]};
    margin-top: 20px;
`;
LoaderText.displayName = "LoaderText";

const LoaderStyledTab = styled(StyledTab)`
    height: 46px;
`;
LoaderStyledTab.displayName = "LoaderStyledTab";

const LoaderMetric = styled.svg`
    width: 100%;
`;

LoaderMetric.displayName = "LoaderMetric";

export default class Loader extends React.Component<any, any> {
    public static defaultProps = { loaderTimer: 5000 };

    constructor(props) {
        super(props);
        this.state = {
            loaderComponent: <ExpandedTableRowLoader />,
        };
    }

    public componentDidMount() {
        setTimeout(() => {
            this.setState({ loaderComponent: <ContinueLoader /> });
        }, this.props.loaderTimer);
    }

    public render() {
        const { height, folder, value, timeGranularity, hideDD } = this.props;

        return (
            <LoaderWrapper height={height}>
                <ExpandedHeader
                    folder={folder}
                    value={value}
                    timeGranularity={timeGranularity}
                    hideDD
                />
                {this.state.loaderComponent}
            </LoaderWrapper>
        );
    }
}

const ContinueLoader = () => {
    return (
        <LoaderBody>
            <LoaderDesc>
                <LoaderLogo />
                <LoaderTitle>
                    <I18n>folderanalysis.loading.title</I18n>
                </LoaderTitle>
                <LoaderText>
                    <I18n>folderanalysis.loading.text1</I18n>
                </LoaderText>
            </LoaderDesc>
        </LoaderBody>
    );
};
