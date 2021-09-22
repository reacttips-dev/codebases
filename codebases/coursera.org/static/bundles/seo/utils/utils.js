import _ from 'lodash';

function isRegexPathNameMatch(routePath, pathName) {
  return new RegExp(pathName).test(routePath.replace(/^\/|\/$/g, ''));
}

function isPathNameMatch(routePath, pathName) {
  return pathName.replace(/^\/|\/$/g, '') === routePath.replace(/^\/|\/$/g, '');
}

function clearEmptyFields(obj) {
  const currObj = Object.assign({}, obj);
  const keys = Object.keys(currObj);

  keys.forEach((k) => {
    if (!currObj[k]) {
      delete currObj[k];
    }
  });

  return currObj;
}

/*
  We use the fully qualified url (except the protocol) as a look up key to get the 
  seo override rule. For example:
  /courses?language=en and /courses?language=fe, each url will have its own dedicated override
  rule defined by our SEO team. 
*/
function getOverrideRules(routeLocation, rules) {
  const { hostname, pathname, search } = routeLocation;
  const fullUrl = [hostname, pathname, search].join('');

  const regexRule = _.filter(rules.regex, ({ pathName, subDomain }) => isRegexPathNameMatch(fullUrl, pathName));
  const absoluteRule = _.filter(rules.absolute, ({ pathName, subDomain }) => {
    return isPathNameMatch(fullUrl, pathName);
  });
  // aboslute rul rule always take precedence over regex rule
  return regexRule.concat(absoluteRule);
}

function mergeRules(rules) {
  return rules.reduce((currentRule, nextRule) => _.extend(currentRule, nextRule), {});
}

const exported = {
  getOverrideRules,
  mergeRules,
};

export default exported;
export { getOverrideRules, mergeRules, clearEmptyFields };
