import angular from "angular";
import { swSettings } from "common/services/swSettings";
import React from "react";
import { SfConvertPage } from "./SfConvertPage";

function sfConvertCtrl($scope, swNavigator) {
    // eslint-disable-next-line react/display-name
    this.sfconvertRoot = () => <SfConvertPage {...{ swNavigator, swSettings }} />;
}

angular.module("sw.common").controller("sfConvertCtrl", sfConvertCtrl);
