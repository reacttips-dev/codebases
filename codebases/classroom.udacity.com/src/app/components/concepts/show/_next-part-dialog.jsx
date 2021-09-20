import NextDialog from './_next-dialog';
import NodeHelper from 'helpers/node-helper';
import PropTypes from 'prop-types';
import RouteMixin from 'mixins/route-mixin';
import { __ } from 'services/localization-service';
import createReactClass from 'create-react-class';

export default createReactClass({
  displayName: 'concepts/_next-part-dialog',

  propTypes: {
    isOpen: PropTypes.bool,
    onRequestClose: PropTypes.func,
    part: PropTypes.object.isRequired,
  },

  contextTypes: {
    nanodegree: PropTypes.object,
  },

  mixins: [RouteMixin],

  getDefaultProps() {
    return {
      isOpen: false,
      onRequestClose: _.noop,
    };
  },

  render() {
    var { isOpen, onRequestClose, part, currentLesson, url } = this.props;

    return (
      <NextDialog
        isOpen={isOpen}
        onRequestClose={onRequestClose}
        title={__(NodeHelper.getTitle(currentLesson))}
        bodyTitle={NodeHelper.getTitle(part)}
        button={{
          label: __('Start Next!'),
          url,
        }}
        currentContent={currentLesson}
      />
    );
  },
});
