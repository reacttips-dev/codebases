import { isDesktop } from '@trello/browser';
import { usesEnglish } from '@trello/locale';

export const isEligibileForExperiment = () => {
  return !isDesktop() && usesEnglish();
};
