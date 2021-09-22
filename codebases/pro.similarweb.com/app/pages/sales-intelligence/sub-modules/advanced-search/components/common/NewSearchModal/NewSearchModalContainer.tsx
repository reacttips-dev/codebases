import React from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import NewSearchModal from "./NewSearchModal";
import { RootState, ThunkDispatchCommon } from "store/types";
import { PopularSearchTemplate } from "../../../types/common";
import { selectIsNewSearchModalOpened } from "../../../store/selectors";
import { FIND_LEADS_SEARCH_ROUTE } from "pages/sales-intelligence/constants/routes";
import withSWNavigator, {
    WithSWNavigatorProps,
} from "pages/sales-intelligence/hoc/withSWNavigator";
import {
    setSearchTemplateAction,
    toggleNewSearchModalAction,
} from "../../../store/action-creators";

type NewSearchModalContainerProps = ReturnType<typeof mapStateToProps> &
    ReturnType<typeof mapDispatchToProps> &
    WithSWNavigatorProps;

const NewSearchModalContainer = (props: NewSearchModalContainerProps) => {
    const { isOpened, toggleModal, navigator, setSearchTemplate } = props;
    const onNewSearchPage = navigator.current().name === FIND_LEADS_SEARCH_ROUTE;

    const handleSearchTemplateSelection = (template: PopularSearchTemplate) => {
        toggleModal(false);

        if (!onNewSearchPage) {
            navigator.go(FIND_LEADS_SEARCH_ROUTE);

            return setTimeout(() => {
                setSearchTemplate(template);
            }, 0);
        }

        setSearchTemplate(template);
    };

    const handleClose = () => {
        toggleModal(false);
    };

    return (
        <NewSearchModal
            isOpened={isOpened}
            onClose={handleClose}
            onSelect={handleSearchTemplateSelection}
        />
    );
};

const mapStateToProps = (state: RootState) => ({
    isOpened: selectIsNewSearchModalOpened(state),
});

const mapDispatchToProps = (dispatch: ThunkDispatchCommon) => {
    return bindActionCreators(
        {
            toggleModal: toggleNewSearchModalAction,
            setSearchTemplate: setSearchTemplateAction,
        },
        dispatch,
    );
};

export default withSWNavigator(
    connect(mapStateToProps, mapDispatchToProps)(NewSearchModalContainer),
) as React.ComponentType<{}>;
