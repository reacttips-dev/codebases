import React from "react";
import {
    QueryListTypeContainer,
    QueryListTypeStrings,
    QueryListTypeStringsText,
    QueryListTypeTitle,
    QueryRuleDisplayContainer,
    ViewMoreLink,
} from "components/Rule/src/styledComponents";
import { i18nFilter } from "filters/ngFilters";

const queryListTypesConfig = {
    words: {
        name: "Strings",
    },
    exact: {
        name: "Custom Strings",
        stringToDisplay: (str) => `"${str}"`,
    },
    folders: {
        name: "Folders",
    },
    exactURLS: {
        name: "Exact URLS",
    },
};

const queryListTypesOrder = ["words", "exact", "exactURLS", "folders"];

export const QueryRuleDisplay = ({ rule }) => {
    const ruleListTypesToShow = React.useMemo(
        () => queryListTypesOrder.filter((listType) => rule[listType].length > 0),
        [rule],
    );

    return (
        <QueryRuleDisplayContainer>
            {ruleListTypesToShow.map((listType) => (
                <QueryListSection key={listType} listType={listType} listStrings={rule[listType]} />
            ))}
        </QueryRuleDisplayContainer>
    );
};

const QueryListSection = ({ listType, listStrings }) => {
    const queryListConfig = queryListTypesConfig[listType];

    const queryListTypeStringsTextRef = React.useRef(null);
    const viewMoreLinkRef = React.useRef(null);

    const services = React.useMemo(
        () => ({
            i18n: i18nFilter(),
        }),
        [],
    );

    const [hasViewMore, setHasViewMore] = React.useState(false);
    const [isViewMoreExpanded, setIsViewMoreExpanded] = React.useState(false);

    const toggleFullView = React.useCallback(() => {
        setIsViewMoreExpanded((prev) => !prev);
    }, []);

    const listText = React.useMemo(
        () =>
            listStrings
                .map(queryListTypesConfig[listType].stringToDisplay ?? ((str) => str))
                .join(", "),
        [listStrings],
    );

    const textHeights = React.useRef({ fullHeight: undefined, shrinkHeight: undefined });
    const calculateHasViewMore = () => {
        const spanPlaceholder = queryListTypeStringsTextRef.current.childNodes[1];
        spanPlaceholder.style.display = "none";
        const shrinkHeight = queryListTypeStringsTextRef.current.offsetHeight;
        if (
            queryListTypeStringsTextRef.current.scrollHeight >
            (textHeights.current.shrinkHeight ?? shrinkHeight)
        ) {
            spanPlaceholder.style.display = "inline";
            textHeights.current = {
                fullHeight: queryListTypeStringsTextRef.current.scrollHeight, // take scroll height sample after putting placeholder in place
                shrinkHeight: textHeights.current.shrinkHeight ?? shrinkHeight, // in case it was already with view more once, we don't want to truncate the original shrink height
            };
            setHasViewMore(true);
            setIsViewMoreExpanded(false);
        } else {
            setHasViewMore(false);
        }
    };

    React.useLayoutEffect(() => {
        calculateHasViewMore();
    }, [listText]);

    React.useEffect(() => {
        const onWindowResize = () => {
            calculateHasViewMore();
        };
        window.addEventListener("resize", onWindowResize);
        return () => {
            window.removeEventListener("resize", onWindowResize);
        };
    }, []);

    const viewMoreLessText = services.i18n(
        isViewMoreExpanded
            ? "segmentsWizard.complete.viewLess"
            : "segmentsWizard.complete.viewMore",
    );

    return (
        <QueryListTypeContainer>
            <QueryListTypeTitle>{queryListConfig.name}:</QueryListTypeTitle>
            <QueryListTypeStrings>
                <QueryListTypeStringsText
                    ref={queryListTypeStringsTextRef}
                    expanded={isViewMoreExpanded}
                    fullHeight={textHeights.current.fullHeight}
                >
                    <span>{listText}</span>
                    <span className="hiddenPlaceholder">{viewMoreLessText}</span>
                </QueryListTypeStringsText>
                {hasViewMore && (
                    <ViewMoreLink ref={viewMoreLinkRef} onClick={toggleFullView}>
                        {viewMoreLessText}
                    </ViewMoreLink>
                )}
            </QueryListTypeStrings>
        </QueryListTypeContainer>
    );
};
