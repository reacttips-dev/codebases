import _slicedToArray from "@babel/runtime/helpers/esm/slicedToArray";
import getOrigin from 'unified-navigation-ui/utils/getOrigin';
import sha256 from 'unified-navigation-ui/utils/sha256';
import { text } from 'unified-navigation-ui/utils/NavI18n';
import RESULT_TYPES from './const/RESULT_TYPES';
import QuickActions from './QuickActions';
import { navigationOverrideHandler, resultClickHandler, seeMoreHandler, feedbackHandler } from './new';
import getIconURL from './getIconURL';
import renderLabelText from './renderLabelText';

function mapResult(result, gates) {
  var isAbsoluteResultUrl = /^(https?:)?\/\//.test(result.url);
  var url = isAbsoluteResultUrl || result.resultType === RESULT_TYPES.TRANSCRIPT ? result.url : "" + getOrigin() + result.url;
  var highlightFields = result.highlights ? Object.keys(result.highlights) : null;
  return Object.assign({
    resultId: result.resultId,
    resultType: result.resultType,
    icon: getIconURL(result)
  }, renderLabelText(result, gates), {
    url: url,
    avatarUrl: result.properties.avatarUrl || null,
    highlightFields: highlightFields,
    section: result.section.toLowerCase(),
    mentions: result.properties.occurrences
  });
}

function addResultClickListener(transformedResults, rawResult, mappedResult, correlationId, sectionIds) {
  var isTwoColumn = transformedResults.isTwoColumn;

  if (rawResult.resultType === RESULT_TYPES.ACTIVITY) {
    transformedResults.listeners.push({
      target: "a#" + mappedResult.resultType + "-" + mappedResult.resultId + "-" + mappedResult.section + "-activitylink" + (mappedResult.hero && mappedResult.hero === true ? '-hero' : ''),
      listener: resultClickHandler.bind(null, {
        result: rawResult,
        correlationId: correlationId,
        isTwoColumn: isTwoColumn,
        sectionIds: sectionIds
      })
    });
  } else {
    transformedResults.listeners.push({
      target: "a#" + mappedResult.resultType + "-" + mappedResult.resultId + "-" + mappedResult.section + (mappedResult.hero && mappedResult.hero === true ? '-hero' : ''),
      listener: resultClickHandler.bind(null, {
        result: rawResult,
        correlationId: correlationId,
        isTwoColumn: isTwoColumn,
        sectionIds: sectionIds
      })
    });
  }

  if (isTwoColumn && mappedResult.hero && mappedResult.resultType === RESULT_TYPES.NAVIGATION) {
    transformedResults.listeners.push({
      target: "a#" + mappedResult.resultType + "-" + mappedResult.resultId + "-" + mappedResult.section,
      listener: resultClickHandler.bind(null, {
        result: rawResult,
        correlationId: correlationId,
        isTwoColumn: isTwoColumn,
        sectionIds: sectionIds
      })
    });
  }
}

export function transform(rawResponse, _ref, gates) {
  var generateHero = _ref.generateHero,
      maxResultsPerSection = _ref.maxResultsPerSection;
  var responseParsed = JSON.parse(JSON.stringify(rawResponse)); // Deep copy rawResponse object

  var response = responseParsed && responseParsed.sections ? responseParsed.sections : Object.keys(responseParsed).map(function (section) {
    return Object.assign({}, responseParsed[section], {
      resultType: section,
      sectionName: section
    });
  });
  var correlationId = responseParsed && responseParsed.correlationId || null;
  var transformedResults = {
    queryIdentifier: null,
    resultSections: {},
    totalResults: 0,
    listeners: [],
    isTwoColumn: responseParsed.showTwoColumnLayout
  };
  var sectionIds = response.filter(function (section) {
    return !section.errored;
  }).map(function (section) {
    return section.resultType;
  });
  var allCorrelationIds = response.map(function (section) {
    return section.correlationId;
  });
  transformedResults.queryIdentifier = sha256(Date.now() + allCorrelationIds.join(''));

  if (generateHero && sectionIds.length > 0) {
    var topSection = response[0];

    if (topSection.results && topSection.results.length > 0) {
      var _topSection$results = _slicedToArray(topSection.results, 1),
          topResult = _topSection$results[0];

      topResult.section = topSection.sectionName;
      var hero = mapResult(topResult, gates);
      hero.hero = true;
      addResultClickListener(transformedResults, topResult, hero, correlationId, sectionIds);

      if (Object.prototype.hasOwnProperty.call(QuickActions, topResult.resultType)) {
        var quickActionResults = QuickActions[topResult.resultType];
        hero['quickActions'] = quickActionResults.map(function (action, index) {
          var isTwoColumn = transformedResults.isTwoColumn;
          var mappedAction = {
            text: action.text
          };
          var elementId = "navSearch-hero-quickAction" + index;
          mappedAction['id'] = elementId;
          mappedAction['quickActionType'] = topResult.resultType.toLowerCase() + "_" + action.id;

          if (action.href) {
            mappedAction.href = typeof action.href === 'function' ? action.href(hero) : action.href;
            transformedResults.listeners.push({
              target: "#" + elementId,
              listener: navigationOverrideHandler
            });
            transformedResults.listeners.push({
              target: "#" + elementId,
              listener: resultClickHandler.bind(null, {
                result: topResult,
                correlationId: correlationId,
                isTwoColumn: isTwoColumn,
                sectionIds: sectionIds
              })
            });
          }

          if (action.onClick) {
            transformedResults.listeners.push({
              target: "#" + elementId,
              listener: action.onClick.bind(null, hero)
            });
          }

          return mappedAction;
        });
      }

      transformedResults.hero = hero;
      response[0].results.splice(0, 1);
    }
  }

  response.map(function (section, sectionIndex) {
    var sectionId = section.sectionName.toUpperCase();
    var lowerId = sectionId.toLowerCase();

    if (section.results.length > 0) {
      var hasMore = section.hasMore,
          results = section.results;

      if (maxResultsPerSection && results.length > maxResultsPerSection) {
        results = results.slice(0, maxResultsPerSection);
        hasMore = true;
      }

      results = results.map(function (result) {
        result.section = lowerId;
        var mappedResult = mapResult(result, gates);
        addResultClickListener(transformedResults, result, mappedResult, correlationId, sectionIds);
        return mappedResult;
      });
      transformedResults.totalResults += results.length;
      transformedResults.resultSections[sectionId] = {
        sectionIndex: sectionIndex,
        sectionHeader: text("nav.search.headings." + lowerId, {
          defaultValue: "" + lowerId.charAt(0).toUpperCase() + lowerId.slice(1)
        }),
        results: results,
        correlationId: correlationId,
        hasMore: hasMore
      };
      transformedResults.listeners.push({
        target: ".searchFeedback",
        listener: feedbackHandler
      });

      if (hasMore) {
        transformedResults.listeners.push({
          target: ".navSearch-seeAll[data-section=\"" + sectionId + "\"]",
          listener: seeMoreHandler.bind(null, {
            sectionId: sectionId,
            responseSection: section
          })
        });
      }
    }

    return sectionId;
  });
  return transformedResults;
}
export default transform;