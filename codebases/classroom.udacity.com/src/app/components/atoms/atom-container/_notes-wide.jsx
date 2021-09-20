import AnalyticsMixin from 'mixins/analytics-mixin';
import InstructorNotes from 'components/common/instructor-notes';
import PropTypes from 'prop-types';
import RouteMixin from 'mixins/route-mixin';
import StateHelper from 'helpers/state-helper';
import { connect } from 'react-redux';
import createReactClass from 'create-react-class';
import styles from './_notes-wide.scss';

const mapStateToProps = (state) => {
  return {
    isForumEnabled: StateHelper.isForumEnabled(state),
  };
};

export const NotesWide = cssModule(
  createReactClass({
    displayName: 'atoms/atom-container/_notes-wide',

    propTypes: {
      atom: PropTypes.object.isRequired,
    },

    contextTypes: {
      root: PropTypes.object,
    },

    mixins: [RouteMixin, AnalyticsMixin],

    render() {
      const { atom } = this.props;

      return (
        <div styleName="notes-wide">
          <InstructorNotes notes={atom.instructor_notes} />
        </div>
      );
    },
  }),
  styles
);

export default connect(mapStateToProps)(NotesWide);
