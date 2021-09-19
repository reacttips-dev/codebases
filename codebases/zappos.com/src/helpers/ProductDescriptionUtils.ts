/* Removes video links and re-formats product description as a list of items(see cleanseDescription in coley) */
import ExecutionEnvironment from 'exenv';

import { SIZE_CHART_RE } from 'common/regex';
// use different doc based on whether rendering server side or client side.
// Can only use DOM features present in both client document and jsDOM
let doc: Document;
if (ExecutionEnvironment.canUseDOM) {
  doc = document;
} else {
  const { JSDOM } = require('jsdom');
  const jsdom = new JSDOM('<!doctype html><html><body></body></html>');
  const { window } = jsdom;
  doc = window.document;
}

const STRIP_IMG_TAGS = /<img.*?src=".*?".*?>/g;

interface CleanedDescription {
  bulletPoints: string[];
  sizeCharts: string[];
}

export function cleanDescription(text: string) {
  // Replace any image tags prior to constructing the dom so that browser doesn't request images from the server.
  text = text.replace(STRIP_IMG_TAGS, '');

  const description: CleanedDescription = {
    bulletPoints: [],
    sizeCharts: []
  };

  const content = doc.createElement('div');
  content.innerHTML = text;

  let elements = content.querySelectorAll('li.video');
  for (const ele of elements) {
    ele.remove();
  }

  const measurements = content.querySelectorAll('li.measurements');
  for (const ele of measurements) {
    ele.remove();
  }

  elements = content.querySelectorAll('li');

  for (const ele of elements) {
    if (SIZE_CHART_RE.test(ele.innerHTML)) {
      description.sizeCharts.push(ele.innerHTML);
    } else {
      description.bulletPoints.push(ele.innerHTML);
    }
  }

  if (measurements.length > 0) {
    description.bulletPoints.push(measurements[0].innerHTML);
  }

  return description;
}
