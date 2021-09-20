import PropTypes from 'prop-types';
import TextHelper from 'helpers/text-helper';
import { UreactInstructorNotes } from '@udacity/ureact-atoms';

export default class extends React.Component {
  static displayName = 'common/instructor-notes';

  static propTypes = {
    notes: PropTypes.string,
  };

  static defaultProps = {
    notes: null,
  };

  render() {
    var { notes } = this.props;
    let textDirection = TextHelper.directionClass(notes);

    return (
      <UreactInstructorNotes notes={notes} textDirection={textDirection} />
    );
  }
}
