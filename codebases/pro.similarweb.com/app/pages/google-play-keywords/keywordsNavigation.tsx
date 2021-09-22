import angular from "angular";
import SubNavBackButton from "components/sub-navigation-bar/SubNavBackButton";
import * as _ from "lodash";
import { GooglePlayKeywordsFilters } from "pages/google-play-keywords/GooglePlayKeywordsFilters";
import { ChosenKeywordComponent } from "pages/keyword-analysis/ChosenKeyword/ChosenKeyword";
import React from "react";
import styled from "styled-components";
import { swSettings } from "../../../scripts/common/services/swSettings";
import PageTitle from "../../components/React/PageTitle/PageTitle";
import { SubNav } from "../../components/sub-navigation-bar/SubNav";
import { chosenItems } from "common/services/chosenItems";

angular
    .module("sw.common")
    .controller("keywordsNavigationCtrl", function ($scope, $filter, swNavigator, categories) {
        function toggleHeader(stateName): void {
            $scope.showHeader = stateName !== "keywords.top" || stateName !== "keywords-analysis";
        }

        function getPageName(): string {
            return swNavigator.current().name.split(".")[1];
        }

        const pageName = getPageName();

        $scope.type = "keywords";
        $scope.showTopBar = true;

        const homeState = swNavigator.current().homeState;
        const homeStateUrl = swNavigator.href(homeState, null);

        const StyledChosenKeywordComponent = styled(ChosenKeywordComponent)`
            margin-left: 20px;
        `;

        $scope.GooglePlayKeywordAnalysisSubNav = (): JSX.Element => (
            <SubNav
                backButton={<SubNavBackButton backStateUrl={homeStateUrl} />}
                topLeftComponent={
                    <>
                        <StyledChosenKeywordComponent
                            keyword={$scope.keyword}
                            backgroundColor="#ffffff"
                        />
                    </>
                }
                bottomRightComponent={<GooglePlayKeywordsFilters categories={categories} />}
                bottomLeftComponent={<PageTitle />}
            />
        );
        $scope.GooglePlayKeywordAnalysisSubNav.displayName = "GooglePlayKeywordAnalysisSubNav";

        const stateParams = swNavigator.getParams();
        $scope.defaults = {
            country: stateParams.country || swSettings.current.defaultParams.country,
            category: stateParams.category || swSettings.current.defaultParams.category,
            duration: stateParams.duration || swSettings.current.defaultParams.duration,
        };

        // Hide navigation on home pages
        if (pageName !== "home") {
            $scope.showNavigation = true;
            toggleHeader(swNavigator.current().name);
        }

        $scope.categories = categories;

        $scope.$on("$stateChangeSuccess", function (evt, toState, toParams, fromState, fromParams) {
            const toPageName = getPageName();
            const swNavigatorParams = swNavigator.getParams();
            // Disable country and duration selectors in app ranking page or demographics
            $scope.hideDurationSelector = toPageName === "analysis";
            $scope.showNavigation = toPageName !== "home";
            $scope.keyword = swNavigatorParams.keyword;

            if (toPageName === "home") {
                chosenItems.$clear(); // Clear chosenItems when moving to homepages
            }
            toggleHeader(toState.name);

            if (toState.name === "keywords-analysis") {
                const from = _.pick(fromParams, ["keyword", "country", "category", "duration"]),
                    to = _.pick(toParams, ["keyword", "country", "category", "duration"]);
                if (!_.isEqual(from, to)) {
                    chosenItems.positionApps = "";
                }
            }
            chosenItems.$clear(); // Clear chosenItems when moving to top keywords
        });
    });
