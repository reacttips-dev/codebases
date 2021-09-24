import {MIN_CONTENT_LENGTH} from './constants';
import {getStructureDetails} from './utils';

export const initDefault = (post = null) => [{text: post ? post.rawContent : ''}];

export const initSplitInputs = (state, splitInputs) =>
  splitInputs.map(({prePopulatedText}) => ({
    text: `${prePopulatedText instanceof Function ? prePopulatedText(state) : prePopulatedText} `,
    dirty: false
  }));

export const reset = state => {
  const {splitInputsEnabled, splitInputs} = getStructureDetails(state.selectedStructure);
  return splitInputsEnabled ? initSplitInputs(state, splitInputs) : initDefault();
};

export const isDirty = ({selectedStructure, rawContent: content}) =>
  selectedStructure && getStructureDetails(selectedStructure).splitInputsEnabled
    ? content.some(item => item.dirty)
    : content[0].text.trim().length > 0;

export const updateText = ({selectedStructure, rawContent: content, id}, {index, value}) =>
  getStructureDetails(selectedStructure).splitInputsEnabled && !id
    ? index !== null && content[index].text !== value
      ? [
          ...content.slice(0, index),
          {...content[index], text: value, dirty: true},
          ...content.slice(index + 1, content.length)
        ]
      : content
    : [{text: value}];

export const transformStructure = (state, {structure: newStructure}) => {
  const {selectedStructure: currentStructure} = state;
  const cs = getStructureDetails(currentStructure);
  const ns = getStructureDetails(newStructure);
  if (cs && ns) {
    if (
      (!cs.splitInputsEnabled && ns.splitInputsEnabled) ||
      (cs.splitInputsEnabled && ns.splitInputsEnabled)
    ) {
      // If we are changing from no split inputs to split inputs
      return initSplitInputs(state, ns.splitInputs);
    } else if (cs.splitInputsEnabled && !ns.splitInputsEnabled) {
      // If we are changing from split inputs to no split inputs
      return initDefault();
    } else {
      // No split inputs to no split inputs
      return initDefault();
    }
  } else if (!cs && ns.splitInputsEnabled) {
    return initSplitInputs(state, ns.splitInputs);
  }
};

export const updateSplitInputPlaceholders = state => {
  const {selectedStructure: currentStructure, rawContent: content} = state;
  const {splitInputsEnabled, splitInputs} = getStructureDetails(currentStructure);
  return splitInputsEnabled
    ? content.map((item, index) =>
        !item.dirty && splitInputs[index].prePopulatedText instanceof Function
          ? {...item, text: `${splitInputs[index].prePopulatedText(state)} `}
          : item
      )
    : content;
};

export const joinSplitInputs = (content, delimiter = '') =>
  content
    .filter(item => item.dirty)
    .map(item => item.text)
    .join(delimiter);

export const flatten = state => {
  const {selectedStructure: structure, rawContent: content, id} = state;
  return getStructureDetails(structure).splitInputsEnabled && !id
    ? joinSplitInputs(content, '\n\n')
    : content[0].text;
};

export const passContentCheck = ({selectedStructure: structure}, content) =>
  (getStructureDetails(structure).splitInputsEnabled
    ? joinSplitInputs(content).length
    : content[0].text.length) > MIN_CONTENT_LENGTH;
