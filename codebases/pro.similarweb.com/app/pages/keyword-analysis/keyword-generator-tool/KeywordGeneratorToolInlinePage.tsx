import {
    setCountry,
    setDuration,
    setSeedKeyword,
    setWebSource,
} from "actions/keywordGeneratorToolActions";
import { Injector } from "common/ioc/Injector";
import { KeywordGeneratorToolResultsTable } from "pages/keyword-analysis/keyword-generator-tool/KeywordGeneratorToolResultsTable";
import * as React from "react";
import { connect } from "react-redux";
import SWReactRootComponent from "../../../decorators/SWReactRootComponent";
import { ETableTabDefaultIndex } from "./types";

const KeywordGeneratorToolInlinePage = (props): JSX.Element => {
    const navigator = Injector.get<any>("swNavigator");
    const {
        params: {
            country: initialCountry,
            duration: initialDuration,
            keyword,
            webSource: initialWebSource,
            selectedWidgetTab = ETableTabDefaultIndex.PhraseMatch,
        },
        country,
        duration,
        seedKeyword,
        webSource,
        setSeedKeyword,
        setDuration,
        setWebSource,
        setCountry,
    } = props;

    React.useEffect(() => {
        if (country !== initialCountry) {
            setCountry(initialCountry);
        }
        if (duration !== initialDuration) {
            setDuration(initialDuration);
        }
        if (webSource !== initialWebSource) {
            setWebSource(initialWebSource);
        }
        if (seedKeyword !== keyword) {
            setSeedKeyword(keyword);
        }
    }, [
        country,
        initialCountry,
        setCountry,
        duration,
        initialDuration,
        setDuration,
        webSource,
        initialWebSource,
        setWebSource,
        seedKeyword,
        keyword,
        setSeedKeyword,
    ]);

    const tableTabDefaultIndex = selectedWidgetTab;
    const onTabSelect = (index): void => {
        navigator.applyUpdateParams({ selectedWidgetTab: index || null });
    };

    return (
        <>
            {country &&
                country === initialCountry &&
                duration &&
                duration === initialDuration &&
                webSource &&
                webSource === initialWebSource &&
                seedKeyword &&
                seedKeyword === keyword && (
                    <>
                        <KeywordGeneratorToolResultsTable
                            notify={true}
                            defaultIndex={tableTabDefaultIndex}
                            onTabSelect={onTabSelect}
                        />
                    </>
                )}
        </>
    );
};

const mapStateToProps = ({
    keywordGeneratorTool: { country, duration, seedKeyword, webSource },
    routing: { params },
}) => {
    return {
        country,
        duration,
        seedKeyword,
        webSource,
        params,
    };
};
const mapDispatchToProps = (dispatch) => {
    return {
        setSeedKeyword: (seedKeyword) => {
            dispatch(setSeedKeyword(seedKeyword?.toLowerCase()));
        },
        setDuration: (duration) => {
            dispatch(setDuration(duration));
        },
        setWebSource: (webSource) => {
            dispatch(setWebSource(webSource));
        },
        setCountry: (country) => {
            dispatch(setCountry(country));
        },
    };
};
const connected = connect(mapStateToProps, mapDispatchToProps)(KeywordGeneratorToolInlinePage);

export default SWReactRootComponent(connected, "KeywordGeneratorToolInlinePage");
