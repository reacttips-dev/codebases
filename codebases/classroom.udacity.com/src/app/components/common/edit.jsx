import CocoHelper from 'helpers/coco-helper';
import { connect } from 'react-redux';
import styles from './edit.scss';

var mapStateToProps = (state) => {
  return CocoHelper.getRouteParams(state);
};

export default connect(mapStateToProps)(
  cssModule(
    class extends React.Component {
      static displayName = 'common/header/_edit';

      render() {
        var {
          locale,
          version,
          nanodegree,
          course,
          part,
          module,
          lesson,
          concept,
        } = this.props;

        var routeParams = {
          locale,
          version,
          nanodegree,
          course,
          part,
          module,
          lesson,
          concept,
        };

        var mochaUrl = CocoHelper.createMochaUrl(routeParams);

        return (
          <a href={mochaUrl} styleName="edit-link" target="_blank">
            edit
          </a>
        );
      }
    },
    styles
  )
);
