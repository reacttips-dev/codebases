import SWReactRootComponent from "decorators/SWReactRootComponent";
import { connect } from "react-redux";
import React, { useEffect, useRef, useState } from "react";
import {
    closeDashboardsModal,
    getCommonProps,
} from "pages/keyword-analysis/common/UtilityFunctions";
import { HeaderComponents } from "./HeaderComponents";
import { MainGraph } from "./MainGraph";
import { MainTable } from "./MainTable";
import { RelatedSearchTermsBanner } from "../RelatedSearchTerms/RelatedSearchTermsBanner/RelatedSearchTermsBanner";
import { RelatedSearchTerms } from "../RelatedSearchTerms/RelatedSearchTerms";

const TABLE_SELECTION_KEY = "keywordAnalysis.total.traffic_KeywordAnalysisOrganic_Table";
const Total = ({ params, sites }) => {
    const commonProps = getCommonProps(params);
    const [visitsBelowThreshold, setVisitsBelowThreshold] = useState<boolean>(false);
    const addToDashBoardModal = useRef<{ result?: Promise<any>; close?: VoidFunction }>();
    useEffect(() => {
        return closeDashboardsModal(addToDashBoardModal);
    }, []);

    return (
        <>
            <HeaderComponents
                addToDashBoardModal={addToDashBoardModal}
                commonProps={commonProps}
                setVisitsBelowThreshold={setVisitsBelowThreshold}
            />
            <br />
            <MainGraph
                commonProps={commonProps}
                addToDashBoardModal={addToDashBoardModal}
                params={params}
                sites={sites}
                visitsBelowThreshold={visitsBelowThreshold}
            />
            <MainTable
                params={params}
                commonProps={commonProps}
                tableSelectionKey={TABLE_SELECTION_KEY}
            />
        </>
    );
};

const mapStateToProps = ({ routing, tableSelection }) => {
    return {
        params: routing.params,
        sites: tableSelection[TABLE_SELECTION_KEY],
    };
};

export const KeywordAnalysisTotalPage = connect(mapStateToProps)(Total);

SWReactRootComponent(KeywordAnalysisTotalPage, "KeywordAnalysisTotalPage");
