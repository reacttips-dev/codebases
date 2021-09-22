import angular from "angular";
/**
 * Created by Eran.Shain on 5/29/2016.
 */
angular.module("sw.common").directive("swItemMarker", function () {
    return <any>{
        scope: {
            color: "@",
        },
        template: `<span class="marker-outer">
                        <span class="marker-inner" ng-style="{ 'background-color': color }"></span>
                   </span>`,
    };
});
