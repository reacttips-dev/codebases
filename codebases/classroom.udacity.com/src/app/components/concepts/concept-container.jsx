import AppError from 'errors/app-error';
import PropTypes from 'prop-types';
import RouteMixin from 'mixins/route-mixin';
import SettingsHelper from 'helpers/settings-helper';
import StateHelper from 'helpers/state-helper';
import { connect } from 'react-redux';
import createReactClass from 'create-react-class';

var mapStateToProps = function (state, ownProps) {
  var {
    params: { conceptKey },
  } = ownProps;
  const concept = StateHelper.getConcept(state, conceptKey);
  if (!concept) {
    throw new AppError('Concept not found');
  }

  return {
    concept,
    atoms: StateHelper.getAtomsByConceptKey(state, conceptKey) || [],
    isStudentHubEnabled: SettingsHelper.State.getHasStudentHub(state),
  };
};

var ConceptContainer = createReactClass({
  displayName: 'concepts/concept-container',

  contextTypes: {
    project: PropTypes.object,
    lab: PropTypes.object,
    router: PropTypes.object,
    root: PropTypes.object,
  },

  childContextTypes: {
    concept: PropTypes.object,
  },

  mixins: [RouteMixin],

  getChildContext() {
    return {
      concept: this.props.concept,
    };
  },

  componentWillMount() {
    this.validateRouteNode(this.props.concept, this.context.root);
  },

  render() {
    return React.cloneElement(this.props.children, {
      nextProject: this.context.project,
      nextLab: this.context.lab,
      ..._.omit(this.props, 'children'),
    });
  },
});

export default connect(mapStateToProps, null)(ConceptContainer);
