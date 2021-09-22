/**
 * a fork of https://github.com/angular/angular.js/blob/v1.5.x/src/ng/directive/attrs.js
 * <div ng-src="" ng-srcset="" ng-href=""></div>
 *
 * Override URL handling
 */

import angular from "angular";
import { AssetsService } from "services/AssetsService";

const ngAttributeAliasDirectives = {};
const SPECIAL_CHARS_REGEXP = /([\:\-\_]+(.))/g;
const MOZ_HACK_REGEXP = /^moz([A-Z])/;
const PREFIX_REGEXP = /^((?:x|data)[\:\-_])/i;

/**
 * Converts snake_case to camelCase.
 * Also there is special case for Moz prefix starting with upper case letter.
 * @param name Name to normalize
 */
function camelCase(name) {
    return name
        .replace(SPECIAL_CHARS_REGEXP, function (_, separator, letter, offset) {
            return offset ? letter.toUpperCase() : letter;
        })
        .replace(MOZ_HACK_REGEXP, "Moz$1");
}

/**
 * Converts all accepted directives format into proper directive name.
 * @param name Name to normalize
 */
function directiveNormalize(name) {
    return camelCase(name.replace(PREFIX_REGEXP, ""));
}

// ng-src, ng-srcset, ng-href are interpolated
["src", "srcset", "href"].forEach((attrName) => {
    const normalized = directiveNormalize("ng-" + attrName);
    ngAttributeAliasDirectives[normalized] = () => ({
        priority: 100, // original ngSrc is 99
        link: (scope, element, attr) => {
            attr.$observe(normalized, (value) => {
                if (!value) {
                    if (attrName === "href") {
                        attr.$set(attrName, null);
                    }
                    return;
                }

                attr.$set(attrName, AssetsService.normalizeImagePath(value));
            });
        },
    });
});

angular.module("sw.common").directive(ngAttributeAliasDirectives);
