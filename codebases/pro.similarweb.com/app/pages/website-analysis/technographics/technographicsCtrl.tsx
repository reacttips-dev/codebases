/* eslint-disable react/display-name */
import angular from "angular";
import React from "react";
import { swSettings } from "common/services/swSettings";
import { TechnographicsPage } from "./TechnographicsPage";

function technoGraphicsCtrl($scope, swNavigator, chosenSites) {
    this.technographicsRoot = () => (
        <TechnographicsPage {...{ swNavigator, swSettings, chosenSites }} />
    );
}

angular.module("sw.common").controller("technographicsCtrl", technoGraphicsCtrl);
