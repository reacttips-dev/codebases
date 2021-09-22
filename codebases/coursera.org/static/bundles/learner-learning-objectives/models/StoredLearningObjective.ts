import Categories from 'bundles/learner-learning-objectives/constants/Categories';
import type { LearningObjectiveCategory } from 'bundles/author-learning-objectives/types';

class StoredLearningObjective {
  /**
   * config hash containing:
   * = category
   *   - string value of key for {EnumValue} Category lookup
   *   - {EnumValue} Category
   * = description
   *   - {string} description
   */

  id: string;

  category: { value: LearningObjectiveCategory };

  description: string;

  constructor({
    id,
    category,
    description,
  }: {
    id: string;
    category: string | { value: LearningObjectiveCategory };
    description: string;
  }) {
    this.id = id;
    // @ts-ignore ts-migrate(2322) FIXME: Type 'EnumValue | { value: LearningObjectiveCatego... Remove this comment to see the full error message
    this.category = typeof category === 'string' ? Categories().get(category) : category;
    this.description = description || '';
  }

  getDescription() {
    return this.description;
  }

  toJson() {
    return {
      category: this.category.value,
      description: this.description,
    };
  }
}

export default StoredLearningObjective;
