import angular from "angular";
import * as filters from "./ngFilters";

const regObj = {};

// init methods in the form xxxFilter()
Object.keys(filters).forEach((key) => {
    const res = /^(\w*)Filter/.exec(key);
    if (res && res[1]) {
        regObj[res[1]] = filters[key];
    }
});

// register in angular
angular.module("sw.common").filter(regObj);
