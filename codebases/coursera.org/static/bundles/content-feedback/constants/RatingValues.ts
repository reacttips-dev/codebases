import _t from 'i18n!nls/content-feedback';

export type RatingValue = {
  value: number;
  label: string;
};

export default function (): Array<RatingValue> {
  return [
    {
      value: -1,
      label: _t('All reviews'),
    },

    {
      value: 5,
      label: _t('5 star'),
    },

    {
      value: 4,
      label: _t('4 star'),
    },

    {
      value: 3,
      label: _t('3 star'),
    },

    {
      value: 2,
      label: _t('2 star'),
    },

    {
      value: 1,
      label: _t('1 star'),
    },
  ];
}
