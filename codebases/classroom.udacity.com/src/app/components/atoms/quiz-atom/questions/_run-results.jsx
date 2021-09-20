import PropTypes from 'prop-types';
import styles from './_run-results.scss';

export default cssModule(
  class extends React.Component {
    static displayName = 'atoms/quiz-atom/_run-results';

    static propTypes = {
      stderr: PropTypes.string,
      stdout: PropTypes.string,
      comment: PropTypes.string,
      imageUrls: PropTypes.array,
    };

    static defaultProps = {
      stderr: null,
      stdout: null,
      comment: '',
      imageUrls: [],
    };

    render() {
      var { stdout, stderr, imageUrls, comment } = this.props;

      return (
        <div styleName="run-results">
          {comment ? (
            <div styleName="stdout" role="alert">
              {comment}
            </div>
          ) : null}

          {stderr && !comment ? (
            <div styleName="stderr" role="alert">
              {stderr}
            </div>
          ) : null}

          {stdout && !comment ? (
            <div styleName="stdout" role="alert">
              {stdout}
            </div>
          ) : null}

          {imageUrls && imageUrls.length > 0 && !comment ? (
            <div>
              {_.map(imageUrls, (url, idx) => (
                <img key={idx} src={url} styleName="image" alt="" />
              ))}
            </div>
          ) : null}
        </div>
      );
    }
  },
  styles
);
