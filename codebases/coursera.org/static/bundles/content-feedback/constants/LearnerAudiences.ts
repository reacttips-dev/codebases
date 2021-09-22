import _t from 'i18n!nls/content-feedback';

export type LearnerAudience = {
  id: string;
  label: string;
  eventKey: string;
};

export default function (): { AllLearners: LearnerAudience; Completers: LearnerAudience } {
  return {
    AllLearners: {
      id: 'ALL_LEARNERS',
      get label() {
        return _t('All learners');
      },
      eventKey: 'all_learners',
    },

    Completers: {
      id: 'COMPLETERS',
      get label() {
        return _t('Completers');
      },
      eventKey: 'completers',
    },
  };
}
