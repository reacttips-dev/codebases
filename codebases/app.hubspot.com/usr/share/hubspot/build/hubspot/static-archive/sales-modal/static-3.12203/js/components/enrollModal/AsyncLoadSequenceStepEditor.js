'use es6';

import { jsx as _jsx } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import createReactClass from 'create-react-class';
import { Map as ImmutableMap } from 'immutable';
import debounce from 'transmute/debounce';
import visibleInViewport from 'sales-modal/utils/visibleInViewport';
export default (function (StepEditor) {
  var AsyncStepEditor = createReactClass({
    displayName: "AsyncStepEditor",
    propTypes: {
      startingStepOrder: PropTypes.number.isRequired,
      step: PropTypes.instanceOf(ImmutableMap).isRequired,
      stepsContainerNodeClassname: PropTypes.string.isRequired
    },
    getInitialState: function getInitialState() {
      this.handleViewportChange = debounce(300, this.checkIfStepEditorIsInViewport);
      return {
        isReadyToLoad: false
      };
    },
    componentDidMount: function componentDidMount() {
      var _this = this;

      this.setStepsContainerNode();
      this.loadingTimeout = setTimeout(function () {
        _this.setState({
          isReadyToLoad: _this.props.step.get('stepOrder') === _this.props.startingStepOrder
        });

        _this.setEventListeners();

        _this.checkIfStepEditorIsInViewport();
      }, 100);
    },
    componentDidUpdate: function componentDidUpdate() {
      if (!this.stepsContainerNode) {
        this.setStepsContainerNode();
      }
    },
    componentWillUnmount: function componentWillUnmount() {
      this.removeEventListeners();
      this.handleViewportChange.cancel();
      clearTimeout(this.loadingTimeout);
    },
    setStepsContainerNode: function setStepsContainerNode() {
      if (this.stepsContainerNode || this.state.isReadyToLoad) {
        return;
      }

      var stepsContainerNode = document.getElementsByClassName(this.props.stepsContainerNodeClassname)[0];

      if (stepsContainerNode) {
        this.stepsContainerNode = stepsContainerNode;
        this.setEventListeners();
        this.checkIfStepEditorIsInViewport();
      }
    },
    setEventListeners: function setEventListeners() {
      var stepsContainerNode = this.stepsContainerNode;

      if (!stepsContainerNode) {
        return;
      }

      stepsContainerNode.addEventListener('scroll', this.handleViewportChange);
      stepsContainerNode.addEventListener('resize', this.handleViewportChange);
    },
    removeEventListeners: function removeEventListeners() {
      var stepsContainerNode = this.stepsContainerNode;

      if (!stepsContainerNode) {
        return;
      }

      stepsContainerNode.removeEventListener('scroll', this.handleViewportChange);
      stepsContainerNode.removeEventListener('resize', this.handleViewportChange);
    },
    checkIfStepEditorIsInViewport: function checkIfStepEditorIsInViewport() {
      if (this.state.isReadyToLoad || !this.stepsContainerNode) {
        return;
      }

      if (visibleInViewport({
        containerElement: this.stepsContainerNode,
        childElement: this.stepEditor.step
      })) {
        this.setState({
          isReadyToLoad: true
        }, this.removeEventListeners);
      }
    },
    render: function render() {
      var _this2 = this;

      return /*#__PURE__*/_jsx(StepEditor, Object.assign({
        ref: function ref(c) {
          return _this2.stepEditor = c;
        }
      }, this.props, {
        isReadyToLoad: this.state.isReadyToLoad
      }));
    }
  });
  AsyncStepEditor.WrappedStepEditor = StepEditor;
  return AsyncStepEditor;
});