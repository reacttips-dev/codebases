import NodeHelper from 'helpers/node-helper';
import PropTypes from 'prop-types';
/**
 * This component will just route to the current concept
 */
import RouteMixin from 'mixins/route-mixin';
import SemanticTypes from 'constants/semantic-types';
import createReactClass from 'create-react-class';

export default createReactClass({
  displayName: 'concepts/last-viewed/index',

  propTypes: {
    lesson: PropTypes.object,
    concepts: PropTypes.array,
  },

  contextTypes: {
    router: PropTypes.object,
  },

  mixins: [RouteMixin],

  getDefaultProps() {
    return {
      lesson: {},
      concepts: [],
    };
  },

  componentWillReceiveProps(newProps) {
    var { lesson, concepts } = newProps;
    var lastViewedConcept = NodeHelper.getLastViewedChild(lesson, concepts);
    if (SemanticTypes.isPart(newProps.course)) {
      this.context.router.replace(
        this.paidCourseConceptPath({
          lessonKey: lesson.key,
          conceptKey: lastViewedConcept.key,
        })
      );
    } else {
      this.context.router.replace(
        this.conceptPath({
          lessonKey: lesson.key,
          conceptKey: lastViewedConcept.key,
        })
      );
    }
  },

  render: () => null,
});
