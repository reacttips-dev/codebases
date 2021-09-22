import _t from 'i18n!nls/skills-common';

type PopoverContentMessages = {
  simpleDescription: string;
  fullDescription: string;
};

export const generatePersonalCopy = (): PopoverContentMessages => ({
  simpleDescription: _t('My score for this skill'),
  fullDescription: _t('Skill scores are calculated based on performance on graded assignments'),
});

export const generateBenchmarkCopy = (): PopoverContentMessages => ({
  simpleDescription: _t('Target score for this skill'),
  fullDescription: _t('Proficiency targets are indicators of skill proficiency determined by your organization'),
});
