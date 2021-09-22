import { showErrorToast, showSuccessToast } from "actions/toast_actions";
import { Injector } from "common/ioc/Injector";
import { FaviconButton } from "components/React/FavIcon/FaviconButton";
import { getToastItemComponent } from "components/React/Toast/ToastItem";
import { i18nFilter } from "filters/ngFilters";
import * as _ from "lodash";
import * as React from "react";
import { Component } from "react";
import { connect } from "react-redux";
import { chosenItems } from "common/services/chosenItems";
import { FavoritesService } from "services/favorites/favoritesService";
import { SwTrack } from "services/SwTrack";

interface IFaviconButtonContainerProps {
    showSuccess?: any;
    showError?: any;
    hoverMessages?: any;
}

interface IFaviconButtonContainerState {
    isCurrentPageFavorite?: boolean;
}

class ButtonContainer extends Component<
    IFaviconButtonContainerProps,
    IFaviconButtonContainerState
> {
    private swNavigator = Injector.get<any>("swNavigator");
    private chosenSites = Injector.get<any>("chosenSites");

    constructor(props, context) {
        super(props, context);

        this.state = {
            isCurrentPageFavorite: FavoritesService.isCurrentPageFavorite(),
        };
    }

    public render() {
        return (
            <FaviconButton
                isPageFavorite={this.state.isCurrentPageFavorite}
                hoverMessages={this.props.hoverMessages}
                onFavoriteClick={this.toggleFavoritesPage}
            />
        );
    }

    private toggleFavoritesPage = () => {
        const {
            addSuccessToastMessage,
            addErrorToastMessage,
            removeSuccessToastMessage,
            removeErrorToastMessage,
        } = this.props.hoverMessages;
        const showSuccess = this.props.showSuccess;
        const showError = this.props.showError;
        this.trackFavoritesClickEvent();

        if (!this.state.isCurrentPageFavorite) {
            try {
                FavoritesService.addCurrentPageToFavorites();
                this.setState({ isCurrentPageFavorite: true });
                showSuccess(i18nFilter()(addSuccessToastMessage));
            } catch (error) {
                this.setState({ isCurrentPageFavorite: false });
                showError(i18nFilter()(addErrorToastMessage));
            }
        } else if (this.state.isCurrentPageFavorite) {
            try {
                FavoritesService.removeCurrentPageFromFavorites();
                this.setState({ isCurrentPageFavorite: false });
                showSuccess(i18nFilter()(removeSuccessToastMessage));
            } catch (error) {
                this.setState({ isCurrentPageFavorite: true });
                showError(i18nFilter()(removeErrorToastMessage));
            }
        }
    };

    private buildTrackName = () => {
        const currentPageCategory = this.swNavigator.getPageCategory().toLowerCase();
        const isPageFavorite = FavoritesService.isCurrentPageFavorite();
        const stateParams = this.swNavigator.getParams();
        let ItemType;
        switch (currentPageCategory) {
            case "website":
                return (
                    (!isPageFavorite ? "Add" : "Remove") +
                    " " +
                    (this.chosenSites.get().length > 1 ? "Comparison" : "Site") +
                    "/Website Analysis/" +
                    this.chosenSites.get().join()
                );
            case "apps":
                return (
                    (!isPageFavorite ? "Add" : "Remove") +
                    " " +
                    (chosenItems.length > 1 ? "Comparison" : "Site") +
                    "/App Analysis/" +
                    _.map(chosenItems, "Id").join()
                );
            case "keywords":
                ItemType = "Google Play Keywords";
                break;
            case "keywordanalysis":
                return (
                    (!isPageFavorite ? "Add" : "Remove") +
                    " Site/Keyword Analysis/" +
                    (stateParams.keyword || "")
                );
            case "industryanalysis":
                return (
                    (!isPageFavorite ? "Add" : "Remove") +
                    " Site/Industry Analysis/" +
                    (stateParams.category || "")
                );
        }
    };

    private trackFavoritesClickEvent = () => {
        SwTrack.all.trackEvent("Favorites", "click", this.buildTrackName());
    };
}

const mapDispatchToProps = (dispatch) => {
    return {
        showSuccess: (text?: string, linkText?: string, href?: string) =>
            dispatch(
                showSuccessToast(
                    getToastItemComponent({
                        text,
                        linkText,
                        href,
                    }),
                ),
            ),
        showError: (text?: string) => dispatch(showErrorToast(text)),
    };
};

const mapStateToProps = (store) => {
    // triggers render when page was changed
    const key = store?.routing?.params?.key || "";
    return {
        key,
    };
};

export const FaviconButtonContainer = connect(mapStateToProps, mapDispatchToProps)(ButtonContainer);
