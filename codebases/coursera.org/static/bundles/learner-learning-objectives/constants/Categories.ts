import EnumValue from 'bundles/ondemand/models/EnumValue';
import { createEnumMap } from 'bundles/ondemand/utils/EnumUtils';
import _t from 'i18n!nls/learner-learning-objectives';

const Categories = () =>
  createEnumMap(
    new EnumValue('ANALYZE', _t('Analyze')),
    new EnumValue('APPLY', _t('Apply')),
    new EnumValue('CREATE', _t('Create')),
    new EnumValue('EVALUATE', _t('Evaluate')),
    new EnumValue('REMEMBER', _t('Remember')),
    new EnumValue('UNDERSTAND', _t('Understand'))
  );

export default Categories;
