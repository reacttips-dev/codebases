const locale = require('locale');
import { forNamespace } from './forNamespace';
import { AllSubstitutions } from './babble';

const formatCounts = forNamespace('counts');
const { counting } = locale;

export const localizeCount = (
  name: string,
  count: number,
  substitutions: AllSubstitutions = {},
) => {
  return formatCounts([name, counting(count)], {
    count: `${count}`,
    ...substitutions,
  });
};
