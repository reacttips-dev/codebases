
    var nlsModule = require("/codebuild/output/src143855044/src/web/static/nls/custom-labels.js");
    var value = nlsModule.default ? nlsModule.default : {};
    var generateTranslation = require("js/lib/_t").default;
    var translate = generateTranslation(value);
    translate.getLocale = function() { return "__WEBPACK_MULTI_OUTPUT_VALUE__"; };
    module.exports = translate;
  