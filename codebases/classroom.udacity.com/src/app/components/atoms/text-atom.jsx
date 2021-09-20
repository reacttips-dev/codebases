import ClassroomPropTypes from 'components/prop-types';
import PropTypes from 'prop-types';
import TextHelper from 'helpers/text-helper';
import { UreactTextAtom } from '@udacity/ureact-atoms';

export default class extends React.Component {
  static displayName = 'atoms/text-atom';

  static propTypes = {
    atom: ClassroomPropTypes.textAtom.isRequired,
    textDirection: PropTypes.string,
  };

  render() {
    var {
      atom: { text },
    } = this.props;

    return (
      <UreactTextAtom
        text={text}
        textDirection={TextHelper.directionClass(text)}
      />
    );
  }
}
