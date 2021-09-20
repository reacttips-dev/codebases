import ClassroomPropTypes from 'components/prop-types';
import styles from './embedded-frame-atom.scss';

export default cssModule(
  class extends React.Component {
    static displayName = 'atoms/embedded-frame-atom';

    static propTypes = {
      atom: ClassroomPropTypes.embeddedFrameAtom.isRequired,
    };

    render() {
      var {
        atom: { external_uri },
      } = this.props;

      return (
        <div className="embedded-frame-atom">
          <iframe
            styleName="iframe"
            title="Embedded course content"
            src={external_uri}
          />
        </div>
      );
    }
  },
  styles
);
