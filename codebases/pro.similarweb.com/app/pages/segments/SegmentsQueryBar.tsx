import * as React from "react";
import { FunctionComponent } from "react";
import { connect } from "react-redux";
import I18n from "components/WithTranslation/src/I18n";
import { SegmentsQueryBarContainer } from "pages/segments/styleComponents";

export interface ISegmentsQueryBarProps {
    stateConfig: {
        pageTitle: string;
    };
}

export const SegmentsQueryBar: FunctionComponent<ISegmentsQueryBarProps> = ({ stateConfig }) => {
    return (
        <SegmentsQueryBarContainer>
            <I18n>{stateConfig.pageTitle}</I18n>
        </SegmentsQueryBarContainer>
    );
};

function mapStateToProps(store) {
    const {
        routing: { stateConfig },
    } = store;
    return {
        stateConfig,
    };
}

export default connect(mapStateToProps)(SegmentsQueryBar);
